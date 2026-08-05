/*
 * Generische Routine-Seite – Für alle Hauttypen
 * Design: Nordischer Minimalismus × Pharmazeutische Präzision (wie Homepage)
 * Farben: Cremeweiß (#F8F5F0) ↔ Dunkelgrün (#5B5B38), Salbeigrün (#7D7D5D)
 * Typografie: Cormorant Garamond (Display) + Inter (Body)
 */
import { useState } from "react";
import { useParams } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Star, ShoppingBag, Pencil, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  ROUTINE_REIFE_HAUT,
  ROUTINE_TROCKENE_HAUT,
  ROUTINE_UNREINE_HAUT,
  ROUTINE_MISCHHAUT,
  ROUTINE_EMPFINDLICHE_HAUT,
  ROUTINE_SENSIBLE_HAUT,
  ROUTINE_NORMALE_HAUT,
  type RoutineRecommendation,
} from "@/lib/routineRecommendations";
import ProductDetailModal, { STANDARD_PRODUCT_DETAILS, type ProductDetail } from "@/components/ProductDetailModal";
import { SERUM_INGREDIENT_DETAILS, CREME_INGREDIENT_DETAILS } from "@/components/IngredientDetailModal";
import { useTranslation } from "react-i18next";
import ShopifyLegacyProductPrice from "@/components/ShopifyLegacyProductPrice";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";

interface RoutineConfig {
  label: string;
  title: string;
  subtitle: string;
  description: string;
  benefitItems: Array<{ icon: string; title: string; text: string }>;
  applicationSteps: Array<{ step: string; title: string; desc: string; image?: string }>;
  totalPrice: number;
  recommendation: RoutineRecommendation;
  image: string;
}

