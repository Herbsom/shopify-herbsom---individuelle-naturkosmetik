import { useState } from "react";
import { Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  customerAccount?: boolean;
}

export default function ReviewForm({ productId, onSuccess, customerAccount = false }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReview = trpc.reviews.create.useMutation();
  const createVerifiedCustomerReview = trpc.customerAccount.createReview.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Bitte wähle eine Bewertung aus");
      return;
    }

    if (!title.trim()) {
      toast.error("Bitte gib einen Titel ein");
      return;
    }

    if (!content.trim()) {
      toast.error("Bitte schreib eine Bewertung");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewInput = {
        productId,
        rating,
        title: title.trim(),
        content: content.trim(),
      };
      if (customerAccount) {
        await createVerifiedCustomerReview.mutateAsync(reviewInput);
      } else {
        await createReview.mutateAsync(reviewInput);
      }

      toast.success("Bewertung eingereicht! Sie wird nach Prüfung veröffentlicht.");
      setRating(0);
      setTitle("");
      setContent("");
      onSuccess?.();
    } catch (error) {
      toast.error("Fehler beim Einreichen der Bewertung");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#F0EBE3] p-6 rounded-lg">
      <div>
        <label className="block font-body text-sm font-semibold text-[#5B5B38] mb-3">
          Bewertung
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoverRating || rating)
                    ? "fill-[#5B5B38] text-[#5B5B38]"
                    : "text-[#D0CCC4]"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block font-body text-sm font-semibold text-[#5B5B38] mb-2">
          Titel
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Kurzer Titel für deine Bewertung"
          maxLength={255}
          className="w-full px-4 py-2 border border-[#D0CCC4] rounded-sm font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#5B5B38]"
        />
        <p className="text-xs text-[#6B6B69] mt-1">{title.length}/255</p>
      </div>

      <div>
        <label htmlFor="content" className="block font-body text-sm font-semibold text-[#5B5B38] mb-2">
          Bewertung
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Teile deine Erfahrung mit diesem Produkt..."
          maxLength={5000}
          rows={5}
          className="w-full px-4 py-2 border border-[#D0CCC4] rounded-sm font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#5B5B38] resize-none"
        />
        <p className="text-xs text-[#6B6B69] mt-1">{content.length}/5000</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || createVerifiedCustomerReview.isPending || createReview.isPending}
        className="w-full bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-6 py-3 hover:bg-[#424226] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.97]"
      >
        {isSubmitting ? "Wird eingereicht..." : "Bewertung einreichen"}
      </button>

      <p className="text-xs text-[#6B6B69] text-center">
        Deine Bewertung wird nach Prüfung veröffentlicht.
      </p>
    </form>
  );
}
