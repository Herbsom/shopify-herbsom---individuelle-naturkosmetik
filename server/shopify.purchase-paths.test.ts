import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";
import type { Cart, Product } from "../shared/commerce/types";
import {
  performLegacyAddToCart,
  performShopifyCheckout,
  resolveLegacyCartLine,
} from "../client/src/contexts/CartContext";
import { getShopifyPurchaseUiState } from "../client/src/components/ShopifyPurchaseButton";

const root = process.cwd();
const read = (relativePath: string) =>
  readFileSync(resolve(root, relativePath), "utf8");

const detailPages = [
  "ProductCleaner.tsx",
  "ProductCleanerMilk.tsx",
  "ProductCreme.tsx",
  "ProductPeeling.tsx",
  "ProductPeelingAHA.tsx",
  "ProductSerum.tsx",
  "ProductSunscreen.tsx",
].map((name) => `client/src/pages/${name}`);

const overviewAndPurchasePages = [
  "client/src/pages/Cleaners.tsx",
  "client/src/pages/Peelings.tsx",
  "client/src/pages/SkinTest.tsx",
  "client/src/pages/ConfiguratorCreme.tsx",
  "client/src/pages/ConfiguratorSerum.tsx",
];

// Routine-Seiten werden jetzt über RoutineTemplate.tsx generisch gerendert
// Das routines-Verzeichnis existiert nicht mehr
const routinePages: string[] = [];

const priceComponentPages = [
  ...detailPages,
  ...overviewAndPurchasePages,
  ...routinePages,
];

const euroLiteral = /(?:€\s*\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?\s*€)/;

describe("strict Shopify price rendering", () => {
  it("never renders local fallback prices in the central Shopify price components", () => {
    const direct = read("client/src/components/ShopifyProductPrice.tsx");
    const legacy = read("client/src/components/ShopifyLegacyProductPrice.tsx");

    expect(direct).not.toContain("fallback");
    expect(legacy).not.toContain("fallback");
    expect(direct).toContain("Preis wird aus Shopify geladen");
    expect(direct).toContain("Preis derzeit nicht verfügbar");
    expect(legacy).toContain("Variante derzeit nicht verfügbar");
    expect(legacy).toContain("Produkt nicht in Shopify verfügbar");
  });

  it.each(priceComponentPages)(
    "%s sources visible prices through a Shopify price component",
    (relativePath) => {
      const source = read(relativePath);
      expect(source).toMatch(/Shopify(?:Legacy)?ProductPrice/);
      expect(source).not.toContain("fallback=");
      const localPriceLines = source
        .split("\n")
        .filter((line) => euroLiteral.test(line))
        .filter((line) => !line.includes("Kostenloser Versand"))
        .filter((line) => !line.trim().startsWith("//"));
      expect(localPriceLines).toEqual([]);
    }
  );

  it("loads gift-card values and adds the selected published Shopify variant directly", () => {
    const source = read("client/src/pages/Gutschein.tsx");
    expect(source).toContain("trpc.commerce.products.byHandle.useQuery");
    expect(source).toContain('handle: "unser-gutschein-1"');
    expect(source).toContain("availableForSale");
    expect(source).toContain("variant.price.amount");
    expect(source).toContain("addItem(selectedVariant.id");
    expect(source).not.toContain("addItem({");
  });

  it("keeps all customer-facing product purchase paths free of local login and review forms", () => {
    for (const relativePath of [
      ...detailPages,
      "client/src/pages/ConfiguratorCreme.tsx",
      "client/src/pages/ConfiguratorSerum.tsx",
    ]) {
      const source = read(relativePath);
      expect(source).not.toContain("getLoginUrl");
      expect(source).not.toContain("useAuth(");
      expect(source).not.toContain("<ReviewForm");
      expect(source).toContain("<ReviewSubmissionNotice />");
    }
  });
});

