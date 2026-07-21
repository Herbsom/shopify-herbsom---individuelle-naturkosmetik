import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "wouter";

/**
 * Compatibility route for former internal checkout links.
 * Customer authentication, address, discounts, taxes, payment and order
 * creation now happen exclusively in Shopify's hosted checkout.
 */
export default function Checkout() {
  const { cart, loading, proceedToCheckout } = useCart();
  const redirected = useRef(false);

  useEffect(() => {
    if (!loading && cart?.checkoutUrl && !redirected.current) {
      redirected.current = true;
      proceedToCheckout();
    }
  }, [cart?.checkoutUrl, loading, proceedToCheckout]);

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navigation />
      <main className="flex min-h-[78vh] items-center py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl border border-[#E5E0D8] bg-white p-10 text-center md:p-16">
            <ShieldCheck size={42} className="mx-auto mb-6 text-[#5B5B38]" strokeWidth={1.4} />
            <p className="section-label mb-3">Sicherer Shopify-Checkout</p>
            <h1 className="font-display text-3xl font-light text-[#1C1C1A] md:text-5xl">
              {cart?.checkoutUrl ? "Du wirst zur Kasse weitergeleitet" : "Dein Warenkorb ist leer"}
            </h1>
            <p className="mx-auto mt-5 max-w-lg font-body text-sm leading-relaxed text-[#6B6B69]">
              {cart?.checkoutUrl
                ? "Kundenkonto, Lieferadresse, Rabatte, Steuern, Zahlung und Bestellbestätigung werden vollständig von Shopify verarbeitet."
                : "Lege zuerst ein Produkt in den Warenkorb, um den Shopify-Checkout zu starten."}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              {cart?.checkoutUrl ? (
                <button
                  type="button"
                  onClick={proceedToCheckout}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-[#5B5B38] px-7 py-4 font-body text-xs uppercase tracking-[0.14em] text-[#F8F5F0] transition-all hover:bg-[#424226] active:scale-[0.97] disabled:opacity-60"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                  Shopify-Checkout öffnen
                </button>
              ) : (
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center gap-2 border border-[#5B5B38] px-7 py-4 font-body text-xs uppercase tracking-[0.14em] text-[#5B5B38] transition-colors hover:bg-[#F0EBE3]"
                >
                  <ArrowLeft size={15} />
                  Zum Warenkorb
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
