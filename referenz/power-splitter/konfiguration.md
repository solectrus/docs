---
title: Konfiguration
layout: page
parent: Power-Splitter
---

# Konfiguration über Umgebungsvariablen

SOLECTRUS wird über Umgebungsvariablen konfiguriert. Diese stehen in der Datei `.env` im gleichen Verzeichnis wie die `compose.yml`. Jeder Container hat seine eigenen Variablen, mache Variablen werden von verschiedenen Containern benutzt.

Es ist zu beachten, dass die Umgebungsvariablen nicht nur in der `.env` definiert werden, sondern auch in der `compose.yml` aufgeführt werden (als Auflistung im Abschnitt `environment` des Services `power-splitter`). Andernfalls sind sie für den Collector nicht erreichbar.

Nach einer Bearbeitung von `.env` oder `compose.yml` müssen die Container neu erstellt werden, um die Änderungen zu übernehmen. Dies geschieht mit dem Befehl `docker compose up -d` (bei älteren Docker-Versionen `docker-compose up -d`, also mit Bindestrich).

Es folgt eine Auflistung der für den Power-Splitter definierten Umgebungsvariablen.

## Zugriff auf InfluxDB

- `INFLUX_HOST`

  Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

- `INFLUX_SCHEMA` (standardmäßig `http`)

  Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

- `INFLUX_PORT` (standardmäßig `8086`)

  Port für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB könnte eine Anpassung erforderlich sein, z.B. auf `443`.

- `INFLUX_ORG`

  Organisation in InfluxDB, in der die Daten gespeichert werden sollen.

- `INFLUX_BUCKET`

  Bucket in InfluxDB, in der die Daten gespeichert werden sollen.

- `INFLUX_TOKEN`

  Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **lesen** und zu **schreiben**. Der Einfachheit kann man das `INFLUX_ADMIN_TOKEN` nehmen.

## Sensor-Mapping

Der Power-Splitter benötigt Zugriff auf einige Sensoren, die auch vom Dashboard werden. Im Einzelnen sind dies:

- `INFLUX_SENSOR_GRID_IMPORT_POWER`
- `INFLUX_SENSOR_HOUSE_POWER`
- `INFLUX_SENSOR_WALLBOX_POWER`
- `INFLUX_SENSOR_HEATPUMP_POWER`
- `INFLUX_EXCLUDE_FROM_HOUSE_POWER`

Es genügt also, wenn man diese fünf Variablen in der compoose.yml aufführt und somit den Zugriff ermöglicht. Es ist nicht notwendig und auch nicht sinnvoll, für den Power-Splitter eigene Werte zu definieren.

## Optionales

- `POWER_SPLITTER_INTERVAL` (standardmäßig `3600` = 1 Stunde, Minimum `300` = 5 Minuten)

  Häufigkeit der Berechnung durch den Power-Splitter. Bei kleineren Werten wird der Power-Splitter häufiger ausgeführt, was nicht zu einer genaueren Berechnung führt, aber zu einer erhöhten Aktualität. Bemerken wird man den Unterschied nur in der Anzeige des aktuellen Tages im Dashboard. Beim Standardwert von `3600` ist der dargestellte Wert um bis zu einer Stunde veraltet.

  Ein niedriger Wert führt zu einer etwas höheren Auslastung des Systems, die Standardvorgabe ist daher konservativ gewählt.
