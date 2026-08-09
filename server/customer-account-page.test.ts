import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CustomerAccount-Anmeldestart", () => {
  it("verwendet eine explizite Browser-Weiterleitung und zeigt einen direkten Shopify-Fallback", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('action="/api/shopify/customer-account/login"');
    expect(source).toContain('method="get"');
    expect(source).toContain('target={customerAccountTarget}');
    expect(source).toContain('window.self !== window.top ? "_blank" : "_self"');
    expect(source).toContain('href="https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/login"');
    expect(source).toContain('target="_blank"');
    expect(source).toContain("Shopify-Anmeldung in neuem Tab öffnen");
  });
});
