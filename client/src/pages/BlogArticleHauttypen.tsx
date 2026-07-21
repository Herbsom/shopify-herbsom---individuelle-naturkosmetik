/**
 * Blog Article: Hauttypen verstehen
 * Design: Elegante Serif-Typografie, Grüntöne #5B5B38, #7D7D5D, #424226
 */
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function BlogArticleHauttypen() {
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
                  Grundlagen
                </span>
                <span className="font-body text-xs text-[#7D7D5D]">7 min Lesezeit</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-[#F8F5F0] mb-4 font-light">
                Hauttypen verstehen
              </h1>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Lerne die verschiedenen Hauttypen kennen und finde heraus, welche Pflege zu deiner Haut passt.
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
                  <p className="font-body text-sm text-[#1C1C1A]">Alica Herbsom</p>
                </div>
                <div>
                  <p className="font-body text-xs text-[#7D7D5D] mb-1 flex items-center gap-1">
                    <Calendar size={14} />
                    Veröffentlicht
                  </p>
                  <p className="font-body text-sm text-[#1C1C1A]">12. Juni 2026</p>
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
                <div className="text-8xl">🔍</div>
              </div>

              {/* Introduction */}
              <div className="mb-12">
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Der erste Schritt zu einer effektiven Hautpflege-Routine ist es, deinen Hauttyp zu verstehen. Denn nicht alle Produkte funktionieren für alle Haut gleich – was für trockene Haut perfekt ist, kann fettige Haut reizen.
                </p>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  In diesem Artikel erfährst du alles über die verschiedenen Hauttypen und wie du deine Haut richtig identifizierst.
                </p>
              </div>

              {/* Section 1 */}
              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Die 5 Hauttypen
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-6">
                  Es gibt fünf Hauptkategorien von Hauttypen. Jeder hat seine eigenen Merkmale und benötigt eine spezifische Pflege:
                </p>

                <div className="space-y-8">
                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-xl text-[#1C1C1A] mb-3 font-light">Normale Haut</h3>
                    <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-3">
                      Normale Haut ist gut ausbalanciert – nicht zu trocken, nicht zu ölig. Sie hat einen gleichmäßigen Teint und kleine Poren. Menschen mit normaler Haut haben meist weniger Hautprobleme.
                    </p>
                    <p className="font-body text-sm text-[#7D7D5D]"><strong>Pflege-Tipp:</strong> Halte deine Routine einfach mit einer sanften Reinigung und einer leichten Feuchtigkeitscreme.</p>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-xl text-[#1C1C1A] mb-3 font-light">Trockene Haut</h3>
                    <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-3">
                      Trockene Haut produziert weniger natürliche Öle und fühlt sich straff und rau an. Sie kann zu Rötungen, Schuppung und Irritationen neigen.
                    </p>
                    <p className="font-body text-sm text-[#7D7D5D]"><strong>Pflege-Tipp:</strong> Verwende reichhaltige Cremes und Seren mit feuchtigkeitsbindenden Wirkstoffen wie Hyaluronsäure.</p>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-xl text-[#1C1C1A] mb-3 font-light">Fettige Haut</h3>
                    <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-3">
                      Fettige Haut produziert zu viel Sebum (natürliches Öl). Sie glänzt oft, hat vergrößerte Poren und ist anfällig für Akne und Unreinheiten.
                    </p>
                    <p className="font-body text-sm text-[#7D7D5D]"><strong>Pflege-Tipp:</strong> Nutze leichte, ölfreie Produkte und regelmäßige Peelings zur Porenreinigung.</p>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-xl text-[#1C1C1A] mb-3 font-light">Mischhaut</h3>
                    <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-3">
                      Mischhaut ist eine Kombination aus verschiedenen Hauttypen. Typischerweise ist die T-Zone (Stirn, Nase, Kinn) ölig, während die Wangen trocken sind.
                    </p>
                    <p className="font-body text-sm text-[#7D7D5D]"><strong>Pflege-Tipp:</strong> Verwende ausgewogene Produkte, die beide Bereiche pflegen, oder nutze unterschiedliche Produkte für verschiedene Zonen.</p>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-xl text-[#1C1C1A] mb-3 font-light">Empfindliche Haut</h3>
                    <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-3">
                      Empfindliche Haut reagiert leicht auf Produkte, Umweltfaktoren oder Stress mit Rötungen, Brennen oder Juckreiz. Sie kann mit anderen Hauttypen kombiniert sein.
                    </p>
                    <p className="font-body text-sm text-[#7D7D5D]"><strong>Pflege-Tipp:</strong> Verwende sanfte, hypoallergene Produkte und vermeide reizende Inhaltsstoffe.</p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Wie erkennst du deinen Hauttyp?
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Der einfachste Weg, deinen Hauttyp zu bestimmen, ist ein einfacher Test:
                </p>
                <ol className="space-y-4 mb-6">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed">
                    <strong className="text-[#1C1C1A]">1. Reinige dein Gesicht:</strong> Wasche dein Gesicht gründlich mit einem milden Reiniger und tupfe es trocken.
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed">
                    <strong className="text-[#1C1C1A]">2. Warte 30 Minuten:</strong> Trage keine Produkte auf und warte eine halbe Stunde.
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed">
                    <strong className="text-[#1C1C1A]">3. Beobachte deine Haut:</strong> Wie fühlt sich deine Haut an? Ist sie straff und trocken, ölig und glänzend, oder ausgewogen?
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed">
                    <strong className="text-[#1C1C1A]">4. Nutze ein Tuch:</strong> Drücke ein Taschentuch auf verschiedene Bereiche deines Gesichts. Sichtbare Ölflecken deuten auf fettige Haut hin.
                  </li>
                </ol>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Alternativ kannst du auch unseren intelligenten Hauttest nutzen, der dir eine genaue Analyse und personalisierte Empfehlungen gibt.
                </p>
              </div>

              {/* Section 3 */}
              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Kann sich dein Hauttyp ändern?
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Ja, dein Hauttyp kann sich im Laufe der Zeit verändern. Faktoren, die dies beeinflussen, sind:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Alter:</strong> Mit zunehmendem Alter produziert die Haut weniger Öl und wird trockener.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Hormonelle Veränderungen:</strong> Menstruationszyklus, Schwangerschaft oder Menopause können den Hauttyp beeinflussen.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Jahreszeiten:</strong> Deine Haut kann im Winter trockener und im Sommer öliger werden.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Stress und Lebensstil:</strong> Schlaf, Ernährung und Stressabbau beeinflussen die Hautgesundheit.</span>
                  </li>
                </ul>
              </div>

              {/* Conclusion */}
              <div className="bg-[#F0EBE3] rounded-sm p-8 mb-12">
                <h3 className="font-display text-xl text-[#1C1C1A] mb-4 font-light">
                  Fazit
                </h3>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Dein Hauttyp zu kennen ist der Schlüssel zu einer effektiven Hautpflege-Routine. Mit dem richtigen Verständnis kannst du Produkte wählen, die wirklich zu deiner Haut passen und die besten Ergebnisse liefern. Denk daran, dass sich dein Hauttyp ändern kann – höre auf deine Haut und passe deine Routine entsprechend an!
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ─── CTA SECTION ──────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light">
              Entdecke deine perfekte Hautpflege
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Starte unseren intelligenten Hauttest und erhalte personalisierte Produktempfehlungen für deinen Hauttyp.
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
