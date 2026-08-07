/**
 * Product Page – Reinigungsmilch
 * Design: Shopify Stretch Theme inspiriert, Herbsom-Stil
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
export default function ProductCleanerMilk() {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("effects");

  // Reinigungsmilch-Bilder von der Live-Website
  const cleanerMilkImages = [
    {
      url: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/Reinigungsmilch_9b8c254d.webp",
      altText: "Reinigungsmilch",
    },
  ];

  const tabs = [
    { id: "effects", label: "Hauptwirkungen" },
    { id: "activeIngredients", label: "Wirkstoffe" },
    { id: "ingredients", label: "Inhaltsstoffe" },
    { id: "usage", label: "Anwendung" },
    { id: "details", label: "Details" },
  ];
  const relatedProducts = [
    {
      name: "AHA & PHA Peeling",
      href: "/product/peeling/aha",
      handle: "aha-pha-peeling",
      image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/aha_pha_peeling_1x1_white_aad680df.webp",
    },
    {
      name: "Sonnenschutzfluid SPF 50+",
      href: "/product/sunscreen",
      handle: "sonnenschutzfluid-spf-50",
      image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260616_214302_5233e72b-a663-4b93-a6d9-685e4cbb5b18_94230957.png",
    },
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
                handle="reinigungs-milch"
                alt="Reinigungsmilch"
                referenceImages={cleanerMilkImages}
                className="aspect-square rounded-sm bg-[#F0EBE3]"
              />
              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-3 py-1 mb-4">
                    Für trockene & sensible Haut
                  </span>
                  <h1
                    className="font-display text-4xl md:text-5xl text-[#1C1C1A] mb-4 font-light"
                  >
                    Reinigungsmilch
                  </h1>
                  <ProductRatingHeader productId="cleaner-milk" productName="Reinigungsmilch" />
                  <ShopifyProductPrice
                    handle="reinigungs-milch"
                    showFrom={false}
                    className="font-display text-3xl text-[#5B5B38] font-light"
                  />
                  <p className="font-body text-sm text-[#6B6B69]">200ml</p>
                </div>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-8">
                  Sanfte Reinigung mit Feuchtigkeit. Entfernt Make-up und Schmutz ohne die Haut zu reizen. Perfekt für trockene und sensible Haut.
                </p>
                {/* Features */}
                <div className="space-y-3 mb-8 pb-8 border-b border-[#E5E0D8]">
                  {[
                    "Sanfte, feuchtigkeitsspendende Reinigung",
                    "Entfernt Make-up und Schmutz",
                    "Für trockene & sensible Haut",
                    "Mit beruhigenden Inhaltsstoffen",
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
                    <ShopifyPurchaseButton
                      item={{ id: "cleaner-milk", name: "Reinigungsmilch", quantity }}
                      wrapperClassName="w-full"
                      className="w-full bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-6 py-3 hover:bg-[#424226] transition-all duration-300 active:scale-[0.97]"
                    >
                      In den Warenkorb
                    </ShopifyPurchaseButton>
                  </div>
                  <div className="pt-4 border-t border-[#E5E0D8] space-y-2 text-center">
                    <p className="font-body text-xs text-[#6B6B69]">
                      ✓ Kostenloser Versand ab 60 €
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
                      Sanfte Reinigung mit Feuchtigkeit
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Die Reinigungsmilch reinigt sanft und gründlich, ohne die Haut auszutrocknen. Mit feuchtigkeitsspendenden Inhaltsstoffen für eine geschmeidge Haut nach der Reinigung.
                    </p>
                  </div>
                  <div>
                    <h4
                      className="font-display text-lg text-[#5B5B38] mb-2 font-light"
                    >
                      Entfernt Make-up & Schmutz
                    </h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Effektive Reinigung, die auch wasserfestes Make-up entfernt. Perfekt als erste Reinigungsstufe in deiner Routine.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "activeIngredients" && (
                <div className="space-y-4">
                  {[
                    {
                      name: "Milchsäure",
                      desc: "Sanfte Exfoliation und Feuchtigkeitspflege",
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
                      name: "Allantoin",
                      desc: "Hautberuhigend, pflegend, glättend, hauterneuernd",
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
                          { inci: "Pentylene Glycol", name: "Pentylene Glycol", desc: "Natürlicher Feuchtigkeitsspender und Konservierer" },
                          { inci: "Propanediol", name: "Propanediol", desc: "Natürliches Feuchthaltemittel" },
                          { inci: "Cetyl Alcohol", name: "Cetylalkohol", desc: "Natürlicher Emulgator und Texturmittel" },
                          { inci: "Stearic Acid", name: "Stearinsäure", desc: "Natürlicher Emulgator und Konsistenzgeber" },
                          { inci: "Panthenol", name: "Provitamin B5", desc: "Beruhigend und feuchtigkeitsspendend" },
                          { inci: "Allantoin", name: "Allantoin", desc: "Hautberuhigend, pflegend, glättend, hauterneuernd" },
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
                      step: "1. Anwendung",
                      desc: "Trage eine kleine Menge Reinigungsmilch auf die trockene oder leicht feuchte Haut auf.",
                    },
                    {
                      step: "2. Massage",
                      desc: "Massiere die Milch sanft in kreisenden Bewegungen ein, um Make-up und Schmutz zu lösen.",
                    },
                    {
                      step: "3. Emulgieren",
                      desc: "Gib ein wenig Wasser hinzu, um die Milch zu emulgieren und ein leichtes Schaum zu erzeugen.",
                    },
                    {
                      step: "4. Ausspülen",
                      desc: "Spüle die Reinigungsmilch gründlich mit lauwarmem Wasser aus.",
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
                        Trockene & sensible Haut
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
              {/* Reviews List - Centered */}
              <div className="max-w-2xl mx-auto">
                <ReviewList productId="cleaner-milk" />
              </div>
              {/* Review Form - Below Reviews */}
              <div className="max-w-2xl mx-auto">
                <ReviewSubmissionNotice />
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
                <div key={i} className="flex flex-col gap-3">
                  <Link href={prod.href}>
                    <div className="group cursor-pointer">
                      <div className="bg-[#F0EBE3] rounded-sm aspect-square flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} className="h-full w-full object-cover" />
                        ) : (
                          <ShopifyProductCardImage handle={prod.handle} alt={prod.name} />
                        )}
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
                  <ShopifyPurchaseButton
                    item={{ id: prod.handle, name: prod.name, quantity: 1 }}
                    wrapperClassName="w-full"
                    className="w-full border border-[#5B5B38] text-[#5B5B38] font-body text-[10px] tracking-[0.12em] uppercase px-3 py-2.5 hover:bg-[#5B5B38] hover:text-[#F8F5F0] transition-all duration-200 active:scale-[0.98]"
                  >
                    In den Warenkorb
                  </ShopifyPurchaseButton>
                </div>
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
              href="/hauttest"
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
