/**
 * Blog Article: Sonnenschutz im Sommer
 */
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function BlogArticleSonnenschutz() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 md:pt-24">
        <section className="py-12 md:py-16 bg-[#5B5B38]">
          <div className="container max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#E8E3DB] hover:text-[#F8F5F0] transition-colors mb-6">
              <ArrowLeft size={16} />
              <span className="font-body text-xs tracking-[0.12em] uppercase">Zurück zum Blog</span>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-2 py-1">
                  Tipps
                </span>
                <span className="font-body text-xs text-[#7D7D5D]">7 min Lesezeit</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-[#F8F5F0] mb-4 font-light">
                Sonnenschutz im Sommer
              </h1>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Warum Sonnenschutz nicht nur im Sommer wichtig ist und wie du deine Haut optimal schützt.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 border-b border-[#E5E0D8]">
          <div className="container max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-body text-xs text-[#7D7D5D] mb-1">Autor</p>
                  <p className="font-body text-sm text-[#1C1C1A]">Alica Herbsom</p>
                </div>
                <div>
                  <p className="font-body text-xs text-[#7D7D5D] mb-1 flex items-center gap-1">
                    <Calendar size={14} />
                    Veröffentlicht
                  </p>
                  <p className="font-body text-sm text-[#1C1C1A]">19. Juni 2026</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-[#5B5B38] hover:text-[#7D7D5D] transition-colors">
                <Share2 size={16} />
                <span className="font-body text-xs tracking-[0.12em] uppercase">Teilen</span>
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <article className="prose prose-lg max-w-none">
              <div className="bg-[#F0EBE3] rounded-sm aspect-video flex items-center justify-center mb-12 overflow-hidden">
                <div className="text-8xl">☀️</div>
              </div>

              <div className="mb-12">
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Sonnenschutz ist nicht nur eine Sommerpflicht – es ist das wichtigste Anti-Aging-Produkt, das du verwenden kannst. UV-Strahlen sind die Hauptursache für vorzeitige Hautalterung, Flecken und sogar Hautkrebs. Hier erfährst du alles, was du über Sonnenschutz wissen musst.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Warum ist Sonnenschutz so wichtig?
                </h2>
                <div className="space-y-4">
                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-2 font-light">UVA-Strahlen</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Dringen tief in die Haut ein und verursachen Falten, Flecken und Elastizitätsverlust.</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-2 font-light">UVB-Strahlen</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Verursachen Sonnenbrand und sind die Hauptursache für Hautkrebs.</p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  SPF erklärt
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-6">
                  SPF (Sun Protection Factor) zeigt, wie lange du in der Sonne bleiben kannst, ohne einen Sonnenbrand zu bekommen:
                </p>
                <ul className="space-y-3">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>SPF 30:</strong> Blockiert etwa 97% der UVB-Strahlen</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>SPF 50:</strong> Blockiert etwa 98% der UVB-Strahlen</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>SPF 50+:</strong> Blockiert 99% der UVB-Strahlen</span>
                  </li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Sonnenschutz richtig anwenden
                </h2>
                <div className="space-y-4">
                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Die richtige Menge</h3>
                    <p className="font-body text-sm text-[#6B6B69] mb-3">Verwende etwa 1/4 Teelöffel (eine Erbse große Menge) für dein Gesicht. Viele Menschen verwenden zu wenig!</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Timing</h3>
                    <p className="font-body text-sm text-[#6B6B69] mb-3">Trage Sonnenschutz als letzten Schritt deiner Morgenroutine auf, mindestens 15 Minuten vor dem Sonneneintritt.</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Wiederauftragen</h3>
                    <p className="font-body text-sm text-[#6B6B69] mb-3">Trage Sonnenschutz alle 2 Stunden erneut auf, besonders nach dem Schwimmen oder Schwitzen.</p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Sonnenschutz ganzjährig
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Viele Menschen denken, dass Sonnenschutz nur im Sommer wichtig ist. Das ist ein großer Fehler! UV-Strahlen sind das ganze Jahr über vorhanden, auch an bewölkten Tagen und im Winter.
                </p>
                <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                  <p className="font-body text-sm text-[#6B6B69]">
                    <strong>Tipp:</strong> Mache Sonnenschutz zu einem täglichen Ritual, genauso wie Zähneputzen. Es ist das beste Geschenk, das du deiner Haut machen kannst!
                  </p>
                </div>
              </div>

              <div className="bg-[#F0EBE3] rounded-sm p-8 mb-12">
                <h3 className="font-display text-xl text-[#1C1C1A] mb-4 font-light">
                  Fazit
                </h3>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Sonnenschutz ist nicht verhandelbar – es ist das wichtigste Produkt in deiner Skincare-Routine. Mit dem richtigen Sonnenschutz kannst du deine Haut vor Schäden schützen und vorzeitige Hautalterung verhindern. Mache es zur Gewohnheit!
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light">
              Schütze deine Haut
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Entdecke unseren hochwertigen Sonnenschutz SPF 50+ für optimalen Schutz.
            </p>
            <a
              href="/product/sunscreen"
              className="inline-block border border-[#F8F5F0] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-8 py-3 hover:bg-[#F8F5F0] hover:text-[#5B5B38] transition-all duration-300"
            >
              Sonnenschutz entdecken
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
