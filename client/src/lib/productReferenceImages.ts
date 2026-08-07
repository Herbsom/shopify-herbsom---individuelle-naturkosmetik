export type ReferenceProductImage = {
  url: string;
  altText: string;
};

/**
 * Verifizierte Produktbilder aus der Herbsom-Referenzseite.
 * Alle Werte sind langlebige Projekt-Web-Assets und werden von Produktseiten,
 * Konfiguratoren sowie Detailmodals gemeinsam verwendet.
 */
export const SERUM_REFERENCE_IMAGES = {
  baseSerum: "/manus-storage/006-Basisserum_554e7d2b-2df68e64_4a0ad959.webp",
  willow: "/manus-storage/025-Weidenrindenexktrakt10ml_3504f8dd-f773fa5a_3e589372.webp",
  niacinamide: "/manus-storage/011-Niacinamide10ml_33886026-6ab6b8a9_4438b599.webp",
  vitaminc: "/manus-storage/023-VitaminCKomplex10ml_0c8eb29b-45103e9a_951b68bf.webp",
  retinol: "/manus-storage/018-Retinolkomplex10ml_f568e46a-6c0d91b1_f65b4dca.webp",
  // Das Serum-Referenzprojekt verwendet dieses kuratierte Motiv für Spilanthol.
  spilanthol: "/manus-storage/018-Retinolkomplex10ml_f568e46a-6c0d91b1_f65b4dca.webp",
  mallow: "/manus-storage/009-Malvenextrakt10ml_58cfd435-2c10d31f_642ebdf1.webp",
  horsechestnut: "/manus-storage/020-Rosskastanienexktrakt10ml_40fc0471-b4ba701e_b27b2416.webp",
  algae: "/manus-storage/002-Algenextrakt10ml_004e3f2d-710e9e81_1667a394.webp",
  hyaluronic: "/manus-storage/007-Hyaluronkomplex10ml_fcad0b2d-cc151f90_8f8b954d.webp",
} as const;

export const CREME_REFERENCE_IMAGES = {
  baseCreme: "/manus-storage/005-Basiscreme_3e6c66de-e4b561e1_cae0329b.webp",
  willow: "/manus-storage/026-Weidenrindenextrakt2ml_b6097f0f-33908979_e5ddf35f.webp",
  niacinamide: "/manus-storage/012-Niacinamide2ml_46f08c8a-c06d7af0_8cce647d.webp",
  vitaminc: "/manus-storage/024-VitaminCKomplex2ml_2f8cd87d-529be79a_f65ba7c9.webp",
  retinol: "/manus-storage/019-Retinolkomplex2ml_dff84f9f-83b59f5b_ff2929a2.webp",
  spilanthol: "/manus-storage/022-Spilantholkomplex2ml_2a92a4a7-7ee9370b_bebafc42.webp",
  mallow: "/manus-storage/010-Malvenextrakt2ml_1aa8ab0c-4cbf49fb_3dc09546.webp",
  horsechestnut: "/manus-storage/021-Rosskastanienextrakt2ml_1d2515bb-0e29d62e_78023a20.webp",
  rosehip: "/manus-storage/078-wildrosenoel2ml_0f0e1f86-f6fb2885_da5b3023.webp",
  seabuckthorn: "/manus-storage/076-sanddornoel2ml_ec59d504-5f9b3865_b1b40390.webp",
  grapeseed: "/manus-storage/077-trauberkernoel2ml_5d373859-a1917112_b1d3e704.webp",
  thistle: "/manus-storage/034-disteloel2ml_87d83e0a-1b229cba_4587cecd.webp",
  algae: "/manus-storage/003-Algenextrakt2ml_fda34039-4b00d00f_54fead5c.webp",
  hyaluronic: "/manus-storage/008-Hyaluronkomplex2ml_7b904451-ea01a6a3_891087a9.webp",
} as const;

export const SERUM_PRODUCT_REFERENCE_GALLERY: readonly ReferenceProductImage[] = [
  { url: SERUM_REFERENCE_IMAGES.baseSerum, altText: "Basisserum für individuelle Formulierung" },
  { url: SERUM_REFERENCE_IMAGES.willow, altText: "Weidenrindenextrakt für das individuelle Serum" },
  { url: SERUM_REFERENCE_IMAGES.niacinamide, altText: "Niacinamide-Komplex für das individuelle Serum" },
  { url: SERUM_REFERENCE_IMAGES.vitaminc, altText: "Vitamin-C-Komplex für das individuelle Serum" },
  { url: SERUM_REFERENCE_IMAGES.retinol, altText: "Retinolkomplex für das individuelle Serum" },
  { url: SERUM_REFERENCE_IMAGES.spilanthol, altText: "Spilantholkomplex für das individuelle Serum" },
  { url: SERUM_REFERENCE_IMAGES.mallow, altText: "Malvenextrakt für das individuelle Serum" },
  { url: SERUM_REFERENCE_IMAGES.horsechestnut, altText: "Rosskastanienextrakt für das individuelle Serum" },
  { url: SERUM_REFERENCE_IMAGES.algae, altText: "Algenextrakt für das individuelle Serum" },
  { url: SERUM_REFERENCE_IMAGES.hyaluronic, altText: "Hyaluronkomplex für das individuelle Serum" },
];

export const CREME_PRODUCT_REFERENCE_GALLERY: readonly ReferenceProductImage[] = [
  { url: CREME_REFERENCE_IMAGES.baseCreme, altText: "Basiscreme für individuelle Formulierung" },
  { url: CREME_REFERENCE_IMAGES.willow, altText: "Weidenrindenextrakt für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.niacinamide, altText: "Niacinamide-Komplex für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.vitaminc, altText: "Vitamin-C-Komplex für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.retinol, altText: "Retinolkomplex für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.spilanthol, altText: "Spilantholkomplex für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.mallow, altText: "Malvenextrakt für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.horsechestnut, altText: "Rosskastanienextrakt für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.rosehip, altText: "Wildrosenöl für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.seabuckthorn, altText: "Sanddornöl für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.grapeseed, altText: "Traubenkernöl für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.thistle, altText: "Distelöl für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.algae, altText: "Algenextrakt für die individuelle Creme" },
  { url: CREME_REFERENCE_IMAGES.hyaluronic, altText: "Hyaluronkomplex für die individuelle Creme" },
];