const ROUTINES: Record<string, RoutineConfig> = {
  "reife-haut": {
    label: "Reife Haut",
    title: "Youthful Radiance",
    subtitle: "Routine für Reife Haut",
    description: "Eine Routine speziell für reife Haut – gegen Falten, feine Linien und Hautalterung",
    benefitItems: [
      { icon: "✓", title: "Intensive Anti-Aging Pflege", text: "mit hochkonzentrierten Wirkstoffen" },
      { icon: "✓", title: "Stärkt die Hautbarriere", text: "und erhöht die Elastizität" },
      { icon: "✓", title: "Sichtbare Ergebnisse", text: "bereits nach 4–6 Wochen" },
    ],
    applicationSteps: [
      { step: "1", title: "Morgens & Abends: Reinigen", desc: "Reinige dein Gesicht mit der sanften Reinigungsmilch, um Make-up und Unreinheiten zu entfernen.", image: "https://private-us-east-1.manuscdn.com/users/310519663746048126/uploads/temp-BpFhsKZdphtdbIhAmzLUK4_na1fn_UmVpbmlndW5nc21pbGNo.webp?Expires=1786102178&Signature=MEYCIQC9-RxRKjl~XN1G-DG5m6ZDTUO2uZtdsQBIC07MtsppGQIhAKLFSRvKBYbWji3-Y~AWB9HE0Hm5ZtJk~cxaTuhyHR2T&Key-Pair-Id=K1K5N5YNBUUMMN" },
      { step: "2", title: "2x pro Woche: Peeling", desc: "Trage das AHA & PHA Peeling zweimal pro Woche auf, um die Hautstruktur zu verfeinern.", image: "https://private-us-east-1.manuscdn.com/users/310519663746048126/uploads/temp-mIlTNzAOpnziIbMfQUjBMl_na1fn_QUhBJlBIQVBlZWxpbmc.webp?Expires=1786102178&Signature=MEUCIQDu6yvpgMNA3tI4criCLfYttraxQiWK6xbgIAexDjlCqgIgSHv1aAuHNuCxHCubOcQnskr3XP5urdCBymRM~5SCO84_&Key-Pair-Id=K1K5N5YNBUUMMN" },
      { step: "3", title: "Morgens & Abends: Serum", desc: "Dein individuelles Serum mit Vitamin C und Hyaluron verleiht Glanz und Schutz.", image: "https://private-us-east-1.manuscdn.com/users/310519663746048126/uploads/temp-sBtbRJeC799oIjSO70AMWT_na1fn_Vml0YW1pbkNLb21wbGV4MTBtbA.webp?Expires=1786102178&Signature=MEQCIFBBHwBCm2PdrHjcNbFZoPiE0X2G72bDY-Es3-GcjzdaAiBJr-sS~eHlNqy--UDFLQFur-80yas0tMVnLnMkm~SC2A__&Key-Pair-Id=K1K5N5YNBUUMMN" },
      { step: "4", title: "Morgens & Abends: Creme", desc: "Deine reichhaltige individuelle Creme mit Retinol und Hyaluron regeneriert intensiv.", image: "https://private-us-east-1.manuscdn.com/users/310519663746048126/uploads/temp-Wm77fdUqrvyJHfTWEth50H_na1fn_QmFzaXNzZXJ1bQ.webp?Expires=1786102178&Signature=MEUCIHgkBj57yt5K47WnhE~aPBrcO9NgOsyvc-myqFnsRnk4AiEAjXAaeZnYLQJNxnjKRl2TCbi5y02e2EBlral4qIvfYOY_&Key-Pair-Id=K1K5N5YNBUUMMN" },
      { step: "5", title: "Morgens: Sonnenschutz", desc: "Das Sonnenschutzfluid schützt vor UV-Strahlung und Hautalterung – essentiell für reife Haut.", image: "https://private-us-east-1.manuscdn.com/users/310519663746048126/uploads/temp-06TjZ287FAsy7Oirk4btMJ_na1fn_UmVpbmlndW5nc2dlbA.webp?Expires=1786102178&Signature=MEUCIA6tYurmOIaFI4rZkY1~JLEZ7xVLoBEUfvKOwX~6QnuoAiEAm~X0Oz3ocb5iYOWPg6BEAFOtlBOJ6N-4EjLXsPM23Mc_&Key-Pair-Id=K1K5N5YNBUUMMN" },
    ],
    totalPrice: 210,
    recommendation: ROUTINE_REIFE_HAUT,
    image: "",
  },
  "trockene-haut": {
    label: "Trockene Haut",
    title: "Intensive Feuchtigkeitspflege",
    subtitle: "Routine für Trockene Haut",
    description: "Eine Routine speziell für trockene Haut – mit intensiver Feuchtigkeitszufuhr und Nährstoffen",
    benefitItems: [
      { icon: "✓", title: "Intensive Feuchtigkeitszufuhr", text: "mit reichhaltigen Ölen und Hyaluron" },
      { icon: "✓", title: "Lindert Trockenheit", text: "und bewahrt die natürliche Feuchtigkeit" },
      { icon: "✓", title: "Stärkt die Hautbarriere", text: "für geschmeidge, weiche Haut" },
    ],
    applicationSteps: [
      { step: "1", title: "Morgens & Abends: Reinigen", desc: "Reinige dein Gesicht mit der sanften Reinigungsmilch, um Make-up und Unreinheiten zu entfernen." },
      { step: "2", title: "2x pro Woche: Peeling", desc: "Trage das AHA & PHA Peeling zweimal pro Woche auf, um abgestorbene Hautzellen zu entfernen." },
      { step: "3", title: "Morgens & Abends: Serum", desc: "Dein individuelles Serum mit Hyaluron und Algenextrakt spendet intensive Feuchtigkeit." },
      { step: "4", title: "Morgens & Abends: Creme", desc: "Deine reichhaltige individuelle Creme mit Sanddornöl und Hyaluron regeneriert die Haut." },
      { step: "5", title: "Morgens: Sonnenschutz", desc: "Das Sonnenschutzfluid schützt vor UV-Strahlung und bewahrt die Hautfeuchtigkeit." },
    ],
    totalPrice: 210,
    recommendation: ROUTINE_TROCKENE_HAUT,
    image: "",
  },
  "unreine-haut": {
    label: "Unreine Haut",
    title: "Klare, reine Haut",
    subtitle: "Routine für Unreine Haut",
    description: "Eine Routine speziell für unreine Haut – mit Wirkstoffen gegen Pickel, Mitesser und Akne",
    benefitItems: [
      { icon: "✓", title: "Bekämpft Unreinheiten", text: "mit antibakteriellen Wirkstoffen" },
      { icon: "✓", title: "Reguliert Talgproduktion", text: "und verfeinert Poren" },
      { icon: "✓", title: "Sichtbar klare Haut", text: "bereits nach 2–4 Wochen" },
    ],
    applicationSteps: [
      { step: "1", title: "Morgens & Abends: Reinigen", desc: "Reinige dein Gesicht mit der sanften Reinigungsmilch, um Make-up und Unreinheiten zu entfernen." },
      { step: "2", title: "2x pro Woche: Peeling", desc: "Trage das BHA/Azelainsäure Peeling zweimal pro Woche auf, um Poren zu reinigen." },
      { step: "3", title: "Morgens & Abends: Serum", desc: "Dein individuelles Serum mit Niacinamid und Weidenrindenextrakt reguliert die Talgproduktion." },
      { step: "4", title: "Abends: Creme", desc: "Deine leichte individuelle Creme mit Malvenextrakt beruhigt die Haut ohne zu beschweren." },
      { step: "5", title: "Morgens: Sonnenschutz", desc: "Das Sonnenschutzfluid schützt vor UV-Strahlung und ist nicht komedogen." },
    ],
    totalPrice: 210,
    recommendation: ROUTINE_UNREINE_HAUT,
    image: "",
  },
  "mischhaut": {
    label: "Mischhaut",
    title: "Ausgewogene Balance",
    subtitle: "Routine für Mischhaut",
    description: "Eine Routine speziell für Mischhaut – mit ausgewogener Pflege für T-Zone und trockene Bereiche",
    benefitItems: [
      { icon: "✓", title: "Ausgewogene Pflege", text: "für alle Hautbereiche" },
      { icon: "✓", title: "Reguliert Talgproduktion", text: "in der T-Zone" },
      { icon: "✓", title: "Spendet Feuchtigkeit", text: "wo nötig" },
    ],
    applicationSteps: [
      { step: "1", title: "Morgens & Abends: Reinigen", desc: "Reinige dein Gesicht mit der sanften Reinigungsmilch, um Make-up und Unreinheiten zu entfernen." },
      { step: "2", title: "2x pro Woche: Peeling", desc: "Trage das AHA & PHA Peeling zweimal pro Woche auf, um die Hautstruktur zu verfeinern." },
      { step: "3", title: "Morgens & Abends: Serum", desc: "Dein individuelles Serum mit Niacinamid und Hyaluron balanciert die Haut." },
      { step: "4", title: "Morgens & Abends: Creme", desc: "Deine leichte individuelle Creme mit Algenextrakt und Hyaluron pflegt ausgewogen." },
      { step: "5", title: "Morgens: Sonnenschutz", desc: "Das Sonnenschutzfluid schützt vor UV-Strahlung und mattiert die T-Zone." },
    ],
    totalPrice: 210,
    recommendation: ROUTINE_MISCHHAUT,
    image: "",
  },
  "empfindliche-haut": {
    label: "Empfindliche Haut",
    title: "Sanfte Pflege",
    subtitle: "Routine für Empfindliche Haut",
    description: "Eine Routine speziell für empfindliche Haut – mit beruhigenden Wirkstoffen",
    benefitItems: [
      { icon: "✓", title: "Beruhigt Rötungen", text: "mit sanften Wirkstoffen" },
      { icon: "✓", title: "Stärkt die Hautbarriere", text: "und reduziert Reizungen" },
      { icon: "✓", title: "Verträglich & sicher", text: "für sensible Haut" },
    ],
    applicationSteps: [
      { step: "1", title: "Morgens & Abends: Reinigen", desc: "Reinige dein Gesicht mit der sanften Reinigungsmilch, um Make-up und Unreinheiten zu entfernen." },
      { step: "2", title: "1x pro Woche: Peeling", desc: "Trage das AHA & PHA Peeling einmal pro Woche auf, um die Haut sanft zu erneuern." },
      { step: "3", title: "Morgens & Abends: Serum", desc: "Dein individuelles Serum mit Kamille und Panthenol beruhigt und schützt." },
      { step: "4", title: "Morgens & Abends: Creme", desc: "Deine reichhaltige individuelle Creme mit Sanddornöl und Panthenol regeneriert." },
      { step: "5", title: "Morgens: Sonnenschutz", desc: "Das Sonnenschutzfluid schützt vor UV-Strahlung und ist hypoallergen." },
    ],
    totalPrice: 210,
    recommendation: ROUTINE_EMPFINDLICHE_HAUT,
    image: "",
  },
  "normale-haut": {
    label: "Normale Haut",
    title: "Perfekte Balance",
    subtitle: "Routine für Normale Haut",
    description: "Eine Routine speziell für normale Haut – mit ausgewogener Pflege und Schutz",
    benefitItems: [
      { icon: "✓", title: "Erhält natürliche Balance", text: "ohne zu beschweren" },
      { icon: "✓", title: "Schützt & pflegt", text: "mit essentiellen Wirkstoffen" },
      { icon: "✓", title: "Strahlende Ausstrahlung", text: "für gesunde Haut" },
    ],
    applicationSteps: [
      { step: "1", title: "Morgens & Abends: Reinigen", desc: "Reinige dein Gesicht mit der sanften Reinigungsmilch, um Make-up und Unreinheiten zu entfernen." },
      { step: "2", title: "2x pro Woche: Peeling", desc: "Trage das AHA & PHA Peeling zweimal pro Woche auf, um die Hautstruktur zu verfeinern." },
      { step: "3", title: "Morgens & Abends: Serum", desc: "Dein individuelles Serum mit Vitamin C und Hyaluron verleiht Glanz und Schutz." },
      { step: "4", title: "Morgens & Abends: Creme", desc: "Deine ausgewogene individuelle Creme mit Hyaluron und Algenextrakt pflegt optimal." },
      { step: "5", title: "Morgens: Sonnenschutz", desc: "Das Sonnenschutzfluid schützt vor UV-Strahlung und bewahrt die natürliche Balance." },
    ],
    totalPrice: 210,
    recommendation: ROUTINE_NORMALE_HAUT,
    image: "",
  },
  "sensible-haut": {
    label: "Sensible Haut",
    title: "Intensive Beruhigung",
    subtitle: "Routine für Sensible Haut",
    description: "Eine Routine speziell für sensible Haut – mit intensiv beruhigenden Wirkstoffen",
    benefitItems: [
      { icon: "✓", title: "Intensive Beruhigung", text: "mit hochkonzentrierten Wirkstoffen" },
      { icon: "✓", title: "Reduziert Überempfindlichkeit", text: "und Rötungen" },
      { icon: "✓", title: "Regeneriert & schützt", text: "die Hautbarriere" },
    ],
    applicationSteps: [
      { step: "1", title: "Morgens & Abends: Reinigen", desc: "Reinige dein Gesicht mit der sanften Reinigungsmilch, um Make-up und Unreinheiten zu entfernen." },
      { step: "2", title: "1x pro Woche: Peeling", desc: "Trage das AHA & PHA Peeling einmal pro Woche auf, um die Haut sanft zu erneuern." },
      { step: "3", title: "Morgens & Abends: Serum", desc: "Dein individuelles Serum mit Kamille und Panthenol beruhigt intensiv und schützt." },
      { step: "4", title: "Morgens & Abends: Creme", desc: "Deine reichhaltige individuelle Creme mit Sanddornöl und Panthenol regeneriert intensiv." },
      { step: "5", title: "Morgens: Sonnenschutz", desc: "Das Sonnenschutzfluid schützt vor UV-Strahlung und ist hypoallergen." },
    ],
    totalPrice: 210,
    recommendation: ROUTINE_SENSIBLE_HAUT,
    image: "",
  },
};

