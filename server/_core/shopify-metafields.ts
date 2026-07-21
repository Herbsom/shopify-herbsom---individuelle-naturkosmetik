/**
 * Shopify Metafields Integration
 * Manages product metafields for Herbsom products
 * Syncs ingredients, base products, descriptions, and pricing
 */

import { ENV } from "./env";

const SHOPIFY_ADMIN_API_URL = `https://${ENV.shopifyStoreDomain}/admin/api/2024-01/graphql.json`;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || "";

/**
 * Metafields namespace and keys for Herbsom products
 */
export const METAFIELDS = {
  namespace: "herbsom",
  keys: {
    // Serum metafields
    serumBase: "serum_base",
    serumIngredients: "serum_ingredients", // JSON array of ingredient IDs
    serumDescription: "serum_description",

    // Cream metafields
    creamBase: "cream_base",
    creamIngredients: "cream_ingredients", // JSON array of ingredient IDs
    creamDescription: "cream_description",

    // General metafields
    productType: "product_type", // serum, cream, cleanser, peeling, sunscreen
    herbsomId: "herbsom_id", // Internal Herbsom product ID
    herbsomPrice: "herbsom_price", // Price in cents
    herbsomDescription: "herbsom_description",
    applicableIngredients: "applicable_ingredients", // JSON array of applicable ingredient IDs
  },
};

/**
 * Metafield input type for GraphQL
 */
export interface MetafieldInput {
  namespace: string;
  key: string;
  value: string;
  type: "single_line_text" | "multi_line_text" | "json" | "number_integer";
}

/**
 * Product metafield data structure
 */
export interface ProductMetafieldData {
  productType: "serum" | "cream" | "cleanser" | "peeling" | "sunscreen";
  herbsomId: string;
  herbsomPrice: number; // in cents
  herbsomDescription: string;
  serumBase?: string;
  serumIngredients?: string[]; // Array of ingredient IDs
  creamBase?: string;
  creamIngredients?: string[]; // Array of ingredient IDs
  applicableIngredients?: string[]; // Ingredients this product can be combined with
}

/**
 * Create metafield inputs for a product
 */
export function createMetafieldInputs(data: ProductMetafieldData): MetafieldInput[] {
  const inputs: MetafieldInput[] = [
    {
      namespace: METAFIELDS.namespace,
      key: METAFIELDS.keys.productType,
      value: data.productType,
      type: "single_line_text",
    },
    {
      namespace: METAFIELDS.namespace,
      key: METAFIELDS.keys.herbsomId,
      value: data.herbsomId,
      type: "single_line_text",
    },
    {
      namespace: METAFIELDS.namespace,
      key: METAFIELDS.keys.herbsomPrice,
      value: data.herbsomPrice.toString(),
      type: "number_integer",
    },
    {
      namespace: METAFIELDS.namespace,
      key: METAFIELDS.keys.herbsomDescription,
      value: data.herbsomDescription,
      type: "multi_line_text",
    },
  ];

  // Add serum-specific metafields
  if (data.productType === "serum") {
    if (data.serumBase) {
      inputs.push({
        namespace: METAFIELDS.namespace,
        key: METAFIELDS.keys.serumBase,
        value: data.serumBase,
        type: "single_line_text",
      });
    }
    if (data.serumIngredients && data.serumIngredients.length > 0) {
      inputs.push({
        namespace: METAFIELDS.namespace,
        key: METAFIELDS.keys.serumIngredients,
        value: JSON.stringify(data.serumIngredients),
        type: "json",
      });
    }
  }

  // Add cream-specific metafields
  if (data.productType === "cream") {
    if (data.creamBase) {
      inputs.push({
        namespace: METAFIELDS.namespace,
        key: METAFIELDS.keys.creamBase,
        value: data.creamBase,
        type: "single_line_text",
      });
    }
    if (data.creamIngredients && data.creamIngredients.length > 0) {
      inputs.push({
        namespace: METAFIELDS.namespace,
        key: METAFIELDS.keys.creamIngredients,
        value: JSON.stringify(data.creamIngredients),
        type: "json",
      });
    }
  }

  // Add applicable ingredients
  if (data.applicableIngredients && data.applicableIngredients.length > 0) {
    inputs.push({
      namespace: METAFIELDS.namespace,
      key: METAFIELDS.keys.applicableIngredients,
      value: JSON.stringify(data.applicableIngredients),
      type: "json",
    });
  }

  return inputs;
}

/**
 * Update product metafields in Shopify
 */
export async function updateProductMetafields(
  shopifyProductId: string,
  metafieldInputs: MetafieldInput[]
): Promise<{ success: boolean; error?: string }> {
  if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return { success: false, error: "Shopify Admin API token not configured" };
  }

  try {
    // Build mutation for updating metafields
    const mutation = `
      mutation UpdateProductMetafields($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            metafields(first: 10) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: shopifyProductId,
        metafields: metafieldInputs,
      },
    };

    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();

    if (result.errors) {
      return { success: false, error: result.errors[0]?.message || "GraphQL error" };
    }

    if (result.data?.productUpdate?.userErrors?.length > 0) {
      return {
        success: false,
        error: result.data.productUpdate.userErrors[0]?.message || "Update failed",
      };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Fetch product metafields from Shopify
 */
export async function getProductMetafields(
  shopifyProductId: string
): Promise<{ success: boolean; metafields?: Record<string, string>; error?: string }> {
  if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return { success: false, error: "Shopify Admin API token not configured" };
  }

  try {
    const query = `
      query GetProductMetafields($id: ID!) {
        product(id: $id) {
          id
          metafields(first: 20, namespace: "${METAFIELDS.namespace}") {
            edges {
              node {
                namespace
                key
                value
              }
            }
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables: { id: shopifyProductId } }),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();

    if (result.errors) {
      return { success: false, error: result.errors[0]?.message || "GraphQL error" };
    }

    const metafields: Record<string, string> = {};
    result.data?.product?.metafields?.edges?.forEach(
      (edge: { node: { key: string; value: string } }) => {
        metafields[edge.node.key] = edge.node.value;
      }
    );

    return { success: true, metafields };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Sync Herbsom product data to Shopify metafields
 */
export async function syncProductToShopify(
  shopifyProductId: string,
  productData: ProductMetafieldData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Create metafield inputs
    const metafieldInputs = createMetafieldInputs(productData);

    // Update product metafields
    const result = await updateProductMetafields(shopifyProductId, metafieldInputs);

    if (!result.success) {
      console.error(`[Shopify Sync] Failed to sync product ${productData.herbsomId}:`, result.error);
      return result;
    }

    console.log(`[Shopify Sync] Successfully synced product ${productData.herbsomId} to Shopify`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Shopify Sync] Error syncing product:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}
