/**
 * Routine-Empfehlungen – Vordefinierte Wirkstoff-Vorschläge pro Hauttyp
 * 
 * Jede Routine-Seite zeigt einen konkreten Vorschlag für ein individuelles
 * Serum (3 Wirkstoffe) und eine individuelle Creme (Basis + Wirkstoffe).
 * Der Kunde kann direkt in den Warenkorb legen oder zum Konfigurator gehen.
 */

import { SERUM_INGREDIENTS, CREME_INGREDIENTS, SERUM_PRICE, CREME_PRICES } from "./skinTestRecommendation";

export interface RoutineProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  href: string;
  /** Für individuelle Produkte: Wirkstoff-IDs */
  ingredientIds?: string[];
  /** Für Creme: Basis */
  cremeBase?: "light" | "rich";
  /** Produktbild (optional) */
  image?: string;
  /** 3 Produkt-Benefits */
  benefits?: string[];
}

export interface RoutineRecommendation {
  serum: RoutineProduct;
  creme: RoutineProduct;
  cleanser: RoutineProduct;
  peeling: RoutineProduct;
  sunscreen: RoutineProduct;
}

function buildSerumProduct(ingredientIds: string[]): RoutineProduct {
  const names = ingredientIds.map(id => SERUM_INGREDIENTS[id]?.name || id);
  return {
    id: `serum-true-${ingredientIds.join("-")}`,
    name: "Individuelles Serum",
    description: `Mit ${names.join(", ")}`,
    price: SERUM_PRICE,
    href: `/configurator/serum?ingredients=${ingredientIds.join(",")}`,
    ingredientIds,
  };
}

function buildCremeProduct(base: "light" | "rich", ingredientIds: string[]): RoutineProduct {
  const names = ingredientIds.map(id => CREME_INGREDIENTS[id]?.name || id);
  const baseName = base === "light" ? "Leichte Basis" : "Reichhaltige Basis";
  const price = CREME_PRICES[Math.min(Math.max(ingredientIds.length, 2), 4)] || 41;
  return {
    id: `creme-${base}-${ingredientIds.join("-")}`,
    name: "Individuelle Creme",
    description: `${baseName} mit ${names.join(", ")}`,
    price,
    href: `/configurator/creme?base=${base}&ingredients=${ingredientIds.join(",")}`,
    ingredientIds,
    cremeBase: base,
  };
}

// Produktbilder für individuelle Produkte auf allen Routine-Seiten
// URLs von der Live-Website herbsomweb-rcxwgckf.manus.space
const CREME_IMAGE = "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260617_073341_a333548e-590d-40be-85dc-8fab622efb62(1)_b174e817.png";
const SERUM_IMAGE = "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260617_081131_6c43fbf2-5ff1-4e70-b1e5-84a04df359ae_99d10a88.png";
const CLEANSER_GEL_IMAGE = "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260617_104735_96a13487-7cb4-4b74-bc9b-96bec06d8299_99af9690.png";
const CLEANSER_MILK_IMAGE = "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260617_063746_7eaf81c8-1918-4dff-be57-756dbc7adbba_6eb8b6c2.png";
const AHA_PHA_PEELING_IMAGE = "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260617_105521_c19e75f1-0c78-4e7e-8ca5-860acabba4a8_8179ae66.png";
const BHA_AZELAINSAEURE_PEELING_IMAGE = "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260617_105132_16844215-27d0-45b5-85fd-899e821985e0_ae142792.png";

/**
 * Routine: Reife Haut
 * Fokus: Anti-Aging, Faltenreduktion, Elastizität
 */
