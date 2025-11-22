---
title: Konfiguration des CSV-Importers
sidebar:
  order: 2
  label: Konfiguration
---

Der CSV-Importer nutzt die gleiche `.env`-Datei wie die bestehende SOLECTRUS-Installation.

## Verwendung

Der CSV-Importer wird nicht in die `compose.yaml` eingetragen, da er nur **einmalig** ausgeführt wird. Stattdessen wird er direkt per `docker run` gestartet.

CSV-Dateien im Ordner `csv` ablegen und Import starten:

```bash
docker run -it --rm \
  --env-file .env \
  --mount type=bind,source="$PWD/csv",target=/data,readonly \
  --network=solectrus_default \
  ghcr.io/solectrus/csv-importer
```

Der Prozess ist idempotent und kann mehrfach ausgeführt werden.

### Nach dem Import

Da durch den Import Messwerte aus der Vergangenheit hinzugefügt werden, sind zwei zusätzliche Schritte erforderlich:

#### **1.** Redis-Cache leeren

```bash
docker exec -it solectrus-redis-1 redis-cli FLUSHALL
```

#### **2.** Tageswerte zurücksetzen

In SOLECTRUS selbst unter "Einstellungen" muss die Funktion "Tageswerte zurücksetzen" ausgeführt werden.

## Umgebungsvariablen

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

Die Zuordnung hängt von der SOLECTRUS-Installation ab.

### Weitere Einstellungen

| Variable        | Beschreibung                                  | Standard        |
| --------------- | --------------------------------------------- | --------------- |
| `IMPORT_FOLDER` | Pfad zum Import-Ordner                        | `/data`         |
| `TZ`            | Zeitzone                                      | `Europe/Berlin` |
| `SENEC_IGNORE`  | Auszuschließende SENEC-Felder (kommagetrennt) | -               |
