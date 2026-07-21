import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";

export default function CartSidebar() {
  const { showCartSidebar, setShowCartSidebar, items, total, lastAddedItem } = useCart();

  if (!showCartSidebar) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={() => setShowCartSidebar(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F8F5F0] shadow-2xl z-[60] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E0D8]">
          <h2 className="font-display text-2xl text-[#1C1C1A] font-light">Warenkorb</h2>
          <button
            onClick={() => setShowCartSidebar(false)}
            className="w-12 h-12 flex items-center justify-center bg-[#E8E3DB] hover:bg-[#5B5B38] rounded-sm transition-all duration-200 flex-shrink-0"
            title="Warenkorb schließen"
            aria-label="Warenkorb schließen"
          >
            <X size={28} className="text-[#1C1C1A] hover:text-[#F8F5F0]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-[#7D7D5D] mb-4 opacity-50" />
              <p className="font-body text-[#4A4A48]">Dein Warenkorb ist leer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Last Added Item Highlight */}
              {lastAddedItem && (
                <div className="bg-[#F0EBE3] p-4 rounded-sm border-l-4 border-[#5B5B38]">
                  <p className="font-body text-xs text-[#7D7D5D] mb-1">Gerade hinzugefügt</p>
                  <p className="font-display text-sm text-[#1C1C1A] font-light mb-2">{lastAddedItem.name}</p>
                  <p className="font-body text-sm text-[#5B5B38]">
                    {lastAddedItem.quantity}x à {lastAddedItem.price}€
                  </p>
                </div>
              )}

              {/* All Items */}
              <div className="space-y-3 mt-6">
                <p className="font-body text-xs text-[#7D7D5D] uppercase tracking-wider mb-4">
                  Alle Artikel ({items.length})
                </p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-3 border-b border-[#E5E0D8]">
                    <div className="flex-1">
                      <p className="font-body text-sm text-[#1C1C1A] font-medium">{item.name}</p>
                      <p className="font-body text-xs text-[#7D7D5D] mt-1">
                        {item.quantity}x à {item.price}€
                      </p>
                    </div>
                    <p className="font-display text-sm text-[#5B5B38] font-light">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E0D8] p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E0D8]">
              <p className="font-body text-[#4A4A48]">Gesamtpreis:</p>
              <p className="font-display text-2xl text-[#5B5B38] font-light">{total.toFixed(2)}€</p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              {/* Proceed to Checkout */}
              <Link
                href="/checkout"
                className="w-full bg-[#5B5B38] text-[#F8F5F0] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-6 lg:px-8 py-3 lg:py-4 rounded-sm hover:bg-[#424226] transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
                onClick={() => setShowCartSidebar(false)}
              >
                <span>Zur Kasse</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* View Cart */}
              <Link
                href="/cart"
                className="w-full bg-white text-[#5B5B38] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-6 lg:px-8 py-3 lg:py-4 rounded-sm border border-[#E5E0D8] hover:bg-[#F8F5F0] transition-all duration-300 flex items-center justify-center gap-2 group"
                onClick={() => setShowCartSidebar(false)}
              >
                <span>Zum Warenkorb</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Continue Shopping */}
              <button
                onClick={() => setShowCartSidebar(false)}
                className="w-full bg-transparent text-[#5B5B38] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-6 lg:px-8 py-3 lg:py-4 rounded-sm hover:bg-[#F0EBE3] transition-all duration-300"
              >
                Weiter einkaufen
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
