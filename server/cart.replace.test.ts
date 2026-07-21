/**
 * Tests for the cart replaceItem logic.
 * Replicates the core logic from CartContext to test it in isolation.
 */
import { describe, expect, it } from "vitest";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

/**
 * Replicate the exact replaceItem logic from CartContext
 */
function replaceItem(items: CartItem[], oldId: string, newItem: CartItem): CartItem[] {
  const oldItem = items.find((item) => item.id === oldId);
  // Preserve the quantity from the old item
  const preservedQuantity = oldItem ? oldItem.quantity : newItem.quantity;
  const replacementItem = { ...newItem, quantity: preservedQuantity };

  // If the new config already exists as a separate item in the cart, merge them
  const existingTarget = items.find((item) => item.id === newItem.id && item.id !== oldId);
  if (existingTarget) {
    // Remove the old item and add its quantity to the existing target
    return items
      .filter((item) => item.id !== oldId)
      .map((item) =>
        item.id === newItem.id
          ? { ...item, quantity: item.quantity + preservedQuantity }
          : item
      );
  }

  // Replace the old item with the new one at the same position
  return items.map((item) =>
    item.id === oldId ? replacementItem : item
  );
}

function addItem(items: CartItem[], newItem: CartItem): CartItem[] {
  const existingItem = items.find((item) => item.id === newItem.id);
  if (existingItem) {
    return items.map((item) =>
      item.id === newItem.id
        ? { ...item, quantity: item.quantity + newItem.quantity }
        : item
    );
  }
  return [...items, newItem];
}

describe("Cart replaceItem logic", () => {
  const cremeItem: CartItem = {
    id: "creme-light-algae-hyaluronic",
    name: "Individuelle Creme (Leicht, 2 Wirkstoffe)",
    price: 36,
    quantity: 1,
    description: "Wirkstoffe: Algenextrakt, Hyaluronkomplex",
  };

  const serumItem: CartItem = {
    id: "serum-true-algae-hyaluronic-retinol",
    name: "Individuelles Serum (3 Wirkstoffe)",
    price: 55,
    quantity: 1,
    description: "Wirkstoffe: Algenextrakt, Hyaluronkomplex, Retinolkomplex",
  };

  it("replaces an existing creme item with a new configuration", () => {
    const items = [cremeItem, serumItem];
    const newCreme: CartItem = {
      id: "creme-rich-retinol-vitaminc",
      name: "Individuelle Creme (Reichhaltig, 2 Wirkstoffe)",
      price: 36,
      quantity: 1,
      description: "Wirkstoffe: Retinolkomplex, Vitamin C-Komplex",
    };

    const result = replaceItem(items, cremeItem.id, newCreme);

    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe("creme-rich-retinol-vitaminc");
    expect(result[0]!.name).toBe("Individuelle Creme (Reichhaltig, 2 Wirkstoffe)");
    expect(result[1]).toEqual(serumItem);
  });

  it("replaces an existing serum item with a new configuration", () => {
    const items = [cremeItem, serumItem];
    const newSerum: CartItem = {
      id: "serum-true-mallow-horsechestnut-algae",
      name: "Individuelles Serum (3 Wirkstoffe)",
      price: 55,
      quantity: 1,
      description: "Wirkstoffe: Malvenextrakt, Rosskastanienextrakt, Algenextrakt",
    };

    const result = replaceItem(items, serumItem.id, newSerum);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(cremeItem);
    expect(result[1]!.id).toBe("serum-true-mallow-horsechestnut-algae");
  });

  it("keeps the same position in the cart after replacement", () => {
    const otherItem: CartItem = {
      id: "cleanser-1",
      name: "Reiniger",
      price: 24,
      quantity: 1,
    };
    const items = [otherItem, cremeItem, serumItem];
    const newCreme: CartItem = {
      id: "creme-rich-algae-mallow-retinol",
      name: "Individuelle Creme (Reichhaltig, 3 Wirkstoffe)",
      price: 41,
      quantity: 1,
      description: "Wirkstoffe: Algenextrakt, Malvenextrakt, Retinolkomplex",
    };

    const result = replaceItem(items, cremeItem.id, newCreme);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(otherItem);
    expect(result[1]!.id).toBe("creme-rich-algae-mallow-retinol");
    expect(result[2]).toEqual(serumItem);
  });

  it("preserves the quantity of the old item when replacing", () => {
    const items = [{ ...cremeItem, quantity: 3 }];
    const newCreme: CartItem = {
      id: "creme-rich-retinol-vitaminc",
      name: "Individuelle Creme (Reichhaltig, 2 Wirkstoffe)",
      price: 36,
      quantity: 1,
      description: "Wirkstoffe: Retinolkomplex, Vitamin C-Komplex",
    };

    const result = replaceItem(items, cremeItem.id, newCreme);

    expect(result).toHaveLength(1);
    expect(result[0]!.quantity).toBe(3); // Preserved from old item
    expect(result[0]!.id).toBe("creme-rich-retinol-vitaminc");
  });

  it("merges quantities when new config already exists in cart", () => {
    const existingNewCreme: CartItem = {
      id: "creme-rich-retinol-vitaminc",
      name: "Individuelle Creme (Reichhaltig, 2 Wirkstoffe)",
      price: 36,
      quantity: 2,
      description: "Wirkstoffe: Retinolkomplex, Vitamin C-Komplex",
    };
    const items = [{ ...cremeItem, quantity: 1 }, existingNewCreme];

    const newCreme: CartItem = {
      id: "creme-rich-retinol-vitaminc",
      name: "Individuelle Creme (Reichhaltig, 2 Wirkstoffe)",
      price: 36,
      quantity: 1,
      description: "Wirkstoffe: Retinolkomplex, Vitamin C-Komplex",
    };

    const result = replaceItem(items, cremeItem.id, newCreme);

    // Old item removed, existing target gets merged quantity
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("creme-rich-retinol-vitaminc");
    expect(result[0]!.quantity).toBe(3); // 2 (existing) + 1 (preserved from old)
  });

  it("does not add a duplicate when replacing with same ID", () => {
    const items = [cremeItem];
    const updatedCreme: CartItem = {
      ...cremeItem,
      description: "Wirkstoffe: Algenextrakt, Hyaluronkomplex (aktualisiert)",
    };

    const result = replaceItem(items, cremeItem.id, updatedCreme);

    expect(result).toHaveLength(1);
    expect(result[0]!.description).toBe("Wirkstoffe: Algenextrakt, Hyaluronkomplex (aktualisiert)");
    expect(result[0]!.quantity).toBe(1);
  });

  it("addItem increases quantity for same ID (normal add behavior)", () => {
    const items = [cremeItem];
    const sameItem: CartItem = { ...cremeItem, quantity: 1 };

    const result = addItem(items, sameItem);

    expect(result).toHaveLength(1);
    expect(result[0]!.quantity).toBe(2);
  });
});
