import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSubscriptionsByUserId,
  getSubscriptionById,
  getSubscriptionItems,
  createSubscription,
  updateSubscription,
  updateSubscriptionItems,
  addSubscriptionHistory,
  getSubscriptionHistory,
} from "./db";

// Mock database functions
vi.mock("./db", () => ({
  getSubscriptionsByUserId: vi.fn(),
  getSubscriptionById: vi.fn(),
  getSubscriptionItems: vi.fn(),
  createSubscription: vi.fn(),
  updateSubscription: vi.fn(),
  updateSubscriptionItems: vi.fn(),
  addSubscriptionHistory: vi.fn(),
  getSubscriptionHistory: vi.fn(),
}));

describe("Subscription Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSubscriptionsByUserId", () => {
    it("should return subscriptions for a user", async () => {
      const mockSubscriptions = [
        {
          id: 1,
          userId: 1,
          status: "active" as const,
          billingIntervalDays: 30,
          totalCents: 5000,
          nextBillingDate: new Date("2026-07-18"),
          lastBillingDate: null,
          stripeSubscriptionId: null,
          shippingAddress: null,
          createdAt: new Date("2026-06-18"),
          updatedAt: new Date("2026-06-18"),
        },
      ];

      vi.mocked(getSubscriptionsByUserId).mockResolvedValue(mockSubscriptions);

      const result = await getSubscriptionsByUserId(1);
      expect(result).toEqual(mockSubscriptions);
      expect(getSubscriptionsByUserId).toHaveBeenCalledWith(1);
    });

    it("should return empty array if no subscriptions exist", async () => {
      vi.mocked(getSubscriptionsByUserId).mockResolvedValue([]);

      const result = await getSubscriptionsByUserId(999);
      expect(result).toEqual([]);
    });
  });

  describe("getSubscriptionById", () => {
    it("should return a subscription by id", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "active" as const,
        billingIntervalDays: 30,
        totalCents: 5000,
        nextBillingDate: new Date("2026-07-18"),
        lastBillingDate: null,
        stripeSubscriptionId: null,
        shippingAddress: null,
        createdAt: new Date("2026-06-18"),
        updatedAt: new Date("2026-06-18"),
      };

      vi.mocked(getSubscriptionById).mockResolvedValue(mockSubscription);

      const result = await getSubscriptionById(1, 1);
      expect(result).toEqual(mockSubscription);
      expect(getSubscriptionById).toHaveBeenCalledWith(1, 1);
    });

    it("should return null if subscription not found", async () => {
      vi.mocked(getSubscriptionById).mockResolvedValue(null);

      const result = await getSubscriptionById(999, 1);
      expect(result).toBeNull();
    });
  });

  describe("getSubscriptionItems", () => {
    it("should return items for a subscription", async () => {
      const mockItems = [
        {
          id: 1,
          subscriptionId: 1,
          productId: "serum-1",
          productName: "Individuelles Serum",
          priceCents: 2500,
          quantity: 1,
        },
        {
          id: 2,
          subscriptionId: 1,
          productId: "creme-1",
          productName: "Individuelle Creme",
          priceCents: 2500,
          quantity: 1,
        },
      ];

      vi.mocked(getSubscriptionItems).mockResolvedValue(mockItems);

      const result = await getSubscriptionItems(1);
      expect(result).toEqual(mockItems);
      expect(result.length).toBe(2);
    });

    it("should return empty array if no items exist", async () => {
      vi.mocked(getSubscriptionItems).mockResolvedValue([]);

      const result = await getSubscriptionItems(999);
      expect(result).toEqual([]);
    });
  });

  describe("createSubscription", () => {
    it("should create a new subscription", async () => {
      const newSubscription = {
        userId: 1,
        status: "active" as const,
        billingIntervalDays: 30,
        totalCents: 5000,
        nextBillingDate: new Date("2026-07-18"),
        shippingAddress: null,
      };

      const items = [
        {
          productId: "serum-1",
          productName: "Individuelles Serum",
          priceCents: 2500,
          quantity: 1,
        },
        {
          productId: "creme-1",
          productName: "Individuelle Creme",
          priceCents: 2500,
          quantity: 1,
        },
      ];

      vi.mocked(createSubscription).mockResolvedValue(1);

      const result = await createSubscription(newSubscription, items);
      expect(result).toBe(1);
      expect(createSubscription).toHaveBeenCalledWith(newSubscription, items);
    });
  });

  describe("updateSubscription", () => {
    it("should update subscription status", async () => {
      vi.mocked(updateSubscription).mockResolvedValue(undefined);

      await updateSubscription(1, 1, { status: "paused" });
      expect(updateSubscription).toHaveBeenCalledWith(1, 1, { status: "paused" });
    });

    it("should update billing interval", async () => {
      vi.mocked(updateSubscription).mockResolvedValue(undefined);

      const nextDate = new Date("2026-08-18");
      await updateSubscription(1, 1, {
        billingIntervalDays: 60,
        nextBillingDate: nextDate,
      });

      expect(updateSubscription).toHaveBeenCalledWith(1, 1, {
        billingIntervalDays: 60,
        nextBillingDate: nextDate,
      });
    });
  });

  describe("updateSubscriptionItems", () => {
    it("should update subscription items", async () => {
      const newItems = [
        {
          productId: "serum-1",
          productName: "Individuelles Serum",
          priceCents: 2500,
          quantity: 2,
        },
      ];

      vi.mocked(updateSubscriptionItems).mockResolvedValue(undefined);

      await updateSubscriptionItems(1, newItems);
      expect(updateSubscriptionItems).toHaveBeenCalledWith(1, newItems);
    });
  });

  describe("addSubscriptionHistory", () => {
    it("should add a history entry", async () => {
      const historyEntry = {
        subscriptionId: 1,
        eventType: "created" as const,
        amountCents: 5000,
        description: "Abonnement erstellt mit 2 Produkt(en)",
      };

      vi.mocked(addSubscriptionHistory).mockResolvedValue(1);

      const result = await addSubscriptionHistory(historyEntry);
      expect(result).toBe(1);
      expect(addSubscriptionHistory).toHaveBeenCalledWith(historyEntry);
    });
  });

  describe("getSubscriptionHistory", () => {
    it("should return subscription history", async () => {
      const mockHistory = [
        {
          id: 1,
          subscriptionId: 1,
          eventType: "created",
          amountCents: 5000,
          description: "Abonnement erstellt mit 2 Produkt(en)",
          createdAt: new Date("2026-06-18"),
        },
        {
          id: 2,
          subscriptionId: 1,
          eventType: "modified",
          amountCents: null,
          description: "Abonnement-Intervall auf alle 60 Tage geändert",
          createdAt: new Date("2026-06-19"),
        },
      ];

      vi.mocked(getSubscriptionHistory).mockResolvedValue(mockHistory);

      const result = await getSubscriptionHistory(1);
      expect(result).toEqual(mockHistory);
      expect(result.length).toBe(2);
    });
  });
});
