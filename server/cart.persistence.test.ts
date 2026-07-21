import { describe, it, expect } from "vitest";

/**
 * Validation function for CartItem array
 * This mirrors the client-side validation logic
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

describe("Cart Persistence Validation", () => {
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

  it("should validate empty cart", () => {
    expect(isValidCartItems([])).toBe(true);
  });

  it("should reject non-array data", () => {
    expect(isValidCartItems({ items: [] })).toBe(false);
    expect(isValidCartItems("not an array")).toBe(false);
    expect(isValidCartItems(null)).toBe(false);
    expect(isValidCartItems(undefined)).toBe(false);
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

  it("should reject items with invalid price (negative)", () => {
    const invalidCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: -10,
        quantity: 1,
      },
    ];

    expect(isValidCartItems(invalidCart)).toBe(false);
  });

  it("should accept items with zero price", () => {
    const validCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: 0,
        quantity: 1,
      },
    ];

    expect(isValidCartItems(validCart)).toBe(true);
  });

  it("should reject items with zero or negative quantity", () => {
    const invalidCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: 45,
        quantity: 0,
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
        description: 123,
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

  it("should reject items with null values", () => {
    const invalidCart = [
      {
        id: null,
        name: "Serum",
        price: 45,
        quantity: 1,
      },
    ];

    expect(isValidCartItems(invalidCart)).toBe(false);
  });

  it("should handle mixed valid and invalid items", () => {
    const invalidCart = [
      {
        id: "serum-1",
        name: "Serum",
        price: 45,
        quantity: 1,
      },
      {
        id: "creme-1",
        name: "Creme",
        price: 55,
        quantity: 0, // invalid
      },
    ];

    expect(isValidCartItems(invalidCart)).toBe(false);
  });

  it("should calculate total correctly", () => {
    const cart = [
      {
        id: "serum-1",
        name: "Serum",
        price: 45,
        quantity: 2,
      },
      {
        id: "creme-1",
        name: "Creme",
        price: 55,
        quantity: 1,
      },
    ];

    if (isValidCartItems(cart)) {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(total).toBe(145); // (45 * 2) + (55 * 1)
    }
  });
});
