---
title: Was ist Redis?
sidebar:
  order: 1
  label: Übersicht
---

SOLECTRUS legt seinen Cache in der In-Memory-Datenbank **Redis** ab. SOLECTRUS nutzt den Cache insbesondere, um InfluxDB zu entlasten und die Performance zu verbessern. Jede Abfrage an InfluxDB wird eine gewisse Zeit im Cache gespeichert.

Wenn Redis beendet wird (z.B. im Rahmen eines Reboots), geht der Cache nicht verloren (wie man bei einer In-Memory-Datenbank vermuten könnte), sondern Redis speichert sie beim Herunterfahren in der Datei `dump.rdb` ab. Beim nächsten Start wird die Datei dann wieder eingelesen.

Unterstützt wird Redis in Version 5 oder höher, wobei die aktuelle Version **8** empfohlen wird.

## Cache löschen

Der Cache kann bei Bedarf gelöscht werden:

```bash
docker compose exec redis redis-cli FLUSHALL
```

Im Erfolgsfall gibt Redis `OK` zurück. Bei der nachfolgenden Verwendung von SOLECTRUS wird der Cache dann sukzessive wieder aufgebaut.

## Logging

Wie alle Docker-Container schreibt auch Redis ein Protokoll ins Docker-Log, das in etwa so aussieht:

```log
...
Starting Redis Server
1:C 21 Nov 2025 04:58:46.220 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 21 Nov 2025 04:58:46.220 * Redis version=8.4.0, bits=64, commit=00000000, modified=1, pid=1, just started
1:C 21 Nov 2025 04:58:46.220 * Configuration loaded
...
1:M 21 Nov 2025 04:58:46.272 * Ready to accept connections tcp
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs redis
```

Dass es hier Probleme geben könnte, ist sehr unwahrscheinlich. Dennoch sollte im Zweifelsfall das Protokoll geprüft werden.

## Offizielles Docker-Image

Das offizielle Docker-Image von Redis ist auf Docker Hub verfügbar: \
[https://hub.docker.com/\_/redis](https://hub.docker.com/_/redis)