export const ROUTINE_REIFE_HAUT: RoutineRecommendation = {
  serum: {
    ...buildSerumProduct(["vitaminc", "spilanthol", "hyaluronic"]),
    image: SERUM_IMAGE,
    benefits: ["Reduziert Falten und feine Linien", "Stärkt die Hautbarriere", "Verbessert die Hautstruktur"],
  },
  creme: {
    ...buildCremeProduct("rich", ["retinol", "vitaminc", "hyaluronic", "spilanthol"]),
    image: CREME_IMAGE,
    benefits: ["Intensive Anti-Aging-Wirkung", "Sichtbar straffere Haut", "Tiefe Feuchtigkeitsversorgung"],
  },
  cleanser: {
    id: "reinigungsmilch",
    name: "Reinigungsmilch",
    description: "Sanfte, cremige Reinigung ohne Austrocknen. Ideal für reife Haut.",
    price: 32,
    href: "/product/cleaner-milk",
    image: CLEANSER_MILK_IMAGE,
    benefits: ["Sanfte Reinigung ohne Austrocknen", "Bewahrt die natürliche Feuchtigkeitsbarriere", "Bereitet die Haut optimal vor"],
  },
  peeling: {
    id: "aha-pha-peeling",
    name: "AHA & PHA Peeling",
    description: "Sanftes Fruchtsäure-Peeling, das abgestorbene Hautzellen entfernt ohne zu reizen.",
    price: 38,
    href: "/product/peeling-aha",
    image: AHA_PHA_PEELING_IMAGE,
    benefits: ["Sanfte Exfoliation ohne Irritation", "Verfeinert die Hautstruktur sichtbar", "Fördert die Zellerneuerung"],
  },
  sunscreen: {
    id: "sunscreen",
    name: "Sonnenschutzfluid SPF 50+",
    description: "Leichtes Sonnenschutzfluid mit Schutz vor UVA, UVB und Blaulicht.",
    price: 35,
    href: "/product/sunscreen",
    image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260616_214129_1222f463-787a-4d2f-b0ae-e43ad47d1b11_ff3763c6.png",
    benefits: ["Breitspektrum-Schutz SPF 50+", "Schützt vor vorzeitiger Hautalterung", "Leichte, nicht-fettende Textur"],
  },
};

/**
 * Routine: Trockene Haut
 * Fokus: Feuchtigkeit, Barrierestärkung, Nährstoffe
 */
export const ROUTINE_TROCKENE_HAUT: RoutineRecommendation = {
  serum: {
    ...buildSerumProduct(["hyaluronic", "algae", "vitaminc"]),
    image: SERUM_IMAGE,
    benefits: ["Intensive Feuchtigkeitszufuhr", "Beruhigt trockene Stellen", "Verbessert die Hautgeschmeidigkeit"],
  },
  creme: {
    ...buildCremeProduct("rich", ["rosehip", "seabuckthorn", "hyaluronic", "spilanthol"]),
    image: CREME_IMAGE,
    benefits: ["Reichhaltige Nährstoffversorgung", "Lindert Trockenheit langfristig", "Stärkt die Hautbarriere"],
  },
  cleanser: {
    id: "reinigungsmilch",
    name: "Reinigungsmilch",
    description: "Sanfte, cremige Reinigung ohne Austrocknen. Ideal für trockene Haut.",
    price: 32,
    href: "/product/cleaner-milk",
    image: CLEANSER_MILK_IMAGE,
    benefits: ["Sanfte Reinigung ohne Austrocknen", "Bewahrt die natürliche Feuchtigkeitsbarriere", "Bereitet die Haut optimal vor"],
  },
  peeling: {
    id: "aha-pha-peeling",
    name: "AHA & PHA Peeling",
    description: "Sanftes Fruchtsäure-Peeling, das abgestorbene Hautzellen entfernt ohne zu reizen.",
    price: 38,
    href: "/product/peeling-aha",
    image: AHA_PHA_PEELING_IMAGE,
    benefits: ["Sanfte Exfoliation ohne Irritation", "Verfeinert die Hautstruktur sichtbar", "Fördert die Zellerneuerung"],
  },
  sunscreen: {
    id: "sunscreen",
    name: "Sonnenschutzfluid SPF 50+",
    description: "Leichtes Sonnenschutzfluid mit Schutz vor UVA, UVB und Blaulicht.",
    price: 35,
    href: "/product/sunscreen",
    image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260616_214129_1222f463-787a-4d2f-b0ae-e43ad47d1b11_ff3763c6.png",
    benefits: ["Breitspektrum-Schutz SPF 50+", "Schützt vor vorzeitiger Hautalterung", "Leichte, nicht-fettende Textur"],
  },
};

