import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CustomerAccount-Anmeldestart", () => {
  it("verwendet eine explizite Browser-Weiterleitung und zeigt einen direkten Shopify-Fallback", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('action="/api/shopify/customer-account/login"');
    expect(source).toContain('method="get"');
    expect(source).toContain('href="https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/login"');
    expect(source).toContain("Shopify-Anmeldung direkt starten");
  });
});
