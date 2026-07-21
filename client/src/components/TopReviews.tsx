import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ProductReview {
  productId: string;
  productName: string;
  avgRating: number;
  reviewCount: number;
  topReview?: {
    rating: number;
    title: string;
    content: string;
    author?: string;
  };
}

export default function TopReviews() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch reviews for all products - hooks called at top level
  const cleanerGelAvg = trpc.reviews.getAverageRating.useQuery({ productId: "cleaner-gel" });
  const cleanerGelReviews = trpc.reviews.getByProductId.useQuery({ productId: "cleaner-gel" });
  
  const cleanerMilkAvg = trpc.reviews.getAverageRating.useQuery({ productId: "cleaner-milk" });
  const cleanerMilkReviews = trpc.reviews.getByProductId.useQuery({ productId: "cleaner-milk" });
  
  const peelingAvg = trpc.reviews.getAverageRating.useQuery({ productId: "peeling-aha" });
  const peelingReviews = trpc.reviews.getByProductId.useQuery({ productId: "peeling-aha" });
  
  const sunscreenAvg = trpc.reviews.getAverageRating.useQuery({ productId: "sunscreen" });
  const sunscreenReviews = trpc.reviews.getByProductId.useQuery({ productId: "sunscreen" });
  
  const serumAvg = trpc.reviews.getAverageRating.useQuery({ productId: "serum" });
  const serumReviews = trpc.reviews.getByProductId.useQuery({ productId: "serum" });
  
  const cremeAvg = trpc.reviews.getAverageRating.useQuery({ productId: "creme" });
  const cremeReviews = trpc.reviews.getByProductId.useQuery({ productId: "creme" });

  useEffect(() => {
    try {
      const productReviews: ProductReview[] = [];

      // Helper function to process product reviews
      const processProduct = (
        productId: string,
        productName: string,
        avgData: any,
        reviewsData: any
      ) => {
        if (avgData && reviewsData && reviewsData.length > 0) {
          const topReview = reviewsData
            .sort((a: any, b: any) => b.rating - a.rating)
            .slice(0, 1)[0];

          if (topReview) {
            productReviews.push({
              productId,
              productName,
              avgRating: avgData.average || 0,
              reviewCount: avgData.count || 0,
              topReview: {
                rating: topReview.rating,
                title: topReview.title,
                content: topReview.content,
                author: "Kunde",
              },
            });
          }
        }
      };

      // Process each product
      processProduct("cleaner-gel", "Reinigungsgel", cleanerGelAvg.data, cleanerGelReviews.data);
      processProduct("cleaner-milk", "Reinigungsmilch", cleanerMilkAvg.data, cleanerMilkReviews.data);
      processProduct("peeling-aha", "AHA & PHA Peeling", peelingAvg.data, peelingReviews.data);
      processProduct("sunscreen", "Sonnenschutzfluid SPF 50+", sunscreenAvg.data, sunscreenReviews.data);
      processProduct("serum", "Individuelles Serum", serumAvg.data, serumReviews.data);
      processProduct("creme", "Individuelle Gesichtscreme", cremeAvg.data, cremeReviews.data);

      // Sort by average rating and take top 3
      const topThree = productReviews
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 3);

      setReviews(topThree);
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing reviews:", error);
      setIsLoading(false);
    }
  }, [
    cleanerGelAvg.data,
    cleanerGelReviews.data,
    cleanerMilkAvg.data,
    cleanerMilkReviews.data,
    peelingAvg.data,
    peelingReviews.data,
    sunscreenAvg.data,
    sunscreenReviews.data,
    serumAvg.data,
    serumReviews.data,
    cremeAvg.data,
    cremeReviews.data,
  ]);

  if (isLoading) {
    return (
      <section className="py-24 md:py-36 bg-[#F8F5F0]">
        <div className="container text-center text-[#6B6B69]">
          Bewertungen werden geladen...
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-36 bg-[#F8F5F0]">
      <div className="container">
        {/* Section Header */}
        <div className="mb-16 reveal">
          <p className="section-label text-[#5B5B38] mb-3">Kundenbewertungen</p>
          <h2 className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light leading-tight">
            Top Bewertungen<br />
            <em className="italic">von echten Kunden.</em>
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`bg-white p-8 rounded-lg border border-[#E5E0D8] hover:shadow-lg transition-shadow reveal reveal-delay-${i + 1}`}
            >
              {/* Product Name */}
              <p className="font-body text-xs tracking-[0.1em] uppercase text-[#5B5B38] mb-4 font-semibold">
                {review.productName}
              </p>

              {/* Stars */}
              {review.topReview && (
                <>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= review.topReview!.rating
                            ? "fill-[#5B5B38] text-[#5B5B38]"
                            : "text-[#D0CCC4]"
                        }
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg text-[#1C1C1A] font-light mb-3">
                    {review.topReview.title}
                  </h3>

                  {/* Content */}
                  <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-6 line-clamp-3">
                    {review.topReview.content}
                  </p>
                </>
              )}

              {/* Divider */}
              <div className="border-t border-[#E5E0D8] pt-6">
                <p className="font-body text-sm font-semibold text-[#1C1C1A] mb-1">
                  {review.topReview?.author || "Kunde"}
                </p>
                <p className="font-body text-xs text-[#7D7D5D]">
                  Durchschnittliche Bewertung: {review.avgRating.toFixed(1)} ({review.reviewCount} {review.reviewCount === 1 ? "Bewertung" : "Bewertungen"})
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center reveal">
          <p className="font-body text-sm text-[#6B6B69] mb-6">
            Möchtest du auch eine Bewertung hinterlassen?
          </p>
          <a
            href="/product/serum"
            className="inline-block border border-[#5B5B38] text-[#5B5B38] font-body text-xs tracking-[0.12em] uppercase px-8 py-3 hover:bg-[#5B5B38] hover:text-[#F8F5F0] transition-all duration-300"
          >
            Zu den Produkten
          </a>
        </div>
      </div>
    </section>
  );
}
