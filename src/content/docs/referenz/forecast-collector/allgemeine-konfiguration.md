---
title: Allgemeine Konfiguration
sidebar:
  order: 2
  label: Allgemeine Konfiguration
---

Der Forecast-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

In der `compose.yaml` wird ein neuer Service namens `forecast-collector` hinzugefügt. Dieser sollte so aussehen:

```yaml
services:
  # ...
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
      - PVNODE_APIKEY
      - PVNODE_PAID
      - PVNODE_EXTRA_PARAMS
      - PVNODE_0_EXTRA_PARAMS
      - PVNODE_1_EXTRA_PARAMS
      - PVNODE_2_EXTRA_PARAMS
      - PVNODE_3_EXTRA_PARAMS
      - INFLUX_HOST
      - INFLUX_PORT
      - INFLUX_SCHEMA
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${INFLUX_MEASUREMENT_FORECAST}
    restart: unless-stopped
    logging:
      driver: json-file
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
  # ...
```

:::note
Einige Variablen für den Service werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Services und vermeidet Redundanzen.

| Name der Variablen in `.env`  | Name der Variablen im Service |
| ----------------------------- | ----------------------------- |
| `INFLUX_TOKEN_WRITE`          | `INFLUX_TOKEN`                |
| `INFLUX_MEASUREMENT_FORECAST` | `INFLUX_MEASUREMENT`          |

:::

## Umgebungsvariablen (`.env`)

#### FORECAST_PROVIDER

Anbieter für die Ertragsprognose.

:::note[Pflicht]
Muss zwingend gesetzt werden

Mögliche Werte: `forecast.solar`, `solcast`, `pvnode`
:::

```properties title="Beispiel"
FORECAST_PROVIDER=pvnode
```

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

:::note[Optional]
Standard: `Europe/Berlin`
:::

```properties title="Beispiel"
TZ=Europe/Berlin
```

#### INFLUX_HOST

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Docker-Services (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_HOST=influxdb
```

#### INFLUX_SCHEMA

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

:::note[Optional]
Standard: `http`
:::

```properties title="Beispiel"
INFLUX_SCHEMA=https
```

#### INFLUX_PORT

Port für die Verbindung zu InfluxDB. Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

:::note[Optional]
Standard: `8086`
:::

```properties title="Beispiel"
INFLUX_PORT=443
```

#### INFLUX_TOKEN

Token für den Zugriff auf InfluxDB. Dieser Token muss die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

Das Token kann manuell in InfluxDB erstellt werden, alternativ kann aber auch das `INFLUX_ADMIN_TOKEN` verwendet werden.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_TOKEN=my-super-secret-admin-token
```

#### INFLUX_ORG

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_ORG=solectrus
```

#### INFLUX_BUCKET

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_BUCKET=solectrus
```

#### INFLUX_MEASUREMENT

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

:::note[Optional]
Standard: `Forecast`
:::

```properties title="Beispiel"
INFLUX_MEASUREMENT=my-forecast
```
