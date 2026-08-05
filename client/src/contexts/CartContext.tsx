import { trpc } from "@/lib/trpc";
import type {
  Cart,
  CartAttribute,
  CartItem,
  Product,
  ProductVariant,
} from "@shared/commerce/types";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const CART_STORAGE_KEY = "commerce:cart-id";
const LEGACY_CART_STORAGE_KEY = "herbsom-cart";

export type LegacyCartItem = {
  id: string;
  name: string;
  quantity: number;
  description?: string;
};

type AddItemInput = string | LegacyCartItem;

type CartContextValue = {
  cart: Cart | null;
  items: CartItem[];
  total: number;
  isOpen: boolean;
  showCartSidebar: boolean;
  setShowCartSidebar: (show: boolean) => void;
  loading: boolean;
  isLoading: boolean;
  itemCount: number;
  lastAddedItem: CartItem | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddItemInput, quantity?: number) => Promise<void>;
  replaceItem: (oldId: string, newItem: LegacyCartItem) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  proceedToCheckout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CART_STORAGE_KEY);
}

function writeStoredCartId(value: string | null) {
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(CART_STORAGE_KEY, value);
  else window.localStorage.removeItem(CART_STORAGE_KEY);
}

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Maps the former local product ids to stable Shopify product handles. */
export function inferShopifyHandle(item: LegacyCartItem): string {
  const value = normalizeSearchValue(`${item.id} ${item.name}`);

  if ((value.includes("50ml") || value.includes("50 ml") || value.includes("mini")) && value.includes("reinig")) {
    return "mini-reiniger";
  }
  if (value.includes("reinigungsmilch") || value.includes("cleaner-milk") || value.includes("cleanser-milk")) {
    return "reinigungs-milch";
  }
  if (value.includes("reinigungsgel") || value.includes("cleaner-gel") || value.includes("cleanser-gel")) {
    return "reinigungsgel";
  }
  if (value.includes("aha") || value.includes("pha")) {
    return "aha-pha-peeling";
  }
  if (value.includes("bha") || value.includes("azela")) {
    return "bha-azelainsaure-peeling";
  }
  if (value.includes("sonnen") || value.includes("sunscreen") || value.includes("spf50")) {
    return "sonnenschutzfluid-spf-50";
  }
  if (value.includes("gutschein") || value.includes("gift")) {
    return "unser-gutschein-1";
  }
  if (value.includes("serum")) {
    return "individuelle-serum-creme";
  }
  if (value.includes("creme") || value.includes("cream")) {
    return "erstelle-deine-creme";
  }

  throw new Error(`Für „${item.name}“ ist noch kein kaufbares Shopify-Produkt zugeordnet.`);
}

function ingredientCount(item: LegacyCartItem): number | null {
  const description = item.description?.trim();
  if (description) {
    const value = description.replace(/^Wirkstoffe:\s*/i, "").trim();
    if (!value) return 0;
    return value.split(",").map(part => part.trim()).filter(Boolean).length;
  }

  return null;
}

export function inferCartAttributes(item: LegacyCartItem): CartAttribute[] {
      const attributes: CartAttribute[] = [];
      




  const description = item.description?.trim();

  if (description) {
    const ingredients = description.replace(/^Wirkstoffe:\s*/i, "").trim();
    attributes.push({
      key: /^Wirkstoffe:/i.test(description) ? "Wirkstoffe" : "Konfiguration",
      value: ingredients || description,
    });

    // Add individual ingredient EANs for backend tracking
    const ingredientNames = ingredients.split(",").map(s => s.trim());
    ingredientNames.forEach((name, index) => {
      // Map ingredient names to EANs
      const eanMap: Record<string, string> = {
        "Niacinamide-Komplex": "0038407203991",
        "Spilantholkomplex": "0653415982203",
        "Hyaluronkomplex": "0038407203984",
        "Algenextrakt": "0038407203908",
        "Vitamin C-Komplex": "0038407204004",
        "Retinolkomplex": "0038407204011",
        "Weidenrindenextrakt": "0038407203977",
        "Malvenextrakt": "0038407204028",
        "Rosskastanienextrakt": "0038407204035",
        "Wildrosenöl": "0038407203960",
        "Sanddornöl": "0038407203953",
        "Traubenkernöl": "0038407203946",
        "Distelöl": "0038407203939",
      };
      const ean = eanMap[name];
      if (ean) {
        



        attributes.push({
          key: `_Wirkstoff-${index + 1}: ${name}`,
          value: ean,
        });
      }
    });
  }

  const normalizedId = normalizeSearchValue(item.id);
  if (normalizedId.startsWith("creme-") || normalizedId.startsWith("serum-")) {
    attributes.push({ key: "_Herbsom-Konfiguration-ID", value: item.id });
  }
  if (normalizedId.startsWith("creme-light")) {
    attributes.push({ key: "_Basis-Leicht", value: "0038407203892" });
  } else if (normalizedId.startsWith("creme-rich")) {
    attributes.push({ key: "_Basis-Reichhaltig", value: "0038407203892" });
  }

  return attributes;
}

