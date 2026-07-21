/*
 * Bestellbestätigung – Herbsom
 * Wird nach erfolgreichem Checkout angezeigt
 */
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useSearch } from "wouter";
import { useTranslation } from "react-i18next";

export default function OrderConfirmation() {
  const { t } = useTranslation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navigation />

      <section className="pt-32 pb-24 md:pt-40 md:pb-36">
        <div className="container">
          <div className="max-w-lg mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-[#5B5B38]/10 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-[#5B5B38]" />
              </div>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-[#1C1C1A] font-light mb-4">
              Vielen Dank!
            </h1>

            <p className="font-body text-base text-[#6B6B69] mb-2">
              Deine Bestellung wurde erfolgreich aufgegeben.
            </p>

            {orderId && (
              <p className="font-body text-sm text-[#7D7D5D] mb-8">
                Bestellnummer: <span className="text-[#5B5B38] font-medium">#{orderId}</span>
              </p>
            )}

            {/* Info Box */}
            <div className="bg-white border border-[#E5E0D8] p-8 mb-10 text-left">
              <div className="flex items-start gap-4">
                <Package size={20} className="text-[#5B5B38] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-lg text-[#1C1C1A] font-light mb-2">
                    Was passiert als Nächstes?
                  </h3>
                  <ul className="space-y-2">
                    <li className="font-body text-sm text-[#6B6B69]">
                      Du erhältst eine Bestätigungs-E-Mail mit den Bestelldetails.
                    </li>
                    <li className="font-body text-sm text-[#6B6B69]">
                      Deine Bestellung wird sorgfältig für den Versand vorbereitet.
                    </li>
                    <li className="font-body text-sm text-[#6B6B69]">
                      Du kannst den Status jederzeit in deinem Konto einsehen.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/account"
                className="flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-[#F8F5F0] bg-[#5B5B38] px-6 py-4 hover:bg-[#424226] transition-all duration-200 active:scale-[0.97]"
              >
                Meine Bestellungen
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-[#5B5B38] border border-[#5B5B38] px-6 py-4 hover:bg-[#5B5B38] hover:text-[#F8F5F0] transition-all duration-200 active:scale-[0.97]"
              >
                Weiter einkaufen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
