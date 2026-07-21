import { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useTranslation } from "react-i18next";

export default function AdminReviews() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  
  const { data: pendingReviews = [], isLoading, refetch } = trpc.reviews.getPending.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });
  
  const updateStatus = trpc.reviews.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Bewertung aktualisiert");
      refetch();
    },
    onError: () => {
      toast.error("Fehler beim Aktualisieren der Bewertung");
    },
  });

  if (loading) {
    return <DashboardLayout><div className="text-center py-8">Wird geladen...</div></DashboardLayout>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-4">
          <AlertCircle className="text-red-600" size={24} />
          <div>
            <h3 className="font-semibold text-red-900">Zugriff verweigert</h3>
            <p className="text-sm text-red-700">Du hast keine Berechtigung, diese Seite zu sehen.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-[#1C1C1A] mb-2">Bewertungen moderieren</h1>
          <p className="text-[#6B6B69]">Verwalte und moderiere Kundenbewertungen</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 border-b border-[#E5E0D8]">
          <button
            onClick={() => setFilter('pending')}
            className={`pb-4 font-body text-sm transition-colors ${
              filter === 'pending'
                ? 'text-[#5B5B38] font-semibold border-b-2 border-[#5B5B38]'
                : 'text-[#6B6B69] hover:text-[#5B5B38]'
            }`}
          >
            Ausstehend ({pendingReviews.length})
          </button>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="text-center py-12 text-[#6B6B69]">Wird geladen...</div>
        ) : pendingReviews.length === 0 ? (
          <div className="bg-[#F0EBE3] rounded-lg p-8 text-center">
            <p className="font-body text-[#6B6B69]">Keine ausstehenden Bewertungen</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="border border-[#E5E0D8] rounded-lg p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-body font-semibold text-[#5B5B38] mb-1">
                      {review.title}
                    </h3>
                    <p className="text-xs text-[#6B6B69]">
                      Produkt: <span className="font-mono">{review.productId}</span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 rounded-full ${
                          star <= review.rating
                            ? 'bg-[#5B9B5B]'
                            : 'bg-[#D0CCC4]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="font-body text-sm text-[#6B6B69] mb-4 leading-relaxed">
                  {review.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
                  <p className="text-xs text-[#6B6B69]">
                    {new Date(review.createdAt).toLocaleDateString('de-DE')}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateStatus.mutate({
                          reviewId: review.id,
                          status: 'approved',
                        })
                      }
                      disabled={updateStatus.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-[#5B9B5B] text-white font-body text-xs rounded hover:bg-[#4a7d4a] disabled:opacity-50 transition-colors"
                    >
                      <Check size={16} />
                      Genehmigen
                    </button>
                    <button
                      onClick={() =>
                        updateStatus.mutate({
                          reviewId: review.id,
                          status: 'rejected',
                        })
                      }
                      disabled={updateStatus.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-body text-xs rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      <X size={16} />
                      Ablehnen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
