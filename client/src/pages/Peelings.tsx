/**
 * Peelings Collection Page – Herbsom Peelings
 * Design: Elegante Serif-Typografie, Grüntöne #5B5B38, #7D7D5D, #424226
 * Zwei Peeling-Produkte: BHA & Azelainsäure + AHA & PHA
 */
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import ShopifyProductPrice from "@/components/ShopifyProductPrice";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";
export default function Peelings() {
  const { t } = useTranslation();
  const peelings = [
    {
      id: "bha",
      name: "BHA & Azelainsäure Peeling",
      subtitle: "Für Mischhaut, ölige & normale Haut",
      description: "Entfernt überschüssigen Talg porentief. Sichtbar reinere Haut: Gegen Mitesser & Pickel.",
      benefits: ["Porentief-Reinigung", "Talg-Entfernung", "Gegen Mitesser & Pickel"],
      image: "/manus-storage/004-BHAAzelainsaeurePeeling_1x1_e9bcbca7-7814a63c_7ffc4f85.webp",
      slug: "peeling",
      handle: "bha-azelainsaure-peeling",
    },
    {
      id: "aha",
      name: "AHA & PHA Peeling",
      subtitle: "Für alle Hauttypen",
      description: "Sanfte chemische Exfoliation für strahlende Haut. Mit AHA & PHA für optimale Zellerneuerung.",
      benefits: ["Sanfte Exfoliation", "Zellerneuerung", "Strahlende Haut"],
      image: "/manus-storage/001-AHA-PHAPeeling_1x1_c777c7c7-acdf8796_ee21ec00.webp",
      slug: "peeling-aha",
      handle: "aha-pha-peeling",
    }
  ];
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 md:pt-24">
        {/* ─── HERO SECTION ─────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-4xl">
            <div className="text-center">
              <span className="inline-block font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-3 py-1 mb-6">
                Exfoliation
              </span>
              <h1
                className="font-display text-4xl md:text-5xl text-[#F8F5F0] mb-6 font-light"
              >
                Unsere Peelings
              </h1>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed max-w-2xl mx-auto">
                Regelmäßige Exfoliation ist essentiell für strahlende Haut. Entdecke unsere zwei speziell entwickelten Peelings für unterschiedliche Hautbedürfnisse.
              </p>
            </div>
          </div>
        </section>
        {/* ─── PRODUCTS GRID ────────────────────────────────────────── */}
        <section className="py-20 md:py-32">
          <div className="container max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {peelings.map((peeling) => (
                <Link key={peeling.id} href={`/product/${peeling.slug}`}>
                  <div className="group cursor-pointer">
                    {/* Product Image */}
                    <div className="bg-transparent rounded-sm aspect-square flex items-center justify-center mb-8 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      {typeof peeling.image === 'string' && peeling.image.startsWith('/') ? (
                        <img src={peeling.image} alt={peeling.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-8xl">{peeling.image}</div>
                      )}
                    </div>
                    {/* Product Info */}
                    <div>
                      <p className="section-label text-[#5B5B38] mb-3">
                        {peeling.subtitle}
                      </p>
                      <h3
                        className="font-display text-3xl text-[#1C1C1A] mb-4 font-light group-hover:text-[#5B5B38] transition-colors"
                      >
                        {peeling.name}
                      </h3>
                      <p className="font-body text-base text-[#4A4A48] leading-relaxed mb-4">
                        {peeling.description}
                      </p>
                      <ShopifyProductPrice
                        handle={peeling.handle}
                        showFrom={false}
                        className="mb-6 font-display text-2xl text-[#5B5B38]"
                      />
                      {/* Benefits */}
                      <div className="mb-8 space-y-2">
                        {peeling.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-[#5B5B38] rounded-full"></div>
                            <span className="font-body text-sm text-[#4A4A48]">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* CTA */}
                      <div className="flex flex-col gap-4">
                        <Link href={`/product/${peeling.slug}`} className="flex items-center gap-2 text-[#5B5B38] font-body text-xs tracking-[0.12em] uppercase group-hover:gap-3 transition-all">
                          Mehr erfahren
                          <ArrowRight size={16} />
                        </Link>
                        <ShopifyPurchaseButton
                          item={{
                            id: peeling.id,
                            name: peeling.name,
                            quantity: 1,
                            description: peeling.subtitle,
                          }}
                          wrapperClassName="w-full"
                          className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-6 py-3 rounded-sm hover:bg-[#424226] transition-colors duration-300"
                        >
                          In den Warenkorb
                        </ShopifyPurchaseButton>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* ─── CTA SECTION ──────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2
              className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light"
            >
              Finde dein perfektes Peeling
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Nicht sicher, welches Peeling zu dir passt? Starte unseren Hauttest und erhalte personalisierte Empfehlungen.
            </p>
            <a
              href="/hauttest"
              className="inline-block border border-[#F8F5F0] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-8 py-3 hover:bg-[#F8F5F0] hover:text-[#5B5B38] transition-all duration-300"
            >
              Hauttest starten
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
