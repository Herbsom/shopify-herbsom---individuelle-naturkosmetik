/**
 * Hauttest Empfehlungslogik – Herbsom
 * 
 * Basierend auf den 10 Quiz-Fragen werden individuelle Empfehlungen generiert:
 * - Serum-Wirkstoffe (max 3, Vitamin C + Niacinamide nicht kombinierbar)
 * - Creme-Wirkstoffe (max 4, Vitamin C + Niacinamide nicht kombinierbar)
 * - Creme-Basis (leicht / reichhaltig)
 * - Reiniger (Intensivreiniger / Reinigungsmilch)
 * - Peeling (AHA & PHA Peeling / BHA & Azelainsäure Peeling)
 */

export interface QuizAnswer {
  question: number;
  answer: string | string[];
}

export interface IngredientRecommendation {
  id: string;
  name: string;
  description: string;
}

export interface SkinTestResult {
  /** Empfohlene Serum-Wirkstoffe (genau 3) */
  serumIngredients: IngredientRecommendation[];
  /** Empfohlene Creme-Wirkstoffe (2-4) */
  cremeIngredients: IngredientRecommendation[];
  /** Creme-Basis: "light" oder "rich" */
  cremeBase: "light" | "rich";
  cremeBaseName: string;
  /** Creme-Anwendung: "morgens-abends" bei trockener Haut, sonst "abends" */
  cremeUsage: "morgens-abends" | "abends";
  /** Empfohlener Reiniger */
  cleanser: {
    id: string;
    name: string;
    description: string;
    price: number;
    href: string;
    image: string;
  };
  /** Empfohlenes Peeling */
  peeling: {
    id: string;
    name: string;
    description: string;
    price: number;
    href: string;
    image: string;
  };
  /** Serum-Preis */
  serumPrice: number;
  /** Creme-Preis (abhängig von Wirkstoffanzahl) */
  cremePrice: number;
  /** Zusammenfassung der Hautanalyse */
  skinSummary: string;
}

// Serum-Wirkstoffe (gleiche IDs wie ConfiguratorSerum)
export const SERUM_INGREDIENTS: Record<string, IngredientRecommendation> = {
  willow: { id: "willow", name: "Weidenrindenextrakt", description: "Reduziert Hautglanz und behandelt Unreinheiten" },
  niacinamide: { id: "niacinamide", name: "Niacinamide-Komplex", description: "Verfeinert vergrößerte Poren" },
  vitaminc: { id: "vitaminc", name: "Vitamin C-Komplex", description: "Beugt Hautalterung vor und hellt Pigmentflecken auf" },
  retinol: { id: "retinol", name: "Retinolkomplex", description: "Reduziert Falten und erneuert die Haut" },
  spilanthol: { id: "spilanthol", name: "Spilantholkomplex", description: "Entspannt die Mimik und glättet die Haut sofort" },
  mallow: { id: "mallow", name: "Malvenextrakt", description: "Beruhigt und reduziert Rötungen" },
  horsechestnut: { id: "horsechestnut", name: "Rosskastanienextrakt", description: "Mindert rote Äderchen, Couperose und Rosazea" },
  algae: { id: "algae", name: "Algenextrakt", description: "Spendet intensiv Feuchtigkeit" },
  hyaluronic: { id: "hyaluronic", name: "Hyaluronkomplex", description: "Glättet und polstert auf" },
};

// Creme-Wirkstoffe (gleiche IDs wie ConfiguratorCreme, inkl. Öle)
export const CREME_INGREDIENTS: Record<string, IngredientRecommendation> = {
  ...SERUM_INGREDIENTS,
  rosehip: { id: "rosehip", name: "Wildrosenöl", description: "Versorgt trockene Haut und erhöht die Vitalität der Haut" },
  seabuckthorn: { id: "seabuckthorn", name: "Sanddornöl", description: "Versorgt trockene Haut und glättet Falten" },
  grapeseed: { id: "grapeseed", name: "Traubenkernöl", description: "Versorgt trockene Haut und schützt die Zellen" },
  thistle: { id: "thistle", name: "Distelöl", description: "Versorgt trockene Stellen ohne die Poren zu verstopfen" },
};

export const CREME_PRICES: Record<number, number> = { 2: 36, 3: 41, 4: 46 };
export const SERUM_PRICE = 55;

function getAnswer(answers: QuizAnswer[], questionId: number): string | string[] | undefined {
  return answers.find((a) => a.question === questionId)?.answer;
}

function getAnswerStr(answers: QuizAnswer[], questionId: number): string {
  const a = getAnswer(answers, questionId);
  return typeof a === "string" ? a : "";
}

function getAnswerArr(answers: QuizAnswer[], questionId: number): string[] {
  const a = getAnswer(answers, questionId);
  return Array.isArray(a) ? a : [];
}

