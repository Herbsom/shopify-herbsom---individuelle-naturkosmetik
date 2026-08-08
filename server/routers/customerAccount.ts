import { z } from "zod";
import { createHash } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { createReview, getUserByOpenId, upsertUser } from "../db";
import { getCustomerDashboard, getVerifiedPurchasedProductIds } from "../_core/shopifyCustomerAccount";
import { publicProcedure, router } from "../_core/trpc";

export const customerAccountRouter = router({
  dashboard: publicProcedure.query(({ ctx }) => getCustomerDashboard(ctx.req, ctx.res)),

  prepareReorder: publicProcedure
    .input(z.object({ orderId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const dashboard = await getCustomerDashboard(ctx.req, ctx.res);
      if (!dashboard.connected) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Bitte melde dich zuerst mit deinem Shopify-Kundenkonto an." });
      }
      const order = dashboard.orders.find(candidate => candidate.id === input.orderId);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Bestellung nicht gefunden." });
      const items = order.items.filter(item => item.reorder);
      if (!items.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Kein Artikel dieser Bestellung ist aktuell erneut kaufbar." });
      }
      return { items };
    }),

  createReview: publicProcedure
    .input(z.object({
      productId: z.string().min(1).max(128),
      rating: z.number().int().min(1).max(5),
      title: z.string().trim().min(1).max(255),
      content: z.string().trim().min(1).max(5000),
    }))
    .mutation(async ({ ctx, input }) => {
      const { customer, productIds } = await getVerifiedPurchasedProductIds(ctx.req, ctx.res);
      if (!productIds.has(input.productId)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Bewertungen sind nur für Produkte aus deinen Bestellungen möglich." });
      }

      const openId = createHash("sha256").update(`shopify-customer:${customer.id}`).digest("hex");
      await upsertUser({ openId, name: customer.displayName, loginMethod: "shopify_customer", lastSignedIn: new Date() });
      const user = await getUserByOpenId(openId);
      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Kundenprofil konnte nicht gespeichert werden." });

      await createReview({
        userId: user.id,
        productId: input.productId,
        rating: input.rating,
        title: input.title,
        content: input.content,
        status: "pending",
      });
      return { success: true };
    }),
});
