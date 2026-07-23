# Architekturentscheidung: aktive Shopify-Commerce-Schicht und archivierte Legacy-Funktionen

**Datum:** 2026-07-22  
**Status:** Verbindlich für diesen Shopify-Spin-off

## Entscheidung

Dieses Projekt ist als **Shopify Headless Storefront** mit dem verbundenen Shop `herbsom.myshopify.com` konfiguriert. Die produktive Laufzeit verwendet den registrierten `commerceRouter` und die Shopify Storefront API. Eine parallele Stripe-Zahlungs- oder Stripe-Abonnementintegration ist in diesem Projekt nicht aktiv und aufgrund der projektspezifischen Integrationskonfiguration nicht vorgesehen.

Daher wird die historische Aufgabe „Automatische Abrechnung und Bestellerstellung bei Fälligkeit“ **archiviert und aus dem aktiven Umfang dieses Shopify-Spin-offs entfernt**. Sie wird nicht als implementierte Shopify-Funktion ausgegeben. Falls später ein eigenständiges Stripe-Abonnementprojekt gewünscht ist, muss es als separate Projektkopie ohne Shopify-Integration geplant werden.

| Historische Fläche | Befund | Entscheidung |
|---|---|---|
| Stripe-Abo-Fälligkeit | Keine aktive Stripe-Integration und keine zugehörigen Servermodule im aktuellen Projekt | Als nicht anwendbare Altanforderung archivieren |
| `server/routers/shopify-products.ts` | Nicht in `server/routers.ts` registriert; Mutationen verwenden dennoch `publicProcedure` | Entfernen statt eine ungenutzte Admin-API weiterzupflegen |
| `server/_core/shopify-product-sync.ts` | Nur vom nicht registrierten Router und dessen Tests verwendet; enthält Platzhalter-GIDs | Entfernen |
| `server/_core/shopify-metafields.ts` | Ausschließlich von der ungenutzten Legacy-Sync-Fläche und deren Tests verwendet | Entfernen |
| Produktive Commerce-Schicht | `commerceRouter` ist unter `commerce` registriert | Unverändert beibehalten |

## Sicherheits- und Wartungswirkung

Durch die Entfernung der nicht registrierten Legacy-Fläche verbleiben keine öffentlichen Sync-Mutationen, keine Platzhalter-Produkt-IDs und keine vorgetäuschte Metafield-Administrationsoberfläche im Repository. Die aktive Shopify-Storefront, der Warenkorb und der Checkout bleiben davon unabhängig.
