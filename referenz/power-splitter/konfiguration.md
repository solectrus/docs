---
title: Konfiguration
layout: page
parent: Power-Splitter
nav_order: 2
---

# Konfiguration des Power-Splitters

Der Power-Splitter wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

{:.important}

Voraussetzung ist, dass eine Sensor-Konfiguration vorhanden ist. Bei einer älteren Installation von SOLECTRUS (begonnen vor Version `0.15`) ist das meist nicht der Fall und muss zwingend [nachgeholt](/wartung/sensor-konfiguration) werden.

## compose.yaml

```yaml
services:
  power-splitter:
    image: ghcr.io/solectrus/power-splitter:latest
    environment:
      - TZ
      - POWER_SPLITTER_INTERVAL
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_ADMIN_TOKEN}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_SENSOR_GRID_IMPORT_POWER
      - INFLUX_SENSOR_HOUSE_POWER
      - INFLUX_SENSOR_WALLBOX_POWER
      - INFLUX_SENSOR_HEATPUMP_POWER
      - INFLUX_SENSOR_BATTERY_CHARGING_POWER
      - INFLUX_SENSOR_CUSTOM_POWER_01
      - INFLUX_SENSOR_CUSTOM_POWER_02
      - INFLUX_SENSOR_CUSTOM_POWER_03
      - INFLUX_SENSOR_CUSTOM_POWER_04
      - INFLUX_SENSOR_CUSTOM_POWER_05
      - INFLUX_SENSOR_CUSTOM_POWER_06
      - INFLUX_SENSOR_CUSTOM_POWER_07
      - INFLUX_SENSOR_CUSTOM_POWER_08
      - INFLUX_SENSOR_CUSTOM_POWER_09
      - INFLUX_SENSOR_CUSTOM_POWER_10
      - INFLUX_SENSOR_CUSTOM_POWER_11
      - INFLUX_SENSOR_CUSTOM_POWER_12
      - INFLUX_SENSOR_CUSTOM_POWER_13
      - INFLUX_SENSOR_CUSTOM_POWER_14
      - INFLUX_SENSOR_CUSTOM_POWER_15
      - INFLUX_SENSOR_CUSTOM_POWER_16
      - INFLUX_SENSOR_CUSTOM_POWER_17
      - INFLUX_SENSOR_CUSTOM_POWER_18
      - INFLUX_SENSOR_CUSTOM_POWER_19
      - INFLUX_SENSOR_CUSTOM_POWER_20
      - INFLUX_EXCLUDE_FROM_HOUSE_POWER
      - REDIS_URL
      - INSTALLATION_DATE
      - DB_HOST=postgresql
      - DB_PASSWORD=${POSTGRES_PASSWORD}
      - DB_USER=postgres
    logging:
      options:
        max-size: 10m
        max-file: '3'
    restart: unless-stopped
    depends_on:
      influxdb:
        condition: service_healthy
      redis:
        condition: service_healthy
    links:
      - influxdb
      - redis
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  influxdb:
    # ...

  watchtower:
    # ...
```

{:.note}

Die Variable `INFLUX_TOKEN` wird anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Container und vermeidet Redundanzen.

## Umgebungsvariablen

### `POWER_SPLITTER_INTERVAL`

Häufigkeit der Berechnung durch den Power-Splitter. Bei kleineren Werten wird der Power-Splitter häufiger ausgeführt, was nicht zu einer genaueren Berechnung führt, aber zu einer erhöhten Aktualität. Bemerken wird man den Unterschied nur in der Anzeige des aktuellen Tages im Dashboard. Beim Standardwert von `3600` ist der dargestellte Wert um bis zu einer Stunde veraltet.

Ein niedriger Wert führt zu einer etwas höheren Auslastung des Systems, die Standardvorgabe ist daher konservativ gewählt. Das Minimum beträgt `300` (5 Minuten).

### `INFLUX_HOST`

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

### `INFLUX_SCHEMA`

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Standardwert: `http`

### `INFLUX_PORT`

Port für die Verbindung zu InfluxDB.

Optional, Standard ist `8086`

Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

### `INFLUX_TOKEN`

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **lesen** und zu **schreiben**.

### `INFLUX_ORG`

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `INFLUX_BUCKET`

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `REDIS_URL`

