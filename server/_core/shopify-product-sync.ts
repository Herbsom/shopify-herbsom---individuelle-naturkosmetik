/**
 * Shopify Product Synchronization
 * Syncs Herbsom product configurations to Shopify
 */

import {
  syncProductToShopify,
  ProductMetafieldData,
  METAFIELDS,
} from "./shopify-metafields";
import { getShopifyVariantId } from "./product-mapping";

/**
 * Serum product configuration
 */
export interface SerumProductConfig {
  herbsomId: string;
  shopifyProductId: string;
  base: string; // Base serum ID
  ingredients: string[]; // Array of ingredient IDs
  description: string;
  price: number; // in cents
  applicableIngredients?: string[];
}

/**
 * Cream product configuration
 */
export interface CreamProductConfig {
  herbsomId: string;
  shopifyProductId: string;
  base: string; // Base cream ID (light or rich)
  ingredients: string[]; // Array of ingredient IDs
  description: string;
  price: number; // in cents
  applicableIngredients?: string[];
}

/**
 * Simple product configuration (cleanser, peeling, sunscreen)
 */
export interface SimpleProductConfig {
  herbsomId: string;
  shopifyProductId: string;
  productType: "cleanser" | "peeling" | "sunscreen";
  description: string;
  price: number; // in cents
  applicableIngredients?: string[];
}

/**
 * Sync serum product to Shopify
 */
export async function syncSerumProduct(
  config: SerumProductConfig
): Promise<{ success: boolean; error?: string }> {
  const metafieldData: ProductMetafieldData = {
    productType: "serum",
    herbsomId: config.herbsomId,
    herbsomPrice: config.price,
    herbsomDescription: config.description,
    serumBase: config.base,
    serumIngredients: config.ingredients,
    applicableIngredients: config.applicableIngredients,
  };

  return syncProductToShopify(config.shopifyProductId, metafieldData);
}

/**
 * Sync cream product to Shopify
 */
export async function syncCreamProduct(
  config: CreamProductConfig
): Promise<{ success: boolean; error?: string }> {
  const metafieldData: ProductMetafieldData = {
    productType: "cream",
    herbsomId: config.herbsomId,
    herbsomPrice: config.price,
    herbsomDescription: config.description,
    creamBase: config.base,
    creamIngredients: config.ingredients,
    applicableIngredients: config.applicableIngredients,
  };

  return syncProductToShopify(config.shopifyProductId, metafieldData);
}

/**
 * Sync simple product (cleanser, peeling, sunscreen) to Shopify
 */
export async function syncSimpleProduct(
  config: SimpleProductConfig
): Promise<{ success: boolean; error?: string }> {
  const metafieldData: ProductMetafieldData = {
    productType: config.productType,
    herbsomId: config.herbsomId,
    herbsomPrice: config.price,
    herbsomDescription: config.description,
    applicableIngredients: config.applicableIngredients,
  };

  return syncProductToShopify(config.shopifyProductId, metafieldData);
}

/**
 * Batch sync multiple products
 */
