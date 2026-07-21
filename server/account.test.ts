import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user-" + userId,
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// Mock the database module
vi.mock("./db", () => ({
  getOrdersByUserId: vi.fn(),
  getOrderItems: vi.fn(),
  getOrderWithItems: vi.fn(),
  createOrder: vi.fn(),
  getDb: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

import { getOrdersByUserId, getOrderItems, getOrderWithItems, createOrder } from "./db";

const mockGetOrdersByUserId = vi.mocked(getOrdersByUserId);
const mockGetOrderItems = vi.mocked(getOrderItems);
const mockGetOrderWithItems = vi.mocked(getOrderWithItems);
const mockCreateOrder = vi.mocked(createOrder);

describe("account.getMyOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when user has no orders", async () => {
    mockGetOrdersByUserId.mockResolvedValue([]);
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.account.getMyOrders();

    expect(result).toEqual([]);
    expect(mockGetOrdersByUserId).toHaveBeenCalledWith(1);
  });

  it("returns orders with items for authenticated user", async () => {
    const mockOrders = [
      {
        id: 1,
        userId: 1,
        status: "delivered" as const,
        totalCents: 4990,
        shippingAddress: null,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15"),
      },
    ];
    const mockItems = [
      {
        id: 1,
        orderId: 1,
        productId: "serum-01",
        productName: "Individuelles Serum",
        priceCents: 4990,
        quantity: 1,
      },
    ];

    mockGetOrdersByUserId.mockResolvedValue(mockOrders);
    mockGetOrderItems.mockResolvedValue(mockItems);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.account.getMyOrders();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].items).toEqual(mockItems);
  });

  it("rejects unauthenticated requests", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.account.getMyOrders()).rejects.toThrow();
  });
});

describe("account.reorder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new order from an existing order", async () => {
    const originalOrder = {
      id: 1,
      userId: 1,
      status: "delivered" as const,
      totalCents: 4990,
      shippingAddress: null,
      createdAt: new Date("2025-01-15"),
      updatedAt: new Date("2025-01-15"),
      items: [
        {
          id: 1,
          orderId: 1,
          productId: "serum-01",
          productName: "Individuelles Serum",
          priceCents: 4990,
          quantity: 1,
        },
      ],
    };

    mockGetOrderWithItems.mockResolvedValue(originalOrder);
    mockCreateOrder.mockResolvedValue(2);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.account.reorder({ orderId: 1 });

    expect(result).toEqual({ orderId: 2, success: true });
    expect(mockCreateOrder).toHaveBeenCalledWith(
      { userId: 1, status: "pending", totalCents: 4990 },
      [{ productId: "serum-01", productName: "Individuelles Serum", priceCents: 4990, quantity: 1 }]
    );
  });

  it("throws when original order not found", async () => {
    mockGetOrderWithItems.mockResolvedValue(null);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.account.reorder({ orderId: 999 })).rejects.toThrow(
      "Originalbestellung nicht gefunden"
    );
  });

  it("rejects unauthenticated requests", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.account.reorder({ orderId: 1 })).rejects.toThrow();
  });
});

describe("account.placeOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new order from cart items", async () => {
    mockCreateOrder.mockResolvedValue(5);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.account.placeOrder({
      items: [
        { productId: "creme-01", productName: "Gesichtscreme", priceCents: 3990, quantity: 2 },
      ],
    });

    expect(result).toEqual({ orderId: 5, success: true });
    expect(mockCreateOrder).toHaveBeenCalledWith(
      { userId: 1, status: "pending", totalCents: 7980, shippingAddress: null },
      [{ productId: "creme-01", productName: "Gesichtscreme", priceCents: 3990, quantity: 2 }]
    );
  });

  it("rejects unauthenticated requests", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.account.placeOrder({
        items: [{ productId: "x", productName: "X", priceCents: 100, quantity: 1 }],
      })
    ).rejects.toThrow();
  });
});
