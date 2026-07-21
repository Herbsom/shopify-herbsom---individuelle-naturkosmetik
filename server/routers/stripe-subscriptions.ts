import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { updateSubscription, addSubscriptionHistory } from "../db";

// Initialize Stripe
const stripe = new Stripe(ENV.stripeSecretKey);

export const stripeSubscriptionsRouter = router({
  /**
   * Create a Stripe Subscription for recurring billing
   * This creates a subscription with the specified billing interval
   */
  createSubscriptionCheckout: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.number(),
        items: z.array(
          z.object({
            productId: z.string(),
            productName: z.string(),
            priceInCents: z.number().min(50),
            quantity: z.number().min(1),
          })
        ),
        billingIntervalDays: z.number().min(1),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Calculate total amount
        const totalCents = input.items.reduce(
          (sum, item) => sum + item.priceInCents * item.quantity,
          0
        );

        // Create or get Stripe customer
        let customerId: string;
        const customers = await stripe.customers.list({
          email: ctx.user.email ? ctx.user.email : undefined,
          limit: 1,
        } as any);

        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const customer = await stripe.customers.create({
            email: ctx.user.email ? ctx.user.email : undefined,
            name: ctx.user.name ? ctx.user.name : undefined,
            metadata: {
              userId: ctx.user.id.toString(),
            },
          });
          customerId = customer.id;
        }

        // Build line items for subscription
        const lineItems = input.items.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.productName,
              metadata: {
                productId: item.productId,
              },
            },
            unit_amount: item.priceInCents,
            recurring: {
              interval: "day" as const,
              interval_count: input.billingIntervalDays,
            },
          },
          quantity: item.quantity,
        }));

        // Create checkout session for subscription
        const session = await stripe.checkout.sessions.create({
          // @ts-ignore - Stripe types issue with allow_promotion_codes
          customer: customerId,
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "subscription",
          success_url: `${input.origin}/account/subscriptions?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${input.origin}/account/subscriptions`,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            subscription_id: input.subscriptionId.toString(),
            billing_interval_days: input.billingIntervalDays.toString(),
          },
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("Stripe subscription checkout session creation error:", error);
        throw new Error("Failed to create subscription checkout session");
      }
    }),

  /**
   * Retrieve subscription checkout session details
   */
  getSubscriptionCheckoutSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
          expand: ["subscription", "line_items"],
        });

        // Verify that this session belongs to the current user
        if (session.client_reference_id !== ctx.user.id.toString()) {
          throw new Error("Unauthorized: Session does not belong to this user");
        }

        return {
          id: session.id,
          paymentStatus: session.payment_status,
          subscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
          amountTotal: session.amount_total,
          currency: session.currency,
          customerEmail: session.customer_email,
          lineItems: session.line_items?.data.map((item: any) => ({
            name: item.description,
            amount: item.amount_total,
            quantity: item.quantity,
          })) || [],
        };
      } catch (error) {
        console.error("Stripe subscription session retrieval error:", error);
        throw new Error("Failed to retrieve subscription checkout session");
      }
    }),

  /**
   * Get subscription details from Stripe
   */
  getStripeSubscription: protectedProcedure
    .input(z.object({ stripeSubscriptionId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const subscription = await stripe.subscriptions.retrieve(input.stripeSubscriptionId);

        return {
          id: subscription.id,
          status: subscription.status,
          currentPeriodStart: (subscription as any).current_period_start,
          currentPeriodEnd: (subscription as any).current_period_end,
          nextBillingDate: (subscription as any).current_period_end,
          items: subscription.items.data.map((item) => ({
            id: item.id,
            priceId: item.price.id,
            quantity: item.quantity,
          })),
        };
      } catch (error) {
        console.error("Stripe subscription retrieval error:", error);
        throw new Error("Failed to retrieve subscription");
      }
    }),

  /**
   * Update subscription billing interval
   */
  updateSubscriptionBillingInterval: protectedProcedure
    .input(
      z.object({
        stripeSubscriptionId: z.string(),
        subscriptionId: z.number(),
        billingIntervalDays: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get current subscription
        const subscription = await stripe.subscriptions.retrieve(input.stripeSubscriptionId);

        if (!subscription) {
          throw new Error("Stripe subscription not found");
        }

        // For now, we'll just update the local database
        // Stripe subscriptions with custom intervals need to be recreated
        // This is a limitation of Stripe's API

        // Update local database
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + input.billingIntervalDays);

        await updateSubscription(input.subscriptionId, ctx.user.id, {
          billingIntervalDays: input.billingIntervalDays,
          nextBillingDate,
        });

        // Note: To change the billing interval in Stripe, the subscription needs to be cancelled
        // and a new one created. This is handled by the frontend by cancelling and creating a new subscription.

        // Add history entry
        await addSubscriptionHistory({
          subscriptionId: input.subscriptionId,
          eventType: "modified",
          description: `Abonnement-Intervall auf alle ${input.billingIntervalDays} Tage geändert`,
        });

        return { success: true };
      } catch (error) {
        console.error("Stripe subscription update error:", error);
        throw new Error("Failed to update subscription billing interval");
      }
    }),

  /**
   * Pause a subscription
   */
  pauseSubscription: protectedProcedure
    .input(
      z.object({
        stripeSubscriptionId: z.string(),
        subscriptionId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await stripe.subscriptions.update(input.stripeSubscriptionId, {
          pause_collection: {
            behavior: "void",
          },
        });

        // Update local database
        await updateSubscription(input.subscriptionId, ctx.user.id, {
          status: "paused",
        });

        // Add history entry
        await addSubscriptionHistory({
          subscriptionId: input.subscriptionId,
          eventType: "paused",
          description: "Abonnement pausiert",
        });

        return { success: true };
      } catch (error) {
        console.error("Stripe subscription pause error:", error);
        throw new Error("Failed to pause subscription");
      }
    }),

  /**
   * Resume a paused subscription
   */
  resumeSubscription: protectedProcedure
    .input(
      z.object({
        stripeSubscriptionId: z.string(),
        subscriptionId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await stripe.subscriptions.update(input.stripeSubscriptionId, {
          pause_collection: null as any,
        });

        // Update local database
        await updateSubscription(input.subscriptionId, ctx.user.id, {
          status: "active",
        });

        // Add history entry
        await addSubscriptionHistory({
          subscriptionId: input.subscriptionId,
          eventType: "resumed",
          description: "Abonnement fortgesetzt",
        });

        return { success: true };
      } catch (error) {
        console.error("Stripe subscription resume error:", error);
        throw new Error("Failed to resume subscription");
      }
    }),

  /**
   * Cancel a subscription
   */
  cancelSubscription: protectedProcedure
    .input(
      z.object({
        stripeSubscriptionId: z.string(),
        subscriptionId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await stripe.subscriptions.cancel(input.stripeSubscriptionId);

        // Update local database
        await updateSubscription(input.subscriptionId, ctx.user.id, {
          status: "cancelled",
        });

        // Add history entry
        await addSubscriptionHistory({
          subscriptionId: input.subscriptionId,
          eventType: "cancelled",
          description: "Abonnement gekündigt",
        });

        return { success: true };
      } catch (error) {
        console.error("Stripe subscription cancellation error:", error);
        throw new Error("Failed to cancel subscription");
      }
    }),
});
