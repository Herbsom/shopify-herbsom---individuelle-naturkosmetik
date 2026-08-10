import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CustomerAccount-Anmeldestart", () => {
  it("nutzt eine same-origin Login-Route mit direkten Browser-Fallbacks", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('const customerAccountLoginPath = "/api/shopify/customer-account/login"');
    expect(source).not.toContain("window.location.href = customerAccountLoginPath");
    expect(source).toContain('target="_blank"');
    expect(source).not.toContain('target="_top"');
    expect(source).toContain('data-testid="customer-account-login-primary"');
    expect(source).not.toContain('data-testid="customer-account-login-direct"');
    expect(source).toContain('data-testid="customer-account-login-new-tab"');
    expect(source).toContain('<a href={customerAccountLoginPath} data-testid="customer-account-login-primary"');
    expect(source).toContain("Shopify-Kundenkonto öffnen");
    expect(source).toContain("Falls nötig: Anmeldung in neuem Tab öffnen");
  });

  it("validiert den einmaligen OAuth-State serverseitig statt über ein Browser-Cookie", () => {
    const source = readFileSync(resolve(process.cwd(), "server/_core/shopifyCustomerAccount.ts"), "utf8");

    expect(source).toContain("await consumeShopifyCustomerAuthState(state)");
    expect(source).toContain('if (!code || !state) throw new Error("Missing customer account OAuth callback parameters")');
    expect(source).not.toContain("CUSTOMER_STATE_COOKIE");
  });
});
