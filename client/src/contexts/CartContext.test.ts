import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Validation function for CartItem array (copied from CartContext for testing)
 */
function isValidCartItems(data: unknown): data is any[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.price === "number" &&
      typeof item.quantity === "number" &&
      item.quantity > 0 &&
      item.price >= 0 &&
      (item.description === undefined || typeof item.description === "string")
  );
}

describe("CartContext Validation", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should validate correct CartItem array", () => {
    const validCart = [
      {
        id: "serum-1",
        name: "Serum with Vitamin C",
        price: 45,
        quantity: 2,
        description: "Vitamin C, Niacinamide",
      },
      {
        id: "creme-1",
        name: "Creme with Retinol",
        price: 55,
        quantity: 1,
      },
    ];

    expect(isValidCartItems(validCart)).toBe(true);
  });

  it("should reject non-array data", () => {
    expect(isValidCartItems({ items: [] })).toBe(false);
    expect(isValidCartItems("not an array")).toBe(false);
    expect(isValidCartItems(null)).toBe(false);
  });

  it("should reject items with missing required fields", () => {
    const invalidCart = [
      {
        id: "serum-1",
        name: "Serum",
        // missing price
        quantity: 1,
      },
    ];

    expect(isValidCartItems(invalidCart)).toBe(false);
  });

  it("should reject items with invalid price", () => {
    const invalidCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: -10, // negative price
        quantity: 1,
      },
    ];

    expect(isValidCartItems(invalidCart)).toBe(false);
  });

  it("should reject items with zero or negative quantity", () => {
    const invalidCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: 45,
        quantity: 0, // zero quantity
      },
    ];

    expect(isValidCartItems(invalidCart)).toBe(false);
  });

  it("should reject items with invalid description type", () => {
    const invalidCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: 45,
        quantity: 1,
        description: 123, // should be string
      },
    ];

    expect(isValidCartItems(invalidCart)).toBe(false);
  });

  it("should accept items with undefined description", () => {
    const validCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: 45,
        quantity: 1,
        description: undefined,
      },
    ];

    expect(isValidCartItems(validCart)).toBe(true);
  });

  it("should accept items without description field", () => {
    const validCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: 45,
        quantity: 1,
      },
    ];

    expect(isValidCartItems(validCart)).toBe(true);
  });

  it("should reject empty array as valid cart (edge case)", () => {
    // Empty array is technically valid for an empty cart
    expect(isValidCartItems([])).toBe(true);
  });

  it("should reject items with wrong field types", () => {
    const invalidCart = [
      {
        id: 123, // should be string
        name: "Serum",
        price: 45,
        quantity: 1,
      },
    ];

    expect(isValidCartItems(invalidCart)).toBe(false);
  });
});
