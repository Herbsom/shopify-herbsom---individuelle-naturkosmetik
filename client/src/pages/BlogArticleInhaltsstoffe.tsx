/**
 * Blog Article: Natürliche Inhaltsstoffe vs. Chemie
 */
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function BlogArticleInhaltsstoffe() {
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
                <span className="font-body text-xs text-[#7D7D5D]">8 min Lesezeit</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-[#F8F5F0] mb-4 font-light">
                Natürliche Inhaltsstoffe vs. Chemie
              </h1>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Verstehe den Unterschied zwischen natürlichen und synthetischen Inhaltsstoffen in der Hautpflege.
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

        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <article className="prose prose-lg max-w-none">
              <div className="bg-[#F0EBE3] rounded-sm aspect-video flex items-center justify-center mb-12 overflow-hidden">
                <div className="text-8xl">🧪</div>
              </div>

              <div className="mb-12">
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Eine der häufigsten Fragen in der Hautpflege ist: Sind natürliche Inhaltsstoffe besser als synthetische? Die Antwort ist komplexer als ein einfaches Ja oder Nein. In diesem Artikel erklären wir den Unterschied und helfen dir, die beste Wahl für deine Haut zu treffen.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Was sind natürliche Inhaltsstoffe?
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Natürliche Inhaltsstoffe stammen direkt aus der Natur – Pflanzen, Mineralien, Öle und Extrakte. Sie werden minimal verarbeitet und enthalten keine synthetischen Chemikalien.
                </p>
                <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                  <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Beispiele natürlicher Inhaltsstoffe:</h3>
                  <ul className="space-y-2">
                    <li className="font-body text-sm text-[#6B6B69]">• Hyaluronsäure (aus Fermentation)</li>
                    <li className="font-body text-sm text-[#6B6B69]">• Vitamin C (aus Kakadu-Pflaume)</li>
                    <li className="font-body text-sm text-[#6B6B69]">• Retinol (Vitamin A)</li>
                    <li className="font-body text-sm text-[#6B6B69]">• Grüntee-Extrakt</li>
                    <li className="font-body text-sm text-[#6B6B69]">• Jojobaöl</li>
                  </ul>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Was sind synthetische Inhaltsstoffe?
                </h2>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-4">
                  Synthetische Inhaltsstoffe werden im Labor hergestellt. Sie können natürliche Stoffe nachahmen oder völlig neue Verbindungen sein. Viele sind sicher und wirksam.
                </p>
                <div className="bg-[#F0EBE3] rounded-sm p-6 border-l-4 border-[#5B5B38]">
                  <h3 className="font-display text-lg text-[#1C1C1A] mb-3 font-light">Beispiele synthetischer Inhaltsstoffe:</h3>
                  <ul className="space-y-2">
                    <li className="font-body text-sm text-[#6B6B69]">• Niacinamide (Vitamin B3)</li>
                    <li className="font-body text-sm text-[#6B6B69]">• Peptide</li>
                    <li className="font-body text-sm text-[#6B6B69]">• Konservierungsmittel</li>
                    <li className="font-body text-sm text-[#6B6B69]">• Emulgatoren</li>
                  </ul>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Vorteile natürlicher Inhaltsstoffe
                </h2>
                <ul className="space-y-4">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Sanft zur Haut:</strong> Oft besser verträglich für empfindliche Haut.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Umweltfreundlich:</strong> Nachhaltig und biologisch abbaubar.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Antioxidantien:</strong> Viele natürliche Stoffe enthalten starke Antioxidantien.</span>
                  </li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light">
                  Vorteile synthetischer Inhaltsstoffe
                </h2>
                <ul className="space-y-4">
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Stabilität:</strong> Länger haltbar und konsistenter in der Wirkung.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Wirksam:</strong> Klinisch getestet und bewährt.</span>
                  </li>
                  <li className="font-body text-base text-[#6B6B69] leading-relaxed flex gap-3">
                    <span className="text-[#5B5B38] font-bold">✓</span>
                    <span><strong>Konzentration:</strong> Höhere Wirkstoffkonzentration möglich.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#F0EBE3] rounded-sm p-8 mb-12">
                <h3 className="font-display text-xl text-[#1C1C1A] mb-4 font-light">
                  Das Wichtigste
                </h3>
                <p className="font-body text-base text-[#6B6B69] leading-relaxed">
                  Es geht nicht darum, natürlich oder synthetisch zu wählen – es geht darum, die richtigen Inhaltsstoffe für deine Haut zu wählen. Die beste Hautpflege kombiniert oft beide: natürliche Inhaltsstoffe für ihre beruhigenden Eigenschaften und synthetische für ihre bewiesene Wirksamkeit.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light">
              Finde deine perfekte Formel
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Unsere Produkte kombinieren natürliche und wirksame Inhaltsstoffe für optimale Ergebnisse.
            </p>
            <a
              href="/products"
              className="inline-block border border-[#F8F5F0] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-8 py-3 hover:bg-[#F8F5F0] hover:text-[#5B5B38] transition-all duration-300"
            >
              Produkte entdecken
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
