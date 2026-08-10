import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CustomerAccount-Anmeldestart", () => {
  it("nutzt den bestätigten Herbsom-Shopify-OAuth-Einstieg für das eigene Kundenportal", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('const customerAccountLoginUrl = "/api/shopify/customer-account/login"');
    expect(source).not.toContain('target="_blank"');
    expect(source).not.toContain('target="_top"');
    expect(source).toContain('data-testid="customer-account-login-primary"');
    expect(source).toContain('<EmbeddedShopifyLogin loginUrl={customerAccountLoginUrl} />');
    expect(source).toContain("Mein Herbsom-Konto öffnen");
    expect(source).toContain("Melde dich sicher mit deinem Shopify-Kundenkonto an.");
    expect(source).toContain("Anmeldung und Zahlungsdaten bleiben bei Shopify.");
    expect(source).toContain("Die sichere E-Mail-Maske öffnet sich direkt in dieser Ansicht");
    expect(source).toContain('data-testid="customer-account-login-error"');
    expect(source).toContain('get("shopify-error")');
    expect(source).toContain("EmbeddedShopifyLogin");
    expect(source).toContain("shopify-account");
    expect(source).toContain('sign-in-url="/konto/anmelden"');
    expect(source).toContain("E-Mail sicher anmelden");
    expect(source).toContain("showLoginSurface");
  });

  it("bietet einen eigenen Herbsom-Einstieg mit Wiederkauf und dynamischer Shopify-Abo-Auswahl", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CustomerAccount.tsx"), "utf8");

    expect(source).toContain('data-testid="customer-subscription-section"');
    expect(source).toContain("Direkt nachbestellen");
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