export function selectVariantForLegacyItem(
  product: Product,
  item: LegacyCartItem
): ProductVariant {
  const candidates = product.variants.filter(variant => variant.availableForSale);

  if (product.handle === "erstelle-deine-creme") {
    const count = ingredientCount(item);
    if (count !== null) {
      const match = candidates.find(variant =>
        variant.title === String(count) ||
        variant.selectedOptions.some(option => option.name === "Wirkstoffe" && option.value === String(count))
      );
      if (match) return match;
    }
  }

  const first = candidates[0];
  if (!first) {
    throw new Error(`„${product.title}“ besitzt keine kaufbare Shopify-Variante.`);
  }
  return first;
}

export async function resolveLegacyCartLine(
  item: LegacyCartItem,
  loadProduct: (handle: string) => Promise<Product | null>
) {
  const handle = inferShopifyHandle(item);
  const product = await loadProduct(handle);
  if (!product) {
    throw new Error(`Das Shopify-Produkt "${handle}" ist nicht im Storefront-Verkaufskanal verfügbar.`);
  }

  const variant = selectVariantForLegacyItem(product, item);
  const attributes = inferCartAttributes(item);

  // Add barcode to attributes if available
  if (variant.barcode) {
    attributes.push({
      key: `EAN: ${item.name}`,
      value: variant.barcode,
    });
  }

  return {
    handle,
    line: {
      variantId: variant.id,
      quantity: item.quantity,
      attributes,
    },
  };
}

export function shopifyCartErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function getShopifyCheckoutUrl(cart: Cart | null) {
  if (!cart?.checkoutUrl) {
    throw new Error("Der Shopify-Checkout ist noch nicht verfügbar.");
  }
  return cart.checkoutUrl;
}

type ResolvedCartLine = {
  variantId: string;
  quantity: number;
  attributes?: CartAttribute[];
};

export async function performLegacyAddToCart(
  item: LegacyCartItem,
  dependencies: {
    resolveItem: (item: LegacyCartItem) => Promise<ResolvedCartLine>;
    addLine: (line: ResolvedCartLine) => Promise<void>;
    reportError: (message: string) => void;
  }
) {
  try {
    const line = await dependencies.resolveItem(item);
    await dependencies.addLine(line);
    return true;
  } catch (error) {
    dependencies.reportError(shopifyCartErrorMessage(error, "Der Artikel konnte nicht hinzugefügt werden."));
    return false;
  }
}

