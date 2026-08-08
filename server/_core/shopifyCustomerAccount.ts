import { TRPCError } from "@trpc/server";
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Express, Request, Response } from "express";
import {
  consumeShopifyCustomerAuthState,
  createShopifyCustomerAuthState,
  deleteShopifyCustomerSession,
  getShopifyCustomerSession,
  upsertShopifyCustomerSession,
} from "../db";
import { getSessionCookieOptions } from "./cookies";
import { listProducts } from "./shopify";

const CUSTOMER_SESSION_COOKIE = "herbsom_customer_account";
const CUSTOMER_STATE_COOKIE = "herbsom_customer_account_state";
const CUSTOMER_API_VERSION = "2026-07";
const AUTH_STATE_LIFETIME_MS = 10 * 60 * 1000;
const SESSION_REFRESH_BUFFER_MS = 60 * 1000;

type CustomerTokenPayload = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
};

type CustomerApiLineItem = {
  id: string;
  name: string;
  quantity: number;
  variantId: string | null;
  productId: string | null;
  variantTitle: string | null;
  image: { url: string; altText: string | null } | null;
  customAttributes: Array<{ key: string; value: string }>;
};

type CustomerApiOrder = {
  id: string;
  name: string;
  processedAt: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: { nodes: CustomerApiLineItem[] };
};

type CustomerApiResponse = {
  customer: {
    id: string;
    displayName: string;
    orders: { nodes: CustomerApiOrder[] };
  };
};

export type CustomerDashboardItem = {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string | null;
  imageAlt: string | null;
  detailPath: string | null;
  reviewProductId: string | null;
  reorder:
    | { kind: "variant"; variantId: string; quantity: number }
    | { kind: "configuration"; id: string; name: string; description?: string; quantity: number }
    | null;
};

export type CustomerDashboard = {
  connected: boolean;
  customer?: { id: string; displayName: string };
  orders: Array<{
    id: string;
    name: string;
    processedAt: string;
    fulfillmentStatus: string;
    totalPrice: { amount: string; currencyCode: string };
    items: CustomerDashboardItem[];
  }>;
};

function getRequiredConfig() {
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET;
  const authorizationEndpoint = process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZATION_ENDPOINT;
  const tokenEndpoint = process.env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_ENDPOINT;
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;

  if (!clientId || !clientSecret || !authorizationEndpoint || !tokenEndpoint || !storeDomain) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Shopify Customer Account API ist nicht vollständig konfiguriert.",
    });
  }

  return { clientId, clientSecret, authorizationEndpoint, tokenEndpoint, storeDomain };
}

function customerApiEndpoint(storeDomain: string) {
  return `https://${storeDomain}/customer/api/${CUSTOMER_API_VERSION}/graphql`;
}

function requestOrigin(req: Request) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto.split(",")[0].trim() : req.protocol;
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = typeof forwardedHost === "string" ? forwardedHost.split(",")[0].trim() : req.get("host");
  if (!host) throw new Error("Host header is required");
  return `${protocol}://${host}`;
}

function callbackUrl(req: Request) {
  return process.env.SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL?.trim() || `${requestOrigin(req)}/api/shopify/customer-account/callback`;
}

function encryptionKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return createHash("sha256").update(secret).digest();
}

function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map(part => part.toString("base64url")).join(".");
}

function decrypt(payload: string) {
  const [ivPart, tagPart, ciphertextPart] = payload.split(".");
  if (!ivPart || !tagPart || !ciphertextPart) throw new Error("Invalid encrypted payload");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivPart, "base64url"));
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextPart, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function signOpaqueId(id: string) {
  const signature = createHmac("sha256", encryptionKey()).update(id).digest("base64url");
  return `${id}.${signature}`;
}

function verifyOpaqueId(value: string | undefined) {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;
  const id = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const expected = createHmac("sha256", encryptionKey()).update(id).digest("base64url");
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length) return null;
  return timingSafeEqual(receivedBuffer, expectedBuffer) ? id : null;
}

function readCookie(req: Request, key: string) {
  const header = req.headers.cookie;
  if (!header) return undefined;
  const match = header.split(";").map(part => part.trim()).find(part => part.startsWith(`${key}=`));
  return match ? decodeURIComponent(match.slice(key.length + 1)) : undefined;
}

function sessionCookieOptions(req: Request) {
  return { ...getSessionCookieOptions(req), sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 30 * 1000 };
}

function stateCookieOptions(req: Request) {
  return { ...getSessionCookieOptions(req), sameSite: "lax" as const, maxAge: AUTH_STATE_LIFETIME_MS };
}

function buildCodeChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function buildCustomerAuthorizationUrl(input: {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}) {
  const url = new URL(input.authorizationEndpoint);
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("scope", "openid email customer-account-api:full");
  url.searchParams.set("state", input.state);
  url.searchParams.set("code_challenge", input.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

async function exchangeToken(input: {
  grantType: "authorization_code" | "refresh_token";
  code?: string;
  refreshToken?: string;
  verifier?: string;
  redirectUri?: string;
}) {
  const { clientId, clientSecret, tokenEndpoint } = getRequiredConfig();
  const body = new URLSearchParams({ grant_type: input.grantType, client_id: clientId });
  if (input.code) body.set("code", input.code);
  if (input.refreshToken) body.set("refresh_token", input.refreshToken);
  if (input.verifier) body.set("code_verifier", input.verifier);
  if (input.redirectUri) body.set("redirect_uri", input.redirectUri);

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  const data = (await response.json().catch(() => ({}))) as CustomerTokenPayload & { error?: string };
  if (!response.ok || !data.access_token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Die Shopify-Kundenkonto-Anmeldung konnte nicht abgeschlossen werden." });
  }
  return data;
}

async function getCustomerAccessToken(req: Request, res: Response) {
  const signedSessionId = readCookie(req, CUSTOMER_SESSION_COOKIE);
  const sessionId = verifyOpaqueId(signedSessionId);
  if (!sessionId) return null;
  const session = await getShopifyCustomerSession(sessionId);
  if (!session) return null;

  const accessToken = decrypt(session.encryptedAccessToken);
  const refreshToken = session.encryptedRefreshToken ? decrypt(session.encryptedRefreshToken) : undefined;
  const isExpiring = Boolean(session.expiresAt && session.expiresAt.getTime() <= Date.now() + SESSION_REFRESH_BUFFER_MS);
  if (!isExpiring || !refreshToken) {
    return { sessionId, accessToken, refreshToken, expiresAt: session.expiresAt };
  }

  try {
    const refreshed = await exchangeToken({ grantType: "refresh_token", refreshToken });
    await upsertShopifyCustomerSession({
      id: sessionId,
      customerId: session.customerId,
      encryptedAccessToken: encrypt(refreshed.access_token),
      encryptedRefreshToken: encrypt(refreshed.refresh_token ?? refreshToken),
      expiresAt: refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000) : null,
    });
    return {
      sessionId,
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? refreshToken,
      expiresAt: refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000) : null,
    };
  } catch {
    await deleteShopifyCustomerSession(sessionId);
    res.clearCookie(CUSTOMER_SESSION_COOKIE, sessionCookieOptions(req));
    return null;
  }
}

function detailPathForHandle(handle: string | undefined) {
  const paths: Record<string, string> = {
    reinigungsgel: "/product/cleaner",
    "mini-reiniger": "/product/cleaner",
    "reinigungs-milch": "/product/cleaner-milk",
    "aha-pha-peeling": "/product/peeling-aha",
    "bha-azelainsaure-peeling": "/product/peeling",
    "sonnenschutzfluid-spf-50": "/product/sunscreen",
    "individuelle-serum-creme": "/product/serum",
    "erstelle-deine-creme": "/product/creme",
    "gua-sha-jade-stein": "/product/gua-sha-jade",
  };
  return handle ? paths[handle] ?? null : null;
}

function reviewProductIdForHandle(handle: string | undefined) {
  const ids: Record<string, string> = {
    reinigungsgel: "cleaner-gel",
    "mini-reiniger": "cleaner-gel",
    "reinigungs-milch": "cleaner-milk",
    "aha-pha-peeling": "peeling-aha",
    "bha-azelainsaure-peeling": "peeling-bha",
    "sonnenschutzfluid-spf-50": "sunscreen",
    "individuelle-serum-creme": "serum",
    "erstelle-deine-creme": "creme",
  };
  return handle ? ids[handle] ?? null : null;
}

async function fetchCustomerData(accessToken: string) {
  const { storeDomain } = getRequiredConfig();
  const response = await fetch(customerApiEndpoint(storeDomain), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: accessToken },
    body: JSON.stringify({
      query: `
        query CustomerDashboard {
          customer {
            id
            displayName
            orders(first: 50, reverse: true) {
              nodes {
                id
                name
                processedAt
                fulfillmentStatus
                totalPrice { amount currencyCode }
                lineItems(first: 100) {
                  nodes {
                    id
                    name
                    quantity
                    variantId
                    productId
                    variantTitle
                    image { url altText }
                    customAttributes { key value }
                  }
                }
              }
            }
          }
        }
      `,
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    data?: CustomerApiResponse;
    errors?: Array<{ message: string }>;
  };
  if (!response.ok || payload.errors?.length || !payload.data?.customer) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Die Shopify-Bestellhistorie ist nicht verfügbar. Bitte prüfe die Customer-Account-Berechtigungen.",
    });
  }
  return payload.data.customer;
}

