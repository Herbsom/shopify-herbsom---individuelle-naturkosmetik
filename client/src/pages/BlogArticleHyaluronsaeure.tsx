/**
 * Blog Article: Die Kraft der Hyaluronsäure
 * Design: Elegante Serif-Typografie, Grüntöne #5B5B38, #7D7D5D, #424226
 */
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function BlogArticleHyaluronsaeure() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 md:pt-24">
        {/* ─── HERO SECTION ─────────────────────────────────────────── */}
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
                <span className="font-body text-xs text-[#7D7D5D]">5 min Lesezeit</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-[#F8F5F0] mb-4 font-light">
                Die Kraft der Hyaluronsäure
              </h1>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Erfahre, warum Hyaluronsäure das Geheimnis für strahlende, pralle Haut ist und wie du sie optimal nutzt.
              </p>
            </div>
          </div>
        </section>

        {/* ─── ARTICLE METADATA ─────────────────────────────────────── */}
        <section className="py-8 md:py-12 border-b border-[#E5E0D8]">
          <div className="container max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-body text-xs text-[#7D7D5D] mb-1">Autor</p>
                  <p className="font-body text-sm text-[#1C1C1A]">Dr. Sarah Meyer</p>
                </div>
                <div>
                  <p className="font-body text-xs text-[#7D7D5D] mb-1 flex items-center gap-1">
                    <Calendar size={14} />
                    Veröffentlicht
                  </p>
                  <p className="font-body text-sm text-[#1C1C1A]">15. Juni 2026</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-[#5B5B38] hover:text-[#7D7D5D] transition-colors">
                <Share2 size={16} />
                <span className="font-body text-xs tracking-[0.12em] uppercase">Teilen</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── ARTICLE CONTENT ──────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <article className="prose prose-lg max-w-none">
              {/* Hero Image */}
              <div className="bg-[#F0EBE3] rounded-sm aspect-video flex items-center justify-center mb-12 overflow-hidden">
                <div className="text-8xl">🧪</div>
              </div>

              {/* Introduction */}
              <div className="mb-12">
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Hyaluronsäure ist einer der beliebtesten Wirkstoffe in der modernen Hautpflege – und das zu Recht. Dieser natürlich vorkommende Stoff ist ein echtes Multitalent, das deine Haut zum Strahlen bringt und sie tiefenwirksam mit Feuchtigkeit versorgt.
                </p>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  In diesem Artikel erfährst du alles über die Kraft der Hyaluronsäure, wie sie wirkt und wie du sie optimal in deine Skincare-Routine integrierst.
                </p>
              </div>

              {/* Section 1 */}
              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Was ist Hyaluronsäure?
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Hyaluronsäure (auch Hyaluronat genannt) ist ein natürlich vorkommender Zucker, der in unserem Körper – besonders in der Haut – zu finden ist. Sie ist bekannt für ihre außergewöhnliche Fähigkeit, Wasser zu speichern: Ein Gramm Hyaluronsäure kann bis zu 6 Liter Wasser binden.
                </p>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Mit zunehmendem Alter sinkt der natürliche Hyaluronsäure-Gehalt in unserer Haut. Das ist einer der Hauptgründe, warum unsere Haut im Laufe der Zeit an Elastizität und Strahlkraft verliert. Deshalb ist es so wichtig, Hyaluronsäure von außen zuzuführen.
                </p>
              </div>

              {/* Section 2 */}
              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Die Wirkung von Hyaluronsäure
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Die Hauptwirkung von Hyaluronsäure ist ihre intensive Feuchtigkeitsbindung. Sie wirkt wie ein Schwamm, der Wasser in der Haut speichert und so für ein pralleres, glatteres Hautbild sorgt.
                </p>
                <div className="bg-[#F0EBE3] rounded-sm p-6 mb-4 border-l-4 border-[#5B5B38]">
                  <p className="font-body text-sm text-[#1C1C1A]">
                    <strong>Tipp:</strong> Hyaluronsäure wirkt am besten auf feuchter Haut. Trage sie auf leicht feuchte Haut auf und versiegele sie mit einer Creme, um die Feuchtigkeitsbindung zu maximieren.
                  </p>
                </div>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Neben der Feuchtigkeitsbindung hat Hyaluronsäure auch antioxidative und entzündungshemmende Eigenschaften. Sie unterstützt die Hautbarriere und kann helfen, Rötungen zu reduzieren.
                </p>
              </div>

              {/* Section 3 */}
              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Für welche Hauttypen ist Hyaluronsäure geeignet?
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Das Beste an Hyaluronsäure: Sie ist für alle Hauttypen geeignet. Egal ob du trockene, fettige, normale oder Mischhaut hast – Hyaluronsäure kann deiner Haut helfen.
                </p>
                <ul className="space-y-3 mb-4">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Trockene Haut:</strong> Hyaluronsäure liefert intensive Feuchtigkeit und hilft, die Hautbarriere zu stärken.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Fettige Haut:</strong> Hyaluronsäure ist leicht und nicht komedogen – sie verstopft die Poren nicht.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Mischhaut:</strong> Sie balanciert den Feuchtigkeitshaushalt aus und sorgt für ein ebenmäßiges Hautbild.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Empfindliche Haut:</strong> Hyaluronsäure ist sanft und kann helfen, Irritationen zu beruhigen.</span>
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  So nutzt du Hyaluronsäure optimal
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Um das Beste aus Hyaluronsäure herauszuholen, solltest du ein paar einfache Regeln beachten:
                </p>
                <ol className="space-y-4 mb-4">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed">
                    <strong className="text-[#1C1C1A]">1. Auf feuchte Haut auftragen:</strong> Trage Hyaluronsäure auf leicht feuchte Haut auf, um die Feuchtigkeitsbindung zu maximieren.
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed">
                    <strong className="text-[#1C1C1A]">2. Mit einer Creme versiegeln:</strong> Folge mit einer Feuchtigkeitscreme, um die Hyaluronsäure zu versiegeln und die Feuchtigkeit in der Haut zu halten.
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed">
                    <strong className="text-[#1C1C1A]">3. Konsistenz ist wichtig:</strong> Verwende Hyaluronsäure regelmäßig, um die besten Ergebnisse zu erzielen.
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed">
                    <strong className="text-[#1C1C1A]">4. Kombiniere mit anderen Wirkstoffen:</strong> Hyaluronsäure lässt sich gut mit anderen Wirkstoffen wie Vitamin C oder Niacinamide kombinieren.
                  </li>
                </ol>
              </div>

              {/* Conclusion */}
              <div className="bg-[#F0EBE3] rounded-sm p-8 mb-12">
                <h3 className="font-display text-xl text-[#1C1C1A] mb-4 font-light">
                  Fazit
                </h3>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Hyaluronsäure ist ein vielseitiger und effektiver Wirkstoff, der für alle Hauttypen geeignet ist. Mit ihrer außergewöhnlichen Fähigkeit, Wasser zu speichern, sorgt sie für ein pralleres, glatteres und strahlendes Hautbild. Wenn du noch nicht Hyaluronsäure in deine Skincare-Routine integriert hast, ist jetzt der perfekte Zeitpunkt, es zu versuchen!
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ─── RELATED ARTICLES ─────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#F0EBE3]">
          <div className="container max-w-5xl">
            <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1A] mb-12 text-center font-light">
              Weitere interessante Artikel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Vitamin C – Der Glow-Booster",
                  excerpt: "Entdecke die Wirkung von Vitamin C und wie es deine Haut strahlender macht.",
                  category: "Wirkstoffe",
                  image: "🍊",
                },
                {
                  title: "Die perfekte Skincare-Routine",
                  excerpt: "Schritt-für-Schritt Anleitung für eine effektive Morgen- und Abendroutine.",
                  category: "Anwendung",
                  image: "✨",
                },
                {
                  title: "Hauttypen verstehen",
                  excerpt: "Lerne die verschiedenen Hauttypen kennen und finde heraus, welche Pflege passt.",
                  category: "Grundlagen",
                  image: "🔍",
                },
              ].map((article, idx) => (
                <Link key={idx} href="/blog" className="group cursor-pointer">
                  <div className="bg-white rounded-sm aspect-video flex items-center justify-center mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="text-5xl">{article.image}</div>
                  </div>
                  <div>
                    <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-2 py-1 mb-3">
                      {article.category}
                    </span>
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-2 font-light group-hover:text-[#5B5B38] transition-colors">
                      {article.title}
                    </h3>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA SECTION ──────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light">
              Bereit für deine individuelle Hautpflege?
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Starte unseren intelligenten Hauttest und erhalte personalisierte Produktempfehlungen mit Hyaluronsäure und anderen Wirkstoffen.
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
