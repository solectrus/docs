---
title: Grundlagen zu Docker
sidebar:
  order: 2
  label: Docker-Grundlagen
---

SOLECTRUS nutzt [Docker](https://www.docker.com/) als Basis für alle seine Komponenten, die jeweils in separaten Docker-Containern laufen. Ein grundlegendes Verständnis von Docker ist daher hilfreich. Dieses Kapitel bietet eine sehr grobe Einführung in Docker und erklärt einige der wichtigsten Befehle und Konzepte.

## Was ist überhaupt Docker?

Docker ist eine Plattform, die es ermöglicht, Anwendungen in sogenannten Containern zu betreiben. Ein Container ist eine leichtgewichtige, isolierte Umgebung, die alles Nötige für den Betrieb einer Anwendung enthält. Anders als virtuelle Maschinen nutzen Container den gleichen Betriebssystemkern, laufen aber trotzdem voneinander isoliert auf dem gleichen System.

Docker ist ein leistungsstarkes Werkzeug, das jedoch zu Beginn etwas komplex wirken kann. Einige User von SOLECTRUS haben anfangs Schwierigkeiten, die Funktionsweise von Docker zu verstehen. Dieses Dokument soll bei der Lösung häufiger Probleme helfen.

## Und was ist Docker Compose?

[Docker Compose](https://docs.docker.com/compose/) ist ein Tool, mit dem mehrere Docker-Container gemeinsam verwaltet werden können. In einer Datei werden die Definitionen der Container (sogenannte “Services”) festgelegt, die dann mit einem einzigen Befehl **parallel** gestartet (und auch wieder beendet) werden können.

Je nach Version wird entweder `docker-compose` (mit Bindestrich) oder `docker compose` (ohne Bindestrich) verwendet. In diesem Dokument wird `docker compose` verwendet, da dies die aktuelle Schreibweise ist. Wenn eine ältere Version verwendet wird (z.B. auf einer Synology NAS), ist `docker compose` durch `docker-compose` zu ersetzen.

Die Containerdefinitionen werden in einer Datei namens `compose.yaml` (früher: `docker-compose.yml`) gespeichert. Neuere Docker-Versionen bevorzugen `compose.yaml`, beide Varianten sind jedoch weiterhin gültig. In diesem Dokument wird durchgehend `compose.yaml` verwendet.

Die Compose-Datei ist im YAML-Format geschrieben, das einfach zu lesen und zu schreiben ist, aber sehr empfindlich auf falsche Einrückungen reagiert. Ein überzähliges oder fehlendes Leerzeichen kann dazu führen, dass die Datei nicht verarbeitet wird. Daher ist es wichtig, die Einrückungen (immer genau zwei Leerzeichen, keine Tabs) genau einzuhalten.

## Was ist eine `.env`-Datei?

SOLECTRUS wird über Umgebungsvariablen konfiguriert, die in einer `.env`-Datei im gleichen Verzeichnis wie die `compose.yaml` gespeichert sind. Der Punkt am Anfang des Dateinamens ist wichtig!

Jeder Service kann eigene Umgebungsvariablen haben, wobei einige Variablen von mehreren Services verwendet werden. Wichtig ist, dass die Umgebungsvariablen sowohl in der `.env`-Datei **definiert** als auch in der `compose.yaml` im Abschnitt `environment` für den jeweiligen Service **aufgeführt** sind. Andernfalls sind die Variablen für den Service nicht verfügbar. Das ist ein häufiger Grund für Probleme.

Nach einer Änderungen an `.env` oder `compose.yaml` müssen die Container neu erstellt werden, damit die Änderungen wirksam werden. Dies geschieht mit:

```
docker compose up -d
```

Docker erkennt hierbei automatisch, welche Container betroffen sind und startet nur diese neu.

## Protokoll der Docker-Container

Jeder Docker-Container erstellt ein Protokoll (Log) über seine Aktivitäten, das bei der Fehlersuche äußerst hilfreich ist. Wenn es Schwierigkeiten mit SOLECTRUS gibt, hilft ein ein Blick in die Logs meist weiter.

Um in einem Forum nach Unterstützung zu suchen, ist es empfehlenswert, dabei die relevanten Ausschnitte aus den Logs zu teilen. Das erleichtert es anderen, das Problem zu verstehen und eine Lösung zu finden.

Mit folgendem Befehl lassen sich alle Logs der Container anzeigen (auszuführen im Verzeichnis mit der `compose.yaml`):

```
docker compose logs
```

Da dies schnell unübersichtlich werden kann, lässt sich die Ausgabe auch auf einen bestimmten Container beschränken:

```
docker compose logs <SERVICE>
```

Beispiele:

```
docker compose logs dashboard
docker compose logs senec-collector
docker compose logs mqtt-collector
```

Um die Ausgabe weiter einzugrenzen, lassen sich weitere nützliche Argumente verwenden:

```
--tail <n>: Zeigt die letzten n Zeilen an, z.B. die letzten 50
--since <Zeitraum>: Zeigt Logs seit einem bestimmten Zeitraum an, z.B. den letzten 2 Stunden
--follow: Verfolgt die Logs live, bis mit Strg+C abgebrochen wird
```

Beispiele:

```
docker compose logs senec-collector --tail 50
docker compose logs mqtt-collector --since 2h
docker compose logs dashboard --follow
```

Weitere Details finden sich in der [offiziellen Dokumentation](https://docs.docker.com/reference/cli/docker/compose/logs/).

Da beim Start eines Containers oft wichtige Informationen in den Logs erscheinen, die dann aber schnell nach hinten rutschen, kann es sinnvoll sein, den Container vor der Prüfung der Logs neu zu starten.

## Container neu starten

Die einfachste Möglichkeit, den Neustart der Container zu erzwingen, ist:

```
docker compose down
docker compose up -d
```

Sämtliche Container, die in der `compose.yaml` definiert sind, werden dabei zuerst gestoppt und dann neu gestartet.

## Container aktualisieren

Bei etwaigen Problemen ist es oft sinnvoll, zunächst sicherzustellen, dass man überhaupt die neuesten Versionen im Einsatz hat. Dies lässt sich leicht bewerkstelligen:

```
docker compose pull
docker compose up -d
```

Dieser Befehl lädt neue Container-Images herunter (sofern verfügbar) und startet die Container neu. Docker prüft anhand des unter `image:` in der `compose.yaml` angegebenen Tags, ob ein neueres Image vorhanden ist. Tags wie `latest` bedeuten, dass immer die neueste Version verwendet werden soll. Man kann auch explizit eine Versionsnummer angeben, z.B. `v1.2.3`, dann wird immer genau diese Version verwendet.

Es ist zu beachten, dass Änderungen an der `compose.yaml` oder `.env` **nicht** automatisch zu einem Update führen. Es ist **immer** explizit der Befehl `docker compose up -d` ausführen.

Updates können übrigens auch automatisiert werden. Mehr dazu im [Referenzkapital zu Watchtower](/referenz/watchtower/).

## Speicherplatz freigeben

Nach mehreren Updates sammeln sich alte, nicht mehr verwendete Docker-Images an, die unnötig Speicherplatz belegen. Um den aktuellen Speicherverbrauch von Docker zu prüfen, dient folgender Befehl:

```
docker system df
```

Dieser zeigt eine Übersicht über den Speicherverbrauch von Images, Containern, Volumes und dem Build-Cache. Mit der Option `-v` wird eine detaillierte Auflistung ausgegeben.

Ungenutzte Images lassen sich mit folgendem Befehl entfernen:

```
docker image prune -a
```

Die Option `-a` entfernt alle Images, die nicht von einem laufenden Container verwendet werden.

:::caution
Dieser Befehl sollte bei laufenden Containern ausgeführt werden. Nach einem `docker compose down` sind keine Container aktiv, sodass `docker image prune -a` dann sämtliche Images löscht. Diese werden beim nächsten `docker compose up -d` zwar automatisch neu heruntergeladen, was aber Zeit und Bandbreite kostet.
:::

:::note
[Watchtower](/referenz/watchtower/) löscht nach jedem automatischen Update nur das jeweils ersetzte Image. Bei manuellen Updates per `docker compose pull` muss hingegen selbst aufgeräumt werden.
:::

Wer noch gründlicher aufräumen möchte, kann zusätzlich ungenutzte Netzwerke und andere Reste entfernen:

```
docker system prune -a
```
