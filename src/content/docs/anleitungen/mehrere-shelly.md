---
title: Zusätzliche Shelly-Verbrauchszähler integrieren
sidebar:
  hidden: true
---

Hat man mehrere Shelly-Geräte im Einsatz und möchte deren Messwerte einsammeln, so ist für jedes Gerät ein **eigener** Collector einzurichten, es laufen dann also mehrere Container des [Shelly-Collectors](/referenz/shelly-collector/) parallel.

Außerdem müssen dem Dashboard über benutzerdefinierte Sensoren die neuen Orte in der InfluxDB entsprechend bekannt gemacht werden, damit die Messwerte auch gefunden und dargestellt werden können.

Dies lässt sich wie folgt einrichten, hier ein Beispiel für folgendes Szenario:

- Wärmepumpe, überwacht mit einem Shelly der 2. Generation
- Kühlschrank, überwacht mit einem Shelly der 1. Generation

:::note
Zur Darstellung benutzerdefinierte Verbraucher ist ein [Sponsoring-Abo](https://solectrus.de/sponsoring/) erforderlich.
:::

## compose.yaml (Auszug)

```yaml
services:
  dashboard:
    # ...
    environment:
      - INFLUX_SENSOR_CUSTOM_POWER_01
      - INFLUX_SENSOR_CUSTOM_POWER_02
    # ...

  shelly-collector-heatpump:
    image: ghcr.io/solectrus/shelly-collector:latest
    environment:
      - TZ
      - SHELLY_HOST=${SHELLY_HOST_HEATPUMP}
      - SHELLY_PASSWORD
      - SHELLY_INTERVAL
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${INFLUX_MEASUREMENT_SHELLY_HEATPUMP}
    logging:
      driver: json-file
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
      - SHELLY_PASSWORD
      - SHELLY_INTERVAL
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${INFLUX_MEASUREMENT_SHELLY_FRIDGE}
    logging:
      driver: json-file
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

## .env (Auszug)

```properties
# Zugriff auf die Shelly-Geräte
SHELLY_HOST_HEATPUMP=192.168.178.5
SHELLY_HOST_FRIDGE=192.168.178.6

# Bezeichnungen der Measurements in InfluxDB
INFLUX_MEASUREMENT_SHELLY_HEATPUMP=heatpump
INFLUX_MEASUREMENT_SHELLY_FRIDGE=fridge

# Definition der Sensoren für das Dashboard
INFLUX_SENSOR_CUSTOM_POWER_01=heatpump:power
INFLUX_SENSOR_CUSTOM_POWER_02=fridge:power
```