/**
 * Hauptfunktion: Berechnet die individuellen Empfehlungen basierend auf den Quiz-Antworten
 */
export function calculateRecommendation(answers: QuizAnswer[]): SkinTestResult {
  const sensitivity = getAnswerStr(answers, 2);
  const skinFeel = getAnswerStr(answers, 3);
  const wrinkles = getAnswerStr(answers, 4);
  const pores = getAnswerStr(answers, 5);
  const blemishes = getAnswerStr(answers, 6);
  const oiliness = getAnswerStr(answers, 7);
  const complexion = getAnswerStr(answers, 8);
  const condition = getAnswerStr(answers, 9);
  const goals = getAnswerArr(answers, 10);

  // ─── SCORING: Wirkstoff-Relevanz berechnen ───────────────────────────
  const scores: Record<string, number> = {};
  const addScore = (id: string, points: number) => {
    scores[id] = (scores[id] || 0) + points;
  };

  // Frage 3: Hautgefühl
  if (skinFeel === "Sehr trocken und sie spannt") {
    addScore("hyaluronic", 3);
    addScore("rosehip", 3);
    addScore("algae", 2);
  } else if (skinFeel === "Trocken") {
    addScore("hyaluronic", 3);
    addScore("algae", 2);
  } else if (skinFeel === "Trocken und fettig") {
    addScore("niacinamide", 2);
    addScore("hyaluronic", 1);
  } else if (skinFeel === "Fettig") {
    addScore("willow", 3);
    addScore("niacinamide", 2);
  }

  // Frage 4: Falten
  if (wrinkles === "Feine Linien und leichte Fältchen") {
    addScore("vitaminc", 2);
  } else if (wrinkles === "Einige Falten") {
    addScore("vitaminc", 3);
    addScore("spilanthol", 2);
  } else if (wrinkles === "Viele Falten") {
    addScore("retinol", 3);
    addScore("vitaminc", 2);
    addScore("spilanthol", 2);
  }

  // Frage 5: Poren
  if (pores === "Stellenweise vergrößert und verstopft (T-Zone)" || pores === "Allgemein vergrößert und verstopft") {
    addScore("niacinamide", 2);
    addScore("willow", 1);
  } else if (pores === "Stellenweise vergrößert (T-Zone)" || pores === "Allgemein vergrößert") {
    addScore("niacinamide", 1);
  }

  // Frage 6: Unreinheiten
  if (blemishes === "Ja, ich habe häufig viele Pickel und Mitesser") {
    addScore("willow", 3);
    addScore("niacinamide", 2);
  } else if (blemishes === "Ich habe ab und zu Pickel und Mitesser") {
    addScore("niacinamide", 2);
    addScore("willow", 1);
  }

  // Frage 7: Hautglanz
  if (oiliness === "Ja") {
    addScore("willow", 2);
    addScore("niacinamide", 1);
  } else if (oiliness === "Manchmal in der T-Zone") {
    addScore("niacinamide", 1);
  }

  // Frage 8: Teint
  if (complexion === "Ungleichmäßig mit Rötungen und Flecken") {
    addScore("mallow", 3);
    addScore("horsechestnut", 2);
  } else if (complexion === "Matt und fahl") {
    addScore("vitaminc", 1);
  }

  // Frage 9: Hautkrankheiten
  if (condition === "Rosacea" || condition === "Couperose") {
    addScore("mallow", 3);
    addScore("horsechestnut", 3);
  } else if (condition === "Neurodermitis") {
    addScore("algae", 3);
    addScore("hyaluronic", 2);
  } else if (condition === "Akne") {
    addScore("willow", 3);
    addScore("niacinamide", 2);
  } else if (condition === "Periorale Dermatitis") {
    addScore("mallow", 2);
  } else if (condition === "Schuppenflechte") {
    addScore("algae", 2);
    addScore("mallow", 1);
  }

  // Frage 10: Ziele (bis zu 2)
  goals.forEach((goal) => {
    switch (goal) {
      case "Falten glätten und Pigmentflecken aufhellen":
        addScore("vitaminc", 3);
        addScore("retinol", 2);
        break;
      case "Unreinheiten & Hautglanz reduzieren":
        addScore("willow", 3);
        addScore("niacinamide", 2);
        break;
      case "Sensible Haut beruhigen":
        addScore("mallow", 3);
        addScore("horsechestnut", 1);
        break;
      case "Rote Äderchen, Rötungen und Schwellungen abschwächen":
        addScore("horsechestnut", 3);
        addScore("mallow", 2);
        break;
      case "Poren verfeinern & Hautbild verbessern":
        addScore("niacinamide", 3);
        addScore("willow", 1);
        break;
      case "Trockene Stellen ausgleichen und Feuchtigkeit spenden":
        addScore("hyaluronic", 3);
        addScore("algae", 2);
        break;
      case "Glattere Haut & mehr Spannkraft":
        addScore("spilanthol", 3);
        addScore("vitaminc", 1);
        break;
    }
  });

  // ─── SERUM-WIRKSTOFFE AUSWÄHLEN (max 3) ──────────────────────────────
  const serumIngredientIds = selectIngredients(
    scores,
    Object.keys(SERUM_INGREDIENTS),
    3
  );
  const serumIngredients = serumIngredientIds.map((id) => SERUM_INGREDIENTS[id]);

  // ─── CREME-WIRKSTOFFE AUSWÄHLEN (max 4) ──────────────────────────────
  // Creme kann zusätzlich Öle enthalten für trockene Haut
  const cremeScores = { ...scores };
  // Öle extra boosten bei trockener Haut
  if (skinFeel === "Sehr trocken und sie spannt") {
    cremeScores["rosehip"] = (cremeScores["rosehip"] || 0) + 3;
    cremeScores["seabuckthorn"] = (cremeScores["seabuckthorn"] || 0) + 2;
  } else if (skinFeel === "Trocken") {
    cremeScores["grapeseed"] = (cremeScores["grapeseed"] || 0) + 2;
    cremeScores["thistle"] = (cremeScores["thistle"] || 0) + 1;
  }

  const cremeIngredientIds = selectIngredients(
    cremeScores,
    Object.keys(CREME_INGREDIENTS),
    4
  );
  // Mindestens 2 Wirkstoffe für die Creme
  const finalCremeIds = cremeIngredientIds.length >= 2 ? cremeIngredientIds : cremeIngredientIds.concat(
    Object.keys(CREME_INGREDIENTS)
      .filter((id) => !cremeIngredientIds.includes(id) && isCompatible(id, cremeIngredientIds))
      .slice(0, 2 - cremeIngredientIds.length)
  );
  const cremeIngredients = finalCremeIds.slice(0, 4).map((id) => CREME_INGREDIENTS[id]);

  // ─── CREME-BASIS ──────────────────────────────────────────────────────
  const cremeBase: "light" | "rich" =
    skinFeel === "Sehr trocken und sie spannt" || skinFeel === "Trocken"
      ? "rich"
      : "light";
  const cremeBaseName = cremeBase === "light"
    ? "Basiscreme (Leicht)"
    : "Basiscreme Reichhaltig";

  // ─── CREME-ANWENDUNG ────────────────────────────────────────────────────
  // Bei trockener Haut auch morgens empfehlen, nicht nur abends
  const cremeUsage: "morgens-abends" | "abends" =
    skinFeel === "Sehr trocken und sie spannt" || skinFeel === "Trocken"
      ? "morgens-abends"
      : "abends";

  // ─── REINIGER ─────────────────────────────────────────────────────────
  const needsIntensiveCleaner =
    skinFeel === "Fettig" ||
    skinFeel === "Trocken und fettig" ||
    blemishes === "Ja, ich habe häufig viele Pickel und Mitesser" ||
    oiliness === "Ja";

  const cleanser = needsIntensiveCleaner
    ? {
        id: "intensivreiniger",
        name: "Reinigungsgel",
        description: "Tiefenwirksame Reinigung für ölige und unreine Haut. Entfernt überschüssigen Talg und befreit verstopfte Poren.",
        price: 32,
        href: "/product/cleaner",
        image: "/manus-storage/product-cleaner-reinigungsgel_9a8e77c6.png",
      }
    : {
        id: "reinigungsmilch",
        name: "Reinigungsmilch",
        description: "Sanfte, cremige Reinigung für trockene und empfindliche Haut. Reinigt gründlich ohne Austrocknen.",
        price: 32,
        href: "/product/cleaner-milk",
        image: "/manus-storage/product-cleaner-reinigungs-milch_7d3e023f.png",
      };

  // ─── PEELING ──────────────────────────────────────────────────────────
  // BHA/Azelainsäure: bei öliger/unreiner Haut, Akne, verstopften Poren
  // AHA/PHA: bei trockener, empfindlicher Haut, Falten, Rötungen, fahlem Teint
  const needsBHAPeeling =
    skinFeel === "Fettig" ||
    skinFeel === "Trocken und fettig" ||
    blemishes === "Ja, ich habe häufig viele Pickel und Mitesser" ||
    blemishes === "Ich habe ab und zu Pickel und Mitesser" ||
    condition === "Akne" ||
    oiliness === "Ja" ||
    pores === "Allgemein vergrößert und verstopft" ||
    pores === "Stellenweise vergrößert und verstopft (T-Zone)";

  const peeling = needsBHAPeeling
    ? {
        id: "bha-azelainsaeure-peeling",
        name: "BHA & Azelainsäure Peeling",
        description: "Tiefenwirksames Peeling mit Salicylsäure und Azelainsäure. Befreit verstopfte Poren, reduziert Unreinheiten und reguliert die Talgproduktion.",
        price: 38,
        href: "/product/peeling",
        image: "/manus-storage/product-peeling-bha-azelainsaure-peeling_2bd366e6.png",
      }
    : {
        id: "aha-pha-peeling",
        name: "AHA & PHA Peeling",
        description: "Sanftes Fruchtsäure-Peeling mit PHA für eine verfeinerte Hautstruktur. Ideal für empfindliche, trockene und reife Haut.",
        price: 38,
        href: "/product/peeling-aha",
        image: "/manus-storage/product-peeling-aha-pha-peeling_333cbf38.png",
      };

  // ─── PREISE ───────────────────────────────────────────────────────────
  const serumPrice = 55;
  const cremePrice = CREME_PRICES[Math.min(Math.max(cremeIngredients.length, 2), 4)] || 41;

  // ─── ZUSAMMENFASSUNG ──────────────────────────────────────────────────
  const skinSummary = generateSkinSummary(skinFeel, wrinkles, blemishes, complexion, condition, sensitivity);

  return {
    serumIngredients,
    cremeIngredients,
    cremeBase,
    cremeBaseName,
    cremeUsage,
    cleanser,
    peeling,
    serumPrice,
    cremePrice,
    skinSummary,
  };
}

