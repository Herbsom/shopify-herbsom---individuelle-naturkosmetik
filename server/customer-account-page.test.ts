import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CustomerAccount-Anmeldestart", () => {
  it("nutzt den bestätigten Herbsom-Shopify-OAuth-Einstieg für das eigene Kundenportal", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).not.toContain('target="_top"');
    expect(source).toContain('data-testid="customer-account-login-primary"');
    expect(source).toContain("HerbsomEmailLogin");
    expect(source).toContain('data-testid="customer-account-email-login"');
    expect(source).toContain('href="/api/shopify/customer-account/login?locale=de-DE" className=');
    expect(source).not.toContain('target="_blank" rel="noopener noreferrer"');
    expect(source).not.toContain('action="/konto/anmelden"');
    expect(source).not.toContain('name="login_hint"');
    expect(source).toContain("Für die sichere E-Mail- und Code-Prüfung öffnet sich Shopify im selben Browserfenster.");
    expect(source).toContain("Herbsom speichert kein Passwort, keine E-Mail-Codes und keine Zahlungsdaten.");
    expect(source).toContain('data-testid="customer-account-login-error"');
    expect(source).toContain('get("shopify-error")');
    expect(source).not.toContain("shopify-account");
    expect(source).toContain("Mit Shopify sicher anmelden");
    expect(source).toContain("Die sichere Anmeldung öffnet sich im selben Browserfenster;");
    expect(source).toContain("showLoginSurface");
  });

  it("bietet einen eigenen Herbsom-Einstieg mit Wiederkauf und dynamischer Shopify-Abo-Auswahl", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('data-testid="customer-subscription-section"');
    expect(source).toContain("Ohne Anmeldung direkt nachbestellen");
    expect(source).toContain("Erneut bestellen");
    expect(source).toContain("Als Abo auswählen");
    expect(source).toContain("sellingPlanId: selection.allocation.sellingPlanId");
    expect(source).toContain("Dein Abo im Herbsom-Konto.");
    expect(source).toContain("enabled: Boolean(data?.connected)");
  });

  it("verweist bei noch nicht geladenen Selling Plans nicht auf veraltete Shopify-Produktseiten", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('data-testid="customer-subscription-status"');
    expect(source).toContain("Dein Abo im Herbsom-Konto.");
    expect(source).toContain("Melde dich über die Herbsom-Anmeldemaske oben an.");
    expect(source).not.toContain("function nativeShopifyProductUrl(handle: string)");
    expect(source).not.toContain("https://herbsom.de/products/");
  });

  it("validiert den einmaligen OAuth-State serverseitig statt über ein Browser-Cookie", () => {
    const source = readFileSync(resolve(process.cwd(), "server/_core/shopifyCustomerAccount.ts"), "utf8");

    expect(source).toContain("await consumeShopifyCustomerAuthState(state)");
    expect(source).toContain('if (!code || !state) throw new Error("Missing customer account OAuth callback parameters")');
    expect(source).not.toContain("CUSTOMER_STATE_COOKIE");
  });

  it("führt die eingebettete Shopify-Anmeldung über eine sichtbare Herbsom-Brückenseite", () => {
    const bridge = readFileSync(resolve(process.cwd(), "client/src/pages/ShopifyLoginBridge.tsx"), "utf8");
    const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

    expect(bridge).toContain("/api/shopify/customer-account/login${window.location.search}");
    expect(bridge).toContain("Deine sichere Anmeldung");
    expect(app).toContain('path={"/konto/anmelden"} component={ShopifyLoginBridge}');
  });
});
