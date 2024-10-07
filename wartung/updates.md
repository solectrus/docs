---
title: Updates
layout: page
parent: Wartung
nav_order: 1
---

# Installation von Updates

Für die verschiedenen Komponenten von SOLECTRUS erscheinen unabhängig voneinander immer wieder Updates, die neue Funktionen und Verbesserungen enthalten. Es ist sehr empfehlenswert, diese Updates zu installieren, um neue Funktionen, Verbesserungen und Fehlerkorrekturen zu erhalten.

Sämtliche Bestandteile von SOLECTRUS werden in Form von Docker-Images bereitgestellt. In der `compose.yaml` wird festgelegt, welche Versionen der Images verwendet werden. Üblicherweise steht dort die Angabe `latest`, was bedeutet, dass immer die neueste Version der Images angefordert wird.

Dies bedeutet jedoch nicht, dass die neuesten Versionen auch jederzeit installiert werden. Ein Update muss explizit durchgeführt werden, was entweder manuell oder automatisch erfolgen kann.

Eine Automatisierung dieses Vorgangs (mit dem Tool _Watchtower_) ist **sehr empfehlenswert**. Wenn die Installation mit dem [SOLECTRUS-Konfigurator](https://configurator.solectrus.de/) eingerichtet wurde, ist Watchtower bereits installiert.

Wer aber schon länger dabei ist, sollte Watchtower nachrüsten. In den Anfangszeiten von SOLECTRUS wurde Watchtower in der Installationsanleitung zwar erwähnt, aber nicht im Detail beschrieben. Daher haben viele Nutzer vermutlich bis heute Watchtower nicht im Einsatz und führen Updates entweder manuell oder gar nicht durch. Da ist es an der Zeit, das zu ändern.

## Manuelle Installation

Um Updates bei Verfügbarkeit manuell zu installieren, ist wie folgt vorzugehen:

1. SSH-Login auf den Server, also z.B. den Raspberry Pi.

2. Wechsel in das Verzeichnis, in dem die `compose.yaml` sowie die `.env`-Datei von SOLECTRUS liegen.

3. Ausführen folgender zwei Befehle:

   ```
   docker compose pull
   docker compose up -d
   ```

Mit `pull` werden die neuesten Versionen der Docker-Images heruntergeladen, während mit `up -d` die Container neu gestartet werden.

Diese Befehle aktualisieren sämtliche Docker-Container von SOLECTRUS – also das Dashboard, die Kollektoren, aber auch die Datenbanken InfluxDB, PostgreSQL und Redis. Die Aktualisierung erfolgt jeweils im Rahmen der in der `compose.yaml` angegebenen Docker-Tags.

## Automatische Installation

Dieses manuelle Vorgehen ist auf Dauer lästig, das möchte man nicht immer wieder durchführen. Daher empfiehlt sich die Einrichtung eines kleinen Werkzeugs, das den Vorgang automatisiert. Hier kommt _Watchtower_ ins Spiel.

_Watchtower_ prüft einmal täglich, ob es neue Versionen der Docker-Images gibt und installiert diese dann automatisch. Wie in der Docker-Welt üblich, läuft _Watchtower_ selbst als Container.

Im Referenz-Bereich findet sich eine genaue [Beschreibung von Watchtower](/referenz/watchtower/).
