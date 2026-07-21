/**
 * Product Page – Sonnenschutzfluid SPF 50+
 * Design: Shopify Stretch Theme inspiriert, Herbsom-Stil
 * Farben: #5B5B38, #7D7D5D, #424226
 * Typografie: Cormorant Garamond (Headlines), Inter (Body)
 */
import { useState } from "react";
import { Star, ChevronRight, Minus, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import ProductRatingHeader from "@/components/ProductRatingHeader";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
export default function ProductSunscreen() {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState("effects");
  const [activeImage, setActiveImage] = useState(0);
  const relatedProducts = [
    { name: "Reinigungsgel", href: "/product/cleaner", src: "/manus-storage/Reinigungsgel_bcbacfba.webp" },
    { name: "AHA & PHA Peeling", href: "/product/peeling/aha", src: "/manus-storage/aha_pha_peeling_1x1_white_aad680df.webp" },
  ];
  const tabs = [
    { id: "effects", label: "Hauptwirkungen" },
    { id: "activeIngredients", label: "Wirkstoffe" },
    { id: "ingredients", label: "Inhaltsstoffe" },
    { id: "usage", label: "Anwendung" },
    { id: "details", label: "Details" },
  ];
  const images = [
    { id: 0, src: "/manus-storage/hf_20260616_214302_5233e72b-a663-4b93-a6d9-685e4cbb5b18_94230957.png" },
    { id: 1, src: "/manus-storage/hf_20260616_214514_0e1dcffd-1470-4f0b-aa37-7ef5266f1fba_4fbcaee3.png" },
  ];
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 md:pt-24">
        {/* ─── PRODUCT HERO ─────────────────────────────────────────── */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {/* Product Gallery */}
              <div className="flex flex-col gap-4">
                <div className="bg-[#F0EBE3] rounded-sm aspect-square flex items-center justify-center overflow-hidden group cursor-zoom-in">
                  <img
                    src={images[activeImage].src}
                    alt="Sonnenschutzfluid"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
                        <img
                          src={img.src}
                          alt={`Sonnenschutzfluid ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-3 py-1 mb-4">
                    NEU – Sonnenschutz
                  </span>
                  <h1
                    className="font-display text-4xl md:text-5xl text-[#1C1C1A] mb-4 font-light"
                  >
                    Sonnenschutzfluid SPF 50+
                  </h1>
                  <ProductRatingHeader productId="sunscreen" productName="Sonnenschutzfluid SPF 50+" />
                  <p className="font-display text-3xl text-[#5B5B38] font-light">
                    €38,00
                  </p>
                </div>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-8">
                  Hocheffektiver Sonnenschutz mit mineralischen Filtern. Unser
                  Sonnenschutzfluid bietet zuverlässigen Schutz vor UV-Strahlung,
                  ohne die Haut zu beschweren. Mit antioxidantien für zusätzlichen
                  Hautschutz.
                </p>
                {/* Features */}
                <div className="space-y-3 mb-8 pb-8 border-b border-[#E5E0D8]">
                  {[
                    "Hocheffektiver Schutz SPF 50+",
                    "Mit mineralischen UV-Filtern",
                    "Leichte, nicht fettende Textur",
                    "Für alle Hauttypen geeignet",
                    "Dermatologisch getestet",
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
                        addItem({ id: "sunscreen-spf50", name: "Sonnenschutzfluid SPF 50+", price: 34, quantity });
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
                      Zuverlässiger UV-Schutz
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Das Sonnenschutzfluid bietet hocheffektiven Schutz vor UVA-
                      und UVB-Strahlung mit SPF 50+. Mit mineralischen Filtern
                      für einen physikalischen Schutz, der sofort wirksam ist.
                    </p>
                  </div>
                  <div>
                    <h4
                      className="font-display text-lg text-[#5B5B38] mb-2 font-light"
                    >
                      Leichte Textur
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Die leichte, nicht fettende Textur zieht schnell ein und
                      hinterlässt keinen weißen Film. Perfekt unter Make-up oder
                      als täglicher Sonnenschutz.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "activeIngredients" && (
                <div className="space-y-4">
                  {[
                    {
                      name: "Zinkoxid",
                      desc: "Mineralischer UV-Filter für UVA- und UVB-Schutz",
                    },
                    {
                      name: "Titandioxid",
                      desc: "Mineralischer UV-Filter für UVA- und UVB-Schutz",
                    },
                    {
                      name: "Vitamin E",
                      desc: "Antioxidans und Hautschutz vor freien Radikalen",
                    },
                    {
                      name: "Aloe Vera",
                      desc: "Beruhigend, feuchtigkeitsspendend und hautpflegend",
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
                          { inci: "Aqua", name: "Wasser", desc: "Lösungsmittel, Basis der Formulierung, Feuchtigkeitsspender" },
                          { inci: "Dibutyl Adipate", name: "Emollient", desc: "Verbessert Hautgefühl, macht die Haut geschmeidig" },
                          { inci: "Propylene Glycol Dicaprylate/Dicaprate", name: "Leichtes Hautöl", desc: "Was die Haut pflegt, ohne Poren zu verstopfen" },
                          { inci: "Polyglyceryl-10 Oleate", name: "Natürlicher Emulgator", desc: "Verbindet Wasser und Öl" },
                          { inci: "Phenylbenzimidazole Sulfonic Acid", name: "UVB-Filter", desc: "Schützt vor Sonnenbrand, Hautalterung und Hautkrebs" },
                          { inci: "Disodium Phenyl Dibenzimidazole Tetrasulfonate", name: "UV-Filter", desc: "Ergänzt UV-Schutzspektrum" },
                          { inci: "Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine", name: "Breitband-UV-Filter (Tinosorb S)", desc: "Schutz vor UVA- und UVB-Strahlung, sehr photostabil" },
                          { inci: "Glycerin", name: "Glycerin", desc: "Spendet Feuchtigkeit" },
                          { inci: "Diethylamino Hydroxybenzoyl Hexyl Benzoate", name: "UVA-Filter", desc: "Schützt vor Hautalterung durch UVA-Strahlen" },
                          { inci: "Hectorite", name: "Tonmineral", desc: "Natürliches Verdickungsmittel, stabilisiert die Textur" },
                          { inci: "Pentylene Glycol", name: "Feuchthaltemittel", desc: "Spendet Feuchtigkeit, leicht antimikrobiell" },
                          { inci: "Ethylhexyl Triazone", name: "UVB-Filter", desc: "Sehr effizienter Schutz vor UVB-Strahlen" },
                          { inci: "Terephthalylidene Dicamphor Sulfonic Acid", name: "UVA/UVB-Filter", desc: "Breitband-Schutz" },
                          { inci: "Tromethamine", name: "pH-Regulator", desc: "Stabilisiert den pH-Wert" },
                          { inci: "Propanediol", name: "Feuchthaltemittel", desc: "Spendet Feuchtigkeit, verbessert Aufnahme" },
                          { inci: "1,2-Hexanediol", name: "Feuchthaltemittel", desc: "Konservierend, feuchtigkeitsspendend" },
                          { inci: "Tocopherol", name: "Vitamin E", desc: "Antioxidativ, schützt vor freien Radikalen" },
                          { inci: "Lycopene", name: "Lycopin", desc: "Starkes Antioxidans" },
                          { inci: "Helianthus Annuus Seed Oil", name: "Sonnenblumenöl", desc: "Pflegend, antioxidativ" },
                          { inci: "Buddleja Officinalis Flower Extract", name: "Schmetterlingsflieder-Extrakt", desc: "Antioxidativ, schützt vor Umweltstress" },
                          { inci: "Ceramide NP", name: "Ceramid", desc: "Stärkt Hautbarriere" },
                          { inci: "2,3-Butanediol", name: "Feuchthaltemittel", desc: "Unterstützt Feuchtigkeitsversorgung" },
                          { inci: "Sodium Hyaluronate", name: "Hyaluronsäure", desc: "Bindet Wasser, polstert die Haut auf" },
                          { inci: "Tremella Fuciformis Extract", name: "Schneepilz-Extrakt", desc: "Spendet intensiv Feuchtigkeit, glättend" },
                          { inci: "Ascorbyl Isostearate", name: "Vitamin-C-Derivat", desc: "Antioxidativ, unterstützt Hautausgleichend" },
                          { inci: "Isostearic Acid", name: "Fettsäure", desc: "Stabilisiert Formulierung, pflegend" },
                          { inci: "Malva Sylvestris Flower Extract", name: "Malvenextrakt", desc: "Beruhigend, feuchtigkeitsspendend" },
                          { inci: "Hydrogenated Lecithin", name: "Lecithin", desc: "Unterstützt Hautbarriere, verbessert Aufnahme" },
                          { inci: "Leuconostoc/Radish Root Ferment Filtrate", name: "Ferment-Extrakt", desc: "Natürlicher Konservierer, pflegend" },
                          { inci: "Glyceryl Stearate", name: "Emulgator", desc: "Stabilisiert Emulsion" },
                          { inci: "Ceramide AP", name: "Ceramid", desc: "Stärkt Hautbarriere" },
                          { inci: "Ceramide AS", name: "Ceramid", desc: "Unterstützt Hautschutz" },
                          { inci: "Ceramide NG", name: "Ceramid", desc: "Regenerierend" },
                          { inci: "Cholesterol", name: "Cholesterin", desc: "Bestandteil der Hautbarriere" },
                          { inci: "Ascorbic Acid", name: "Vitamin C", desc: "Antioxidativ, fördert Kollagenbildung" },
                          { inci: "Ceramide EOP", name: "Ceramid", desc: "Unterstützt Hautstruktur und Feuchtigkeit" },
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
                      step: "0. Vorbereitung",
                      desc: "Schüttele die Flasche vor Gebrauch gründlich.",
                    },
                    {
                      step: "1. Vorbereitung",
                      desc: "Trage das Sonnenschutzfluid auf die gereinigte, trockene Haut auf.",
                    },
                    {
                      step: "2. Menge",
                      desc: "Verwende etwa eine erbsengroße bis münzgroße Menge für das Gesicht.",
                    },
                    {
                      step: "3. Verteilung",
                      desc: "Verteile das Fluid sanft im Gesicht, am Hals und auf den Ohren.",
                    },
                    {
                      step: "4. Einwirkzeit",
                      desc: "Lasse das Fluid 15 Minuten einwirken, bevor du nach draußen gehst.",
                    },
                    {
                      step: "5. Häufigkeit",
                      desc: "Täglich verwenden und alle 2 Stunden erneuern, besonders nach dem Schwimmen.",
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
                        50 ml
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-[0.1em] uppercase text-[#6B6B69] mb-2">
                        SPF
                      </p>
                      <p className="font-body text-base text-[#1C1C1A]">
                        SPF 50+
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
        <section id="reviews-section" className="py-16 md:py-20 bg-gradient-to-b from-[#F8F5F0] to-[#F0F5ED]">
          <div className="container max-w-4xl">
            <div className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-2 font-light">
                Bewertungen
              </h2>
              <div className="h-1 w-12 bg-[#5B5B38]"></div>
            </div>
            <div className="space-y-12">
              {/* Reviews List */}
              <div className="max-w-2xl mx-auto">
                <ReviewList productId="sunscreen" />
              </div>
              {/* Review Form */}
              <div>
                {(() => {
                  const { user, loading } = useAuth();
                  if (loading) return <div className="text-center py-8 text-[#6B6B69]">Wird geladen...</div>;
                  if (!user) {
                    return (
                      <div className="bg-white border-l-4 border-[#5B9B5B] p-6 rounded-sm shadow-sm">
                        <p className="font-body text-sm text-[#6B6B69] mb-4">
                          Melde dich an, um eine Bewertung zu hinterlassen.
                        </p>
                        <a
                          href={getLoginUrl()}
                          className="inline-block bg-[#5B9B5B] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-6 py-3 hover:bg-[#4A8A4A] transition-all duration-300"
                        >
                          Anmelden
                        </a>
                      </div>
                    );
                  }
                  return <ReviewForm productId="sunscreen" />;
                })()}
              </div>
            </div>
          </div>
        </section>
        {/* ─── RELATED PRODUCTS ─────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-[#F8F5F0]">
          <div className="container max-w-4xl">
            <h2
              className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-12 font-light"
            >
              Diese Produkte passen dazu
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {relatedProducts.map((prod, i) => (
                <a key={i} href={prod.href}>
                  <div className="group cursor-pointer">
                    <div className="bg-white rounded-sm aspect-square flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-500">
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
                </a>
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
              Bereit für deine individuelle Formel?
            </h2>
            <p className="font-body text-base text-[#7D7D5D] mb-8 leading-relaxed">
              Starte unseren intelligenten Hauttest und erhalte deine persönliche
              Sonnenschutz-Empfehlung.
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
