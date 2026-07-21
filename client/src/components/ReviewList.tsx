import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Review {
  id: number;
  rating: number;
  title: string;
  content: string;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
}

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'highest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 8;
  
  const { data: reviews = [], isLoading } = trpc.reviews.getByProductId.useQuery({ productId });
  const { data: avgRating } = trpc.reviews.getAverageRating.useQuery({ productId });
  const markHelpful = trpc.reviews.markHelpful.useMutation();

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'helpful') {
      const aScore = a.helpfulCount - a.unhelpfulCount;
      const bScore = b.helpfulCount - b.unhelpfulCount;
      return bScore - aScore;
    } else {
      return b.rating - a.rating;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

  // Reset to page 1 when sort changes
  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleHelpful = async (reviewId: number, helpful: boolean) => {
    try {
      await markHelpful.mutateAsync({ reviewId, helpful });
      toast.success(helpful ? "Danke für dein Feedback!" : "Danke für dein Feedback!");
    } catch (error) {
      toast.error("Fehler beim Speichern des Feedbacks");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-[#6B6B69]">Bewertungen werden geladen...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      {avgRating && (
        <div className="bg-[#F0EBE3] p-6 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <div className="text-4xl font-display font-light text-[#5B5B38]">
                {avgRating.average.toFixed(1)}
              </div>
              <button
                onClick={scrollToReviews}
                className="flex gap-1 mt-2 hover:opacity-80 transition-opacity cursor-pointer"
                title="Zu Bewertungen scrollen"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= Math.round(avgRating.average) ? "fill-[#5B5B38] text-[#5B5B38]" : "text-[#D0CCC4]"}
                  />
                ))}
              </button>
            </div>
            <div className="text-sm text-[#6B6B69]">
              basierend auf {avgRating.count} {avgRating.count === 1 ? 'Bewertung' : 'Bewertungen'}
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex gap-4 border-b border-[#E5E0D8] pb-4">
        <button
          onClick={() => handleSortChange('newest')}
          className={`font-body text-sm transition-colors ${
            sortBy === 'newest'
              ? 'text-[#5B5B38] font-semibold'
              : 'text-[#6B6B69] hover:text-[#5B5B38]'
          }`}
        >
          Neueste
        </button>
        <button
          onClick={() => handleSortChange('helpful')}
          className={`font-body text-sm transition-colors ${
            sortBy === 'helpful'
              ? 'text-[#5B5B38] font-semibold'
              : 'text-[#6B6B69] hover:text-[#5B5B38]'
          }`}
        >
          Hilfreichste
        </button>
        <button
          onClick={() => handleSortChange('highest')}
          className={`font-body text-sm transition-colors ${
            sortBy === 'highest'
              ? 'text-[#5B5B38] font-semibold'
              : 'text-[#6B6B69] hover:text-[#5B5B38]'
          }`}
        >
          Höchste Bewertung
        </button>
      </div>

      {/* Reviews List */}
      {sortedReviews.length === 0 ? (
        <div className="text-center py-12 text-[#6B6B69]">
          <p className="font-body text-sm">Noch keine Bewertungen vorhanden.</p>
          <p className="font-body text-xs mt-2">Sei der Erste und teile deine Erfahrung!</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedReviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-[#E5E0D8] last:border-b-0">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={scrollToReviews}
                    className="flex gap-0.5 hover:opacity-80 transition-opacity cursor-pointer"
                    title="Zu Bewertungen scrollen"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={`${
                          star <= review.rating
                            ? 'fill-[#5B5B38] text-[#5B5B38]'
                            : 'text-[#D0CCC4]'
                        }`}
                      />
                    ))}
                  </button>
                  <span className="font-body text-xs text-[#6B6B69]">
                    {new Date(review.createdAt).toLocaleDateString('de-DE')}
                  </span>
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="font-body font-semibold text-sm text-[#5B5B38] mb-2">
                    {review.title}
                  </h4>
                )}

                {/* Content */}
                <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-4">
                  {review.content}
                </p>

                {/* Helpful Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(review.id, true)}
                    className="flex items-center gap-1 text-xs text-[#6B6B69] hover:text-[#5B5B38] transition-colors"
                  >
                    <ThumbsUp size={14} />
                    <span>{review.helpfulCount}</span>
                  </button>
                  <button
                    onClick={() => handleHelpful(review.id, false)}
                    className="flex items-center gap-1 text-xs text-[#6B6B69] hover:text-[#5B5B38] transition-colors"
                  >
                    <ThumbsDown size={14} />
                    <span>{review.unhelpfulCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#E5E0D8]">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-body text-[#5B5B38] border border-[#E5E0D8] rounded hover:bg-[#F0EBE3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Vorherige
              </button>

              <div className="flex gap-1">
                {(() => {
                  const startPage = Math.max(1, currentPage - 1);
                  const endPage = Math.min(totalPages, currentPage + 1);
                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }
                  return pages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-body rounded transition-colors ${
                        currentPage === page
                          ? 'bg-[#5B5B38] text-[#F8F5F0]'
                          : 'border border-[#E5E0D8] text-[#5B5B38] hover:bg-[#F0EBE3]'
                      }`}
                    >
                      {page}
                    </button>
                  ));
                })()}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-body text-[#5B5B38] border border-[#E5E0D8] rounded hover:bg-[#F0EBE3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Nächste →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
