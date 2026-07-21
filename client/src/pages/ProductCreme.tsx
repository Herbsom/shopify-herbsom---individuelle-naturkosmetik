/*
 * Product Page – Individuelle Creme
 * Design: Elegante Serif-Typografie, Grüntöne #5B5B38, #7D7D5D, #424226
 */
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import ProductRatingHeader from "@/components/ProductRatingHeader";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { ArrowRight, Star, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
// Scroll reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    const elements = ref.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}
export default function ProductCreme() {
  const { t } = useTranslation();
  const pageRef = useScrollReveal();
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'quarterly'>('monthly');
  const { addItem } = useCart();
  const { user, loading } = useAuth();
  return (
    <div ref={pageRef} className="min-h-screen bg-[#F8F5F0]">
      <Navigation />
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="pt-40 md:pt-48 pb-24 md:pb-36">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Image */}
            <div className="reveal">
              <div className="aspect-square bg-gradient-to-br from-[#F0EBE3] to-[#E8E3DB] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🧴</div>
                  <p className="text-[#7D7D5D]">Produktbild</p>
                </div>
              </div>
            </div>
            {/* Content */}
            <div>
              <div className="mb-6 reveal">
                <span className="inline-block font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-3 py-1 mb-4">
                  Neu
                </span>
                <h1
                  className="font-display text-5xl md:text-6xl text-[#1C1C1A] leading-tight mb-4"
                >
                  Individuelle Gesichtscreme
                </h1>
                <ProductRatingHeader productId="creme" productName="Individuelle Gesichtscreme" />
              </div>
              <div className="mb-8 reveal reveal-delay-1">
                <p
                  className="font-display text-3xl text-[#5B5B38] font-light mb-4"
                >
                  Ab €26,00
                </p>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-6">
                  Reichhaltige Pflege mit botanischen Extrakten. Formuliert nach deiner persönlichen Hautanalyse für optimale Hydration und Regeneration.
                </p>
              </div>
              <div className="space-y-4 mb-10 reveal reveal-delay-2">
                {[
                  "Reichhaltige, nährende Textur",
                  "Mit botanischen Extrakten",
                  "Individuell auf deinen Hauttyp abgestimmt",
                  "Für alle Hauttypen geeignet",
                  "Dermatologisch getestet",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check size={18} className="text-[#7D7D5D] flex-shrink-0" />
                    <span className="font-body text-sm text-[#4A4A48]">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 reveal reveal-delay-3">
                {/* Subscription Toggle */}
                <div className="border border-[#E5E0D8] rounded-sm p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSubscription}
                      onChange={(e) => setIsSubscription(e.target.checked)}
                      className="w-4 h-4 accent-[#5B5B38]"
                    />
                    <span className="font-body text-sm text-[#6B6B69]">
                      Als Abonnement bestellen
                    </span>
                  </label>
                  {isSubscription && (
                    <div className="mt-3 ml-7">
                      <label className="block font-body text-xs text-[#7D7D5D] mb-2 uppercase tracking-[0.1em]">
                        Lieferhäufigkeit
                      </label>
                      <select
                        value={subscriptionFrequency}
                        onChange={(e) => setSubscriptionFrequency(e.target.value as any)}
                        className="w-full border border-[#E5E0D8] rounded-sm p-2 font-body text-sm text-[#6B6B69] bg-white"
                      >
                        <option value="weekly">Wöchentlich</option>
                        <option value="biweekly">Alle 2 Wochen</option>
                        <option value="monthly">Monatlich</option>
                        <option value="quarterly">Vierteljährlich</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      addItem({ 
                        id: "creme-individuell", 
                        name: "Individuelle Gesichtscreme", 
                        price: 39, 
                        quantity: 1,
                        isSubscription,
                        subscriptionFrequency: isSubscription ? subscriptionFrequency : undefined
                      });
                      toast.success(isSubscription ? 'Abonnement hinzugefügt!' : 'Zum Warenkorb hinzugefügt!');
                    }}
                    className="btn-outline-dark"
                  >
                    {isSubscription ? 'Abonnement starten' : 'In den Warenkorb'}
                  </button>
                  <a href="/#hauttest" className="btn-outline-dark">
                    Hauttest starten
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── DETAILS SECTION ──────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#5B5B38]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="section-label text-[#7D7D5D] mb-8 reveal">Produktdetails</p>
            <h2
              className="font-display text-4xl md:text-5xl text-[#F8F5F0] font-light leading-tight mb-12 reveal reveal-delay-1"
            >
              Perfekte Hydration für deine Haut.
            </h2>
            <div className="space-y-8 reveal reveal-delay-2">
              <div>
                <h3 className="font-display text-2xl text-[#F8F5F0] font-light mb-3">
                  Wie funktioniert es?
                </h3>
                <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                  Unsere Creme wird speziell für deinen Hauttyp formuliert. Mit dem richtigen Mix aus Wirkstoffen und botanischen Extrakten bietet sie die perfekte Balance zwischen Hydration und Nährstoffen.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl text-[#F8F5F0] font-light mb-3">
                  Wirkstoffe
                </h3>
                <div className="overflow-hidden rounded-lg border border-[#7D7D5D]/30 overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#7D7D5D]/20">
                        <th className="text-left px-3 md:px-4 py-2 font-semibold text-xs md:text-sm font-body text-[#F8F5F0]">Wirkstoff</th>
                        <th className="text-left px-3 md:px-4 py-2 font-semibold text-xs md:text-sm font-body text-[#F8F5F0]">Funktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "Sheabutter",
                          desc: "Intensive Feuchtigkeitspflege und Nährstoffversorgung",
                        },
                        {
                          name: "Hyaluronsäure",
                          desc: "Tiefe Hydration und Hautstraffung",
                        },
                        {
                          name: "Vitamin E",
                          desc: "Antioxidantien für Hautschutz und Regeneration",
                        },
                        {
                          name: "Panthenol",
                          desc: "Beruhigung und Feuchtigkeitsbindung",
                        },
                      ].map((ingredient, i) => (
                        <tr key={i} className="border-t border-[#7D7D5D]/20">
                          <td className="px-3 md:px-4 py-2 text-[#E8E3DB] text-xs md:text-sm font-body">{ingredient.name}</td>
                          <td className="px-3 md:px-4 py-2 text-[#E8E3DB] text-xs md:text-sm font-body">{ingredient.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl text-[#F8F5F0] font-light mb-3">
                  Anwendung
                </h3>
                <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                  Trage die Creme morgens und abends auf die gereinigte Haut auf. Verwende eine erbsengroße Menge und verteile sie sanft im Gesicht und am Hals. Für beste Ergebnisse vor dem Serum verwenden.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl text-[#F8F5F0] font-light mb-3">
                  Größe & Haltbarkeit
                </h3>
                <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                  30 ml oder 50 ml · Haltbar für 12 Monate nach Öffnung · Kühl und trocken lagern · Nicht in direktem Sonnenlicht aufbewahren
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── REVIEWS SECTION ──────────────────────────────────────────── */}
      <section id="reviews-section" className="py-24 md:py-36">
        <div className="container">
          <div className="mb-16 reveal">
            <p className="section-label mb-3">Kundenbewertungen</p>
            <h2
              className="font-display text-4xl md:text-5xl text-[#1C1C1A] font-light"
            >
              Was Kunden sagen.
            </h2>
          </div>
          <div className="space-y-12">
            {/* Reviews List */}
            <div className="max-w-2xl mx-auto">
              <ReviewList productId="creme" />
            </div>
            {/* Review Form */}
            <div className="max-w-2xl mx-auto">
              {loading ? (
                <div className="text-center py-8 text-[#6B6B69]">Wird geladen...</div>
              ) : !user ? (
                <div className="bg-[#F0EBE3] p-6 rounded-lg text-center">
                  <p className="font-body text-sm text-[#6B6B69] mb-4">
                    Melde dich an, um eine Bewertung zu hinterlassen.
                  </p>
                  <a
                    href={getLoginUrl()}
                    className="inline-block bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-6 py-3 hover:bg-[#424226] transition-all duration-300"
                  >
                    Anmelden
                  </a>
                </div>
              ) : (
                <ReviewForm productId="creme" />
              )}
            </div>
          </div>
        </div>
      </section>
      {/* ─── INGREDIENTS SECTION ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#F8F5F0]">
        <div className="container max-w-4xl">
          <h2 className="font-display text-4xl md:text-5xl text-[#1C1C1A] font-light mb-4 text-center reveal">
            Wirkstoffe & Inhaltsstoffe
          </h2>
          <p className="font-body text-base text-[#6B6B69] text-center mb-12 reveal reveal-delay-1">
            Hochwertige, natürliche Inhaltsstoffe für optimale Hautpflege.
          </p>
          <div className="space-y-8 reveal reveal-delay-2">
            {/* Wirkstoffe */}
            <div>
              <h3 className="font-display text-2xl text-[#5B5B38] mb-4 font-light">Haupt-Wirkstoffe</h3>
              <div className="space-y-4">
                {[
                  {
                    name: "Hyaluronsäure",
                    desc: "Intensive Feuchtigkeitspflege und Hautvolumen",
                  },
                  {
                    name: "Niacinamid (Vitamin B3)",
                    desc: "Reguliert Talgproduktion und verfeinert Poren",
                  },
                  {
                    name: "Panthenol (Provitamin B5)",
                    desc: "Beruhigend und feuchtigkeitsspendend",
                  },
                  {
                    name: "Vitamin E",
                    desc: "Antioxidans und Hautschutz vor freien Radikalen",
                  },
                ].map((ingredient, i) => (
                  <div key={i} className="pb-4 border-b border-[#E5E0D8] last:border-b-0">
                    <h4 className="font-body font-semibold text-sm text-[#5B5B38] mb-2">{ingredient.name}</h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">{ingredient.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Inhaltsstoffe */}
            <div>
              <h3 className="font-display text-2xl text-[#5B5B38] mb-4 font-light">Vollständige Inhaltsstoffe (INCI)</h3>
              <div className="overflow-hidden rounded-lg border border-[#5B5B38]/20 overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[#5B5B38]/10">
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">INCI</th>
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">Name</th>
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">Funktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { inci: "Aqua", name: "Wasser", desc: "Wasser als Basis" },
                      { inci: "Glycerin", name: "Pflanzliches Glycerin", desc: "Intensiver pflanzlicher Feuchtigkeitsspender" },
                      { inci: "Hyaluronic Acid", name: "Hyaluronsäure", desc: "Intensive Feuchtigkeitspflege und Hautvolumen" },
                      { inci: "Niacinamide", name: "Niacinamid (Vitamin B3)", desc: "Reguliert Talgproduktion und verfeinert Poren" },
                      { inci: "Panthenol", name: "Provitamin B5", desc: "Beruhigend und feuchtigkeitsspendend" },
                      { inci: "Tocopherol", name: "Vitamin E", desc: "Antioxidans und Hautschutz vor freien Radikalen" },
                      { inci: "Cetyl Alcohol", name: "Cetylalkohol", desc: "Natürlicher Emulgator und Texturmittel" },
                      { inci: "Stearic Acid", name: "Stearinsäure", desc: "Natürlicher Emulgator und Konsistenzgeber" },
                      { inci: "Xanthan Gum", name: "Xanthan Gum", desc: "Feuchtigkeitsbindend, straffend und glättend" },
                      { inci: "Citric Acid", name: "Zitronensäure", desc: "pH-Puffer und Antioxidans" },
                    ].map((item, i) => (
                      <tr key={i} className="border-t border-[#5B5B38]/10">
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.inci}</td>
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.name}</td>
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── CTA SECTION ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#5B5B38]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2
              className="font-display text-4xl md:text-5xl text-[#F8F5F0] font-light mb-6"
            >
              Bereit für deine individuelle Formel?
            </h2>
            <p className="font-body text-base text-[#E8E3DB] leading-relaxed mb-10 reveal reveal-delay-1">
              Starte unseren intelligenten Hauttest und erhalte deine persönliche Creme-Empfehlung.
            </p>
            <a
              href="/#hauttest"
              className="btn-outline-light inline-flex items-center gap-2 reveal reveal-delay-2"
            >
              Hauttest starten <ArrowRight size={14} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
