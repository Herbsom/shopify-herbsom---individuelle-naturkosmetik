/*
 * Serum Konfigurator – Individuelles Serum erstellen
 * Design: Elegante Serif-Typografie, Grüntöne #5B5B38, #7D7D5D, #424226
 */
import { useState, useRef, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import ReviewSubmissionNotice from "@/components/ReviewSubmissionNotice";
import ShopifyLegacyProductPrice from "@/components/ShopifyLegacyProductPrice";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";
import ReviewList from "@/components/ReviewList";
import { Check, ArrowRight, Beaker, Leaf, Recycle, Star } from "lucide-react";
import IngredientDetailModal, { SERUM_INGREDIENT_DETAILS, type IngredientDetail } from "@/components/IngredientDetailModal";
import { useTranslation } from "react-i18next";
import { SERUM_REFERENCE_IMAGES } from "@/lib/productReferenceImages";

const BASE_SERUM_IMAGE = SERUM_REFERENCE_IMAGES.baseSerum;
const INGREDIENT_IMAGES: Record<string, string> = {
  willow: SERUM_REFERENCE_IMAGES.willow,
  niacinamide: SERUM_REFERENCE_IMAGES.niacinamide,
  vitaminc: SERUM_REFERENCE_IMAGES.vitaminc,
  retinol: SERUM_REFERENCE_IMAGES.retinol,
  spilanthol: SERUM_REFERENCE_IMAGES.spilanthol,
  mallow: SERUM_REFERENCE_IMAGES.mallow,
  horsechestnut: SERUM_REFERENCE_IMAGES.horsechestnut,
  algae: SERUM_REFERENCE_IMAGES.algae,
  hyaluronic: SERUM_REFERENCE_IMAGES.hyaluronic,
};
const ACTIVE_INGREDIENTS = {
  "Unreinheiten, ölige Haut & Mischhaut": [
    { id: "willow", name: "Weidenrindenextrakt", description: "Reduziert Hautglanz und behandelt Unreinheiten" },
    { id: "niacinamide", name: "Niacinamide-Komplex", description: "Verfeinert vergrößerte Poren" },
  ],
  "Falten & Linien": [
    { id: "vitaminc", name: "Vitamin C-Komplex", description: "Beugt Hautalterung vor und hellt Pigmentflecken auf" },
    { id: "retinol", name: "Retinolkomplex", description: "Reduziert Falten und erneuert die Haut" },
    { id: "spilanthol", name: "Spilantholkomplex", description: "Entspannt die Mimik und glättet die Haut sofort" },
  ],
  "Rötungen": [
    { id: "mallow", name: "Malvenextrakt", description: "Beruhigt und reduziert Rötungen" },
    { id: "horsechestnut", name: "Rosskastanienextrakt", description: "Mindert rote Äderchen, Cuperose und Rosazea" },
  ],
  "Feuchtigkeitsarme & trockene Haut": [
    { id: "algae", name: "Algenextrakt", description: "Spendet intensiv Feuchtigkeit" },
    { id: "hyaluronic", name: "Hyaluronkomplex", description: "Glättet und polstert auf" },
  ],
};
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
export default function ConfiguratorSerum() {
  const { t } = useTranslation();
  const pageRef = useScrollReveal();
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const [baseSerum] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [detailIngredient, setDetailIngredient] = useState<IngredientDetail | null>(null);

  // Prefill from query params (e.g. from Hauttest results)
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const ingredientsParam = params.get("ingredients");
    if (ingredientsParam) {
      const validIds = Object.values(ACTIVE_INGREDIENTS).flat().map((i) => i.id);
      const ids = ingredientsParam.split(",").filter((id) => validIds.includes(id));
      // Respect Vitamin C + Niacinamide constraint
      const filtered: string[] = [];
      for (const id of ids) {
        if (filtered.length >= 3) break;
        if (id === "vitaminc" && filtered.includes("niacinamide")) continue;
        if (id === "niacinamide" && filtered.includes("vitaminc")) continue;
        filtered.push(id);
      }
      if (filtered.length > 0) {
        setSelectedIngredients(filtered);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleIngredient = (id: string) => {
    // Sperrmechanismus: Vitamin C und Niacinamide können nicht zusammen ausgewählt werden
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== id));
    } else {
      // Wenn Vitamin C ausgewählt wird und Niacinamide ist bereits ausgewählt
      if (id === "vitaminc" && selectedIngredients.includes("niacinamide")) {
        toast.error("Vitamin C Komplex und Niacinamide-Komplex können nicht zusammen verwendet werden");
        return;
      }
      // Wenn Niacinamide ausgewählt wird und Vitamin C ist bereits ausgewählt
      if (id === "niacinamide" && selectedIngredients.includes("vitaminc")) {
        toast.error("Vitamin C Komplex und Niacinamide-Komplex können nicht zusammen verwendet werden");
        return;
      }
      if (selectedIngredients.length < 3) {
        setSelectedIngredients([...selectedIngredients, id]);
      } else {
        toast.error("Maximal 3 Wirkstoffe auswählbar");
      }
    }
  };
  const canAddToCart = baseSerum && selectedIngredients.length === 3;
  const { addItem, replaceItem } = useCart();

  // Check if we are editing an existing cart item
  const editingCartItemId = (() => {
    const params = new URLSearchParams(searchString);
    return params.get("editingCartItem");
  })();

  // Resolve selected ingredient names for display
  const allIngredients = Object.values(ACTIVE_INGREDIENTS).flat();
  const selectedIngredientNames = selectedIngredients
    .map((id) => allIngredients.find((i) => i.id === id)?.name)
    .filter(Boolean) as string[];

  const handleAddToCart = () => {
    if (!canAddToCart) {
      toast.error("Bitte Basisserum und 3 Wirkstoffe auswählen");
      return;
    }
    const newItem = {
      id: `serum-${baseSerum}-${selectedIngredients.sort().join("-")}`,
      name: `Individuelles Serum (${selectedIngredients.length} Wirkstoffe)`,
      quantity: 1,
      description: `Wirkstoffe: ${selectedIngredientNames.join(", ")}`,
    };
    if (editingCartItemId) {
      replaceItem(editingCartItemId, newItem);
            navigate("/cart");
    } else {
      addItem(newItem);
      toast.success("Serum wurde zum Shopify-Warenkorb hinzugefügt!");
    }
  };
  return (
    <div ref={pageRef} className="min-h-screen bg-[#F8F5F0]">
      <Navigation />
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative pt-20 md:pt-32 pb-12 md:pb-24 overflow-hidden">
        {/* Background with decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F5F0] via-[#F0EBE3] to-[#E8DFD3]"></div>
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-[#7D7D5D]/5 blur-3xl"></div>
        <div className="absolute bottom-20 left-5 w-40 h-40 rounded-full bg-[#5B5B38]/5 blur-3xl"></div>
        {/* Decorative line */}
        <div className="absolute top-20 left-1/4 w-64 h-px bg-gradient-to-r from-transparent via-[#7D7D5D]/20 to-transparent"></div>
        <div className="container relative z-10">
          <div>
            {/* Eyebrow text */}
            <div className="text-center mb-2 md:mb-6 reveal">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#7D7D5D]">Personalisierte Hautpflege</span>
            </div>
            {/* Main heading with visual hierarchy */}
            <div className="text-center mb-4 md:mb-8 reveal reveal-delay-1">
              <h1
                className="font-display text-4xl md:text-7xl text-[#1C1C1A] leading-tight md:leading-tight mb-2 md:mb-4"
              >
                Dein perfektes
              </h1>
              <h1
                className="font-display text-4xl md:text-7xl text-[#5B5B38] leading-tight md:leading-tight"
              >
                Serum
              </h1>
            </div>
            {/* Subheading */}
            <p className="font-body text-sm md:text-lg text-[#6B6B69] text-center mb-4 md:mb-12 max-w-2xl mx-auto reveal reveal-delay-2">
              Wähle deine Basis und 3 Wirkstoffe. Wir mischen dein individuelles Serum nach deinen Bedürfnissen.
            </p>
            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-12 reveal reveal-delay-3">
              {[
                { number: "1", label: "Basisserum", desc: "Hochwertige Grundlage" },
                { number: "3", label: "Wirkstoffe", desc: "Nach deinen Bedürfnissen" },
                { number: "Aktuell", label: "Preis", desc: "Direkt aus Shopify" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div
                    className="font-display text-4xl text-[#5B5B38] mb-2"
                  >
                    {item.number}
                  </div>
                  <h3 className="font-body font-semibold text-sm text-[#1C1C1A] mb-1">{item.label}</h3>
                  <p className="font-body text-xs text-[#7D7D5D]">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* CTA Button */}
            <div className="flex justify-center reveal reveal-delay-4">
              <a href="#configurator" className="btn-outline-dark inline-flex items-center gap-2 px-8 py-3">
                Jetzt Serum erstellen <ArrowRight size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ─── CONFIGURATOR SECTION ─────────────────────────────────────── */}
      <section id="configurator" className="py-24 md:py-36">
        <div className="container">
          <div>
            {/* STEP 1: Base Serum */}
            <div className="mb-20 reveal">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-[#5B5B38] text-[#F8F5F0] flex items-center justify-center font-body text-sm font-semibold">
                  1
                </div>
                <h2
                  className="font-display text-3xl text-[#1C1C1A]"
                >
                  Wähle ein Basisserum
                </h2>
              </div>
              <div className="bg-[#5B5B38] border border-[#5B5B38] p-8 rounded-lg">
                <div className="flex items-start gap-6">
                  <img src={BASE_SERUM_IMAGE} alt="Basisserum" className="w-32 h-32 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <div
                      className="flex items-start gap-3 w-full"
                    >
                      <div
                        className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-1 bg-[#F8F5F0] border-[#F8F5F0]"
                      >
                        <Check size={14} className="text-[#5B5B38]" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-display text-xl text-[#F8F5F0] mb-2">
                          Basisserum
                        </h3>
                        <p className="font-body text-sm text-[#E8E3DB] mb-2">
                          Stärkt die Hautbarriere und spendet intensiv Feuchtigkeit
                        </p>
                        <p className="font-body text-xs text-[#E8E3DB] italic">
                          Immer enthalten
                        </p>
                        <button
                          onClick={() => setDetailIngredient({
                            id: "baseserum",
                            name: "Basisserum",
                            description: "Stärkt die Hautbarriere und spendet intensiv Feuchtigkeit",
                            image: BASE_SERUM_IMAGE,
                          })}
                          className="text-xs underline underline-offset-2 text-[#E8E3DB] hover:text-[#F8F5F0] transition-colors mt-2"
                        >
                          Mehr erfahren
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* STEP 2: Active Ingredients */}
            <div className="mb-20 reveal reveal-delay-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-[#5B5B38] text-[#F8F5F0] flex items-center justify-center font-body text-sm font-semibold">
                  2
                </div>
                <h2
                  className="font-display text-3xl text-[#1C1C1A]"
                >
                  Wähle 3 Wirkstoffe
                </h2>
                <span className="ml-auto font-body text-sm text-[#7D7D5D]">
                  {selectedIngredients.length}/3 ausgewählt
                </span>
              </div>
              <div className="space-y-12">
                {Object.entries(ACTIVE_INGREDIENTS).map(([category, ingredients]) => (
                  <div key={category}>
                    <h3 className="font-display text-lg text-[#5B5B38] uppercase tracking-[0.1em] mb-6">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ingredients.map((ingredient) => {
                        const isDisabled = (ingredient.id === "vitaminc" && selectedIngredients.includes("niacinamide")) ||
                            (ingredient.id === "niacinamide" && selectedIngredients.includes("vitaminc"));
                        const isSelected = selectedIngredients.includes(ingredient.id);
                        return (
                        <div
                          key={ingredient.id}
                          onClick={() => { if (!isDisabled) toggleIngredient(ingredient.id); }}
                          className={`relative text-left p-4 border rounded-lg transition-all cursor-pointer ${
                            isDisabled
                              ? "bg-white border-[#E5E0D8] text-[#6B6B69] opacity-50 cursor-not-allowed"
                              : isSelected
                              ? "bg-[#5B5B38] border-[#5B5B38] text-[#F8F5F0]"
                              : "bg-white border-[#E5E0D8] text-[#1C1C1A] hover:border-[#5B5B38]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <img src={INGREDIENT_IMAGES[ingredient.id] || ""} alt={ingredient.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-body font-semibold text-sm mb-1">{ingredient.name}</h4>
                                <p className={`font-body text-xs ${isSelected ? "text-[#E8E3DB]" : "text-[#6B6B69]"}`}>
                                  {ingredient.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDetailIngredient({
                                      id: ingredient.id,
                                      name: ingredient.name,
                                      description: ingredient.description,
                                      image: INGREDIENT_IMAGES[ingredient.id],
                                    });
                                  }}
                                  className={`text-xs underline underline-offset-2 transition-colors ${
                                    isSelected
                                      ? "text-[#E8E3DB] hover:text-[#F8F5F0]"
                                      : "text-[#7D7D5D] hover:text-[#5B5B38]"
                                  }`}
                                >
                                  Mehr erfahren
                                </button>
                                <div
                                  className={`w-7 h-7 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                                    isDisabled
                                      ? "border-[#ccc]"
                                      : isSelected
                                      ? "bg-[#F8F5F0] border-[#F8F5F0]"
                                      : "border-[#7D7D5D]"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check size={14} className="text-[#5B5B38]" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* STEP 3: Add to Cart */}
            <div className="reveal reveal-delay-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-[#5B5B38] text-[#F8F5F0] flex items-center justify-center font-body text-sm font-semibold">
                  3
                </div>
                <h2
                  className="font-display text-3xl text-[#1C1C1A]"
                >
                  Zum Warenkorb hinzufügen
                </h2>
              </div>
              <div className="bg-[#5B5B38] text-[#F8F5F0] p-8 md:p-12 rounded-lg text-center">
                <ShopifyLegacyProductPrice
                  item={{
                    id: `serum-${baseSerum}-${selectedIngredients.slice().sort().join("-")}`,
                    name: `Individuelles Serum (${selectedIngredients.length} Wirkstoffe)`,
                    description: `Wirkstoffe: ${selectedIngredientNames.join(", ")}`,
                  }}
                  showFrom={false}
                  className="block font-display text-4xl md:text-5xl font-light mb-4"
                />
                <p className="font-body text-sm text-[#E8E3DB] mb-4">
                  1 Basisserum + 3 Wirkstoffe · Alle Preise inkl. MwSt. zzgl. Versand
                </p>
                {selectedIngredientNames.length > 0 && (
                  <div className="mb-8 bg-[#424226] rounded-md p-4 text-center w-full">
                    <p className="font-body text-xs text-[#7D7D5D] uppercase tracking-[0.1em] mb-2">Deine Wirkstoffe:</p>
                    <ul className="space-y-1 text-left">
                      {selectedIngredientNames.map((name) => (
                        <li key={name} className="font-body text-sm text-[#F8F5F0] flex items-center gap-2 justify-center">
                          <Check size={12} className="text-[#7D7D5D] flex-shrink-0" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <ShopifyPurchaseButton
                  item={canAddToCart ? {
                    id: `serum-${baseSerum}-${selectedIngredients.slice().sort().join("-")}`,
                    name: `Individuelles Serum (${selectedIngredients.length} Wirkstoffe)`,
                    quantity: 1,
                    description: `Wirkstoffe: ${selectedIngredientNames.join(", ")}`,
                  } : undefined}
                  onPurchase={handleAddToCart}
                  disabled={!canAddToCart}
                  disabledReason={selectedIngredients.length < 3
                    ? `Bitte wähle ${3 - selectedIngredients.length} weitere Wirkstoffe.`
                    : "Bitte vervollständige die Konfiguration."}
                  wrapperClassName="w-full items-center"
                  messageClassName="text-[#F2D7CE]"
                  className={`px-8 py-3 font-body text-xs tracking-[0.12em] uppercase border transition-all ${
                    canAddToCart
                      ? "bg-[#F8F5F0] text-[#5B5B38] border-[#F8F5F0] hover:bg-transparent hover:text-[#F8F5F0]"
                      : "bg-transparent text-[#7D7D5D] border-[#7D7D5D] cursor-not-allowed opacity-50"
                  }`}
                >
                  {editingCartItemId ? "Serum aktualisieren" : "Zum Warenkorb hinzufügen"}
                </ShopifyPurchaseButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── MIXING SECTION – SERUM ZU HAUSE SELBST MIXEN ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#F0EBE3]">
        <div className="container">
                <div className="space-y-8 reveal">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 min-w-8 min-h-8 rounded-full bg-[#5B5B38] flex items-center justify-center">
                <span className="font-body text-sm font-semibold text-[#F8F5F0]">4</span>
              </div>
              <div>
                <h3 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-4">
                  Serum zu Hause selbst mixen
                </h3>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Nach deiner Bestellung erhältst du dein Basisserum und deine ausgewählten Wirkstoffe separat. Du kannst sie ganz einfach selbst mischen und so dein individuelles Serum kreieren. Detaillierte Anleitung liegt bei!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── APPLICATION SECTION – HOMEPAGE STYLE ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#5B5B38]">
        <div className="container">
          <div className="mb-16 reveal">
            <p className="section-label text-[#7D7D5D] mb-3">Anwendung</p>
            <h2 className="font-display text-4xl md:text-6xl text-[#F8F5F0] font-light">
              So wendest du<br />
              <em className="italic">dein Serum an.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#6B6B52]">
            {[
              {
                step: "0",
                title: "Vorbereitung",
                text: "Schüttele die Flasche vor Gebrauch gründlich."
              },
              {
                step: "1",
                title: "Morgens & Abends",
                text: "Trage 2-3 Tropfen auf die gereinigte Haut auf. Sanft einklopfen und einmassieren."
              },
              {
                step: "2",
                title: "Mit Creme kombinieren",
                text: "Folge mit deiner individuellen Creme nach. Das Serum wirkt am besten unter einer Feuchtigkeitscreme."
              },
              {
                step: "3",
                title: "Kontinuierlich verwenden",
                text: "Für beste Ergebnisse verwende dein Serum regelmäßig. Die Haut zeigt erste Verbesserungen nach 4 Wochen."
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#5B5B38] p-10 md:p-12 reveal">
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#7D7D5D] flex items-center justify-center">
                    <span className="font-display text-xl text-[#F8F5F0] font-light">{item.step}</span>
                  </div>
                </div>
                <h3 className="font-display text-xl text-[#F8F5F0] font-light leading-relaxed mb-4">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-[#D5CFC7] leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bewertungen Sektion */}
      <section className="py-16 md:py-20 bg-[#F8F5F0]">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-12 font-light">
            Bewertungen
          </h2>
          <div className="space-y-12">
            {/* Reviews List - Centered */}
            <div className="max-w-2xl mx-auto">
              <ReviewList productId="serum" />
            </div>
            {/* Review Form - Below Reviews */}
            <div className="max-w-2xl mx-auto">
              <ReviewSubmissionNotice />
            </div>
          </div>
        </div>
      </section>
      <Footer />
      {/* Ingredient Detail Modal */}
      {detailIngredient && (
        <IngredientDetailModal
          ingredient={detailIngredient}
          onClose={() => setDetailIngredient(null)}
        />
      )}
    </div>
  );
}
