# Shopify-Storefront-Übergabe

## Zielarchitektur

Die Herbsom-Webanwendung ist als **Headless-Shopify-Storefront** eingerichtet. Die eigene Anwendung stellt Design, Inhalte, Hauttest, Produktdarstellung und personalisierte Konfigurationsdaten bereit. Shopify bleibt die führende Commerce-Plattform für Produktvarianten, Warenkörbe, Checkout, Zahlungsarten, Kundenkonten, Bestellungen und Fulfillment.

| Bereich | Verantwortliche Komponente |
|---|---|
| Produktdaten, Varianten, Preise und Medien | Shopify Storefront API |
| Warenkorb | Shopify Cart API |
| Checkout und Zahlung | Shopify-gehosteter Checkout |
| Kundenlogin, Konto und Bestellhistorie | Shopify Customer Accounts |
| Design, Produktempfehlungen und Hauttest | Herbsom-Storefront |
| Personalisierung von Serum und Creme | Shopify-Cart-Line-Attribute |

## Implementierte Storefront-Pfade

Die Produktseiten, Übersichten, Hauttest-Ergebnisse, Konfiguratoren, Routinen, Gutscheine und das Routine-Detail-Modal laden ihre Produkt-, Varianten-, Preis- und Bilddaten aus Shopify. Kundenseitige Kaufaktionen werden vor dem Hinzufügen zum Warenkorb gegen veröffentlichte, kaufbare Shopify-Varianten geprüft. Bei Lade-, Zuordnungs- oder Verfügbarkeitsproblemen sind Kaufaktionen sichtbar deaktiviert.

Der Warenkorb bleibt im Herbsom-Design und verwendet Shopify Cart Lines. Der Checkout öffnet ausschließlich die von Shopify zurückgegebene Checkout-URL. Der Pfad `/account` leitet an Shopify Customer Accounts weiter; dort erfolgen Login, Registrierung, Adressverwaltung und Bestellhistorie. Der Alias `/skin-test` wurde zusätzlich zu `/hauttest` registriert, damit englische Verweise keinen 404-Fehler erzeugen.

## Bereinigung

Die aktive Stripe-, Abo- und Rabattlogik wurde aus den Commerce-Pfaden entfernt. Auch fest codierte Testimonials, Kundennamen und statische Bewertungsbehauptungen wurden durch die Anzeige ausschließlich freigegebener, real gespeicherter Bewertungen ersetzt. Produktmedien auf sichtbaren Detailseiten und passenden Produktkarten werden aus Shopify geladen.

## Verifikation

| Prüfung | Ergebnis |
|---|---|
| Shopify-Kaufpfadtests | 54 bestanden |
| Vollständiger Vitest-Bestand | 134 bestanden, 1 gezielt übersprungener Test |
| Produktions-Frontend-Build | Erfolgreich erstellt |
| Desktop-Prüfung | Produktseiten, Warenkorb, Gutscheine, Routinen und Hauttest geprüft |
| Mobil-Prüfung | Produktseite, Warenkorb, Gutschein, Hauttest und Shopify-Konto-Einstieg geprüft |

## Nächste betriebliche Schritte

Vor der Veröffentlichung sollte der Shopbetreiber im Shopify-Adminbereich die gewünschten Produkte, Varianten und Medien für den Headless-Verkaufskanal pflegen und die Checkout-Zahlungsarten, Versandprofile, Steuern sowie Customer Accounts nach den Geschäftsanforderungen prüfen. Ein echter Testkauf bis zur Zahlungsfreigabe wurde im Rahmen der technischen Integration bewusst nicht durchgeführt.

Zum Veröffentlichen dieser Storefront ist nach dem Checkpoint die Schaltfläche **Publish** in der Projektoberfläche zu verwenden.
