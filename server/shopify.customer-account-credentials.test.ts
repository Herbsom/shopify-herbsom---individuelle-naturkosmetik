import { describe, expect, it } from "vitest";

const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET;
const tokenEndpoint = process.env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_ENDPOINT;

describe("Shopify Customer Account credentials", () => {
  it.skipIf(!clientId || !clientSecret || !tokenEndpoint)(
    "authenticates the confidential client before implementing customer data flows",
    async () => {
      const response = await fetch(tokenEndpoint!, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: "credentials-verification-only",
          redirect_uri:
            "https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/callback",
        }).toString(),
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      expect(body.error).not.toBe("invalid_client");
      expect(response.status).not.toBe(401);
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    },
    15_000
  );
});
