import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Gutschein() {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const amounts = [25, 50, 75, 100, 150, 200];

  const { addItem } = useCart();
  const handleAddToCart = () => {
    if (!selectedAmount) {
      toast.error("Bitte wählen Sie einen Gutschein-Betrag");
      return;
    }
    addItem({
      id: `gutschein-${selectedAmount}`,
      name: `Geschenkgutschein ${selectedAmount}€`,
      price: selectedAmount,
      quantity,
    });
    toast.success(`${quantity}x Gutschein(e) à ${selectedAmount}€ in den Warenkorb`);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 px-4">
        <div className="container max-w-3xl">
          <div className="text-center">
            <p className="text-xs md:text-sm text-[#7D7D5D] tracking-widest uppercase mb-4">
              Geschenk
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-[#1C1C1A] mb-6 font-light">
              Herbsom Gutschein
            </h1>
            <p className="font-body text-base md:text-lg text-[#4A4A48] leading-relaxed">
              Verschenke hochwertige Naturkosmetik und lass deine Liebsten ihre perfekte Hautpflege selbst zusammenstellen
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-[#5B5B38] text-[#F8F5F0] py-12 md:py-16 px-4">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F8F5F0]/10 mb-4">
                <span className="font-display text-lg text-[#F8F5F0]">✓</span>
              </div>
              <h3 className="font-display text-sm uppercase tracking-wider mb-2">Flexibel</h3>
              <p className="font-body text-xs leading-relaxed">
                Der Empfänger wählt seine Lieblingsprodukte selbst
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F8F5F0]/10 mb-4">
                <span className="font-display text-lg text-[#F8F5F0]">✓</span>
              </div>
              <h3 className="font-display text-sm uppercase tracking-wider mb-2">Digital</h3>
              <p className="font-body text-xs leading-relaxed">
                Sofortiger Versand per E-Mail
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F8F5F0]/10 mb-4">
                <span className="font-display text-lg text-[#F8F5F0]">✓</span>
              </div>
              <h3 className="font-display text-sm uppercase tracking-wider mb-2">Persönlich</h3>
              <p className="font-body text-xs leading-relaxed">
                Mit persönlicher Nachricht gestaltbar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gutschein Selection */}
      <section className="py-16 md:py-20 px-4">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-12 text-center font-light">
            Wähle deinen Gutschein-Betrag
          </h2>

          {/* Amount Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`p-6 rounded-sm border-2 transition-all duration-300 ${
                  selectedAmount === amount
                    ? "border-[#5B5B38] bg-[#5B5B38] text-[#F8F5F0]"
                    : "border-[#E5E0D8] bg-white text-[#1C1C1A] hover:border-[#5B5B38]"
                }`}
              >
                <div className="font-display text-2xl md:text-3xl font-light">{amount}€</div>
              </button>
            ))}
          </div>

          {/* Quantity Selector */}
          {selectedAmount && (
            <div className="mb-8 p-6 bg-white border border-[#E5E0D8] rounded-sm">
              <label className="font-body text-sm text-[#1C1C1A] mb-3 block">
                Anzahl Gutscheine
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-[#E5E0D8] hover:bg-[#F8F5F0] transition-colors"
                >
                  −
                </button>
                <span className="font-display text-lg text-[#1C1C1A] w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-[#E5E0D8] hover:bg-[#F8F5F0] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Total Price */}
          {selectedAmount && (
            <div className="mb-8 p-6 bg-[#F8F5F0] border border-[#E5E0D8] rounded-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="font-body text-[#4A4A48]">Gesamtpreis:</span>
                <span className="font-display text-3xl text-[#1C1C1A]">
                  {selectedAmount * quantity}€
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#5B5B38] text-[#F8F5F0] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-6 lg:px-8 py-3 lg:py-4 rounded-sm hover:bg-[#424226] transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
              >
                <ShoppingBag size={16} />
                In den Warenkorb
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="p-6 bg-white border border-[#E5E0D8] rounded-sm">
            <h3 className="font-display text-sm text-[#5B5B38] mb-4 uppercase tracking-wider">
              So funktioniert es
            </h3>
            <ul className="space-y-3 font-body text-sm text-[#4A4A48]">
              <li className="flex gap-3">
                <span className="text-[#5B5B38] font-light">1.</span>
                <span>Wähle einen Betrag und die Anzahl der Gutscheine</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#5B5B38] font-light">2.</span>
                <span>Füge sie in den Warenkorb und gehe zur Kasse</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#5B5B38] font-light">3.</span>
                <span>Der Gutschein wird sofort per E-Mail versendet</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#5B5B38] font-light">4.</span>
                <span>Der Empfänger kann seinen Gutschein einlösen und seine Routine zusammenstellen</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F8F5F0] py-8 md:py-12 px-4">
        <div className="container max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-12 text-center font-light">
            Das sagen unsere Kunden
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Anna M.",
                location: "München",
                text: "Das perfekte Geschenk für meine Schwester! Sie konnte sich ihre Routine selbst zusammenstellen.",
              },
              {
                name: "Lisa K.",
                location: "Berlin",
                text: "Schnelle Lieferung und wunderschön verpackt. Der Gutschein war sofort verfügbar!",
              },
              {
                name: "Sarah B.",
                location: "Hamburg",
                text: "Meine beste Freundin liebt ihre neue Hautpflege-Routine. Ein wirklich durchdachtes Geschenk.",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 bg-white border border-[#E5E0D8]">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#5B5B38]">
                      ★
                    </span>
                  ))}
                </div>
                <p className="font-body text-sm text-[#4A4A48] mb-4 leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5B5B38] flex items-center justify-center">
                    <span className="font-display text-sm text-[#F8F5F0]">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-xs font-light text-[#1C1C1A]">
                      {testimonial.name}
                    </p>
                    <p className="font-body text-xs text-[#7D7D5D]">{testimonial.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#5B5B38] text-[#F8F5F0] py-16 md:py-20 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-6 font-light">
            Bereit zum Schenken?
          </h2>
          <p className="font-body text-base md:text-lg mb-8 leading-relaxed">
            Wähle einen Gutschein-Betrag oben aus und verschenke hochwertige Naturkosmetik
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-[#F8F5F0] text-[#5B5B38] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-8 lg:px-10 py-4 lg:py-5 rounded-sm hover:bg-[#E8E3DB] transition-all duration-300 flex items-center gap-2 group shadow-md hover:shadow-lg hover:scale-105 mx-auto inline-flex"
          >
            <span className="whitespace-nowrap">Zum Gutschein</span>
            <ArrowRight size={16} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
