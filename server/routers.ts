import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { accountRouter } from "./routers/account";
import { stripeRouter } from "./routers/stripe";
import { discountsRouter } from "./routers/discounts";
import { reviewsRouter } from "./routers/reviews";
import { importRouter } from "./routers/import";
import { subscriptionsRouter } from "./routers/subscriptions";
import { stripeSubscriptionsRouter } from "./routers/stripe-subscriptions";
import { shopifyProductsRouter } from "./routers/shopify-products";
import { translationRouter } from "./routers/translation";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  account: accountRouter,
  stripe: stripeRouter,
  discounts: discountsRouter,
  reviews: reviewsRouter,
  import: importRouter,
  subscriptions: subscriptionsRouter,
  stripeSubscriptions: stripeSubscriptionsRouter,
  shopifyProducts: shopifyProductsRouter,
  translation: translationRouter,
});

export type AppRouter = typeof appRouter;
