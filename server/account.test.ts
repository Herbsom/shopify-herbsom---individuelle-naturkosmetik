import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function makeCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

beforeEach(() => {
  process.env.SHOPIFY_STORE_DOMAIN = "herbsom.myshopify.com";
});

describe("Shopify customer account delegation", () => {
  it("returns the Shopify-hosted customer account entry point", async () => {
    const caller = appRouter.createCaller(makeCtx());

    await expect(caller.commerce.customerAccount()).resolves.toEqual({
      url: "https://herbsom.myshopify.com/account",
    });
  });

  it("does not expose the former local order-history API", async () => {
    const caller = appRouter.createCaller(makeCtx()) as unknown as {
      account: { getMyOrders: () => Promise<unknown> };
    };

    await expect(caller.account.getMyOrders()).rejects.toThrow(
      'No procedure found on path "account,getMyOrders"'
    );
  });

  it("does not expose the former local order-placement API", async () => {
    const caller = appRouter.createCaller(makeCtx()) as unknown as {
      account: { placeOrder: (input: unknown) => Promise<unknown> };
    };

    await expect(caller.account.placeOrder({ items: [] })).rejects.toThrow(
      'No procedure found on path "account,placeOrder"'
    );
  });
});
