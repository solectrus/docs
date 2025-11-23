---
title: Was ist der CSV-Importer?
sidebar:
  order: 1
  label: Übersicht
---

Der **CSV-Importer** ist ein Werkzeug, das historische Messwerte im CSV-Format einmalig nach InfluxDB überträgt. Das ist nützlich, um nach der Installation direkt mit Daten arbeiten zu können, ohne auf die ersten Messwerte warten zu müssen. Hat man im Idealfall die Messwerte seit Installation der PV-Anlage vorliegen, kann man dadurch auch rückwirkend vollständige Analysen mit SOLECTRUS durchführen (z.B. Ersparnis etc.)

Unterstützt werden die Datenformate der Stromspeicher/Wechselrichter von:

- SENEC
- Sungrow
- SolarEdge

## Voraussetzungen

- SOLECTRUS muss installiert und betriebsbereit sein
- CSV-Dateien von einem der unterstützten Hersteller müssen vorliegen

## CSV-Dateien beschaffen

Die CSV-Dateien können über die jeweiligen Hersteller-Portale heruntergeladen werden:

- **SENEC:** [mein-senec.de](https://mein-senec.de)
- **Sungrow:** [portaleu.isolarcloud.com](https://portaleu.isolarcloud.com)
- **SolarEdge:** [monitoring.solaredge.com](https://monitoring.solaredge.com)

## Quelltext

Der CSV-Importer ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/csv-importer](https://github.com/solectrus/csv-importer)
