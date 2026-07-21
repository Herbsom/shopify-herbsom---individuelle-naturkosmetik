/**
 * Blog Article: Vitamin C – Der Glow-Booster
 */
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function BlogArticleVitaminC() {
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
                  Wirkstoffe
                </span>
                <span className="font-body text-xs text-[#7D7D5D]">6 min Lesezeit</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-[#F8F5F0] mb-4 font-light">
                Vitamin C – Der Glow-Booster
              </h1>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Entdecke, warum Vitamin C der Wirkstoff ist, den deine Haut braucht, um zu strahlen.
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
                  <p className="font-body text-sm text-[#1C1C1A]">20. Juni 2026</p>
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
                <div className="text-8xl">✨</div>
              </div>

              <div className="mb-12">
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Wenn es um Wirkstoffe geht, die wirklich einen Unterschied machen, steht Vitamin C ganz oben auf der Liste. Dieser Powerhouse-Inhaltsstoff ist bekannt für seine Fähigkeit, die Haut zum Strahlen zu bringen und gleichzeitig Zeichen der Hautalterung zu bekämpfen. Hier erfährst du alles über diesen Game-Changer.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Was ist Vitamin C?
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Vitamin C (Ascorbinsäure) ist ein starkes Antioxidans, das deine Haut vor freien Radikalen schützt. Es ist auch essentiell für die Kollagenproduktion, die deine Haut straff und jugendlich hält.
                </p>
                <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                  <p className="font-body text-sm text-[#6B6B69]">
                    <strong>Wichtig:</strong> Deine Haut kann Vitamin C nicht selbst produzieren – deshalb musst du es topisch anwenden, um von seinen Vorteilen zu profitieren.
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Die Vorteile von Vitamin C
                </h2>
                <div className="space-y-4">
                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-2 font-light">Heller und strahlender</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Vitamin C hemmt die Melaninproduktion und hilft, dunkle Flecken und Verfärbungen zu verblassen.</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-2 font-light">Anti-Aging</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Es stimuliert die Kollagenproduktion und reduziert das Erscheinungsbild von Falten und feinen Linien.</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-2 font-light">Antioxidativer Schutz</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Schützt deine Haut vor Umweltschäden und UV-Strahlen (ergänzt aber nicht den Sonnenschutz!).</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-2 font-light">Entzündungshemmend</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Hilft, Rötungen und Irritationen zu beruhigen.</p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Wie man Vitamin C richtig anwendet
                </h2>
                <div className="space-y-4">
                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Timing</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Verwende Vitamin C-Seren morgens nach der Reinigung, bevor du deine Feuchtigkeitscreme aufträgst. Vitamin C ist am wirksamsten, wenn es auf sauberer Haut angewendet wird.</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Konzentration</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Suche nach Produkten mit 10-20% Vitamin C für optimale Ergebnisse. Höhere Konzentrationen können reizend sein.</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Lagerung</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Vitamin C oxidiert schnell. Lagere dein Serum an einem kühlen, dunklen Ort und verwende es innerhalb von 3 Monaten nach dem Öffnen.</p>
                  </div>
                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Geduld</h3>
                    <p className="font-body text-sm text-[#6B6B69]">Gib Vitamin C mindestens 4-6 Wochen, um sichtbare Ergebnisse zu zeigen. Konsistenz ist der Schlüssel!</p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Vitamin C und andere Wirkstoffe
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Vitamin C funktioniert besonders gut mit:
                </p>
                <ul className="space-y-3">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Vitamin E:</strong> Verstärkt die antioxidative Wirkung</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Hyaluronsäure:</strong> Erhöht die Hydration</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Feuchtigkeitscreme:</strong> Versiegelt die Vorteile</span>
                  </li>
                </ul>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mt-4">
                  Vermeide es, Vitamin C mit Retinol oder AHAs/BHAs zu kombinieren, da dies reizend sein kann.
                </p>
              </div>

              <div className="bg-[#F0EBE3] rounded-sm p-8 mb-12">
                <h3 className="font-display text-xl text-[#1C1C1A] mb-4 font-light">
                  Fazit
                </h3>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Vitamin C ist ein bewährter Wirkstoff, der wirklich funktioniert. Mit regelmäßiger Anwendung wirst du eine hellere, strahlendere und jugendlichere Haut bemerken. Es ist das perfekte Serum für alle, die ihrem Teint einen Glow-Boost geben möchten!
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light">
              Lass deine Haut strahlen
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Entdecke unser Vitamin C Serum und erlebe den Glow-Booster-Effekt selbst.
            </p>
            <a
              href="/#hauttest"
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
