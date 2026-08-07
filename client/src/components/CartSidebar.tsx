import { ArrowRight, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { ROUTINE_NORMALE_HAUT, ROUTINE_REIFE_HAUT, ROUTINE_TROCKENE_HAUT, ROUTINE_UNREINE_HAUT, ROUTINE_MISCHHAUT, ROUTINE_EMPFINDLICHE_HAUT, ROUTINE_SENSIBLE_HAUT } from "@/lib/routineRecommendations";

// Map product handles to their images from routine recommendations
function getProductImage(productHandle: string): string | null {
  // Map Shopify handles to routine product images
  if (productHandle === "individuelle-serum-creme") {
    return ROUTINE_UNREINE_HAUT.serum.image || null;
  }
  if (productHandle === "erstelle-deine-creme") {
    return ROUTINE_UNREINE_HAUT.creme.image || null;
  }
  if (productHandle === "reinigungsgel") {
    return ROUTINE_UNREINE_HAUT.cleanser.image || null;
  }
  if (productHandle === "reinigungs-milch") {
    return ROUTINE_REIFE_HAUT.cleanser.image || null;
  }
  if (productHandle === "mini-reiniger") {
    return ROUTINE_UNREINE_HAUT.cleanser.image || null;
  }
  if (productHandle === "bha-azelainsaure-peeling") {
    return ROUTINE_UNREINE_HAUT.peeling.image || null;
  }
  if (productHandle === "aha-pha-peeling") {
    return ROUTINE_REIFE_HAUT.peeling.image || null;
  }
  if (productHandle === "sonnenschutzfluid-spf-50") {
    return ROUTINE_UNREINE_HAUT.sunscreen.image || null;
  }
  
  return null;
}

export default function CartSidebar() {
  const {
    cart,
    isOpen,
    closeCart,
    loading,
    lastAddedItem,
    updateQuantity,
    removeItem,
    proceedToCheckout,
  } = useCart();

  if (!isOpen) return null;

  const items = cart?.items ?? [];

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-200"
        onClick={closeCart}
        aria-label="Warenkorb schließen"
      />

      <aside
        className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col overflow-hidden bg-[#F8F5F0] shadow-2xl"
        aria-label="Shopify-Warenkorb"
      >
        <div className="flex items-center justify-between border-b border-[#E5E0D8] p-6">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#7D7D5D]">
              Sicher über Shopify
            </p>
            <h2 className="font-display text-2xl font-light text-[#1C1C1A]">Warenkorb</h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#E8E3DB] text-[#1C1C1A] transition-all duration-200 hover:bg-[#5B5B38] hover:text-[#F8F5F0] active:scale-[0.97]"
            aria-label="Warenkorb schließen"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={48} className="mb-4 text-[#7D7D5D] opacity-50" />
              <p className="font-body text-[#4A4A48]">Dein Warenkorb ist leer</p>
              <p className="mt-2 max-w-xs font-body text-xs leading-relaxed text-[#7D7D5D]">
                Deine Auswahl wird direkt als Shopify-Warenkorb gespeichert.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {lastAddedItem && (
                <div className="border-l-4 border-[#5B5B38] bg-[#F0EBE3] p-4">
                  <p className="mb-1 font-body text-[10px] uppercase tracking-[0.16em] text-[#7D7D5D]">
                    Gerade hinzugefügt
                  </p>
                  <p className="font-display text-base font-light text-[#1C1C1A]">
                    {lastAddedItem.productTitle}
                  </p>
                </div>
              )}

              {items.map(item => {
                const configurationId = item.attributes.find(
                  attribute => attribute.key === "_Herbsom-Konfiguration-ID"
                )?.value;
                const hasConfigurator = configurationId?.startsWith("serum-") || configurationId?.startsWith("creme-");
                const visibleAttributes = hasConfigurator ? item.attributes.filter(attribute => !attribute.key.startsWith("_")) : [];
                const routineImage = getProductImage(item.productHandle);
                const displayImage = routineImage || item.image;
                return (
                  <article key={item.lineId} className="border-b border-[#E5E0D8] pb-5">
                    <div className="flex gap-4">
                      {displayImage && (
                        <img
                          src={routineImage || item.image?.url}
                          alt={item.image?.altText ?? item.productTitle}
                          className="h-20 w-20 flex-none bg-[#F0EBE3] object-contain"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-base font-light text-[#1C1C1A]">
                              {item.productTitle}
                            </h3>
                            {item.variantTitle !== "Default Title" && (
                              <p className="mt-0.5 font-body text-xs text-[#7D7D5D]">
                                Variante: {item.variantTitle}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => void removeItem(item.lineId)}
                            disabled={loading}
                            className="p-1 text-[#7D7D5D] transition-colors hover:text-red-700 disabled:opacity-40"
                            aria-label={`${item.productTitle} entfernen`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {visibleAttributes.map(attribute => (
                          <p key={`${item.lineId}-${attribute.key}`} className="mt-1 font-body text-[11px] leading-relaxed text-[#5B5B38]">
                            <span className="font-medium">{attribute.key}:</span> {attribute.value}
                          </p>
                        ))}

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center border border-[#D9D2C8]">
                            <button
                              type="button"
                              onClick={() => void updateQuantity(item.lineId, item.quantity - 1)}
                              disabled={loading}
                              className="p-2 transition-colors hover:bg-[#F0EBE3] disabled:opacity-40"
                              aria-label="Menge verringern"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="min-w-8 px-1 text-center font-body text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => void updateQuantity(item.lineId, item.quantity + 1)}
                              disabled={loading}
                              className="p-2 transition-colors hover:bg-[#F0EBE3] disabled:opacity-40"
                              aria-label="Menge erhöhen"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-display text-base font-light text-[#5B5B38]">
                            {formatMoney(item.lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {cart && items.length > 0 && (
          <div className="space-y-4 border-t border-[#E5E0D8] p-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <p className="font-body text-sm text-[#4A4A48]">Zwischensumme</p>
              <p className="font-display text-2xl font-light text-[#5B5B38]">
                {formatMoney(cart.subtotal)}
              </p>
            </div>
            <p className="font-body text-[11px] leading-relaxed text-[#7D7D5D]">
              Versand, Rabatte, Steuern und Bezahlung werden sicher im Shopify-Checkout berechnet.
            </p>
            <button
              type="button"
              onClick={proceedToCheckout}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-[#5B5B38] px-6 py-4 font-body text-xs uppercase tracking-[0.12em] text-[#F8F5F0] transition-all duration-200 hover:bg-[#424226] active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
              Sicher zur Shopify-Kasse
            </button>
            <Link
              href="/cart"
              onClick={closeCart}
              className="flex w-full items-center justify-center border border-[#D9D2C8] bg-white px-6 py-3 font-body text-xs uppercase tracking-[0.12em] text-[#5B5B38] transition-colors hover:bg-[#F0EBE3]"
            >
              Warenkorb ansehen
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="w-full px-6 py-2 font-body text-xs uppercase tracking-[0.12em] text-[#5B5B38]"
            >
              Weiter einkaufen
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
