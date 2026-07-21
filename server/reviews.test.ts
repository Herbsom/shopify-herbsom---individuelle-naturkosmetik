import { describe, it, expect, beforeEach, vi } from "vitest";
import { z } from "zod";

// Mock database functions
const mockReviews: any[] = [];

const getReviewsByProductId = async (productId: string, status: 'approved' | 'all' = 'approved') => {
  return mockReviews.filter(r => r.productId === productId && (status === 'all' || r.status === status));
};

const createReview = async (review: any) => {
  const id = mockReviews.length + 1;
  mockReviews.push({ ...review, id });
  return id;
};

const updateReviewStatus = async (reviewId: number, status: string) => {
  const review = mockReviews.find(r => r.id === reviewId);
  if (review) review.status = status;
};

const getPendingReviews = async () => {
  return mockReviews.filter(r => r.status === 'pending');
};

describe("Review System", () => {
  beforeEach(() => {
    mockReviews.length = 0;
  });

  it("should create a new review", async () => {
    const reviewId = await createReview({
      userId: 1,
      productId: "cleaner-gel",
      rating: 5,
      title: "Great product!",
      content: "This product is amazing",
      status: "pending",
      helpfulCount: 0,
      unhelpfulCount: 0,
    });

    expect(reviewId).toBe(1);
    expect(mockReviews).toHaveLength(1);
    expect(mockReviews[0].rating).toBe(5);
  });

  it("should get reviews by product id", async () => {
    await createReview({
      userId: 1,
      productId: "cleaner-gel",
      rating: 5,
      title: "Great",
      content: "Amazing",
      status: "approved",
      helpfulCount: 0,
      unhelpfulCount: 0,
    });

    await createReview({
      userId: 2,
      productId: "peeling",
      rating: 4,
      title: "Good",
      content: "Nice product",
      status: "approved",
      helpfulCount: 0,
      unhelpfulCount: 0,
    });

    const cleanerReviews = await getReviewsByProductId("cleaner-gel");
    expect(cleanerReviews).toHaveLength(1);
    expect(cleanerReviews[0].productId).toBe("cleaner-gel");
  });

  it("should only return approved reviews by default", async () => {
    await createReview({
      userId: 1,
      productId: "cleaner-gel",
      rating: 5,
      title: "Great",
      content: "Amazing",
      status: "approved",
      helpfulCount: 0,
      unhelpfulCount: 0,
    });

    await createReview({
      userId: 2,
      productId: "cleaner-gel",
      rating: 3,
      title: "Okay",
      content: "Not bad",
      status: "pending",
      helpfulCount: 0,
      unhelpfulCount: 0,
    });

    const reviews = await getReviewsByProductId("cleaner-gel", "approved");
    expect(reviews).toHaveLength(1);
    expect(reviews[0].status).toBe("approved");
  });

  it("should get pending reviews for moderation", async () => {
    await createReview({
      userId: 1,
      productId: "cleaner-gel",
      rating: 5,
      title: "Great",
      content: "Amazing",
      status: "pending",
      helpfulCount: 0,
      unhelpfulCount: 0,
    });

    await createReview({
      userId: 2,
      productId: "peeling",
      rating: 4,
      title: "Good",
      content: "Nice",
      status: "approved",
      helpfulCount: 0,
      unhelpfulCount: 0,
    });

    const pending = await getPendingReviews();
    expect(pending).toHaveLength(1);
    expect(pending[0].status).toBe("pending");
  });

  it("should update review status", async () => {
    const reviewId = await createReview({
      userId: 1,
      productId: "cleaner-gel",
      rating: 5,
      title: "Great",
      content: "Amazing",
      status: "pending",
      helpfulCount: 0,
      unhelpfulCount: 0,
    });

    await updateReviewStatus(reviewId, "approved");
    expect(mockReviews[0].status).toBe("approved");
  });

  it("should validate review input", () => {
    const reviewSchema = z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      title: z.string().min(5).max(255),
      content: z.string().min(10).max(5000),
    });

    const validReview = {
      productId: "cleaner-gel",
      rating: 5,
      title: "Great product!",
      content: "This is an amazing product that I really love",
    };

    expect(() => reviewSchema.parse(validReview)).not.toThrow();

    const invalidReview = {
      productId: "cleaner-gel",
      rating: 6, // Invalid: > 5
      title: "Great",
      content: "Short",
    };

    expect(() => reviewSchema.parse(invalidReview)).toThrow();
  });
});
