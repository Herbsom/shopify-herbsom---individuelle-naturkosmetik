/**
 * Product Page – Individuelles Serum
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
export default function ProductSerum() {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'quarterly'>('monthly');
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState("effects");
  const [activeImage, setActiveImage] = useState(0);
  const { user, loading } = useAuth();
  const relatedProducts = [
    { name: "Individuelle Gesichtscreme", href: "/product/creme" },
    { name: "Reiniger", href: "/product/cleaner" },
    { name: "Peelings", href: "/product/peeling" },
  ];
  const tabs = [
    { id: "effects", label: "Hauptwirkungen" },
    { id: "activeIngredients", label: "Wirkstoffe" },
    { id: "ingredients", label: "Inhaltsstoffe" },
    { id: "usage", label: "Anwendung" },
    { id: "details", label: "Details" },
  ];
  const images = [
    { id: 0, emoji: "🧴" },
    { id: 1, emoji: "🧴" },
    { id: 2, emoji: "🧴" },
    { id: 3, emoji: "🧴" },
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
                {/* Main Image */}
                <div className="bg-[#F0EBE3] rounded-sm aspect-square flex items-center justify-center overflow-hidden group cursor-zoom-in">
                  <div className="text-9xl group-hover:scale-110 transition-transform duration-500">
                    {images[activeImage].emoji}
                  </div>
                </div>
                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`bg-[#F0EBE3] rounded-sm aspect-square flex items-center justify-center text-4xl transition-all ${
                        activeImage === i
                          ? "ring-2 ring-[#5B5B38]"
                          : "hover:opacity-70"
                      }`}
                    >
                      {img.emoji}
                    </button>
                  ))}
                </div>
              </div>
              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-3 py-1 mb-4">
                    Bestseller
                  </span>
                  <h1
                    className="font-display text-4xl md:text-5xl text-[#1C1C1A] mb-4 font-light"
                  >
                    Individuelles Serum
                  </h1>
                  <ProductRatingHeader productId="serum" productName="Individuelles Serum" />
                  <p className="font-display text-3xl text-[#5B5B38] font-light">
                    €55,00
                  </p>
                </div>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-8">
                  Hochkonzentrierte Wirkstoffe, präzise auf deinen Hauttyp
                  abgestimmt. Unser Serum ist das Herzstück deiner individuellen
                  Hautpflege-Routine. Mit natürlichen Extrakten und
                  wissenschaftlich bewiesener Wirksamkeit.
                </p>
                {/* Features */}
                <div className="space-y-3 mb-8 pb-8 border-b border-[#E5E0D8]">
                  {[
                    "Hochkonzentrierte Wirkstoffe",
                    "Individuell auf deinen Hauttyp abgestimmt",
                    "Schnell einziehend",
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
                  
                  {/* Subscription Toggle */}
                  <div className="border-t border-[#E5E0D8] pt-4">
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
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        addItem({ 
                          id: "serum-individuell", 
                          name: "Individuelles Serum", 
                          price: 55, 
                          quantity,
                          isSubscription,
                          subscriptionFrequency: isSubscription ? subscriptionFrequency : undefined
                        });
                        toast.success(isSubscription ? 'Abonnement hinzugefügt!' : 'Zum Warenkorb hinzugefügt!');
                      }}
                      className="w-full bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-6 py-3 hover:bg-[#424226] transition-all duration-300 active:scale-[0.97]"
                    >
                      {isSubscription ? 'Abonnement starten' : 'In den Warenkorb'}
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
            {/* Tab Navigation */}
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
            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "effects" && (
                <div className="space-y-6">
                  <div>
                    <h4
                      className="font-display text-lg text-[#5B5B38] mb-2 font-light"
                    >
                      Hochkonzentrierte Wirkstoffe
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Unser intelligenter Hauttest analysiert deine Haut und
                      erstellt eine individuelle Wirkstoffkombination speziell
                      für deine Bedürfnisse. Das Serum wird dann mit den
                      perfekten Konzentrationen für deinen Hauttyp formuliert.
                    </p>
                  </div>
                  <div>
                    <h4
                      className="font-display text-lg text-[#5B5B38] mb-2 font-light"
                    >
                      Schnelle Absorption
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Die leichte Textur zieht schnell ein und hinterlässt keinen
                      klebrigen Film. Perfekt für die tägliche Anwendung unter
                      deiner Creme.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "activeIngredients" && (
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
                          { inci: "Glycerin", name: "Pflanzliches Glycerin", desc: "Intensiver pflanzlicher Feuchtigkeitsspender" },
                          { inci: "Hyaluronic Acid", name: "Hyaluronsäure", desc: "Intensive Feuchtigkeitspflege und Hautvolumen" },
                          { inci: "Niacinamide", name: "Niacinamid (Vitamin B3)", desc: "Reguliert Talgproduktion und verfeinert Poren" },
                          { inci: "Panthenol", name: "Provitamin B5", desc: "Beruhigend und feuchtigkeitsspendend" },
                          { inci: "Tocopherol", name: "Vitamin E", desc: "Antioxidans und Hautschutz vor freien Radikalen" },
                          { inci: "Pentylene Glycol", name: "Pentylene Glycol", desc: "Natürlicher Feuchtigkeitsspender und Konservierer" },
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
                  {                  [
                    {
                      step: "0. Vorbereitung",
                      desc: "Schüttele die Flasche vor Gebrauch gründlich, um die Wirkstoffe optimal zu vermischen.",
                    },
                    {
                      step: "1. Vorbereitung",
                      desc: "Trage das Serum auf die gereinigte, leicht feuchte Haut auf.",
                    },
                    {
                      step: "2. Anwendung",
                      desc: "Verwende 2-3 Tropfen und verteile sie sanft im Gesicht mit leichten Klopfbewegungen.",
                    },
                    {
                      step: "3. Einziehen lassen",
                      desc: "Lasse das Serum etwa 1-2 Minuten einziehen, bevor du deine Creme aufträgst.",
                    },
                    {
                      step: "4. Häufigkeit",
                      desc: "Morgens und abends für optimale Ergebnisse verwenden.",
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
        <section id="reviews-section" className="py-16 md:py-20 bg-[#F8F5F0]">
          <div className="container max-w-4xl">
            <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-12 font-light">
              Bewertungen
            </h2>
            <div className="space-y-12">
              {/* Reviews List */}
              <div className="max-w-2xl mx-auto">
                <ReviewList productId="serum" />
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
                  <ReviewForm productId="serum" />
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((product, i) => (
                <a
                  key={i}
                  href={product.href}
                  className="group border border-[#E5E0D8] p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-[#F0EBE3] rounded-sm aspect-square flex items-center justify-center mb-4 group-hover:bg-[#E5DFD3] transition-colors">
                    <div className="text-5xl">🧴</div>
                  </div>
                  <p className="font-body text-base text-[#1C1C1A] group-hover:text-[#5B5B38] transition-colors">
                    {product.name}
                  </p>
                  <ChevronRight
                    size={16}
                    className="text-[#5B5B38] mt-2 group-hover:translate-x-2 transition-transform duration-300"
                  />
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
              Serum-Empfehlung.
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
