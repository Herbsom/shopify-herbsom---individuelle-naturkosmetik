/**
 * Product Page – AHA & PHA Peeling
 * Design: Shopify Stretch Theme inspiriert, Herbsom-Stil
 */
import { useState } from "react";
import { Star, ChevronRight, Minus, Plus, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useRouter } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import ProductRatingHeader from "@/components/ProductRatingHeader";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
export default function ProductPeelingAHA() {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState("effects");
  const [activeImage, setActiveImage] = useState(0);
  const relatedProducts = [
    { name: "Reinigungsmilch", href: "/product/cleaner-milk", src: "/manus-storage/Reinigungsmilch_9b8c254d.webp" },
    { name: "Sonnenschutzfluid SPF 50+", href: "/product/sunscreen", src: "/manus-storage/hf_20260616_214302_5233e72b-a663-4b93-a6d9-685e4cbb5b18_94230957.png" },
  ];
  const tabs = [
    { id: "effects", label: "Hauptwirkungen" },
    { id: "activeIngredients", label: "Wirkstoffe" },
    { id: "ingredients", label: "Inhaltsstoffe" },
    { id: "usage", label: "Anwendung" },
    { id: "details", label: "Details" },
  ];
  const images = [
    { id: 0, src: "/manus-storage/aha_pha_peeling_28c54361.webp" },
    { id: 1, src: "/manus-storage/aha_pha_peeling_2_1b8c68dd.webp" },
  ];
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 md:pt-24">
        {/* ─── BACK BUTTON ─────────────────────────────────────────── */}
        <div className="py-0">
          <div className="container">
            <Link href="/peelings">
              <a className="inline-flex items-center gap-2 text-[#5B5B38] hover:text-[#5B5B38]/70 transition-colors text-sm md:text-base">
                <ArrowLeft size={18} />
                <span>Zurück</span>
              </a>
            </Link>
          </div>
        </div>
        {/* ─── PRODUCT HERO ─────────────────────────────────────────── */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {/* Product Gallery */}
              <div className="flex flex-col gap-4">
                <div className="bg-[#F0EBE3] rounded-sm aspect-square flex items-center justify-center overflow-hidden group cursor-zoom-in">
                  <img src={images[activeImage].src} alt="AHA & PHA Peeling" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`bg-[#F0EBE3] rounded-sm flex items-center justify-center overflow-hidden transition-all h-20 w-20 flex-shrink-0 ${
                          activeImage === i
                            ? "ring-2 ring-[#5B5B38]"
                            : "hover:opacity-70"
                        }`}
                      >
                        <img src={img.src} alt={`Product ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-3 py-1 mb-4">
                    Für alle Hauttypen
                  </span>
                  <h1
                    className="font-display text-4xl md:text-5xl text-[#1C1C1A] mb-4 font-light"
                  >
                    AHA & PHA Peeling
                  </h1>
                  <ProductRatingHeader productId="peeling-aha" productName="AHA & PHA Peeling" />
                  <p className="font-display text-3xl text-[#5B5B38] font-light">
                    €42,00
                  </p>
                  <p className="font-body text-sm text-[#6B6B69]">200ml</p>
                </div>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-8">
                  Sanfte chemische Exfoliation für strahlende Haut. Mit AHA & PHA für optimale Zellerneuerung. Ideal für alle Hauttypen, auch sensible Haut.
                </p>
                {/* Features */}
                <div className="space-y-3 mb-8 pb-8 border-b border-[#E5E0D8]">
                  {[
                    "Sanfte chemische Exfoliation",
                    "Mit AHA & PHA für optimale Wirkung",
                    "Fördert Zellerneuerung",
                    "Für alle Hauttypen geeignet",
                    "Bis zu 3x pro Woche anwendbar",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#5B5B38] mt-1 font-semibold">✓</span>
                      <span className="font-body text-sm text-[#6B6B69]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Quantity & CTAs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-body text-sm text-[#6B6B69]">
                      Menge:
                    </span>
                    <div className="flex items-center border border-[#E5E0D8] rounded-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-[#F0EBE3] transition-colors"
                      >
                        <Minus size={16} className="text-[#5B5B38]" />
                      </button>
                      <span className="px-4 font-body text-sm">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-[#F0EBE3] transition-colors"
                      >
                        <Plus size={16} className="text-[#5B5B38]" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        addItem({ id: "peeling-aha", name: "AHA & PHA Peeling", price: 29, quantity });
                                              }}
                      className="w-full bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-6 py-3 hover:bg-[#424226] transition-all duration-300 active:scale-[0.97]"
                    >
                      In den Warenkorb
                    </button>
                  </div>
                  <div className="pt-4 border-t border-[#E5E0D8] space-y-2 text-center">
                    <p className="font-body text-xs text-[#6B6B69]">
                      ✓ Kostenloser Versand ab 50 €
                    </p>
                    <p className="font-body text-xs text-[#6B6B69]">
                      ✓ 30 Tage Rückgabe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ─── TABS SECTION ─────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-[#F8F5F0]">
          <div className="container max-w-4xl">
            <div className="flex gap-8 mb-12 border-b border-[#E5E0D8] overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-body text-sm tracking-[0.05em] uppercase pb-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#5B5B38] text-[#5B5B38]"
                      : "border-transparent text-[#6B6B69] hover:text-[#5B5B38]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="space-y-6">
              {activeTab === "effects" && (
                <div className="space-y-6">
                  <div>
                    <h4
                      className="font-display text-lg text-[#5B5B38] mb-2 font-light"
                    >
                      Sanfte chemische Exfoliation
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Das AHA & PHA Peeling bietet eine sanfte, aber effektive chemische Exfoliation. Mit Glykolsäure (AHA) und Gluconolacton (PHA) für optimale Zellerneuerung ohne Irritation.
                    </p>
                  </div>
                  <div>
                    <h4
                      className="font-display text-lg text-[#5B5B38] mb-2 font-light"
                    >
                      Strahlende & glatte Haut
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Fördert die Zellerneuerung und verbessert die Hautstruktur. Ideal für alle Hauttypen, auch sensible Haut, da PHA sanfter wirkt als AHA allein.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "activeIngredients" && (
                <div className="space-y-4">
                  {[
                    {
                      name: "Glykolsäure (AHA)",
                      desc: "Chemische Exfoliation und Zellerneuerung",
                    },
                    {
                      name: "Gluconolacton (PHA)",
                      desc: "Sanftere Exfoliation mit Feuchtigkeitspflege",
                    },
                    {
                      name: "Niacinamid (Vitamin B3)",
                      desc: "Reguliert Talgproduktion und verfeinert Poren",
                    },
                    {
                      name: "Panthenol (Provitamin B5)",
                      desc: "Beruhigend und feuchtigkeitsspendend",
                    },
                  ].map((ingredient, i) => (
                    <div key={i} className="pb-4 border-b border-[#E5E0D8] last:border-b-0">
                      <h4 className="font-body font-semibold text-sm text-[#5B5B38] mb-2">{ingredient.name}</h4>
                      <p className="font-body text-sm text-[#6B6B69] leading-relaxed">{ingredient.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "ingredients" && (
                <div className="space-y-4">
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
                          { inci: "Glycolic Acid", name: "Glykolsäure (AHA)", desc: "Chemische Exfoliation und Zellerneuerung" },
                          { inci: "Gluconolactone", name: "Gluconolacton (PHA)", desc: "Sanftere Exfoliation mit Feuchtigkeitspflege" },
                          { inci: "Pentylene Glycol", name: "Pentylene Glycol", desc: "Natürlicher Feuchtigkeitsspender und Konservierer" },
                          { inci: "Propanediol", name: "Propanediol", desc: "Natürliches Feuchthaltemittel" },
                          { inci: "Glycerin", name: "Pflanzliches Glycerin", desc: "Intensiver pflanzlicher Feuchtigkeitsspender" },
                          { inci: "Niacinamide", name: "Niacinamid (Vitamin B3)", desc: "Reguliert Talgproduktion und verfeinert Poren" },
                          { inci: "Panthenol", name: "Provitamin B5", desc: "Beruhigend und feuchtigkeitsspendend" },
                          { inci: "Allantoin", name: "Allantoin", desc: "Hautberuhigend, pflegend, glättend, hauterneuernd" },
                          { inci: "Sodium Hydroxide", name: "Natriumhydroxid", desc: "pH-Regulator für optimale Wirkstofffreigabe" },
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
              )}
              {activeTab === "usage" && (
                <div className="space-y-6">
                  {[
                    {
                      step: "1. Häufigkeit",
                      desc: "Bis zu dreimal in der Woche auf die gereinigte Haut von Gesicht und Dekolleté auftragen.",
                    },
                    {
                      step: "2. Anwendung",
                      desc: "Das Peeling kann auf der Haut verbleiben oder nach 10-15 Minuten abgewaschen werden.",
                    },
                    {
                      step: "3. Einwirkzeit",
                      desc: "Lasse das Peeling mindestens 10-15 Minuten einwirken für beste Ergebnisse.",
                    },
                    {
                      step: "4. Sonnenschutz",
                      desc: "Bei regelmäßiger Nutzung achte auf täglichen Sonnenschutz (SPF 30+).",
                    },
                    {
                      step: "5. Empfindliche Haut",
                      desc: "Bei sehr empfindlicher Haut mit 1-2x pro Woche beginnen und langsam steigern.",
                    },
                  ].map((step, i) => (
                    <div key={i}>
                      <h4 className="font-display text-lg text-[#5B5B38] mb-2 font-light">
                        {step.step}
                      </h4>
                      <p className="font-body text-sm text-[#6B6B69]">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "details" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-body text-xs tracking-[0.1em] uppercase text-[#6B6B69] mb-2">
                        Größe
                      </p>
                      <p className="font-body text-base text-[#1C1C1A]">
                        200 ml
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-[0.1em] uppercase text-[#6B6B69] mb-2">
                        Haltbarkeit
                      </p>
                      <p className="font-body text-base text-[#1C1C1A]">
                        12 Monate nach Öffnung
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-[0.1em] uppercase text-[#6B6B69] mb-2">
                        Lagerung
                      </p>
                      <p className="font-body text-base text-[#1C1C1A]">
                        Kühl und trocken
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-[0.1em] uppercase text-[#6B6B69] mb-2">
                        Hauttypen
                      </p>
                      <p className="font-body text-base text-[#1C1C1A]">
                        Alle Hauttypen
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* ─── REVIEWS SECTION ─────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-[#F8F5F0]">
          <div className="container max-w-4xl">
            <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-12 font-light">
              Bewertungen
            </h2>
            <div className="space-y-12">
              {/* Reviews List */}
              <div className="max-w-2xl mx-auto">
                <ReviewList productId="peeling-aha" />
              </div>
              {/* Review Form */}
              <div>
                {(() => {
                  const { user, loading } = useAuth();
                  if (loading) return <div className="text-center py-8 text-[#6B6B69]">Wird geladen...</div>;
                  if (!user) {
                    return (
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
                    );
                  }
                  return <ReviewForm productId="peeling-aha" />;
                })()}
              </div>
            </div>
          </div>
        </section>
        {/* ─── RELATED PRODUCTS ─────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-[#F8F5F0]">
          <div className="container max-w-4xl">
            <h2
              className="font-display text-3xl text-[#1C1C1A] mb-12 font-light"
            >
              Diese Produkte passen dazu
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {relatedProducts.map((prod, i) => (
                <Link key={i} href={prod.href}>
                  <div className="group cursor-pointer">
                    <div className="bg-[#F0EBE3] rounded-sm aspect-square flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <img src={prod.src} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <h3
                      className="font-display text-sm text-[#1C1C1A] font-light group-hover:text-[#5B5B38] transition-colors line-clamp-2"
                    >
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#5B5B38] font-body text-xs tracking-[0.12em] uppercase mt-2 group-hover:gap-2 transition-all">
                      Ansehen
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* ─── CTA SECTION ──────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2
              className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light"
            >
              Finde deine perfekte Hautpflege-Routine
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Nicht sicher, welche Produkte zu dir passen? Starte unseren Hauttest und erhalte personalisierte Empfehlungen.
            </p>
            <a
              href="/#hauttest"
              className="inline-block border border-[#F8F5F0] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-8 py-3 hover:bg-[#F8F5F0] hover:text-[#5B5B38] transition-all duration-300"
            >
              Hauttest starten
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
