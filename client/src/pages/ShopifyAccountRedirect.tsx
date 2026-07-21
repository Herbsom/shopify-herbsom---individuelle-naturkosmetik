import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { ExternalLink, Loader2, UserRound } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ShopifyAccountRedirect() {
  const { data, isLoading, isError } = trpc.commerce.customerAccount.useQuery();
  const redirected = useRef(false);

  useEffect(() => {
    if (data?.url && !redirected.current) {
      redirected.current = true;
      window.location.assign(data.url);
    }
  }, [data?.url]);

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <Navigation />
      <main className="flex min-h-[78vh] items-center py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl border border-[#E5E0D8] bg-white p-10 text-center md:p-16">
            <UserRound size={42} className="mx-auto mb-6 text-[#5B5B38]" strokeWidth={1.4} />
            <p className="section-label mb-3">Shopify Kundenkonto</p>
            <h1 className="font-display text-3xl font-light text-[#1C1C1A] md:text-5xl">
              {isError ? "Kundenkonto nicht erreichbar" : "Weiter zu deinem Kundenkonto"}
            </h1>
            <p className="mx-auto mt-5 max-w-lg font-body text-sm leading-relaxed text-[#6B6B69]">
              Anmeldung, Profil, Adressen und Bestellhistorie werden sicher direkt von Shopify bereitgestellt.
            </p>

            {isLoading && (
              <div className="mt-8 flex items-center justify-center gap-2 font-body text-xs uppercase tracking-[0.14em] text-[#5B5B38]">
                <Loader2 size={15} className="animate-spin" />
                Shopify wird geöffnet
              </div>
            )}

            {data?.url && (
              <a
                href={data.url}
                className="mt-8 inline-flex items-center justify-center gap-2 bg-[#5B5B38] px-7 py-4 font-body text-xs uppercase tracking-[0.14em] text-[#F8F5F0] transition-all hover:bg-[#424226] active:scale-[0.97]"
              >
                <ExternalLink size={15} />
                Shopify-Kundenkonto öffnen
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
