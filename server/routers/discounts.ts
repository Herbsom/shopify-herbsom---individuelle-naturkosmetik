import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { subscriptions } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Discount Code System
 * 
 * This module handles promo/discount codes for Herbsom.
 * Codes are validated and applied at checkout time.
 * 
 * Special codes:
 * - SUBSCRIBE15: 15% discount for active subscribers (auto-applied)
 * - WELCOME10: 10% welcome discount for new customers
 * - SUMMER20: 20% summer discount (€50 minimum)
 * - SAVE5: €5 fixed discount (€20 minimum)
 */

// In-memory discount codes (in production, these would be in the database)
const DISCOUNT_CODES: Record<string, {
  code: string;
  type: 'percentage' | 'fixed'; // percentage or fixed amount
  value: number; // percentage (0-100) or amount in cents
  minOrderCents: number; // minimum order value in cents
  maxUses: number; // -1 for unlimited
  currentUses: number;
  expiresAt: Date | null;
  active: boolean;
  subscriberOnly: boolean; // Only for active subscribers
  description: string;
}> = {
  SUBSCRIBE15: {
    code: 'SUBSCRIBE15',
    type: 'percentage',
    value: 15,
    minOrderCents: 0,
    maxUses: -1,
    currentUses: 0,
    expiresAt: null,
    active: true,
    subscriberOnly: true,
    description: '15% Rabatt für aktive Abonnenten',
  },
  WELCOME10: {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderCents: 0,
    maxUses: -1,
    currentUses: 0,
    expiresAt: null,
    active: true,
    subscriberOnly: false,
    description: '10% Willkommensrabatt',
  },
  SUMMER20: {
    code: 'SUMMER20',
    type: 'percentage',
    value: 20,
    minOrderCents: 5000, // €50 minimum
    maxUses: 100,
    currentUses: 45,
    expiresAt: new Date('2026-08-31'),
    active: true,
    subscriberOnly: false,
    description: '20% Sommerrabatt (ab €50)',
  },
  SAVE5: {
    code: 'SAVE5',
    type: 'fixed',
    value: 500, // €5.00
    minOrderCents: 2000, // €20 minimum
    maxUses: -1,
    currentUses: 0,
    expiresAt: null,
    active: true,
    subscriberOnly: false,
    description: '€5 Rabatt (ab €20)',
  },
};

/**
 * Check if a user has an active subscription
 */
async function hasActiveSubscription(userId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    
    const [activeSubscription] = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      ))
      .limit(1);
    
    return !!activeSubscription;
  } catch {
    return false;
  }
}

/**
 * Validate a discount code and return discount details
 */
function validateDiscountCode(
  code: string,
  orderTotalCents: number,
  isSubscriber: boolean = false
): { valid: boolean; error?: string; discount?: typeof DISCOUNT_CODES[string] } {
  const discount = DISCOUNT_CODES[code];

  if (!discount) {
    return { valid: false, error: "Gutscheincode nicht gefunden" };
  }

  if (!discount.active) {
    return { valid: false, error: "Dieser Gutscheincode ist nicht mehr aktiv" };
  }

  if (discount.expiresAt && new Date() > discount.expiresAt) {
    return { valid: false, error: "Dieser Gutscheincode ist abgelaufen" };
  }

  if (discount.maxUses !== -1 && discount.currentUses >= discount.maxUses) {
    return { valid: false, error: "Dieser Gutscheincode wurde zu oft verwendet" };
  }

  if (discount.subscriberOnly && !isSubscriber) {
    return { valid: false, error: "Dieser Gutscheincode ist nur für aktive Abonnenten verfügbar" };
  }

  if (orderTotalCents < discount.minOrderCents) {
    const minOrderEuros = (discount.minOrderCents / 100).toFixed(2);
    return { valid: false, error: `Mindestbestellwert von €${minOrderEuros} erforderlich` };
  }

  return { valid: true, discount };
}

/**
 * Calculate discount amount
 */
function calculateDiscountAmount(discount: typeof DISCOUNT_CODES[string], orderTotalCents: number): number {
  if (discount.type === 'percentage') {
    return Math.floor((orderTotalCents * discount.value) / 100);
  } else {
    return Math.min(discount.value, orderTotalCents);
  }
}

