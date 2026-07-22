# Bildwiederherstellung – Arbeitsinventur

## Befund vom 22. Juli 2026

Die aktuelle Storefront referenziert 65 eindeutige `/manus-storage/`-Pfade. Eine Erreichbarkeitsprüfung über die laufende Vorschau lieferte für alle geprüften Pfade HTTP 403. Die fehlenden Bilder betreffen insbesondere die Startseite, die Konfiguratoren, Ingredient-Detail-Modals, Hauttest-Ergebnisse, Routine-Empfehlungen, Reiniger- und Peelingübersichten sowie die About-Seite.

## Verfügbare Originalquellen

Die öffentliche bestehende Herbsom-Seite und der verbundene Shopify-Admin-Katalog liefern die Originalmedien als Quelle. Die vollständige lesende Shopify-Medienabfrage liegt temporär unter `/tmp/manus-mcp/mcp_result_573ba58b-7f3b-4da0-b1a8-35cee5e1eb23.json` und enthält für 40 aktive Produkte Bild-URLs und Abmessungen.

| Einsatzbereich | Wiederverwendbare Originalquelle |
|---|---|
| Bestehende Startseite – Hero | `https://herbsom.de/cdn/shop/files/IMG_2482.jpg?v=1774969368` |
| Bestehende Startseite – weitere Editorialbilder | `https://herbsom.de/cdn/shop/files/IMG_2490.jpg?v=1774969379`, `https://herbsom.de/cdn/shop/files/P2246008_2.jpg?v=1688050798`, `https://herbsom.de/cdn/shop/files/P2235911_2.jpg?v=1767714436`, `https://herbsom.de/cdn/shop/files/P2224935_2.jpg?v=1688050865`, `https://herbsom.de/cdn/shop/files/Group_202.png?v=1682595831`, `https://herbsom.de/cdn/shop/files/Group_202_1.png?v=1682595801` |
| Konfigurator-Creme – Wildrosenöl | `https://cdn.shopify.com/s/files/1/0517/5702/3400/products/Wildrosenol-overview_53b3eb91-fe78-4ac4-a12c-85c6bd6474bd.png?v=1637982681` |
| Konfigurator-Creme – Distelöl | `https://cdn.shopify.com/s/files/1/0517/5702/3400/products/Distelol-overview_8ff903af-b9c4-44d8-bfa3-d7b92bd4ac09.png?v=1637982401` |
| Konfigurator-Creme – Sanddornöl | `https://cdn.shopify.com/s/files/1/0517/5702/3400/products/Sanddornol-overview_45ff6334-a2c0-4976-8e8a-a1496358f53e.png?v=1637982570` |
| Konfigurator-Creme – Malvenextrakt | `https://cdn.shopify.com/s/files/1/0517/5702/3400/products/Malvenextrakt-overview_711968cf-175b-4950-8e2b-5f1ecf43879d.png?v=1637982459` |
| Konfigurator-Creme – Weidenrindenextrakt | `https://cdn.shopify.com/s/files/1/0517/5702/3400/products/Weidenrinde-overview.png?v=1637478015` |
| Konfigurator-Creme – Rosskastanienextrakt | `https://cdn.shopify.com/s/files/1/0517/5702/3400/products/Roskkastanie-overview_5d182235-3e07-49fc-abdc-b8e2b8bb91f9.png?v=1637982525` |

Die Storefront muss die wiederhergestellten Bilddateien als Projekt-Web-Assets einbinden. Die Originaldateien werden außerhalb des Projektordners unter `/home/ubuntu/webdev-static-assets/` abgelegt und anschließend über die Projekt-Asset-Ablage referenziert.
