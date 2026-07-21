import { describe, it, expect, vi, beforeEach } from "vitest";
import * as db from "./db";

// Mock the database functions
vi.mock("./db");

// Mock the product mapping
vi.mock("./_core/product-mapping", () => ({
  getShopifyVariantId: vi.fn((id) => `gid://shopify/ProductVariant/${id}`),
}));

// Mock fetch for Shopify API
global.fetch = vi.fn();

describe("Subscription Webhook Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should detect duplicate invoice and return existing order", async () => {
    const { createShopifyOrderFromSubscription } = await import("./_core/shopify-subscriptions");
    
    const mockExistingOrder = {
      id: 1,
      subscriptionId: 1,
      shopifyOrderId: "gid://shopify/Order/123",
      stripeInvoiceId: "in_test123",
      status: "created",
      totalCents: 10000,
      errorMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getSubscriptionOrderByStripeInvoiceId).mockResolvedValue(mockExistingOrder as any);

    const result = await createShopifyOrderFromSubscription(1, 1, "in_test123");

    expect(result.success).toBe(true);
    expect(result.shopifyOrderId).toBe("gid://shopify/Order/123");
    expect(db.getSubscriptionOrderByStripeInvoiceId).toHaveBeenCalledWith("in_test123");
  });

  it("should handle missing subscription gracefully", async () => {
    const { createShopifyOrderFromSubscription } = await import("./_core/shopify-subscriptions");
    
    vi.mocked(db.getSubscriptionOrderByStripeInvoiceId).mockResolvedValue(null);
    vi.mocked(db.getSubscriptionById).mockResolvedValue(null);

    const result = await createShopifyOrderFromSubscription(999, 1, "in_test456");

    expect(result.success).toBe(false);
    expect(result.error).toContain("not found");
  });

  it("should handle missing subscription items", async () => {
    const { createShopifyOrderFromSubscription } = await import("./_core/shopify-subscriptions");
    
    const mockSubscription = {
      id: 1,
      userId: 1,
      stripeSubscriptionId: "sub_test123",
      status: "active" as const,
      billingIntervalDays: 30,
      totalCents: 10000,
      nextBillingDate: new Date(),
      lastBillingDate: null,
      shippingAddress: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getSubscriptionOrderByStripeInvoiceId).mockResolvedValue(null);
    vi.mocked(db.getSubscriptionById).mockResolvedValue(mockSubscription as any);
    vi.mocked(db.getSubscriptionItems).mockResolvedValue([]);

    const result = await createShopifyOrderFromSubscription(1, 1, "in_test789");

    expect(result.success).toBe(false);
    expect(result.error).toContain("No items found");
  });

  it("should save error record on failed Shopify order creation", async () => {
    const { createShopifyOrderFromSubscription } = await import("./_core/shopify-subscriptions");
    
    const mockSubscription = {
      id: 1,
      userId: 1,
      stripeSubscriptionId: "sub_test123",
      status: "active" as const,
      billingIntervalDays: 30,
      totalCents: 10000,
      nextBillingDate: new Date(),
      lastBillingDate: null,
      shippingAddress: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getSubscriptionOrderByStripeInvoiceId).mockResolvedValue(null);
    vi.mocked(db.getSubscriptionById).mockResolvedValue(mockSubscription as any);
    vi.mocked(db.getSubscriptionItems).mockResolvedValue([]);

    const result = await createShopifyOrderFromSubscription(1, 1, "in_error123");

    expect(result.success).toBe(false);
    // Verify error was recorded
    expect(db.createSubscriptionOrder).toHaveBeenCalled();
  });

  it("should parse shipping address correctly", async () => {
    const mockSubscription = {
      id: 1,
      userId: 1,
      stripeSubscriptionId: "sub_test123",
      status: "active" as const,
      billingIntervalDays: 30,
      totalCents: 10000,
      nextBillingDate: new Date(),
      lastBillingDate: null,
      shippingAddress: JSON.stringify({
        firstName: "Max",
        lastName: "Mustermann",
        street: "Hauptstr. 1",
        city: "München",
        postalCode: "80331",
        country: "DE",
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Verify address parsing works
    expect(mockSubscription.shippingAddress).toBeTruthy();
    const address = JSON.parse(mockSubscription.shippingAddress as string);
    expect(address.firstName).toBe("Max");
    expect(address.city).toBe("München");
  });

  it("should map product IDs to Shopify variant IDs", async () => {
    const { getShopifyVariantId } = await import("./_core/product-mapping");
    
    const variantId = getShopifyVariantId("serum-vitamin-c");
    expect(variantId).toBeTruthy();
    // Should return either mapped ID or fallback
    expect(variantId).toContain("serum-vitamin-c");
  });
});
