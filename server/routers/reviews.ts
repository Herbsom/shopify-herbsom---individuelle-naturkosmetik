import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getReviewsByProductId, getTopApprovedReviews, createReview, updateReviewStatus, updateReviewHelpful, getPendingReviews, getReviewById } from "../db";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = router({
  // Get all approved reviews for a product
  getByProductId: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      return getReviewsByProductId(input.productId, 'approved');
    }),

  // Get the most helpful approved reviews across products
  getTop: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(6).default(3) }))
    .query(async ({ input }) => getTopApprovedReviews(input.limit)),

  // Get average rating for a product
  getAverageRating: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      const reviews = await getReviewsByProductId(input.productId, 'approved');
      if (reviews.length === 0) return { average: 0, count: 0 };
      
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      return { average: sum / reviews.length, count: reviews.length };
    }),

  // Create a new review (protected)
  create: protectedProcedure
    .input(z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      title: z.string().min(5).max(255),
      content: z.string().min(10).max(5000),
    }))
    .mutation(async ({ input, ctx }) => {
      const reviewId = await createReview({
        userId: ctx.user.id,
        productId: input.productId,
        rating: input.rating,
        title: input.title,
        content: input.content,
        status: 'pending', // Reviews need moderation
      });

      return { id: reviewId, status: 'pending' };
    }),

  // Mark review as helpful
  markHelpful: publicProcedure
    .input(z.object({ reviewId: z.number(), helpful: z.boolean() }))
    .mutation(async ({ input }) => {
      const review = await getReviewById(input.reviewId);
      if (!review) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Review not found' });
      }

      await updateReviewHelpful(input.reviewId, input.helpful);
      return { success: true };
    }),

  // Get pending reviews (admin only)
  getPending: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view pending reviews' });
      }

      return getPendingReviews();
    }),

  // Approve or reject a review (admin only)
  updateStatus: protectedProcedure
    .input(z.object({ 
      reviewId: z.number(), 
      status: z.enum(['approved', 'rejected']) 
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can moderate reviews' });
      }

      const review = await getReviewById(input.reviewId);
      if (!review) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Review not found' });
      }

      await updateReviewStatus(input.reviewId, input.status);
      return { success: true };
    }),
});
