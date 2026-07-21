import { Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

const PRODUCT_NAMES: Record<string, string> = {
  "cleaner-gel": "Reinigungsgel",
  "cleaner-milk": "Reinigungsmilch",
  "peeling-bha": "BHA & Azelainsäure Peeling",
  "peeling-aha": "AHA & PHA Peeling",
  sunscreen: "Sonnenschutzfluid SPF 50+",
  serum: "Individuelles Serum",
  creme: "Individuelle Gesichtscreme",
};

export default function TopReviews() {
  const reviewsQuery = trpc.reviews.getTop.useQuery({ limit: 3 });

  if (reviewsQuery.isLoading) {
    return (
      <section className="py-24 md:py-36 bg-[#F8F5F0]" aria-label="Bewertungen werden geladen">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-64 animate-pulse bg-white border border-[#E5E0D8]" />
          ))}
        </div>
      </section>
    );
  }

  const reviews = reviewsQuery.data ?? [];
  if (reviewsQuery.isError || reviews.length === 0) return null;

  return (
    <section className="py-24 md:py-36 bg-[#F8F5F0]">
      <div className="container">
        <div className="mb-16 reveal">
          <p className="section-label text-[#5B5B38] mb-3">Kundenbewertungen</p>
          <h2 className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light leading-tight">
            Freigegebene Bewertungen<br />
            <em className="italic">aus unserem Shop.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <article
              key={review.id}
              className={`bg-white p-8 border border-[#E5E0D8] reveal reveal-delay-${index + 1}`}
            >
              <p className="font-body text-xs tracking-[0.1em] uppercase text-[#5B5B38] mb-4 font-semibold">
                {PRODUCT_NAMES[review.productId] ?? "Herbsom Produkt"}
              </p>
              <div className="flex gap-1 mb-5" aria-label={`${review.rating} von 5 Sternen`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= review.rating
                        ? "fill-[#5B5B38] text-[#5B5B38]"
                        : "text-[#D0CCC4]"
                    }
                  />
                ))}
              </div>
              <h3 className="font-display text-xl text-[#1C1C1A] font-light mb-3">
                {review.title}
              </h3>
              <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-6">
                {review.content}
              </p>
              <p className="border-t border-[#E5E0D8] pt-5 font-body text-xs text-[#7D7D5D]">
                Freigegebene Kundenbewertung · {new Date(review.createdAt).toLocaleDateString("de-DE")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
