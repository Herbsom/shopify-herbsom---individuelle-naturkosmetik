import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readClientSource = (relativePath: string) =>
  fs.readFileSync(path.join(projectRoot, "client", "src", relativePath), "utf8");

const serumImagePaths = [
  "/manus-storage/006-Basisserum_554e7d2b-2df68e64_4a0ad959.webp",
  "/manus-storage/025-Weidenrindenexktrakt10ml_3504f8dd-f773fa5a_3e589372.webp",
  "/manus-storage/011-Niacinamide10ml_33886026-6ab6b8a9_4438b599.webp",
  "/manus-storage/023-VitaminCKomplex10ml_0c8eb29b-45103e9a_951b68bf.webp",
  "/manus-storage/018-Retinolkomplex10ml_f568e46a-6c0d91b1_f65b4dca.webp",
  "/manus-storage/022-Spilantholkomplex2ml_2a92a4a7-7ee9370b_bebafc42.webp",
  "/manus-storage/009-Malvenextrakt10ml_58cfd435-2c10d31f_642ebdf1.webp",
  "/manus-storage/020-Rosskastanienexktrakt10ml_40fc0471-b4ba701e_b27b2416.webp",
  "/manus-storage/002-Algenextrakt10ml_004e3f2d-710e9e81_1667a394.webp",
  "/manus-storage/007-Hyaluronkomplex10ml_fcad0b2d-cc151f90_8f8b954d.webp",
] as const;

const cremeImagePaths = [
  "/manus-storage/005-Basiscreme_3e6c66de-e4b561e1_cae0329b.webp",
  "/manus-storage/026-Weidenrindenextrakt2ml_b6097f0f-33908979_e5ddf35f.webp",
  "/manus-storage/012-Niacinamide2ml_46f08c8a-c06d7af0_8cce647d.webp",
  "/manus-storage/024-VitaminCKomplex2ml_2f8cd87d-529be79a_f65ba7c9.webp",
  "/manus-storage/019-Retinolkomplex2ml_dff84f9f-83b59f5b_ff2929a2.webp",
  "/manus-storage/022-Spilantholkomplex2ml_2a92a4a7-7ee9370b_bebafc42.webp",
  "/manus-storage/010-Malvenextrakt2ml_1aa8ab0c-4cbf49fb_3dc09546.webp",
  "/manus-storage/021-Rosskastanienextrakt2ml_1d2515bb-0e29d62e_78023a20.webp",
  "/manus-storage/078-wildrosenoel2ml_0f0e1f86-f6fb2885_da5b3023.webp",
  "/manus-storage/076-sanddornoel2ml_ec59d504-5f9b3865_b1b40390.webp",
  "/manus-storage/077-trauberkernoel2ml_5d373859-a1917112_b1d3e704.webp",
  "/manus-storage/034-disteloel2ml_87d83e0a-1b229cba_4587cecd.webp",
  "/manus-storage/003-Algenextrakt2ml_fda34039-4b00d00f_54fead5c.webp",
  "/manus-storage/008-Hyaluronkomplex2ml_7b904451-ea01a6a3_891087a9.webp",
] as const;

describe("Referenzbilder für individuelle Serum- und Creme-Produkte", () => {
  it("registriert alle verifizierten Serum- und Creme-Assets zentral", () => {
    const source = readClientSource("lib/productReferenceImages.ts");

    for (const imagePath of [...serumImagePaths, ...cremeImagePaths]) {
      expect(source).toContain(imagePath);
    }

    expect(source.match(/url: SERUM_REFERENCE_IMAGES\./g)).toHaveLength(10);
    expect(source.match(/url: CREME_REFERENCE_IMAGES\./g)).toHaveLength(14);
  });

  it("übernimmt für Spilanthol im Serum das kuratierte Referenzmotiv", () => {
    const source = readClientSource("lib/productReferenceImages.ts");

    expect(source).toContain(
      'spilanthol: "/manus-storage/018-Retinolkomplex10ml_f568e46a-6c0d91b1_f65b4dca.webp"'
    );
  });

  it("bindet die vollständigen Referenzbildreihen in beide Produktgalerien ein", () => {
    const serumSource = readClientSource("pages/ProductSerum.tsx");
    const cremeSource = readClientSource("pages/ProductCreme.tsx");

    expect(serumSource).toContain(
      'import { SERUM_PRODUCT_REFERENCE_GALLERY } from "@/lib/productReferenceImages";'
    );
    expect(serumSource).toContain("referenceImages={SERUM_PRODUCT_REFERENCE_GALLERY}");
    expect(cremeSource).toContain(
      'import { CREME_PRODUCT_REFERENCE_GALLERY } from "@/lib/productReferenceImages";'
    );
    expect(cremeSource).toContain("referenceImages={CREME_PRODUCT_REFERENCE_GALLERY}");
  });

  it("verwendet in beiden Konfiguratoren nur die zentralen Referenzzuordnungen", () => {
    const serumSource = readClientSource("pages/ConfiguratorSerum.tsx");
    const cremeSource = readClientSource("pages/ConfiguratorCreme.tsx");

    expect(serumSource).toContain("const BASE_SERUM_IMAGE = SERUM_REFERENCE_IMAGES.baseSerum;");
    expect(serumSource.match(/SERUM_REFERENCE_IMAGES\./g)).toHaveLength(10);
    expect(cremeSource).toContain("light: CREME_REFERENCE_IMAGES.baseCreme");
    expect(cremeSource).toContain("rich: CREME_REFERENCE_IMAGES.baseCreme");
    expect(cremeSource.match(/CREME_REFERENCE_IMAGES\./g)).toHaveLength(15);

    expect(`${serumSource}\n${cremeSource}`).not.toMatch(/product-(?:serum|creme)-basic/);
    expect(`${serumSource}\n${cremeSource}`).not.toMatch(/product-ingredient-(?:serum|creme)/);
  });

  it("zeigt auch in Detailmodals die kanonischen Serum- oder Creme-Referenzbilder", () => {
    const source = readClientSource("components/IngredientDetailModal.tsx");

    expect(source).toContain("const displayImage = details?.image || ingredient.image;");
    expect(source).toContain("image: SERUM_REFERENCE_IMAGES.baseSerum");
    expect(source).toContain("image: CREME_REFERENCE_IMAGES.baseCreme");
    expect(source).toContain("image: CREME_REFERENCE_IMAGES.spilanthol");
    expect(source).not.toMatch(/product-ingredient-(?:serum|creme)/);
    expect(source).not.toContain("_dd7db882.webp");
    expect(source).not.toContain("_3fa210dd.webp");
  });

  it("rendert kuratierte Referenzbilder ohne die Shopify-Ladeantwort abzuwarten", () => {
    const source = readClientSource("components/ShopifyProductGallery.tsx");

    expect(source).toContain("referenceImages?: readonly ProductGalleryImage[];");
    expect(source).toContain(
      "const images = referenceImages.length > 0 ? referenceImages : product?.images ?? [];"
    );
    expect(source).toContain("if (isLoading && !usesReferenceImages)");
  });
});
