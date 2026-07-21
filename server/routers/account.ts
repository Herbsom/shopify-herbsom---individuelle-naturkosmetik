import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getOrdersByUserId, getOrderWithItems, getOrderItems, createOrder } from "../db";

export const accountRouter = router({
  /** Get all orders for the current user */
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const userOrders = await getOrdersByUserId(ctx.user.id);

    // For each order, fetch its items
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await getOrderItems(order.id);
        return { ...order, items };
      })
    );

    return ordersWithItems;
  }),

  /** Get a single order with its items */
  getOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await getOrderWithItems(input.orderId, ctx.user.id);
      if (!order) {
        throw new Error("Bestellung nicht gefunden");
      }
      return order;
    }),

  /** Re-order: create a new order with the same items as an existing order */
  reorder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const originalOrder = await getOrderWithItems(input.orderId, ctx.user.id);
      if (!originalOrder) {
        throw new Error("Originalbestellung nicht gefunden");
      }

      // Calculate total from items
      const totalCents = originalOrder.items.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      );

      const newOrderId = await createOrder(
        {
          userId: ctx.user.id,
          status: "pending",
          totalCents,
        },
        originalOrder.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          priceCents: item.priceCents,
          quantity: item.quantity,
        }))
      );

      return { orderId: newOrderId, success: true };
    }),

  /** Place a new order from cart items */
  placeOrder: protectedProcedure
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
        shippingAddress: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const totalCents = input.items.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      );

      const orderId = await createOrder(
        {
          userId: ctx.user.id,
          status: "pending",
          totalCents,
          shippingAddress: input.shippingAddress || null,
        },
        input.items
      );

      return { orderId, success: true };
    }),
});
