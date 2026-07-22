# Bildvalidierung – 22. Juli 2026

## Automatischer Abgleich

Die erneute statische Prüfung hat **79 verwendete Bildreferenzen** gefunden. Keine Referenz zeigt mehr auf den entfernten lokalen Pfad `/images/`; alle Bildquellen verwenden `/manus-storage/`.

Die Laufzeitprüfung über den aktiven Storefront-Server hat für alle 79 verwendeten Projekt-Assets eine gültige Bildantwort bestätigt. Es wurden **0 nicht verfügbare oder ungültige Bildquellen** erkannt.

## Visuelle Stichproben

Die folgenden bildintensiven Seiten wurden als vollständige Desktopansicht geprüft: `/`, `/about`, `/cleaners`, `/peelings`, `/product/cleaner`, `/routines/unreine-haut`, `/hauttest` und `/configurator/serum`.

Zusätzlich wurden `/`, `/product/cleaner`, `/routines/unreine-haut` und `/configurator/serum` als vollständige Mobilansicht geprüft. Alle sichtbaren Produkt-, Inhaltsstoff-, Routine-, Team- und Markenbilder wurden geladen. Es gab keine kaputten Bildsymbole, leeren Bildflächen mit erwarteten Fotos oder fehlerhafte Bildanfragen im Netzwerkprotokoll.

Die Flächen ohne Fotomotiv im Ablaufbereich des Serum-Konfigurators sind Teil der vorgesehenen Gestaltung; dort ist keine nicht geladene Bildquelle hinterlegt.

## Regression-Schutz

Der neue Vitest-Test `server/client-image-assets.test.ts` verhindert künftig lokale Verweise auf entfernte `/images/`-Dateien sowie bekannte unzugängliche Altkennungen. Die vollständige Testausführung bestand mit **14 erfolgreichen Testdateien**, **138 bestandenen Tests** und **1 übersprungenen Test**.

TypeScript-Prüfung und Produktions-Build waren ebenfalls erfolgreich.
