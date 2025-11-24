---
title: Ausführung des CSV-Importers
sidebar:
  order: 2
  label: Ausführung
---

Der CSV-Importer nutzt die gleiche `.env`-Datei wie die bestehende SOLECTRUS-Installation.

## Verwendung

Der CSV-Importer wird nicht in die `compose.yaml` eingetragen, da er nur **einmalig** ausgeführt wird. Stattdessen wird er direkt per `docker run` gestartet.

Die CSV-Dateien müssen in einem Ordner `csv` im aktuellen Verzeichnis abgelegt werden. Anschließend wird der Import mit folgendem Befehl gestartet:

```bash
docker run -it --rm \
  --env-file .env \
  --mount type=bind,source="$PWD/csv",target=/data,readonly \
  --network=solectrus_default \
  ghcr.io/solectrus/csv-importer
```

Der Prozess ist idempotent und kann gefahrlos mehrfach ausgeführt werden. Der Importer erkennt eigenständig, ob es sich um Daten von SENEC, Sungrow oder SolarEdge handelt.

### Nach dem Import

Da durch den Import Messwerte aus der Vergangenheit hinzugefügt werden, sind zwei zusätzliche Schritte erforderlich:

#### **1.** Redis-Cache leeren

```bash
docker exec -it solectrus-redis-1 redis-cli FLUSHALL
```

#### **2.** Tageswerte zurücksetzen

In SOLECTRUS selbst unter "Einstellungen" muss die Funktion "Tageswerte zurücksetzen" ausgeführt werden.

## Umgebungsvariablen

Durch obigen Befehl werden alle in der `.env`-Datei definierten Umgebungsvariablen an den Container übergeben. Folgende Variablen sind für den CSV-Importer relevant:

### InfluxDB-Verbindung

| Variable             | Beschreibung                                         | Standard |
| -------------------- | ---------------------------------------------------- | -------- |
| `INFLUX_HOST`        | Hostname (z.B. `influxdb`)                           | -        |
| `INFLUX_SCHEMA`      | Protokoll (`http` oder `https`)                      | `http`   |
| `INFLUX_PORT`        | Port                                                 | `8086`   |
| `INFLUX_TOKEN_WRITE` | Token mit Schreibrechten (alternativ `INFLUX_TOKEN`) | -        |
| `INFLUX_ORG`         | Organisation                                         | -        |
| `INFLUX_BUCKET`      | Bucket                                               | -        |

### Sensor-Zuordnung

| Variable                            | Beschreibung           |
| ----------------------------------- | ---------------------- |
| `INFLUX_SENSOR_INVERTER_POWER`      | Wechselrichterleistung |
| `INFLUX_SENSOR_HOUSE_POWER`         | Hausverbrauch          |
| `INFLUX_SENSOR_GRID_POWER_PLUS`     | Netzbezug              |
| `INFLUX_SENSOR_GRID_POWER_MINUS`    | Netzeinspeisung        |
| `INFLUX_SENSOR_BATTERY_POWER_PLUS`  | Batterieladung         |
| `INFLUX_SENSOR_BATTERY_POWER_MINUS` | Batterieentladung      |
| `INFLUX_SENSOR_BATTERY_SOC`         | Batterieladestand      |

### Weitere Variablen

#### IMPORT_FOLDER

Pfad zum Import-Ordner, in dem die CSV-Dateien liegen.

:::note[Optional]
Standard: `/data`
:::

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

:::note[Optional]
Standard: `Europe/Berlin`
:::

```properties title="Beispiel"
TZ=Europe/Rome
```

#### SENEC_IGNORE

Deaktivieren bestimmter Messwerte, die **nicht** an InfluxDB gesendet werden sollen. Dies kann nützlich sein, wenn einzelne Messwerte (z.B. der Wallbox) aus einer anderen Quelle entnommen werden sollen.

Komma-getrennte Liste von Feldern, keine Leerzeichen.

:::note[Optional]
Standard: leer (d.h. alle Messwerte werden gesendet)

Wirkt sich nur aus, wenn SENEC-Daten importiert werden.
:::

```properties title="Beispiel"
SENEC_IGNORE=wallbox_charge_power,grid_power_minus
```
