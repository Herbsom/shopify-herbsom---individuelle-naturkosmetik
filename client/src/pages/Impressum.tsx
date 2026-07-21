import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from "react-i18next";

export default function Impressum() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-stone-50 to-background pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Impressum</h1>
          <p className="text-lg text-muted-foreground">
            Rechtliche Informationen und Kontaktdaten von Herbsom.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-2 md:py-3">
        <div className="container max-w-3xl prose prose-stone dark:prose-invert">
          <div className="space-y-8">
            {/* Company Information */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-6">Anbieter und Betreiber</h2>
              
              <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-lg border border-stone-200 dark:border-stone-800 mb-8">
                <p className="font-semibold text-lg mb-4">ili Skincare GmbH</p>
                <p className="mb-2">Steinfurterstraße 51a</p>
                <p className="mb-2">48149 Münster</p>
                <p className="mb-4">Deutschland</p>
                
                <p className="mb-2"><strong>Telefon:</strong> +49 157 92475960</p>
                <p className="mb-4"><strong>E-Mail:</strong> <a href="mailto:info@herbsom.de">info@herbsom.de</a></p>
              </div>

              <h3 className="text-xl font-semibold mb-4">Geschäftsführung</h3>
              <p className="mb-4">
                Alica Klemm und Kathrin Fesenmeyer
              </p>

              <h3 className="text-xl font-semibold mb-4">Handelsregister</h3>
              <p className="mb-4">
                Amtsgericht Münster, HRB 18868
              </p>

              <h3 className="text-xl font-semibold mb-4">Umsatzsteuer-Identifikationsnummer</h3>
              <p className="mb-8">
                DE335789980
              </p>
            </div>

            {/* Responsible Person */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-6">Verantwortlich gemäß § 18 MStV</h2>
              
              <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-lg border border-stone-200 dark:border-stone-800">
                <p className="font-semibold mb-2">Kathrin Fesenemeyer</p>
                <p className="mb-2">Steinfurterstraße 51a</p>
                <p>48149 Münster</p>
              </div>
            </div>

            {/* Dispute Resolution */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-6">Außergerichtliche Streitbeilegung</h2>
              
              <p className="mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              
              <p className="mb-6">
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>

              <p className="mb-4">
                Wir sind bereit, an einem außergerichtlichen Schlichtungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Zuständig ist die Universalschlichtungsstelle des Bundes am Zentrum für Schlichtung e.V.:
              </p>

              <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-lg border border-stone-200 dark:border-stone-800 mb-6">
                <p className="font-semibold mb-2">Universalschlichtungsstelle des Bundes</p>
                <p className="mb-2">Zentrum für Schlichtung e.V.</p>
                <p className="mb-2">Straßburger Straße 8</p>
                <p className="mb-4">77694 Kehl am Rhein</p>
                
                <p>
                  <a href="https://www.verbraucher-schlichter.de" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    www.verbraucher-schlichter.de
                  </a>
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-stone-200 dark:border-stone-800">
              <p className="text-sm text-muted-foreground">
                © 2024 Herbsom · ili Skincare GmbH · Alle Rechte vorbehalten
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Individuelle Naturkosmetik · Made in Germany
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
