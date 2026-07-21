/*
 * Mein Konto – Herbsom
 * Geschützter Bereich mit Bestellhistorie und Wiederbestell-Funktion
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Package, RotateCcw, User, LogOut, ChevronRight, AlertTriangle, Repeat } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/** Status label mapping */
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Ausstehend", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Bestätigt", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Versendet", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Geliefert", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Storniert", color: "bg-red-100 text-red-800" },
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function Account() {
  const { t } = useTranslation();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { addItem } = useCart();

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
    refetch,
  } = trpc.account.getMyOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const reorderMutation = trpc.account.reorder.useMutation({
    onSuccess: () => {
      toast.success("Nachbestellung wurde aufgegeben!");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Fehler bei der Nachbestellung");
    },
  });

  // Redirect to login if not authenticated (via useEffect to avoid render-phase side effects)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <p className="font-body text-sm text-[#6B6B69]">Weiterleitung zum Login...</p>
      </div>
    );
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0]">
        <Navigation />
        <div className="container py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-[#E5E0D8] rounded" />
            <div className="h-4 w-64 bg-[#E5E0D8] rounded" />
            <div className="h-64 bg-[#E5E0D8] rounded" />
          </div>
        </div>
      </div>
    );
  }

  const handleReorder = (orderId: number) => {
    reorderMutation.mutate({ orderId });
  };

  const handleAddAllToCart = (items: Array<{ productId: string; productName: string; priceCents: number; quantity: number }>) => {
    items.forEach((item) => {
      addItem({
        id: item.productId,
        name: item.productName,
        price: item.priceCents / 100,
        quantity: item.quantity,
      });
    });
    toast.success("Alle Artikel wurden in den Warenkorb gelegt!");
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navigation />

      {/* Header Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <p className="section-label mb-3">Willkommen zurück</p>
              <h1 className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light">
                Mein Konto
              </h1>
              {user?.name && (
                <p className="font-body text-sm text-[#6B6B69] mt-3">
                  Angemeldet als <span className="text-[#5B5B38] font-medium">{user.name}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => {
                logout();
                setLocation("/");
              }}
              className="flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors duration-200"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Abmelden
            </button>
          </div>
        </div>
      </section>

      {/* Account Info Card */}
      <section className="pb-12">
        <div className="container">
          <div className="bg-white border border-[#E5E0D8] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#F0EBE3] flex items-center justify-center">
                <User size={20} className="text-[#5B5B38]" />
              </div>
              <div>
                <h3 className="font-display text-xl text-[#1C1C1A] font-light">
                  {user?.name || "Kunde"}
                </h3>
                <p className="font-body text-sm text-[#6B6B69]">
                  {user?.email || "Keine E-Mail hinterlegt"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-[#F8F5F0]">
                <span className="font-display text-3xl text-[#5B5B38] font-light block">
                  {orders?.length ?? 0}
                </span>
                <p className="font-body text-xs tracking-[0.1em] uppercase text-[#7D7D5D] mt-1">
                  Bestellungen
                </p>
              </div>
              <div className="text-center p-4 bg-[#F8F5F0]">
                <span className="font-display text-3xl text-[#5B5B38] font-light block">
                  {orders?.filter((o) => o.status === "delivered").length ?? 0}
                </span>
                <p className="font-body text-xs tracking-[0.1em] uppercase text-[#7D7D5D] mt-1">
                  Geliefert
                </p>
              </div>
              <div className="text-center p-4 bg-[#F8F5F0]">
                <span className="font-display text-3xl text-[#5B5B38] font-light block">
                  {orders
                    ? formatPrice(
                        orders.reduce((sum, o) => sum + o.totalCents, 0)
                      )
                    : "0,00 €"}
                </span>
                <p className="font-body text-xs tracking-[0.1em] uppercase text-[#7D7D5D] mt-1">
                  Gesamtausgaben
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="pb-12 md:pb-16 border-b border-[#E5E0D8]">
        <div className="container">
          <div className="flex gap-8">
            <button
              onClick={() => setLocation("/account")}
              className="font-body text-sm tracking-[0.1em] uppercase text-[#5B5B38] border-b-2 border-[#5B5B38] pb-3 hover:text-[#424226] transition-colors"
            >
              Bestellhistorie
            </button>
            <button
              onClick={() => setLocation("/account/subscriptions")}
              className="font-body text-sm tracking-[0.1em] uppercase text-[#7D7D5D] hover:text-[#5B5B38] transition-colors pb-3"
            >
              Abonnements
            </button>
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="pb-24 md:pb-36">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-[#5B5B38]" />
              <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] font-light">
                Bestellhistorie
              </h2>
            </div>
          </div>

          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white border border-[#E5E0D8] p-8">
                  <div className="h-4 w-32 bg-[#E5E0D8] rounded mb-4" />
                  <div className="h-4 w-64 bg-[#E5E0D8] rounded mb-2" />
                  <div className="h-4 w-48 bg-[#E5E0D8] rounded" />
                </div>
              ))}
            </div>
          ) : ordersError ? (
            <div className="bg-white border border-[#E5E0D8] p-12 md:p-16 text-center">
              <AlertTriangle size={48} className="text-amber-400 mx-auto mb-6" />
              <h3 className="font-display text-2xl text-[#1C1C1A] font-light mb-3">
                Fehler beim Laden
              </h3>
              <p className="font-body text-sm text-[#6B6B69] mb-8 max-w-sm mx-auto">
                Deine Bestellungen konnten nicht geladen werden. Bitte versuche es erneut.
              </p>
              <button
                onClick={() => refetch()}
                className="btn-outline-dark"
              >
                Erneut versuchen
              </button>
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] p-12 md:p-16 text-center">
              <Package size={48} className="text-[#E5E0D8] mx-auto mb-6" />
              <h3 className="font-display text-2xl text-[#1C1C1A] font-light mb-3">
                Noch keine Bestellungen
              </h3>
              <p className="font-body text-sm text-[#6B6B69] mb-8 max-w-sm mx-auto">
                Du hast noch keine Bestellungen aufgegeben. Entdecke unsere individuellen Produkte und starte deine Hautpflege-Routine.
              </p>
              <a href="/#produkte" className="btn-outline-dark">
                Produkte entdecken
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-[#E5E0D8] p-6 md:p-8 hover:border-[#7D7D5D] transition-colors duration-300"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <span className="font-display text-lg text-[#1C1C1A] font-light">
                          Bestellung #{order.id}
                        </span>
                        <span
                          className={`font-body text-[10px] tracking-[0.1em] uppercase px-3 py-1 rounded-full ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <span className="font-body text-xs text-[#7D7D5D]">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-[#F0EBE3] pt-4 mb-6">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-3 border-b border-[#F8F5F0] last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <ChevronRight size={12} className="text-[#7D7D5D]" />
                            <span className="font-body text-sm text-[#1C1C1A]">
                              {item.productName}
                            </span>
                            <span className="font-body text-xs text-[#7D7D5D]">
                              × {item.quantity}
                            </span>
                          </div>
                          <span className="font-body text-sm text-[#5B5B38]">
                            {formatPrice(item.priceCents * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="font-body text-sm text-[#1C1C1A]">
                        Gesamt:{" "}
                        <span className="font-medium text-[#5B5B38]">
                          {formatPrice(order.totalCents)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAddAllToCart(order.items)}
                          className="flex items-center gap-2 font-body text-[11px] tracking-[0.1em] uppercase text-[#5B5B38] border border-[#5B5B38] px-4 py-2 hover:bg-[#5B5B38] hover:text-[#F8F5F0] transition-all duration-200 active:scale-[0.97]"
                        >
                          <RotateCcw size={12} />
                          In den Warenkorb
                        </button>
                        <button
                          onClick={() => handleReorder(order.id)}
                          disabled={reorderMutation.isPending}
                          className="flex items-center gap-2 font-body text-[11px] tracking-[0.1em] uppercase text-[#F8F5F0] bg-[#5B5B38] px-4 py-2 hover:bg-[#424226] transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RotateCcw size={12} />
                          {reorderMutation.isPending ? "Wird bestellt..." : "Nachbestellen"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
