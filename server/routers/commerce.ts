/**
 * Commerce router — backend-agnostic tRPC surface for the storefront.
 *
 * The router is intentionally thin: zod validates input, then delegates to the
 * named functions exported from `server/_core/shopify`. If we ever swap
 * commerce backends, only `_core/shopify.ts` + `_core/shopifyNormalize.ts`
 * change — this router stays put.
 */

import { z } from "zod";
import {
  addCartLines,
  createCart,
  getCart,
  getCollectionByHandle,
  getCustomerAccountUrl,
  getProductByHandle,
  listCollections,
  listProducts,
  listSubscriptionProducts,
  removeCartLines,
  updateCartLines,
} from "../_core/shopify";
import { publicProcedure, router } from "../_core/trpc";

const cartAttributeSchema = z.object({
  key: z.string().trim().min(1).max(255),
  value: z.string().trim().min(1).max(1000),
});

const cartLineInputSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  attributes: z.array(cartAttributeSchema).max(20).optional(),
  sellingPlanId: z.string().min(1).optional(),
});

const cartLineUpdateSchema = z.object({
  lineId: z.string().min(1),
  /** 0 means "remove this line" — the route forwards to removeLines. */
  quantity: z.number().int().min(0).max(99),
});

export const commerceRouter = router({
  customerAccount: publicProcedure.query(() => ({ url: getCustomerAccountUrl() })),
  products: router({
    list: publicProcedure
      .input(
        z
          .object({
            first: z.number().int().min(1).max(100).optional(),
            collectionHandle: z.string().min(1).optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        return listProducts(input ?? {});
      }),
    byHandle: publicProcedure
      .input(z.object({ handle: z.string().min(1) }))
      .query(async ({ input }) => {
        return getProductByHandle(input.handle);
      }),
  }),
  subscriptions: router({
    list: publicProcedure
      .input(z.object({ first: z.number().int().min(1).max(100).optional() }).optional())
      .query(async ({ input }) => listSubscriptionProducts(input?.first)),
  }),
  collections: router({
    list: publicProcedure
      .input(z.object({ first: z.number().int().min(1).max(50).optional() }).optional())
      .query(async ({ input }) => {
        return listCollections(input?.first);
      }),
    byHandle: publicProcedure
      .input(z.object({ handle: z.string().min(1) }))
      .query(async ({ input }) => {
        return getCollectionByHandle(input.handle);
      }),
  }),
  cart: router({
    create: publicProcedure
      .input(z.object({ lines: z.array(cartLineInputSchema).min(1).max(50) }))
      .mutation(async ({ input }) => {
        console.log("createCart input lines:", JSON.stringify(input.lines, null, 2));
        return createCart(input.lines);
      }),
    get: publicProcedure
      .input(z.object({ cartId: z.string().min(1) }))
      .query(async ({ input }) => {
        return getCart(input.cartId);
      }),
    addLines: publicProcedure
      .input(
        z.object({
          cartId: z.string().min(1),
          lines: z.array(cartLineInputSchema).min(1).max(50),
        })
      )
      .mutation(async ({ input }) => {
        console.log("addLines input cartId:", input.cartId);
        console.log("addLines input lines:", JSON.stringify(input.lines, null, 2));
        return addCartLines(input.cartId, input.lines);
      }),
    updateLines: publicProcedure
      .input(
        z.object({
          cartId: z.string().min(1),
          lines: z.array(cartLineUpdateSchema).min(1).max(50),
        })
      )
      .mutation(async ({ input }) => {
        // qty 0 means "remove this line" — split the request so the client
        // never has to call two procedures for a single user gesture.
        const toRemove = input.lines.filter(l => l.quantity === 0).map(l => l.lineId);
        const toUpdate = input.lines.filter(l => l.quantity > 0);

        let cart = null;
        if (toUpdate.length) {
          cart = await updateCartLines(input.cartId, toUpdate);
        }
        if (toRemove.length) {
          cart = await removeCartLines(input.cartId, toRemove);
        }
        if (!cart) cart = await getCart(input.cartId);
        return cart;
      }),
    removeLines: publicProcedure
      .input(
        z.object({
          cartId: z.string().min(1),
          lineIds: z.array(z.string().min(1)).min(1).max(50),
        })
      )
      .mutation(async ({ input }) => {
        return removeCartLines(input.cartId, input.lineIds);
      }),
  }),
});

export type CommerceRouter = typeof commerceRouter;
