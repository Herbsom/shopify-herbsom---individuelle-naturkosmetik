/*
 * Creme Konfigurator – Individuelle Creme erstellen
 * Design: Elegante Serif-Typografie, Grüntöne #5B5B38, #7D7D5D, #424226
 */
import { useState, useRef, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { Check, ArrowRight, Beaker, Leaf, Recycle, Star } from "lucide-react";
import IngredientDetailModal, { SERUM_INGREDIENT_DETAILS, type IngredientDetail } from "@/components/IngredientDetailModal";
import { useTranslation } from "react-i18next";
const CREME_PRICES = {
  2: 36,
  3: 41,
  4: 46,
};
const BASE_CREAM_IMAGES: Record<string, string> = {
  light: "/manus-storage/Basiscreme_3e6c66de.webp",
  rich: "/manus-storage/Basiscreme_3e6c66de.webp",
};
const INGREDIENT_IMAGES: Record<string, string> = {
  willow: "/manus-storage/Weidenrindenextrakt2ml_b6097f0f.webp",
  niacinamide: "/manus-storage/Niacinamide2ml_46f08c8a.webp",
  vitaminc: "/manus-storage/VitaminCKomplex2ml_2f8cd87d.webp",
  retinol: "/manus-storage/Retinolkomplex2ml_dff84f9f.webp",
  spilanthol: "/manus-storage/Spilantholkomplex2ml_2a92a4a7.webp",
  mallow: "/manus-storage/Malvenextrakt2ml_1aa8ab0c.webp",
  horsechestnut: "/manus-storage/Rosskastanienextrakt2ml_1d2515bb.webp",
  rosehip: "/manus-storage/wildrosenoel2ml_0f0e1f86.webp",
  seabuckthorn: "/manus-storage/sanddornoel2ml_ec59d504.webp",
  grapeseed: "/manus-storage/trauberkernoel2ml_5d373859.webp",
  thistle: "/manus-storage/disteloel2ml_87d83e0a.webp",
  algae: "/manus-storage/Algenextrakt2ml_fda34039.webp",
  hyaluronic: "/manus-storage/Hyaluronkomplex2ml_7b904451.webp",
};
const BASE_CREAMS = [
  { id: "light", name: "Basiscreme", description: "Derma Membran Struktur Creme – Baut mit hauteigenen Lipiden die Hautbarriere auf und zieht mit ihrer leichten Textur schnell ein." },
  { id: "rich", name: "Basiscreme Reichhaltig", description: "Derma Membran Struktur Creme – Baut mit hauteigenen Lipiden deine Hautbarriere auf und versorgt sehr trockene Haut mit extra Fetten" },
];
const ACTIVE_INGREDIENTS = {
  "Gegen Unreinheiten, Glanz & Große Poren": [
    { id: "willow", name: "Weidenrindenextrakt", description: "Reduziert Hautglanz und behandelt Unreinheiten" },
    { id: "niacinamide", name: "Niacinamide-Komplex", description: "Verfeinert vergrößerte Poren" },
  ],
  "Gegen Falten & Pigmentflecken": [
    { id: "vitaminc", name: "Vitamin C-Komplex", description: "Beugt Hautalterung vor und hellt Pigmentflecken auf" },
    { id: "retinol", name: "Retinolkomplex", description: "Reduziert Falten und erneuert die Haut" },
    { id: "spilanthol", name: "Spilantholkomplex", description: "Entspannt die Mimik und glättet die Haut sofort" },
  ],
  "Gegen Rötungen & Irritationen": [
    { id: "mallow", name: "Malvenextrakt", description: "Beruhigt und reduziert Rötungen" },
    { id: "horsechestnut", name: "Rosskastanienextrakt", description: "Mindert rote Äderchen, Cuperose und Rosazea" },
  ],
  "Gegen trockene Haut": [
    { id: "rosehip", name: "Wildrosenöl", description: "Versorgt trockene Haut und erhöht die Vitalität der Haut" },
    { id: "seabuckthorn", name: "Sanddornöl", description: "Versorgt trockene Haut und glättet Falten" },
    { id: "grapeseed", name: "Traubenkernöl", description: "Versorgt trockene Haut und schützt die Zellen" },
    { id: "thistle", name: "Distelöl", description: "Versorgt trockene Stellen ohne die Poren zu verstopfen" },
  ],
  "Für mehr Feuchtigkeit": [
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
export default function ConfiguratorCreme() {
  const { t } = useTranslation();
  const pageRef = useScrollReveal();
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const [baseCream, setBaseCream] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [detailIngredient, setDetailIngredient] = useState<IngredientDetail | null>(null);
  const { user, loading } = useAuth();

  // Prefill from query params (e.g. from Hauttest results)
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const baseParam = params.get("base");
    const ingredientsParam = params.get("ingredients");
    if (baseParam === "light" || baseParam === "rich") {
      setBaseCream(baseParam);
    }
    if (ingredientsParam) {
      const validIds = Object.values(ACTIVE_INGREDIENTS).flat().map((i) => i.id);
      const ids = ingredientsParam.split(",").filter((id) => validIds.includes(id));
      // Respect Vitamin C + Niacinamide constraint
      const filtered: string[] = [];
      for (const id of ids) {
        if (filtered.length >= 4) break;
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
      if (selectedIngredients.length < 4) {
        setSelectedIngredients([...selectedIngredients, id]);
      } else {
        toast.error("Maximal 4 Wirkstoffe auswählbar");
      }
    }
  };
  const ingredientCount = selectedIngredients.length;
  const price = ingredientCount >= 2 && ingredientCount <= 4 ? CREME_PRICES[ingredientCount as 2 | 3 | 4] : null;
  const canAddToCart = baseCream && ingredientCount >= 2 && ingredientCount <= 4;
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
    if (!canAddToCart || !price) {
      toast.error("Bitte Basiscreme und 2-4 Wirkstoffe auswählen");
      return;
    }
    const newItem = {
      id: `creme-${baseCream}-${selectedIngredients.sort().join("-")}`,
      name: `Individuelle Creme (${baseCream === "light" ? "Leicht" : "Reichhaltig"}, ${ingredientCount} Wirkstoffe)`,
      price,
      quantity: 1,
      description: `Wirkstoffe: ${selectedIngredientNames.join(", ")}`,
    };
    if (editingCartItemId) {
      replaceItem(editingCartItemId, newItem);
            navigate("/cart");
    } else {
      addItem(newItem);
      toast.success(`Creme (€${price}) zum Warenkorb hinzugefügt!`);
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
            {/* Eyebrow text */}
            <div className="text-center mb-2 md:mb-6 reveal">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#7D7D5D]">Personalisierte Hautpflege</span>
            </div>
            {/* Main heading with visual hierarchy */}
            <div className="text-center mb-4 md:mb-8 reveal reveal-delay-1">
              <h1
                className="font-display text-4xl md:text-7xl text-[#1C1C1A] leading-tight md:leading-tight mb-2 md:mb-4"
              >
                Deine perfekte
              </h1>
              <h1
                className="font-display text-4xl md:text-7xl text-[#5B5B38] leading-tight md:leading-tight"
              >
                Creme
              </h1>
            </div>
            {/* Subheading */}
            <p className="font-body text-sm md:text-lg text-[#6B6B69] text-center mb-4 md:mb-12 max-w-2xl mx-auto reveal reveal-delay-2">
              Wähle deine Basis und 2-4 Wirkstoffe. Wir mischen deine individuelle Creme nach deinen Bedürfnissen.
            </p>
            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-12 reveal reveal-delay-3">
              {[
                { number: "1", label: "Basiscreme", desc: "Hochwertige Grundlage" },
                { number: "2-4", label: "Wirkstoffe", desc: "Nach deinen Bedürfnissen" },
                { number: "ab €36", label: "Preis", desc: "Transparent & fair" },
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
                Jetzt Creme erstellen <ArrowRight size={14} strokeWidth={1.5} />
              </a>
            </div>
        </div>
      </section>
      {/* ─── CONFIGURATOR SECTION ─────────────────────────────────────── */}
      <section id="configurator" className="py-24 md:py-36">
        <div className="container">
          <div>
            {/* STEP 1: Base Cream */}
            <div className="mb-20 reveal">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-[#5B5B38] text-[#F8F5F0] flex items-center justify-center font-body text-sm font-semibold">
                  1
                </div>
                <h2
                  className="font-display text-3xl text-[#1C1C1A]"
                >
                  Wähle eine Basiscreme
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BASE_CREAMS.map((cream) => (
                  <div
                    key={cream.id}
                    onClick={() => setBaseCream(baseCream === cream.id ? null : cream.id)}
                    className={`text-left p-6 border rounded-lg transition-all cursor-pointer ${
                      baseCream === cream.id
                        ? "bg-[#5B5B38] border-[#5B5B38] text-[#F8F5F0]"
                        : "bg-white border-[#E5E0D8] text-[#1C1C1A] hover:border-[#5B5B38]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img src={BASE_CREAM_IMAGES[cream.id]} alt={cream.name} className="w-20 h-20 object-cover rounded flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              baseCream === cream.id
                                ? "bg-[#F8F5F0] border-[#F8F5F0]"
                                : "border-[#7D7D5D]"
                            }`}
                          >
                            {baseCream === cream.id && (
                              <Check size={14} className="text-[#5B5B38]" />
                            )}
                          </div>
                          <h4 className="font-body font-semibold text-sm">{cream.name}</h4>
                        </div>
                        <p className={`font-body text-xs leading-relaxed ${baseCream === cream.id ? "text-[#E8E3DB]" : "text-[#6B6B69]"}`}>
                          {cream.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailIngredient({
                              id: cream.id,
                              name: cream.name,
                              description: cream.description,
                              image: BASE_CREAM_IMAGES[cream.id],
                            });
                          }}
                          className={`text-xs underline underline-offset-2 transition-colors ${
                            baseCream === cream.id
                              ? "text-[#E8E3DB] hover:text-[#F8F5F0]"
                              : "text-[#7D7D5D] hover:text-[#5B5B38]"
                          }`}
                        >
                          Mehr erfahren
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                  Wähle 2 bis 4 Wirkstoffe
                </h2>
                <span className="ml-auto font-body text-sm text-[#7D7D5D]">
                  {ingredientCount}/4 ausgewählt
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
                <p className="font-display text-4xl md:text-5xl font-light mb-4">
                  {price ? `€${price}` : "ab €36"}
                </p>
                <p className="font-body text-sm text-[#E8E3DB] mb-4">
                  1 Basiscreme + {ingredientCount} Wirkstoffe · Alle Preise inkl. MwSt. zzgl. Versand
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
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className={`px-8 py-3 font-body text-xs tracking-[0.12em] uppercase border transition-all ${
                    canAddToCart
                      ? "bg-[#F8F5F0] text-[#5B5B38] border-[#F8F5F0] hover:bg-transparent hover:text-[#F8F5F0]"
                      : "bg-transparent text-white border-white cursor-not-allowed opacity-70"
                  }`}
                >
                  {canAddToCart ? (editingCartItemId ? "Creme aktualisieren" : "Zum Warenkorb hinzufügen") : "Bitte alle Schritte ausfüllen"}
                </button>
                {!canAddToCart && (
                  <p className="font-body text-xs text-[#E8E3DB] mt-4">
                    {!baseCream && "→ Basiscreme auswählen"}
                    {baseCream && ingredientCount < 2 && `→ ${2 - ingredientCount} weitere Wirkstoffe auswählen`}
                    {baseCream && ingredientCount > 4 && "→ Maximal 4 Wirkstoffe"}
                  </p>
                )}
                            </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── MIXING SECTION – CREME ZU HAUSE SELBST MIXEN ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#F0EBE3]">
        <div className="container">
          <div className="space-y-8 reveal">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 min-w-8 min-h-8 rounded-full bg-[#5B5B38] flex items-center justify-center">
                <span className="font-body text-sm font-semibold text-[#F8F5F0]">4</span>
              </div>
              <div>
                <h3 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-4">
                  Creme zu Hause selbst mixen
                </h3>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Nach deiner Bestellung erhältst du deine Basiscreme und deine ausgewählten Wirkstoffe separat. Du kannst sie ganz einfach selbst mischen und so deine individuelle Creme kreieren. Detaillierte Anleitung liegt bei!
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
              <em className="italic">deine Creme an.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#6B6B52]">
            {[
              {
                step: "1",
                title: "Morgens & Abends",
                text: "Trage eine erbsengroße Menge auf die gereinigte Haut auf. Sanft einklopfen und einmassieren."
              },
              {
                step: "2",
                title: "Mit Serum kombinieren",
                text: "Verwende dein individuelles Serum vor der Creme. Das Serum wirkt am besten unter einer Feuchtigkeitscreme."
              },
              {
                step: "3",
                title: "Kontinuierlich verwenden",
                text: "Für beste Ergebnisse verwende deine Creme regelmäßig. Die Haut zeigt erste Verbesserungen nach 4 Wochen."
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
              <ReviewList productId="creme" />
            </div>
            {/* Review Form - Below Reviews */}
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
      <Footer />
      {/* Ingredient Detail Modal */}
      {detailIngredient && (
        <IngredientDetailModal
          ingredient={detailIngredient}
          onClose={() => setDetailIngredient(null)}
          productType="creme"
        />
      )}
    </div>
  );
}
