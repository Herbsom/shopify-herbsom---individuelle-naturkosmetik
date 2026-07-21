import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db module
vi.mock("./db", () => ({
  createOrder: vi.fn(),
}));

import { createOrder } from "./db";
import { accountRouter } from "./routers/account";

const mockCreateOrder = vi.mocked(createOrder);

function createAuthContext(userId = 1) {
  return {
    user: { id: userId, openId: "test-user", name: "Test", email: "test@example.com", role: "user" as const },
  };
}

function createUnauthContext() {
  return { user: null };
}

describe("Checkout flow - placeOrder with shippingAddress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an order with shipping address", async () => {
    mockCreateOrder.mockResolvedValue(10);

    const caller = accountRouter.createCaller(createAuthContext() as any);
    const result = await caller.placeOrder({
      items: [
        { productId: "serum-01", productName: "Individuelles Serum", priceCents: 5500, quantity: 1 },
        { productId: "cleaner-gel", productName: "Reinigungsgel", priceCents: 2400, quantity: 2 },
      ],
      shippingAddress: "Max Mustermann, Musterstr. 1, 48149 Münster",
    });

    expect(result).toEqual({ orderId: 10, success: true });
    expect(mockCreateOrder).toHaveBeenCalledWith(
      {
        userId: 1,
        status: "pending",
        totalCents: 10300,
        shippingAddress: "Max Mustermann, Musterstr. 1, 48149 Münster",
      },
      [
        { productId: "serum-01", productName: "Individuelles Serum", priceCents: 5500, quantity: 1 },
        { productId: "cleaner-gel", productName: "Reinigungsgel", priceCents: 2400, quantity: 2 },
      ]
    );
  });

  it("creates an order without shipping address (defaults to null)", async () => {
    mockCreateOrder.mockResolvedValue(11);

    const caller = accountRouter.createCaller(createAuthContext() as any);
    const result = await caller.placeOrder({
      items: [
        { productId: "creme-01", productName: "Gesichtscreme", priceCents: 3900, quantity: 1 },
      ],
    });

    expect(result).toEqual({ orderId: 11, success: true });
    expect(mockCreateOrder).toHaveBeenCalledWith(
      {
        userId: 1,
        status: "pending",
        totalCents: 3900,
        shippingAddress: null,
      },
      [{ productId: "creme-01", productName: "Gesichtscreme", priceCents: 3900, quantity: 1 }]
    );
  });

  it("calculates total correctly from multiple items", async () => {
    mockCreateOrder.mockResolvedValue(12);

    const caller = accountRouter.createCaller(createAuthContext() as any);
    await caller.placeOrder({
      items: [
        { productId: "peeling-bha", productName: "BHA Peeling", priceCents: 2900, quantity: 3 },
        { productId: "sunscreen", productName: "Sonnenschutz SPF50+", priceCents: 3400, quantity: 1 },
      ],
      shippingAddress: "Anna Schmidt, Hauptstr. 5, 10115 Berlin",
    });

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ totalCents: 12100 }),
      expect.any(Array)
    );
  });

  it("rejects unauthenticated checkout", async () => {
    const caller = accountRouter.createCaller(createUnauthContext() as any);
    await expect(
      caller.placeOrder({
        items: [{ productId: "x", productName: "X", priceCents: 100, quantity: 1 }],
      })
    ).rejects.toThrow();
  });
});