export async function batchSyncProducts(
  configs: (SerumProductConfig | CreamProductConfig | SimpleProductConfig)[]
): Promise<{
  successful: number;
  failed: number;
  errors: Array<{ herbsomId: string; error: string }>;
}> {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ herbsomId: string; error: string }>,
  };

  for (const config of configs) {
    let syncResult;

    if ("base" in config && "ingredients" in config) {
      // Serum or Cream
      if ("serumBase" in config || config.herbsomId.includes("serum")) {
        syncResult = await syncSerumProduct(config as SerumProductConfig);
      } else {
        syncResult = await syncCreamProduct(config as CreamProductConfig);
      }
    } else {
      // Simple product
      syncResult = await syncSimpleProduct(config as SimpleProductConfig);
    }

    if (syncResult.success) {
      results.successful++;
    } else {
      results.failed++;
      results.errors.push({
        herbsomId: config.herbsomId,
        error: syncResult.error || "Unknown error",
      });
    }

    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Predefined Herbsom product configurations
 * Update these with actual Shopify product IDs and pricing
 */
export const HERBSOM_PRODUCTS = {
  // Serums
  serumBase: {
    herbsomId: "serum-base",
    shopifyProductId: "gid://shopify/Product/SERUM_BASE_PRODUCT_ID",
    base: "serum-base",
    ingredients: [],
    description: "Hochkonzentriertes Basisserum mit stabilisierendem Komplex",
    price: 4900, // €49.00
  },

  serumVitaminC: {
    herbsomId: "serum-vitamin-c",
    shopifyProductId: "gid://shopify/Product/SERUM_VITAMIN_C_PRODUCT_ID",
    base: "serum-base",
    ingredients: ["vitamin-c"],
    description: "Serum mit stabilisiertem Vitamin C für Helligkeit und Schutz",
    price: 5900, // €59.00
    applicableIngredients: ["hyaluronic-acid", "squalane", "green-tea"],
  },

  serumNiacinamide: {
    herbsomId: "serum-niacinamide",
    shopifyProductId: "gid://shopify/Product/SERUM_NIACINAMIDE_PRODUCT_ID",
    base: "serum-base",
    ingredients: ["niacinamide"],
    description: "Serum mit Niacinamide zur Porenminderung und Sebumkontrolle",
    price: 5900, // €59.00
    applicableIngredients: ["hyaluronic-acid", "squalane"],
  },

  // Creams
  creamBaseLight: {
    herbsomId: "cream-base-light",
    shopifyProductId: "gid://shopify/Product/CREAM_BASE_LIGHT_PRODUCT_ID",
    base: "cream-base-light",
    ingredients: [],
    description: "Leichte Basiscreme für normale bis fettige Haut",
    price: 3900, // €39.00
  },

  creamBaseRich: {
    herbsomId: "cream-base-rich",
    shopifyProductId: "gid://shopify/Product/CREAM_BASE_RICH_PRODUCT_ID",
    base: "cream-base-rich",
    ingredients: [],
    description: "Reichhaltige Basiscreme für trockene Haut",
    price: 3900, // €39.00
  },

  // Cleansers
  cleanserGel: {
    herbsomId: "cleanser-gel",
    shopifyProductId: "gid://shopify/Product/CLEANSER_GEL_PRODUCT_ID",
    productType: "cleanser" as const,
    description: "Sanftes Gel-Reinigungsmittel für alle Hauttypen",
    price: 1900, // €19.00
  },

  cleanserMilk: {
    herbsomId: "cleanser-milk",
    shopifyProductId: "gid://shopify/Product/CLEANSER_MILK_PRODUCT_ID",
    productType: "cleanser" as const,
    description: "Nährendes Reinigungsmilch für trockene Haut",
    price: 1900, // €19.00
  },

  // Peelings
  peelingAhaPha: {
    herbsomId: "peeling-aha-pha",
    shopifyProductId: "gid://shopify/Product/PEELING_AHA_PHA_PRODUCT_ID",
    productType: "peeling" as const,
    description: "Sanftes AHA/PHA-Peeling für Zellerneuerung",
    price: 2900, // €29.00
  },

  peelingBhaAzelaic: {
    herbsomId: "peeling-bha-azelaic",
    shopifyProductId: "gid://shopify/Product/PEELING_BHA_AZELAIC_PRODUCT_ID",
    productType: "peeling" as const,
    description: "BHA/Azelainsäure-Peeling für unreine Haut",
    price: 2900, // €29.00
  },

  // Sunscreen
  sunscreenSpf50: {
    herbsomId: "sunscreen-spf50",
    shopifyProductId: "gid://shopify/Product/SUNSCREEN_SPF50_PRODUCT_ID",
    productType: "sunscreen" as const,
    description: "Leichtes Sonnenschutzfluid SPF 50+ mit Blaulichschutz",
    price: 2900, // €29.00
  },
};
