import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from "react-i18next";

export default function Shipping() {
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
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Versand und Retouren</h1>
          <p className="text-lg text-muted-foreground">
            Informationen zu Versand, Lieferzeiten und unserem Rückgaberecht.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-2 md:py-3">
        <div className="container max-w-3xl prose prose-stone dark:prose-invert">
          <div className="space-y-8">
            {/* Shipping Section */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">Versand</h2>
              
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">Versandkosten und Kostenlose Lieferung</h3>
                <ul className="space-y-3">
                  <li>
                    <strong>Deutschland:</strong> Versand ab einem Bestellwert von 60 € kostenfrei
                  </li>
                  <li>
                    <strong>EU:</strong> Versand ab einem Bestellwert von 150 € kostenfrei
                  </li>
                  <li>
                    <strong>Weltweit:</strong> Versand ab einem Bestellwert von 200 € kostenfrei
                  </li>
                  <li>
                    Unterhalb dieser Beträge fallen die im Bestellprozess angegebenen Versandkosten an.
                  </li>
                </ul>
              </div>

              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">Lieferzeiten</h3>
                <ul className="space-y-3">
                  <li>
                    <strong>Deutschland:</strong> Bis zu 5 Werktage
                  </li>
                  <li>
                    <strong>Europa:</strong> Etwa 7 Werktage
                  </li>
                  <li>
                    <strong>Weltweit:</strong> Bis zu 4 Wochen
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Wichtige Hinweise</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    ⚠️ Bei Lieferungen in Nicht-EU-Länder können zusätzliche Zölle oder Steuern anfallen, die vom Empfänger zu tragen sind.
                  </li>
                  <li>
                    ✓ Achten Sie darauf, dass Ihre Lieferadresse korrekt angegeben ist, um Verzögerungen zu vermeiden.
                  </li>
                  <li>
                    ✓ Wir liefern nur im Versandweg. Eine Selbstabholung ist nicht möglich.
                  </li>
                  <li>
                    ✓ Wir liefern nicht an Packstationen.
                  </li>
                </ul>
              </div>
            </div>

            {/* Returns Section */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">Retouren und Widerrufsrecht</h2>
              
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">Rückgaberecht</h3>
                <p className="mb-4">
                  Sie können Ihre Bestellung im Rahmen des gesetzlichen Widerrufsrechts innerhalb von <strong>14 Tagen</strong> zurücksenden.
                </p>
                
                <h4 className="font-semibold mb-3">Voraussetzungen für die Rückgabe:</h4>
                <ul className="space-y-2">
                  <li>✓ Die Ware muss <strong>ungeöffnet</strong> sein</li>
                  <li>✓ Die Ware muss <strong>originalverpackt</strong> sein</li>
                  <li>✓ Die Ware muss im <strong>verschlossenen Versandkarton</strong> an uns zurückgeschickt werden</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Hygienische Gründe</h3>
                <p>
                  Aus hygienischen Gründen können wir <strong>geöffnete oder benutzte Produkte nicht zurücknehmen</strong>. Dies gilt insbesondere für Kosmetikprodukte.
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                <h3 className="text-lg font-semibold mb-3">Rücksendekosten</h3>
                <p>
                  Die Kosten für Rücksendungen trägt der Kunde. Bitte versenden Sie Ihre Rücksendung als versichertes Paket, um sicherzustellen, dass es ankommt.
                </p>
              </div>
            </div>

            {/* Process Section */}
            <div>
              <h2 className="text-2xl font-serif font-light mb-4">Rückgabeprozess</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Kontaktieren Sie uns</h4>
                    <p className="text-muted-foreground">
                      Senden Sie eine E-Mail an <a href="mailto:info@herbsom.de" className="text-primary hover:underline">info@herbsom.de</a> mit Ihrer Bestellnummer und dem Grund für die Rückgabe.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Rücksendung vorbereiten</h4>
                    <p className="text-muted-foreground">
                      Packen Sie die Ware sicher ein und versenden Sie sie an die von uns angegebene Adresse. Bitte verwenden Sie ein versichertes Versandverfahren.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-semibold">
                        3
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Rückerstattung</h4>
                    <p className="text-muted-foreground">
                      Nach Erhalt und Überprüfung Ihrer Rücksendung erstatten wir den Kaufpreis. Die Rückerstattung erfolgt auf das gleiche Zahlungsmittel, das Sie für den Kauf verwendet haben.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
              <h2 className="text-2xl font-serif font-light mb-4">Fragen?</h2>
              <p className="mb-4">
                Bei Fragen oder Problemen erreichen Sie uns jederzeit unter:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>E-Mail:</strong> <a href="mailto:info@herbsom.de" className="text-primary hover:underline">info@herbsom.de</a>
                </p>
                <p>
                  <strong>Telefon:</strong> +49 157 92475960
                </p>
                <p>
                  <strong>Adresse:</strong><br />
                  ili Skincare GmbH<br />
                  Steinfurterstraße 51a<br />
                  48149 Münster
                </p>
              </div>
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
