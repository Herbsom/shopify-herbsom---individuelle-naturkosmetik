/*
 * Checkout – Herbsom
 * Adressformular + Bestellübersicht + Bestellung aufgeben
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { ArrowLeft, Lock, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

function formatPrice(price: number) {
  return price.toFixed(2).replace(".", ",") + " €";
}

interface AddressForm {
  firstName: string;
  lastName: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
}

export default function Checkout() {
  const { t } = useTranslation();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const [address, setAddress] = useState<AddressForm>({
    firstName: "",
    lastName: "",
    street: "",
    zip: "",
    city: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<AddressForm>>({});

  // Pre-fill email from user
  useEffect(() => {
    if (user?.email) {
      setAddress((prev) => ({ ...prev, email: user.email || "" }));
    }
    if (user?.name) {
      const parts = user.name.split(" ");
      setAddress((prev) => ({
        ...prev,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
      }));
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  // Redirect to cart if empty
  useEffect(() => {
    if (!authLoading && isAuthenticated && items.length === 0) {
      setLocation("/cart");
    }
  }, [authLoading, isAuthenticated, items.length, setLocation]);

  const placeOrderMutation = trpc.account.placeOrder.useMutation({
    onSuccess: (data) => {
      clearCart();
      setLocation(`/order-confirmation?orderId=${data.orderId}`);
    },
    onError: (err) => {
      toast.error(err.message || "Fehler bei der Bestellung. Bitte versuche es erneut.");
    },
  });

  const validate = (): boolean => {
    const newErrors: Partial<AddressForm> = {};
    if (!address.firstName.trim()) newErrors.firstName = "Pflichtfeld";
    if (!address.lastName.trim()) newErrors.lastName = "Pflichtfeld";
    if (!address.street.trim()) newErrors.street = "Pflichtfeld";
    if (!address.zip.trim()) newErrors.zip = "Pflichtfeld";
    if (!address.city.trim()) newErrors.city = "Pflichtfeld";
    if (!address.email.trim() || !address.email.includes("@")) newErrors.email = "Gültige E-Mail erforderlich";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const shippingAddress = `${address.firstName} ${address.lastName}, ${address.street}, ${address.zip} ${address.city}`;

    placeOrderMutation.mutate({
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        priceCents: Math.round(item.price * 100),
        quantity: item.quantity,
      })),
      shippingAddress,
    });
  };

  const updateField = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const shipping = total >= 50 ? 0 : 4.9;
  const grandTotal = total + shipping;

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <p className="font-body text-sm text-[#6B6B69]">Weiterleitung zum Login...</p>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0]">
        <Navigation />
        <div className="container py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-[#E5E0D8] rounded" />
            <div className="h-64 bg-[#E5E0D8] rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navigation />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-body text-xs text-[#7D7D5D] mb-6">
            <Link href="/cart" className="hover:text-[#5B5B38] transition-colors">Warenkorb</Link>
            <ChevronRight size={12} />
            <span className="text-[#1C1C1A]">Checkout</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-[#1C1C1A] font-light">
            Checkout
          </h1>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Address Form */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-[#E5E0D8] p-8 md:p-10">
                  <h2 className="font-display text-2xl text-[#1C1C1A] font-light mb-8">
                    Lieferadresse
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField
                      label="Vorname"
                      value={address.firstName}
                      onChange={(v) => updateField("firstName", v)}
                      error={errors.firstName}
                      required
                    />
                    <InputField
                      label="Nachname"
                      value={address.lastName}
                      onChange={(v) => updateField("lastName", v)}
                      error={errors.lastName}
                      required
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        label="Straße und Hausnummer"
                        value={address.street}
                        onChange={(v) => updateField("street", v)}
                        error={errors.street}
                        required
                      />
                    </div>
                    <InputField
                      label="PLZ"
                      value={address.zip}
                      onChange={(v) => updateField("zip", v)}
                      error={errors.zip}
                      required
                    />
                    <InputField
                      label="Stadt"
                      value={address.city}
                      onChange={(v) => updateField("city", v)}
                      error={errors.city}
                      required
                    />
                    <InputField
                      label="E-Mail"
                      type="email"
                      value={address.email}
                      onChange={(v) => updateField("email", v)}
                      error={errors.email}
                      required
                    />
                    <InputField
                      label="Telefon (optional)"
                      type="tel"
                      value={address.phone}
                      onChange={(v) => updateField("phone", v)}
                    />
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white border border-[#E5E0D8] p-8 md:p-10 mt-6">
                  <h2 className="font-display text-2xl text-[#1C1C1A] font-light mb-4">
                    Zahlung
                  </h2>
                  <p className="font-body text-sm text-[#6B6B69]">
                    Zahlung auf Rechnung. Du erhältst eine Rechnung per E-Mail nach Versand deiner Bestellung.
                  </p>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-[#E5E0D8] p-8 sticky top-32">
                  <h3 className="font-display text-xl text-[#1C1C1A] font-light mb-6">
                    Deine Bestellung
                  </h3>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-body text-sm text-[#1C1C1A]">{item.name}</p>
                          {item.description && (
                            <p className="font-body text-xs text-[#5B5B38] leading-relaxed">{item.description}</p>
                          )}
                            <p className="font-body text-xs text-[#7D7D5D]">Menge: {item.quantity}</p>
                            {item.isSubscription && item.subscriptionFrequency && (
                              <p className="font-body text-xs text-[#5B5B38] mt-1 font-medium">
                                📅 Abonnement: {item.subscriptionFrequency === 'weekly' ? 'Wöchentlich' : item.subscriptionFrequency === 'biweekly' ? 'Alle 2 Wochen' : item.subscriptionFrequency === 'monthly' ? 'Monatlich' : 'Vierteljährlich'}
                              </p>
                            )}
                        </div>
                        <span className="font-body text-sm text-[#5B5B38]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#E5E0D8] pt-4 space-y-2 mb-6">
                    <div className="flex justify-between font-body text-sm text-[#6B6B69]">
                      <span>Zwischensumme</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm text-[#6B6B69]">
                      <span>Versand</span>
                      <span>{shipping === 0 ? "Kostenlos" : formatPrice(shipping)}</span>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E0D8] pt-4 mb-8">
                    <div className="flex justify-between font-body text-base text-[#1C1C1A] font-medium">
                      <span>Gesamt</span>
                      <span className="text-[#5B5B38]">{formatPrice(grandTotal)}</span>
                    </div>
                    <p className="font-body text-xs text-[#7D7D5D] mt-1">inkl. MwSt.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={placeOrderMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-[#F8F5F0] bg-[#5B5B38] px-6 py-4 hover:bg-[#424226] transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock size={14} />
                    {placeOrderMutation.isPending ? "Wird bestellt..." : "Jetzt bestellen"}
                  </button>

                  <p className="font-body text-xs text-[#7D7D5D] text-center mt-4">
                    Mit der Bestellung akzeptierst du unsere AGB
                  </p>

                  <Link
                    href="/cart"
                    className="flex items-center justify-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#5B5B38] mt-4 hover:gap-4 transition-all duration-300"
                  >
                    <ArrowLeft size={12} />
                    Zurück zum Warenkorb
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Input Field Component ─────────────────────────────────────────── */
function InputField({
  label,
  value,
  onChange,
  error,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-body text-xs tracking-[0.1em] uppercase text-[#7D7D5D] mb-2">
        {label} {required && <span className="text-[#5B5B38]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 bg-[#F8F5F0] border ${
          error ? "border-red-400" : "border-[#E5E0D8]"
        } font-body text-sm text-[#1C1C1A] placeholder-[#A8A8A6] focus:outline-none focus:border-[#5B5B38] transition-colors duration-200`}
        placeholder={label}
      />
      {error && (
        <p className="font-body text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
