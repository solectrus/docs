---
title: Installation
layout: page
nav_order: 2
---

# Installation von SOLECTRUS

Für die Installation von SOLECTRUS ist ein wenig Erfahrung mit **Linux** und **Docker** sehr hilfreich. Wenn du weißt, wie du dich per SSH auf einen Linux-Server einloggst, dann wirst du die Installation bestimmt hinbekommen. Andernfalls solltest du vielleicht einen IT-Freund fragen, der dir hilft.

Ausgangspunkt einer Installation ist der brandneue, interaktive Konfigurator, der den Einstieg leicht macht. Du kannst damit deine individuelle Konfiguration zusammenstellen und erhältst dann alles, was du benötigst:

- `readme.md` mit einer individuellen Schritt-für-Schritt-Anleitung für die Installation mit Docker
- `compose.yaml` mit der Definition der benötigen Docker-Services
- `.env` für die Umgebungsvariablen mit den individuellen Einstellungen

Mit der Anleitung und den beiden Konfigurationsdateien kannst du die Installation dann leicht über die Linux-Konsole durchführen.

<div class="text-center">
  <a href="https://configurator.solectrus.de">Zum Konfigurator ❯</a>
</div>

## Überblick zur Architektur

SOLECTRUS ist eine Webanwendung, die auf einem Server läuft und über den Browser aufgerufen wird.

Zusätzlich gibt es weitere Komponenten, die im Hintergrund laufen und die Daten sammeln und verarbeiten. Üblicherweise benötigt man nicht alle Komponenten, sondern nur die, die für das eigene Setup notwendig sind.

<img src="{{ site.baseurl }}/assets/images/architektur.svg" alt="Architektur von SOLECTRUS" />

Jede Komponente läuft in einem separaten Docker-Container. Hierzu gehören:

- Dashboard-App, der Hauptbestandteil mit der Benutzeroberfläche
- InfluxDB, die Zeitreihendatenbank für Messwerte
- PostgreSQL, die Datenbank für alle anderen Daten (z.B. Strompreise und Einstellungen)
- Redis, In-Memory-Datenbank für bessere Performance durch Caching
- Verschiedene "Kollektoren", mit denen Messwerte eingesammelt werden. Es gibt beispielsweise den SENEC-Collector, der Daten vom SENEC-Speicher abruft. Es gibt aber auch den MQTT-Collector, der benötigt wird, wenn du Daten von einem MQTT-Broker abrufen möchtest. Spezielle Kollektoren für Tibber oder Shelly sind ebenfalls vorhanden. Ein Forecast-Collector ermöglicht eine Vorhersage der PV-Erzeugung. Die Kollektoren sind optional und können je nach Bedarf eingesetzt werden.
- CSV-Importer, der historische Messwerte im CSV-Format einmalig nach InfluxDB überträgt
- Power-Splitter, der die Aufteilung des Netzbezugs auf verschiedene Verbraucher berechnet

Die Container sind in einem Docker-Netzwerk miteinander verbunden und kommunizieren untereinander.

## Szenarien der Installation

Es ist möglich (und in den meisten Fällen auch empfehlenswert), alle notwendigen Komponenten auf dem gleichen Gerät zu betreiben. Denkbar ist aber auch eine verteilte Installation, bei der nur einige Kollektoren auf dem eigenen Gerät laufen und alles andere extern in der Cloud. Letzteres ist beispielsweise bei der [Live-Demo](https://demo.solectrus.de) der Fall.

Der Konfigurator ermöglicht drei grundsätzlich verschiedene Szenarien:

- Lokale Installation (auf einem lokalen Linux-Server wie dem Raspberry Pi oder Synology NAS)
- Verteilte Installation (Datensammlung auf einem lokalen Linux-Server, Datenspeicherung und Dashboard auf einem Cloud-Server)
- Im Fall von SENEC ist eine reine Cloud-Installation möglich, bei der lokal gar kein Server notwendig ist, sondern die Messwerte direkt über eine API von SENEC abgerufen werden.
