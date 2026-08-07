import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("cart shipping progress and suggestions", () => {
  it("shows the reusable free-shipping progress component in the full cart and sidebar", () => {
    expect(read("client/src/pages/Cart.tsx")).toContain("<FreeShippingProgress subtotal={cart?.subtotal ?? 0} />");
    expect(read("client/src/components/CartSidebar.tsx")).toContain("<FreeShippingProgress subtotal={cart.subtotal} compact />");
  });

  it("keeps only missing products in the cart suggestions and uses the Shopify purchase guard", () => {
    const source = read("client/src/components/CartProductSuggestions.tsx");
    expect(source).toContain("new Set(items.map(item => item.productHandle))");
    expect(source).toContain("CART_SUGGESTIONS.filter(product => !productsInCart.has(product.handle))");
    expect(source).toContain("<ShopifyPurchaseButton");
    expect(source).toContain("item={{ id: product.handle, name: product.name, quantity: 1 }}");
  });

  it("adds the 50-ml cleanser and Gua Sha Jade with their dedicated Shopify handles", () => {
    const suggestions = read("client/src/components/CartProductSuggestions.tsx");
    const cartContext = read("client/src/contexts/CartContext.tsx");

    expect(suggestions).toContain('name: "50 ml Reinigungsgel"');
    expect(suggestions).toContain('handle: "mini-reiniger"');
    expect(suggestions).toContain('name: "Gua Sha Jade"');
    expect(suggestions).toContain('handle: "gua-sha-jade-stein"');
    expect(cartContext).toContain('return "gua-sha-jade-stein"');
  });
});
