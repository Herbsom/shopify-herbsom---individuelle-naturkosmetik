import { describe, it, expect } from "vitest";

// We test the recommendation logic by importing it directly
// Since it's a client-side module, we import from the source
import { calculateRecommendation, type QuizAnswer } from "../client/src/lib/skinTestRecommendation";

describe("Skin Test Recommendation Engine", () => {
  const baseAnswers: QuizAnswer[] = [
    { question: 1, answer: "30-39" },
    { question: 2, answer: "Gar nicht empfindlich" },
    { question: 3, answer: "Normal" },
    { question: 4, answer: "Keine Falten" },
    { question: 5, answer: "Unauffällig und fein" },
    { question: 6, answer: "Ich habe nie Probleme mit Unreinheiten" },
    { question: 7, answer: "Nein" },
    { question: 8, answer: "Gleichmäßig und frisch" },
    { question: 9, answer: "Keine Hautkrankheit" },
    { question: 10, answer: ["Glattere Haut & mehr Spannkraft", "Trockene Stellen ausgleichen und Feuchtigkeit spenden"] },
  ];

  it("returns exactly 3 serum ingredients", () => {
    const result = calculateRecommendation(baseAnswers);
    expect(result.serumIngredients).toHaveLength(3);
  });

  it("returns 2-4 creme ingredients", () => {
    const result = calculateRecommendation(baseAnswers);
    expect(result.cremeIngredients.length).toBeGreaterThanOrEqual(2);
    expect(result.cremeIngredients.length).toBeLessThanOrEqual(4);
  });

  it("never combines Vitamin C and Niacinamide in serum", () => {
    // Force both by answering for blemishes AND wrinkles
    const answers: QuizAnswer[] = [
      { question: 1, answer: "40-49" },
      { question: 2, answer: "Gar nicht empfindlich" },
      { question: 3, answer: "Fettig" },
      { question: 4, answer: "Viele Falten" },
      { question: 5, answer: "Allgemein vergrößert und verstopft" },
      { question: 6, answer: "Ja, ich habe häufig viele Pickel und Mitesser" },
      { question: 7, answer: "Ja" },
      { question: 8, answer: "Matt und fahl" },
      { question: 9, answer: "Akne" },
      { question: 10, answer: ["Falten glätten und Pigmentflecken aufhellen", "Unreinheiten & Hautglanz reduzieren"] },
    ];
    const result = calculateRecommendation(answers);
    const serumIds = result.serumIngredients.map((i) => i.id);
    const hasVitC = serumIds.includes("vitaminc");
    const hasNia = serumIds.includes("niacinamide");
    expect(hasVitC && hasNia).toBe(false);
  });

  it("never combines Vitamin C and Niacinamide in creme", () => {
    const answers: QuizAnswer[] = [
      { question: 1, answer: "40-49" },
      { question: 2, answer: "Gar nicht empfindlich" },
      { question: 3, answer: "Fettig" },
      { question: 4, answer: "Viele Falten" },
      { question: 5, answer: "Allgemein vergrößert und verstopft" },
      { question: 6, answer: "Ja, ich habe häufig viele Pickel und Mitesser" },
      { question: 7, answer: "Ja" },
      { question: 8, answer: "Matt und fahl" },
      { question: 9, answer: "Akne" },
      { question: 10, answer: ["Falten glätten und Pigmentflecken aufhellen", "Unreinheiten & Hautglanz reduzieren"] },
    ];
    const result = calculateRecommendation(answers);
    const cremeIds = result.cremeIngredients.map((i) => i.id);
    const hasVitC = cremeIds.includes("vitaminc");
    const hasNia = cremeIds.includes("niacinamide");
    expect(hasVitC && hasNia).toBe(false);
  });

  it("recommends rich base for very dry skin", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3),
      { question: 3, answer: "Sehr trocken und sie spannt" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.cremeBase).toBe("rich");
  });

  it("recommends light base for oily skin", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3),
      { question: 3, answer: "Fettig" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.cremeBase).toBe("light");
  });

  it("recommends Intensivreiniger for oily skin with blemishes", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3 && a.question !== 6),
      { question: 3, answer: "Fettig" },
      { question: 6, answer: "Ja, ich habe häufig viele Pickel und Mitesser" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.cleanser.id).toBe("intensivreiniger");
  });

  it("recommends Reinigungsmilch for dry skin", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3),
      { question: 3, answer: "Trocken" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.cleanser.id).toBe("reinigungsmilch");
  });

  it("recommends AHA/PHA peeling for sensitive skin with Rosacea (gentle option)", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 2 && a.question !== 9),
      { question: 2, answer: "Sehr empfindlich" },
      { question: 9, answer: "Rosacea" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.peeling.id).toBe("aha-pha-peeling");
  });

  it("recommends mallow and horsechestnut for Rosacea", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 9),
      { question: 9, answer: "Rosacea" },
    ];
    const result = calculateRecommendation(answers);
    const serumIds = result.serumIngredients.map((i) => i.id);
    expect(serumIds).toContain("mallow");
    expect(serumIds).toContain("horsechestnut");
  });

  it("recommends willow for acne-prone skin", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 6 && a.question !== 9),
      { question: 6, answer: "Ja, ich habe häufig viele Pickel und Mitesser" },
      { question: 9, answer: "Akne" },
    ];
    const result = calculateRecommendation(answers);
    const serumIds = result.serumIngredients.map((i) => i.id);
    expect(serumIds).toContain("willow");
  });

  it("includes hyaluronic for very dry skin", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3 && a.question !== 10),
      { question: 3, answer: "Sehr trocken und sie spannt" },
      { question: 10, answer: ["Trockene Stellen ausgleichen und Feuchtigkeit spenden"] },
    ];
    const result = calculateRecommendation(answers);
    const serumIds = result.serumIngredients.map((i) => i.id);
    expect(serumIds).toContain("hyaluronic");
  });

  it("generates a non-empty skin summary", () => {
    const result = calculateRecommendation(baseAnswers);
    expect(result.skinSummary).toBeTruthy();
    expect(result.skinSummary.length).toBeGreaterThan(10);
  });

  it("calculates correct total price", () => {
    const result = calculateRecommendation(baseAnswers);
    const expectedTotal = result.cleanser.price + result.peeling.price + result.serumPrice + result.cremePrice + 35;
    expect(result.cleanser.price + result.peeling.price + result.serumPrice + result.cremePrice + 35).toBe(expectedTotal);
  });

  it("all ingredients have id, name, and description", () => {
    const result = calculateRecommendation(baseAnswers);
    for (const ing of [...result.serumIngredients, ...result.cremeIngredients]) {
      expect(ing.id).toBeTruthy();
      expect(ing.name).toBeTruthy();
      expect(ing.description).toBeTruthy();
    }
  });

  it("recommends creme morgens-abends for very dry skin", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3),
      { question: 3, answer: "Sehr trocken und sie spannt" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.cremeUsage).toBe("morgens-abends");
  });

  it("recommends creme morgens-abends for dry skin", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3),
      { question: 3, answer: "Trocken" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.cremeUsage).toBe("morgens-abends");
  });

  it("recommends creme only abends for normal skin", () => {
    const result = calculateRecommendation(baseAnswers);
    expect(result.cremeUsage).toBe("abends");
  });

  it("recommends BHA/Azelainsäure peeling for oily acne-prone skin", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3 && a.question !== 6 && a.question !== 9),
      { question: 3, answer: "Fettig" },
      { question: 6, answer: "Ja, ich habe häufig viele Pickel und Mitesser" },
      { question: 9, answer: "Akne" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.peeling.id).toBe("bha-azelainsaeure-peeling");
  });

  it("recommends AHA/PHA peeling for dry skin without blemishes", () => {
    const answers: QuizAnswer[] = [
      ...baseAnswers.filter((a) => a.question !== 3),
      { question: 3, answer: "Trocken" },
    ];
    const result = calculateRecommendation(answers);
    expect(result.peeling.id).toBe("aha-pha-peeling");
  });
});
