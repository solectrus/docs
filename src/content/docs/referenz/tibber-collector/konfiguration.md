---
title: Konfiguration des Tibber-Collectors
sidebar:
  order: 2
  label: Konfiguration
---

Der Tibber-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

In der `compose.yaml` wird ein neuer Service namens `tibber-collector` hinzugefügt. Dieser sollte so aussehen:

```yaml
services:
  # ...
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
      driver: 'json-file'
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
  # ...
```

:::note
Einige Variablen für den Service werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Services und vermeidet Redundanzen.

| Name der Variablen in `.env` | Name der Variablen im Service |
| ---------------------------- | ----------------------------- |
| `INFLUX_TOKEN_WRITE`         | `INFLUX_TOKEN`                |
| `INFLUX_MEASUREMENT_PRICES`  | `INFLUX_MEASUREMENT`          |

:::

## Umgebungsvariablen (`.env`)

#### TIBBER_TOKEN

_Access Token_ von Tibber, erforderlich für den Zugriff auf die Tibber-API. Dieses kann [auf der Developer-Website von Tibber](https://developer.tibber.com/settings/access-token) erstellt werden.

:::note[Pflicht]
Muss zwingend gesetzt werden. Erfordert einen Account und einen aktiven Vertrag bei Tibber.
:::

```properties title="Beispiel"
TIBBER_TOKEN=3A77EECF61BD445F47241A5A36202185C35AF3AF58609E19B53F3A8872AD7BE1-1
```

#### TIBBER_INTERVAL

Intervall, in dem die Preise von Tibber abgefragt werden sollen, in Sekunden.

:::note[Optional]
Standard: `3600` (= 1 Stunde)

Es ist nicht empfehlenswert, dieses Intervall zu verkürzen, da Tibber die Preise nur einmal täglich aktualisiert. Ein kürzeres Intervall würde lediglich zu unnötigen API-Anfragen führen.
:::

```properties title="Beispiel"
TIBBER_INTERVAL=7200
```

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

:::note[Optional]
Standard: `Europe/Berlin`
:::

```properties title="Beispiel"
TZ=Europe/Rome
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

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_MEASUREMENT=prices
```
