---
title: SENEC-Collector
layout: page
parent: Referenz
nav_order: 2
---

Der **SENEC-Collector** ist eine Komponente, die Daten von einem SENEC-Stromspeicher ausliest und in eine InfluxDB schreibt.

Grundsätzlich sind zwei verschiedene Betriebsmodi (Adapter) möglich:

- **Lokal:** Direkter Zugriff auf den SENEC-Stromspeicher über dessen lokale IP-Adresse. Die Daten werden über die lala.cgi-Schnittstelle ausgelesen. Möglich ist das für den V2.1 und V3, nicht aber beim Home 4 (dieser hat diese Schnittstelle nicht). Ein Auslesen der Messwerte ist in einem kurzen Intervall möglich, vorgegeben sind 5 Sekunden.

- **Cloud:** Der SENEC-Collector liest die Daten aus der SENEC-Cloud aus und verwendet dazu die Schnittstelle, die von SENEC für die App bereitgestellt wird, d.h. es sind die SENEC-Zugangsdaten anzugeben (E-Mail und Passwort). Möglich ist das auch für den Home 4. Das Auslesen der Messwerte ist nur einem einem längeren Intervall erlaubt, das vom Gerät abhängt. Beim Home 4 ist eine Abfrage im 1m-Takt möglich, beim V2.1 und V3 im 5-Minuten-Takt.

Beim Home 4 ist es also nicht möglich, den SENEC-Collector im lokalen Modus zu betreiben. Dort ist nur der Cloud-Modus möglich.

Beim V2.1 und V3 ist es möglich, sich für einen der beiden Adapter frei zu entscheiden. Dies eröffnet die Möglichkeit, SOLECTRUS rein in der Cloud zu betreiben, also ohne einen Raspberry o.ä. im lokalen Netzwerk. Diesem Vorteil steht der Nachteil gegenüber, dass die Daten nicht so häufig aktualisiert werden (einmal alle 5min, statt alle 5s).

Quelltext im GitHub-Repository: \
[github.com/solectrus/senec-collector](https://github.com/solectrus/senec-collector)
