---
title: Konfiguration des Power-Splitters
sidebar:
  order: 3
  label: Konfiguration
---

Der Power-Splitter wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

:::caution
Voraussetzung ist, dass eine Sensor-Konfiguration vorhanden ist. Bei einer älteren Installation von SOLECTRUS (begonnen vor Version `0.15`) ist das meist nicht der Fall und muss zwingend [nachgeholt](/wartung/sensor-konfiguration) werden.
:::

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

:::note
Einige Variablen für den Service werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Services und vermeidet Redundanzen.

| Name der Variablen in `.env` | Name der Variablen im Service |
| ---------------------------- | ----------------------------- |
| `INFLUX_ADMIN_TOKEN`         | `INFLUX_TOKEN`                |
| `POSTGRES_PASSWORD`          | `DB_PASSWORD`                 |

:::

## Umgebungsvariablen (`.env`)

#### POWER_SPLITTER_INTERVAL

Häufigkeit der Berechnung durch den Power-Splitter in Sekunden. Bei kleineren Werten wird der Power-Splitter häufiger ausgeführt, was nicht zu einer genaueren Berechnung führt, aber zu einer erhöhten Aktualität. Bemerken wird man den Unterschied nur in der Anzeige des aktuellen Tages im Dashboard.

:::note[Optional]
Standard: `3600` (= 1 Stunde)

Ein niedriger Wert führt zu einer etwas höheren Auslastung des Systems, die Standardvorgabe ist daher konservativ gewählt. Das Minimum beträgt `300` (= 5 Minuten).

:::

```dotenv title="Beispiel"
POWER_SPLITTER_INTERVAL=300
```

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

:::note[Optional]
Standard: `Europe/Berlin`
:::

```dotenv title="Beispiel"
TZ=Europe/Rome
```

#### INFLUX_HOST

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Docker-Services (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_HOST=influxdb
```

#### INFLUX_SCHEMA

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

:::note[Optional]
Standard: `http`
:::

```dotenv title="Beispiel"
INFLUX_SCHEMA=https
```

#### INFLUX_PORT

Port für die Verbindung zu InfluxDB. Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

:::note[Optional]
Standard: `8086`
:::

```dotenv title="Beispiel"
INFLUX_PORT=443
```

#### INFLUX_TOKEN

Token für den Zugriff auf InfluxDB. Dieses Token muss die Berechtigung haben, Daten in den angegebenen Bucket zu **lesen** und zu **schreiben**.

Das Token kann manuell in InfluxDB erstellt werden, alternativ kann aber auch das `INFLUX_ADMIN_TOKEN` verwendet werden.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_TOKEN=my-super-secret-admin-token
```

#### INFLUX_ORG

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_ORG=solectrus
```

#### INFLUX_BUCKET

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_BUCKET=solectrus
```

#### REDIS_URL

URL für den Redis-Cache. Wird benötigt, um nach dem ersten Durchlauf (oder einer erzwungenen Neuberechnung) einmalig den Cache leeren zu können.

:::note[Optional]
Wenn nicht gesetzt, kann der Redis-Cache bei Bedarf nicht geleert werden und im Log erscheint eine Warnung. Man muss den Cache dann manuell leeren, z.B. mit dem Befehl `docker compose exec redis redis-cli FLUSHALL`.
:::

```dotenv title="Beispiel"
REDIS_URL=redis://redis:6379/1
```

#### DB_HOST

Hostname der PostgreSQL-Datenbank. Wird benötigt, nach einer Neuberechnung die Tageszusammenfassungen zurücksetzen zu können. Muss dem Namen des Services in der `compose.yaml` entsprechen, also normalerweise `postgresql`.

:::note[Optional]
Wenn nicht gesetzt, kann können die Tageszusammenfassungen bei Bedarf nicht gelöscht werden und im Log erscheint eine Warnung. Man muss dann die Tageszusammenfassungen manuell im Dashboard zurücksetzen.

Gilt in Verbindung mit den Variablen `DB_USER` und `DB_PASSWORD`.
:::

```dotenv title="Beispiel"
DB_HOST=postgresql
```

#### DB_USER

Benutzername für die PostgreSQL-Datenbank, normalerweise `postgres`.

:::note[Optional]
Wenn nicht gesetzt, kann können die Tageszusammenfassungen nicht gelöscht werden und im Log erscheint eine Warnung. Man muss dann die Tageszusammenfassungen manuell im Dashboard zurücksetzen.

Gilt in Verbindung mit den Variablen `DB_HOST` und `DB_PASSWORD`.
:::

```dotenv title="Beispiel"
DB_USER=postgres
```

#### DB_PASSWORD

Passwort für die PostgreSQL-Datenbank. Da die Variable in der `.env` anders heißt (nämlich `POSTGRES_PASSWORD`), muss hier der Wert explizit in der `compose.yaml` zugewiesen werden, also `DB_PASSWORD=${POSTGRES_PASSWORD}`.

:::note[Optional]
Wenn nicht gesetzt, kann können die Tageszusammenfassungen nicht gelöscht werden und im Log erscheint eine Warnung. Man muss dann die Tageszusammenfassungen manuell im Dashboard zurücksetzen.

Gilt in Verbindung mit den Variablen `DB_HOST` und `DB_USER`.
:::

```dotenv title="Beispiel"
DB_PASSWORD=ExAmPl3PA55W0rD
```

#### INSTALLATION_DATE

Datum der Installation von SOLECTRUS. Wird benötigt, um bei einer Neuberechnung einen definierten Startpunkt zu haben.

:::note[Optional]
Wenn nicht gesetzt, sucht der Power-Splitter nach dem ältesten Tag, für den Messwerte vorliegen, und beginnt dort mit der Neuberechnung. Das kann in manchen Fällen zu einem sehr frühen Datum führen, was die Neuberechnung unnötig verlängert.
:::

```dotenv title="Beispiel"
INSTALLATION_DATE=2020-11-27
```

## Sensor-Definition

Der Power-Splitter verwendete einige der Sensoren, die auch vom [Dashboard](/referenz/dashboard/) werden und somit bereits in der `.env` definiert werden. Im Einzelnen sind dies diese Variablen:

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

Es genügt also, wenn man diese Variablen in der `compose.yml` aufführt und somit den Zugriff ermöglicht (wie [oben](#composeyaml) dargestellt). Es ist nicht notwendig und auch nicht sinnvoll, für den Power-Splitter eigene Sensor-Variablen zu definieren.

## Sonstiges

Der Power-Splitter schreibt seine Berechnungen in ein neues Measurement mit der (unveränderlichen) Bezeichnung `power_splitter`. Daher ist es nicht notwendig, eine eigene Variable für das Measurement zu definieren.
