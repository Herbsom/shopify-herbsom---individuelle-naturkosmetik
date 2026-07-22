import { describe, expect, it } from "vitest";
import { HOME_IMAGES } from "../client/src/lib/homeAssets";

const expectedReferenceAssets = {
  hero: "/manus-storage/herbsom-site-hero_cae59246.png",
  productSerum: "/manus-storage/herbsom-site-product-serum_24a1f600.png",
  productCream: "/manus-storage/herbsom-site-product-cream_c54c24fe.png",
  productCleanser: "/manus-storage/herbsom-site-product-cleanser_7661ffa0.png",
  productPeeling: "/manus-storage/herbsom-site-product-peeling_632e04ea.png",
  ingredients: "/manus-storage/herbsom-site-philosophy_88b5b235.jpeg",
  ritual: "/manus-storage/herbsom-site-skin-test_08c5aab8.png",
  sunscreen: "/manus-storage/herbsom-site-sunscreen_3c736033.jpg",
  products: "/manus-storage/herbsom-site-story_9311d007.png",
  texture: "/manus-storage/herbsom-site-texture_85e0b708.webp",
} as const;

describe("HOME_IMAGES", () => {
  it("maps every rendered content image of the specified reference page", () => {
    expect(HOME_IMAGES).toEqual(expectedReferenceAssets);
  });

  it("keeps every home image on an absolute project asset path", () => {
    expect(Object.values(HOME_IMAGES).every((source) => source.startsWith("/manus-storage/"))).toBe(true);
  });
});
