import { describe, expect, it } from "vitest";
import { HOME_IMAGES } from "./homeAssets";

describe("HOME_IMAGES", () => {
  it("uses all five project-hosted originals from the reference task", () => {
    expect(HOME_IMAGES.hero).toBe("/manus-storage/herbsom-reference-hero_bbea9f3d.webp");
    expect(HOME_IMAGES.ingredients).toBe("/manus-storage/herbsom-reference-ingredients_efc10a47.webp");
    expect(HOME_IMAGES.ritual).toBe("/manus-storage/herbsom-reference-ritual_d9ac2a9e.webp");
    expect(HOME_IMAGES.texture).toBe("/manus-storage/herbsom-reference-texture_f285c3ae.webp");
    expect(HOME_IMAGES.products).toBe("/manus-storage/herbsom-reference-products_d6c6bf77.webp");
  });

  it("keeps every home image on an absolute project asset path", () => {
    expect(Object.values(HOME_IMAGES).every((source) => source.startsWith("/manus-storage/"))).toBe(true);
  });
});
