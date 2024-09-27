---
title: Konfiguration
layout: page
parent: SENEC-Collector
---

Der SENEC-Collector wird in das Gesamt-Setup von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` müssen erweitert werden. Hier nur die relevanten Teile:

Erforderlich ist eine Schreibberechtigung auf InfluxDB, um dorthin Messwerte schreiben zu können.

## compose.yaml

```yaml
services:
  senec-collector:
    image: ghcr.io/solectrus/senec-collector:latest
    environment:
      - TZ
      - SENEC_ADAPTER
      - SENEC_HOST
      - SENEC_SCHEMA
      - SENEC_INTERVAL
      - SENEC_LANGUAGE
      - SENEC_USERNAME
      - SENEC_PASSWORD
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${SENEC_INFLUX_MEASUREMENT}
    restart: unless-stopped
    logging:
      options:
        max-size: 10m
        max-file: '3'
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
# Welcher Adapter soll verwendet werden?
# Werte: local, cloud (Standard: local)
SENEC_ADAPTER=local

# Die IP-Adresse oder der Hostname Ihres SENEC-Geräts
# Wird nur bei Verwendung des lokalen Adapters genutzt
SENEC_HOST=192.168.178.12

# Das zu verwendende Potokoll
# Werte: http, https (Standard: https)
# Wird nur bei Verwendung des lokalen Adapters genutzt
SENEC_SCHEMA=https

# Die Sprache, die für Status-Texte verwendet werden soll.
# Werte: de, en, it (Standard: de)
# Wird nur bei Verwendung des lokalen Adapters genutzt
SENEC_LANGUAGE=de

# Anmeldedaten für mein-senec.de
# Wird nur bei Verwendung des Cloud-Adapters genutzt
SENEC_USERNAME=me@example.com
SENEC_PASSWORD=my-senec-password

# Die System-ID des SENEC-Geräts
# Wird nur bei Verwendung des Cloud-Adapters genutzt
# Kann leer bleiben, wenn es nur ein System gibt. Der Collector ermittelt
# dann die verfügbaren IDs, listet sie im Protokoll auf und verwendet die erste.
SENEC_SYSTEM_ID=123456

# Das Intervall in Sekunden für die Häufigkeit der Datenabfrage
# Minimum für den lokalen Adapter ist 5 Sekunden.
# Minimum für den Cloud-Adapter ist 30 Sekunden.
SENEC_INTERVAL=5

# Speicherort ("Measurement") für InfluxDB
SENEC_INFLUX_MEASUREMENT=SENEC

# Optional: Deaktivieren bestimmter Messwerte, die nicht an InfluxDB gesendet werden sollen.
# Dies ist nützlich, wenn einzelne Daten (z.B. Wallbox) aus einer anderen Quelle entnommen werden sollen.
# Komma-getrennte Liste von Feldern, keine Leerzeichen. Beispiel:
# SENEC_IGNORE=wallbox_charge_power,grid_power_minus

# Zugangsdaten für InfluxDB
INFLUX_HOST=influxdb.example.com
INFLUX_SCHEMA=https
INFLUX_PORT=443
INFLUX_TOKEN=my-super-secret-write-token
INFLUX_ORG=solectrus

# Der Name des Buckets in InfluxDB
INFLUX_BUCKET=solectrus
```