describe("Shopify purchase-button UI guards", () => {
  const purchasableProduct = {
    handle: "reinigungsgel",
    title: "Reinigungsgel",
    variants: [{
      id: "gid://shopify/ProductVariant/available",
      title: "Default Title",
      availableForSale: true,
      selectedOptions: [],
      price: { amount: "32.00", currencyCode: "EUR" },
    }],
  } as Product;

  it("renders disabled loading, error and unavailable states before a purchase can run", () => {
    const item = { id: "cleaner-gel-200ml", name: "Reinigungsgel 200ml", quantity: 1 };

    expect(getShopifyPurchaseUiState({ items: [item], products: undefined, isLoading: true, isError: false }))
      .toMatchObject({ disabled: true, kind: "loading", message: "Verfügbarkeit wird direkt bei Shopify geprüft …" });
    expect(getShopifyPurchaseUiState({ items: [item], products: undefined, isLoading: false, isError: true, errorMessage: "Shopify nicht erreichbar" }))
      .toMatchObject({ disabled: true, kind: "error", message: "Shopify nicht erreichbar" });
    expect(getShopifyPurchaseUiState({ items: [item], products: [], isLoading: false, isError: false }))
      .toMatchObject({ disabled: true, kind: "error" });
    expect(getShopifyPurchaseUiState({ items: [item], products: [purchasableProduct], isLoading: false, isError: false }))
      .toEqual({ disabled: false, kind: "available", message: null });
  });

  it("exposes disabled semantics and visible status messaging in the reusable purchase component", () => {
    const source = read("client/src/components/ShopifyPurchaseButton.tsx");
    expect(source).toContain("data-shopify-purchase-state={state.kind}");
    expect(source).toContain("disabled={state.disabled}");
    expect(source).toContain('role={state.kind === "error" ? "alert" : "status"}');
    expect(source).toContain("Derzeit nicht verfügbar");
  });

  it.each([
    ...detailPages,
    ...overviewAndPurchasePages,
    ...routinePages,
    "client/src/pages/Gutschein.tsx",
    "client/src/components/ProductDetailModal.tsx",
  ])("%s renders its customer-facing purchase controls through the Shopify guard", (relativePath) => {
    const source = read(relativePath);
    expect(source).toContain("ShopifyPurchaseButton");
  });

  it("connects the routine product-detail modal to the real Shopify cart instead of a placeholder action", () => {
    const source = read("client/src/components/ProductDetailModal.tsx");
    expect(source).toContain("useCart");
    expect(source).toContain("await addItem(detailCartItem)");
    expect(source).toContain("ShopifyPurchaseButton");
    expect(source).not.toContain("added to cart");
  });

  it("covers both the product-level and routine-level skin-test purchase actions with the Shopify guard", () => {
    const source = read("client/src/pages/SkinTest.tsx");
    expect(source).toContain("onPurchase={handleAddCleanser}");
    expect(source).toContain("onPurchase={handleAddPeeling}");
    expect(source).toContain("onPurchase={handleAddSerum}");
    expect(source).toContain("onPurchase={handleAddCreme}");
    expect(source).toContain("onPurchase={handleAddSunscreen}");
    expect(source).toContain("onPurchase={handleAddAll}");
  });
});

