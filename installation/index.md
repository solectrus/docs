---
title: Installation
layout: page
nav_order: 2
---

# Installation von SOLECTRUS

Für die Installation von SOLECTRUS ist ein wenig **Erfahrung mit Linux und Docker** sehr hilfreich. Wer in der Lage ist, sich per SSH auf einen Linux-Server einzuloggen und das Konzept von _Docker-Compose_ grob verstanden hat, der wird die Installation schaffen. Andernfalls sollte vielleicht ein IT-Freund gefragt werden, der dabei hilft.

## Überblick zur Architektur

Bevor es in die Details der Installation geht, hier ein Überblick über die Architektur von SOLECTRUS.

SOLECTRUS ist eine Webanwendung, die auf einem Server läuft und über den Browser aufgerufen wird. Neben diesem Dashboard gibt es etliche weitere Komponenten, die im Hintergrund laufen und die Daten sammeln und verarbeiten. Üblicherweise benötigt man nicht alle Komponenten, sondern nur die, die für das eigene Setup notwendig sind.

<img src="{{ site.baseurl }}/assets/images/architektur.svg" alt="Architektur von SOLECTRUS" />

Jede Komponente läuft in einem separaten Docker-Container. Hierzu gehören:

- [Dashboard-App](/referenz/dashboard), der Hauptbestandteil mit der Benutzeroberfläche
- [InfluxDB](/referenz/influxdb), die Zeitreihendatenbank für Messwerte
- [PostgreSQL](/referenz/postgresql), die Datenbank für alle anderen Daten (z.B. Strompreise und Einstellungen)
- [Redis](/referenz/redis), eine In-Memory-Datenbank für bessere Performance durch Caching
- Verschiedene _Kollektoren_, mit denen Messwerte eingesammelt werden. Es gibt beispielsweise den [SENEC-Collector](/referenz/senec-collector), der Daten vom SENEC-Speicher abruft. Es gibt aber auch den [MQTT-Collector](/referenz/mqtt-collector), der benötigt wird, wenn man Daten von einem MQTT-Broker abrufen möchte. Spezielle Kollektoren für [Tibber](/referenz/tibber-collector) oder [Shelly](/referenz/shelly-collector) sind ebenfalls vorhanden. Ein [Forecast-Collector](/referenz/forecast-collector) ermöglicht eine Vorhersage der PV-Erzeugung. Die Kollektoren sind optional und können je nach Bedarf eingesetzt werden.
- [CSV-Importer](/referenz/csv-importer), der historische Messwerte im CSV-Format einmalig nach InfluxDB überträgt
- [Power-Splitter](/referenz/power-splitter), der die Aufteilung des Netzbezugs auf verschiedene Verbraucher berechnet

Die Container sind per Docker-Compose in einem Docker-Netzwerk miteinander verbunden und kommunizieren untereinander.

## Erste Schritte

Vor der Installation sind zunächst die [Systemvoraussetzungen](/installation/systemvoraussetzungen) zu prüfen. Anschließend hilft der [Konfigurator](/installation/konfigurator), die richtigen Einstellungen zu finden. Mit der dabei generierten Anleitung und den erstellten Konfigurationsdateien kann die Installation dann leicht über die Linux-Konsole durchgeführt werden.
