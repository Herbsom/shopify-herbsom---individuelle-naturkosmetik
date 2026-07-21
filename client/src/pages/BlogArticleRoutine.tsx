/**
 * Blog Article: Die perfekte Skincare-Routine
 */
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function BlogArticleRoutine() {
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
                  Anwendung
                </span>
                <span className="font-body text-xs text-[#7D7D5D]">6 min Lesezeit</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-[#F8F5F0] mb-4 font-light">
                Die perfekte Skincare-Routine
              </h1>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Lerne, wie du eine effektive Hautpflege-Routine aufbaust, die zu deiner Haut passt.
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
                  <p className="font-body text-sm text-[#1C1C1A]">18. Juni 2026</p>
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
                  Eine gute Skincare-Routine ist der Grundstein für gesunde, strahlende Haut. Aber wie viele Schritte brauchst du wirklich? Und in welcher Reihenfolge solltest du deine Produkte anwenden? Hier erfährst du alles, was du wissen musst.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Die 5-Schritte-Routine
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-6">
                  Eine effektive Routine muss nicht kompliziert sein. Diese 5 Schritte bilden die Grundlage:
                </p>

                <div className="space-y-6">
                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">1. Reinigung</h3>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Reinige dein Gesicht morgens und abends mit einem sanften Reiniger, der zu deinem Hauttyp passt. Dies entfernt Schmutz, Öl und Make-up.
                    </p>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">2. Tonisierung (optional)</h3>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Ein Toner hilft, den pH-Wert der Haut auszugleichen und bereitet sie auf die nächsten Produkte vor. Besonders wichtig für fettige oder unreine Haut.
                    </p>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">3. Serum</h3>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Seren sind konzentrierte Wirkstoffe, die tief in die Haut eindringen. Trage ein Serum auf, das zu deinen Hautzielen passt (z.B. Vitamin C für Helligkeit, Hyaluronsäure für Hydration).
                    </p>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">4. Feuchtigkeitspflege</h3>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Eine gute Creme versiegelt die Feuchtigkeit und schützt deine Haut. Wähle eine Textur, die zu deinem Hauttyp passt (leicht für fettige Haut, reichhaltig für trockene Haut).
                    </p>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">5. Sonnenschutz (morgens)</h3>
                    <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                      Sonnenschutz ist das wichtigste Anti-Aging-Produkt. Trage morgens einen Sonnenschutz mit mindestens SPF 30 auf, um deine Haut vor UV-Schäden zu schützen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Morgen- vs. Abendroutine
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-6">
                  Deine Routine kann sich morgens und abends unterscheiden:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-4 font-light">Morgenroutine</h3>
                    <ol className="space-y-2">
                      <li className="font-body text-sm text-[#6B6B69]">1. Reinigung</li>
                      <li className="font-body text-sm text-[#6B6B69]">2. Toner (optional)</li>
                      <li className="font-body text-sm text-[#6B6B69]">3. Serum (z.B. Vitamin C)</li>
                      <li className="font-body text-sm text-[#6B6B69]">4. Feuchtigkeitscreme</li>
                      <li className="font-body text-sm text-[#6B6B69]">5. Sonnenschutz</li>
                    </ol>
                  </div>

                  <div className="bg-[#F0EBE3] rounded-sm p-6">
                    <h3 className="font-display text-lg text-[#1C1C1A] mb-4 font-light">Abendroutine</h3>
                    <ol className="space-y-2">
                      <li className="font-body text-sm text-[#6B6B69]">1. Reinigung</li>
                      <li className="font-body text-sm text-[#6B6B69]">2. Toner (optional)</li>
                      <li className="font-body text-sm text-[#6B6B69]">3. Serum (z.B. Retinol)</li>
                      <li className="font-body text-sm text-[#6B6B69]">4. Feuchtigkeitscreme</li>
                      <li className="font-body text-sm text-[#6B6B69]">5. Augencreme (optional)</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Tipps für eine erfolgreiche Routine
                </h2>
                <ul className="space-y-4">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Konsistenz:</strong> Führe deine Routine täglich durch – Ergebnisse zeigen sich nach 4-6 Wochen.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Weniger ist mehr:</strong> Beginne mit wenigen Produkten und füge nach Bedarf hinzu.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Reihenfolge:</strong> Trage Produkte von dünnflüssig zu dickflüssig auf.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">•</span>
                    <span><strong>Geduld:</strong> Neue Produkte brauchen Zeit, um zu wirken – gib ihnen mindestens 2-4 Wochen.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#F0EBE3] rounded-sm p-8 mb-12">
                <h3 className="font-display text-xl text-[#1C1C1A] mb-4 font-light">
                  Deine personalisierte Routine
                </h3>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Jede Haut ist unterschiedlich. Nutze unseren Hauttest, um eine personalisierte Routine zu erhalten, die perfekt zu deinem Hauttyp und deinen Zielen passt.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light">
              Starte deine Routine heute
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Entdecke die perfekten Produkte für deine personalisierte Skincare-Routine.
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