describe("strict Shopify purchase blocking", () => {
  it("resolves every legacy purchase through Shopify and reports mapping or availability failures", () => {
    const source = read("client/src/contexts/CartContext.tsx");

    expect(source).toContain("inferShopifyHandle");
    expect(source).toContain("selectVariantForLegacyItem");
    expect(source).toContain("noch kein kaufbares Shopify-Produkt zugeordnet");
    expect(source).toContain("besitzt keine kaufbare Shopify-Variante");
    expect(source).toContain("nicht im Storefront-Verkaufskanal verfügbar");
    expect(source).toContain("utils.client.commerce.cart.create.mutate");
    expect(source).not.toContain("item.price");
    expect(source).not.toMatch(/LegacyCartItem[\s\S]*?price:/);
  });

  it("maps all currently published Herbsom purchase families to verified Shopify handles", () => {
    const source = read("client/src/contexts/CartContext.tsx");
    for (const handle of [
      "erstelle-deine-creme",
      "individuelle-serum-creme",
      "reinigungsgel",
      "mini-reiniger",
      "reinigungs-milch",
      "bha-azelainsaure-peeling",
      "aha-pha-peeling",
      "sonnenschutzfluid-spf-50",
      "unser-gutschein-1",
    ]) {
      expect(source).toContain(handle);
    }
  });

  it("blocks add-to-cart and reports a visible error when the mapped Shopify product is missing", async () => {
    const addLine = vi.fn(async () => undefined);
    const reportError = vi.fn();
    const item = { id: "cleaner-gel-200ml", name: "Reinigungsgel 200ml", quantity: 1 };

    const result = await performLegacyAddToCart(item, {
      resolveItem: async (legacyItem) =>
        (await resolveLegacyCartLine(legacyItem, async () => null)).line,
      addLine,
      reportError,
    });

    expect(result).toBe(false);
    expect(addLine).not.toHaveBeenCalled();
    expect(reportError).toHaveBeenCalledWith(expect.stringContaining("nicht im Storefront-Verkaufskanal verfügbar"));
  });

  it("blocks add-to-cart and reports a visible error when Shopify has no purchasable variant", async () => {
    const addLine = vi.fn(async () => undefined);
    const reportError = vi.fn();
    const unavailableProduct = {
      handle: "reinigungsgel",
      title: "Reinigungsgel",
      variants: [
        {
          id: "gid://shopify/ProductVariant/unavailable",
          title: "Default Title",
          availableForSale: false,
          selectedOptions: [],
          price: { amount: "32.00", currencyCode: "EUR" },
        },
      ],
    } as Product;

    const result = await performLegacyAddToCart(
      { id: "cleaner-gel-200ml", name: "Reinigungsgel 200ml", quantity: 1 },
      {
        resolveItem: async (legacyItem) =>
          (await resolveLegacyCartLine(legacyItem, async () => unavailableProduct)).line,
        addLine,
        reportError,
      }
    );

    expect(result).toBe(false);
    expect(addLine).not.toHaveBeenCalled();
    expect(reportError).toHaveBeenCalledWith(expect.stringContaining("keine kaufbare Shopify-Variante"));
  });

  it("adds the resolved Shopify variant only after successful runtime resolution", async () => {
    const addLine = vi.fn(async () => undefined);
    const reportError = vi.fn();
    const availableProduct = {
      handle: "reinigungsgel",
      title: "Reinigungsgel",
      variants: [
        {
          id: "gid://shopify/ProductVariant/available",
          title: "Default Title",
          availableForSale: true,
          selectedOptions: [],
          price: { amount: "32.00", currencyCode: "EUR" },
        },
      ],
    } as Product;

    const result = await performLegacyAddToCart(
      { id: "cleaner-gel-200ml", name: "Reinigungsgel 200ml", quantity: 2 },
      {
        resolveItem: async (legacyItem) =>
          (await resolveLegacyCartLine(legacyItem, async () => availableProduct)).line,
        addLine,
        reportError,
      }
    );

    expect(result).toBe(true);
    expect(reportError).not.toHaveBeenCalled();
    expect(addLine).toHaveBeenCalledWith(expect.objectContaining({
      variantId: "gid://shopify/ProductVariant/available",
      quantity: 2,
    }));
  });

  it("blocks checkout without a Shopify checkout URL and reports the error", () => {
    const navigate = vi.fn();
    const reportError = vi.fn();

    const result = performShopifyCheckout(null, { navigate, reportError });

    expect(result).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(reportError).toHaveBeenCalledWith("Der Shopify-Checkout ist noch nicht verfügbar.");
  });

  it("navigates only to the checkout URL returned by Shopify", () => {
    const navigate = vi.fn();
    const reportError = vi.fn();
    const cart = { checkoutUrl: "https://herbsom.myshopify.com/cart/c/example" } as Cart;

    const result = performShopifyCheckout(cart, { navigate, reportError });

    expect(result).toBe(true);
    expect(reportError).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(cart.checkoutUrl);
  });
});
