import { expect, it } from "vitest";

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
const publicToken = process.env.VITE_SHOPIFY_ACCOUNT_PUBLIC_STOREFRONT_TOKEN;

it.skipIf(!storeDomain || !publicToken)("validiert den öffentlichen Shopify-Storefront-Token für die eingebettete Account-Komponente", async () => {
  const response = await fetch(`https://${storeDomain}/api/2025-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": publicToken!,
    },
    body: JSON.stringify({ query: "query AccountComponentTokenProbe { shop { name } }" }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    data?: { shop?: { name?: string } };
    errors?: Array<{ message?: string }>;
  };

  expect(response.ok).toBe(true);
  expect(payload.errors ?? []).toHaveLength(0);
  expect(payload.data?.shop?.name).toBeTruthy();
}, 15_000);
