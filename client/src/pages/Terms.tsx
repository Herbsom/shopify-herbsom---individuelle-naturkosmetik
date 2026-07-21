import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-stone-50 to-background pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-lg text-muted-foreground">
            Für alle Bestellungen über unseren Online-Shop gelten die nachfolgenden AGB.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-2 md:py-3">
        <div className="container max-w-3xl prose prose-stone dark:prose-invert">
          <div className="space-y-8">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">1. Geltungsbereich</h2>
              <p>
                Für alle Bestellungen über unseren Online-Shop gelten die nachfolgenden AGB. Unser Online-Shop richtet sich ausschließlich an Verbraucher.
              </p>
              <p>
                <strong>Verbraucher</strong> ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbstständigen beruflichen Tätigkeit zugerechnet werden können.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">2. Vertragspartner, Vertragsschluss, Korrekturmöglichkeiten</h2>
              <p>
                Der Kaufvertrag kommt zustande mit <strong>ili Skincare GmbH</strong>.
              </p>
              <p>
                Mit Einstellung der Produkte in den Online-Shop geben wir ein verbindliches Angebot zum Vertragsschluss über diese Artikel ab. Sie können unsere Produkte zunächst unverbindlich in den Warenkorb legen und Ihre Eingaben vor Absenden Ihrer verbindlichen Bestellung jederzeit korrigieren, indem Sie die hierfür im Bestellablauf vorgesehenen und erläuterten Korrekturhilfen nutzen.
              </p>
              <p>
                Der Vertrag kommt zustande, indem Sie durch Anklicken des Bestellbuttons das Angebot über die im Warenkorb enthaltenen Waren annehmen. Unmittelbar nach dem Absenden der Bestellung erhalten Sie noch einmal eine Bestätigung per E-Mail.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">3. Vertragssprache, Vertragstextspeicherung</h2>
              <p>
                <strong>Vertragssprache:</strong> Deutsch
              </p>
              <p>
                Wir speichern den Vertragstext und senden Ihnen die Bestelldaten und unsere AGB in Textform zu. Den Vertragstext können Sie in unserem Kunden-Login einsehen.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">4. Lieferbedingungen</h2>
              <p>
                Zuzüglich zu den angegebenen Produktpreisen können noch Versandkosten anfallen. Nähere Bestimmungen zu ggf. anfallenden Versandkosten erfahren Sie bei den Angeboten.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Wir liefern nur im Versandweg. Eine Selbstabholung der Ware ist leider nicht möglich.</li>
                <li>Wir liefern nicht an Packstationen.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">5. Bezahlung</h2>
              <p>
                In unserem Shop stehen Ihnen grundsätzlich die folgenden Zahlungsarten zur Verfügung:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">Kreditkarte</h3>
              <p>
                Im Bestellprozess geben Sie Ihre Kreditkartendaten an. Ihre Karte wird unmittelbar nach Abgabe der Bestellung belastet.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">PayPal</h3>
              <p>
                Um den Rechnungsbetrag über den Zahlungsdienstleister PayPal (Europe) S.à r.l. et Cie, S.C.A, 22-24 Boulevard Royal, L-2449 Luxembourg („PayPal") bezahlen zu können, müssen Sie bei PayPal registriert sein, sich mit Ihren Zugangsdaten legitimieren und die Zahlungsanweisung bestätigen. Die Zahlungstransaktion wird durch PayPal unmittelbar nach Abgabe der Bestellung durchgeführt.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">Klarna</h3>
              <p>
                In Zusammenarbeit mit dem Zahlungsdienstleister Klarna Bank AB (publ.), Sveavägen 46, 111 34 Stockholm, Schweden („Klarna") bieten wir Ihnen Zahlungsoptionen an. Die Zahlung über Klarna ist nur für Verbraucher verfügbar. Sofern nachfolgend nichts anderes geregelt ist, setzt die Zahlung über Klarna eine erfolgreiche Adress- und Bonitätsprüfung voraus und sie erfolgt direkt an Klarna.
              </p>
              <p className="mt-2">
                <strong>Kauf auf Rechnung via Klarna:</strong> Der Rechnungsbetrag ist 14 Tage nach Versand der Ware und Erhalt der Rechnung fällig.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">6. Eigentumsvorbehalt</h2>
              <p>
                Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">7. Transportschäden</h2>
              <p>
                Werden Waren mit offensichtlichen Transportschäden angeliefert, so reklamieren Sie solche Fehler bitte möglichst sofort beim Zusteller und nehmen Sie bitte unverzüglich Kontakt zu uns auf. Die Versäumung einer Reklamation oder Kontaktaufnahme hat für Ihre gesetzlichen Ansprüche und deren Durchsetzung, insbesondere Ihre Gewährleistungsrechte, keinerlei Konsequenzen. Sie helfen uns aber, unsere eigenen Ansprüche gegenüber dem Frachtführer bzw. der Transportversicherung geltend machen zu können.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">8. Gewährleistung und Garantien</h2>

              <h3 className="text-xl font-semibold mb-3">8.1 Mängelhaftungsrecht</h3>
              <p>
                Es gilt das gesetzliche Mängelhaftungsrecht.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">8.2 Garantien und Kundendienst</h3>
              <p>
                Informationen zu gegebenenfalls geltenden zusätzlichen Garantien und deren genaue Bedingungen finden Sie jeweils beim Produkt und auf besonderen Informationsseiten im Online-Shop.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">9. Haftung</h2>
              <p>
                Für Ansprüche aufgrund von Schäden, die durch uns, unsere gesetzlichen Vertreter oder Erfüllungsgehilfen verursacht wurden, haften wir stets unbeschränkt:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>bei Verletzung des Lebens, des Körpers oder der Gesundheit,</li>
                <li>bei vorsätzlicher oder grob fahrlässiger Pflichtverletzung,</li>
                <li>bei Garantieversprechen, soweit vereinbart, oder</li>
                <li>soweit der Anwendungsbereich des Produkthaftungsgesetzes eröffnet ist.</li>
              </ul>
              <p className="mt-4">
                Bei Verletzung wesentlicher Vertragspflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht und auf deren Einhaltung der Vertragspartner regelmäßig vertrauen darf, (Kardinalpflichten) durch leichte Fahrlässigkeit von uns, unseren gesetzlichen Vertretern oder Erfüllungsgehilfen ist die Haftung der Höhe nach auf den bei Vertragsschluss vorhersehbaren Schaden begrenzt, mit dessen Entstehung typischerweise gerechnet werden muss.
              </p>
              <p className="mt-4">
                Im Übrigen sind Ansprüche auf Schadensersatz ausgeschlossen.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">10. Streitbeilegung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. Wir sind bereit, an einem außergerichtlichen Schlichtungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
              <p className="mt-4">
                <strong>Zuständige Schlichtungsstelle:</strong><br />
                Universalschlichtungsstelle des Bundes am Zentrum für Schlichtung e.V.<br />
                Straßburger Straße 8<br />
                77694 Kehl am Rhein<br />
                <a href="https://www.verbraucher-schlichter.de" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  www.verbraucher-schlichter.de
                </a>
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mt-8">
              <h3 className="text-lg font-semibold mb-3">Kontakt</h3>
              <p>
                <strong>ili Skincare GmbH</strong><br />
                Steinfurterstraße 51a<br />
                48149 Münster<br />
                <a href="mailto:info@herbsom.de" className="text-primary hover:underline">info@herbsom.de</a><br />
                +49 157 92475960
              </p>
            </div>

            {/* Last Updated */}
            <div className="border-t border-stone-200 pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                Stand: Juni 2026
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
