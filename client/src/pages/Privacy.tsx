import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from "react-i18next";

export default function Privacy() {
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
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Datenschutzerklärung</h1>
          <p className="text-lg text-muted-foreground">
            Der Schutz Ihrer Privatsphäre ist für uns sehr wichtig. Nachstehend informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-2 md:py-3">
        <div className="container max-w-3xl prose prose-stone dark:prose-invert">
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
              <h3 className="text-lg font-semibold mb-3">Verantwortlicher für die Datenverarbeitung</h3>
              <p className="mb-2">
                <strong>ili Skincare GmbH</strong><br />
                Steinfurterstraße 51a<br />
                48149 Münster<br />
                <a href="mailto:info@herbsom.de" className="text-primary hover:underline">info@herbsom.de</a>
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">1. Zugriffsdaten und Hosting</h2>
              <p>
                Sie können unsere Webseiten besuchen, ohne Angaben zu Ihrer Person zu machen. Bei jedem Aufruf einer Webseite speichert der Webserver lediglich automatisch ein sogenanntes Server-Logfile, das z.B. den Namen der angeforderten Datei, Ihre IP-Adresse, Datum und Uhrzeit des Abrufs, übertragene Datenmenge und den anfragenden Provider (Zugriffsdaten) enthält und den Abruf dokumentiert.
              </p>
              <p>
                Diese Zugriffsdaten werden ausschließlich zum Zwecke der Sicherstellung eines störungsfreien Betriebs der Seite sowie der Verbesserung unseres Angebots ausgewertet. Dies dient der Wahrung unserer im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen an einer korrekten Darstellung unseres Angebots gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO. Alle Zugriffsdaten werden spätestens sieben Tage nach Ende Ihres Seitenbesuchs gelöscht.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">2. Datenverarbeitung zur Vertragsabwicklung und zur Kontaktaufnahme</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Datenverarbeitung zur Vertragsabwicklung</h3>
              <p>
                Zum Zwecke der Vertragsabwicklung gemäß Art. 6 Abs. 1 S. 1 lit. b DSGVO erheben wir personenbezogene Daten, wenn Sie uns diese im Rahmen Ihrer Bestellung freiwillig mitteilen. Pflichtfelder werden als solche gekennzeichnet, da wir in diesen Fällen die Daten zwingend zur Vertragsabwicklung benötigen und wir ohne deren Angabe die Bestellung nicht versenden können.
              </p>
              <p>
                Weitere Informationen zu der Verarbeitung Ihrer Daten, insbesondere zu der Weitergabe an unsere Dienstleister zum Zwecke der Bestellungs-, Zahlungs- und Versandabwicklung, finden Sie in den nachfolgenden Abschnitten dieser Datenschutzerklärung. Nach vollständiger Abwicklung des Vertrages werden Ihre Daten für die weitere Verarbeitung eingeschränkt und nach Ablauf der steuer- und handelsrechtlichen Aufbewahrungsfristen gemäß Art. 6 Abs. 1 S. 1 lit. c DSGVO gelöscht.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Kundenkonto</h3>
              <p>
                Soweit Sie hierzu Ihre Einwilligung nach Art. 6 Abs. 1 S. 1 lit. a DSGVO erteilt haben, indem Sie sich für die Eröffnung eines Kundenkontos entscheiden, verwenden wir Ihre Daten zum Zwecke der Kundenkontoeröffnung sowie zur Speicherung Ihrer Daten für weitere zukünftige Bestellungen auf unserer Webseite. Die Löschung Ihres Kundenkontos ist jederzeit möglich und kann entweder durch eine Nachricht an die in dieser Datenschutzerklärung beschriebene Kontaktmöglichkeit oder über eine dafür vorgesehene Funktion im Kundenkonto erfolgen.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Kontaktaufnahme</h3>
              <p>
                Im Rahmen der Kundenkommunikation erheben wir zur Bearbeitung Ihrer Anfragen gemäß Art. 6 Abs. 1 S. 1 lit. b DSGVO personenbezogene Daten, wenn Sie uns diese bei einer Kontaktaufnahme mit uns (z.B. per Kontaktformular oder E-Mail) freiwillig mitteilen. Pflichtfelder werden als solche gekennzeichnet, da wir in diesen Fällen die Daten zwingend zur Bearbeitung Ihrer Kontaktaufnahme benötigen.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">3. Datenverarbeitung zum Zwecke der Versandabwicklung</h2>
              <p>
                Zur Vertragserfüllung gemäß Art. 6 Abs. 1 S. 1 lit. b DSGVO geben wir Ihre Daten an den mit der Lieferung beauftragten Versanddienstleister weiter, soweit dies zur Lieferung bestellter Waren erforderlich ist.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">4. Datenverarbeitung zur Zahlungsabwicklung</h2>
              <p>
                Bei der Abwicklung von Zahlungen in unserem Online-Shop arbeiten wir mit diesen Partnern zusammen: technische Dienstleister, Kreditinstitute, Zahlungsdienstleister.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Datenverarbeitung zur Transaktionsabwicklung</h3>
              <p>
                Je nach ausgewählter Zahlungsart geben wir die für die Abwicklung der Zahlungstransaktion notwendigen Daten an unsere technischen Dienstleister, die im Rahmen einer Auftragsverarbeitung für uns tätig sind, oder an die beauftragten Kreditinstitute oder an den ausgewählten Zahlungsdienstleister weiter, soweit dies zur Abwicklung der Zahlung erforderlich ist. Dies dient der Vertragserfüllung gemäß Art. 6 Abs. 1 S. 1 lit. b DSGVO.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Betrugsprävention</h3>
              <p>
                Gegebenenfalls geben wir unseren Dienstleistern weitere Daten, die sie zusammen mit den für die Abwicklung der Zahlung notwendigen Daten als unsere Auftragsverarbeiter zum Zwecke der Betrugsprävention und der Optimierung unserer Zahlungsprozesse verwenden. Dies dient gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO der Wahrung unserer im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen an unserer Absicherung gegen Betrug.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">5. Werbung per E-Mail</h2>
              <p>
                Wenn Sie sich zu unserem Newsletter anmelden, verwenden wir die hierfür erforderlichen oder gesondert von Ihnen mitgeteilten Daten, um Ihnen regelmäßig unseren E-Mail-Newsletter aufgrund Ihrer Einwilligung gemäß Art. 6 Abs. 1 S. 1 lit. a DSGVO zuzusenden. Die Abmeldung vom Newsletter ist jederzeit möglich und kann entweder durch eine Nachricht an die unten beschriebene Kontaktmöglichkeit oder über einen dafür vorgesehenen Link im Newsletter erfolgen.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">6. Cookies und weitere Technologien</h2>
              <p>
                Um den Besuch unserer Webseite attraktiv zu gestalten und die Nutzung bestimmter Funktionen zu ermöglichen, verwenden wir auf verschiedenen Seiten Technologien einschließlich sogenannter Cookies. Cookies sind kleine Textdateien, die automatisch auf Ihrem Endgerät gespeichert werden.
              </p>
              <p>
                Wir verwenden solche Technologien, die für die Nutzung bestimmter Funktionen unserer Webseite (z.B. Warenkorbfunktion) zwingend erforderlich sind. Durch diese Technologien werden IP-Adresse, Zeitpunkt des Besuchs, Geräte- und Browser-Informationen sowie Informationen zu Ihrer Nutzung unserer Webseite erhoben und verarbeitet.
              </p>
              <p>
                Soweit Sie in die Verwendung der Technologien gemäß Art. 6 Abs. 1 S. 1 lit. a DSGVO eingewilligt haben, können Sie Ihre Einwilligung jederzeit widerrufen durch eine Nachricht an die in der Datenschutzerklärung beschriebenen Kontaktmöglichkeit.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">7. Ihre Rechte</h2>
              <p>
                Sie haben das Recht, Auskunft über die Sie betreffenden personenbezogenen Daten zu erhalten. Sie können ferner die Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen. Sie haben zudem das Recht, der Verarbeitung zu widersprechen und das Recht auf Datenportabilität.
              </p>
              <p>
                Um diese Rechte geltend zu machen, kontaktieren Sie uns bitte unter <a href="mailto:info@herbsom.de" className="text-primary hover:underline">info@herbsom.de</a>.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">8. Datenschutzbeauftragter</h2>
              <p>
                Bei Fragen zum Datenschutz können Sie sich jederzeit an unseren Datenschutzbeauftragten wenden. Kontaktieren Sie uns unter <a href="mailto:info@herbsom.de" className="text-primary hover:underline">info@herbsom.de</a>.
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
