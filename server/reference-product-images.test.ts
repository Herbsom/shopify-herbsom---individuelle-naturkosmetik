import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readClientSource = (relativePath: string) =>
  fs.readFileSync(path.join(projectRoot, "client", "src", relativePath), "utf8");

describe("Referenzbilder für individuelle Produkte", () => {
  it("bindet das Serum-Hauptmotiv der Referenzseite in die Produktgalerie ein", () => {
    const source = readClientSource("pages/ProductSerum.tsx");

    expect(source).toContain('import { HOME_IMAGES } from "@/lib/homeAssets";');
    expect(source).toContain("url: HOME_IMAGES.productSerum");
    expect(source).toContain('altText: "Individuelles Herbsom Serum"');
  });

  it("bindet das Creme-Hauptmotiv der Referenzseite in die Produktgalerie ein", () => {
    const source = readClientSource("pages/ProductCreme.tsx");

    expect(source).toContain('import { HOME_IMAGES } from "@/lib/homeAssets";');
    expect(source).toContain("url: HOME_IMAGES.productCream");
    expect(source).toContain('altText: "Individuelle Herbsom Gesichtscreme"');
  });

  it("rendert kuratierte Referenzbilder ohne die Shopify-Ladeantwort abzuwarten", () => {
    const source = readClientSource("components/ShopifyProductGallery.tsx");

    expect(source).toContain("referenceImages?: readonly ProductGalleryImage[];");
    expect(source).toContain("const images = referenceImages.length > 0 ? referenceImages : product?.images ?? [];");
    expect(source).toContain("if (isLoading && !usesReferenceImages)");
  });
});
