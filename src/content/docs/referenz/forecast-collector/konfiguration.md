---
title: Konfiguration des Forecast-Collectors
sidebar:
  order: 2
  label: Konfiguration
---

Der Forecast-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  forecast-collector:
    image: ghcr.io/solectrus/forecast-collector:latest
    environment:
      - TZ
      - FORECAST_PROVIDER
      - FORECAST_LATITUDE
      - FORECAST_LONGITUDE
      - FORECAST_DECLINATION
      - FORECAST_AZIMUTH
      - FORECAST_KWP
      - FORECAST_DAMPING_MORNING
      - FORECAST_DAMPING_EVENING
      - FORECAST_HORIZON
      - FORECAST_INVERTER
      - FORECAST_CONFIGURATIONS
      - FORECAST_0_DECLINATION
      - FORECAST_0_AZIMUTH
      - FORECAST_0_KWP
      - FORECAST_1_DECLINATION
      - FORECAST_1_AZIMUTH
      - FORECAST_1_KWP
      - FORECAST_2_DECLINATION
      - FORECAST_2_AZIMUTH
      - FORECAST_2_KWP
      - FORECAST_3_DECLINATION
      - FORECAST_3_AZIMUTH
      - FORECAST_3_KWP
      - FORECAST_INTERVAL
      - FORECAST_SOLAR_APIKEY
      - SOLCAST_APIKEY
      - SOLCAST_SITE
      - SOLCAST_0_SITE
      - SOLCAST_1_SITE
      - INFLUX_HOST
      - INFLUX_PORT
      - INFLUX_SCHEMA
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${INFLUX_MEASUREMENT_FORECAST}
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

:::note
Die beiden Variablen `INFLUX_TOKEN` und `INFLUX_MEASUREMENT` werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Container und vermeidet Redundanzen.
:::

## Umgebungsvariablen

#### FORECAST_PROVIDER

Anbieter für die Ertragsprognose.

Mögliche Werte: `forecast.solar`, `solcast`

#### FORECAST_LATITUDE

Breitengrad des Standorts der PV-Anlage

-90 (Süd) ... 90 (Nord)

#### FORECAST_LONGITUDE

Längengrad des Standorts der PV-Anlage

-180 (West) ... 180 (Ost)

#### FORECAST_DECLINATION

Dachneigung in Grad

0 (horizontal) ... 90 (vertikal)

#### FORECAST_AZIMUTH

Ausrichtung des Dachs in Grad

- -180 = Nord
- -90 = Ost
- 0 = Süd
- 90 = West
- 180 = Nord

#### FORECAST_KWP

Maximale Leistung der PV-Anlage in kWp

#### FORECAST_CONFIGURATIONS

Falls mehrere Dachflächen konfiguriert sind, kann hier die Anzahl hier angegeben werden. Anschließend müssen die folgenden Variablen für jede Dachfläche angegeben werden.

#### FORECAST_0_DECLINATION

Erstes Dach: Dachneigung in Grad

#### FORECAST_0_AZIMUTH

Erste Dach: Ausrichtung des Dachs in Grad

#### FORECAST_0_KWP

Erstes Dach: Maximale Leistung der Module in kWp

#### FORECAST_1_DECLINATION

Zweites Dach: Dachneigung in Grad

#### FORECAST_1_AZIMUTH

Zweites Dach: Ausrichtung des Dachs in Grad

#### FORECAST_1_KWP

Zweites Dach: Maximale Leistung der Module in kWp

#### FORECAST_2_DECLINATION

Drittes Dach: Dachneigung in Grad

#### FORECAST_2_AZIMUTH

Drittes Dach: Ausrichtung des Dachs in Grad

#### FORECAST_2_KWP

Drittes Dach: Maximale Leistung der Module in kWp

#### FORECAST_3_DECLINATION

Viertes Dach: Dachneigung in Grad

#### FORECAST_3_AZIMUTH

Viertes Dach: Ausrichtung des Dachs in Grad

#### FORECAST_3_KWP

Viertes Dach: Maximale Leistung der Module in kWp

#### FORECAST_INTERVAL

Intervall in Sekunden, in dem die Ertragsprognose abgerufen wird. Hierbei ist zu beachten, dass die Anbieter unterschiedliche Limits erfordern.

#### FORECAST_SOLAR_APIKEY

Optionaler API-Key für den Zugriff auf die kostenpflichtigen Variante von `forecast.solar`.

#### SOLCAST_APIKEY

API-Key für die Nutzung von `solcast.com`.

#### SOLCAST_SITE

ID des Standorts bei `solcast.com`.

#### SOLCAST_0_SITE

Falls mehrere Dachflächen bei `solcast.com` konfiguriert sind, kann hier die ID der ersten Dachfläche angegeben werden.

#### SOLCAST_1_SITE

Falls mehrere Dachflächen bei `solcast.com` konfiguriert sind, kann hier die ID der zweiten Dachfläche angegeben werden.

#### INFLUX_HOST

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Docker-Services (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

#### INFLUX_SCHEMA

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Standardwert: `http`

#### INFLUX_PORT

Port für die Verbindung zu InfluxDB.

Optional, Standard ist `8086`

Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

#### INFLUX_TOKEN

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

#### INFLUX_ORG

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

#### INFLUX_BUCKET

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

#### INFLUX_MEASUREMENT

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

## Beispielhafte .env für forecast.solar

```properties
FORECAST_PROVIDER=forecast.solar
FORECAST_CONFIGURATIONS=2
FORECAST_INTERVAL=1800
INFLUX_MEASUREMENT_FORECAST=forecast
FORECAST_LATITUDE=51.312801
FORECAST_LONGITUDE=9.481544
FORECAST_0_DECLINATION=27
FORECAST_0_AZIMUTH=10
FORECAST_0_KWP=3.9
FORECAST_1_DECLINATION=30
FORECAST_1_AZIMUTH=170
FORECAST_1_KWP=5.5

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
```

## Beispielhafte .env für solcast.com

```properties
FORECAST_PROVIDER=solcast
FORECAST_CONFIGURATIONS=2
FORECAST_INTERVAL=17280
INFLUX_MEASUREMENT_FORECAST=forecast
SOLCAST_APIKEY=my-solcast-api-key
SOLCAST_0_SITE=1234-5678-9012-3123
SOLCAST_1_SITE=1231-2334-3453-4534

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
```
