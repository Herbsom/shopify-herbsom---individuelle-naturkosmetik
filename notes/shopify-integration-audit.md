# Shopify-Integrationsaudit

Stand: 21. Juli 2026

## Zielshop und Quellen

- Shopify-Admin-URL des Nutzers: https://admin.shopify.com/store/herbsom
- Verbundener Store: `herbsom.myshopify.com`
- Öffentliche bisherige Produkt-URLs verwenden `https://herbsom.de/products/<handle>`.
- Der direkte Browserzugriff auf die Admin-URL führte zur Shopify-Verifizierungsseite; die Projektintegration selbst wurde anschließend per OAuth erfolgreich für den bestehenden Store aktiviert.
- Katalogquelle: Shopify-Verwaltungs-API über die autorisierte Projektintegration (`shopify_get_products`, `shopify_get_product`).
- Storefront-Verifikation: `pnpm shopify:probe`; Ergebnis erfolgreich, 25 über die Storefront-API sichtbare Produkte im Probe-Limit, mit Titel, Bild, Preis und verfügbaren Varianten.

## Katalogübersicht

Die Verwaltungs-API lieferte 50 Produkte; `hasNextPage` war `false`. Der Shop enthält aktive Verkaufsprodukte, Zutaten-/Basisprodukte, Entwürfe, archivierte Altprodukte und Testprodukte. Vorhandene Produkte, Preise, Varianten und Medien werden als Quelle der Wahrheit behandelt und nicht automatisch verändert.

### Relevante aktive Verkaufsprodukte und Handles

| Produkt | Shopify-Produkt-GID | Handle | Varianten/Preis laut Shopify |
|---|---|---|---|
| Individuelle Creme | `gid://shopify/Product/7172159701160` | `erstelle-deine-creme` | 5 Varianten nach Wirkstoffanzahl: 0 = 26 EUR, 1 = 31 EUR, 2 = 36 EUR, 3 = 41 EUR, 4 = 46 EUR |
| Individuelles Serum | `gid://shopify/Product/8027748040970` | `individuelle-serum-creme` | Variante „3“, `gid://shopify/ProductVariant/43864297799946`, 55 EUR |
| Reinigungsgel | `gid://shopify/Product/8009139257610` | `reinigungsgel` | 1 Variante, Storefront-Preis 32 EUR |
| Reinigungsmilch | `gid://shopify/Product/8009139355914` | `reinigungs-milch` | 1 Variante, Storefront-Preis 32 EUR |
| AHA & PHA Peeling | `gid://shopify/Product/8009139454218` | `aha-pha-peeling` | 1 Variante, Storefront-Preis 38 EUR |
| BHA & Azelainsäure Peeling | `gid://shopify/Product/8009139519754` | `bha-azelainsaure-peeling` | 1 Variante, Storefront-Preis 38 EUR |
| 50 ml Reinigungsgel | `gid://shopify/Product/9549116145930` | `mini-reiniger` | 1 Variante, Storefront-Preis 12 EUR |
| Sonnenschutzfluid SPF 50+ | `gid://shopify/Product/10443487740170` | `sonnenschutzfluid-spf-50` | `gid://shopify/ProductVariant/52721315840266`, 39 EUR |
| Unser Gutschein | `gid://shopify/Product/7216234397864` | `unser-gutschein-1` | 16 Wert-/Lieferoption-Varianten; u. a. 10–100 EUR sowie weitere Bundle-Werte |

### Individuelle Creme – Varianten

| Wirkstoffanzahl | Varianten-GID | Preis | SKU |
|---:|---|---:|---|
| 0 | `gid://shopify/ProductVariant/50268260663562` | 26 EUR | `Cremebasisindividuell0` |
| 1 | `gid://shopify/ProductVariant/50268260696330` | 31 EUR | `Cremebasisindividuell1` |
| 2 | `gid://shopify/ProductVariant/41422216986792` | 36 EUR | `Cremebasisindividuell2` |
| 3 | `gid://shopify/ProductVariant/41422217019560` | 41 EUR | `Cremebasisindividuell3` |
| 4 | `gid://shopify/ProductVariant/41422217085096` | 46 EUR | `Cremebasisindividuell4` |

### Gutscheinvarianten

Der aktive Gutschein hat das Handle `unser-gutschein-1`. Die sichtbaren Standardbeträge 10, 20, 30, 40, 50, 60, 70, 80, 90 und 100 EUR besitzen eigene Varianten. Weitere Shopify-Optionen sind 150 EUR, 200 EUR sowie produktbezogene Gutscheinwerte. Die Storefront soll die passende Variante anhand des ausgewählten Betrags wählen, nicht einen synthetischen lokalen Artikel erzeugen.

## Technische Integrationsbefunde

- Die Headless-Shopify-Funktion wurde erfolgreich in das Projekt injiziert.
- Der zentrale `commerceRouter` wurde in `server/routers.ts` registriert.
- `server/_core/env.ts` exportiert bereits `SHOPIFY_STORE_DOMAIN` und `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` über `ENV.shopifyStoreDomain` und `ENV.shopifyStorefrontAccessToken`.
- Das neue Cart-Scaffold verwendet den normalisierten Shopify-Warenkorb, speichert nur die Shopify-Cart-ID unter `commerce:cart-id` und leitet über `cart.checkoutUrl` zum Shopify Checkout weiter.
- Der vorhandene Herbsom-Code verwendet noch synthetische lokale Artikelobjekte (`id`, `name`, `price`, `description`) und lokale `/checkout`-/`/account`-Flows. Diese Aufrufer müssen auf Shopify-Varianten bzw. eine geprüfte Kompatibilitätsschicht umgestellt werden.
- Personalisierte Serum-/Creme-Konfigurationen müssen als Shopify Cart-Line-Attribute übertragen werden, damit Wirkstoffe und Basis in der Shopify-Bestellung sichtbar bleiben.
- Alte Sync-Dateien enthalten teilweise Placeholder-GIDs und sind keine verlässliche Grundlage für den produktiven Warenkorb. Die Storefront soll Produkte per Handle aus der Storefront-API auflösen.

## Nicht automatisch zu verändernde Shopdaten

Ohne ausdrückliche Nutzerfreigabe werden keine Shopify-Produkte neu angelegt und keine Preise, Varianten, Bilder, Bestände, Titel oder Metafelder verändert. Entwürfe, archivierte Produkte und Testprodukte werden nicht veröffentlicht.