export default function RoutineTemplate() {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const params = useParams<{ type: string }>();
  const routineType = params.type || "reife-haut";
  const config = ROUTINES[routineType];

  if (!config) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl text-[#1C1C1A] mb-4">Routine nicht gefunden</h1>
            <p className="font-body text-[#7D7D5D] mb-8">Die angeforderte Routine existiert nicht.</p>
            <Link href="/routines" className="text-[#5B5B38] hover:text-[#424226] underline">
              Zurück zu den Routinen
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const rec = config.recommendation;
  const products = [
    { ...rec.cleanser, label: "01" },
    { ...rec.peeling, label: "02" },
    { ...rec.serum, label: "03" },
    { ...rec.creme, label: "04" },
    { ...rec.sunscreen, label: "05" },
  ];
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);

  const handleProductClick = (product: typeof products[0]) => {
    if (STANDARD_PRODUCT_DETAILS[product.id]) {
      setSelectedProduct(STANDARD_PRODUCT_DETAILS[product.id]);
      return;
    }
    if (product.id.startsWith("serum-") && product.ingredientIds) {
      const ingredients = product.ingredientIds.map(id => ({
        id,
        name: SERUM_INGREDIENT_DETAILS[id]?.subtitle || id,
      }));
      setSelectedProduct({
        id: product.id,
        name: product.name,
        subtitle: "Individuelles Serum",
        description: product.description,
        image: product.image,
        anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
        hautprobleme: "Individuell angepasst",
        hauttypen: "Alle Hauttypen",
        wirkung: "Das Serum kombiniert ausgewählte Wirkstoffe für eine personalisierte Hautpflege.",
        selectedIngredients: ingredients,
        baseProduct: SERUM_INGREDIENT_DETAILS.baseSerum?.inhaltsstoffe || [],
      });
      return;
    }
    if (product.id.startsWith("creme-") && product.ingredientIds) {
      const ingredients = product.ingredientIds.map(id => ({
        id,
        name: SERUM_INGREDIENT_DETAILS[id]?.subtitle || id,
      }));
      const baseCremeKey = product.cremeBase === "rich" ? "baseCremeRich" : "baseCreme";
      setSelectedProduct({
        id: product.id,
        name: product.name,
        subtitle: "Individuelle Creme",
        description: product.description,
        image: product.image,
        anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige individuelle Creme morgens und abends auf die gereinigte Haut auftragen.",
        hautprobleme: "Individuell angepasst",
        hauttypen: "Alle Hauttypen",
        wirkung: "Die Creme kombiniert eine hochwertige Basiscreme mit ausgewählten Wirkstoffen für eine personalisierte Hautpflege.",
        selectedIngredients: ingredients,
        baseProduct: CREME_INGREDIENT_DETAILS[baseCremeKey]?.inhaltsstoffe || [],
      });
    }
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      quantity: 1,
      description: product.description,
    });
    toast.success(`${product.name} wurde in den Warenkorb gelegt!`);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[600px] bg-[#F8F5F0] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          {config.image && (
            <img
              src={config.image}
              alt={config.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5F0] via-[#F8F5F0]/50 to-transparent" />
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <p className="font-body text-xs tracking-[0.12em] uppercase mb-4 text-[#7D7D5D]">
              Routine für {config.label}
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light mb-6 leading-tight text-[#1C1C1A]">
              {config.title}
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed text-[#4A4A48]">
              {config.description}
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-[#5B5B38]">
          <div className="container max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {config.benefitItems.map((item, idx) => (
                <div key={idx}>
                  <div className="text-4xl mb-4 text-[#F8F5F0]">{item.icon}</div>
                  <h3 className="font-display text-lg text-[#F8F5F0] mb-2 font-light">{item.title}</h3>
                  <p className="font-body text-sm text-[#E8E3DB]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-5xl">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-4 text-[#1C1C1A] font-light">
              Deine Routine
            </h2>
            <p className="font-body text-center text-[#7D7D5D] mb-16">
              Fünf Schritte für deine {config.label}
            </p>

            <div className="space-y-20 lg:space-y-24">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-12 lg:gap-20">
                  <div className="aspect-square flex items-center justify-center group">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="text-8xl">🧴</div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#5B5B38] rounded-full flex items-center justify-center">
                        <span className="text-white font-display text-sm font-light">{product.label}</span>
                      </div>
                      <span className="font-body text-xs tracking-[0.12em] uppercase text-[#7D7D5D]">
                        Schritt {product.label}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#1C1C1A] mb-4 font-light leading-tight">
                      {product.name}
                    </h3>

                    <p className="font-body text-base lg:text-lg text-[#4A4A48] leading-relaxed mb-8">
                      {product.description}
                    </p>

                    {product.benefits && product.benefits.length > 0 && (
                      <ul className="space-y-2 mb-8">
                        {product.benefits.map((benefit, bidx) => (
                          <li key={bidx} className="flex items-start gap-3 font-body text-sm text-[#4A4A48]">
                            <span className="text-[#5B5B38] font-semibold mt-0.5">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <ShopifyLegacyProductPrice item={product} className="font-display text-2xl text-[#5B5B38]" />
                      <ShopifyPurchaseButton
                        item={{
                          id: product.id,
                          name: product.name,
                          quantity: 1,
                          description: product.description,
                        }}
                        onPurchase={() => handleAddToCart(product)}
                        className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-6 lg:px-8 py-3 lg:py-4 rounded-sm hover:bg-[#424226] transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-md"
                      >
                        <ShoppingBag size={16} />
                        In den Warenkorb
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </ShopifyPurchaseButton>
                      <button
                        onClick={() => handleProductClick(product)}
                        className="flex items-center gap-1 font-body text-xs text-[#5B5B38] hover:text-[#424226] transition-colors duration-200 tracking-[0.08em] uppercase"
                        title="Produktdetails anzeigen"
                      >
                        <Info size={12} />
                        Details
                      </button>
                      {product.href?.startsWith("/configurator") && (
                        <Link
                          href={product.href}
                          className="flex items-center gap-1 font-body text-xs text-[#5B5B38] hover:text-[#424226] transition-colors duration-200 tracking-[0.08em] uppercase"
                        >
                          <Pencil size={12} />
                          Anpassen
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total CTA */}
            <div className="mt-24 pt-20 border-t border-[#E5E0D8]">
              <div className="bg-gradient-to-r from-[#5B5B38] to-[#424226] rounded-lg p-8 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
                <div className="text-center md:text-left">
                  <p className="font-body text-sm text-[#E8E3DB] mb-2">Gesamtpreis der Routine</p>
                  <p className="font-display text-3xl lg:text-4xl text-[#F8F5F0] font-light">€{config.totalPrice}</p>
                </div>
                <ShopifyPurchaseButton
                  items={products.map((product) => ({
                    id: product.id,
                    name: product.name,
                    quantity: 1,
                    description: product.description,
                  }))}
                  onPurchase={() => {
                    products.forEach((product) => handleAddToCart(product));
                  }}
                  className="px-8 py-3 font-body text-xs tracking-[0.12em] uppercase border bg-[#F8F5F0] text-[#5B5B38] border-[#F8F5F0] hover:bg-transparent hover:text-[#F8F5F0] transition-all"
                >
                  Gesamte Routine in den Warenkorb
                </ShopifyPurchaseButton>
              </div>
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-[#5B5B38]">
          <div className="container max-w-7xl">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#F8F5F0] mb-12 lg:mb-16 font-light leading-tight">
              Die Anwendung
            </h2>

            <div className="space-y-12 lg:space-y-16">
              {config.applicationSteps.map((item) => (
                <div key={item.step} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  {/* Text content */}
                  <div className="flex gap-4 lg:gap-6 group">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-[#F8F5F0] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#7D7D5D] transition-colors duration-300">
                      <span className="font-display text-base lg:text-lg font-light text-[#5B5B38] group-hover:text-[#F8F5F0] transition-colors duration-300">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-display text-lg lg:text-xl text-[#F8F5F0] mb-2 font-light">{item.title}</h4>
                      <p className="font-body text-sm lg:text-base text-[#E8E3DB] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  
                  {/* Product image */}
                  {item.image && (
                    <div className="flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full max-w-sm h-auto object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Footer />
    </div>
  );
}
