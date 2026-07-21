/**
 * Product Page – Reinigungsgel
 * Design: Shopify Stretch Theme inspiriert, Herbsom-Stil
 * Farben: #5B5B38, #7D7D5D, #424226
 * Typografie: Cormorant Garamond (Headlines), Inter (Body)
 */
import { useState } from "react";
import { Star, ChevronRight, Minus, Plus, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useRouter } from "wouter";
import ReviewSubmissionNotice from "@/components/ReviewSubmissionNotice";
import ReviewList from "@/components/ReviewList";
import ProductRatingHeader from "@/components/ProductRatingHeader";
import { useTranslation } from "react-i18next";
import ShopifyProductPrice from "@/components/ShopifyProductPrice";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";
import ShopifyProductGallery from "@/components/ShopifyProductGallery";
import ShopifyProductCardImage from "@/components/ShopifyProductCardImage";
export default function ProductCleaner() {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("200ml");
  const [activeTab, setActiveTab] = useState("effects");

  const sizes = [
    { id: "200ml", label: "200ml", handle: "reinigungsgel" },
    { id: "50ml", label: "50ml", handle: "mini-reiniger" },
  ];

  const selectedProduct = sizes.find((size) => size.id === selectedSize) ?? sizes[0];
  const relatedProducts = [
    { name: "BHA & Azelainsäure Peeling", href: "/product/peeling", handle: "bha-azelainsaure-peeling" },
    { name: "Sonnenschutzfluid SPF 50+", href: "/product/sunscreen", handle: "sonnenschutzfluid-spf-50" },
  ];
  const tabs = [
    { id: "effects", label: "Hauptwirkungen" },
    { id: "activeIngredients", label: "Wirkstoffe" },
    { id: "ingredients", label: "Inhaltsstoffe" },
    { id: "usage", label: "Anwendung" },
    { id: "details", label: "Details" },
  ];
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 md:pt-24">
        {/* ─── BACK BUTTON ─────────────────────────────────────────── */}
        <div className="py-0">
          <div className="container">
            <Link href="/cleaners">
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
              <ShopifyProductGallery
                handle={selectedProduct.handle}
                alt={`Reinigungsgel ${selectedSize}`}
                className="aspect-square rounded-sm bg-[#F0EBE3]"
              />
              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-3 py-1 mb-4">
                    Für Mischhaut, ölige & normale Haut
                  </span>
                  <h1
                    className="font-display text-4xl md:text-5xl text-[#1C1C1A] mb-4 font-light"
                  >
                    Reinigungsgel
                  </h1>
                  <ProductRatingHeader productId="cleaner-gel" productName="Reinigungsgel" />
                  <ShopifyProductPrice
                    handle={selectedProduct.handle}
                    showFrom={false}
                    className="font-display text-3xl text-[#5B5B38] font-light"
                  />
                </div>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-8">
                  Reinigt intensiv & beugt Unreinheiten vor. Spendet Feuchtigkeit & erhält die Hautschutzbarriere. Perfekt für Mischhaut, ölige und normale Haut.
                </p>
                {/* Features */}
                <div className="space-y-3 mb-8 pb-8 border-b border-[#E5E0D8]">
                  {[
                    "Reinigt intensiv & beugt Unreinheiten vor",
                    "Spendet Feuchtigkeit",
                    "Erhält die Hautschutzbarriere",
                    "Mit natürlichen Wirkstoffen",
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
                {/* Size Selection */}
                <div className="space-y-3 mb-6 pb-6 border-b border-[#E5E0D8]">
                  <span className="font-body text-sm text-[#6B6B69]">Größe:</span>
                  <div className="flex gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`px-4 py-2 rounded-sm font-body text-sm transition-all ${
                          selectedSize === size.id
                            ? "bg-[#5B5B38] text-[#F8F5F0]"
                            : "bg-[#E8E3DB] text-[#1C1C1A] hover:bg-[#D8D3CB]"
                        }`}
                      >
                        <span>{size.label} – </span>
                        <ShopifyProductPrice
                          handle={size.handle}
                          showFrom={false}
                        />
                      </button>
                    ))}
                  </div>
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
                    <ShopifyPurchaseButton
                      item={{ id: `cleaner-gel-${selectedSize}`, name: `Reinigungsgel ${selectedSize}`, quantity }}
                      wrapperClassName="w-full"
                      className="w-full bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-6 py-3 hover:bg-[#424226] transition-all duration-300 active:scale-[0.97]"
                    >
                      In den Warenkorb
                    </ShopifyPurchaseButton>
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
                      Reinigt intensiv & beugt Unreinheiten vor
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Das Reinigungsgel entfernt Make-up, Schmutz und Unreinheiten effektiv, ohne die Haut zu reizen. Mit speziellen Wirkstoffen für eine gründliche Reinigung, die Unreinheiten vorbeugt.
                    </p>
                  </div>
                  <div>
                    <h4
                      className="font-display text-lg text-[#5B5B38] mb-2 font-light"
                    >
                      Spendet Feuchtigkeit & erhält die Hautschutzbarriere
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Mit feuchtigkeitsspendenden Inhaltsstoffen, die die natürliche Hautbarriere schützen. Perfekt als erste Reinigungsstufe in deiner täglichen Routine.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "activeIngredients" && (
                <div className="space-y-4">
                  {[
                    {
                      name: "Zuckertensid",
                      desc: "Natürliches und sehr mildes Tensid, welches die Haut schonend und effektiv reinigt",
                    },
                    {
                      name: "Weidenrindenextrakt",
                      desc: "Reguliert den Talgfluss und peelt die Haut sanft, anti-oxidativ, entzündungshemmend, adstringierend, regenerierend",
                    },
                    {
                      name: "Stiefmütterchenextrakt",
                      desc: "Antibakteriell, entzündungshemmend, feuchtigkeitsspendend, reinigend hautglättend, zellschützend",
                    },
                    {
                      name: "Schafgarbenextrakt",
                      desc: "Entzündungshemmend, adstringierend, fördert die Neubildung von Hautzellen",
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
                          { inci: "Aqua", name: "Wasser", desc: "Wasser als neutrale, gut verträgliche Basis" },
                          { inci: "Coco-Glucoside", name: "Coco-Glucoside", desc: "Natürliches und sehr mildes Tensid, welches die Haut schonend und effektiv reinigt" },
                          { inci: "Pentylene Glycol", name: "Pentylene Glycol", desc: "Natürlicher Feuchtigkeitsspender und Konservierer" },
                          { inci: "Sodium Cocoamphopropionate", name: "Sodium Cocoamphopropionate", desc: "Natürliches und mildes Tensid, welches die Haut effektiv reinigt" },
                          { inci: "Dicaprylyl Ether", name: "Dicaprylyl Ether", desc: "Rückfettend, glättend, hautpflegend, macht die Haut geschmeidig" },
                          { inci: "White Willow Bark Extract", name: "Weidenrindenextrakt", desc: "Reguliert den Talgfluss und peelt die Haut sanft, anti-oxidativ, entzündungshemmend, adstringierend, regenerierend" },
                          { inci: "Decyl Glucoside", name: "Decyl Glucoside", desc: "Besonders hautverträgliches und natürliches Tensid, welches die Haut reinigt und dabei glatt und geschmeidig hält" },
                          { inci: "Glycerin", name: "Natürliches Glycerin", desc: "Intensiver und pflanzlicher Feuchtigkeitsspender" },
                          { inci: "Dehydroxanthan Gum", name: "Dehydroxanthan Gum", desc: "Verdickungsmittel, welches feuchtigkeitsbindend und straffend auf die Haut wirkt" },
                          { inci: "Citric Acid", name: "Zitronensäure", desc: "Entfernt Hautschüppchen und raue Stellen, glättet, mindert Falten und regt die Zellerneuerung an" },
                          { inci: "Glyceryl Oleate", name: "Glyceryl Oleate", desc: "Glättet und hält die Haut weich und geschmeidig" },
                          { inci: "Xanthan Gum", name: "Xanthan Gum", desc: "Feuchtigkeitsbindend, straffend und glättend" },
                          { inci: "Viola Tricolor Extract", name: "Stiefmütterchenextrakt", desc: "Antibakteriell, entzündungshemmend, feuchtigkeitsspendend, reinigend hautglättend, zellschützend" },
                          { inci: "Achillea Millefolium Extract", name: "Schafgarbenextrakt", desc: "Entzündungshemmend, adstringierend, fördert die Neubildung von Hautzellen" },
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
                      step: "1. Vorbereitung",
                      desc: "Befeuchte dein Gesicht mit lauwarmem Wasser.",
                    },
                    {
                      step: "2. Anwendung",
                      desc: "Trage eine kleine Menge Reinigungsgel auf die gereinigten Hände auf und vermengen mit Wasser, um aufzuschäumen.",
                    },
                    {
                      step: "3. Massage",
                      desc: "Massiere das Gel sanft in kreisenden Bewegungen im gesamten Gesicht und Dekolletée ein.",
                    },
                    {
                      step: "4. Ausspülen",
                      desc: "Spüle das Gel gründlich mit lauwarmem Wasser aus, sodass keine Reste zurückbleiben.",
                    },
                    {
                      step: "5. Häufigkeit",
                      desc: "Morgens und abends verwenden, vor deinem Serum und deiner Creme.",
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
        {/* ─── REVIEWS SECTION ─────────────────────────────────────────── */}
        <section id="reviews-section" className="py-16 md:py-20 bg-gradient-to-b from-[#F8F5F0] to-[#F0F5ED]">
          <div className="container max-w-4xl">
            <div className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-2 font-light">
                Bewertungen
              </h2>
              <div className="h-1 w-12 bg-[#5B5B38]"></div>
            </div>
            <div className="space-y-12">
              {/* Reviews List - Centered */}
              <div className="max-w-2xl mx-auto">
                <ReviewList productId="cleaner-gel" />
              </div>
              {/* Review Form - Below Reviews */}
              <div className="max-w-2xl mx-auto">
                <ReviewSubmissionNotice />
              </div>
            </div>
          </div>
        </section>

        {/* ─── RELATED PRODUCTS ─────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-[#F8F5F0]">
          <div className="container max-w-4xl">
            <h2 className="font-display text-3xl text-[#1C1C1A] mb-12 font-light">
              Diese Produkte passen dazu
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {relatedProducts.map((product, i) => (
                <Link key={i} href={product.href}>
                  <div className="group cursor-pointer">
                    <div className="bg-[#F0EBE3] rounded-sm aspect-square flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <ShopifyProductCardImage handle={product.handle} alt={product.name} />
                    </div>
                    <h3 className="font-display text-sm text-[#1C1C1A] font-light group-hover:text-[#5B5B38] transition-colors line-clamp-2">
                      {product.name}
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
      </main>
      <Footer />
    </div>
  );
}
