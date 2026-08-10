import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ReviewForm from "@/components/ReviewForm";
import { useCart, type LegacyCartItem } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import type { Product, SellingPlanAllocation } from "@shared/commerce/types";
import { ArrowRight, CalendarClock, CheckCircle2, ExternalLink, Heart, LogIn, Package, RefreshCw, ShieldCheck, ShoppingBag, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: currencyCode }).format(Number(amount));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

function productPath(handle: string) {
  const paths: Record<string, string> = {
    reinigungsgel: "/product/cleaner",
    "reinigungs-milch": "/product/cleaner-milk",
    "aha-pha-peeling": "/product/peeling-aha",
    "bha-azelainsaure-peeling": "/product/peeling",
    "sonnenschutzfluid-spf-50": "/product/sunscreen",
  };
  return paths[handle] ?? "/products";
}

function nativeShopifyProductUrl(handle: string) {
  return `https://herbsom.de/products/${handle}`;
}

function subscriptionOptions(product: Product) {
  return product.variants.flatMap(variant =>
    variant.sellingPlanAllocations.map(allocation => ({ variant, allocation }))
  );
}

export default function CustomerAccount() {
  const { data, isLoading, refetch } = trpc.customerAccount.dashboard.useQuery(undefined, { retry: false });
  const { data: catalog = [], isLoading: catalogLoading } = trpc.commerce.products.list.useQuery({ first: 100 });
  const subscriptionQuery = trpc.commerce.subscriptions.list.useQuery({ first: 50 }, { retry: false });
  const prepareReorder = trpc.customerAccount.prepareReorder.useMutation();
  const { addItem, loading: cartLoading } = useCart();
  const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string } | null>(null);
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});
  const nativeShopifyAccountUrl = "https://account.herbsom.de";

  const orders = data?.orders ?? [];
  const portalProducts = useMemo(() => {
    const featuredHandles = [
      "reinigungsgel",
      "reinigungs-milch",
      "aha-pha-peeling",
      "bha-azelainsaure-peeling",
      "sonnenschutzfluid-spf-50",
    ];
    return catalog
      .filter(product => featuredHandles.includes(product.handle))
      .filter(product => product.variants.some(variant => variant.availableForSale))
      .sort((a, b) => featuredHandles.indexOf(a.handle) - featuredHandles.indexOf(b.handle));
  }, [catalog]);
  const subscriptionProducts = useMemo(() => subscriptionQuery.data ?? [], [subscriptionQuery.data]);
  const purchasedProductCount = useMemo(
    () => new Set(orders.flatMap(order => order.items.map(item => item.reviewProductId).filter(Boolean))).size,
    [orders]
  );

  async function handleQuickAdd(product: Product) {
    const variant = product.variants.find(candidate => candidate.availableForSale);
    if (!variant) {
      toast.error("Dieses Produkt ist derzeit nicht verfügbar.");
      return;
    }
    setAddingProductId(product.id);
    try {
      await addItem(variant.id, 1);
      toast.success(`${product.title} wurde deinem Warenkorb hinzugefügt.`);
    } finally {
      setAddingProductId(null);
    }
  }

  async function handleSubscriptionAdd(product: Product, selection: { variant: Product["variants"][number]; allocation: SellingPlanAllocation }) {
    setAddingProductId(`${product.id}-${selection.allocation.sellingPlanId}`);
    try {
      await addItem({ variantId: selection.variant.id, sellingPlanId: selection.allocation.sellingPlanId }, 1);
      toast.success(`${product.title} wurde als Abo in deinen Warenkorb gelegt.`);
    } finally {
      setAddingProductId(null);
    }
  }

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
          <>
            <section className="overflow-hidden border border-[#E3DDD0] bg-white md:grid md:grid-cols-[1.15fr_0.85fr]">
              <div className="px-7 py-12 md:px-14 md:py-16">
                <p className="section-label mb-5">Mein Herbsom</p>
                <h1 className="max-w-2xl font-display text-4xl font-light leading-[0.98] md:text-6xl">Deine Routine.<br /><em>Ganz bei dir.</em></h1>
                <p className="mt-7 max-w-xl font-body text-sm leading-relaxed text-[#67675F] md:text-base">Entdecke deine vertrauten Pflege-Essentials und lege sie mit einem Klick erneut in den Warenkorb. Dein sicheres Konto und deine Daten werden dabei direkt von Shopify verwaltet; Abo-Optionen werden nach der Shopify-Synchronisierung hier ergänzt.</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a href={nativeShopifyAccountUrl} target="_blank" rel="noopener noreferrer" data-testid="customer-account-login-primary" className="inline-flex items-center justify-center gap-2 bg-[#5B5B38] px-6 py-4 font-body text-xs uppercase tracking-[0.14em] text-[#F8F5F0] transition-colors hover:bg-[#424226] active:scale-[0.97]">
                    <LogIn size={15} /> Meine Bestellungen verwalten
                  </a>
                  <a href="#wiederkauf" className="inline-flex items-center justify-center gap-2 border border-[#8A8A69] px-6 py-4 font-body text-xs uppercase tracking-[0.14em] text-[#4C5238] transition-colors hover:bg-[#F4F0E5] active:scale-[0.97]">
                    Direkt nachbestellen <ArrowRight size={15} />
                  </a>
                </div>
                <p className="mt-5 flex items-center gap-2 font-body text-xs text-[#838277]"><ShieldCheck size={14} className="text-[#5B5B38]" /> Anmeldung und Zahlungsdaten bleiben sicher bei Shopify.</p>
              </div>
              <aside className="relative overflow-hidden bg-[#5B5B38] px-7 py-10 text-[#F8F5F0] md:px-10 md:py-14">
                <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full border border-[#CFC6A9]/25" />
                <div className="relative">
                  <Sparkles size={20} className="text-[#E4D8B9]" />
                  <p className="mt-8 font-body text-[11px] uppercase tracking-[0.18em] text-[#DCD3B9]">Dein Pflegeplan</p>
                  <h2 className="mt-3 font-display text-4xl font-light leading-tight">Weniger denken.<br />Mehr pflegen.</h2>
                  <div className="mt-9 space-y-4 border-t border-[#B7B08F]/45 pt-7 font-body text-sm leading-relaxed text-[#F3EEDF]">
                    <p className="flex gap-3"><Heart size={16} className="mt-0.5 shrink-0 text-[#E4D8B9]" /> Vertraute Produkte unkompliziert wiederbestellen.</p>
                    <p className="flex gap-3"><CalendarClock size={16} className="mt-0.5 shrink-0 text-[#E4D8B9]" /> Abo-Intervalle werden direkt aus Shopify synchronisiert.</p>
                    <p className="flex gap-3"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#E4D8B9]" /> Verträge direkt im Shopify-Konto verwalten.</p>
                  </div>
                </div>
              </aside>
            </section>

            <section id="wiederkauf" className="scroll-mt-28 py-18 md:py-24">
              <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><p className="section-label mb-3">Wiederkauf</p><h2 className="font-display text-3xl font-light md:text-5xl">Deine Essentials, erneut gewählt.</h2></div>
                <Link href="/products" className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.12em] text-[#5B5B38] underline underline-offset-4">Alle Produkte entdecken <ArrowRight size={14} /></Link>
              </div>
              {catalogLoading ? (
                <div className="border border-[#E5E0D8] bg-white px-6 py-10 font-body text-sm text-[#737268]">Deine Essentials werden geladen …</div>
              ) : portalProducts.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {portalProducts.slice(0, 4).map(product => {
                    const variant = product.variants.find(candidate => candidate.availableForSale);
                    return <article key={product.id} className="group border border-[#E5E0D8] bg-white p-4 transition-shadow hover:shadow-[0_12px_40px_rgba(55,55,28,0.08)]">
                      <Link href={productPath(product.handle)} className="block aspect-square overflow-hidden bg-[#F6F3EC]">
                        {product.images[0] ? <img src={product.images[0].url} alt={product.images[0].altText ?? product.title} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" /> : <Package className="m-[42%] text-[#B4AEA3]" size={28} />}
                      </Link>
                      <div className="px-1 pb-1 pt-5"><p className="font-display text-2xl font-light leading-tight">{product.title}</p><p className="mt-2 font-body text-sm text-[#696860]">{formatMoney(product.priceRange.min.amount, product.priceRange.min.currencyCode)}</p>
                        <button disabled={!variant || cartLoading || addingProductId === product.id} onClick={() => handleQuickAdd(product)} className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#EDE9D9] px-4 py-3 font-body text-[11px] uppercase tracking-[0.12em] text-[#4D5734] transition-colors hover:bg-[#DFD8B7] disabled:cursor-not-allowed disabled:opacity-50"><RefreshCw size={14} className={addingProductId === product.id ? "animate-spin" : ""} />{addingProductId === product.id ? "Wird hinzugefügt" : "Erneut bestellen"}</button>
                      </div>
                    </article>;
                  })}
                </div>
              ) : <div className="border border-[#E5E0D8] bg-white px-6 py-10 font-body text-sm text-[#737268]">Aktuell sind keine wiederbestellbaren Produkte verfügbar.</div>}
            </section>

            <section className="border-y border-[#D9D3C8] bg-[#EFEADF] px-6 py-12 md:px-10 md:py-16" data-testid="customer-subscription-section">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div><p className="section-label mb-4">Pflege im Abo</p><h2 className="font-display text-4xl font-light leading-[1.02] md:text-5xl">Deine Routine,<br /><em>im richtigen Rhythmus.</em></h2><p className="mt-6 max-w-md font-body text-sm leading-relaxed text-[#696860]">Wähle ein Produkt, das du regelmäßig nutzt, und entscheide dich für den passenden Lieferintervall. Der Abschluss und jede spätere Änderung erfolgen sicher über Shopify.</p></div>
                {subscriptionProducts.length ? <div className="grid gap-4 sm:grid-cols-2">
                  {subscriptionProducts.slice(0, 4).map(product => {
                    const choices = subscriptionOptions(product);
                    const selectedId = selectedPlans[product.id] ?? choices[0]?.allocation.sellingPlanId;
                    const selected = choices.find(choice => choice.allocation.sellingPlanId === selectedId) ?? choices[0];
                    return <article key={product.id} className="border border-[#DDD5C3] bg-[#F8F5F0] p-5"><div className="flex gap-4"><div className="h-16 w-16 shrink-0 overflow-hidden bg-white">{product.images[0] && <img src={product.images[0].url} alt="" className="h-full w-full object-contain" />}</div><div><p className="font-display text-2xl font-light leading-tight">{product.title}</p><p className="mt-1 font-body text-xs text-[#77746B]">Ab {selected ? formatMoney(selected.allocation.perDeliveryPrice.amount, selected.allocation.perDeliveryPrice.currencyCode) : formatMoney(product.priceRange.min.amount, product.priceRange.min.currencyCode)} je Lieferung</p></div></div>
                      <label className="mt-5 block font-body text-[11px] uppercase tracking-[0.12em] text-[#625F54]">Lieferintervall<select value={selectedId} onChange={event => setSelectedPlans(current => ({ ...current, [product.id]: event.target.value }))} className="mt-2 w-full border border-[#CFC7B5] bg-white px-3 py-3 font-body text-sm text-[#35362B] outline-none focus:border-[#5B5B38]">{choices.map(choice => <option key={choice.allocation.sellingPlanId} value={choice.allocation.sellingPlanId}>{choice.allocation.name}</option>)}</select></label>
                      <button disabled={!selected || cartLoading || addingProductId === `${product.id}-${selected.allocation.sellingPlanId}`} onClick={() => selected && handleSubscriptionAdd(product, selected)} className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-[#5B5B38] px-4 py-3 font-body text-[11px] uppercase tracking-[0.12em] text-[#F8F5F0] transition-colors hover:bg-[#424226] disabled:cursor-not-allowed disabled:opacity-50"><CalendarClock size={14} />{addingProductId === `${product.id}-${selected?.allocation.sellingPlanId}` ? "Wird hinzugefügt" : "Als Abo auswählen"}</button>
                    </article>;
                  })}
                </div> : <div className="border border-dashed border-[#BDB39D] bg-[#F8F5F0]/70 p-7" data-testid="native-shopify-subscription-entry"><CalendarClock size={22} className="text-[#5B5B38]" /><h3 className="mt-5 font-display text-3xl font-light">Dein Abo, direkt bei Shopify.</h3><p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-[#6D6A61]">Wähle dein Pflegeprodukt und starte dein Abo auf der sicheren Shopify-Produktseite. Dort wählst du den Lieferintervall, schließt den Vertrag im Shopify-Checkout ab und verwaltest ihn später im Kundenkonto.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{portalProducts.map(product => <a key={product.id} href={nativeShopifyProductUrl(product.handle)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 border border-[#D8D0BD] bg-white px-4 py-4 font-body text-xs uppercase tracking-[0.1em] text-[#4D5734] transition-colors hover:border-[#5B5B38] hover:bg-[#F5F1E8]"><span>{product.title}</span><ExternalLink size={15} /></a>)}</div><p className="mt-5 font-body text-xs leading-relaxed text-[#7A7568]">Individuelle Creme und individuelles Serum kannst du zunächst über deinen persönlichen Konfigurator zusammenstellen; die Abo-Option wird anschließend im Shopify-Checkout ergänzt.</p><a href={nativeShopifyAccountUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.12em] text-[#5B5B38] underline underline-offset-4">Bestehende Abos bei Shopify verwalten <ExternalLink size={14} /></a></div>}
              </div>
            </section>
          </>
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
