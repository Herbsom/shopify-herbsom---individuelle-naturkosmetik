import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import type { CartItem } from "@shared/commerce/types";
import { ROUTINE_NORMALE_HAUT, ROUTINE_REIFE_HAUT, ROUTINE_TROCKENE_HAUT, ROUTINE_UNREINE_HAUT, ROUTINE_MISCHHAUT, ROUTINE_EMPFINDLICHE_HAUT, ROUTINE_SENSIBLE_HAUT } from "@/lib/routineRecommendations";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Minus,
  Pencil,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "wouter";

// Map product handles to their images from routine recommendations
function getProductImage(productHandle: string): string | null {
  const routines = [
    ROUTINE_NORMALE_HAUT,
    ROUTINE_REIFE_HAUT,
    ROUTINE_TROCKENE_HAUT,
    ROUTINE_UNREINE_HAUT,
    ROUTINE_MISCHHAUT,
    ROUTINE_EMPFINDLICHE_HAUT,
    ROUTINE_SENSIBLE_HAUT,
  ];

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

function getConfiguratorLink(item: CartItem): string | null {
  const configurationId = item.attributes.find(
    attribute => attribute.key === "_Herbsom-Konfiguration-ID"
  )?.value;

  if (!configurationId) return null;
  if (configurationId.startsWith("serum-")) {
    const ingredients = configurationId.replace("serum-true-", "").split("-").filter(Boolean);
    return `/configurator/serum?ingredients=${ingredients.join(",")}&editingCartItem=${encodeURIComponent(item.lineId)}`;
  }
  if (configurationId.startsWith("creme-")) {
    const withoutPrefix = configurationId.replace("creme-", "");
    const base = withoutPrefix.startsWith("rich-") ? "rich" : "light";
    const ingredients = withoutPrefix.replace(/^(light|rich)-/, "").split("-").filter(Boolean);
    return `/configurator/creme?base=${base}&ingredients=${ingredients.join(",")}&editingCartItem=${encodeURIComponent(item.lineId)}`;
  }
  return null;
}

export default function Cart() {
  const {
    cart,
    items,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
    proceedToCheckout,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navigation />

      <section className="pb-12 pt-32 md:pb-16 md:pt-40">
        <div className="container">
          <p className="section-label mb-3">Direkt mit Shopify verbunden</p>
          <h1 className="font-display text-4xl font-light text-[#1C1C1A] md:text-6xl">
            Warenkorb
          </h1>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="container">
          {items.length === 0 ? (
            <div className="border border-[#E5E0D8] bg-white p-12 text-center md:p-16">
              <ShoppingBag size={48} className="mx-auto mb-6 text-[#E5E0D8]" />
              <h2 className="mb-3 font-display text-2xl font-light text-[#1C1C1A]">
                Dein Warenkorb ist leer
              </h2>
              <p className="mx-auto mb-8 max-w-sm font-body text-sm leading-relaxed text-[#6B6B69]">
                Entdecke individuelle Naturkosmetik. Deine Auswahl wird als Shopify-Warenkorb gespeichert.
              </p>
              <Link href="/#produkte" className="btn-outline-dark">
                Produkte entdecken
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {items.map(item => {
                  const configuratorLink = getConfiguratorLink(item);
                  const visibleAttributes = item.attributes.filter(attribute => !attribute.key.startsWith("_"));
                  const routineImage = getProductImage(item.productHandle);
                  const displayImage = routineImage || item.image;

                  return (
                    <article
                      key={item.lineId}
                      className="flex flex-col gap-5 border border-[#E5E0D8] bg-white p-6 transition-colors hover:border-[#7D7D5D] sm:flex-row md:p-8"
                    >
                      {displayImage && (
                        <img
                          src={routineImage || item.image?.url}
                          alt={item.image?.altText ?? item.productTitle}
                          className="h-28 w-28 flex-none bg-[#F0EBE3] object-cover sm:h-32 sm:w-32"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="font-display text-xl font-light text-[#1C1C1A]">
                              {item.productTitle}
                            </h2>
                            {item.variantTitle !== "Default Title" && (
                              <p className="mt-1 font-body text-xs text-[#7D7D5D]">
                                Variante: {item.variantTitle}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => void removeItem(item.lineId)}
                            disabled={loading}
                            className="p-2 text-[#7D7D5D] transition-colors hover:text-red-700 disabled:opacity-40"
                            aria-label={`${item.productTitle} entfernen`}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        {visibleAttributes.length > 0 && configuratorLink && (
                          <div className="mt-3 space-y-1 border-l-2 border-[#C7C7A5] pl-3">
                            {visibleAttributes.map(attribute => (
                              <p key={`${item.lineId}-${attribute.key}`} className="font-body text-xs leading-relaxed text-[#5B5B38]">
                                <span className="font-medium">{attribute.key}:</span> {attribute.value}
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-[#E5E0D8]">
                              <button
                                type="button"
                                onClick={() => void updateQuantity(item.lineId, item.quantity - 1)}
                                disabled={loading}
                                className="p-2.5 transition-colors hover:bg-[#F0EBE3] disabled:opacity-40"
                                aria-label="Menge verringern"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="min-w-10 px-2 text-center font-body text-sm">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => void updateQuantity(item.lineId, item.quantity + 1)}
                                disabled={loading}
                                className="p-2.5 transition-colors hover:bg-[#F0EBE3] disabled:opacity-40"
                                aria-label="Menge erhöhen"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            {configuratorLink && (
                              <Link
                                href={configuratorLink}
                                className="flex items-center gap-1 font-body text-xs text-[#5B5B38] transition-colors hover:text-[#424226]"
                              >
                                <Pencil size={13} />
                                Anpassen
                              </Link>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="font-display text-xl font-light text-[#5B5B38]">
                              {formatMoney(item.lineTotal)}
                            </p>
                            <p className="font-body text-[10px] text-[#7D7D5D]">
                              {formatMoney(item.unitPrice)} pro Stück
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <div className="flex flex-col items-start justify-between gap-4 pt-4 sm:flex-row sm:items-center">
                  <Link
                    href="/#produkte"
                    className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-[#5B5B38] transition-all hover:gap-4"
                  >
                    <ArrowLeft size={14} />
                    Weiter einkaufen
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="font-body text-xs uppercase tracking-[0.15em] text-[#7D7D5D] transition-colors hover:text-red-700"
                  >
                    Warenkorb leeren
                  </button>
                </div>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-32 border border-[#E5E0D8] bg-white p-8">
                  <h2 className="mb-6 font-display text-xl font-light text-[#1C1C1A]">
                    Zusammenfassung
                  </h2>

                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between font-body text-sm text-[#6B6B69]">
                      <span>Artikel</span>
                      <span>{cart?.itemCount ?? 0}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm text-[#6B6B69]">
                      <span>Zwischensumme</span>
                      <span>{cart ? formatMoney(cart.subtotal) : "—"}</span>
                    </div>
                  </div>

                  <div className="mb-7 border-t border-[#E5E0D8] pt-4">
                    <div className="flex justify-between font-body text-base font-medium text-[#1C1C1A]">
                      <span>Summe</span>
                      <span className="text-[#5B5B38]">
                        {cart ? formatMoney(cart.total) : "—"}
                      </span>
                    </div>
                    <p className="mt-2 font-body text-[11px] leading-relaxed text-[#7D7D5D]">
                      Versand, Steuern und mögliche Rabatte werden im Shopify-Checkout verbindlich berechnet.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={proceedToCheckout}
                    disabled={loading || !cart?.checkoutUrl}
                    className="flex w-full items-center justify-center gap-2 bg-[#5B5B38] px-6 py-4 font-body text-[11px] uppercase tracking-[0.15em] text-[#F8F5F0] transition-all duration-200 hover:bg-[#424226] active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                    Zur Shopify-Kasse
                  </button>

                  <div className="mt-5 flex items-start gap-2 text-[#7D7D5D]">
                    <ShieldCheck size={16} className="mt-0.5 flex-none" />
                    <p className="font-body text-[11px] leading-relaxed">
                      Kunden-Login, Lieferadresse, Zahlung und Bestellung werden sicher von Shopify verarbeitet.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
