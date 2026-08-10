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
    expect(source).toContain("Meine Bestellungen verwalten");
    expect(source).toContain("Dein sicheres Konto und deine Daten werden dabei direkt von Shopify verwaltet.");
    expect(source).toContain("Anmeldung und Zahlungsdaten bleiben sicher bei Shopify.");
  });

  it("bietet einen eigenen Herbsom-Einstieg mit Wiederkauf und dynamischer Shopify-Abo-Auswahl", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('data-testid="customer-subscription-section"');
    expect(source).toContain("Direkt nachbestellen");
    expect(source).toContain("Erneut bestellen");
    expect(source).toContain("Als Abo auswählen");
    expect(source).toContain("sellingPlanId: selection.allocation.sellingPlanId");
    expect(source).toContain("Abo-Angebote werden synchronisiert.");
  });

  it("validiert den einmaligen OAuth-State serverseitig statt über ein Browser-Cookie", () => {
    const source = readFileSync(resolve(process.cwd(), "server/_core/shopifyCustomerAccount.ts"), "utf8");

    expect(source).toContain("await consumeShopifyCustomerAuthState(state)");
    expect(source).toContain('if (!code || !state) throw new Error("Missing customer account OAuth callback parameters")');
    expect(source).not.toContain("CUSTOMER_STATE_COOKIE");
  });
});
