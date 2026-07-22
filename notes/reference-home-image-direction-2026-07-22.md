# Bildausrichtung an der Referenzseite – 22. Juli 2026

## Referenzseite

Quelle: `https://herbsomweb-zgqpcjfd.manus.space/`

Die Referenzstartseite nutzt im Hero ein großflächiges Editorial-Motiv mit zwei Personen sowie einem Sonnenschutzprodukt. Dieses Motiv liegt als bildfüllender Hintergrund hinter der linken Textspalte. Es ersetzt nicht nur das Produktmotiv, sondern definiert auch den Ausschnitt und die Stimmung des Einstiegs.

Im sichtbaren Produktbereich folgen vier freigestellte, helle Gruppenmotive: ein Serum-Set, ein Creme-Set, ein Reiniger-Set und ein Peeling-Set. Die Bilder sind jeweils als klare Produktgruppe auf weißem beziehungsweise sehr hellem Grund inszeniert und stehen oberhalb der Produkttexte.

Weitere Bildabschnitte der Referenz folgen einem wiederkehrenden Muster: ein Editorial- oder Markenmotiv im Philosophieabschnitt, ein Set aus Produkten beim Hauttest, ein freigestelltes Sonnenschutzmotiv in der Sonnenschutzsektion, ein Marken-/Teamfoto in der Storysektion sowie ein Wirkstoffstillleben nahe dem Abschlussbereich.

## Abgleich mit dem aktuellen Storefront

Die aktuelle Startseite verwendet zurzeit teilweise einzelne Produktbilder an Positionen, an denen die Referenz Gruppen- oder Editorialmotive nutzt. Besonders sichtbar ist der Hero: Im aktuellen Storefront zeigt er ein einzelnes Peelingbild, während die Referenz das großflächige Personenmotiv mit Sonnenschutz verwendet.

Die Produktkarten, der Philosophieabschnitt, der Hauttest, die Sonnenschutzsektion, die Storysektion und das Wirkstoffstillleben werden im nächsten Schritt auf die semantisch entsprechenden Referenzmotive ausgerichtet. Die bereits validierten Bildpfade werden dabei nur durch zuvor erreichbarkeitsgeprüfte Projekt-Web-Assets ersetzt.

## Exakte Bildquellen und Reihenfolge der Referenzstartseite

Die Referenzseite setzt die Motive als CSS-Hintergrundbilder ein. Die folgende Zuordnung wurde direkt aus den berechneten Styles der gerenderten Seite ermittelt.

| Referenzbereich | Quellbild auf der Referenzseite | Position und Darstellung |
|---|---|---|
| Hero | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260619_071336_d8dc704a-9533-4aa9-8ee0-58f26120ded1_2f2d57e9.png` | Vollflächiger Hintergrund, 1265 × 900 px in Desktopansicht; `bg-cover bg-center`; heller Verlauf für Textlesbarkeit |
| Produktkarte: Serum | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260617_081131_6c43fbf2-5ff1-4e70-b1e5-84a04df359ae_ebeb789c.png` | 488 × 288 px, `bg-cover bg-center` |
| Produktkarte: Creme | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260617_073341_a333548e-590d-40be-85dc-8fab622efb62_252bdac7.png` | 488 × 288 px, `bg-cover bg-center` |
| Produktkarte: Reiniger | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260619_073327_842ecf4c-75f8-4b61-90d4-e93de49dea3c_79976953.png` | 488 × 288 px, `bg-cover bg-center` |
| Produktkarte: Peeling | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260619_073141_d999c29b-9237-4e52-88e0-3c2d0ddb8754_a735f047.png` | 488 × 288 px, `bg-cover bg-center` |
| Philosophie | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260618_150349_e74cda09-e004-4a10-bd54-95dc0d3d61c1_bce52ddf.jpeg` | Zweispaltig, 633 × 637 px, `bg-cover bg-center` |
| Hauttest | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260618_151841_443bf9a7-7126-4b40-ae16-32ebd8d1a8c7_51243853.png` | Hochformat, 537 × 715 px, `bg-cover bg-center` |
| Story | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260619_074101_cd1a4e38-3c45-437b-9a33-069a28aa5c6b_b086c696.jpg` | 4:3-Motiv, 537 × 402 px, `bg-cover bg-center` |
| Wirkstoffabschluss | `https://herbsomweb-zgqpcjfd.manus.space/manus-storage/hf_20260618_145722_30c0e49d-6997-40c2-ab11-dfd6b32e31e8_72ed495e.png` | Zweispaltig, 633 × 532 px, `bg-cover bg-center` |
| Texturabschnitt | `https://d2xsxph8kpxj0f.cloudfront.net/310519663746048126/RCXWGckFA9VwPfc2J3kKJs/herbsom_texture-m7ZGot83zn66cGJVLtA6wB.webp` | Vollbreiter Hintergrund, 1265 × 550 px, `bg-cover bg-center` |

Die größte Abweichung der aktuellen Startseite betrifft den Hero. Dafür soll das erste oben genannte Personen- und Sonnenschutzmotiv verwendet werden; anschließend sollen die vier Produktkarten und die weiteren Startseitenabschnitte mit der aufgeführten semantischen Reihenfolge abgeglichen werden.

## Visuelle Umsetzungskontrolle

Die Startseite wurde nach der Zuordnung auf Desktop (1280 × 720 px, vollständige Seite) und Mobil (390 × 844 px, vollständige Seite) geprüft. In beiden Ansichten sind alle zehn Bildflächen ohne Platzhalter, Leerräume oder Fehlersymbole sichtbar.

| Bereich | Desktop | Mobil | Ergebnis |
|---|---|---|---|
| Hero mit Personen- und Sonnenschutzmotiv | Vollflächig, lesbare Textüberlagerung | Sinnvoller `cover`-Ausschnitt ohne gebrochene Fläche | Bestanden |
| Vier Produktkarten | Serum, Creme, Reiniger und Peeling in Referenzreihenfolge | Einspaltig, je Karte vollständig sichtbar | Bestanden |
| Philosophie, Hauttest, Sonnenschutz und Story | Semantisch passende Referenzmotive an den entsprechenden Bildflächen | Bilder responsiv und vollständig geladen | Bestanden |
| Texturabschluss | Referenz-Texturmotiv vollständig sichtbar | Responsiver Ausschnitt ohne Unterbrechung | Bestanden |

Zusätzlich meldete die Laufzeitprüfung für alle 79 verwendeten Projekt-Web-Assets eine gültige Bildantwort; es bestehen keine nicht erreichbaren oder ungültigen Bildpfade.
