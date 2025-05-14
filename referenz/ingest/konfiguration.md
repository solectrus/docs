---
title: Konfiguration
layout: page
parent: Ingest
nav_order: 2
---

# Konfigurieren von Ingest

InfluxDB wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  influxdb:
    # ...

  ingest:
    image: ghcr.io/solectrus/ingest:latest
    environment:
      - TZ
      - INFLUX_SENSOR_INVERTER_POWER
      - INFLUX_SENSOR_INVERTER_POWER_1
      - INFLUX_SENSOR_INVERTER_POWER_2
      - INFLUX_SENSOR_INVERTER_POWER_3
      - INFLUX_SENSOR_INVERTER_POWER_4
      - INFLUX_SENSOR_INVERTER_POWER_5
      - INFLUX_SENSOR_GRID_IMPORT_POWER
      - INFLUX_SENSOR_GRID_EXPORT_POWER
      - INFLUX_SENSOR_BATTERY_DISCHARGING_POWER
      - INFLUX_SENSOR_BATTERY_CHARGING_POWER
      - INFLUX_SENSOR_WALLBOX_POWER
      - INFLUX_SENSOR_HEATPUMP_POWER
      - INFLUX_SENSOR_HOUSE_POWER
      - INFLUX_EXCLUDE_FROM_HOUSE_POWER
      - INFLUX_SENSOR_HOUSE_POWER_CALCULATED
      - INFLUX_HOST=influxdb
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - STATS_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - ${INGEST_VOLUME_PATH}:/app/data
    ports:
      - 4567:4567
    depends_on:
      influxdb:
        condition: service_healthy
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  watchtower:
    # ...
```

## Umgebungsvariablen

### `TZ`

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### `STATS_PASSWORD`

Passwort für den Zugriff auf die Web-Oberfläche

## Beispielhafte .env

```properties
TZ=Europe/Berlin
STATS_PASSWORD=mysecretpassword
INGEST_VOLUME_PATH=./ingest
```
