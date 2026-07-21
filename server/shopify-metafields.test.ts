/**
 * Vitest Tests for Shopify Metafields Integration
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createMetafieldInputs,
  ProductMetafieldData,
  METAFIELDS,
} from "./_core/shopify-metafields";

describe("Shopify Metafields", () => {
  describe("createMetafieldInputs", () => {
    it("should create metafield inputs for a serum product", () => {
      const data: ProductMetafieldData = {
        productType: "serum",
        herbsomId: "serum-vitamin-c",
        herbsomPrice: 5900,
        herbsomDescription: "Serum with Vitamin C",
        serumBase: "serum-base",
        serumIngredients: ["vitamin-c", "hyaluronic-acid"],
        applicableIngredients: ["squalane", "green-tea"],
      };

      const inputs = createMetafieldInputs(data);

      expect(inputs).toBeDefined();
      expect(inputs.length).toBeGreaterThan(0);

      // Check for required fields
      const productTypeField = inputs.find((m) => m.key === METAFIELDS.keys.productType);
      expect(productTypeField).toBeDefined();
      expect(productTypeField?.value).toBe("serum");

      // Check for serum-specific fields
      const serumBaseField = inputs.find((m) => m.key === METAFIELDS.keys.serumBase);
      expect(serumBaseField).toBeDefined();
      expect(serumBaseField?.value).toBe("serum-base");

      // Check for ingredients
      const ingredientsField = inputs.find((m) => m.key === METAFIELDS.keys.serumIngredients);
      expect(ingredientsField).toBeDefined();
      expect(ingredientsField?.type).toBe("json");
      expect(JSON.parse(ingredientsField?.value || "[]")).toEqual(["vitamin-c", "hyaluronic-acid"]);
    });

    it("should create metafield inputs for a cream product", () => {
      const data: ProductMetafieldData = {
        productType: "cream",
        herbsomId: "cream-light",
        herbsomPrice: 3900,
        herbsomDescription: "Light cream for normal skin",
        creamBase: "cream-base-light",
        creamIngredients: ["ceramides", "hyaluronic-acid"],
      };

      const inputs = createMetafieldInputs(data);

      expect(inputs).toBeDefined();

      // Check for cream-specific fields
      const creamBaseField = inputs.find((m) => m.key === METAFIELDS.keys.creamBase);
      expect(creamBaseField).toBeDefined();
      expect(creamBaseField?.value).toBe("cream-base-light");

      // Check for ingredients
      const ingredientsField = inputs.find((m) => m.key === METAFIELDS.keys.creamIngredients);
      expect(ingredientsField).toBeDefined();
      expect(JSON.parse(ingredientsField?.value || "[]")).toEqual(["ceramides", "hyaluronic-acid"]);
    });

    it("should create metafield inputs for a simple product", () => {
      const data: ProductMetafieldData = {
        productType: "cleanser",
        herbsomId: "cleanser-gel",
        herbsomPrice: 1900,
        herbsomDescription: "Gentle gel cleanser",
      };

      const inputs = createMetafieldInputs(data);

      expect(inputs).toBeDefined();
      expect(inputs.length).toBeGreaterThan(0);

      const productTypeField = inputs.find((m) => m.key === METAFIELDS.keys.productType);
      expect(productTypeField?.value).toBe("cleanser");
    });

    it("should include applicable ingredients when provided", () => {
      const data: ProductMetafieldData = {
        productType: "serum",
        herbsomId: "serum-vitamin-c",
        herbsomPrice: 5900,
        herbsomDescription: "Serum with Vitamin C",
        serumBase: "serum-base",
        serumIngredients: ["vitamin-c"],
        applicableIngredients: ["squalane", "green-tea", "peptides"],
      };

      const inputs = createMetafieldInputs(data);

      const applicableField = inputs.find(
        (m) => m.key === METAFIELDS.keys.applicableIngredients
      );
      expect(applicableField).toBeDefined();
      expect(applicableField?.type).toBe("json");
      expect(JSON.parse(applicableField?.value || "[]")).toEqual([
        "squalane",
        "green-tea",
        "peptides",
      ]);
    });

    it("should not include empty ingredient arrays", () => {
      const data: ProductMetafieldData = {
        productType: "serum",
        herbsomId: "serum-base",
        herbsomPrice: 4900,
        herbsomDescription: "Base serum",
        serumBase: "serum-base",
        serumIngredients: [],
      };

      const inputs = createMetafieldInputs(data);

      const ingredientsField = inputs.find((m) => m.key === METAFIELDS.keys.serumIngredients);
      expect(ingredientsField).toBeUndefined();
    });

    it("should set correct metafield types", () => {
      const data: ProductMetafieldData = {
        productType: "peeling",
        herbsomId: "peeling-aha",
        herbsomPrice: 2900,
        herbsomDescription: "AHA Peeling",
      };

      const inputs = createMetafieldInputs(data);

      const priceField = inputs.find((m) => m.key === METAFIELDS.keys.herbsomPrice);
      expect(priceField?.type).toBe("number_integer");

      const descriptionField = inputs.find((m) => m.key === METAFIELDS.keys.herbsomDescription);
      expect(descriptionField?.type).toBe("multi_line_text");

      const productTypeField = inputs.find((m) => m.key === METAFIELDS.keys.productType);
      expect(productTypeField?.type).toBe("single_line_text");
    });
  });

  describe("Metafields namespace and keys", () => {
    it("should have correct namespace", () => {
      expect(METAFIELDS.namespace).toBe("herbsom");
    });

    it("should have all required keys", () => {
      expect(METAFIELDS.keys.productType).toBeDefined();
      expect(METAFIELDS.keys.herbsomId).toBeDefined();
      expect(METAFIELDS.keys.herbsomPrice).toBeDefined();
      expect(METAFIELDS.keys.herbsomDescription).toBeDefined();
      expect(METAFIELDS.keys.serumBase).toBeDefined();
      expect(METAFIELDS.keys.serumIngredients).toBeDefined();
      expect(METAFIELDS.keys.creamBase).toBeDefined();
      expect(METAFIELDS.keys.creamIngredients).toBeDefined();
      expect(METAFIELDS.keys.applicableIngredients).toBeDefined();
    });
  });
});
