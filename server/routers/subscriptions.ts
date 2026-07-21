import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import {
  getSubscriptionsByUserId,
  getSubscriptionWithItems,
  createSubscription,
  updateSubscription,
  updateSubscriptionItems,
  addSubscriptionHistory,
  getSubscriptionHistory,
} from "../db";

export const subscriptionsRouter = router({
  /** Get all subscriptions for the current user */
  getMySubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const userSubscriptions = await getSubscriptionsByUserId(ctx.user.id);
    
    // For each subscription, fetch its items
    const subscriptionsWithItems = await Promise.all(
      userSubscriptions.map(async (subscription) => {
        const fullSubscription = await getSubscriptionWithItems(subscription.id, ctx.user.id);
        return fullSubscription || subscription;
      })
    );

    return subscriptionsWithItems;
  }),

  /** Get a single subscription with its items */
  getSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const subscription = await getSubscriptionWithItems(input.subscriptionId, ctx.user.id);
      if (!subscription) {
        throw new Error("Abonnement nicht gefunden");
      }
      return subscription;
    }),

  /** Get subscription history/events */
  getSubscriptionHistory: protectedProcedure
    .input(z.object({ subscriptionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const subscription = await getSubscriptionWithItems(input.subscriptionId, ctx.user.id);
      if (!subscription) {
        throw new Error("Abonnement nicht gefunden");
      }
      return getSubscriptionHistory(input.subscriptionId);
    }),

  /** Create a new subscription from cart items */
  createSubscription: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            productName: z.string(),
            priceCents: z.number(),
            quantity: z.number().min(1),
          })
        ),
        billingIntervalDays: z.number().min(1).default(30),
        shippingAddress: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const totalCents = input.items.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      );

      // Calculate next billing date
      const nextBillingDate = new Date();
      nextBillingDate.setDate(nextBillingDate.getDate() + input.billingIntervalDays);

      const subscriptionId = await createSubscription(
        {
          userId: ctx.user.id,
          status: "active",
          billingIntervalDays: input.billingIntervalDays,
          totalCents,
          nextBillingDate,
          shippingAddress: input.shippingAddress || null,
        },
        input.items
      );

      // Add history entry
      await addSubscriptionHistory({
        subscriptionId,
        eventType: "created",
        amountCents: totalCents,
        description: `Abonnement erstellt mit ${input.items.length} Produkt(en)`,
      });

      return { subscriptionId, success: true };
    }),

  /** Update subscription status (pause, resume, cancel) */
  updateSubscriptionStatus: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.number(),
        status: z.enum(["active", "paused", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await getSubscriptionWithItems(input.subscriptionId, ctx.user.id);
      if (!subscription) {
        throw new Error("Abonnement nicht gefunden");
      }

      await updateSubscription(input.subscriptionId, ctx.user.id, {
        status: input.status,
      });

      // Add history entry
      await addSubscriptionHistory({
        subscriptionId: input.subscriptionId,
        eventType: input.status === "cancelled" ? "cancelled" : input.status === "paused" ? "paused" : "resumed",
        description: `Abonnement ${input.status === "cancelled" ? "gekündigt" : input.status === "paused" ? "pausiert" : "fortgesetzt"}`,
      });

      return { success: true };
    }),

  /** Update subscription billing interval */
  updateBillingInterval: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.number(),
        billingIntervalDays: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await getSubscriptionWithItems(input.subscriptionId, ctx.user.id);
      if (!subscription) {
        throw new Error("Abonnement nicht gefunden");
      }

      // Calculate new next billing date based on last billing date or now
      const baseDate = subscription.lastBillingDate || new Date();
      const nextBillingDate = new Date(baseDate);
      nextBillingDate.setDate(nextBillingDate.getDate() + input.billingIntervalDays);

      await updateSubscription(input.subscriptionId, ctx.user.id, {
        billingIntervalDays: input.billingIntervalDays,
        nextBillingDate,
      });

      // Add history entry
      await addSubscriptionHistory({
        subscriptionId: input.subscriptionId,
        eventType: "modified",
        description: `Abonnement-Intervall auf alle ${input.billingIntervalDays} Tage geändert`,
      });

      return { success: true };
    }),

  /** Update subscription items */
  updateSubscriptionItems: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.number(),
        items: z.array(
          z.object({
            productId: z.string(),
            productName: z.string(),
            priceCents: z.number(),
            quantity: z.number().min(1),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await getSubscriptionWithItems(input.subscriptionId, ctx.user.id);
      if (!subscription) {
        throw new Error("Abonnement nicht gefunden");
      }

      // Calculate new total
      const totalCents = input.items.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      );

      // Update items
      await updateSubscriptionItems(input.subscriptionId, input.items);

      // Update total price
      await updateSubscription(input.subscriptionId, ctx.user.id, {
        totalCents,
      });

      // Add history entry
      await addSubscriptionHistory({
        subscriptionId: input.subscriptionId,
        eventType: "modified",
        amountCents: totalCents,
        description: `Abonnement-Produkte aktualisiert: ${input.items.length} Produkt(e)`,
      });

      return { success: true };
    }),

  /** Add a product to an existing subscription */
  addProductToSubscription: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.number(),
        productId: z.string(),
        productName: z.string(),
        priceCents: z.number(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await getSubscriptionWithItems(input.subscriptionId, ctx.user.id);
      if (!subscription) {
        throw new Error("Abonnement nicht gefunden");
      }

      // Check if product already exists
      const existingItem = subscription.items.find((item) => item.productId === input.productId);
      
      let newItems = subscription.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        priceCents: item.priceCents,
        quantity: item.quantity,
      }));

      if (existingItem) {
        // Update quantity if product already exists
        newItems = newItems.map((item) =>
          item.productId === input.productId
            ? { ...item, quantity: item.quantity + input.quantity }
            : item
        );
      } else {
        // Add new product
        newItems.push({
          productId: input.productId,
          productName: input.productName,
          priceCents: input.priceCents,
          quantity: input.quantity,
        });
      }

      // Calculate new total
      const totalCents = newItems.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      );

      // Update items and total
      await updateSubscriptionItems(input.subscriptionId, newItems);
      await updateSubscription(input.subscriptionId, ctx.user.id, {
        totalCents,
      });

      // Add history entry
      await addSubscriptionHistory({
        subscriptionId: input.subscriptionId,
        eventType: "modified",
        amountCents: totalCents,
        description: `Produkt "${input.productName}" zum Abonnement hinzugefügt`,
      });

      return { success: true };
    }),

  /** Remove a product from a subscription */
  removeProductFromSubscription: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.number(),
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await getSubscriptionWithItems(input.subscriptionId, ctx.user.id);
      if (!subscription) {
        throw new Error("Abonnement nicht gefunden");
      }

      const productToRemove = subscription.items.find((item) => item.productId === input.productId);
      if (!productToRemove) {
        throw new Error("Produkt nicht im Abonnement gefunden");
      }

      // Remove product from items
      const newItems = subscription.items
        .filter((item) => item.productId !== input.productId)
        .map((item) => ({
          productId: item.productId,
          productName: item.productName,
          priceCents: item.priceCents,
          quantity: item.quantity,
        }));

      if (newItems.length === 0) {
        throw new Error("Ein Abonnement muss mindestens ein Produkt enthalten");
      }

      // Calculate new total
      const totalCents = newItems.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      );

      // Update items and total
      await updateSubscriptionItems(input.subscriptionId, newItems);
      await updateSubscription(input.subscriptionId, ctx.user.id, {
        totalCents,
      });

      // Add history entry
      await addSubscriptionHistory({
        subscriptionId: input.subscriptionId,
        eventType: "modified",
        amountCents: totalCents,
        description: `Produkt "${productToRemove.productName}" aus dem Abonnement entfernt`,
      });

      return { success: true };
    }),
});
