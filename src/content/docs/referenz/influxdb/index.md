---
title: Was ist InfluxDB?
sidebar:
  order: 1
  label: Übersicht
---

SOLECTRUS speichert sämtliche Messwerte in der OpenSource-Zeitreihendatenbank **InfluxDB** ab.

Es kommt die Version **2.7** zum Einsatz, die Vorgängerversion **v1** wird nicht unterstützt. Die jüngst veröffentlichte Version **v3** (von Grund auf neu entwickelt und ein ganz anderes Produkt) wird derzeit noch nicht unterstützt.

## Logging

Wie alle Docker-Container schreibt auch InfluxDB ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
ts=2025-11-22T13:04:56.228867Z lvl=info msg="Welcome to InfluxDB" log_id=0~MvXDe0000 version=v2.7.12 commit=ec9dcde5d6 build_date=2025-05-20T22:48:49Z log_level=info
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs influxdb
```

Dass es hier Probleme gibt, ist eher unwahrscheinlich. Dennoch sollte im Zweifelsfall das Protokoll geprüft werden.

## Datensicherung

Für die [Sicherung und -wiederherstellung von SOLECTRUS](/wartung/datensicherung) stehen einfach zu bedienende Scripte bereit, die auch InfluxDB berücksichtigen.

## Docker-Image

Das offizielle Docker-Image von InfluxDB ist auf Docker Hub verfügbar: \
[https://hub.docker.com/\_/influxdb](https://hub.docker.com/_/influxdb)
