---
title: Redis
layout: page
parent: Referenz
nav_order: 12
---

SOLECTRUS speichert Cache-Daten in der OpenSource-Datenbank **Redis** ab. Unterstützt wird die Version 5 oder höher, wobei die aktuelle Version **7** empfohlen wird.

Redis hält sämtliche Daten im Arbeitsspeicher, wodurch es sehr schnell ist. Es ist daher ideal für das Caching geeignet.

SOLECTRUS nutzt Redis insbesondere, um InfluxDB zu entlasten. Jede Abfrage an InfluxDB wird eine gewisse Zeit (oder dauerhaft) im Cache gespeichert.

Wenn Redis beendet wird, gehen die Daten nicht verloren, sondern Redis speichert sie in einer Datei ab. Beim nächsten Start werden die Daten wieder eingelesen. Das ist der einzige Grund, warum Redis ein Volume für die Dateiablage benötigt.

Der Cache kann bei Bedarf auch gelöscht werden:

```shell
docker compose exec redis redis-cli FLUSHALL
```

Offizielles Docker-Image: \
[https://hub.docker.com/\_/redis](https://hub.docker.com/_/redis)
