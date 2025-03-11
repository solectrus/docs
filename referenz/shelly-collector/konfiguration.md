---
title: Konfiguration
layout: page
parent: Shelly-Collector
---

# Konfigurieren des Shelly-Collectors

Der Shelly-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  shelly-collector:
    image: ghcr.io/solectrus/shelly-collector:latest
    environment:
      - TZ
      - SHELLY_HOST
      - SHELLY_INTERVAL
      - SHELLY_GEN
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${INFLUX_MEASUREMENT_SHELLY}
      - INFLUX_MODE
    logging:
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

  influxdb:
    # ...

  watchtower:
    # ...
```

{:.note}

Die beiden Variablen `INFLUX_TOKEN` und `INFLUX_MEASUREMENT` werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Container und vermeidet Redundanzen.

## Umgebungsvariablen

### `SHELLY_HOST`

Hostname des Shelly. Dies ist üblicherweise eine IP-Adresse, kann aber auch eine lokale Domain sein. Es darf **kein** `http://` oder `https://` enthalten sein!

### `SHELLY_INTERVAL`

Häufigkeit der Abfrage des aktuellen Messwertes (in Sekunden). Es empfiehlt sich eine Abfrage alle 5 Sekunden, um eine gute Auflösung zu erhalten.

Standardwert: `5`

### `SHELLY_GEN` (ab Version 0.4.0)

Generation des Shelly-Gerätes. Mögliche Werte sind `1` für erste Generation und `2` für zweite Generation.

Standardwert: `2`

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

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

### `INFLUX_ORG`

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `INFLUX_BUCKET`

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `INFLUX_MEASUREMENT`

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

### `INFLUX_MODE` (ab Version 0.5.0)

Modus, in dem die Messwerte an InfluxDB übertragen werden. Mögliche Werte sind `default` und `essential`. Im `essential`-Modus werden nur dann Messwerte nach InfluxDB geschrieben, wenn ein Verbrauch stattfindet (also nicht 0 ist). Dies spart Speicherplatz und schont die Datenbank. Es eignet sich vor allem für Geräte, die nur selten in Betrieb sind (z.B. Waschmaschine, Geschirrspüler etc).

Beim Abschalten des Geräts wird einmalig ein Wert von 0 Watt geschrieben, um InfluxDB eine präzise Berechnung der Verbrauchsmenge zu ermöglichen.

Im `default`-Modus wird jeder erhaltene Messwert nach InfluxDB geschrieben.

## Beispielhafte .env

```properties
SHELLY_HOST=192.168.178.5
SHELLY_INTERVAL=5
SHELLY_GEN=2
INFLUX_MEASUREMENT_SHELLY=heatpump

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
INFLUX_MODE=essential
```
