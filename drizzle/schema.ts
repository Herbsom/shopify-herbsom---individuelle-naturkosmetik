import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Orders table – stores completed orders for each user.
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Order status: pending, confirmed, shipped, delivered, cancelled */
  status: mysqlEnum("status", ["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  /** Total price in EUR (cents) */
  totalCents: int("totalCents").notNull(),
  /** Shipping address as JSON */
  shippingAddress: json("shippingAddress"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items – individual line items within an order.
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  /** Product identifier (matches CartItem.id) */
  productId: varchar("productId", { length: 128 }).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  /** Price per unit in EUR (cents) */
  priceCents: int("priceCents").notNull(),
  quantity: int("quantity").notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Product Reviews – stores customer reviews for products.
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Product identifier (matches CartItem.id) */
  productId: varchar("productId", { length: 128 }).notNull(),
  /** Rating from 1 to 5 */
  rating: int("rating").notNull(),
  /** Review title */
  title: varchar("title", { length: 255 }).notNull(),
  /** Review text content */
  content: text("content").notNull(),
  /** Review status: pending, approved, rejected */
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  /** Number of helpful votes */
  helpfulCount: int("helpfulCount").default(0).notNull(),
  /** Number of unhelpful votes */
  unhelpfulCount: int("unhelpfulCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Subscriptions table – stores active and inactive subscriptions for users.
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Stripe subscription ID for recurring charges */
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).unique(),
  /** Subscription status: active, paused, cancelled */
  status: mysqlEnum("status", ["active", "paused", "cancelled"]).default("active").notNull(),
  /** Billing interval in days (30 for monthly, 60 for every 2 months, etc.) */
  billingIntervalDays: int("billingIntervalDays").notNull(),
  /** Total price in EUR (cents) for the subscription */
  totalCents: int("totalCents").notNull(),
  /** Next billing date */
  nextBillingDate: timestamp("nextBillingDate").notNull(),
  /** Last billing date */
  lastBillingDate: timestamp("lastBillingDate"),
  /** Shipping address as JSON */
  shippingAddress: json("shippingAddress"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Subscription items – individual line items within a subscription.
 */
export const subscriptionItems = mysqlTable("subscriptionItems", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId").notNull(),
  /** Product identifier (matches CartItem.id) */
  productId: varchar("productId", { length: 128 }).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  /** Price per unit in EUR (cents) */
  priceCents: int("priceCents").notNull(),
  quantity: int("quantity").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionItem = typeof subscriptionItems.$inferSelect;
export type InsertSubscriptionItem = typeof subscriptionItems.$inferInsert;

/**
 * Subscription history – tracks all billing events for subscriptions.
 */
export const subscriptionHistory = mysqlTable("subscriptionHistory", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId").notNull(),
  /** Event type: created, billed, paused, resumed, cancelled, modified */
  eventType: mysqlEnum("eventType", ["created", "billed", "paused", "resumed", "cancelled", "modified"]).notNull(),
  /** Amount charged in EUR (cents) */
  amountCents: int("amountCents"),
  /** Stripe invoice ID if applicable */
  stripeInvoiceId: varchar("stripeInvoiceId", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubscriptionHistory = typeof subscriptionHistory.$inferSelect;
export type InsertSubscriptionHistory = typeof subscriptionHistory.$inferInsert;

/**
 * Subscription orders – tracks Shopify orders created from subscription billings.
 */
export const subscriptionOrders = mysqlTable("subscriptionOrders", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId").notNull(),
  /** Shopify order ID */
  shopifyOrderId: varchar("shopifyOrderId", { length: 255 }).notNull(),
  /** Stripe invoice ID that triggered this order */
  stripeInvoiceId: varchar("stripeInvoiceId", { length: 255 }),
  /** Order status: pending, created, failed, cancelled */
  status: mysqlEnum("status", ["pending", "created", "failed", "cancelled"]).default("pending").notNull(),
  /** Total price in EUR (cents) */
  totalCents: int("totalCents").notNull(),
  /** Error message if order creation failed */
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionOrder = typeof subscriptionOrders.$inferSelect;
export type InsertSubscriptionOrder = typeof subscriptionOrders.$inferInsert;