URL für den Redis-Cache. Wird benötigt, um nach dem ersten Durchlauf einmalig den Cache leeren zu können.

### `DB_HOST` (optional)

Hostname der PostgreSQL-Datenbank. Wird benötigt, nach einer Neuberechnung die Tageszusammenfassungen zurücksetzen zu können. Muss dem Namen des Services in der `compose.yaml` entsprechen, also normalerweise `postgresql`.

### `DB_USER` (optional)

Benutzername für die PostgreSQL-Datenbank, normalerweise `postgres`.

### `DB_PASSWORD` (optional)

Passwort für die PostgreSQL-Datenbank. Da die Variable in der `.env` anders heißt (nämlich `POSTGRES_PASSWORD`), muss hier der Wert explizit zugewiesen werden, also `DB_PASSWORD=${POSTGRES_PASSWORD}`.

### `INSTALLATION_DATE`

Datum der Installation von SOLECTRUS. Wird benötigt, um bei einer Neuberechnung einen definierten Startpunkt zu haben. Fehlt die Variable, sucht der Power-Splitter nach dem ältesten Tag, für den Messwerte vorliegen, und beginnt dort mit der Neuberechnung.

## Beispielhafte .env

```properties
POWER_SPLITTER_INTERVAL=300

INFLUX_SENSOR_GRID_IMPORT_POWER=SENEC:grid_power_plus
INFLUX_SENSOR_HOUSE_POWER=SENEC:house_power
INFLUX_SENSOR_WALLBOX_POWER=SENEC:wallbox_charge_power
INFLUX_SENSOR_BATTERY_CHARGING_POWER=SENEC:bat_power_plus
INFLUX_SENSOR_HEATPUMP_POWER=DAIKIN:power
INFLUX_SENSOR_CUSTOM_POWER_01=Washer:power
INFLUX_EXCLUDE_FROM_HOUSE_POWER=HEATPUMP_POWER

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_ADMIN_TOKEN=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus

REDIS_URL=redis://redis:6379/1

INSTALLATION_DATE=2020-11-27
```

## Sensor-Mapping

Der Power-Splitter verwendete einige der Sensoren, die auch vom Dashboard werden und somit bereits in der `.env` definiert werden. Im Einzelnen sind dies diese Variablen:

- `INFLUX_SENSOR_GRID_IMPORT_POWER`
- `INFLUX_SENSOR_HOUSE_POWER`
- `INFLUX_SENSOR_WALLBOX_POWER`
- `INFLUX_SENSOR_HEATPUMP_POWER`
- `INFLUX_SENSOR_BATTERY_CHARGING_POWER`
- `INFLUX_SENSOR_CUSTOM_POWER_01`
- `INFLUX_SENSOR_CUSTOM_POWER_02`
- `INFLUX_SENSOR_CUSTOM_POWER_03`
- `INFLUX_SENSOR_CUSTOM_POWER_04`
- `INFLUX_SENSOR_CUSTOM_POWER_05`
- `INFLUX_SENSOR_CUSTOM_POWER_06`
- `INFLUX_SENSOR_CUSTOM_POWER_07`
- `INFLUX_SENSOR_CUSTOM_POWER_08`
- `INFLUX_SENSOR_CUSTOM_POWER_09`
- `INFLUX_SENSOR_CUSTOM_POWER_10`
- `INFLUX_SENSOR_CUSTOM_POWER_11`
- `INFLUX_SENSOR_CUSTOM_POWER_12`
- `INFLUX_SENSOR_CUSTOM_POWER_13`
- `INFLUX_SENSOR_CUSTOM_POWER_14`
- `INFLUX_SENSOR_CUSTOM_POWER_15`
- `INFLUX_SENSOR_CUSTOM_POWER_16`
- `INFLUX_SENSOR_CUSTOM_POWER_17`
- `INFLUX_SENSOR_CUSTOM_POWER_18`
- `INFLUX_SENSOR_CUSTOM_POWER_19`
- `INFLUX_SENSOR_CUSTOM_POWER_20`
- `INFLUX_EXCLUDE_FROM_HOUSE_POWER`

Es genügt also, wenn man diese Variablen in der `compose.yml` aufführt und somit den Zugriff ermöglicht. Es ist nicht notwendig und auch nicht sinnvoll, für den Power-Splitter eigene Werte zu definieren.