/**
 * Routine: Unreine Haut
 * Fokus: Unreinheiten bekämpfen, Talgregulierung, Porenverfeinerung
 */
export const ROUTINE_UNREINE_HAUT: RoutineRecommendation = {
  serum: {
    ...buildSerumProduct(["willow", "niacinamide", "hyaluronic"]),
    image: SERUM_IMAGE,
    benefits: ["Reguliert die Talgproduktion", "Verfeinert vergrößerte Poren", "Beruhigt Unreinheiten"],
  },
  creme: {
    ...buildCremeProduct("light", ["willow", "niacinamide", "hyaluronic", "mallow"]),
    image: CREME_IMAGE,
    benefits: ["Leichte, nicht-komedogene Textur", "Kontrolliert Glanz und Unreinheiten", "Balanciert die Hautöle"],
  },
  cleanser: {
    id: "intensivreiniger",
    name: "Reinigungsgel",
    description: "Tiefenwirksame Reinigung für unreine Haut. Entfernt überschüssigen Talg.",
    price: 32,
    href: "/product/cleaner",
    image: CLEANSER_GEL_IMAGE,
    benefits: ["Tiefenwirksame Porenreinigung", "Entfernt überschüssigen Talg", "Beugt Unreinheiten vor"],
  },
  peeling: {
    id: "bha-azelainsaeure-peeling",
    name: "BHA & Azelainsäure Peeling",
    description: "Tiefenwirksames Peeling, das verstopfte Poren befreit und Unreinheiten reduziert.",
    price: 38,
    href: "/product/peeling",
    image: BHA_AZELAINSAEURE_PEELING_IMAGE,
    benefits: ["Befreit verstopfte Poren", "Reduziert Unreinheiten sichtbar", "Verfeinert die Hautstruktur"],
  },
  sunscreen: {
    id: "sunscreen",
    name: "Sonnenschutzfluid SPF 50+",
    description: "Leichtes, nicht-komedogenes Sonnenschutzfluid mit Schutz vor UVA, UVB und Blaulicht.",
    price: 35,
    href: "/product/sunscreen",
    image: "/manus-storage/hf_20260616_214129_1222f463-787a-4d2f-b0ae-e43ad47d1b11_ff3763c6.png",
    benefits: ["Nicht-komedogene Formel", "Mattierendes Finish", "Schützt vor UV-Schäden"],
  },
};

/**
 * Routine: Mischhaut & Ölige Haut
 * Fokus: Balance, Porenverfeinerung, Talgkontrolle
 */
export const ROUTINE_MISCHHAUT: RoutineRecommendation = {
  serum: {
    ...buildSerumProduct(["niacinamide", "willow", "hyaluronic"]),
    image: SERUM_IMAGE,
    benefits: ["Balanciert ölige und trockene Zonen", "Verfeinert die Poren", "Mattiert ohne auszutrocknen"],
  },
  creme: {
    ...buildCremeProduct("light", ["niacinamide", "willow", "hyaluronic", "grapeseed"]),
    image: CREME_IMAGE,
    benefits: ["Leichte, ausgleichende Textur", "Kontrolliert Glanz in der T-Zone", "Versorgt trockene Bereiche"],
  },
  cleanser: {
    id: "intensivreiniger",
    name: "Reinigungsgel",
    description: "Tiefenwirksame Reinigung, die überschüssigen Talg entfernt ohne auszutrocknen.",
    price: 32,
    href: "/product/cleaner",
    image: CLEANSER_GEL_IMAGE,
    benefits: ["Tiefenwirksame Porenreinigung", "Entfernt überschüssigen Talg", "Beugt Unreinheiten vor"],
  },
  peeling: {
    id: "bha-azelainsaeure-peeling",
    name: "BHA & Azelainsäure Peeling",
    description: "Reguliert die Talgproduktion und verfeinert vergrößerte Poren.",
    price: 38,
    href: "/product/peeling",
    image: BHA_AZELAINSAEURE_PEELING_IMAGE,
    benefits: ["Reguliert die Talgproduktion", "Verfeinert vergrößerte Poren", "Gleicht die Hautstruktur aus"],
  },
  sunscreen: {
    id: "sunscreen",
    name: "Sonnenschutzfluid SPF 50+",
    description: "Leichtes, mattierendes Sonnenschutzfluid mit Schutz vor UVA, UVB und Blaulicht.",
    price: 35,
    href: "/product/sunscreen",
    image: "/manus-storage/hf_20260616_214129_1222f463-787a-4d2f-b0ae-e43ad47d1b11_ff3763c6.png",
    benefits: ["Mattierendes Finish", "Nicht-komedogene Formel", "Langanhaltender Schutz"],
  },
};

