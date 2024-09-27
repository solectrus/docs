---
title: FAQ
layout: page
parent: Support
---

# Was ist Docker?

SOLECTRUS basiert auf [Docker](https://www.docker.com/). Docker ist eine Software, die es ermöglicht, Anwendungen in Containern zu betreiben. Ein Container ist eine leichtgewichtige, isolierte Umgebung, die alle notwendigen Abhängigkeiten enthält, um eine Anwendung auszuführen. Im Gegensatz zu virtuellen Maschinen teilen Container den gleichen Betriebssystemkern, laufen jedoch isoliert voneinander auf dem gleichen System.

Docker ist ein phantastisches Werkzeug, um Anwendungen zu betreiben. Es ist jedoch auch recht komplex. Bei der Installation von SOLECTRUS kommen viele User erstmalig mit Docker in Berührung und haben Schwierigkeiten, die Funktionsweise zu verstehen. Dieses Dokument soll bei der Lösung häufiger Probleme helfen.

# Was ist Docker Compose?

[Docker Compose](https://docs.docker.com/compose/) ist ein Tool, das es ermöglicht, mehrere Docker-Container gleichzeitig zu starten. Es wird eine Datei mit den Definitionen der Container, (sog. "Services"), erstellt, die dann mit einem einzigen Befehl gestartet werden können.

Je nach Version wird `docker-compose` (mit Bindestrich) oder `docker compose` (ohne Bindestrich) verwendet. In diesem Dokument wird `docker compose` verwendet, da dies die aktuelle Schreibweise ist. Falls du eine ältere Version von Docker Compose verwendest (z.B. weil du eine Synology NAS verwendest), ersetze `docker compose` durch `docker-compose`.

Die Datei mit den Definitionen der Container kann entweder `docker-compose.yml` oder `compose.yml` heißen (oder jeweils mit `.yaml`). Neuere Versionen von Docker Compose verwenden den Namen [`compose.yaml`](https://docs.docker.com/compose/compose-application-model/#the-compose-file), die alten Bezeichnungen werden aber weiterhin unterstützt. In diesem Dokument wird `compose.yaml` verwendet. Entscheide dich für eine Schreibweise und bleibe dabei.

# Was ist eine .env-Datei?

SOLECTRUS wird über Umgebungsvariablen konfiguriert. Diese stehen in der Datei `.env` im gleichen Verzeichnis wie die `compose.yaml`. Beachte den Punkt am Anfang des Dateinamens!

Jeder Service hat seine eigenen Variablen, Variablen können auch von verschiedenen Services benutzt werden. Es ist zu beachten, dass die Umgebungsvariablen nicht nur in der `.env` definiert werden, sondern auch in der `compose.yaml` aufgeführt werden (als Auflistung im Abschnitt `environment` des jeweiligen Services). Andernfalls sind sie für den Service nicht erreichbar.

Nach einer Bearbeitung von `.env` oder `compose.yaml` müssen die Container neu erstellt werden, um die Änderungen zu übernehmen. Dies geschieht mit dem Befehl `docker compose up -d` .

# Protokoll der Docker-Container

Jeder Docker-Container führt ein Protokoll (Log) über seine Aktivitäten. Dieses Protokoll ist **äußerst** hilfreich, um Fehler zu finden und zu beheben. Wer SOLECTRUS betreibt, sollte zumindest bei Problemen immer einen Blick in die Logs werfen.

Wer in einem Issue oder Diskussionsforum um Hilfe bittet, sollte immer die Logs der betroffenen Container bereitstellen, möglichst reduziert auf die relevanten Zeilen. Das erleichtert es anderen, das Problem zu verstehen und zu lösen.

Mit folgendem einfachen Befehl lassen sich sämtliche Logs der Container anzeigen - auszuführen im Verzeichnis, in dem die `compose.yaml` liegt:

```bash
docker compose logs
```

Der Output kann allerdings unübersichtlich sein, da die Logs aller Container in einem Stream zusammengefasst werden. Um die Logs eines bestimmten Containers zu sehen, kann der Service-Name als Argument übergeben werden und so der Output gefiltert werden:

```bash
docker compose logs <SERVICE>
```

Ein paar Beispiele:

```bash
docker compose logs dashboard
docker compose logs senec-collector
docker compose logs mqtt-collector
...
```

Der Output kann aber immer noch sehr umfangreich sein. Es kann sinnvoll sein, die Ausgabe zu begrenzen.

Mit dem `--tail`-Argument lassen sich die letzten `n` Zeilen anzeigen, z.B. die letzten 50 Zeilen:

```bash
docker compose logs <SERVICE> --tail 50
```

Mit dem `--since`-Argument lassen sich die Logs auf einen Zeitraum begrenzen, z.B. die letzten 2 Stunden:

```bash
docker compose logs <SERVICE> --since 2h
```

Außerdem kann mit dem `--follow`-Argument die Ausgabe live verfolgt werden, d.h. die Logs werden kontinuierlich aktualisiert, bis man mit <kbd>Strg+C</kbd> abbricht:

```bash
docker compose logs <SERVICE> --follow
```

Genaueres zu `docker compose logs` findet sich in der [offiziellen Dokumentation](https://docs.docker.com/reference/cli/docker/compose/logs/).

Bei SOLECTRUS ist es so, dass beim Start von Container besondere Informationen in den Logs ausgegeben werden. Es kann also sinnvoll sein, die Container neu zu starten, bevor die Logs geprüft werden.

# Neustart der Container

Ein Neustart der Container gelingt am einfachsten mit folgendem Befehl:

```bash
docker compose down
docker compose up -d
```

Etwaige Änderungen in der `compose.yaml` werden dabei berücksichtigt.

# Update der Container

Es ist sinnvoll, bei Problemen zunächst sicherzustellen, dass die Container auf dem neuesten Stand sind, also die aktuell verfügbare Version verwendet wird. Das geht mit folgendem Befehl:

```bash
docker compose pull
docker compose up -d
```

Damit werden die neuesten Images der Container heruntergeladen (sofern vorhanden) und die Container neu gestartet (falls erforderlich). Basis ist dabei die Angabe unter `image:` in der `compose.yaml`. Docker prüft also, ob es ein neues Image zum angegebenen "Tag" gibt und lädt es herunter. Ein Tag ist eine Art Versionsnummer, die in der `compose.yaml` angegeben wird. Oft lautet sie `latest`, was bedeutet, dass immer die neueste Version verwendet werden soll.

Übrigens führt eine manuelle Änderung in der compose-Datei (oder `.env`) nicht automatisch zu einem Update der Container. Dazu muss explizit der Befehl `docker compose up -d` ausgeführt werden.

Die Installation von Updates kann übrigens auch [automatisiert](Updates-installieren) werden.
