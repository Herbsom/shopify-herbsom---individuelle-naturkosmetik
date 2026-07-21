/*
 * Warenkorb – Herbsom
 * Übersicht aller Artikel mit Mengenänderung, Entfernen und Weiter zum Checkout
 */
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

function formatPrice(price: number) {
  return price.toFixed(2).replace(".", ",") + " €";
}

function CompactRecommendationCard({ name, price, image, productId }: any) {
  const { addItem } = useCart();
  return (
    <div className="bg-[#F8F5F0] rounded-sm overflow-hidden group">
      <div className="aspect-square bg-[#F0EBE3] flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-3">
        <h4 className="font-display text-sm text-[#1C1C1A] font-light mb-2 line-clamp-2">
          {name}
        </h4>
        <div className="flex items-center justify-between">
          <span className="font-display text-base text-[#5B5B38] font-light">€{price}</span>
          <button
            onClick={() => addItem({ id: productId, name, price, quantity: 1 })}
            className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-2 py-1 hover:bg-[#424226] transition-all duration-300 active:scale-[0.97]"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ name, description, price, image, productId }: any) {
  const { addItem } = useCart();
  return (
    <div className="bg-[#F8F5F0] rounded-sm overflow-hidden group">
      <div className="aspect-square bg-[#F0EBE3] flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl text-[#1C1C1A] font-light mb-2">
          {name}
        </h3>
        <p className="font-body text-sm text-[#6B6B69] mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl text-[#5B5B38] font-light">€{price},00</span>
          <button
            onClick={() => addItem({ id: productId, name, price, quantity: 1 })}
            className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-4 py-2 hover:bg-[#424226] transition-all duration-300 active:scale-[0.97]"
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Parses the cart item ID to generate a configurator link.
 * Serum IDs: "serum-true-ingredient1-ingredient2-ingredient3"
 * Creme IDs: "creme-light-ingredient1-ingredient2" or "creme-rich-ingredient1-ingredient2"
 */
function getConfiguratorLink(itemId: string): string | null {
  if (itemId.startsWith("serum-")) {
    // Format: serum-true-ing1-ing2-ing3
    const parts = itemId.replace("serum-true-", "").split("-");
    if (parts.length > 0 && parts[0] !== "") {
      return `/configurator/serum?ingredients=${parts.join(",")}&editingCartItem=${encodeURIComponent(itemId)}`;
    }
  }
  if (itemId.startsWith("creme-")) {
    // Format: creme-light-ing1-ing2 or creme-rich-ing1-ing2
    const withoutPrefix = itemId.replace("creme-", "");
    let base = "light";
    let ingredientStr = withoutPrefix;
    if (withoutPrefix.startsWith("light-")) {
      base = "light";
      ingredientStr = withoutPrefix.replace("light-", "");
    } else if (withoutPrefix.startsWith("rich-")) {
      base = "rich";
      ingredientStr = withoutPrefix.replace("rich-", "");
    }
    const parts = ingredientStr.split("-");
    if (parts.length > 0 && parts[0] !== "") {
      return `/configurator/creme?base=${base}&ingredients=${parts.join(",")}&editingCartItem=${encodeURIComponent(itemId)}`;
    }
  }
  return null;
}

export default function Cart() {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navigation />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container">
          <p className="section-label mb-3">Dein Warenkorb</p>
          <h1 className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light">
            Warenkorb
          </h1>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="container">
          {items.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] p-12 md:p-16 text-center">
              <ShoppingBag size={48} className="text-[#E5E0D8] mx-auto mb-6" />
              <h3 className="font-display text-2xl text-[#1C1C1A] font-light mb-3">
                Dein Warenkorb ist leer
              </h3>
              <p className="font-body text-sm text-[#6B6B69] mb-8 max-w-sm mx-auto">
                Entdecke unsere individuellen Produkte und finde die perfekte Pflege für deine Haut.
              </p>
              <Link href="/#produkte" className="btn-outline-dark">
                Produkte entdecken
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E5E0D8] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#7D7D5D] transition-colors duration-300"
                  >
                    <div className="flex-1">
                      <h3 className="font-display text-lg text-[#1C1C1A] font-light mb-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="font-body text-xs text-[#5B5B38] mb-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <p className="font-body text-sm text-[#7D7D5D]">
                          {formatPrice(item.price)} pro Stück
                        </p>
                        {getConfiguratorLink(item.id) && (
                          <Link
                            href={getConfiguratorLink(item.id)!}
                            className="flex items-center gap-1 font-body text-xs text-[#5B5B38] hover:text-[#424226] transition-colors duration-200"
                          >
                            <Pencil size={12} />
                            Anpassen
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[#E5E0D8]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-[#F0EBE3] transition-colors duration-200 active:scale-[0.97]"
                          aria-label="Menge verringern"
                        >
                          <Minus size={14} className="text-[#5B5B38]" />
                        </button>
                        <span className="px-4 py-2 font-body text-sm text-[#1C1C1A] min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-[#F0EBE3] transition-colors duration-200 active:scale-[0.97]"
                          aria-label="Menge erhöhen"
                        >
                          <Plus size={14} className="text-[#5B5B38]" />
                        </button>
                      </div>

                      <span className="font-body text-sm text-[#1C1C1A] font-medium min-w-[80px] text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[#7D7D5D] hover:text-red-600 transition-colors duration-200 active:scale-[0.97]"
                        aria-label="Artikel entfernen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                  <Link
                    href="/#produkte"
                    className="flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#5B5B38] hover:gap-4 transition-all duration-300"
                  >
                    <ArrowLeft size={14} strokeWidth={1.5} />
                    Weiter einkaufen
                  </Link>
                  <button
                    onClick={clearCart}
                    className="font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] hover:text-red-600 transition-colors duration-200"
                  >
                    Warenkorb leeren
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-[#E5E0D8] p-8 sticky top-32">
                  <h3 className="font-display text-xl text-[#1C1C1A] font-light mb-6">
                    Zusammenfassung
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between font-body text-sm text-[#6B6B69]">
                      <span>Zwischensumme</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm text-[#6B6B69]">
                      <span>Versand</span>
                      <span>{total >= 50 ? "Kostenlos" : "4,90 €"}</span>
                    </div>
                    {total < 50 && (
                      <p className="font-body text-xs text-[#7D7D5D] italic">
                        Noch {formatPrice(50 - total)} bis zum kostenlosen Versand
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[#E5E0D8] pt-4 mb-8">
                    <div className="flex justify-between font-body text-base text-[#1C1C1A] font-medium">
                      <span>Gesamt</span>
                      <span className="text-[#5B5B38]">
                        {formatPrice(total + (total >= 50 ? 0 : 4.9))}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[#7D7D5D] mt-1">
                      inkl. MwSt.
                    </p>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-[#F8F5F0] bg-[#5B5B38] px-6 py-4 hover:bg-[#424226] transition-all duration-200 active:scale-[0.97]"
                  >
                    Zur Kasse
                    <ArrowRight size={14} />
                  </Link>

                  <p className="font-body text-xs text-[#7D7D5D] text-center mt-4">
                    Sichere Bezahlung · 30 Tage Rückgabe
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Free Shipping Progress */}
      {items.length > 0 && total < 60 && (
        <section className="py-3 md:py-4 bg-[#F0EBE3] border-t border-[#E5E0D8]">
          <div className="container">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-[#6B6B69]">Versandkostenfrei ab 60€</span>
              <span className="font-body text-sm font-medium text-[#5B5B38]">{formatPrice(60 - total)} fehlen noch</span>
            </div>
            <div className="w-full bg-[#E5E0D8] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#5B5B38] h-full transition-all duration-300"
                style={{ width: `${(total / 60) * 100}%` }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {items.length > 0 && (
        <section className="py-4 md:py-6 bg-white border-t border-[#E5E0D8]">
          <div className="container">
            <h3 className="font-display text-lg md:text-xl text-[#1C1C1A] font-light mb-3">
              Das könnte dir auch gefallen
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {/* Reinigungsgel 50ml */}
              <CompactRecommendationCard
                name="Reinigungsgel 50ml"
                price={12}
                image="/manus-storage/hf_20260618_101915_99effe47-93fd-45a7-8c5d-5d248d4c1acb_882032b5.jpeg"
                productId="cleaner-gel-50ml"
              />
              {/* GuaSha Tool */}
              <CompactRecommendationCard
                name="GuaSha Jade Tool"
                price={14}
                image="/manus-storage/hf_20260618_101521_5f7c0ade-0380-49e9-85a5-c4a9b90d6395_c464dfc9.png"
                productId="guasha-jade"
              />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
