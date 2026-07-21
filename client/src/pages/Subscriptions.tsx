/**
 * Subscriptions – Herbsom
 * Verwaltung von Abonnements
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Package, Plus, Edit2, Trash2, Pause, Play, AlertTriangle, Calendar, DollarSign, Tag, Copy } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/** Status label mapping */
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Aktiv", color: "bg-green-100 text-green-800" },
  paused: { label: "Pausiert", color: "bg-amber-100 text-amber-800" },
  cancelled: { label: "Gekündigt", color: "bg-red-100 text-red-800" },
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

interface SubscriptionWithItems {
  id: number;
  userId: number;
  status: "active" | "paused" | "cancelled";
  billingIntervalDays: number;
  totalCents: number;
  nextBillingDate: Date;
  lastBillingDate: Date | null;
  stripeSubscriptionId: string | null;
  shippingAddress: string | null;
  createdAt: Date;
  items: Array<{
    id: number;
    subscriptionId: number;
    productId: string;
    productName: string;
    priceCents: number;
    quantity: number;
  }>;
}

export default function Subscriptions() {
  const { t } = useTranslation();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<number | null>(null);

  const {
    data: subscriptions,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
    refetch,
  } = trpc.subscriptions.getMySubscriptions.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateStatusMutation = trpc.subscriptions.updateSubscriptionStatus.useMutation({
    onSuccess: () => {
      toast.success("Abonnement-Status aktualisiert!");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Fehler beim Aktualisieren des Status");
    },
  });

  const { data: availableCodes } = trpc.discounts.getAvailableCodes.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`Code "${code}" kopiert!`);
    });
  };

  const updateBillingIntervalMutation = trpc.subscriptions.updateBillingInterval.useMutation({
    onSuccess: () => {
      toast.success("Abonnement-Intervall aktualisiert!");
      setEditingSubscriptionId(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Fehler beim Aktualisieren des Intervalls");
    },
  });

  // Redirect to login if not authenticated
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

  const handleStatusChange = (subscriptionId: number, newStatus: "active" | "paused" | "cancelled") => {
    updateStatusMutation.mutate({ subscriptionId, status: newStatus });
  };

  const handleBillingIntervalChange = (subscriptionId: number, days: number) => {
    updateBillingIntervalMutation.mutate({ subscriptionId, billingIntervalDays: days });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navigation />

      {/* Header Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <p className="section-label mb-3">Verwaltung</p>
              <h1 className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light">
                Meine Abonnements
              </h1>
              <p className="font-body text-sm text-[#6B6B69] mt-3">
                Verwalten Sie Ihre wiederkehrenden Bestellungen
              </p>
            </div>
            <button
              onClick={() => setLocation("/cart")}
              className="flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors duration-200"
            >
              <Plus size={14} strokeWidth={1.5} />
              Neues Abo
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="pb-12 md:pb-16 border-b border-[#E5E0D8]">
        <div className="container">
          <div className="flex gap-8">
            <button
              onClick={() => setLocation("/account")}
              className="font-body text-sm tracking-[0.1em] uppercase text-[#7D7D5D] hover:text-[#5B5B38] transition-colors pb-3"
            >
              Bestellhistorie
            </button>
            <button
              onClick={() => setLocation("/account/subscriptions")}
              className="font-body text-sm tracking-[0.1em] uppercase text-[#5B5B38] border-b-2 border-[#5B5B38] pb-3 hover:text-[#424226] transition-colors"
            >
              Abonnements
            </button>
          </div>
        </div>
      </section>

      {/* Subscriber Discount Banner */}
      {availableCodes?.isSubscriber && availableCodes?.subscriberDiscount && (
        <section className="py-6 bg-[#5B5B38]">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Tag size={18} className="text-[#C8D4A0]" strokeWidth={1.5} />
                <div>
                  <p className="font-body text-xs text-[#C8D4A0] uppercase tracking-[0.1em] mb-0.5">
                    Exklusiv für Abonnenten
                  </p>
                  <p className="font-display text-white text-lg font-light">
                    {availableCodes.subscriberDiscount.value}% Rabatt auf alle Bestellungen
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCopyCode(availableCodes.subscriberDiscount!.code)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 transition-colors duration-200"
              >
                <span className="font-body text-sm text-white tracking-[0.15em] uppercase">
                  {availableCodes.subscriberDiscount.code}
                </span>
                <Copy size={14} className="text-white/70" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Subscriptions Section */}
      <section className="pb-24 md:pb-36">
        <div className="container">
          {subscriptionsLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-48 bg-[#E5E0D8] rounded" />
              <div className="h-48 bg-[#E5E0D8] rounded" />
            </div>
          ) : subscriptionsError ? (
            <div className="bg-red-50 border border-red-200 p-6 rounded">
              <div className="flex gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-display text-lg text-red-900">Fehler beim Laden</h3>
                  <p className="font-body text-sm text-red-700 mt-1">
                    {subscriptionsError.message || "Abonnements konnten nicht geladen werden"}
                  </p>
                </div>
              </div>
            </div>
          ) : !subscriptions || subscriptions.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] p-12 text-center">
              <Package size={40} className="text-[#D4CCBF] mx-auto mb-4" />
              <h3 className="font-display text-xl text-[#1C1C1A] font-light mb-2">
                Keine Abonnements vorhanden
              </h3>
              <p className="font-body text-sm text-[#6B6B69] mb-6">
                Erstellen Sie Ihr erstes Abonnement, um regelmäßig Ihre Lieblings-Produkte zu erhalten.
              </p>
              <button
                onClick={() => setLocation("/cart")}
                className="inline-block font-body text-xs tracking-[0.15em] uppercase text-[#5B5B38] hover:text-[#424226] border border-[#5B5B38] px-6 py-3 transition-colors duration-200"
              >
                Zum Shop
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {subscriptions.map((subscription: any) => (
                <div key={subscription.id} className="bg-white border border-[#E5E0D8] overflow-hidden">
                  {/* Subscription Header */}
                  <div className="p-6 md:p-8 border-b border-[#E5E0D8]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              STATUS_LABELS[subscription.status]?.color || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {STATUS_LABELS[subscription.status]?.label || subscription.status}
                          </span>
                          <span className="font-display text-2xl text-[#5B5B38] font-light">
                            {formatPrice(subscription.totalCents)}
                          </span>
                        </div>
                        <p className="font-body text-sm text-[#6B6B69]">
                          Abonnement #{subscription.id} • {subscription.items.length} Produkt(e)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {subscription.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(subscription.id, "paused")}
                            className="p-2 hover:bg-[#F8F5F0] transition-colors duration-200"
                            title="Pausieren"
                          >
                            <Pause size={18} className="text-[#5B5B38]" strokeWidth={1.5} />
                          </button>
                        )}
                        {subscription.status === "paused" && (
                          <button
                            onClick={() => handleStatusChange(subscription.id, "active")}
                            className="p-2 hover:bg-[#F8F5F0] transition-colors duration-200"
                            title="Fortsetzen"
                          >
                            <Play size={18} className="text-[#5B5B38]" strokeWidth={1.5} />
                          </button>
                        )}
                        {subscription.status !== "cancelled" && (
                          <button
                            onClick={() => handleStatusChange(subscription.id, "cancelled")}
                            className="p-2 hover:bg-[#F8F5F0] transition-colors duration-200"
                            title="Kündigen"
                          >
                            <Trash2 size={18} className="text-red-600" strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subscription Details */}
                  <div className="p-6 md:p-8 bg-[#F8F5F0]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="font-body text-xs text-[#7D7D5D] uppercase tracking-[0.1em] mb-2">
                          Abonnement-Intervall
                        </p>
                        {editingSubscriptionId === subscription.id ? (
                          <div className="flex gap-2">
                            <select
                              defaultValue={subscription.billingIntervalDays}
                              onChange={(e) =>
                                handleBillingIntervalChange(subscription.id, parseInt(e.target.value))
                              }
                              className="flex-1 px-3 py-2 border border-[#D4CCBF] bg-white font-body text-sm"
                            >
                              <option value="7">Wöchentlich (7 Tage)</option>
                              <option value="14">Alle 2 Wochen (14 Tage)</option>
                              <option value="30">Monatlich (30 Tage)</option>
                              <option value="60">Alle 2 Monate (60 Tage)</option>
                              <option value="90">Vierteljährlich (90 Tage)</option>
                            </select>
                            <button
                              onClick={() => setEditingSubscriptionId(null)}
                              className="px-3 py-2 bg-[#5B5B38] text-white font-body text-xs hover:bg-[#424226] transition-colors"
                            >
                              OK
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="font-display text-lg text-[#1C1C1A] font-light">
                              {subscription.billingIntervalDays === 7
                                ? "Wöchentlich"
                                : subscription.billingIntervalDays === 14
                                  ? "Alle 2 Wochen"
                                  : subscription.billingIntervalDays === 30
                                    ? "Monatlich"
                                    : subscription.billingIntervalDays === 60
                                      ? "Alle 2 Monate"
                                      : subscription.billingIntervalDays === 90
                                        ? "Vierteljährlich"
                                        : `Alle ${subscription.billingIntervalDays} Tage`}
                            </span>
                            <button
                              onClick={() => setEditingSubscriptionId(subscription.id)}
                              className="p-1 hover:bg-white transition-colors"
                              title="Bearbeiten"
                            >
                              <Edit2 size={14} className="text-[#5B5B38]" strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-body text-xs text-[#7D7D5D] uppercase tracking-[0.1em] mb-2">
                          Nächste Abrechnung
                        </p>
                        <p className="font-display text-lg text-[#1C1C1A] font-light">
                          {formatDate(subscription.nextBillingDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-[#7D7D5D] uppercase tracking-[0.1em] mb-2">
                          Erstellt am
                        </p>
                        <p className="font-display text-lg text-[#1C1C1A] font-light">
                          {formatDate(subscription.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Items */}
                  <div className="p-6 md:p-8">
                    <h4 className="font-display text-lg text-[#1C1C1A] font-light mb-4">
                      Produkte im Abonnement
                    </h4>
                    <div className="space-y-3">
                      {subscription.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-[#F8F5F0]">
                          <div className="flex-1">
                            <p className="font-body text-sm text-[#1C1C1A]">{item.productName}</p>
                            <p className="font-body text-xs text-[#7D7D5D]">
                              Menge: {item.quantity} • {formatPrice(item.priceCents)} pro Stück
                            </p>
                          </div>
                          <p className="font-display text-sm text-[#5B5B38] font-light">
                            {formatPrice(item.priceCents * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
