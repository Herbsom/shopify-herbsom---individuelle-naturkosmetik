import { describe, expect, it } from "vitest";
import { HOME_IMAGES } from "../client/src/lib/homeAssets";

const expectedReferenceAssets = {
  hero: "/manus-storage/045-hf_20260617_105132_16844215-27d0-45b5-85fd-899e821985e0_ae142792-1a250dc0_4aa7e8a9.png",
  productSerum: "/manus-storage/006-Basisserum_554e7d2b-2df68e64_4a0ad959.webp",
  productCream: "/manus-storage/005-Basiscreme_3e6c66de-e4b561e1_cae0329b.webp",
  productCleanser: "/manus-storage/013-Reinigungsgel_1x1_db035e0b-fa696024_e5708ee7.webp",
  productPeeling: "/manus-storage/001-AHA-PHAPeeling_1x1_c777c7c7-acdf8796_ee21ec00.webp",
  ingredients: "/manus-storage/064-pasted_file_Uwbp89_IMG_6177_9f3c4d13-9e69e26e_9f0cfa2d.jpg",
  ritual: "/manus-storage/041-hf_20260617_073341_a333548e-590d-40be-85dc-8fab622efb62_252bdac7-e4a887b4_7374fc29.png",
  sunscreen: "/manus-storage/037-hf_20260616_214302_5233e72b-a663-4b93-a6d9-685e4cbb5b18_94230957-b33f8d66_45729ddd.png",
  products: "/manus-storage/036-hf_20260616_214129_1222f463-787a-4d2f-b0ae-e43ad47d1b11_ff3763c6-2d260b02_8e779bd6.png",
  texture: "/manus-storage/042-hf_20260617_081131_6c43fbf2-5ff1-4e70-b1e5-84a04df359ae_99d10a88-f852a3da_8cb305f8.png",
} as const;

describe("HOME_IMAGES", () => {
  it("maps every rendered content image to the verified current project asset", () => {
    expect(HOME_IMAGES).toEqual(expectedReferenceAssets);
  });

  it("keeps every home image on an absolute project asset path", () => {
    expect(Object.values(HOME_IMAGES).every((source) => source.startsWith("/manus-storage/"))).toBe(true);
  });
});
