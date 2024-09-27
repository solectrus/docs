---
title: Konfiguration
layout: page
parent: InfluxDB
---

## compose.yaml

```yaml
services:
  influxdb:
    image: influxdb:2.7-alpine
    volumes:
      - ${INFLUX_VOLUME_PATH}:/var/lib/influxdb2
    environment:
      - TZ
      - DOCKER_INFLUXDB_INIT_MODE=setup
      - DOCKER_INFLUXDB_INIT_USERNAME=${INFLUX_USERNAME}
      - DOCKER_INFLUXDB_INIT_PASSWORD=${INFLUX_PASSWORD}
      - DOCKER_INFLUXDB_INIT_ORG=${INFLUX_ORG}
      - DOCKER_INFLUXDB_INIT_BUCKET=${INFLUX_BUCKET}
      - DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=${INFLUX_ADMIN_TOKEN}
    command: influxd run --bolt-path /var/lib/influxdb2/influxd.bolt --engine-path /var/lib/influxdb2/engine --store disk
    restart: unless-stopped
    healthcheck:
      test:
        - CMD
        - influx
        - ping
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    logging:
      options:
        max-size: 10m
        max-file: '3'
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  watchtower:
    # ...
```

## .env

```properties
# Zeitzone
TZ=Europe/Berlin

# Benutzername und Passwort für den Admin-Zugang
# Darf nach dem ersten Start nicht mehr geändert werden!
INFLUX_USERNAME=admin
INFLUX_PASSWORD=ExAmPl3PA55W0rD

# Organisation und Bucket
# Darf nach dem ersten Start nicht mehr geändert werden!
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus

# Token für den Admin-Zugang
# Darf nach dem ersten Start nicht mehr geändert werden!
INFLUX_ADMIN_TOKEN=my-super-secret-admin-token

# Volume für die Dateiablage
INFLUX_VOLUME_PATH=./influxdb
```
