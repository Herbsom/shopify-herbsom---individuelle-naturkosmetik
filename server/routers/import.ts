import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { reviews as reviewsTable } from "../../drizzle/schema";

export const importRouter = router({
  importReviews: publicProcedure
    .input(
      z.object({
        reviews: z.array(
          z.object({
            productId: z.string(),
            rating: z.number().min(1).max(5),
            title: z.string(),
            text: z.string(),
            authorName: z.string(),
            authorEmail: z.string(),
            createdAt: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      let imported = 0;
      let failed = 0;

      for (const review of input.reviews) {
        try {
          await db.insert(reviewsTable).values({
            userId: 0,  // Placeholder for imported reviews
            productId: review.productId,
            rating: review.rating,
            title: review.title,
            content: review.text,
            status: "approved",
            createdAt: new Date(review.createdAt),
            helpfulCount: 0,
            unhelpfulCount: 0,
          });
          imported++;
        } catch (error) {
          console.error("Error importing review:", error);
          failed++;
        }
      }

      return {
        imported,
        failed,
        total: input.reviews.length,
      };
    }),
});
