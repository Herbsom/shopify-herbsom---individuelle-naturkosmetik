import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CustomerAccount-Anmeldestart", () => {
  it("zeigt zwei native Shopify-Anmeldelinks für neuen und selben Browser-Tab", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('href="https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/login"');
    expect(source).toContain('target="_blank"');
    expect(source).toContain("Shopify-Kundenkonto öffnen");
    expect(source).toContain("Anmeldung im selben Tab öffnen");
  });
});
