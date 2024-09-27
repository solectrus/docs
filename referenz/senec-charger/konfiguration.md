---
title: Konfiguration
layout: page
parent: SENEC-Charger
---

Der SENEC-Charger wird in das Gesamt-Setup von Solectrus integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` müssen erweitert werden. Hier nur die relevanten Teile:

## compose.yaml

```yaml
services:
  senec-charger:
    image: ghcr.io/solectrus/senec-charger:latest
    depends_on:
      influxdb:
        condition: service_healthy
    links:
      - influxdb
    environment:
      - TZ
      - SENEC_HOST
      - SENEC_SCHEMA
      - CHARGER_INTERVAL
      - CHARGER_PRICE_MAX
      - CHARGER_PRICE_TIME_RANGE
      - CHARGER_FORECAST_THRESHOLD
      - CHARGER_DRY_RUN
      - INFLUX_HOST=influxdb
      - INFLUX_TOKEN=${INFLUX_TOKEN_READ}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT_PRICES
      - INFLUX_MEASUREMENT_FORECAST
    restart: unless-stopped

  influxdb:
    # ...

  tibber-collector:
    # ...

  forecast-collector:
    # ...
```

## .env

```properties
# Verbindung zum SENEC.Home V3 oder V2.1
SENEC_HOST=192.168.1.1
SENEC_SCHEMA=https

# Intervall in Sekunden für die Überprüfung des Ladevorgangs
CHARGER_INTERVAL=3600

# Maximaler Durchschnittspreis pro kWh im Vergleich zum Durchschnittspreis in der nahen Zukunft (bis zu 24 Stunden)
CHARGER_PRICE_MAX=70

# Wie lange braucht der Akku für eine volle Ladung?
CHARGER_PRICE_TIME_RANGE=4

# Ab welchem erwarteten PV-Ertrag (in kWh) in den nächsten 24 Stunden sollte das Laden NICHT aus dem Netz erfolgen?
CHARGER_FORECAST_THRESHOLD=20

# Trockenlauf-Modus: Der Ladevorgang wird nicht gestartet (Standard: false)
# CHARGER_DRY_RUN=true

# Zugangsdaten für InfluxDB
INFLUX_HOST=influxdb.example.com
INFLUX_SCHEMA=https
INFLUX_PORT=443
INFLUX_ADMIN_TOKEN=my-super-secret-admin-token
INFLUX_TOKEN_WRITE=${INFLUX_ADMIN_TOKEN}
INFLUX_TOKEN_READ=${INFLUX_ADMIN_TOKEN}
INFLUX_ORG=my-org
INFLUX_PASSWORD=my-password
INFLUX_USERNAME=my-user

# InfluxDB bucket und measurements
INFLUX_BUCKET=solectrus
INFLUX_MEASUREMENT_PRICES=my-prices
INFLUX_MEASUREMENT_FORECAST=my-forecast

# Zeitzone
TZ=Europe/Berlin
```
