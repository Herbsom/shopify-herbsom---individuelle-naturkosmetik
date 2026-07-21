import { Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ProductRatingHeaderProps {
  productId: string;
  productName: string;
}

export default function ProductRatingHeader({
  productId,
  productName,
}: ProductRatingHeaderProps) {
  // Fetch average rating for this product
  const { data: ratingData, isLoading } = trpc.reviews.getAverageRating.useQuery(
    { productId },
    { staleTime: 1000 * 60 * 5 } // Cache for 5 minutes
  );

  const avgRating = ratingData?.average || 0;
  const reviewCount = ratingData?.count || 0;

  const handleClick = () => {
    // Scroll to reviews section
    const reviewsSection = document.getElementById("reviews-section");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={14}
            className={
              i <= Math.round(avgRating)
                ? "fill-[#5B5B38] text-[#5B5B38]"
                : "text-[#D0CCC4]"
            }
          />
        ))}
      </div>
      <span className="font-body text-xs text-[#6B6B69]">
        {isLoading ? (
          "Lädt..."
        ) : (
          <>
            {avgRating.toFixed(1)} • {reviewCount}{" "}
            {reviewCount === 1 ? "Bewertung" : "Bewertungen"}
          </>
        )}
      </span>
    </div>
  );
}
