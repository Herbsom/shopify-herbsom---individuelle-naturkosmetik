import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, orders, orderItems, InsertOrder, InsertOrderItem, reviews, Review, InsertReview, subscriptions, subscriptionItems, subscriptionHistory, subscriptionOrders, Subscription, InsertSubscription, InsertSubscriptionItem, InsertSubscriptionHistory, SubscriptionOrder, InsertSubscriptionOrder } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Order Queries ─────────────────────────────────────────────────────────

export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  return userOrders;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

export async function getOrderWithItems(orderId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order || order.userId !== userId) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}

export async function createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(orders).values(order).$returningId();
  const orderId = result.id;

  if (items.length > 0) {
    await db.insert(orderItems).values(
      items.map((item) => ({ ...item, orderId }))
    );
  }

  return orderId;
}

// ─── Review Queries ───────────────────────────────────────────────────────

export async function getReviewsByProductId(productId: string, status: 'approved' | 'all' = 'approved') {
  const db = await getDb();
  if (!db) return [];

  if (status === 'approved') {
    return db.select().from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved'))).orderBy(desc(reviews.createdAt));
  }
  
  return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
}

export async function getTopApprovedReviews(limit = 3) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(reviews)
    .where(eq(reviews.status, "approved"))
    .orderBy(desc(reviews.helpfulCount), desc(reviews.createdAt))
    .limit(limit);
}

export async function getReviewById(reviewId: number) {
  const db = await getDb();
  if (!db) return null;

  const [review] = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
  return review || null;
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(reviews).values(review).$returningId();
  return result.id;
}

export async function updateReviewStatus(reviewId: number, status: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(reviews).set({ status }).where(eq(reviews.id, reviewId));
}

export async function updateReviewHelpful(reviewId: number, helpful: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const review = await getReviewById(reviewId);
  if (!review) throw new Error("Review not found");

  if (helpful) {
    await db.update(reviews).set({ helpfulCount: review.helpfulCount + 1 }).where(eq(reviews.id, reviewId));
  } else {
    await db.update(reviews).set({ unhelpfulCount: review.unhelpfulCount + 1 }).where(eq(reviews.id, reviewId));
  }
}

export async function getPendingReviews() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(reviews).where(eq(reviews.status, 'pending')).orderBy(desc(reviews.createdAt));
}

// ─── Subscription Queries ──────────────────────────────────────────────────

export async function getSubscriptionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));
}

export async function getSubscriptionById(subscriptionId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.userId, userId)))
    .limit(1);

  return subscription || null;
}

export async function getSubscriptionItems(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptionItems)
    .where(eq(subscriptionItems.subscriptionId, subscriptionId));
}

export async function getSubscriptionWithItems(subscriptionId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const subscription = await getSubscriptionById(subscriptionId, userId);
  if (!subscription) return null;

  const items = await getSubscriptionItems(subscriptionId);
  return { ...subscription, items };
}

export async function createSubscription(subscription: InsertSubscription, items: Omit<InsertSubscriptionItem, 'subscriptionId'>[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(subscriptions).values(subscription).$returningId();
  const subscriptionId = result.id;

  if (items.length > 0) {
    await db.insert(subscriptionItems).values(
      items.map((item) => ({ ...item, subscriptionId }))
    );
  }

  return subscriptionId;
}

export async function updateSubscription(subscriptionId: number, userId: number, updates: Partial<Subscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = await getSubscriptionById(subscriptionId, userId);
  if (!subscription) throw new Error("Subscription not found");

  await db.update(subscriptions).set(updates).where(eq(subscriptions.id, subscriptionId));
}

export async function updateSubscriptionItems(subscriptionId: number, items: Omit<InsertSubscriptionItem, 'subscriptionId'>[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete existing items
  await db.delete(subscriptionItems).where(eq(subscriptionItems.subscriptionId, subscriptionId));

  // Insert new items
  if (items.length > 0) {
    await db.insert(subscriptionItems).values(
      items.map((item) => ({ ...item, subscriptionId }))
    );
  }
}

export async function addSubscriptionHistory(history: InsertSubscriptionHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(subscriptionHistory).values(history).$returningId();
  return result.id;
}

export async function getSubscriptionHistory(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptionHistory)
    .where(eq(subscriptionHistory.subscriptionId, subscriptionId))
    .orderBy(desc(subscriptionHistory.createdAt));
}


/**
 * Subscription Orders – Track Shopify orders created from subscription billings
 */

export async function createSubscriptionOrder(order: InsertSubscriptionOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(subscriptionOrders).values(order).$returningId();
  return result.id;
}

export async function getSubscriptionOrdersBySubscriptionId(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptionOrders)
    .where(eq(subscriptionOrders.subscriptionId, subscriptionId))
    .orderBy(desc(subscriptionOrders.createdAt));
}

export async function getSubscriptionOrderByStripeInvoiceId(stripeInvoiceId: string) {
  const db = await getDb();
  if (!db) return null;

  const [result] = await db
    .select()
    .from(subscriptionOrders)
    .where(eq(subscriptionOrders.stripeInvoiceId, stripeInvoiceId));

  return result || null;
}

export async function updateSubscriptionOrder(
  subscriptionOrderId: number,
  updates: Partial<SubscriptionOrder>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptionOrders)
    .set(updates)
    .where(eq(subscriptionOrders.id, subscriptionOrderId));
}
