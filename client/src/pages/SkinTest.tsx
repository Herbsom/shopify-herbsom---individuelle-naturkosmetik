import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Sparkles, Droplets, Leaf } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import ProductDetailModal, { STANDARD_PRODUCT_DETAILS, type ProductDetail } from "@/components/ProductDetailModal";
import { SERUM_INGREDIENT_DETAILS, CREME_INGREDIENT_DETAILS } from "@/components/IngredientDetailModal";
import { calculateRecommendation, type QuizAnswer, type SkinTestResult, SERUM_INGREDIENTS, CREME_INGREDIENTS } from "@/lib/skinTestRecommendation";
import IngredientEditor from "@/components/IngredientEditor";
import { useTranslation } from "react-i18next";
import ShopifyLegacyProductPrice from "@/components/ShopifyLegacyProductPrice";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";

const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "Wie alt bist du?",
    type: "single",
    options: ["Unter 20", "20-29", "30-39", "40-49", "50-59", "60+"],
  },
  {
    id: 2,
    title: "Wie empfindlich reagiert deine Haut auf Wirkstoffe?",
    type: "single",
    options: ["Gar nicht empfindlich", "Empfindlich", "Sehr empfindlich"],
  },
  {
    id: 3,
    title: "Wie fühlt sich deine Haut normalerweise an?",
    type: "single",
    options: [
      "Sehr trocken und sie spannt",
      "Trocken",
      "Normal",
      "Trocken und fettig",
      "Fettig",
    ],
  },
  {
    id: 4,
    title: "Wie würdest du die Falten in deinem Gesicht beschreiben?",
    type: "single",
    options: [
      "Keine Falten",
      "Feine Linien und leichte Fältchen",
      "Einige Falten",
      "Viele Falten",
    ],
  },
  {
    id: 5,
    title: "Wie sehen deine Poren aus?",
    type: "single",
    options: [
      "Unauffällig und fein",
      "Stellenweise vergrößert (T-Zone)",
      "Stellenweise vergrößert und verstopft (T-Zone)",
      "Allgemein vergrößert",
      "Allgemein vergrößert und verstopft",
    ],
  },
  {
    id: 6,
    title: "Neigt deine Haut zu Unreinheiten?",
    type: "single",
    options: [
      "Ja, ich habe häufig viele Pickel und Mitesser",
      "Ich habe ab und zu Pickel und Mitesser",
      "Ich habe nur ganz selten mal einen Pickel oder Mitesser",
      "Ich habe nie Probleme mit Unreinheiten",
    ],
  },
  {
    id: 7,
    title: "Neigt deine Haut zu Hautglanz?",
    type: "single",
    options: ["Ja", "Manchmal in der T-Zone", "Nein"],
  },
  {
    id: 8,
    title: "Was beschreibt deinen Teint am besten?",
    type: "single",
    options: [
      "Gleichmäßig und frisch",
      "Matt und fahl",
      "Ungleichmäßig mit Rötungen und Flecken",
    ],
  },
  {
    id: 9,
    title: "Leidest du akut unter einer der folgenden Hautkrankheiten?",
    type: "single",
    options: [
      "Keine Hautkrankheit",
      "Akne",
      "Neurodermitis",
      "Periorale Dermatitis",
      "Rosacea",
      "Couperose",
      "Schuppenflechte",
    ],
  },
  {
    id: 10,
    title: "Was möchtest du mit deiner Hautpflege erreichen? (Wähle bis zu 2)",
    type: "multiple",
    options: [
      "Falten glätten und Pigmentflecken aufhellen",
      "Unreinheiten & Hautglanz reduzieren",
      "Sensible Haut beruhigen",
      "Rote Äderchen, Rötungen und Schwellungen abschwächen",
      "Poren verfeinern & Hautbild verbessern",
      "Trockene Stellen ausgleichen und Feuchtigkeit spenden",
      "Glattere Haut & mehr Spannkraft",
    ],
  },
];

