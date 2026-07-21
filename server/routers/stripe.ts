import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { ENV } from "../_core/env";

// Initialize Stripe
const stripe = new Stripe(ENV.stripeSecretKey);

export const stripeRouter = router({
  /**
   * Create a Stripe Checkout Session
   * This procedure handles the creation of a checkout session for the user's cart
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            productName: z.string(),
            priceInCents: z.number().min(50), // Stripe minimum is $0.50 USD
            quantity: z.number().min(1),
          })
        ),
        origin: z.string().url(), // Frontend origin for redirect URLs
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Build line items for Stripe
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
          },
          quantity: item.quantity,
        }));

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${input.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${input.origin}/cart`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("Stripe checkout session creation error:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Retrieve checkout session details
   * Used to verify payment status after redirect from Stripe
   */
  getCheckoutSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
          expand: ["payment_intent", "line_items"],
        });

        // Verify that this session belongs to the current user
        if (session.client_reference_id !== ctx.user.id.toString()) {
          throw new Error("Unauthorized: Session does not belong to this user");
        }

        return {
          id: session.id,
          paymentStatus: session.payment_status,
          paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
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
        console.error("Stripe session retrieval error:", error);
        throw new Error("Failed to retrieve checkout session");
      }
    }),

  /**
   * Get payment intent details
   * Used to check detailed payment status
   */
  getPaymentIntent: protectedProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(input.paymentIntentId);

        return {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error) {
        console.error("Stripe payment intent retrieval error:", error);
        throw new Error("Failed to retrieve payment intent");
      }
    }),
});