/**
 * Routine: Empfindliche Haut
 * Fokus: Beruhigung, Rötungen reduzieren, Barriereschutz
 */
export const ROUTINE_EMPFINDLICHE_HAUT: RoutineRecommendation = {
  serum: {
    ...buildSerumProduct(["mallow", "horsechestnut", "hyaluronic"]),
    image: SERUM_IMAGE,
    benefits: ["Beruhigt gereizte Haut", "Lindert Rötungen", "Stärkt die Hautbarriere"],
  },
  creme: {
    ...buildCremeProduct("rich", ["mallow", "horsechestnut", "vitaminc", "hyaluronic"]),
    image: CREME_IMAGE,
    benefits: ["Intensive Beruhigung", "Reduziert Rötungen sichtbar", "Schützt die empfindliche Haut"],
  },
  cleanser: {
    id: "reinigungsmilch",
    name: "Reinigungsmilch",
    description: "Sanfte, cremige Reinigung für empfindliche und reaktive Haut.",
    price: 32,
    href: "/product/cleaner-milk",
    image: CLEANSER_MILK_IMAGE,
    benefits: ["Sanfte Reinigung ohne Reizung", "Bewahrt die Hautbarriere", "Beruhigt während der Reinigung"],
  },
  peeling: {
    id: "aha-pha-peeling",
    name: "AHA & PHA Peeling",
    description: "Extra sanftes Peeling mit PHA, das die Haut nicht reizt.",
    price: 38,
    href: "/product/peeling-aha",
    image: AHA_PHA_PEELING_IMAGE,
    benefits: ["Sanfte Exfoliation ohne Irritation", "Verfeinert die Hautstruktur sichtbar", "Fördert die Zellerneuerung"],
  },
  sunscreen: {
    id: "sunscreen",
    name: "Sonnenschutzfluid SPF 50+",
    description: "Leichtes Sonnenschutzfluid mit Schutz vor UVA, UVB und Blaulicht.",
    price: 35,
    href: "/product/sunscreen",
    image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260616_214129_1222f463-787a-4d2f-b0ae-e43ad47d1b11_ff3763c6.png",
    benefits: ["Hypoallergene Formel", "Schützt empfindliche Haut", "Beruhigende Inhaltsstoffe"],
  },
};

/**
 * Routine: Sensible Haut (Rosacea/Couperose)
 * Fokus: Rötungen, rote Äderchen, Beruhigung
 */
