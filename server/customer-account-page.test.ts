import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CustomerAccount-Anmeldestart", () => {
  it("nutzt die direkte native Shopify-Kundenkonto-Adresse ohne eigenen OAuth-Callback", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('const nativeShopifyAccountUrl = "https://account.herbsom.de"');
    expect(source).not.toContain('"/api/shopify/customer-account/login"');
    expect(source).toContain('target="_blank"');
    expect(source).not.toContain('target="_top"');
    expect(source).toContain('data-testid="customer-account-login-primary"');
    expect(source).toContain('<a href={nativeShopifyAccountUrl} target="_blank" rel="noopener noreferrer" data-testid="customer-account-login-primary"');
    expect(source).toContain("Zum Shopify-Kundenkonto");
    expect(source).toContain("Das Kundenkonto öffnet sich in einem neuen Tab und wird direkt von Shopify verwaltet.");
    expect(source).toContain("Die erweiterte Kontoansicht auf Herbsom wird nach Freigabe der Customer Account API wieder aktiviert.");
  });

  it("validiert den einmaligen OAuth-State serverseitig statt über ein Browser-Cookie", () => {
    const source = readFileSync(resolve(process.cwd(), "server/_core/shopifyCustomerAccount.ts"), "utf8");

    expect(source).toContain("await consumeShopifyCustomerAuthState(state)");
    expect(source).toContain('if (!code || !state) throw new Error("Missing customer account OAuth callback parameters")');
    expect(source).not.toContain("CUSTOMER_STATE_COOKIE");
  });
});
