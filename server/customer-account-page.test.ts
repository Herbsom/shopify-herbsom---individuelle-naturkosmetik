import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CustomerAccount-Anmeldestart", () => {
  it("zeigt zwei native Shopify-Anmeldelinks für oberstes Browserfenster und neuen Tab", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('href="https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/login"');
    expect(source).toContain('target="_blank"');
    expect(source).toContain('target="_top"');
    expect(source).toContain('data-testid="customer-account-login-top"');
    expect(source).toContain('data-testid="customer-account-login-new-tab"');
    expect(source).toContain("Shopify-Kundenkonto öffnen");
    expect(source).toContain("Anmeldung in neuem Tab öffnen");
  });
});
