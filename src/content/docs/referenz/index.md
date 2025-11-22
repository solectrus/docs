---
title: Referenz zu allen Komponenten
sidebar:
  order: 1
  label: Komponenten
---

SOLECTRUS besteht aus etlichen Komponenten (Services), die jeweils als eigene Docker-Container betrieben werden.

Für den Einsatz von SOLECTRUS ist eine `compose.yaml` zu erstellen, in der jeder benötigte Service definiert wird. Die Konfiguration der Services erfolgt über Umgebungsvariablen, die in einer `.env`-Datei definiert werden. Es sind alo genau diese zwei Dateien zu erstellen, deren Aufbau in den folgenden Unterseiten beschrieben wird.

Die Services gliedern sich in verschiedene Kategorien:

## Benutzeroberfläche

Das browser-basierte Dashboard ist das zentrale Bedienelement von SOLECTRUS:

- [Dashboard](dashboard)

## Datensammlung (Collector)

Messwerte werden von den Collectoren kontinuierlich gesammelt und in die Datenbank (InfluxDB) geschrieben:

- [SENEC-Collector](senec-collector)
- [Tibber-Collector](tibber-collector)
- [MQTT-Collector](mqtt-collector)
- [Shelly-Collector](shelly-collector)
- [Forecast-Collector](forecast-collector)

## Datenverarbeitung

Einige Komponenten verarbeiten die gesammelten Daten weiter:

- [Power-Splitter](power-splitter)
- [SENEC-Charger](senec-charger)
- [CSV-Importer](csv-importer)

## Datenbanken

Außerdem verwendet SOLECTRUS **drei** Datenbanken:

- [InfluxDB](influxdb): Zeitreihendatenbank für Messwerte
- [PostgreSQL](postgresql): Relationale Datenbank für Einstellungen und Strompreise
- [Redis](redis): In-Memory-Datenbank für das Caching von Abfrageergebnissen
