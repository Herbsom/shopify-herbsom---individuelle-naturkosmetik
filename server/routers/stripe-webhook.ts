import express from "express";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { orders, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { createShopifyOrderFromSubscription } from "../_core/shopify-subscriptions";
import { addSubscriptionHistory } from "../db";
import { notifyOwner } from "../_core/notification";

const stripe = new Stripe(ENV.stripeSecretKey);
const webhookSecret = ENV.stripeWebhookSecret;

/**
 * Stripe Webhook Handler
 * Processes Stripe events and updates order status accordingly
 * 
 * Events handled:
 * - checkout.session.completed: Order payment successful
 * - payment_intent.succeeded: Payment confirmed
 * - invoice.paid: Subscription billing completed (creates Shopify order)
 * - customer.subscription.created: New subscription created
 * - customer.subscription.deleted: Subscription cancelled
 * - charge.refunded: Order refunded
 * - charge.dispute.created: Order disputed
 * 
 * Note: This endpoint expects Stripe webhook to be configured in Stripe Dashboard
 * pointing to: https://your-domain.com/api/stripe/webhook
 */
export async function registerStripeWebhook(app: express.Express) {
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    if (!sig) {
      console.error("Stripe webhook: Missing signature");
      return res.status(400).send("Missing signature");
    }

    let event: Stripe.Event;

    // Handle test events (from Stripe Dashboard test mode)
    // Test events start with 'evt_test_' and bypass signature verification
    const rawBody = req.body.toString();
    let parsedBody: any;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = {};
    }
    
    if (parsedBody?.id?.startsWith('evt_test_')) {
      console.log("[Webhook] Test event detected, returning verification response");
      return res.json({ verified: true });
    }

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err: any) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      const db = await getDb();
      if (!db) {
        console.warn("[Stripe Webhook] Database not available");
        return res.status(500).send("Database unavailable");
      }

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          
          // Update order status to confirmed (payment received)
          const userId = parseInt(session.client_reference_id || "0");
          if (userId && session.id) {
            await db
              .update(orders)
              .set({ status: "confirmed" })
              .where(eq(orders.userId, userId));
            
            console.log(`[Stripe Webhook] Order payment confirmed for session ${session.id}, user ${userId}`);
            
            // Notify owner of new order
            const amountEuros = session.amount_total ? (session.amount_total / 100).toFixed(2) : "?";
            await notifyOwner({
              title: `Neue Bestellung eingegangen – €${amountEuros}`,
              content: `Eine neue Bestellung wurde erfolgreich bezahlt.\n\nSession ID: ${session.id}\nBetrag: €${amountEuros}\nKunde (User ID): ${userId}\nZahlungsstatus: ${session.payment_status}`,
            }).catch(err => console.warn("[Stripe Webhook] Owner notification failed:", err));
          }
          break;
        }

        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`[Stripe Webhook] Payment intent succeeded: ${paymentIntent.id}`);
          
          // Notify owner of successful payment
          const amountEuros = (paymentIntent.amount / 100).toFixed(2);
          await notifyOwner({
            title: `Zahlung erfolgreich – €${amountEuros}`,
            content: `Eine Zahlung wurde erfolgreich verarbeitet.\n\nPayment Intent ID: ${paymentIntent.id}\nBetrag: €${amountEuros}\nWährung: ${paymentIntent.currency.toUpperCase()}\nBeschreibung: ${paymentIntent.description || "Herbsom Bestellung"}`,
          }).catch(err => console.warn("[Stripe Webhook] Owner notification failed:", err));
          break;
        }

        case "charge.refunded": {
          const charge = event.data.object as Stripe.Charge;
          
          if (charge.payment_intent) {
            const paymentIntentId = typeof charge.payment_intent === "string" 
              ? charge.payment_intent 
              : charge.payment_intent.id;
            
            console.log(`[Stripe Webhook] Charge refunded for payment intent ${paymentIntentId}`);
            
            // Notify owner of refund
            const refundAmountEuros = charge.amount_refunded ? (charge.amount_refunded / 100).toFixed(2) : "?";
            await notifyOwner({
              title: `Rückerstattung verarbeitet – €${refundAmountEuros}`,
              content: `Eine Rückerstattung wurde verarbeitet.\n\nPayment Intent ID: ${paymentIntentId}\nRückerstatteter Betrag: €${refundAmountEuros}\nGrund: ${charge.refunds?.data?.[0]?.reason || "Nicht angegeben"}`,
            }).catch(err => console.warn("[Stripe Webhook] Owner notification failed:", err));
          }
          break;
        }

        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;
          
          if ((invoice as any).subscription) {
            const stripeSubscriptionId = (invoice as any).subscription;
            const stripeInvoiceId = invoice.id;
            
            console.log(`[Stripe Webhook] Invoice paid for subscription ${stripeSubscriptionId}`);
            
            try {
              // Find the subscription in our database
              const [subscription] = await db
                .select()
                .from(subscriptions)
                .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
                .limit(1);
              
              if (!subscription) {
                console.warn(`[Stripe Webhook] Subscription not found for Stripe ID ${stripeSubscriptionId}`);
                break;
              }
              
              // Create Shopify order from subscription
              const result = await createShopifyOrderFromSubscription(
                subscription.id,
                subscription.userId,
                stripeInvoiceId
              );
              
              // Record billing event in subscription history
              await addSubscriptionHistory({
                subscriptionId: subscription.id,
                eventType: "billed",
                amountCents: subscription.totalCents,
                stripeInvoiceId,
                description: result.success
                  ? `Shopify order created: ${result.shopifyOrderId}`
                  : `Order creation failed: ${result.error}`,
              });
              
              // Update next billing date
              const nextBillingDate = new Date();
              nextBillingDate.setDate(nextBillingDate.getDate() + subscription.billingIntervalDays);
              
              await db
                .update(subscriptions)
                .set({
                  lastBillingDate: new Date(),
                  nextBillingDate,
                })
                .where(eq(subscriptions.id, subscription.id));
              
              // Notify owner of subscription billing
              const billingAmountEuros = (subscription.totalCents / 100).toFixed(2);
              const intervalLabel = subscription.billingIntervalDays === 30 ? "monatlich" 
                : subscription.billingIntervalDays === 60 ? "alle 2 Monate"
                : `alle ${subscription.billingIntervalDays} Tage`;
              
              await notifyOwner({
                title: `Abo-Abrechnung erfolgreich – €${billingAmountEuros}`,
                content: `Ein Abonnement wurde erfolgreich abgerechnet.\n\nAbo-ID: ${subscription.id}\nBetrag: €${billingAmountEuros}\nIntervall: ${intervalLabel}\nNächste Abrechnung: ${nextBillingDate.toLocaleDateString("de-DE")}\nShopify-Bestellung: ${result.success ? result.shopifyOrderId : "Fehlgeschlagen – " + result.error}`,
              }).catch(err => console.warn("[Stripe Webhook] Owner notification failed:", err));
              
              if (result.success) {
                console.log(`[Stripe Webhook] Successfully processed subscription billing for subscription ${subscription.id}`);
              } else {
                console.error(`[Stripe Webhook] Failed to create Shopify order: ${result.error}`);
              }
            } catch (err: any) {
              console.error(`[Stripe Webhook] Error processing subscription billing:`, err.message);
            }
          }
          break;
        }

        case "customer.subscription.created": {
          const stripeSubscription = event.data.object as Stripe.Subscription;
          console.log(`[Stripe Webhook] New subscription created: ${stripeSubscription.id}`);
          
          // Notify owner of new subscription
          const amountEuros = stripeSubscription.items.data[0]?.price?.unit_amount 
            ? (stripeSubscription.items.data[0].price.unit_amount / 100).toFixed(2)
            : "?";
          
          await notifyOwner({
            title: `Neues Abonnement erstellt`,
            content: `Ein neues Abonnement wurde erstellt.\n\nStripe Abo-ID: ${stripeSubscription.id}\nStatus: ${stripeSubscription.status}\nBetrag: €${amountEuros}\nKunde: ${stripeSubscription.customer}`,
          }).catch(err => console.warn("[Stripe Webhook] Owner notification failed:", err));
          break;
        }

        case "customer.subscription.deleted": {
          const stripeSubscription = event.data.object as Stripe.Subscription;
          console.log(`[Stripe Webhook] Subscription cancelled: ${stripeSubscription.id}`);
          
          // Update subscription status in database
          try {
            await db
              .update(subscriptions)
              .set({ status: "cancelled" })
              .where(eq(subscriptions.stripeSubscriptionId, stripeSubscription.id));
            
            // Notify owner of cancellation
            await notifyOwner({
              title: `Abonnement gekündigt`,
              content: `Ein Abonnement wurde gekündigt.\n\nStripe Abo-ID: ${stripeSubscription.id}\nKunde: ${stripeSubscription.customer}\nGekündigt am: ${new Date().toLocaleDateString("de-DE")}`,
            }).catch(err => console.warn("[Stripe Webhook] Owner notification failed:", err));
          } catch (err: any) {
            console.error(`[Stripe Webhook] Error updating cancelled subscription:`, err.message);
          }
          break;
        }

        case "charge.dispute.created": {
          const dispute = event.data.object as Stripe.Dispute;
          console.warn(`[Stripe Webhook] Charge dispute created: ${dispute.id}`);
          
          // Notify owner of dispute
          const disputeAmountEuros = (dispute.amount / 100).toFixed(2);
          await notifyOwner({
            title: `⚠️ Zahlungsstreit eingereicht – €${disputeAmountEuros}`,
            content: `Ein Zahlungsstreit wurde eingereicht. Bitte sofort handeln!\n\nDispute ID: ${dispute.id}\nBetrag: €${disputeAmountEuros}\nGrund: ${dispute.reason}\nStatus: ${dispute.status}\nFrist: ${dispute.evidence_details?.due_by ? new Date(dispute.evidence_details.due_by * 1000).toLocaleDateString("de-DE") : "Unbekannt"}`,
          }).catch(err => console.warn("[Stripe Webhook] Owner notification failed:", err));
          break;
        }

        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("[Stripe Webhook] Processing error:", err);
      res.status(500).send("Webhook processing error");
    }
  });
}