export const discountsRouter = router({
  /**
   * Validate and get discount details for a code
   * Checks subscriber status if user is logged in
   */
  validateCode: publicProcedure
    .input(z.object({
      code: z.string().toUpperCase(),
      orderTotalCents: z.number().min(0),
    }))
    .query(async ({ input }) => {
      const validation = validateDiscountCode(input.code, input.orderTotalCents, false);

      if (!validation.valid) {
        return { valid: false, error: validation.error };
      }

      const discount = validation.discount!;
      const discountCents = calculateDiscountAmount(discount, input.orderTotalCents);

      return {
        valid: true,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        description: discount.description,
        subscriberOnly: discount.subscriberOnly,
        discountCents,
        discountEuros: (discountCents / 100).toFixed(2),
        newTotalCents: input.orderTotalCents - discountCents,
        newTotalEuros: ((input.orderTotalCents - discountCents) / 100).toFixed(2),
      };
    }),

  /**
   * Validate discount code with subscriber check (for logged-in users)
   */
  validateCodeAuthenticated: protectedProcedure
    .input(z.object({
      code: z.string().toUpperCase(),
      orderTotalCents: z.number().min(0),
    }))
    .query(async ({ ctx, input }) => {
      const isSubscriber = await hasActiveSubscription(ctx.user.id);
      const validation = validateDiscountCode(input.code, input.orderTotalCents, isSubscriber);

      if (!validation.valid) {
        return { valid: false, error: validation.error };
      }

      const discount = validation.discount!;
      const discountCents = calculateDiscountAmount(discount, input.orderTotalCents);

      return {
        valid: true,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        description: discount.description,
        subscriberOnly: discount.subscriberOnly,
        discountCents,
        discountEuros: (discountCents / 100).toFixed(2),
        newTotalCents: input.orderTotalCents - discountCents,
        newTotalEuros: ((input.orderTotalCents - discountCents) / 100).toFixed(2),
      };
    }),

  /**
   * Apply discount code at checkout
   * This would be called when creating a Stripe checkout session
   */
  applyDiscount: protectedProcedure
    .input(z.object({
      code: z.string().toUpperCase(),
      orderTotalCents: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const isSubscriber = await hasActiveSubscription(ctx.user.id);
      const validation = validateDiscountCode(input.code, input.orderTotalCents, isSubscriber);

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const discount = validation.discount!;
      const discountCents = calculateDiscountAmount(discount, input.orderTotalCents);

      // Increment usage counter
      discount.currentUses += 1;

      return {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        description: discount.description,
        discountCents,
        discountEuros: (discountCents / 100).toFixed(2),
        newTotalCents: input.orderTotalCents - discountCents,
        newTotalEuros: ((input.orderTotalCents - discountCents) / 100).toFixed(2),
      };
    }),

  /**
   * Get available discount codes for the current user
   * Returns subscriber discount if user has active subscription
   */
  getAvailableCodes: protectedProcedure
    .query(async ({ ctx }) => {
      const now = new Date();
      const isSubscriber = await hasActiveSubscription(ctx.user.id);
      
      const availableCodes = Object.values(DISCOUNT_CODES)
        .filter(d => {
          if (!d.active) return false;
          if (d.expiresAt && d.expiresAt <= now) return false;
          if (d.maxUses !== -1 && d.currentUses >= d.maxUses) return false;
          if (d.subscriberOnly && !isSubscriber) return false;
          return true;
        })
        .map(d => ({
          code: d.code,
          type: d.type,
          value: d.value,
          description: d.description,
          minOrderCents: d.minOrderCents,
          subscriberOnly: d.subscriberOnly,
          expiresAt: d.expiresAt?.toISOString() || null,
        }));

      return {
        codes: availableCodes,
        isSubscriber,
        subscriberDiscount: isSubscriber ? DISCOUNT_CODES['SUBSCRIBE15'] : null,
      };
    }),

  /**
   * Get list of active discount codes (for marketing/display - public)
   */
  getActiveCodes: publicProcedure
    .query(async () => {
      const now = new Date();
      const activeCodes = Object.values(DISCOUNT_CODES)
        .filter(d => d.active && (!d.expiresAt || d.expiresAt > now) && !d.subscriberOnly)
        .map(d => ({
          code: d.code,
          type: d.type,
          value: d.value,
          description: d.description,
          minOrderCents: d.minOrderCents,
          expiresAt: d.expiresAt?.toISOString() || null,
        }));

      return activeCodes;
    }),
});
