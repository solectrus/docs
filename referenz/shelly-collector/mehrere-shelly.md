---
title: Mehrere Shelly
layout: page
parent: Shelly-Collector
---

# Nutzung für mehrere Shelly

Hat man mehrere Shelly-Geräte im Einsatz und möchte deren Messwerte einsammeln, so ist für jedes Gerät ein **eigener** Collector einzurichten, es laufen dann also mehrere Container des Shelly-Collectors parallel.

Dies lässt sich wie folgt einrichten, hier ein Beispiel für folgendes Szenario:

- Wärmepumpe, überwacht mit einem Shelly der 2. Generation
- Kühlschrank, überwacht mit einem Shelly der 1. Generation

## compose.yaml

```yaml
services:
  shelly-collector-heatpump:
    image: ghcr.io/solectrus/shelly-collector:latest
    environment:
      - TZ
      - SHELLY_HOST=${SHELLY_HOST_HEATPUMP}
      - SHELLY_INTERVAL
      - SHELLY_GEN=${SHELLY_GEN_HEATPUMP}
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${SHELLY_INFLUX_MEASUREMENT_HEATPUMP}
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

  shelly-collector-fridge:
    image: ghcr.io/solectrus/shelly-collector:latest
    environment:
      - TZ
      - SHELLY_HOST=${SHELLY_HOST_FRIDGE}
      - SHELLY_INTERVAL
      - SHELLY_GEN=${SHELLY_GEN_FRIDGE}
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${SHELLY_INFLUX_MEASUREMENT_FRIDGE}
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

## .env

```properties
SHELLY_HOST_HEATPUMP=192.168.178.5
SHELLY_HOST_FRIDGE=192.168.178.6
SHELLY_INTERVAL=5
SHELLY_GEN_HEATPUMP=2
SHELLY_GEN_FRIDGE=1
SHELLY_INFLUX_MEASUREMENT_HEATPUMP=heatpump
SHELLY_INFLUX_MEASUREMENT_FRIDGE=fridge
INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
```
