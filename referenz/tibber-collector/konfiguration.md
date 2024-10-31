---
title: Konfiguration
layout: page
parent: Tibber-Collector
---

# Konfigurieren des Tibber-Collectors

Der Tibber-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  tibber-collector:
    image: ghcr.io/solectrus/tibber-collector:latest
    environment:
      - TZ
      - TIBBER_TOKEN
      - TIBBER_INTERVAL
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${INFLUX_MEASUREMENT_PRICES}
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

{:.note}

Die beiden Variablen `INFLUX_TOKEN` und `INFLUX_MEASUREMENT` werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Container und vermeidet Redundanzen.

## Umgebungsvariablen

### `TIBBER_TOKEN`

"Access Token" von Tibber. Dieses kann unter https://developer.tibber.com/settings/access-token erstellt werden. Es ist dazu ein aktiver Vertrag und ein Account bei Tibber erforderlich.

### `TIBBER_INTERVAL`

Intervall, in dem die Preise von Tibber abgefragt werden sollen, in Sekunden. Der Standardwert ist `3600`, d.h. einmal pro Stunde. Es ist nicht empfehlenswert, dieses Intervall zu verkürzen, da Tibber die Preise nur einmal täglich aktualisiert.

### `INFLUX_HOST`

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

### `INFLUX_SCHEMA`

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Standardwert: `http`

### `INFLUX_PORT`

Port für die Verbindung zu InfluxDB.

Optional, Standard ist `8086`

Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

### `INFLUX_TOKEN`

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

### `INFLUX_ORG`

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `INFLUX_BUCKET`

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `INFLUX_MEASUREMENT`

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

## Beispielhafte .env

```properties
TZ=Europe/Berlin

TIBBER_TOKEN=my-personal-tibber-token
TIBBER_INTERVAL=3600

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
INFLUX_MEASUREMENT_PRICES=my-prices
```
