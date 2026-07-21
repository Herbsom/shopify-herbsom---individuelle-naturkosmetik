/**
 * Shopify Subscriptions Integration
 * Handles creation of Shopify orders from subscription billings
 */

import { ENV } from "./env";
import { getSubscriptionById, getSubscriptionItems, createSubscriptionOrder, getSubscriptionOrderByStripeInvoiceId } from "../db";
import { getShopifyVariantId } from "./product-mapping";
import { Subscription } from "../../drizzle/schema";

const SHOPIFY_GRAPHQL_URL = `https://${ENV.shopifyStoreDomain}/admin/api/2024-01/graphql.json`;
const SHOPIFY_ACCESS_TOKEN = ENV.shopifyStorefrontAccessToken;

interface ShopifyOrderInput {
  lineItems: Array<{
    variantId: string;
    quantity: number;
  }>;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
}

/**
 * Parse shipping address from subscription data
 */
function parseShippingAddress(
  subscription: Subscription
): ShopifyOrderInput["shippingAddress"] | null {
  if (!subscription.shippingAddress) {
    return null;
  }

  try {
    const address = typeof subscription.shippingAddress === "string"
      ? JSON.parse(subscription.shippingAddress as string)
      : subscription.shippingAddress;

    // Map internal address format to Shopify format
    return {
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      address1: address.street || address.address1 || "",
      address2: address.streetNumber || address.address2 || "",
      city: address.city || "",
      province: address.state || address.province || "",
      zip: address.postalCode || address.zip || "",
      country: address.country || "DE",
    };
  } catch (error) {
    console.warn("[Shopify] Failed to parse shipping address:", error);
    return null;
  }
}

/**
 * Create a Shopify order from a subscription billing
 */
export async function createShopifyOrderFromSubscription(
  subscriptionId: number,
  userId: number,
  stripeInvoiceId: string
): Promise<{ success: boolean; shopifyOrderId?: string; error?: string }> {
  try {
    // Check if order already exists for this invoice (idempotency)
    const existingOrder = await getSubscriptionOrderByStripeInvoiceId(stripeInvoiceId);
    if (existingOrder) {
      console.log(`[Shopify] Order already created for invoice ${stripeInvoiceId}`);
      return { success: true, shopifyOrderId: existingOrder.shopifyOrderId };
    }

    // Get subscription details
    const subscription = await getSubscriptionById(subscriptionId, userId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    // Get subscription items
    const items = await getSubscriptionItems(subscriptionId);
    if (!items || items.length === 0) {
      throw new Error(`No items found for subscription ${subscriptionId}`);
    }

    // Map subscription items to Shopify variant IDs
    const lineItems = items.map((item) => ({
      variantId: getShopifyVariantId(item.productId),
      quantity: item.quantity,
    }));

    // Parse shipping address from subscription
    const shippingAddress = parseShippingAddress(subscription);
    const orderInput: ShopifyOrderInput = {
      lineItems,
      ...(shippingAddress && { shippingAddress }),
    };

    // Create order in Shopify via GraphQL
    const shopifyOrderId = await createShopifyOrder(orderInput);

    // Save order record in our database
    const subscriptionOrderId = await createSubscriptionOrder({
      subscriptionId,
      shopifyOrderId,
      stripeInvoiceId,
      status: "created",
      totalCents: subscription.totalCents,
    });

    console.log(
      `[Shopify] Order created successfully: subscription=${subscriptionId}, shopify_order=${shopifyOrderId}, db_id=${subscriptionOrderId}`
    );

    return { success: true, shopifyOrderId };
  } catch (error: any) {
    console.error(`[Shopify] Failed to create order for subscription ${subscriptionId}:`, error.message);

    // Save error record
    try {
      await createSubscriptionOrder({
        subscriptionId,
        shopifyOrderId: "error",
        stripeInvoiceId,
        status: "failed",
        totalCents: 0,
        errorMessage: error.message,
      });
    } catch (dbError) {
      console.error("[Shopify] Failed to save error record:", dbError);
    }

    return { success: false, error: error.message };
  }
}

/**
 * Create a Shopify order via GraphQL API
 */
async function createShopifyOrder(orderInput: ShopifyOrderInput): Promise<string> {
  const mutation = `
    mutation createOrder($input: OrderInput!) {
      orderCreate(input: $input) {
        order {
          id
          name
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { input: orderInput },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  const orderData = data.data?.orderCreate;
  if (!orderData) {
    throw new Error("No order data in Shopify response");
  }

  if (orderData.userErrors && orderData.userErrors.length > 0) {
    throw new Error(`Shopify user error: ${JSON.stringify(orderData.userErrors)}`);
  }

  if (!orderData.order?.id) {
    throw new Error("No order ID in Shopify response");
  }

  return orderData.order.id;
}