export function performShopifyCheckout(
  cart: Cart | null,
  dependencies: {
    navigate: (url: string) => void;
    reportError: (message: string) => void;
  }
) {
  try {
    dependencies.navigate(getShopifyCheckoutUrl(cart));
    return true;
  } catch (error) {
    dependencies.reportError(shopifyCartErrorMessage(error, "Der Shopify-Checkout ist noch nicht verfügbar."));
    return false;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(() => readStoredCartId());
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  const cartIdRef = useRef(cartId);
  const cartRef = useRef<Cart | null>(null);
  const productCacheRef = useRef(new Map<string, Product>());
  const operationQueueRef = useRef<Promise<void>>(Promise.resolve());
  const utils = trpc.useUtils();

  const commitCart = useCallback((nextCart: Cart | null) => {
    cartRef.current = nextCart;
    setCart(nextCart);
    const nextId = nextCart?.id ?? null;
    cartIdRef.current = nextId;
    setCartId(nextId);
    writeStoredCartId(nextId);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    cartIdRef.current = cartId;
    if (!cartId) {
      cartRef.current = null;
      setCart(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    utils.commerce.cart.get
      .fetch({ cartId })
      .then(nextCart => {
        if (cancelled) return;
        if (nextCart) {
          cartRef.current = nextCart;
          setCart(nextCart);
        } else {
          commitCart(null);
        }
      })
      .catch(() => {
        if (!cancelled) commitCart(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cartId, commitCart, utils.commerce.cart.get]);

  const enqueue = useCallback(<T,>(operation: () => Promise<T>): Promise<T> => {
    const next = operationQueueRef.current.then(operation, operation);
    operationQueueRef.current = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }, []);

  const resolveLegacyItem = useCallback(
    async (item: LegacyCartItem) => {
      const resolved = await resolveLegacyCartLine(item, async (handle) => {
        const cached = productCacheRef.current.get(handle);
        if (cached) return cached;
        const product = await utils.commerce.products.byHandle.fetch({ handle });
        if (product) productCacheRef.current.set(handle, product);
        return product;
      });
      return resolved.line;
    },
    [utils.commerce.products.byHandle]
  );

  const addResolvedLine = useCallback(
    async (line: ResolvedCartLine) => {
      let currentCart = cartRef.current;
      let currentCartId = cartIdRef.current;
      



      if (currentCartId && !currentCart) {
        currentCart = await utils.commerce.cart.get.fetch({ cartId: currentCartId });
        if (!currentCart) {
          currentCartId = null;
          commitCart(null);
        }
      }


      const nextCart = !currentCartId || !currentCart
        ? await utils.client.commerce.cart.create.mutate({ lines: [line] })
        : await utils.client.commerce.cart.addLines.mutate({
            cartId: currentCartId,
            lines: [line],
          });
        




      commitCart(nextCart);
      const added = [...nextCart.items].reverse().find(item => item.variantId === line.variantId) ?? null;
      setLastAddedItem(added);
      setIsOpen(true);
    },
    [commitCart, utils.client, utils.commerce.cart.get]
  );

  const addItem = useCallback(
    (input: AddItemInput, quantity: number = 1) =>
      enqueue(async () => {
        setLoading(true);
        try {
          if (typeof input === "string") {
            await addResolvedLine({ variantId: input, quantity });
          } else {

            await performLegacyAddToCart(input, {
              resolveItem: resolveLegacyItem,
              addLine: addResolvedLine,
              reportError: (message) => toast.error(message),
            });
          }
        } catch (error) {
          console.error("[Shopify Cart] Artikel konnte nicht hinzugefügt werden:", error);
          toast.error(shopifyCartErrorMessage(error, "Der Artikel konnte nicht hinzugefügt werden."));
        } finally {
          setLoading(false);
        }
      }),
    [addResolvedLine, enqueue, resolveLegacyItem]
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) =>
      enqueue(async () => {
        const currentCartId = cartIdRef.current;
        if (!currentCartId) return;
        setLoading(true);
        try {
          const nextCart = await utils.client.commerce.cart.updateLines.mutate({
            cartId: currentCartId,
            lines: [{ lineId, quantity }],
          });
          commitCart(nextCart);
        } catch (error) {
          console.error("[Shopify Cart] Menge konnte nicht geändert werden:", error);
          toast.error("Die Menge konnte nicht geändert werden.");
        } finally {
          setLoading(false);
        }
      }),
    [commitCart, enqueue, utils.client]
  );

  const removeItem = useCallback(
    (lineId: string) =>
      enqueue(async () => {
        const currentCartId = cartIdRef.current;
        if (!currentCartId) return;
        setLoading(true);
        try {
          const nextCart = await utils.client.commerce.cart.removeLines.mutate({
            cartId: currentCartId,
            lineIds: [lineId],
          });
          commitCart(nextCart);
        } catch (error) {
          console.error("[Shopify Cart] Artikel konnte nicht entfernt werden:", error);
          toast.error("Der Artikel konnte nicht entfernt werden.");
        } finally {
          setLoading(false);
        }
      }),
    [commitCart, enqueue, utils.client]
  );

  const replaceItem = useCallback(
    (oldId: string, newItem: LegacyCartItem) =>
      enqueue(async () => {
        setLoading(true);
        try {
          const currentCartId = cartIdRef.current;
          const oldLine = cartRef.current?.items.find(item =>
            item.lineId === oldId ||
            item.attributes.some(attribute =>
              attribute.key === "_Herbsom-Konfiguration-ID" && attribute.value === oldId
            )
          );

          if (currentCartId && oldLine) {
            const nextCart = await utils.client.commerce.cart.removeLines.mutate({
              cartId: currentCartId,
              lineIds: [oldLine.lineId],
            });
            commitCart(nextCart);
          }

          const line = await resolveLegacyItem(newItem);
          await addResolvedLine(line);
        } catch (error) {
          console.error("[Shopify Cart] Konfiguration konnte nicht ersetzt werden:", error);
          toast.error(shopifyCartErrorMessage(error, "Die Konfiguration konnte nicht gespeichert werden."));
        } finally {
          setLoading(false);
        }
      }),
    [addResolvedLine, commitCart, enqueue, resolveLegacyItem, utils.client]
  );

  const clearCart = useCallback(() => {
    commitCart(null);
    setLastAddedItem(null);
  }, [commitCart]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const setShowCartSidebar = useCallback((show: boolean) => setIsOpen(show), []);

  const proceedToCheckout = useCallback(() => {
    performShopifyCheckout(cartRef.current, {
      navigate: (url) => window.location.assign(url),
      reportError: (message) => toast.error(message),
    });
  }, []);

  const items = cart?.items ?? [];
  const total = Number(cart?.total.amount ?? 0);
  const itemCount = cart?.itemCount ?? 0;

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items,
      total,
      isOpen,
      showCartSidebar: isOpen,
      setShowCartSidebar,
      loading,
      isLoading: loading,
      itemCount,
      lastAddedItem,
      openCart,
      closeCart,
      addItem,
      replaceItem,
      updateQuantity,
      removeItem,
      clearCart,
      proceedToCheckout,
    }),
    [
      addItem,
      cart,
      clearCart,
      closeCart,
      isOpen,
      itemCount,
      items,
      lastAddedItem,
      loading,
      openCart,
      proceedToCheckout,
      removeItem,
      replaceItem,
      setShowCartSidebar,
      total,
      updateQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function useCartSidebar() {
  const { showCartSidebar, setShowCartSidebar, lastAddedItem } = useCart();
  return { showCartSidebar, setShowCartSidebar, lastAddedItem };
}
