import { describe, it, expect, beforeEach } from "vitest";

/**
 * Discount validation logic (mirrored from discounts router for testing)
 */
interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderCents: number;
  maxUses: number;
  currentUses: number;
  expiresAt: Date | null;
  active: boolean;
}

function validateDiscount(
  code: DiscountCode,
  orderTotalCents: number,
  currentDate: Date = new Date()
): { valid: boolean; error?: string; discountCents?: number } {
  if (!code.active) {
    return { valid: false, error: "Code not active" };
  }

  if (code.expiresAt && currentDate > code.expiresAt) {
    return { valid: false, error: "Code expired" };
  }

  if (code.maxUses !== -1 && code.currentUses >= code.maxUses) {
    return { valid: false, error: "Code usage limit reached" };
  }

  if (orderTotalCents < code.minOrderCents) {
    return { valid: false, error: "Minimum order value not met" };
  }

  let discountCents = 0;
  if (code.type === 'percentage') {
    discountCents = Math.floor((orderTotalCents * code.value) / 100);
  } else {
    discountCents = Math.min(code.value, orderTotalCents);
  }

  return { valid: true, discountCents };
}

describe("Discount Code System", () => {
  let welcomeCode: DiscountCode;
  let summerCode: DiscountCode;
  let fixedCode: DiscountCode;

  beforeEach(() => {
    welcomeCode = {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrderCents: 0,
      maxUses: -1,
      currentUses: 0,
      expiresAt: null,
      active: true,
    };

    summerCode = {
      code: 'SUMMER20',
      type: 'percentage',
      value: 20,
      minOrderCents: 5000, // €50 minimum
      maxUses: 100,
      currentUses: 45,
      expiresAt: new Date('2026-08-31'),
      active: true,
    };

    fixedCode = {
      code: 'SAVE5',
      type: 'fixed',
      value: 500, // €5.00
      minOrderCents: 2000, // €20 minimum
      maxUses: -1,
      currentUses: 0,
      expiresAt: null,
      active: true,
    };
  });

  describe("Percentage Discounts", () => {
    it("should calculate 10% discount correctly", () => {
      const result = validateDiscount(welcomeCode, 10000); // €100
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(1000); // €10
    });

    it("should apply 20% discount with minimum order", () => {
      const result = validateDiscount(summerCode, 5000); // €50 (minimum)
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(1000); // €10
    });

    it("should reject order below minimum", () => {
      const result = validateDiscount(summerCode, 4999); // €49.99
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Minimum order value not met");
    });

    it("should handle rounding correctly", () => {
      const result = validateDiscount(welcomeCode, 1234); // €12.34
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(123); // €1.23 (rounded down)
    });
  });

  describe("Fixed Amount Discounts", () => {
    it("should apply fixed €5 discount", () => {
      const result = validateDiscount(fixedCode, 2000); // €20
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(500); // €5
    });

    it("should cap fixed discount at order total", () => {
      const result = validateDiscount(fixedCode, 300); // €3
      expect(result.valid).toBe(false); // Fails minimum check first
    });

    it("should not exceed order total", () => {
      const smallOrder = { ...fixedCode, minOrderCents: 0 };
      const result = validateDiscount(smallOrder, 300); // €3
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(300); // Capped at order total
    });
  });

  describe("Code Status Validation", () => {
    it("should reject inactive codes", () => {
      const inactiveCode = { ...welcomeCode, active: false };
      const result = validateDiscount(inactiveCode, 10000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Code not active");
    });

    it("should reject expired codes", () => {
      const expiredCode = { ...summerCode, expiresAt: new Date('2026-01-01') };
      const currentDate = new Date('2026-06-16');
      const result = validateDiscount(expiredCode, 5000, currentDate);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Code expired");
    });

    it("should accept codes expiring today", () => {
      const expiringToday = { ...summerCode, expiresAt: new Date('2026-06-16T23:59:59') };
      const currentDate = new Date('2026-06-16T00:00:00');
      const result = validateDiscount(expiringToday, 5000, currentDate);
      expect(result.valid).toBe(true);
    });

    it("should reject codes at usage limit", () => {
      const limitedCode = { ...summerCode, maxUses: 100, currentUses: 100 };
      const result = validateDiscount(limitedCode, 5000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Code usage limit reached");
    });

    it("should accept codes below usage limit", () => {
      const result = validateDiscount(summerCode, 5000); // currentUses: 45, maxUses: 100
      expect(result.valid).toBe(true);
    });

    it("should allow unlimited usage codes", () => {
      const unlimitedCode = { ...welcomeCode, maxUses: -1, currentUses: 1000 };
      const result = validateDiscount(unlimitedCode, 10000);
      expect(result.valid).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero order total", () => {
      const result = validateDiscount(welcomeCode, 0);
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(0);
    });

    it("should handle very large orders", () => {
      const result = validateDiscount(welcomeCode, 999999999); // €9,999,999.99
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(99999999); // 10% discount
    });

    it("should handle percentage discount of 100%", () => {
      const fullDiscount = { ...welcomeCode, value: 100 };
      const result = validateDiscount(fullDiscount, 10000);
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(10000); // Full discount
    });

    it("should handle 0% discount", () => {
      const noDiscount = { ...welcomeCode, value: 0 };
      const result = validateDiscount(noDiscount, 10000);
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(0);
    });
  });

  describe("Real-World Scenarios", () => {
    it("should apply WELCOME10 to €45 order", () => {
      const result = validateDiscount(welcomeCode, 4500);
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(450); // €4.50
    });

    it("should apply SUMMER20 to €75 order", () => {
      const result = validateDiscount(summerCode, 7500);
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(1500); // €15
    });

    it("should apply SAVE5 to €30 order", () => {
      const result = validateDiscount(fixedCode, 3000);
      expect(result.valid).toBe(true);
      expect(result.discountCents).toBe(500); // €5
    });

    it("should reject SUMMER20 on €40 order (below minimum)", () => {
      const result = validateDiscount(summerCode, 4000);
      expect(result.valid).toBe(false);
    });

    it("should reject SAVE5 on €15 order (below minimum)", () => {
      const result = validateDiscount(fixedCode, 1500);
      expect(result.valid).toBe(false);
    });
  });
});
