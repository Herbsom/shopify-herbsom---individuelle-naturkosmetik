import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ReviewForm from "@/components/ReviewForm";
import { useCart, type LegacyCartItem } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle2, ExternalLink, LogIn, Package, RefreshCw, ShoppingBag, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: currencyCode }).format(Number(amount));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export default function CustomerAccount() {
  const { data, isLoading, refetch } = trpc.customerAccount.dashboard.useQuery(undefined, { retry: false });
  const prepareReorder = trpc.customerAccount.prepareReorder.useMutation();
  const { addItem, loading: cartLoading } = useCart();
  const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string } | null>(null);
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null);

  const orders = data?.orders ?? [];
  const purchasedProductCount = useMemo(
    () => new Set(orders.flatMap(order => order.items.map(item => item.reviewProductId).filter(Boolean))).size,
    [orders]
  );

  async function handleReorder(orderId: string) {
    setReorderingOrderId(orderId);
    try {
      const result = await prepareReorder.mutateAsync({ orderId });
      for (const item of result.items) {
        if (!item.reorder) continue;
        if (item.reorder.kind === "variant") {
          await addItem(item.reorder.variantId, item.reorder.quantity);
        } else {
          const legacyItem: LegacyCartItem = {
            id: item.reorder.id,
            name: item.reorder.name,
            description: item.reorder.description,
            quantity: item.reorder.quantity,
          };
          await addItem(legacyItem);
        }
      }
      toast.success("Kaufbare Artikel wurden deinem Warenkorb hinzugefügt.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Die Bestellung konnte nicht erneut hinzugefügt werden.");
    } finally {
      setReorderingOrderId(null);
    }
  }

  async function disconnect() {
    await fetch("/api/shopify/customer-account/logout", { method: "POST" });
    await refetch();
    toast.success("Du wurdest aus dem Kundenkonto abgemeldet.");
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1C1C1A]">
      <Navigation />
      <main className="container py-20 md:py-28">
        {!data?.connected && !isLoading && (
          <section className="mx-auto max-w-3xl border border-[#E5E0D8] bg-white px-7 py-12 text-center md:px-16 md:py-18">
            <p className="section-label mb-4">Mein Kundenkonto</p>
            <h1 className="font-display text-4xl font-light md:text-6xl">Deine Pflege. Immer griffbereit.</h1>
            <p className="mx-auto mt-6 max-w-xl font-body text-sm leading-relaxed text-[#6B6B69] md:text-base">
              Melde dich mit deinem Shopify-Kundenkonto an, um deine Bestellungen erneut zu kaufen und Produkte aus deinen Käufen zu bewerten.
            </p>
            <a href="/api/shopify/customer-account/login" className="mt-9 inline-flex items-center gap-2 bg-[#5B5B38] px-7 py-4 font-body text-xs uppercase tracking-[0.14em] text-[#F8F5F0] transition-all hover:bg-[#424226] active:scale-[0.97]">
              <LogIn size={15} /> Kundenkonto öffnen
            </a>
            <p className="mt-5 font-body text-xs text-[#85837D]">Deine Bestellhistorie wird sicher direkt über Shopify geladen.</p>
          </section>
        )}

        {isLoading && (
          <div className="py-28 text-center font-body text-sm text-[#6B6B69]">Dein Kundenkonto wird geladen …</div>
        )}

        {data?.connected && data.customer && (
          <>
            <section className="border-b border-[#D9D3C8] pb-10 md:flex md:items-end md:justify-between">
              <div>
                <p className="section-label mb-3">Mein Kundenkonto</p>
                <h1 className="font-display text-4xl font-light md:text-6xl">Willkommen zurück, {data.customer.displayName}.</h1>
                <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-[#6B6B69]">Bestelle deine vertraute Pflege mit wenigen Klicks nach und teile deine Erfahrung mit Produkten aus deinen bisherigen Bestellungen.</p>
              </div>
              <button onClick={disconnect} className="mt-6 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.12em] text-[#5B5B38] underline underline-offset-4 md:mt-0">
                Kundenkonto abmelden <ExternalLink size={14} />
              </button>
            </section>

            <section className="grid gap-4 py-9 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-[#E5E0D8] bg-white p-5"><Package size={20} className="text-[#5B5B38]" /><p className="mt-5 font-display text-3xl">{orders.length}</p><p className="mt-1 font-body text-xs uppercase tracking-[0.12em] text-[#6B6B69]">Bestellungen</p></div>
              <div className="border border-[#E5E0D8] bg-white p-5"><RefreshCw size={20} className="text-[#5B5B38]" /><p className="mt-5 font-display text-3xl">Wiederkauf</p><p className="mt-1 font-body text-xs uppercase tracking-[0.12em] text-[#6B6B69]">Mit aktueller Verfügbarkeit</p></div>
              <div className="border border-[#E5E0D8] bg-white p-5"><Star size={20} className="text-[#5B5B38]" /><p className="mt-5 font-display text-3xl">{purchasedProductCount}</p><p className="mt-1 font-body text-xs uppercase tracking-[0.12em] text-[#6B6B69]">Bewertbare Produkte</p></div>
            </section>

            <section className="pb-16">
              <div className="mb-7 flex items-end justify-between gap-6"><div><p className="section-label mb-2">Bestellhistorie</p><h2 className="font-display text-3xl font-light md:text-4xl">Deine bisherigen Bestellungen</h2></div></div>
              {orders.length === 0 ? (
                <div className="border border-[#E5E0D8] bg-white p-9 text-center"><ShoppingBag className="mx-auto text-[#5B5B38]" size={24} /><p className="mt-4 font-body text-sm text-[#6B6B69]">In diesem Kundenkonto sind noch keine Bestellungen vorhanden.</p><Link href="/products" className="mt-5 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.12em] text-[#5B5B38] underline underline-offset-4">Produkte entdecken <ArrowRight size={14} /></Link></div>
              ) : (
                <div className="space-y-5">
                  {orders.map(order => (
                    <article key={order.id} className="border border-[#E5E0D8] bg-white">
                      <header className="flex flex-col gap-4 border-b border-[#EEE9E1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
                        <div><p className="font-body text-xs uppercase tracking-[0.12em] text-[#5B5B38]">{order.name}</p><p className="mt-1 font-body text-sm text-[#6B6B69]">{formatDate(order.processedAt)} · {formatMoney(order.totalPrice.amount, order.totalPrice.currencyCode)}</p></div>
                        <button disabled={cartLoading || reorderingOrderId === order.id || !order.items.some(item => item.reorder)} onClick={() => handleReorder(order.id)} className="inline-flex items-center justify-center gap-2 bg-[#EDE9D9] px-5 py-3 font-body text-xs uppercase tracking-[0.12em] text-[#4D5734] transition-colors hover:bg-[#DFD8B7] disabled:cursor-not-allowed disabled:opacity-50"><RefreshCw size={14} className={reorderingOrderId === order.id ? "animate-spin" : ""} />{reorderingOrderId === order.id ? "Wird hinzugefügt" : "Alles erneut kaufen"}</button>
                      </header>
                      <div className="divide-y divide-[#EEE9E1]">
                        {order.items.map(item => (
                          <div key={item.id} className="flex gap-4 px-5 py-5 md:px-7">
                            <div className="h-20 w-20 shrink-0 overflow-hidden bg-[#F5F1E9]">{item.imageUrl ? <img src={item.imageUrl} alt={item.imageAlt ?? item.name} className="h-full w-full object-contain" /> : <Package className="m-6 text-[#B4AEA3]" size={28} />}</div>
                            <div className="min-w-0 flex-1"><p className="font-body text-sm text-[#1C1C1A]">{item.name}</p><p className="mt-1 font-body text-xs text-[#85837D]">Menge: {item.quantity}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">{item.detailPath && <Link href={item.detailPath} className="font-body text-xs uppercase tracking-[0.1em] text-[#5B5B38] underline underline-offset-4">Mehr erfahren</Link>}{item.reviewProductId && <button onClick={() => setReviewProduct({ id: item.reviewProductId!, name: item.name })} className="font-body text-xs uppercase tracking-[0.1em] text-[#5B5B38] underline underline-offset-4">Bewerten</button>}{!item.reorder && <span className="font-body text-xs text-[#9B5B44]">Derzeit nicht erneut kaufbar</span>}</div></div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      {reviewProduct && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 md:p-8"><div className="mx-auto my-8 max-w-xl bg-[#F8F5F0] p-6 shadow-2xl md:p-8"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="section-label mb-2">Verifizierter Kauf</p><h2 className="font-display text-3xl font-light">{reviewProduct.name} bewerten</h2></div><button onClick={() => setReviewProduct(null)} className="font-body text-xs uppercase tracking-[0.12em] text-[#5B5B38] underline underline-offset-4">Schließen</button></div><ReviewForm productId={reviewProduct.id} customerAccount onSuccess={() => setReviewProduct(null)} /></div></div>}
      <Footer />
    </div>
  );
}
