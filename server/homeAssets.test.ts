import { describe, expect, it } from "vitest";
import { HOME_IMAGES } from "../client/src/lib/homeAssets";

const expectedReferenceAssets = {
  hero: "/manus-storage/052-hf_20260619_071336_d8dc704a-9533-4aa9-8ee0-58f26120ded1_2f2d57e9-717b73f2_237927c2.png",
  productSerum: "/manus-storage/043-hf_20260617_081131_6c43fbf2-5ff1-4e70-b1e5-84a04df359ae_ebeb789c-c4532b20_f6b3083b.png",
  productCream: "/manus-storage/041-hf_20260617_073341_a333548e-590d-40be-85dc-8fab622efb62_252bdac7-e4a887b4_7374fc29.png",
  productCleanser: "/manus-storage/054-hf_20260619_073327_842ecf4c-75f8-4b61-90d4-e93de49dea3c_79976953-1db499e5_5438a7a0.png",
  productPeeling: "/manus-storage/053-hf_20260619_073141_d999c29b-9237-4e52-88e0-3c2d0ddb8754_a735f047-2afca9ab_022ebc08.png",
  ingredients: "/manus-storage/050-hf_20260618_150349_e74cda09-e004-4a10-bd54-95dc0d3d61c1_bce52ddf-4d233865_3c34b529.jpeg",
  ritual: "/manus-storage/051-hf_20260618_151841_443bf9a7-7126-4b40-ae16-32ebd8d1a8c7_51243853-033d615d_f8b34b50.png",
  sunscreen: "/manus-storage/055-hf_20260619_074101_cd1a4e38-3c45-437b-9a33-069a28aa5c6b_b086c696-a5121dc9_cf403b2b.jpg",
  products: "/manus-storage/049-hf_20260618_145722_30c0e49d-6997-40c2-ab11-dfd6b32e31e8_72ed495e-b80f4ec2_c221b6bc.png",
  texture: "/manus-storage/herbsom-reference-texture_aabae8f7.webp",
} as const;

describe("HOME_IMAGES", () => {
  it("maps every rendered content image to the verified current project asset", () => {
    expect(HOME_IMAGES).toEqual(expectedReferenceAssets);
  });

  it("keeps every home image on an absolute project asset path", () => {
    expect(Object.values(HOME_IMAGES).every((source) => source.startsWith("/manus-storage/"))).toBe(true);
  });
});