/**
 * Wählt die besten Wirkstoffe basierend auf Scores aus.
 * Beachtet die Vitamin C + Niacinamide Inkompatibilität.
 */
function selectIngredients(
  scores: Record<string, number>,
  availableIds: string[],
  maxCount: number
): string[] {
  // Sortiere nach Score (absteigend)
  const sorted = availableIds
    .filter((id) => (scores[id] || 0) > 0)
    .sort((a, b) => (scores[b] || 0) - (scores[a] || 0));

  const selected: string[] = [];
  for (const id of sorted) {
    if (selected.length >= maxCount) break;
    if (isCompatible(id, selected)) {
      selected.push(id);
    }
  }

  // Falls weniger als gewünscht, mit Standardwirkstoffen auffüllen
  if (selected.length < maxCount) {
    const defaults = ["hyaluronic", "vitaminc", "algae", "mallow", "spilanthol"];
    for (const id of defaults) {
      if (selected.length >= maxCount) break;
      if (!selected.includes(id) && availableIds.includes(id) && isCompatible(id, selected)) {
        selected.push(id);
      }
    }
  }

  return selected;
}

/**
 * Prüft ob ein Wirkstoff mit den bereits ausgewählten kompatibel ist
 * (Vitamin C + Niacinamide dürfen nicht zusammen)
 */