export const ROUTINE_SENSIBLE_HAUT: RoutineRecommendation = {
  serum: {
    ...buildSerumProduct(["horsechestnut", "mallow", "algae"]),
    image: SERUM_IMAGE,
    benefits: ["Reduziert Rötungen und Äderchen", "Stärkt die Kapillarwände", "Beruhigt die Haut"],
  },
  creme: {
    ...buildCremeProduct("rich", ["mallow", "horsechestnut", "vitaminc", "hyaluronic"]),
    image: CREME_IMAGE,
    benefits: ["Intensive Rötungsreduktion", "Schützt vor Reizstoffen", "Lindert Couperose-Symptome"],
  },
  cleanser: {
    id: "reinigungsmilch",
    name: "Reinigungsmilch",
    description: "Sanfte, cremige Reinigung für sensible Haut mit Rötungen.",
    price: 32,
    href: "/product/cleaner-milk",
    image: CLEANSER_MILK_IMAGE,
    benefits: ["Sanfte Reinigung ohne Reizung", "Bewahrt die Hautbarriere", "Beruhigt während der Reinigung"],
  },
  peeling: {
    id: "aha-pha-peeling",
    name: "AHA & PHA Peeling",
    description: "Extra sanftes Peeling mit PHA, das Rötungen nicht verschlimmert.",
    price: 38,
    href: "/product/peeling-aha",
    image: AHA_PHA_PEELING_IMAGE,
    benefits: ["Sanfte Exfoliation ohne Irritation", "Verfeinert die Hautstruktur sichtbar", "Fördert die Zellerneuerung"],
  },
  sunscreen: {
    id: "sunscreen",
    name: "Sonnenschutzfluid SPF 50+",
    description: "Leichtes Sonnenschutzfluid mit Schutz vor UVA, UVB und Blaulicht.",
    price: 35,
    href: "/product/sunscreen",
    image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260616_214129_1222f463-787a-4d2f-b0ae-e43ad47d1b11_ff3763c6.png",
    benefits: ["Hypoallergene Formel", "Schützt sensible Haut", "Beruhigende Inhaltsstoffe"],
  },
};

/**
 * Routine: Normale Haut
 * Fokus: Pflege, Prävention, Ausstrahlung
 */
export const ROUTINE_NORMALE_HAUT: RoutineRecommendation = {
  serum: {
    ...buildSerumProduct(["vitaminc", "hyaluronic", "spilanthol"]),
    image: SERUM_IMAGE,
    benefits: ["Erhöht die Hautausstrahlung", "Schützt vor Umweltschäden", "Verbessert die Hautstruktur"],
  },
  creme: {
    ...buildCremeProduct("light", ["vitaminc", "mallow", "hyaluronic", "algae"]),
    image: CREME_IMAGE,
    benefits: ["Leichte, ausgleichende Textur", "Versorgt mit Feuchtigkeit", "Schützt vor vorzeitiger Hautalterung"],
  },
  cleanser: {
    id: "intensivreiniger",
    name: "Reinigungsgel",
    description: "Sanfte, tiefenwirksame Reinigung für eine strahlend reine Haut.",
    price: 32,
    href: "/product/cleaner",
    image: CLEANSER_GEL_IMAGE,
    benefits: ["Tiefenwirksame Porenreinigung", "Erhält das natürliche Gleichgewicht", "Bereitet die Haut optimal vor"],
  },
  peeling: {
    id: "aha-pha-peeling",
    name: "AHA & PHA Peeling",
    description: "Sanftes Fruchtsäure-Peeling für eine verfeinerte Hautstruktur.",
    price: 38,
    href: "/product/peeling-aha",
    image: AHA_PHA_PEELING_IMAGE,
    benefits: ["Sanfte Exfoliation ohne Irritation", "Verfeinert die Hautstruktur sichtbar", "Fördert die Zellerneuerung"],
  },
  sunscreen: {
    id: "sunscreen",
    name: "Sonnenschutzfluid SPF 50+",
    description: "Leichtes Sonnenschutzfluid mit Schutz vor UVA, UVB und Blaulicht.",
    price: 35,
    href: "/product/sunscreen",
    image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260616_214129_1222f463-787a-4d2f-b0ae-e43ad47d1b11_ff3763c6.png",
    benefits: ["Breitspektrum-Schutz SPF 50+", "Schützt vor vorzeitiger Hautalterung", "Leichte, nicht-fettende Textur"],
  },
};
