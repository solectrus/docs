---
title: Konfiguration
layout: page
parent: Shelly-Collector
---

# Konfigurieren des Shelly-Collectors

Der Shelly-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  shelly-collector:
    image: ghcr.io/solectrus/shelly-collector:latest
    environment:
      - TZ
      - SHELLY_HOST
      - SHELLY_INTERVAL
      - SHELLY_GEN
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${SHELLY_INFLUX_MEASUREMENT}
    logging:
      options:
        max-size: 10m
        max-file: '3'
    restart: unless-stopped
    depends_on:
      influxdb:
        condition: service_healthy
    links:
      - influxdb
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  influxdb:
    # ...

  watchtower:
    # ...
```

## Umgebungsvariablen

### `SHELLY_HOST`

Hostname des Shelly. Dies ist üblicherweise eine IP-Adresse, kann aber auch eine lokale Domain sein. Es darf **kein** `http://` oder `https://` enthalten sein!

### `SHELLY_INTERVAL`

Häufigkeit der Abfrage des aktuellen Messwertes (in Sekunden). Es empfiehlt sich eine Abfrage alle 5 Sekunden, um eine gute Auflösung zu erhalten.

Standardwert: `5`

### `INFLUX_MEASUREMENT`

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

---

### `INFLUX_HOST`

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

### `INFLUX_SCHEMA`

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Standardwert: `http`

### `INFLUX_PORT`

Port für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB könnte eine Anpassung erforderlich sein, z.B. auf `443`.

Standardwert: `8086`

### `INFLUX_TOKEN`

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

### `INFLUX_ORG`

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `INFLUX_BUCKET`

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

## Beispielhafte .env

```properties
SHELLY_HOST=192.168.178.5
SHELLY_INTERVAL=5
SHELLY_INFLUX_MEASUREMENT=heatpump
INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
```
