/**
 * tRPC Router for Shopify Product Management
 * Handles product synchronization and metafield updates
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  syncSerumProduct,
  syncCreamProduct,
  syncSimpleProduct,
  batchSyncProducts,
  HERBSOM_PRODUCTS,
  SerumProductConfig,
  CreamProductConfig,
  SimpleProductConfig,
} from "../_core/shopify-product-sync";
import { getProductMetafields } from "../_core/shopify-metafields";

export const shopifyProductsRouter = router({
  /**
   * Sync a single serum product to Shopify
   */
  syncSerumProduct: publicProcedure
    .input(
      z.object({
        herbsomId: z.string(),
        shopifyProductId: z.string(),
        base: z.string(),
        ingredients: z.array(z.string()),
        description: z.string(),
        price: z.number().int().positive(),
        applicableIngredients: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const config: SerumProductConfig = {
        herbsomId: input.herbsomId,
        shopifyProductId: input.shopifyProductId,
        base: input.base,
        ingredients: input.ingredients,
        description: input.description,
        price: input.price,
        applicableIngredients: input.applicableIngredients,
      };

      const result = await syncSerumProduct(config);
      return result;
    }),

  /**
   * Sync a single cream product to Shopify
   */
  syncCreamProduct: publicProcedure
    .input(
      z.object({
        herbsomId: z.string(),
        shopifyProductId: z.string(),
        base: z.string(),
        ingredients: z.array(z.string()),
        description: z.string(),
        price: z.number().int().positive(),
        applicableIngredients: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const config: CreamProductConfig = {
        herbsomId: input.herbsomId,
        shopifyProductId: input.shopifyProductId,
        base: input.base,
        ingredients: input.ingredients,
        description: input.description,
        price: input.price,
        applicableIngredients: input.applicableIngredients,
      };

      const result = await syncCreamProduct(config);
      return result;
    }),

  /**
   * Sync a simple product (cleanser, peeling, sunscreen) to Shopify
   */
  syncSimpleProduct: publicProcedure
    .input(
      z.object({
        herbsomId: z.string(),
        shopifyProductId: z.string(),
        productType: z.enum(["cleanser", "peeling", "sunscreen"]),
        description: z.string(),
        price: z.number().int().positive(),
        applicableIngredients: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const config: SimpleProductConfig = {
        herbsomId: input.herbsomId,
        shopifyProductId: input.shopifyProductId,
        productType: input.productType,
        description: input.description,
        price: input.price,
        applicableIngredients: input.applicableIngredients,
      };

      const result = await syncSimpleProduct(config);
      return result;
    }),

  /**
   * Sync all predefined Herbsom products to Shopify
   */
  syncAllProducts: publicProcedure.mutation(async () => {
    const configs = Object.values(HERBSOM_PRODUCTS);
    const result = await batchSyncProducts(configs as any[]);
    return result;
  }),

  /**
   * Get product metafields from Shopify
   */
  getProductMetafields: publicProcedure
    .input(
      z.object({
        shopifyProductId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await getProductMetafields(input.shopifyProductId);
      return result;
    }),

  /**
   * Get all predefined product configurations
   */
  getPredefinedProducts: publicProcedure.query(async () => {
    return {
      products: HERBSOM_PRODUCTS,
      count: Object.keys(HERBSOM_PRODUCTS).length,
    };
  }),
});