export async function getCustomerDashboard(req: Request, res: Response): Promise<CustomerDashboard> {
  const session = await getCustomerAccessToken(req, res);
  if (!session) return { connected: false, orders: [] };

  const [customer, products] = await Promise.all([fetchCustomerData(session.accessToken), listProducts({ first: 100 })]);
  const variants = new Map(
    products.flatMap(product => product.variants.map(variant => [variant.id, { product, variant }] as const))
  );

  await upsertShopifyCustomerSession({
    id: session.sessionId,
    customerId: customer.id,
    encryptedAccessToken: encrypt(session.accessToken),
    encryptedRefreshToken: session.refreshToken ? encrypt(session.refreshToken) : null,
    expiresAt: session.expiresAt,
  });

  return {
    connected: true,
    customer: { id: customer.id, displayName: customer.displayName },
    orders: customer.orders.nodes.map(order => ({
      id: order.id,
      name: order.name,
      processedAt: order.processedAt,
      fulfillmentStatus: order.fulfillmentStatus,
      totalPrice: order.totalPrice,
      items: order.lineItems.nodes.map(line => {
        const matchingVariant = line.variantId ? variants.get(line.variantId) : undefined;
        const handle = matchingVariant?.product.handle;
        const configurationId = line.customAttributes.find(attribute => attribute.key === "_Herbsom-Konfiguration-ID")?.value;
        const ingredients = line.customAttributes.find(attribute => attribute.key === "Wirkstoffe")?.value;
        const reorder = configurationId
          ? {
              kind: "configuration" as const,
              id: configurationId,
              name: line.name,
              description: ingredients ? `Wirkstoffe: ${ingredients}` : undefined,
              quantity: line.quantity,
            }
          : matchingVariant?.variant.availableForSale && line.variantId
            ? { kind: "variant" as const, variantId: line.variantId, quantity: line.quantity }
            : null;

        return {
          id: line.id,
          name: line.name,
          quantity: line.quantity,
          imageUrl: line.image?.url ?? matchingVariant?.product.images[0]?.url ?? null,
          imageAlt: line.image?.altText ?? matchingVariant?.product.images[0]?.altText ?? null,
          detailPath: detailPathForHandle(handle),
          reviewProductId: reviewProductIdForHandle(handle),
          reorder,
        };
      }),
    })),
  };
}

export async function getVerifiedPurchasedProductIds(req: Request, res: Response) {
  const dashboard = await getCustomerDashboard(req, res);
  if (!dashboard.connected || !dashboard.customer) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Bitte melde dich zuerst mit deinem Shopify-Kundenkonto an." });
  }
  return {
    customer: dashboard.customer,
    productIds: new Set(
      dashboard.orders.flatMap(order => order.items.map(item => item.reviewProductId).filter((id): id is string => Boolean(id)))
    ),
  };
}

export function registerShopifyCustomerAccountRoutes(app: Express) {
  app.get("/api/shopify/customer-account/login", async (req, res) => {
    try {
      const { authorizationEndpoint, clientId } = getRequiredConfig();
      const state = randomBytes(32).toString("base64url");
      const verifier = randomBytes(64).toString("base64url");
      await createShopifyCustomerAuthState({
        state,
        encryptedVerifier: encrypt(verifier),
        expiresAt: new Date(Date.now() + AUTH_STATE_LIFETIME_MS),
      });
      res.cookie(CUSTOMER_STATE_COOKIE, signOpaqueId(state), stateCookieOptions(req));
      res.redirect(302, buildCustomerAuthorizationUrl({
        authorizationEndpoint,
        clientId,
        redirectUri: callbackUrl(req),
        state,
        codeChallenge: buildCodeChallenge(verifier),
      }));
    } catch (error) {
      console.error("[Shopify Customer Account] Login initialization failed", error);
      res.redirect(302, "/account?shopify-error=login");
    }
  });

  app.get("/api/shopify/customer-account/callback", async (req, res) => {
    const code = typeof req.query.code === "string" ? req.query.code : undefined;
    const state = typeof req.query.state === "string" ? req.query.state : undefined;
    try {
      const signedState = readCookie(req, CUSTOMER_STATE_COOKIE);
      if (!code || !state || verifyOpaqueId(signedState) !== state) {
        throw new Error("Invalid customer account OAuth state");
      }
      const storedState = await consumeShopifyCustomerAuthState(state);
      if (!storedState) throw new Error("Expired customer account OAuth state");
      const token = await exchangeToken({
        grantType: "authorization_code",
        code,
        verifier: decrypt(storedState.encryptedVerifier),
        redirectUri: callbackUrl(req),
      });
      const sessionId = randomBytes(32).toString("base64url");
      await upsertShopifyCustomerSession({
        id: sessionId,
        encryptedAccessToken: encrypt(token.access_token),
        encryptedRefreshToken: token.refresh_token ? encrypt(token.refresh_token) : null,
        expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null,
      });
      res.clearCookie(CUSTOMER_STATE_COOKIE, stateCookieOptions(req));
      res.cookie(CUSTOMER_SESSION_COOKIE, signOpaqueId(sessionId), sessionCookieOptions(req));
      res.redirect(302, "/account?shopify-connected=1");
    } catch (error) {
      console.error("[Shopify Customer Account] Callback failed", error);
      res.clearCookie(CUSTOMER_STATE_COOKIE, stateCookieOptions(req));
      res.redirect(302, "/account?shopify-error=callback");
    }
  });

  app.post("/api/shopify/customer-account/logout", async (req, res) => {
    const sessionId = verifyOpaqueId(readCookie(req, CUSTOMER_SESSION_COOKIE));
    if (sessionId) await deleteShopifyCustomerSession(sessionId);
    res.clearCookie(CUSTOMER_SESSION_COOKIE, sessionCookieOptions(req));
    res.status(204).end();
  });
}
