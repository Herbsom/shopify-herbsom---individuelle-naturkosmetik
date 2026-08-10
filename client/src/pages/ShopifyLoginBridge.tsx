import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";

export default function ShopifyLoginBridge() {
  useEffect(() => {
    const destination = `/api/shopify/customer-account/login${window.location.search}`;
    const redirectTimer = window.setTimeout(() => window.location.replace(destination), 250);
    return () => window.clearTimeout(redirectTimer);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-24 text-[#1C1C1A] md:py-32">
      <div className="mx-auto max-w-xl border border-[#E3DDD0] bg-white p-8 text-center md:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEADF] text-[#5B5B38]"><ShieldCheck size={22} /></div>
        <p className="section-label mt-7">Mein Herbsom</p>
        <h1 className="mt-3 font-display text-4xl font-light md:text-5xl">Deine sichere Anmeldung<br /><em>wird vorbereitet.</em></h1>
        <p className="mx-auto mt-5 max-w-md font-body text-sm leading-relaxed text-[#67675F]">Wir leiten dich jetzt sicher zu Shopify weiter. Dort bestätigst du deine E-Mail-Adresse und kehrst danach automatisch zu deinem Herbsom-Konto zurück.</p>
        <div className="mx-auto mt-8 h-px w-16 bg-[#CFC6A9]" />
      </div>
    </main>
  );
}
