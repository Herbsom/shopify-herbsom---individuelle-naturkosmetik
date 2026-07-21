/**
 * Stripe Products and Prices Configuration
 * 
 * This file defines the product and price mappings for Herbsom.
 * In production, these would typically be managed in the Stripe Dashboard,
 * but we maintain them here for reference and consistency.
 */

export const STRIPE_PRODUCTS = {
  // Cleansers
  cleansingGel: {
    name: "Reinigungsgel",
    description: "Intensiv reinigendes Gel für Mischhaut",
    priceInCents: 3200, // €32.00
  },
  cleansingMilk: {
    name: "Reinigungsmilch",
    description: "Sanfte, feuchtigkeitsspendende Reinigung",
    priceInCents: 2800, // €28.00
  },

  // Peelings
  bhaAzelaic: {
    name: "BHA & Azelainsäure Peeling",
    description: "Porenreinigung und Talg-Entfernung",
    priceInCents: 3800, // €38.00
  },
  ahaPha: {
    name: "AHA & PHA Peeling",
    description: "Sanfte chemische Exfoliation",
    priceInCents: 4200, // €42.00
  },

  // Serums (base prices, actual price depends on ingredients)
  serum: {
    name: "Serum",
    description: "Individuelles Serum mit Wirkstoffen",
    basePriceInCents: 4500, // €45.00 base
  },

  // Cremes (base prices, actual price depends on base and ingredients)
  creme: {
    name: "Creme",
    description: "Individuelle Creme mit Wirkstoffen",
    basePriceInCents: 5500, // €55.00 base
  },

  // Sunscreen (placeholder)
  sunscreen: {
    name: "Sonnenschutzfluid SPF 50+",
    description: "Täglicher UV-Schutz",
    priceInCents: 3500, // €35.00
  },
};

/**
 * Calculate the total price for a cart item
 */
export function calculateItemPrice(
  productId: string,
  quantity: number = 1,
  ingredientCount: number = 0
): number {
  // Base prices for fixed products
  const basePrices: Record<string, number> = {
    "cleaner-gel": STRIPE_PRODUCTS.cleansingGel.priceInCents,
    "cleaner-milk": STRIPE_PRODUCTS.cleansingMilk.priceInCents,
    "peeling-bha": STRIPE_PRODUCTS.bhaAzelaic.priceInCents,
    "peeling-aha": STRIPE_PRODUCTS.ahaPha.priceInCents,
    "sunscreen": STRIPE_PRODUCTS.sunscreen.priceInCents,
  };

  // For serums and cremes, add €5 per ingredient
  const ingredientPrices: Record<string, number> = {
    "serum-": STRIPE_PRODUCTS.serum.basePriceInCents,
    "creme-": STRIPE_PRODUCTS.creme.basePriceInCents,
  };

  let priceInCents = 0;

  // Check fixed products first
  if (productId in basePrices) {
    priceInCents = basePrices[productId];
  } else {
    // Check configurable products
    for (const [prefix, basePrice] of Object.entries(ingredientPrices)) {
      if (productId.startsWith(prefix)) {
        priceInCents = basePrice + ingredientCount * 500; // €5.00 per ingredient
        break;
      }
    }
  }

  return (priceInCents * quantity) / 100; // Convert cents to euros
}
