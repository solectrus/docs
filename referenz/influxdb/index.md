---
title: InfluxDB
layout: page
parent: Referenz
nav_order: 10
---

# InfluxDB v2

SOLECTRUS speichert sämtliche Messwerte in der OpenSource-Zeitreihendatenbank **InfluxDB** ab. Es kommt die aktuelle Version **2.7** zum Einsatz, die Vorgängerversion v1 wird **nicht** unterstützt.

## Protokollierung

Wie alle Docker-Container schreibt auch InfluxDB ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
{
  "bolt-path": "/var/lib/influxdb2/influxd.bolt",
  "engine-path": "/var/lib/influxdb2/engine",
  "nats-port": 4222,
  "http-bind-address": ":9999"
}
2024-10-05T15:47:32.	info	booting influxd server in the background	{"system": "docker"}
ts=2024-10-05T15:47:32.396061Z lvl=info msg="Welcome to InfluxDB" log_id=0s3Lf~fl000 version=v2.7.10 commit=f302d9730c build_date=2024-08-16T20:19:39Z log_level=info
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs influxdb
```

Dass es hier Probleme gibt, ist sehr unwahrscheinlich. Dennoch sollte im Zweifelsfall das Protokoll geprüft werden.

## Offizielles Docker-Image

Das offizielle Docker-Image von InfluxDB ist auf Docker Hub verfügbar: \
[https://hub.docker.com/\_/influxdb](https://hub.docker.com/_/influxdb)
