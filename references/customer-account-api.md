# Shopify Customer Account API – Implementierungsnotizen

Das Kunden-Dashboard verwendet OAuth 2.0 mit PKCE, einen vertraulichen Client und ausschließlich serverseitig gespeicherte, verschlüsselte Customer-Account-Tokens.

## Benötigte Shopify-Konfiguration

- **Customer accounts** müssen im Shopify-Admin aktiviert sein.
- Für Bestellhistorie sind die Customer-Scopes `customer_read_orders` und `customer_read_customers` erforderlich.
- Der OAuth-Flow verwendet `openid email customer-account-api:full` sowie PKCE (`S256`).
- Die Callback-URL der Produktionsumgebung lautet `https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/callback`.

## Relevante offizielle Quellen

1. [Getting started with the Customer Account API](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started)
2. [Authenticate customers with the Customer Account API](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers)
3. [Customer Account API access scopes](https://shopify.dev/docs/api/usage/access-scopes)
4. [Customer API Order object](https://shopify.dev/docs/api/customer/latest/objects/Order)
5. [Customer API LineItem object](https://shopify.dev/docs/api/customer/latest/objects/LineItem)

## Produktionsprüfung

Am 08.08.2026 leitete `https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/login` erfolgreich zur Shopify-Anmeldeseite unter `https://account.herbsom.de/authentication/login` weiter. Der abschließende Login und die Abfrage echter Bestellhistorien erfordern die Anmeldung eines Kundenkontos.