export default function SkinTest() {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];
  const currentAnswer = answers.find((a) => a.question === question.id);

  const handleAnswer = (option: string) => {
    if (question.type === "multiple") {
      const existingAnswer = currentAnswer as QuizAnswer | undefined;
      const currentAnswers = (existingAnswer?.answer as string[]) || [];

      if (currentAnswers.includes(option)) {
        const updated = currentAnswers.filter((a) => a !== option);
        setAnswers([
          ...answers.filter((a) => a.question !== question.id),
          { question: question.id, answer: updated },
        ]);
      } else if (currentAnswers.length < 2) {
        const updated = [...currentAnswers, option];
        setAnswers([
          ...answers.filter((a) => a.question !== question.id),
          { question: question.id, answer: updated },
        ]);
        if (updated.length === 2) {
          setTimeout(() => {
            if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
            } else {
              setShowResults(true);
            }
          }, 300);
        }
      }
    } else {
      setAnswers([
        ...answers.filter((a) => a.question !== question.id),
        { question: question.id, answer: option },
      ]);
      setTimeout(() => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResults(true);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isAnswered =
    question.type === "multiple"
      ? currentAnswer && (currentAnswer.answer as string[]).length > 0
      : currentAnswer !== undefined;

  if (showResults) {
    const result = calculateRecommendation(answers);
    return <ResultsPage result={result} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="pt-24 md:pt-32 pb-6 md:pb-8 bg-[#F8F5F0]">
          <div className="container max-w-4xl">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-body text-xs tracking-[0.1em] uppercase text-[#7D7D5D]">
                  Frage {currentQuestion + 1} von {QUIZ_QUESTIONS.length}
                </span>
                <span className="font-body text-xs tracking-[0.1em] uppercase text-[#7D7D5D]">
                  {Math.round(((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-[#E5E0D8] rounded-full h-1">
                <div
                  className="bg-[#5B5B38] h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white p-8 md:p-12 rounded-lg border border-[#E5E0D8]">
              <h2 className="font-display text-3xl md:text-4xl mb-3 text-[#1C1C1A] font-light">
                {question.title}
              </h2>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {question.options.map((option) => {
                  const isSelected =
                    question.type === "multiple"
                      ? (currentAnswer?.answer as string[])?.includes(option)
                      : currentAnswer?.answer === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`p-4 border-2 rounded-sm transition-all duration-200 text-left font-body text-sm ${
                        isSelected
                          ? "border-[#5B5B38] bg-[#F0EBE3] text-[#1C1C1A]"
                          : "border-[#E5E0D8] text-[#4A4A48] hover:border-[#5B5B38]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              {question.type === "multiple" && (
                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`font-body text-xs tracking-[0.12em] uppercase px-6 py-3 rounded-sm transition-colors duration-300 flex items-center gap-2 ${
                      currentQuestion === 0
                        ? "text-[#C0C0B8] cursor-not-allowed"
                        : "text-[#5B5B38] hover:bg-[#F0EBE3]"
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Zurück
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className={`font-body text-xs tracking-[0.12em] uppercase px-6 py-3 rounded-sm transition-colors duration-300 flex items-center gap-2 ${
                      isAnswered
                        ? "bg-[#5B5B38] text-[#F8F5F0] hover:bg-[#424226]"
                        : "bg-[#E5E0D8] text-[#C0C0B8] cursor-not-allowed"
                    }`}
                  >
                    {currentQuestion === QUIZ_QUESTIONS.length - 1
                      ? "Ergebnisse anzeigen"
                      : "Weiter"}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
              
              {question.type === "single" && (
                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`font-body text-xs tracking-[0.12em] uppercase px-6 py-3 rounded-sm transition-colors duration-300 flex items-center gap-2 ${
                      currentQuestion === 0
                        ? "text-[#C0C0B8] cursor-not-allowed"
                        : "text-[#5B5B38] hover:bg-[#F0EBE3]"
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Zurück
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ─── RESULTS PAGE ──────────────────────────────────────────────────────────────

function ResultsPage({ result }: { result: SkinTestResult }) {
  const { addItem } = useCart();

  // Editable state for ingredients
  const [serumIngredients, setSerumIngredients] = useState(result.serumIngredients);
  const [cremeIngredients, setCremeIngredients] = useState(result.cremeIngredients);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);

  // Dynamic pricing
  const handleAddSerum = () => {
    const ingredientIds = serumIngredients.map((i) => i.id).sort();
    addItem({
      id: `serum-true-${ingredientIds.join("-")}`,
      name: `Individuelles Serum (${serumIngredients.length} Wirkstoffe)`,
      quantity: 1,
      description: `Wirkstoffe: ${serumIngredients.map((i) => i.name).join(", ")}`,
    });
    toast.success("Individuelles Serum wurde in den Warenkorb gelegt!");
  };

  const handleAddCreme = () => {
    const ingredientIds = cremeIngredients.map((i) => i.id).sort();
    addItem({
      id: `creme-${result.cremeBase}-${ingredientIds.join("-")}`,
      name: `Individuelle Creme (${result.cremeBase === "light" ? "Leicht" : "Reichhaltig"}, ${cremeIngredients.length} Wirkstoffe)`,
      quantity: 1,
      description: `Wirkstoffe: ${cremeIngredients.map((i) => i.name).join(", ")}`,
    });
    toast.success("Individuelle Creme wurde in den Warenkorb gelegt!");
  };

  const handleAddCleanser = () => {
    addItem({
      id: result.cleanser.id,
      name: result.cleanser.name,
      quantity: 1,
    });
    toast.success(`${result.cleanser.name} wurde in den Warenkorb gelegt!`);
  };

  const handleAddPeeling = () => {
    addItem({
      id: result.peeling.id,
      name: result.peeling.name,
      quantity: 1,
    });
    toast.success(`${result.peeling.name} wurde in den Warenkorb gelegt!`);
  };

  const handleAddSunscreen = () => {
    addItem({
      id: "sonnenschutzfluid",
      name: "Sonnenschutzfluid SPF 50+",
      quantity: 1,
    });
    toast.success("Sonnenschutzfluid wurde in den Warenkorb gelegt!");
  };

  const handleAddAll = () => {
    handleAddCleanser();
    handleAddPeeling();
    handleAddSerum();
    handleAddCreme();
    handleAddSunscreen();
    toast.success("Gesamte Routine wurde in den Warenkorb gelegt!");
  };

  const handleProductClick = (product: any) => {
    if (STANDARD_PRODUCT_DETAILS[product.id]) {
      setSelectedProduct(STANDARD_PRODUCT_DETAILS[product.id]);
      return;
    }
    if (product.id === "serum" && serumIngredients) {
      const ingredients = serumIngredients.map(i => ({
        id: i.id,
        name: SERUM_INGREDIENT_DETAILS[i.id]?.subtitle || i.name,
      }));
      setSelectedProduct({
        id: "serum-custom",
        name: "Individuelles Serum",
        subtitle: "Individuelles Serum",
        description: "Dein Serum mit hochkonzentrierten Wirkstoffen, speziell auf deine Hautbedürfnisse abgestimmt.",
        image: "/manus-storage/product-hautpflege-individuelle-serum-creme_59b5acd0.jpg",
        anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
        hautprobleme: "Individuell angepasst",
        hauttypen: "Alle Hauttypen",
        wirkung: "Das Serum kombiniert ausgewählte Wirkstoffe für eine personalisierte Hautpflege.",
        selectedIngredients: ingredients,
        baseProduct: SERUM_INGREDIENT_DETAILS.baseSerum?.inhaltsstoffe || [],
      });
      return;
    }
    if (product.id === "creme" && cremeIngredients) {
      const ingredients = cremeIngredients.map(i => ({
        id: i.id,
        name: CREME_INGREDIENT_DETAILS[i.id]?.subtitle || i.name,
      }));
      const baseCremeKey = result.cremeBase === "rich" ? "baseCremeRich" : "baseCreme";
      setSelectedProduct({
        id: "creme-custom",
        name: `Individuelle Creme (${result.cremeBase === "light" ? "Leicht" : "Reichhaltig"})`,
        subtitle: "Individuelle Creme",
        description: "Deine Creme mit hochkonzentrierten Wirkstoffen, speziell auf deine Hautbedürfnisse abgestimmt.",
        image: "/manus-storage/product-hautpflege-erstelle-deine-creme_87ae5318.jpg",
        anwendung: "Morgens und abends nach dem Serum auf das Gesicht auftragen.",
        hautprobleme: "Individuell angepasst",
        hauttypen: "Alle Hauttypen",
        wirkung: "Die Creme kombiniert ausgewählte Wirkstoffe für eine personalisierte Hautpflege.",
        selectedIngredients: ingredients,
        baseProduct: CREME_INGREDIENT_DETAILS[baseCremeKey]?.inhaltsstoffe || [],
      });
      return;
    }
  };

  // Build configurator links with current (possibly edited) ingredients
  const serumConfigLink = `/configurator/serum?ingredients=${serumIngredients.map((i) => i.id).join(",")}`;
  const cremeConfigLink = `/configurator/creme?base=${result.cremeBase}&ingredients=${cremeIngredients.map((i) => i.id).join(",")}`;

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header Section */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-[#F8F5F0]">
          <div className="container max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={24} className="text-[#5B5B38]" />
              <p className="font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D]">
                Dein individuelles Ergebnis
              </p>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light mb-6">
              Deine persönliche<br />
              <em className="italic">Pflegeroutine.</em>
            </h1>
            <p className="font-body text-base md:text-lg text-[#4A4A48] leading-relaxed max-w-3xl">
              {result.skinSummary}
            </p>
          </div>
        </section>

        {/* ─── STEP 1: REINIGER ──────────────────────────────────────────── */}
        <section className="py-12 md:py-16 border-t border-[#E5E0D8]">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-48 h-48 bg-[#F0EBE3] rounded-lg overflow-hidden border border-[#E5E0D8] flex-shrink-0">
                  <img src={result.cleanser.image} alt={result.cleanser.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] mb-2">Reinigung</p>
                <h3 className="font-display text-2xl md:text-3xl text-[#1C1C1A] font-light mb-3">
                  {result.cleanser.name}
                </h3>
                <p className="font-body text-sm text-[#4A4A48] leading-relaxed mb-6 max-w-lg">
                  {result.cleanser.description}
                </p>
                <div className="flex items-center gap-6">
                  <ShopifyLegacyProductPrice
                    item={{ id: result.cleanser.id, name: result.cleanser.name}}
                    showFrom={false}
                    className="font-display text-xl text-[#5B5B38]"
                  />
                  <ShopifyPurchaseButton
                    item={{ id: result.cleanser.id, name: result.cleanser.name, quantity: 1 }}
                    onPurchase={handleAddCleanser}
                    className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-5 py-3 rounded-sm hover:bg-[#424226] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ShoppingBag size={14} />
                    In den Warenkorb
                  </ShopifyPurchaseButton>
                  <button
                    onClick={() => handleProductClick(result.cleanser)}
                    className="font-body text-xs tracking-[0.12em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors flex items-center gap-1"
                  >
                    Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STEP 2: PEELING ───────────────────────────────────────────── */}
        <section className="py-12 md:py-16 border-t border-[#E5E0D8]">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-48 h-48 bg-[#F0EBE3] rounded-lg overflow-hidden border border-[#E5E0D8] flex-shrink-0">
                  <img src={result.peeling.image} alt={result.peeling.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] mb-2">Peeling · 2x pro Woche</p>
                <h3 className="font-display text-2xl md:text-3xl text-[#1C1C1A] font-light mb-3">
                  {result.peeling.name}
                </h3>
                <p className="font-body text-sm text-[#4A4A48] leading-relaxed mb-6 max-w-lg">
                  {result.peeling.description}
                </p>
                <div className="flex items-center gap-6">
                  <ShopifyLegacyProductPrice
                    item={{ id: result.peeling.id, name: result.peeling.name}}
                    showFrom={false}
                    className="font-display text-xl text-[#5B5B38]"
                  />
                  <ShopifyPurchaseButton
                    item={{ id: result.peeling.id, name: result.peeling.name, quantity: 1 }}
                    onPurchase={handleAddPeeling}
                    className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-5 py-3 rounded-sm hover:bg-[#424226] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ShoppingBag size={14} />
                    In den Warenkorb
                  </ShopifyPurchaseButton>
                  <button
                    onClick={() => handleProductClick(result.peeling)}
                    className="font-body text-xs tracking-[0.12em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors flex items-center gap-1"
                  >
                    Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STEP 3: SERUM ─────────────────────────────────────────────── */}
        <section className="py-12 md:py-16 border-t border-[#E5E0D8] bg-[#F0EBE3]">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-40 h-40 bg-[#F0EBE3] rounded-lg overflow-hidden border border-[#E5E0D8] flex-shrink-0">
                  <img src="/manus-storage/serum_reference_final_6866c5a2.webp" alt="Individuelles Serum" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] mb-2">Serum · Morgens & Abends</p>
                <h3 className="font-display text-2xl md:text-3xl text-[#1C1C1A] font-light mb-3">
                  Individuelles Serum
                </h3>
                <p className="font-body text-sm text-[#4A4A48] leading-relaxed mb-6 max-w-lg">
                  Dein Serum mit hochkonzentrierten Wirkstoffen, speziell auf deine Hautbedürfnisse abgestimmt.
                </p>

                {/* Editable Ingredient Cards */}
                <IngredientEditor
                  selected={serumIngredients}
                  available={SERUM_INGREDIENTS}
                  maxCount={3}
                  minCount={1}
                  onChange={setSerumIngredients}
                  productLabel="Serum"
                  icon={<Droplets size={14} className="text-[#5B5B38]" />}
                />

                <div className="flex flex-wrap items-center gap-4">
                  <ShopifyLegacyProductPrice
                    item={{
                      id: `serum-true-${serumIngredients.map((ingredient) => ingredient.id).sort().join("-")}`,
                      name: `Individuelles Serum (${serumIngredients.length} Wirkstoffe)`,
                      description: `Wirkstoffe: ${serumIngredients.map((ingredient) => ingredient.name).join(", ")}`,
                    }}
                    showFrom={false}
                    className="font-display text-xl text-[#5B5B38]"
                  />
                  <ShopifyPurchaseButton
                    item={{
                      id: `serum-true-${serumIngredients.map((ingredient) => ingredient.id).sort().join("-")}`,
                      name: `Individuelles Serum (${serumIngredients.length} Wirkstoffe)`,
                      quantity: 1,
                      description: `Wirkstoffe: ${serumIngredients.map((ingredient) => ingredient.name).join(", ")}`,
                    }}
                    onPurchase={handleAddSerum}
                    className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-5 py-3 rounded-sm hover:bg-[#424226] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ShoppingBag size={14} />
                    In den Warenkorb
                  </ShopifyPurchaseButton>
                  <button
                    onClick={() => handleProductClick({ id: "serum" })}
                    className="font-body text-xs tracking-[0.12em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors flex items-center gap-1"
                  >
                    Details <ArrowRight size={12} />
                  </button>
                  <Link href={serumConfigLink} className="font-body text-xs tracking-[0.12em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors flex items-center gap-1">
                    Im Konfigurator anpassen <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STEP 4: CREME ─────────────────────────────────────────────── */}
        <section className="py-12 md:py-16 border-t border-[#E5E0D8] bg-[#F0EBE3]">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-40 h-40 bg-[#F0EBE3] rounded-lg overflow-hidden border border-[#E5E0D8] flex-shrink-0">
                  <img src="/manus-storage/creme_correct_final_006ac061.png" alt="Individuelle Creme" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] mb-2">Creme · {result.cremeUsage === "morgens-abends" ? "Morgens & Abends" : "Abends"}</p>
                <h3 className="font-display text-2xl md:text-3xl text-[#1C1C1A] font-light mb-3">
                  Individuelle Creme · {result.cremeBaseName}
                </h3>
                <p className="font-body text-sm text-[#4A4A48] leading-relaxed mb-6 max-w-lg">
                  {result.cremeBase === "rich"
                    ? "Die reichhaltige Basiscreme baut mit hauteigenen Lipiden deine Hautbarriere auf und versorgt trockene Haut mit extra Fetten."
                    : "Die leichte Basiscreme baut mit hauteigenen Lipiden die Hautbarriere auf und zieht mit ihrer leichten Textur schnell ein."}
                </p>

                {/* Editable Ingredient Cards */}
                <IngredientEditor
                  selected={cremeIngredients}
                  available={CREME_INGREDIENTS}
                  maxCount={4}
                  minCount={2}
                  onChange={setCremeIngredients}
                  productLabel="Creme"
                  icon={<Leaf size={14} className="text-[#5B5B38]" />}
                />

                <div className="flex flex-wrap items-center gap-4">
                  <ShopifyLegacyProductPrice
                    item={{
                      id: `creme-${result.cremeBase}-${cremeIngredients.map((ingredient) => ingredient.id).sort().join("-")}`,
                      name: `Individuelle Creme (${result.cremeBase === "light" ? "Leicht" : "Reichhaltig"}, ${cremeIngredients.length} Wirkstoffe)`,
                      description: `Wirkstoffe: ${cremeIngredients.map((ingredient) => ingredient.name).join(", ")}`,
                    }}
                    showFrom={false}
                    className="font-display text-xl text-[#5B5B38]"
                  />
                  <ShopifyPurchaseButton
                    item={{
                      id: `creme-${result.cremeBase}-${cremeIngredients.map((ingredient) => ingredient.id).sort().join("-")}`,
                      name: `Individuelle Creme (${result.cremeBase === "light" ? "Leicht" : "Reichhaltig"}, ${cremeIngredients.length} Wirkstoffe)`,
                      quantity: 1,
                      description: `Wirkstoffe: ${cremeIngredients.map((ingredient) => ingredient.name).join(", ")}`,
                    }}
                    onPurchase={handleAddCreme}
                    className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-5 py-3 rounded-sm hover:bg-[#424226] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ShoppingBag size={14} />
                    In den Warenkorb
                  </ShopifyPurchaseButton>
                  <button
                    onClick={() => handleProductClick({ id: "creme" })}
                    className="font-body text-xs tracking-[0.12em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors flex items-center gap-1"
                  >
                    Details <ArrowRight size={12} />
                  </button>
                  <Link href={cremeConfigLink} className="font-body text-xs tracking-[0.12em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors flex items-center gap-1">
                    Im Konfigurator anpassen <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STEP 5: SONNENSCHUTZ ──────────────────────────────────────── */}
        <section className="py-12 md:py-16 border-t border-[#E5E0D8]">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-40 h-40 bg-[#F0EBE3] rounded-lg overflow-hidden border border-[#E5E0D8] flex-shrink-0">
                  <img src="/manus-storage/sunscreen_collection_reference_50af2848.webp" alt="Sonnenschutzfluid SPF 50+" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] mb-2">Sonnenschutz · Morgens</p>
                <h3 className="font-display text-2xl md:text-3xl text-[#1C1C1A] font-light mb-3">
                  Sonnenschutzfluid SPF 50+
                </h3>
                <p className="font-body text-sm text-[#4A4A48] leading-relaxed mb-6 max-w-lg">
                  Leichtes Sonnenschutzfluid mit Breitbandschutz vor UVA, UVB und Blaulicht. Kein weißer Schleier, ideal für jeden Tag.
                </p>
                <div className="flex items-center gap-6">
                  <ShopifyLegacyProductPrice
                    item={{ id: "sonnenschutzfluid", name: "Sonnenschutzfluid SPF 50+"}}
                    showFrom={false}
                    className="font-display text-xl text-[#5B5B38]"
                  />
                  <ShopifyPurchaseButton
                    item={{ id: "sonnenschutzfluid", name: "Sonnenschutzfluid SPF 50+", quantity: 1 }}
                    onPurchase={handleAddSunscreen}
                    className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-5 py-3 rounded-sm hover:bg-[#424226] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ShoppingBag size={14} />
                    In den Warenkorb
                  </ShopifyPurchaseButton>
                  <button
                    onClick={() => handleProductClick({ id: "sunscreen" })}
                    className="font-body text-xs tracking-[0.12em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors flex items-center gap-1"
                  >
                    Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TOTAL CTA ─────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-[#5B5B38]">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] mb-2">Gesamte Routine</p>
                <div className="flex items-baseline gap-3">
                  <p className="font-display text-3xl md:text-4xl text-[#F8F5F0] font-light">€210</p>
                  <p className="font-body text-sm text-[#A8B8A6]">Gesamtpreis</p>
                </div>
                <p className="font-body text-sm text-[#A8B8A6] mt-2">5 Produkte · Alle Preise zusammengefasst</p>
              </div>
              <ShopifyPurchaseButton
                items={[
                  { id: result.cleanser.id, name: result.cleanser.name, quantity: 1 },
                  { id: result.peeling.id, name: result.peeling.name, quantity: 1 },
                  {
                    id: `serum-true-${serumIngredients.map((ingredient) => ingredient.id).sort().join("-")}`,
                    name: `Individuelles Serum (${serumIngredients.length} Wirkstoffe)`,
                    quantity: 1,
                    description: `Wirkstoffe: ${serumIngredients.map((ingredient) => ingredient.name).join(", ")}`,
                  },
                  {
                    id: `creme-${result.cremeBase}-${cremeIngredients.map((ingredient) => ingredient.id).sort().join("-")}`,
                    name: `Individuelle Creme (${result.cremeBase === "light" ? "Leicht" : "Reichhaltig"}, ${cremeIngredients.length} Wirkstoffe)`,
                    quantity: 1,
                    description: `Wirkstoffe: ${cremeIngredients.map((ingredient) => ingredient.name).join(", ")}`,
                  },
                  { id: "sonnenschutzfluid", name: "Sonnenschutzfluid SPF 50+", quantity: 1 },
                ]}
                onPurchase={handleAddAll}
                className="px-8 py-3 font-body text-xs tracking-[0.12em] uppercase border bg-[#F8F5F0] text-[#5B5B38] border-[#F8F5F0] hover:bg-transparent hover:text-[#F8F5F0] transition-all"
              >
                Gesamte Routine in den Warenkorb
              </ShopifyPurchaseButton>
            </div>
          </div>
        </section>

        {/* ─── APPLICATION GUIDE ──────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="container max-w-5xl">
            <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-12 font-light">
              So wendest du deine Routine an
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { step: "1", title: "Morgens & Abends: Reinigen", desc: `Starte mit dem ${result.cleanser.name}, um dein Gesicht sanft zu reinigen und deine Haut auf die weiteren Schritte vorzubereiten.` },
                { step: "2", title: "2x pro Woche: Peeling", desc: `Nutze das ${result.peeling.name} zweimal pro Woche für eine sanfte Exfoliation und einen verfeinerten Teint.` },
                { step: "3", title: "Morgens & Abends: Serum", desc: "Trage dein individuelles Serum auf, um deine Haut mit konzentrierten Wirkstoffen zu versorgen." },
                { step: "4", title: result.cremeUsage === "morgens-abends" ? "Morgens & Abends: Creme" : "Abends: Creme", desc: result.cremeUsage === "morgens-abends" ? "Trage deine individuelle Creme morgens und abends auf, um deine trockene Haut rund um die Uhr mit Feuchtigkeit und Schutz zu versorgen." : "Die individuelle Creme stärkt deine Hautbarriere und unterstützt die Regeneration über Nacht." },
                { step: "5", title: "Morgens: Sonnenschutz", desc: "Schütze deine Haut täglich mit dem Sonnenschutzfluid vor UV-Strahlung und Blaulicht." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-6 bg-white rounded-lg border border-[#E5E0D8]">
                  <div className="w-10 h-10 bg-[#5B5B38] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-sm font-light text-[#F8F5F0]">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-[#1C1C1A] mb-2 font-light">{item.title}</h4>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">{item.desc}</p>
                  </div>
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
