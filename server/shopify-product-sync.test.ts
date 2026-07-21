/**
 * Vitest Tests for Shopify Product Synchronization
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  syncSerumProduct,
  syncCreamProduct,
  syncSimpleProduct,
  batchSyncProducts,
  SerumProductConfig,
  CreamProductConfig,
  SimpleProductConfig,
} from "./_core/shopify-product-sync";
import * as metafields from "./_core/shopify-metafields";

// Mock the metafields module
vi.mock("./_core/shopify-metafields", () => ({
  syncProductToShopify: vi.fn(),
  createMetafieldInputs: vi.fn(),
  updateProductMetafields: vi.fn(),
  getProductMetafields: vi.fn(),
  METAFIELDS: {
    namespace: "herbsom",
    keys: {
      productType: "product_type",
      herbsomId: "herbsom_id",
      herbsomPrice: "herbsom_price",
      herbsomDescription: "herbsom_description",
      serumBase: "serum_base",
      serumIngredients: "serum_ingredients",
      creamBase: "cream_base",
      creamIngredients: "cream_ingredients",
      applicableIngredients: "applicable_ingredients",
    },
  },
}));

describe("Shopify Product Synchronization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("syncSerumProduct", () => {
    it("should sync a serum product successfully", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify.mockResolvedValue({ success: true });

      const config: SerumProductConfig = {
        herbsomId: "serum-vitamin-c",
        shopifyProductId: "gid://shopify/Product/123",
        base: "serum-base",
        ingredients: ["vitamin-c", "hyaluronic-acid"],
        description: "Serum with Vitamin C",
        price: 5900,
      };

      const result = await syncSerumProduct(config);

      expect(result.success).toBe(true);
      expect(mockSyncProductToShopify).toHaveBeenCalledWith(
        config.shopifyProductId,
        expect.objectContaining({
          productType: "serum",
          herbsomId: "serum-vitamin-c",
          herbsomPrice: 5900,
          serumBase: "serum-base",
          serumIngredients: ["vitamin-c", "hyaluronic-acid"],
        })
      );
    });

    it("should handle sync errors", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify.mockResolvedValue({
        success: false,
        error: "API error",
      });

      const config: SerumProductConfig = {
        herbsomId: "serum-vitamin-c",
        shopifyProductId: "gid://shopify/Product/123",
        base: "serum-base",
        ingredients: ["vitamin-c"],
        description: "Serum with Vitamin C",
        price: 5900,
      };

      const result = await syncSerumProduct(config);

      expect(result.success).toBe(false);
      expect(result.error).toBe("API error");
    });

    it("should include applicable ingredients when provided", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify.mockResolvedValue({ success: true });

      const config: SerumProductConfig = {
        herbsomId: "serum-vitamin-c",
        shopifyProductId: "gid://shopify/Product/123",
        base: "serum-base",
        ingredients: ["vitamin-c"],
        description: "Serum with Vitamin C",
        price: 5900,
        applicableIngredients: ["squalane", "green-tea"],
      };

      await syncSerumProduct(config);

      expect(mockSyncProductToShopify).toHaveBeenCalledWith(
        config.shopifyProductId,
        expect.objectContaining({
          applicableIngredients: ["squalane", "green-tea"],
        })
      );
    });
  });

  describe("syncCreamProduct", () => {
    it("should sync a cream product successfully", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify.mockResolvedValue({ success: true });

      const config: CreamProductConfig = {
        herbsomId: "cream-light",
        shopifyProductId: "gid://shopify/Product/456",
        base: "cream-base-light",
        ingredients: ["ceramides", "hyaluronic-acid"],
        description: "Light cream for normal skin",
        price: 3900,
      };

      const result = await syncCreamProduct(config);

      expect(result.success).toBe(true);
      expect(mockSyncProductToShopify).toHaveBeenCalledWith(
        config.shopifyProductId,
        expect.objectContaining({
          productType: "cream",
          herbsomId: "cream-light",
          creamBase: "cream-base-light",
          creamIngredients: ["ceramides", "hyaluronic-acid"],
        })
      );
    });
  });

  describe("syncSimpleProduct", () => {
    it("should sync a cleanser product successfully", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify.mockResolvedValue({ success: true });

      const config: SimpleProductConfig = {
        herbsomId: "cleanser-gel",
        shopifyProductId: "gid://shopify/Product/789",
        productType: "cleanser",
        description: "Gentle gel cleanser",
        price: 1900,
      };

      const result = await syncSimpleProduct(config);

      expect(result.success).toBe(true);
      expect(mockSyncProductToShopify).toHaveBeenCalledWith(
        config.shopifyProductId,
        expect.objectContaining({
          productType: "cleanser",
          herbsomId: "cleanser-gel",
          herbsomPrice: 1900,
        })
      );
    });

    it("should sync a peeling product successfully", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify.mockResolvedValue({ success: true });

      const config: SimpleProductConfig = {
        herbsomId: "peeling-aha",
        shopifyProductId: "gid://shopify/Product/101",
        productType: "peeling",
        description: "AHA Peeling",
        price: 2900,
      };

      const result = await syncSimpleProduct(config);

      expect(result.success).toBe(true);
      expect(mockSyncProductToShopify).toHaveBeenCalledWith(
        config.shopifyProductId,
        expect.objectContaining({
          productType: "peeling",
        })
      );
    });

    it("should sync a sunscreen product successfully", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify.mockResolvedValue({ success: true });

      const config: SimpleProductConfig = {
        herbsomId: "sunscreen-spf50",
        shopifyProductId: "gid://shopify/Product/102",
        productType: "sunscreen",
        description: "SPF 50+ Sunscreen",
        price: 2900,
      };

      const result = await syncSimpleProduct(config);

      expect(result.success).toBe(true);
      expect(mockSyncProductToShopify).toHaveBeenCalledWith(
        config.shopifyProductId,
        expect.objectContaining({
          productType: "sunscreen",
        })
      );
    });
  });

  describe("batchSyncProducts", () => {
    it("should sync multiple products and report results", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "API error" });

      const configs: SimpleProductConfig[] = [
        {
          herbsomId: "cleanser-gel",
          shopifyProductId: "gid://shopify/Product/1",
          productType: "cleanser",
          description: "Gel cleanser",
          price: 1900,
        },
        {
          herbsomId: "peeling-aha",
          shopifyProductId: "gid://shopify/Product/2",
          productType: "peeling",
          description: "AHA Peeling",
          price: 2900,
        },
        {
          herbsomId: "sunscreen-spf50",
          shopifyProductId: "gid://shopify/Product/3",
          productType: "sunscreen",
          description: "SPF 50+",
          price: 2900,
        },
      ];

      const result = await batchSyncProducts(configs);

      expect(result.successful).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        herbsomId: "sunscreen-spf50",
        error: "API error",
      });
    });

    it("should handle empty product list", async () => {
      const result = await batchSyncProducts([]);

      expect(result.successful).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it("should report all successes", async () => {
      const mockSyncProductToShopify = vi.mocked(metafields.syncProductToShopify);
      mockSyncProductToShopify.mockResolvedValue({ success: true });

      const configs: SimpleProductConfig[] = [
        {
          herbsomId: "cleanser-gel",
          shopifyProductId: "gid://shopify/Product/1",
          productType: "cleanser",
          description: "Gel cleanser",
          price: 1900,
        },
        {
          herbsomId: "peeling-aha",
          shopifyProductId: "gid://shopify/Product/2",
          productType: "peeling",
          description: "AHA Peeling",
          price: 2900,
        },
      ];

      const result = await batchSyncProducts(configs);

      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
  });
});
