---
title: Was ist InfluxDB?
sidebar:
  order: 1
  label: Übersicht
---

SOLECTRUS speichert sämtliche Messwerte in der OpenSource-Zeitreihendatenbank **InfluxDB** ab.

Es kommt die Version **v2** zum Einsatz, die Vorgängerversion **v1** wird nicht unterstützt. Die jüngst veröffentlichte Version **v3** (von Grund auf neu entwickelt und ein ganz anderes Produkt) wird derzeit noch nicht unterstützt.

## Logging

Wie alle Docker-Container schreibt auch InfluxDB ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
ts=2025-12-16T05:20:57.871362Z lvl=info msg="Welcome to InfluxDB" log_id=0~qPWb3W000 version=v2.8.0 commit=40a633239e build_date=2025-12-09T19:13:59Z log_level=info
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
