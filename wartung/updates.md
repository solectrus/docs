---
title: Updates
layout: page
parent: Wartung
nav_order: 1
---

# Installation von Updates

Für SOLECTRUS erscheinen regelmäßig Updates, die neue Funktionen und Verbesserungen enthalten. Es ist sehr empfehlenswert, diese Updates zu installieren, um neue Funktionen, Verbesserungen und Fehlerkorrekturen zu erhalten.

Sämtliche Bestandteile von SOLECTRUS werden in Form von Docker-Images bereitgestellt. In der `compose.yaml` (früher: `docker-compose.yml`) wird festgelegt, welche Versionen der Images verwendet werden. Üblicherweise steht dort die Angabe `latest`, was bedeutet, dass immer die neueste Version der Images angefordert wird.

Dies bedeutet jedoch nicht, dass die neuesten Versionen auch jederzeit installiert werden. Ein Update muss explizit durchgeführt werden, was entweder manuell oder automatisch erfolgen kann.

Eine Automatisierung dieses Vorgangs (mit dem Tool _Watchtower_) ist **sehr empfehlenswert**. Wenn deine Installation mit dem [SOLECTRUS-Konfigurator](https://configurator.solectrus.de/) eingerichtet wurde, hast du _Watchtower_ bereits installiert und kannst aufhören zu lesen. Wer schon länger dabei ist, sollte _Watchtower_ nachrüsten.

## Manuelle Installation

Gehe wie folgt vor, um Updates bei Verfügbarkeit manuell zu installieren:

1. SSH-Login auf deinen Server, z. B. deinen Raspberry Pi.

2. Wechsle in das Verzeichnis, in dem die `compose.yaml` (früher: `docker-compose.yml`) sowie die `.env`-Datei von SOLECTRUS liegen.

3. Führe die folgenden zwei Befehle aus:

   ```bash
   docker compose pull
   docker compose up -d
   ```

Fertig. Was passiert genau? Mit `pull` werden die neuesten Versionen der Docker-Images heruntergeladen, während mit `up -d` die Container neu gestartet werden.

Diese Befehle aktualisieren sämtliche Docker-Container von SOLECTRUS – also das Dashboard, die Kollektoren, aber auch die Datenbanken InfluxDB und Redis.

## Automatische Installation

Updates möchte man nicht manuell immer wieder durchführen. Daher empfiehlt sich die Einrichtung eines kleinen Werkzeugs, das diesen Vorgang automatisiert. Hier kommt [Watchtower](https://containrrr.dev/watchtower/) ins Spiel.

_Watchtower_ prüft einmal täglich, ob es neue Versionen der Docker-Images gibt und installiert diese dann automatisch. Wie in der Docker-Welt üblich, läuft _Watchtower_ selbst als Container.

Die folgenden Schritte sind **einmalig** erforderlich, danach musst du dich mit Updates für SOLECTRUS nicht mehr beschäftigen.

1. SSH-Login auf deinen Server, z. B. deinen Raspberry Pi.

2. Bearbeite die `compose.yaml` (früher: `docker-compose.yml`). Es sind zwei Dinge zu tun:

   **A)** Hinzufügen des _Watchtower_-Containers. Ergänze im Bereich `services` den folgenden Abschnitt:

   ```yaml
   watchtower:
     image: containrrr/watchtower
     environment:
       - TZ
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
     command: --scope solectrus --cleanup
     restart: unless-stopped
     logging:
       options:
         max-size: 10m
         max-file: '3'
     labels:
       - com.centurylinklabs.watchtower.scope=solectrus
   ```

   Damit wird _Watchtower_ so konfiguriert, dass es nur die Container von SOLECTRUS aktualisiert. Die Option `--cleanup` sorgt dafür, dass nicht mehr benötigte Images automatisch gelöscht werden.

   **B)** Hinzufügen eines Labels zu den anderen Services, damit _Watchtower_ genau die Container von SOLECTRUS aktualisiert.

   Ergänze die folgenden zwei Zeilen bei jedem anderen Service in der `compose.yaml`:

   ```yaml
   labels:
     - com.centurylinklabs.watchtower.scope=solectrus
   ```

   Deine `compose.yaml` sollte (in gekürzter Form) in etwa so aussehen:

   ```yaml
   services:
     dashboard:
       image: ghcr.io/solectrus/solectrus:latest
       ...
       labels:
         - com.centurylinklabs.watchtower.scope=solectrus
     influxdb:
       image: influxdb:2.7-alpine
       ...
       labels:
         - com.centurylinklabs.watchtower.scope=solectrus
     postgresql:
       image: postgres:16-alpine
       ...
       labels:
         - com.centurylinklabs.watchtower.scope=solectrus
     redis:
       image: redis:7-alpine
       ...
       labels:
         - com.centurylinklabs.watchtower.scope=solectrus
     senec-collector:
       image: ghcr.io/solectrus/senec-collector:latest
       ...
       labels:
         - com.centurylinklabs.watchtower.scope=solectrus
     watchtower:
       image: containrrr/watchtower
       environment:
         - TZ
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
       command: --scope solectrus --cleanup
       restart: unless-stopped
       logging:
         options:
           max-size: 10m
           max-file: '3'
       labels:
         - com.centurylinklabs.watchtower.scope=solectrus
   ```

3. Führe den folgenden Befehl aus:

Damit _Watchtower_ läuft, muss es einmalig gestartet werden. Führe dazu den folgenden Befehl aus:

```bash
docker compose up -d
```

Fertig. _Watchtower_ wird nun einmal täglich nach Updates suchen und diese automatisch installieren.

## Probleme?

Für den Fall, dass etwas nicht funktioniert, hier ein paar Tipps:

- Bei älteren Versionen von Docker (z. B. auf einem Synology-NAS) muss `docker-compose` statt `docker compose` geschrieben werden, also mit Bindestrich.

- YAML-Dateien (wie die `compose.yaml`) sind **sehr empfindlich** gegenüber falschen Einrückungen. Achte darauf, dass du beim Einkopieren der obigen Passagen keine überzähligen Leerzeichen einfügst oder entfernst. Jede neue Ebene wird mit genau zwei Leerzeichen eingerückt.

- _Watchtower_ läuft einmal täglich, die erste Prüfung erfolgt 24 Stunden nach dem Start. Wenn du _Watchtower_ gerade erst eingerichtet hast, musst du für die erste Update-Prüfung einen Tag warten.
