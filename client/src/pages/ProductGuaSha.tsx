import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ShopifyProductGallery from "@/components/ShopifyProductGallery";
import ShopifyProductPrice from "@/components/ShopifyProductPrice";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";
import { Link } from "wouter";

const GUA_SHA_IMAGES = [
  {
    url: "https://cdn.shopify.com/s/files/1/0517/5702/3400/files/hf_20260618_101521_5f7c0ade-0380-49e9-85a5-c4a9b90d6395_1.png?v=1786100350",
    altText: "Gua Sha Jade aus echter Jade",
  },
] as const;

export default function ProductGuaSha() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F5F0]">
      <Navigation />
      <main className="flex-1 pt-20 md:pt-24">
        <section className="py-12 md:py-16">
          <div className="container">
            <Link
              href="/cart"
              className="mb-8 inline-flex font-body text-xs uppercase tracking-[0.14em] text-[#5B5B38] transition-colors hover:text-[#424226]"
            >
              Zurück zum Warenkorb
            </Link>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
              <ShopifyProductGallery
                handle="gua-sha-jade-stein"
                alt="Gua Sha Jade"
                referenceImages={GUA_SHA_IMAGES}
                className="aspect-square rounded-sm bg-white"
                imageClassName="h-full w-full object-contain"
              />

              <div className="flex flex-col">
                <div className="mb-6">
                  <span className="mb-4 inline-block border border-[#7D7D5D] px-3 py-1 font-body text-[10px] uppercase tracking-[0.15em] text-[#7D7D5D]">
                    Pflege-Accessoire
                  </span>
                  <h1 className="mb-4 font-display text-4xl font-light text-[#1C1C1A] md:text-5xl">
                    Gua Sha Jade
                  </h1>
                  <ShopifyProductPrice
                    handle="gua-sha-jade-stein"
                    showFrom={false}
                    className="font-display text-3xl font-light text-[#5B5B38]"
                  />
                </div>

                <p className="mb-8 font-body text-base leading-relaxed text-[#6B6B69]">
                  Ein Gua-Sha-Stein aus echter Jade für dein persönliches Pflegeritual. Die glatt polierte Form liegt angenehm in der Hand und eignet sich für eine sanfte Gesichtsmassage.
                </p>

                <div className="mb-8 space-y-3 border-b border-[#E5E0D8] pb-8">
                  {[
                    "Aus echter Jade gefertigt",
                    "Glatt polierte, angenehm kühlende Oberfläche",
                    "Für die sanfte Gesichtsmassage geeignet",
                    "Ideal als Ergänzung zu deinem Serum oder deiner Creme",
                  ].map(feature => (
                    <div key={feature} className="flex items-start gap-3">
                      <span className="mt-1 font-semibold text-[#5B5B38]">✓</span>
                      <span className="font-body text-sm text-[#6B6B69]">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-body text-sm text-[#6B6B69]">Menge:</span>
                    <div className="flex items-center border border-[#E5E0D8]">
                      <button
                        type="button"
                        onClick={() => setQuantity(current => Math.max(1, current - 1))}
                        className="p-2 transition-colors hover:bg-[#F0EBE3]"
                        aria-label="Menge verringern"
                      >
                        <Minus size={16} className="text-[#5B5B38]" />
                      </button>
                      <span className="px-4 font-body text-sm">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(current => current + 1)}
                        className="p-2 transition-colors hover:bg-[#F0EBE3]"
                        aria-label="Menge erhöhen"
                      >
                        <Plus size={16} className="text-[#5B5B38]" />
                      </button>
                    </div>
                  </div>

                  <ShopifyPurchaseButton
                    item={{ id: "gua-sha-jade-stein", name: "Gua Sha Jade", quantity }}
                    wrapperClassName="w-full"
                    className="w-full bg-[#5B5B38] px-6 py-3 font-body text-xs uppercase tracking-[0.12em] text-[#F8F5F0] transition-all duration-200 hover:bg-[#424226] active:scale-[0.97]"
                  >
                    In den Warenkorb
                  </ShopifyPurchaseButton>

                  <div className="space-y-2 border-t border-[#E5E0D8] pt-4 text-center">
                    <p className="font-body text-xs text-[#6B6B69]">✓ Kostenloser Versand ab 60 €</p>
                    <p className="font-body text-xs text-[#6B6B69]">✓ 30 Tage Rückgabe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#E5E0D8] bg-white py-14 md:py-20">
          <div className="container max-w-4xl">
            <p className="section-label mb-3">Anwendung</p>
            <h2 className="mb-6 font-display text-3xl font-light text-[#1C1C1A] md:text-4xl">Dein Moment für bewusste Pflege</h2>
            <p className="font-body text-sm leading-relaxed text-[#6B6B69] md:text-base">
              Verwende den Gua-Sha-Stein auf gereinigter Haut mit ausreichend Gleitfähigkeit, beispielsweise nach dem Auftragen deines Serums oder deiner Creme. Reinige den Stein nach der Anwendung mit einem weichen, leicht feuchten Tuch und bewahre ihn trocken auf.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
