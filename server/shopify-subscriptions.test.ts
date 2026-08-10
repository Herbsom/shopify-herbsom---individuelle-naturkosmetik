import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { listSubscriptionProducts } from "./_core/shopify";

describe("Shopify Subscriptions im Herbsom-Kundenportal", () => {
  it("isoliert Selling-Plan-Abfragen vom regulären Shopify-Katalog", () => {
    const source = readFileSync(resolve(process.cwd(), "server/_core/shopify.ts"), "utf8");

    expect(source).toContain("const SUBSCRIPTION_PRODUCT_FRAGMENT");
    expect(source).toContain("sellingPlanAllocations(first: 10)");
    expect(source).toContain("export async function listSubscriptionProducts");
    expect(source).toContain("kept out of PRODUCT_FRAGMENT");
    expect(source).toContain("getShopifySubscriptionsStorefrontToken");
  });

  it("übernimmt die Shopify-Selling-Plan-ID als Abozeile in den Checkout", () => {
    const accountSource = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");
    const cartSource = readFileSync(resolve(process.cwd(), "client/src/contexts/CartContext.tsx"), "utf8");

    expect(accountSource).toContain("commerce.subscriptions.list.useQuery");
    expect(accountSource).toContain("sellingPlanId: selection.allocation.sellingPlanId");
    expect(cartSource).toContain("sellingPlanId: input.sellingPlanId");
  });

  it.skipIf(process.env.RUN_SHOPIFY_SUBSCRIPTIONS_LIVE_TEST !== "true")("validiert den separaten Shopify-Abo-Token mit einer leichten Selling-Plan-Abfrage", async () => {
    const products = await listSubscriptionProducts(1);
    expect(Array.isArray(products)).toBe(true);
  }, 20_000);
});
