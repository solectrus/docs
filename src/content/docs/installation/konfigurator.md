---
title: Konfigurator zum Einrichten von SOLECTRUS
sidebar:
  order: 3
  label: Konfigurator
---

Es gibt unzählige Möglichkeiten, SOLECTRUS zu betreiben. Allein die Vielzahl der unterstützten Geräte und Datenquellen führt dazu, dass die Installation eine sehr individuelle Angelegenheit ist. Der interaktive **Konfigurator** hilft dabei, die richtigen Einstellungen zu finden.

## Konfigurator starten

Der Konfigurator erstellt im Dialog eine individuelle Konfiguration und generiert alles, was man benötigt:

- `readme.md` mit einer individuellen Schritt-für-Schritt-Anleitung für die Installation mit Docker
- `compose.yaml` mit der Definition der benötigen Docker-Services
- `.env` für die Umgebungsvariablen mit den individuellen Einstellungen

Mit der Anleitung und den beiden Konfigurationsdateien kann die Installation leicht über die Linux-Konsole durchgeführt werden.

Der Konfigurator wird über den Web-Browser aufgerufen ist unter folgender Adresse erreichbar: \
[configurator.solectrus.de](https://configurator.solectrus.de/)

## Szenarien der Installation

Es ist möglich (und in den meisten Fällen auch empfehlenswert), alle notwendigen Komponenten auf dem gleichen Gerät zu betreiben. Denkbar ist aber auch eine verteilte Installation, bei der nur einige Kollektoren auf dem eigenen Gerät laufen und alles andere extern in der Cloud. Letzteres ist beispielsweise bei der [Live-Demo](https://demo.solectrus.de) der Fall.

Der Konfigurator ermöglicht **drei** grundsätzlich verschiedene Szenarien:

- **Lokale Installation** (auf einem lokalen Linux-Server wie dem Raspberry Pi oder Synology NAS)
- **Verteilte Installation** (Datensammlung auf einem lokalen Linux-Server, Datenspeicherung und Dashboard auf einem Cloud-Server)
- Mit einem Stromspeicher von SENEC ist eine reine **Cloud-Installation** möglich, bei der lokal gar kein Server notwendig ist, sondern die Messwerte direkt von `mein-senec.de` abgerufen werden.

In den meisten Fällen wird die **lokale Installation** sinnvoll sein. Die anderen beiden Szenarien sind eher für spezielle Anwendungsfälle gedacht.
