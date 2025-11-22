---
title: Konfiguration von InfluxDB
sidebar:
  order: 2
  label: Konfiguration
---

InfluxDB wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

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
      - DOCKER_INFLUXDB_INIT_ORG=${INFLUX_ORG}
      - DOCKER_INFLUXDB_INIT_USERNAME=${INFLUX_USERNAME}
      - DOCKER_INFLUXDB_INIT_PASSWORD=${INFLUX_PASSWORD}
      - DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=${INFLUX_ADMIN_TOKEN}
      - DOCKER_INFLUXDB_INIT_BUCKET=${INFLUX_BUCKET}
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

:::note
Einige Variablen (wie z.B. `DOCKER_INFLUXDB_INIT_USERNAME`) werden anders lautenden Umgebungsvariablen entnommen (wie z.B. `INFLUX_USERNAME`). Dies ermöglicht eine Nutzung von Variablen für verschiedene Container und vermeidet Redundanzen.
:::

## Umgebungsvariablen

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

#### DOCKER_INFLUXDB_INIT_ORG

Organisation, mit der die Benutzer und Daten in InfluxDB gruppiert werden. Für die Nutzung von SOLECTRUS ist die Organisation sinnvollerweise `solectrus` zu nennen, weitere Organisationen werden nicht benötigt.

#### DOCKER_INFLUXDB_INIT_USERNAME

Gewünschter Benutzername für den Administrator-Zugriff (per Login) auf InfluxDB.
Der Administrator wird beim ersten Start von InfluxDB angelegt.

#### DOCKER_INFLUXDB_INIT_PASSWORD

Gewünschtes Passwort für den Administrator-Zugriff (per Login) auf InfluxDB.
Der Administrator wird beim ersten Start von InfluxDB angelegt.

#### DOCKER_INFLUXDB_INIT_ADMIN_TOKEN

Token für den Administrator-Zugriff auf InfluxDB, das für die Authentifizierung (per API) verwendet wird und Zugriff auf alles gewährt.
Das Token wird beim ersten Start von InfluxDB angelegt.

#### DOCKER_INFLUXDB_INIT_BUCKET

Anzulegender Bucket für die Aufnahme der Messwerte. Das ist die Datenbank, in der die Messwerte gespeichert werden. Der Bucket wird beim ersten Start von InfluxDB angelegt. SOLECTRUS verwendet nur einen Bucket, dieser wird daher sinnvollerweise `solectrus` benannt.

#### INFLUX_VOLUME_PATH

Pfad, in dem die Datenbank gespeichert wird. Dieser Pfad wird als Volume in den Container gemountet. Der Pfad sollte auf einem Datenträger mit ausreichend Speicherplatz liegen.

Wenn am angegebenen Pfad bereits eine Datenbank existiert, wird diese verwendet. Andernfalls wird eine neue Datenbank angelegt. Dies ist normalerweise nur beim ersten Start des Containers der Fall.

## Beispielhafte .env

```properties
TZ=Europe/Berlin
INFLUX_ORG=solectrus
INFLUX_USERNAME=admin
INFLUX_PASSWORD=ExAmPl3PA55W0rD
INFLUX_ADMIN_TOKEN=my-super-secret-admin-token
INFLUX_BUCKET=solectrus
INFLUX_VOLUME_PATH=/somewhere/solectrus/influxdb
```