function isCompatible(id: string, selected: string[]): boolean {
  if (id === "vitaminc" && selected.includes("niacinamide")) return false;
  if (id === "niacinamide" && selected.includes("vitaminc")) return false;
  return true;
}

/**
 * Generiert eine kurze Zusammenfassung des Hauttyps
 */
function generateSkinSummary(
  skinFeel: string,
  wrinkles: string,
  blemishes: string,
  complexion: string,
  condition: string,
  sensitivity: string
): string {
  const traits: string[] = [];

  // Hauttyp
  if (skinFeel === "Sehr trocken und sie spannt" || skinFeel === "Trocken") {
    traits.push("trockene Haut");
  } else if (skinFeel === "Fettig") {
    traits.push("ölige Haut");
  } else if (skinFeel === "Trocken und fettig") {
    traits.push("Mischhaut");
  } else {
    traits.push("normale Haut");
  }

  // Empfindlichkeit
  if (sensitivity === "Sehr empfindlich") {
    traits.push("sehr empfindlich");
  } else if (sensitivity === "Empfindlich") {
    traits.push("empfindlich");
  }

  // Falten
  if (wrinkles === "Viele Falten") {
    traits.push("ausgeprägte Falten");
  } else if (wrinkles === "Einige Falten") {
    traits.push("erste Falten");
  }

  // Unreinheiten
  if (blemishes === "Ja, ich habe häufig viele Pickel und Mitesser") {
    traits.push("Neigung zu Unreinheiten");
  }

  // Rötungen
  if (complexion === "Ungleichmäßig mit Rötungen und Flecken") {
    traits.push("Rötungen");
  }

  // Hautkrankheit
  if (condition !== "Keine Hautkrankheit") {
    traits.push(condition);
  }

  if (traits.length === 0) return "Deine Haut ist insgesamt in gutem Zustand.";

  return `Deine Hautanalyse zeigt: ${traits.join(", ")}. Wir haben deine Routine speziell auf diese Bedürfnisse abgestimmt.`;
}
