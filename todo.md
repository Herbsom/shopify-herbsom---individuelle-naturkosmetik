# Project TODO

- [x] Homepage mit Hero, Produkte, Hauttest, Über uns, Werte, Testimonials, CTA
- [x] Navigation mit Mega-Menü und Warenkorb-Icon
- [x] Footer mit Links und Newsletter-Hinweis
- [x] Produktseiten (Serum, Creme, Cleaner, Cleaner-Milk, Peeling, Peeling-AHA, Sunscreen)
- [x] Reiniger-Übersichtsseite
- [x] Peelings-Übersichtsseite
- [x] Konfigurator Serum
- [x] Konfigurator Creme
- [x] About-Seite
- [x] Blog-Seite
- [x] Hauttest (SkinTest)
- [x] Gutschein-Seite
- [x] Pflegeroutinen-Seiten (7 Hauttypen)
- [x] 404-Seite im Herbsom-Design
- [x] Upgrade auf Server + Datenbank + User-Management (web-db-user)
- [x] Datenbank-Schema synchronisiert (pnpm db:push)
- [x] Merge-Konflikte aufgelöst (Home.tsx, NotFound.tsx beibehalten)
- [x] Datenbank-Schema: Orders-Tabelle mit Bestellpositionen
- [x] Backend: tRPC-Prozeduren für Bestellhistorie (getMyOrders)
- [x] Backend: tRPC-Prozedur für Wiederbestellung (reorder)
- [x] Frontend: Geschützte „Mein Konto"-Seite im Herbsom-Design
- [x] Frontend: Bestellhistorie mit Detailansicht
- [x] Frontend: Wiederbestell-Button pro Bestellung
- [x] Routing und Navigation: /account Route mit Auth-Guard
- [x] Tests für Backend-Prozeduren
- [x] Warenkorb-Seite (/cart) mit Mengenänderung, Entfernen und Gesamtpreis
- [x] Checkout-Seite (/checkout) mit Adressformular und Bestellübersicht
- [x] Bestellbestätigung-Seite (/order-confirmation) nach erfolgreichem Checkout
- [x] Produktseiten: Add-to-Cart Buttons funktional verbinden
- [x] Warenkorb-Icon in Navigation mit Artikelanzahl-Badge
- [x] Routing für /cart, /checkout, /order-confirmation
- [x] Tests für Checkout-Flow
- [x] CartContext: description-Feld zu CartItem hinzufügen (für Wirkstoffe)
- [x] Warenkorb-Seite: Wirkstoffe/Description unter Produktname anzeigen
- [x] Konfigurator Serum: Zusammenfassung mit Wirkstoffen vor Add-to-Cart + description an addItem übergeben
- [x] Konfigurator Creme: Zusammenfassung mit Wirkstoffen vor Add-to-Cart + description an addItem übergeben
- [x] Checkout-Seite: Wirkstoffe in Bestellübersicht anzeigen
- [x] Hauttest: Individuelle Empfehlungslogik basierend auf Antworten (Serum-Wirkstoffe, Creme-Wirkstoffe, Basis-Creme, Reiniger, Peeling)
- [x] Hauttest: Ergebnisseite zeigt personalisierte Wirkstoffe pro Produkt
- [x] Hauttest: Direkt-Link zum Konfigurator mit vorausgewählten Wirkstoffen
- [x] Konfigurator Serum: Query-Params (ingredients) auslesen und Wirkstoffe beim Laden vorauswählen
- [x] Konfigurator Creme: Query-Params (base, ingredients) auslesen und Basis/Wirkstoffe beim Laden vorauswählen
- [x] Hauttest: Creme bei trockener Haut auch morgens empfehlen (nicht nur abends)
- [x] Hauttest: Enzympeeling entfernen, stattdessen AHA/PHA-Peeling und BHA/Azelainsäure-Peeling als Optionen
- [x] Hauttest-Ergebnisse: Produktbilder für Reiniger und Peeling hinzufügen
- [x] Hauttest-Ergebnisse: Produktbild für Serum auf der Ergebnisseite hinzufügen
- [x] Hauttest-Ergebnisse: Produktbild für Creme auf der Ergebnisseite hinzufügen
- [x] Hauttest-Ergebnisse: Produktbild für Sonnenschutz auf der Ergebnisseite hinzufügen
- [x] Hauttest-Ergebnis: Wirkstoffe für Serum bearbeitbar machen (austauschen/entfernen/hinzufügen)
- [x] Hauttest-Ergebnis: Wirkstoffe für Creme bearbeitbar machen (austauschen/entfernen/hinzufügen)
- [x] Hauttest-Ergebnis: Vitamin C / Niacinamide Inkompatibilität bei Bearbeitung beachten
- [x] Hauttest-Ergebnis: Preis dynamisch aktualisieren bei Wirkstoffänderung
- [x] Warenkorb: "Anpassen"-Button bei Serum/Creme der zum Konfigurator mit vorausgewählten Wirkstoffen verlinkt
- [x] Routine-Seiten: Generisches Serum durch konkreten Wirkstoff-Vorschlag ersetzen (alle 7 Seiten)
- [x] Routine-Seiten: Generische Creme durch konkreten Wirkstoff-Vorschlag ersetzen (alle 7 Seiten)
- [x] Routine-Seiten: Add-to-Cart mit korrekter Wirkstoff-Description und Link zum Konfigurator
- [x] Homepage: Alle Buttons korrekt verlinken (Hauttest starten, Mehr erfahren, Jetzt bestellen, Unsere Geschichte, Zum Shop, Alle Produkte)
- [x] App.tsx: /products und /routines Route zu RoutineOverview hinzufügen
- [x] App.tsx: Fehlende führende Slashes bei Routine-Routen korrigiert
- [x] Warenkorb: Wenn Kunden "Anpassen" klicken und Creme/Serum-Konfiguration ändern, soll die alte Version im Warenkorb durch die neue ersetzt werden (nicht hinzugefügt)
- [x] Konfigurator: Nach dem Aktualisieren (replaceItem) automatisch zum Warenkorb zurückleiten
- [x] Serum-Konfigurator: Basisserum immer vorausgewählt und grün markiert (nicht abwählbar, "Immer enthalten" Hinweis)
- [x] Serum-Konfigurator: Pop-up Detailseiten für Basisserum und alle Wirkstoffe (per Klick öffnen, X zum Schließen)
- [x] Creme-Konfigurator: Pop-up Detailseiten für Basiscreme und alle Wirkstoffe (per Klick öffnen, X zum Schließen)
- [x] Konfiguratoren: Klick auf gesamtes Feld wählt Produkt aus/ab, nur "Mehr erfahren" öffnet Pop-up
- [x] Serum-Konfigurator: Basisserum braucht auch "Mehr erfahren" Link zur Detailseite
- [x] Creme-Konfigurator: Anwendungstext anpassen (in Basiscreme geben und verrühren, nicht in Basisserum) - verifiziert
- [x] Detail-Modal: Mehr Grün als Akzent statt Beige (nur hinter Bild beige lassen)
- [x] Detail-Modal: Tabelle linke Spalte in normaler Textschrift (kein Monospace)
- [x] Creme-Konfigurator: "Auswählen"-Buttons bei Basiscremes entfernen
- [x] Detail-Modal: Anwendungstext für Creme-Wirkstoffe anpassen ("Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren...")
- [x] Konfiguratoren (mobil): Grüne Punkte für Schritte einheitlich rund machen
- [x] Detail-Modal: Tabellen - alle Einträge mit einheitlicher Schriftgröße und Schriftart
- [x] Detail-Modal: Tabelle mobil - Schriftgröße verringern für bessere Sichtbarkeit
- [x] Detail-Modal: Basiscreme - Anwendungstext hinzufügen wie bei Wirkstoffen
- [x] Detail-Modal: Produktbilder 1:1 für alle Serum-Wirkstoffe, Basisserum und Creme-Wirkstoffe, Basiscremes hinzufügen
- [x] LocalStorage Persistence: Implement cart state persistence so users don't lose configurations on refresh
- [x] Checkout Integration: Set up Stripe for live payments
- [x] Discount Code System: Implement promo/discount code functionality
- [x] Skin Test Integration: Connect Hauttest results to configurators for personalized recommendations
- [x] Price Updates: Review and update all product prices to reflect realistic values
- [x] Testing: Write and run Vitest specs for cart and checkout logic
- [x] Product Detail Pages: Update rating styling to match homepage (green #5B9B5B)
- [x] Product Detail Pages: Update related products images to use 1:1 white-background format
- [x] Reiniger-Detailseiten: Duplicate Bilder entfernen, empfohlene Produkte nebeneinander, grüne Bewertungen
- [x] Product Detail Pages: Add ingredients table (Wirkstoff/Funktion) to ProductCleaner
- [x] Product Detail Pages: Add ingredients table (Wirkstoff/Funktion) to ProductCleanerMilk
- [x] Product Detail Pages: Add ingredients table (Wirkstoff/Funktion) to ProductPeeling
- [x] Product Detail Pages: Add ingredients table (Wirkstoff/Funktion) to ProductPeelingAHA
- [x] Product Detail Pages: Add ingredients table (Wirkstoff/Funktion) to ProductSunscreen
- [x] Product Detail Pages: Add ingredients table (Wirkstoff/Funktion) to ProductSerum
- [x] Product Detail Pages: Add ingredients table (Wirkstoff/Funktion) to ProductCreme
- [x] Stripe Webhook: Verify /api/stripe/webhook endpoint for payment confirmation
- [x] Final Project Review: Test all flows end-to-end before deployment
- [x] Review System: Database schema for reviews with moderation status
- [x] Review System: tRPC procedures for CRUD operations (create, read, update status)
- [x] Review System: ReviewForm component with star rating and validation
- [x] Review System: ReviewList component with sorting (newest, helpful, highest rating)
- [x] Review System: Integration into ProductCleaner and ProductCleanerMilk pages
- [x] Review System: Admin moderation dashboard at /admin/reviews
- [x] Review System: Unit tests for review system (6 tests, all passing)

## Abonnement-System (Subscription System) - NEU

### Datenbankschema
- [x] Subscriptions-Tabelle erstellen (subscriptions)
- [x] SubscriptionItems-Tabelle erstellen (subscriptionItems)
- [x] SubscriptionHistory-Tabelle erstellen (subscriptionHistory)
- [x] Datenbankmigrationen durchführen (`pnpm db:push`)

### Backend-Logik
- [x] Datenbankhelfer in `server/db.ts` implementieren
- [x] tRPC-Procedures für Abo-Verwaltung erstellen (`server/routers/subscriptions.ts`)
  - [x] getMySubscriptions - Alle Abos des Benutzers abrufen
  - [x] getSubscription - Einzelnes Abo abrufen
  - [x] getSubscriptionHistory - Abo-Verlauf abrufen
  - [x] createSubscription - Neues Abo erstellen
  - [x] updateSubscriptionStatus - Status ändern (aktiv/pausiert/gekündigt)
  - [x] updateBillingInterval - Abrechnung-Intervall ändern
  - [x] updateSubscriptionItems - Produkte im Abo aktualisieren
  - [x] addProductToSubscription - Produkt hinzufügen
  - [x] removeProductFromSubscription - Produkt entfernen

### Stripe-Integration
- [x] Stripe-Subscriptions-Router erstellen (`server/routers/stripe-subscriptions.ts`)
  - [x] createSubscriptionCheckout - Checkout-Session für Abo erstellen
  - [x] getSubscriptionCheckoutSession - Checkout-Session abrufen
  - [x] getStripeSubscription - Stripe-Abo-Details abrufen
  - [x] updateSubscriptionBillingInterval - Intervall in Stripe aktualisieren
  - [x] pauseSubscription - Abo pausieren
  - [x] resumeSubscription - Abo fortsetzen
  - [x] cancelSubscription - Abo kündigen

### Frontend-UI
- [x] Subscriptions-Seite erstellen (`client/src/pages/Subscriptions.tsx`)
  - [x] Abo-Liste anzeigen
  - [x] Abo-Status anzeigen (aktiv/pausiert/gekündigt)
  - [x] Abo-Intervall bearbeiten
  - [x] Abo pausieren/fortsetzen/kündigen
  - [x] Produkte im Abo anzeigen
  - [x] Leere Zustand anzeigen
  - [x] Fehlerbehandlung
- [x] Route in App.tsx hinzufügen (`/account/subscriptions`)
- [x] Tabs in Account-Seite hinzufügen (Bestellhistorie / Abonnements)
- [x] Tabs in Subscriptions-Seite hinzufügen

### Tests
- [x] Vitest-Tests für Datenbankfunktionen schreiben
- [x] Tests ausführen und validieren (12 Tests bestanden)

### Dokumentation & Nächste Schritte
- [x] Routine-Seiten: Anwendungs-Section mit Bild auf der rechten Seite (Desktop) statt Timeline
- [x] Produktseiten: Review-Section zentriert und gestapelt (Reviews in Mitte, Form darunter)
- [x] Konfigurator-Seiten: Review-Section zentriert und gestapelt (Reviews in Mitte, Form darunter)
- [x] Hauttest-Fragen auf Desktop breiter (max-w-3xl → max-w-4xl)
- [x] Webhook-Handler für Stripe-Events implementieren (payment_intent.succeeded, etc.)
- [x] [ARCHIVIERT] Automatische Abrechnung und Bestellerstellung bei Fälligkeit — als nicht anwendbare Stripe-Altanforderung im Shopify-Spin-off dokumentiert (`notes/legacy-commerce-scope-decision-2026-07-22.md`)
- [x] Abo-Optionen bei Produkten anzeigen (Toggle + Lieferhäufigkeit-Selector)
- [x] Abo-Verwaltung im Checkout-Prozess hinzufügen (Anzeige von Abo-Infos)
- [x] Scroll-to-Top beim Seitenwechsel implementieren

## Routine-Seiten Überarbeitung - NEU

- [x] Generische Routine-Komponente erstellen (RoutineTemplate.tsx)
- [x] URL-Routing für Routine-Seiten anpassen (App.tsx)
- [x] Alle 7 Routine-Dateien durch generische Komponente ersetzen
- [x] Navigation aktualisieren, um Routine-Seiten als Sub-Items anzuzeigen
- [x] Routine-Seiten testen und verifizieren, dass unterschiedliche Inhalte angezeigt werden
- [x] Shopify-Integration mit EANs für alle Routine-Seiten testen
- [x] "Vor Gebrauch schütteln" zu Serum und Sonnenschutz hinzugefügt
- [x] E-Mail-Benachrichtigungen für Abo-Events (Owner-Notifications via notifyOwner für neue Abos, Abrechnungen, Kündigungen, Disputes)
- [x] Abo-Rabatte/Promotionen implementieren (SUBSCRIBE15 Code für aktive Abonnenten, Banner in Subscriptions-Seite)


## Automatische Shopify-Bestellungserstellung für Abos - NEU

### Stripe-Webhook-Handler
- [x] Webhook-Endpoint für `invoice.paid` Events erweitern
- [x] Abo-Abrechnungen erkennen und verarbeiten
- [x] Webhook-Signatur-Verifizierung für Abo-Events (bereits vorhanden)
- [x] Fehlerbehandlung und Retry-Logik (Grundgerüst)

### Shopify-Integration
- [x] Shopify-API-Verbindung für Bestellungserstellung (shopify-subscriptions.ts)
- [x] Abo-Produkte zu Shopify-Bestellungen mappen (Grundgerüst)
- [x] Bestellungen in Shopify erstellen (GraphQL-Mutation)
- [x] Versandadresse aus Abo-Daten verwenden (Grundgerüst)
- [x] Bestellungs-IDs in Datenbank speichern

### Abo-Bestellungserstellung
- [x] Neue Tabelle: SubscriptionOrders (Abo-Bestellungen tracking)
- [x] Bestellungshistorie pro Abo speichern (DB-Helper)
- [x] Fehlerbehandlung bei fehlgeschlagener Bestellungserstellung
- [x] Benachrichtigungen bei erfolgreicher Bestellungserstellung (Logging)

### Tests & Validierung
- [x] Vitest-Tests für Webhook-Handler (6 Tests bestanden)
- [x] Shopify-Integration testen (Idempotenz, Fehlerbehandlung)
- [x] End-to-End Test: Abo erstellen → Abrechnung → Shopify-Bestellung

## Rechtliche Seiten (Legal Pages) - NEU

- [x] Datenschutzerklärung-Seite erstellen (/privacy)
- [x] AGB-Seite erstellen (/terms)
- [x] Versand und Retouren-Seite erstellen (/shipping)
- [x] Routen in App.tsx hinzufügen
- [x] Footer-Links zu den neuen rechtlichen Seiten aktualisieren
- [x] Alle Seiten im Herbsom-Design gestaltet und getestet
- [x] Widerrufsformular-Seite erstellen (/withdrawal) mit gesetzlichen Bestimmungen
- [x] Widerruf-Link im Footer hinzufügen
- [x] Impressum-Seite erstellen (/impressum) mit allen rechtlichen Informationen
- [x] Impressum-Link im Footer hinzufügen


## Shopify-Integration mit Metafields - NEU

### Metafields-Schema
- [x] Metafields-Struktur für Produkte definieren (Wirkstoffe, Basis, Beschreibung, Preis)
- [x] Shopify Admin API Integration für Metafields erstellen
- [x] Metafields-Helper-Funktionen implementieren

### Produktsynchronisierung
- [x] Synchronisierungslogik für Serum-Produkte (Basis + Wirkstoffe)
- [x] Synchronisierungslogik für Creme-Produkte (Basis + Wirkstoffe)
- [x] Synchronisierungslogik für Reiniger und Peelings
- [x] Synchronisierungslogik für Sonnenschutz
- [x] Fehlerbehandlung und Retry-Logik

### tRPC-Procedures
- [x] Procedure zum Synchronisieren von Produkten mit Shopify
- [x] Procedure zum Abrufen von Shopify-Produktdetails
- [x] Procedure zum Aktualisieren von Metafields

### Tests
- [x] Vitest-Tests für Metafields-Funktionen (8 Tests bestanden)
- [x] Vitest-Tests für Synchronisierungslogik
- [x] Tests ausführen und validieren (111 Tests bestanden)

### Produktionsreife (Production-Ready)
- [x] Platzhalter-IDs aus dem aktiven Repository beseitigt — die unregistrierte Legacy-Sync-Konfiguration wurde entfernt; reale Produkte kommen über die aktive Shopify-Commerce-Schicht
- [x] Unsichere öffentliche Legacy-Sync-Procedures beseitigt — der vollständig unregistrierte Router wurde entfernt
- [x] Veraltete Metafield-Administrationsfläche entfernt — keine unregistrierte beziehungsweise vorgetäuschte Update-Procedure verbleibt
- [x] Unbenutzten Sync-Pfad ohne Retry/Backoff entfernt; die aktive Storefront verwendet ausschließlich die integrierte Commerce-Schicht
- [x] Generierte Hero-Bilder gelöscht (alle Bild-URLs auf leer gesetzt)
- [x] Produktbilder aus dem referenzierten Projekt geprüft (nur 1 Bild vorhanden, nicht geeignet)
- [x] Alternative: Produktbilder aus bestehenden Produktseiten verwenden (ShopifyProductGallery-Komponente)

- [x] Ausschließlich zur entfernten Legacy-Sync-Fläche gehörende Tests bereinigt; aktive Shopify-Pfade bleiben durch Commerce-, Purchase- und Smoke-Tests abgedeckt
- [x] Hero-Bilder auf Routine-Seiten entfernt (nicht mehr nötig)


## Mehrsprachenfunktion (i18n) - NEU

### Setup und Infrastruktur
- [x] i18next und react-i18next installieren
- [x] i18n-Konfiguration erstellen (src/i18n/config.ts)
- [x] Spracherkennung und Browser-Sprache implementieren
- [x] Sprachpersistenz im LocalStorage

### Übersetzungsdateien
- [x] Deutsche Übersetzungen (de.json)
- [x] Englische Übersetzungen (en.json)
- [x] Französische Übersetzungen (fr.json)
- [x] Arabische Übersetzungen (ar.json)
- [x] Schwedische Übersetzungen (sv.json)
- [x] Niederländische Übersetzungen (nl.json)

### UI-Komponenten
- [x] Sprachumschalter in Navigation implementieren
- [x] Sprachumschalter-Dropdown mit Flaggen/Codes
- [x] RTL-Unterstützung für Arabisch — `lang="ar"` und `dir="rtl"` werden bei Sprachwechsel gesetzt; alle übrigen Sprachen wechseln auf LTR zurück

### Seiten und Komponenten übersetzen
- [x] Homepage übersetzen (DE, EN, FR, AR, SV, NL)
- [x] Produktseiten übersetzen (alle 6 Sprachen)
- [x] Navigation und Footer übersetzen (alle 6 Sprachen)
- [x] Rechtliche Seiten übersetzen (Privacy, Terms, Shipping, Withdrawal, Impressum - alle 6 Sprachen)
- [x] Hauttest übersetzen (alle 6 Sprachen)
- [x] Konfiguratoren übersetzen (alle 6 Sprachen)
- [x] Account/Bestellhistorie übersetzen (alle 6 Sprachen)

### Tests
- [x] Vitest-Tests für i18n-Funktionen (121 Tests bestanden)
- [x] Sprachumschalter-Tests
- [x] Übersetzungs-Fallback-Tests

- [x] Bestehende Commerce-, Login-, Warenkorb-, Checkout- und Stripe-Pfade der Projektkopie erfassen
- [x] Bestehenden Shopify-Shop als Headless-Commerce-Backend mit der Projektkopie verbinden
- [x] Alle sichtbaren Produktseiten, Übersichten, Gutschein- und Hauttest-Kaufpfade einschließlich Add-to-Cart-Daten strikt ohne lokale Preisquellen an Shopify binden
- [x] Defekten sichtbaren Skin-Test-Navigationspfad reparieren und den Hauttest mobil sowie auf Desktop erreichbar prüfen
- [x] Shopify-Warenkorb und Weiterleitung in den Shopify-Checkout im vorhandenen Herbsom-Design integrieren
- [x] Commerce-Kundenkonto, Bestellhistorie und Login-Einstieg auf Shopify Customer Accounts umstellen
- [x] Stripe-, SUBSCRIBE15- und nicht angeforderte Abo-spezifische Logik aus aktiven Storefront-Flows entfernen
- [x] Unreferenzierte Stripe-Abo-Services, Webhook-/Routermodule und den hängenden Alt-Test aus dem aktiven Quellbestand entfernen
- [x] Shopify-Integrationspfade mit Vitest sowie Desktop- und Mobilansicht verifizieren
- [x] Stabilen Shopify-Storefront-Stand als neuen Checkpoint dokumentieren
- [x] Shopify-Commerce-Router in der zentralen tRPC-Routerstruktur registrieren
- [x] Shopify-Store-Domain und Storefront-Zugriffstoken über die zentrale Server-Umgebung exportieren
- [x] Vorhandene kundenspezifische CartContext-Funktionen mit dem Shopify-Warenkorb-Scaffold zusammenführen
- [x] Bestehenden Shopify-Katalog inklusive Varianten, Preise, Bilder und Verkaufskanal-Veröffentlichung prüfen
- [x] Verbleibende lokale Kunden-Login-Einstiege aus Produkt- und Konfiguratorseiten entfernen oder klar auf interne Review-Verwaltung begrenzen
- [x] Shopify-Warenkorb und Checkout mit echten Lade-, Fehler- und Leerzuständen in der laufenden Storefront nachweisen
- [x] Fest codierte oder nicht verifizierte Testimonials, Bewertungsnamen und Sterne aus der Storefront entfernen; ausschließlich echte gespeicherte Bewertungen anzeigen
- [x] Lokale Preisfallbacks aus ShopifyLegacyProductPrice entfernen und explizite Lade- sowie Fehlerzustände anzeigen
- [x] Produktseiten, Übersichten, Gutschein, Hauttest, Routinen und Konfiguratoren mit gezielten Quellpfadtests auf Shopify-Preis- und Variantenherkunft prüfen
- [x] Runtime-Tests für fehlende und unverfügbare Shopify-Produkte sowie blockierte Add-to-Cart- und Checkout-Aktionen ergänzen
- [x] Alle Produktseiten, Übersichten, Gutschein, Hauttest, Routinen und Konfiguratoren mit sichtbaren Shopify-Lade-/Fehlerzuständen und deaktivierten Kaufbuttons versehen
- [x] Routine-Produktdetail-Modal vom Platzhalter-Kaufbutton auf den echten Shopify-Warenkorb und den zentralen Verfügbarkeitsguard umstellen
- [x] Komponenten- oder Flow-Tests für deaktivierte Kaufbuttons und sichtbare Shopify-Fehlerzustände je Kaufpfadklasse ergänzen
- [x] Laufende Storefront mit Browserprüfung für Produktpreis-, Warenkorb-, Checkout-, Konto-, Lade-, Fehler- und Leerzustände dokumentieren
- [x] Fehlerhafte oder statische Produktbilder auf sichtbaren Detailseiten durch verfügbare Shopify-Produktbilder ersetzen
- [x] Nicht verfügbare Shopify-Produktdaten in allen Kaufpfaden sichtbar und kaufblockierend behandeln

## Bildübernahme aus vorheriger Aufgabe – 2026-07-22

- [x] Fehlende Bildverweise der aktuellen Shopify-Storefront erfassen und die passenden Quelldateien aus dem vorherigen Arbeitsbestand zuordnen
- [x] Freigegebene Altbilder außerhalb des Projektordners ablegen, als Web-Assets bereitstellen und die betroffenen Storefront-Verweise aktualisieren
- [x] Übernommene Bilddarstellung auf den betroffenen Seiten in Desktop- und Mobilansicht prüfen

## Bildübernahme aus verlinkter Manus-Aufgabe – 2026-07-22

- [x] Bilddateien und Nutzungszusammenhang der verlinkten Manus-Aufgabe erfassen und den jeweiligen Storefront-Bereichen zuordnen
- [x] Freigegebene Bilddateien aus der verlinkten Aufgabe als Web-Assets bereitstellen und die betroffenen Herbsom-Verweise aktualisieren
- [x] Übernommene Bilder in Desktop- und Mobilansicht sowie im Produktions-Build prüfen

## Referenzgetreue Bildintegration – 2026-07-22

- [x] Bildplatzierung, Bildverhältnisse und Bildzuschnitte der referenzierten Manus-Aufgabe gegenüber der aktuellen Herbsom-Startseite erfassen
- [x] Startseiten-Bildintegration gemäß Referenzaufgabe aktualisieren, einschließlich Positionierung, Ausschnitt und responsiver Bildverhalten
- [x] Referenzähnlichkeit sowie Bilddarstellung in Desktop- und Mobilansicht technisch prüfen

## Korrektur auf Originalbilder der Referenzaufgabe – 2026-07-22

- [x] Die fünf tatsächlichen Originalbilddateien der Referenz-Startseite aus dem angehängten Aufgabenbestand identifizieren und visuell gegen die aktuelle Startseite abgleichen
- [x] Die abweichenden aktuellen Startseitenmotive durch die Originalbilder der Referenzaufgabe als langlebige Projekt-Assets ersetzen
- [x] Motivgleichheit, Bildausschnitt und responsive Darstellung der korrigierten Originalbilder auf Desktop und Mobil prüfen

## Vollständige Bildübernahme von herbsomweb-zgqpcjfd.manus.space – 2026-07-22

- [x] Alle auf der angegebenen Referenzseite verwendeten Bilddateien und ihre jeweiligen Storefront-Positionen erfassen
- [x] Die vollständige Bildsammlung der Referenzseite als langlebige Projekt-Assets bereitstellen und die aktuellen Storefront-Verweise ersetzen
- [x] Vollständigkeit, Bildreihenfolge und Darstellung der übernommenen Referenzbilder auf Desktop und Mobil prüfen

## Seitenübergreifende Bildübernahme von herbsomweb-zgqpcjfd.manus.space – 2026-07-22

- [x] Alle navigierbaren Referenzseiten sowie ihre gerenderten Bilddateien und Bildpositionen vollständig erfassen
- [x] Jede Referenzseite den entsprechenden aktuellen Herbsom-Seiten und den betroffenen Bildverweisen zuordnen
- [x] Sämtliche noch fehlenden Referenzbilder als langlebige Projekt-Assets übernehmen und die passenden Seitenverweise ersetzen
- [x] Die Bildübernahme auf allen betroffenen Seiten in Desktop- und Mobilansicht sowie im Produktions-Build prüfen

## Nachbesserung Bildladefehler – 2026-07-22

- [x] Alle im Client verwendeten Bild-URLs gegen den tatsächlich verfügbaren Bildbestand prüfen
- [x] Fehlende, fehlerhafte und inkonsistent benannte Bildpfade vollständig korrigieren
- [x] Automatisierten Test für die Konsistenz lokaler Referenzbildpfade ergänzen und ausführen
- [x] Betroffene Produkt-, Routine-, Hauttest- und Inhaltsstoffansichten auf Desktop und Mobil visuell prüfen
- [x] Korrigierte Bildauslieferung in einer neuen überprüften Projektversion sichern

## Bildausrichtung an verlinkter Referenzseite – 2026-07-22

- [x] Bildmotive, Bildausschnitte und Bildpositionen der verlinkten Referenzseite mit der aktuellen Storefront vergleichen
- [x] Abweichende Bildauswahl auf den entsprechenden Startseiten- und Storefront-Bereichen auf die Referenzmotive ausrichten
- [x] Alle geänderten Bildpfade automatisiert auf Erreichbarkeit prüfen und die bestehenden Bildtests aktualisieren
- [x] Referenzähnlichkeit sowie Bilddarstellung in Desktop- und Mobilansicht visuell prüfen
- [x] Die geprüfte Bildausrichtung in einer neuen Projektversion sichern

## Referenzproduktbilder für individuelle Serum- und Creme-Seiten – 2026-07-22

- [x] Produktbildflächen der individuellen Serum- und Creme-Seite mit den passenden Referenzmotiven vergleichen
- [x] Referenzmotive für Serum und Creme als langlebige Projekt-Web-Assets zuordnen und einsetzen
- [x] Bildpfade und Produktschnittstellen mit Tests sowie einer Erreichbarkeitsprüfung absichern
- [x] Serum- und Creme-Seiten auf Desktop und Mobil visuell gegen die Referenzbildwelt prüfen
- [x] Die geprüfte Produktbildübernahme in einer neuen Projektversion sichern

## Vollständige Referenzbildübernahme für Serum und Creme – 2026-07-22

- [x] Alle serum- und cremebezogenen Bildmotive der Referenzseite einschließlich Produkt-, Wirkstoff-, Basis- und Detailbilder vollständig erfassen
- [x] Jede Bildfläche der individuellen Serum- und Creme-Produktseiten sowie der zugehörigen Konfiguratoren der passenden Referenzbildquelle zuordnen
- [x] Fehlende Referenzbilder als langlebige Projekt-Web-Assets bereitstellen und alle Produkt-, Konfigurator- und Detailbildverweise aktualisieren
- [x] Bildreihenfolge, Bildpfade und Produktbildzuordnungen automatisiert testen
- [x] Vollständige Serum- und Creme-Bilddarstellung auf Desktop und Mobil visuell prüfen
- [x] Die geprüfte vollständige Bildübernahme in einer neuen Projektversion sichern

## Checkpoint-Audit: Legacy-Bereinigung und RTL – 2026-07-22

- [x] Stripe-Abo-Fälligkeit als im Shopify-Spin-off archivierbare, technisch nicht aktive Altanforderung mit Architekturbegründung dokumentieren
- [x] Nicht registrierte Legacy-Shopify-Sync-Router, Platzhalter-IDs und zugehörige ungenutzte Testfläche aus dem aktiven Codebestand entfernen
- [x] Arabische Sprache automatisch mit `dir="rtl"` und alle übrigen Sprachen mit `dir="ltr"` am Dokument auszeichnen
- [x] RTL-Umschaltung mit Vitest absichern und die arabische Oberfläche visuell prüfen
- [x] Vollständige Tests, Build und Bildverfügbarkeitsprüfung erneut ausführen
- [x] Bereinigte Projektversion als neuen Checkpoint sichern
- [x] Routine-Seite Normale Haut: Produktbilder über den Texten positioniert
- [x] Routine-Seite Reife Haut: Produktbilder über den Texten positioniert
- [x] Routine-Seite Trockene Haut: Produktbilder über den Texten positioniert
- [x] Routine-Seite Unreine Haut: Produktbilder über den Texten positioniert
- [x] Routine-Seite Mischhaut: Produktbilder über den Texten positioniert
- [x] Routine-Seite Empfindliche Haut: Produktbilder über den Texten positioniert
- [x] Routine-Seite Sensible Haut: Produktbilder über den Texten positioniert
- [x] Routine-Seiten: Button zum in den Warenkorb legen im Gesamtpreis-Feld wie auf der individuellen Creme-Seite
- [x] Hauttest-Ergebnis-Seite: Button zum in den Warenkorb legen im Gesamtpreis-Feld wie auf der individuellen Creme-Seite
- [x] Button-Design korrigieren: Beiger Button mit grüner Schrift (wie "Zum Warenkorb" Button auf individueller Creme-Seite) auf allen Routine-Seiten und Hauttest-Seite
- [x] Warenkorb: Konfigurationsanzeige für Peelings, Reiniger und Sonnenschutz entfernen
- [x] Warenkorb-Übersicht: Konfigurationsanzeige für Peelings, Reiniger und Sonnenschutz entfernen
- [x] Warenkorb: Produktbilder von den Routine-Seiten hinzufügen (Cart.tsx und CartSidebar.tsx)
- [x] Produktbilder aktualisieren: Reinigungsgel, Reinigungsmilch, BHA Peeling und AHA Peeling mit neuen Bildern auf Routine-Seiten und Hauttest verwenden
- [x] Produktbilder als Quadrate zuschneiden auf Routine-Seiten und Hauttest-Ergebnis-Seite
- [x] EANs für Produkte hinterlegen: Basis-Produkte (Basiscreme, Basisserum) und Wirkstoffe mit EANs in Shopify aktualisieren
- [x] Bestellungen mit EAN-Informationen anzeigen: Warenkorb und Bestellbestätigung sollten EANs für Basis und Wirkstoffe enthalten
- [x] Bestellungen: EAN-Nummern werden jetzt automatisch zu Bestellattributen hinzugefügt
- [x] EANs für einzelne Wirkstoffe: Alle Wirkstoffe (Niacinamide-Komplex, Wildrosenöl, etc.) mit EANs in Bestellattributen hinzufügen (Backend-sichtbar, nicht für Kunden)

- [x] EANs für individuelle Wirkstoffe in Creme und Serum als versteckte Attribute in Shopify-Bestellungen hinterlegen.
- [x] Hardcodierte Preisanzeige €210 in SkinTest.tsx durch dynamische Berechnung ersetzt
- [x] Alte Routine-Dateien-Verzeichnis aus Tests entfernt (routines-Verzeichnis existiert nicht mehr)


## Bilder für Routine-Seiten - NEU

- [x] Bilder aus dem referenzierten Projekt (YSAhJ3awNcnCc3DDT8f5Ku) extrahieren
- [x] Bilder für jeden Hauttyp hochladen (manus-upload-file --webdev)
- [x] RoutineTemplate.tsx aktualisieren, um unterschiedliche Bilder pro Hauttyp anzuzeigen
- [x] Bilder testen und verifizieren, dass sie auf allen Routine-Seiten korrekt laden

## Vollständiger Import echter Kundenbewertungen – 2026-08-07

- [x] Alle Bewertungen aus der bereitgestellten Judge.me-CSV in die Produktbewertungsdatenbank importieren
- [x] Importmenge, Produktzuordnung und Sichtbarkeit auf den jeweiligen Produktseiten verifizieren

## Direkte Warenkorb-Aktionen in Produkt-Empfehlungen – 2026-08-07

- [x] Empfohlene Produkte auf Reiniger-, Peeling- und Sonnenschutz-Seiten direkt zum Shopify-Warenkorb hinzufügen können
- [x] Warenkorb-Aktion und responsive Darstellung auf allen betroffenen Seiten testen

## Kostenloser Versand und Warenkorb-Empfehlungen – 2026-08-07

- [x] Dynamischen Fortschrittsbalken für kostenlosen Versand ab 60 € im Warenkorb ergänzen
- [x] Passende Produktvorschläge wie auf der Referenzseite im Warenkorb anzeigen und direkt hinzufügbar machen
- [x] Versand-Schwellenwert, Warenkorb-Interaktion und mobile Darstellung testen

## Zusätzliche Warenkorb-Empfehlungen – 2026-08-07

- [x] 50-ml-Reiniger mit dem vorhandenen Shopify-Produkt als direkt kaufbare Warenkorb-Empfehlung ergänzen
- [x] Gua-Sha-Jadestein mit dem neu angelegten Shopify-Produkt, korrektem Referenzpreis und der Bezeichnung „Gua Sha Jade“ als Warenkorb-Empfehlung ergänzen
- [x] Preise, Verfügbarkeit und direkte Warenkorb-Aktionen der neuen Empfehlungen testen

## Produktbild 50-ml-Reinigungsgel im Warenkorb – 2026-08-07

- [x] Bereitgestelltes quadratisches Produktfoto als Bild der 50-ml-Reiniger-Empfehlung im Warenkorb verwenden
- [x] Darstellung und Kaufpfad nach der Bildaktualisierung testen

## Detailseiten aus Warenkorb-Empfehlungen – 2026-08-07

- [x] „Mehr erfahren“-Links für alle Warenkorb-Empfehlungen ergänzen
- [x] Detailseite für Gua Sha Jade ergänzen und aus der Warenkorb-Empfehlung verlinken
- [x] Navigation zu Detailseiten und direkte Warenkorb-Aktion testen

## AHA-Peeling-Detailseiten-Link – 2026-08-07

- [x] Fehlerhaften „Mehr erfahren“-Link des AHA-&-PHA-Peelings im Warenkorb auf die gültige Detailseite korrigieren
- [x] Weiterleitung und Warenkorb-Empfehlung nach der Korrektur testen
