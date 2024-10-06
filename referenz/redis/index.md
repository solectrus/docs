---
title: Redis
layout: page
parent: Referenz
nav_order: 12
---

# Redis

SOLECTRUS speichert seinen Cache in der OpenSource-InMemory-Datenbank **Redis** ab. Unterstützt wird die Version 5 oder höher, wobei die aktuelle Version **7** empfohlen wird.

SOLECTRUS nutzt Redis insbesondere, um InfluxDB zu entlasten. Jede Abfrage an InfluxDB wird eine gewisse Zeit (oder dauerhaft) im Cache gespeichert.

Wenn Redis beendet wird, geht der Cache nicht verloren (wie man bei einer InMemory-Datenbank vermuten könnte), sondern Redis speichert sie in einer Datei ab. Beim nächsten Start wird der Cache wieder eingelesen. Das ist der Grund, warum Redis überhaupt ein Volume für die Dateiablage benötigt.

## Protokollierung

Wie alle Docker-Container schreibt auch Redis ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
...
1:C 17 Sep 2024 10:14:13.038 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 17 Sep 2024 10:14:13.038 * Redis version=7.4.0, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 17 Sep 2024 10:14:13.038 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
1:M 17 Sep 2024 10:14:13.039 * monotonic clock: POSIX clock_gettime
1:M 17 Sep 2024 10:14:13.043 * Running mode=standalone, port=6379.
1:M 17 Sep 2024 10:14:13.047 * Server initialized
1:M 17 Sep 2024 10:14:13.047 * Ready to accept connections tcp
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs redis
```

Dass es hier Probleme gibt, ist sehr unwahrscheinlich. Dennoch sollte im Zweifelsfall das Protokoll geprüft werden.

## Löschung des Caches

Der Cache kann bei Bedarf gelöscht werden:

```bash
docker compose exec redis redis-cli FLUSHALL
```

Im Erfolgsfall gibt Redis `OK` zurück.

## Offizielles Docker-Image

Das offizielle Docker-Image von Redis ist auf Docker Hub verfügbar: \
[https://hub.docker.com/\_/redis](https://hub.docker.com/_/redis)
