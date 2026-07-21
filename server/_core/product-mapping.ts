/**
 * Product Mapping Configuration
 * Maps internal product IDs to Shopify variant IDs
 * 
 * This file should be updated with your actual Shopify variant IDs
 * You can find variant IDs in Shopify Admin → Products → Product Details
 */

export const PRODUCT_MAPPING: Record<string, string> = {
  // Serums
  "serum-base": "gid://shopify/ProductVariant/SERUM_BASE_ID",
  "serum-vitamin-c": "gid://shopify/ProductVariant/SERUM_VITAMIN_C_ID",
  "serum-niacinamide": "gid://shopify/ProductVariant/SERUM_NIACINAMIDE_ID",
  "serum-hyaluronic-acid": "gid://shopify/ProductVariant/SERUM_HYALURONIC_ACID_ID",
  "serum-retinol": "gid://shopify/ProductVariant/SERUM_RETINOL_ID",
  "serum-peptides": "gid://shopify/ProductVariant/SERUM_PEPTIDES_ID",
  "serum-green-tea": "gid://shopify/ProductVariant/SERUM_GREEN_TEA_ID",
  "serum-squalane": "gid://shopify/ProductVariant/SERUM_SQUALANE_ID",

  // Creams
  "cream-base-light": "gid://shopify/ProductVariant/CREAM_BASE_LIGHT_ID",
  "cream-base-rich": "gid://shopify/ProductVariant/CREAM_BASE_RICH_ID",
  "cream-ingredient-ceramides": "gid://shopify/ProductVariant/CREAM_CERAMIDES_ID",
  "cream-ingredient-hyaluronic": "gid://shopify/ProductVariant/CREAM_HYALURONIC_ID",
  "cream-ingredient-peptides": "gid://shopify/ProductVariant/CREAM_PEPTIDES_ID",
  "cream-ingredient-retinol": "gid://shopify/ProductVariant/CREAM_RETINOL_ID",
  "cream-ingredient-niacinamide": "gid://shopify/ProductVariant/CREAM_NIACINAMIDE_ID",
  "cream-ingredient-squalane": "gid://shopify/ProductVariant/CREAM_SQUALANE_ID",

  // Cleansers
  "cleanser-gel": "gid://shopify/ProductVariant/CLEANSER_GEL_ID",
  "cleanser-milk": "gid://shopify/ProductVariant/CLEANSER_MILK_ID",

  // Peelings
  "peeling-bha-azelaic": "gid://shopify/ProductVariant/PEELING_BHA_AZELAIC_ID",
  "peeling-aha-pha": "gid://shopify/ProductVariant/PEELING_AHA_PHA_ID",

  // Sunscreen
  "sunscreen-spf50": "gid://shopify/ProductVariant/SUNSCREEN_SPF50_ID",
};

/**
 * Get Shopify variant ID for a product
 * Falls back to the product ID if no mapping exists (for testing)
 */
export function getShopifyVariantId(productId: string): string {
  const variantId = PRODUCT_MAPPING[productId];
  if (!variantId) {
    console.warn(`[Product Mapping] No Shopify variant ID found for product ${productId}, using product ID as fallback`);
    return productId;
  }
  return variantId;
}

/**
 * Validate that all product IDs have Shopify mappings
 * Call this during initialization to catch missing mappings
 */
export function validateProductMappings(productIds: string[]): { valid: boolean; missing: string[] } {
  const missing = productIds.filter((id) => !PRODUCT_MAPPING[id]);
  return {
    valid: missing.length === 0,
    missing,
  };
}
