---
title: Konfiguration des SENEC-Chargers
sidebar:
  order: 3
  label: Konfiguration
---

Der SENEC-Charger wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  senec-charger:
    image: ghcr.io/solectrus/senec-charger:latest
    depends_on:
      influxdb:
        condition: service_healthy
    links:
      - influxdb
    environment:
      - TZ
      - SENEC_HOST
      - SENEC_SCHEMA
      - CHARGER_INTERVAL
      - CHARGER_PRICE_MAX
      - CHARGER_PRICE_TIME_RANGE
      - CHARGER_FORECAST_THRESHOLD
      - CHARGER_DRY_RUN
      - INFLUX_HOST
      - INFLUX_TOKEN=${INFLUX_TOKEN_READ}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT_PRICES
      - INFLUX_MEASUREMENT_FORECAST
    restart: unless-stopped

  influxdb:
    # ...

  tibber-collector:
    # ...

  forecast-collector:
    # ...
```

:::note
Die Variable `INFLUX_TOKEN`wird einer anders lautenden Umgebungsvariable entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Container und vermeidet Redundanzen.
:::

## Umgebungsvariablen

#### SENEC_HOST

Hostname des SENEC Stromspeichers. Dies ist üblicherweise eine IP-Adresse, kann aber auch eine lokale Domain sein. Es darf **kein** `http://` oder `https://` enthalten sein!

#### SENEC_SCHEMA

Das zu verwendende Protokoll für die Verbindung zum SENEC-Stromspeicher.

Erlaubte Werte: `http`, `https` \
Standard: `https`

#### CHARGER_INTERVAL

Intervall in Sekunden für die Überprüfung des Ladevorgangs

Standardwert: `3600`

#### CHARGER_PRICE_MAX

Maximaler Durchschnittspreis (in Prozent bezogen auf den Durchschnittspreis der nächsten 24 Stunden), unterhalb dessen der Akku geladen werden soll.

Standardwert: `70`

#### CHARGER_PRICE_TIME_RANGE

Ungefähre Dauer (in Stunden), die der Akku für eine volle Beladung benötigt.

Für diese Zeitspanne wird der erwartete Preis berechnet und mit den Preisen danach verglichen.

Standardwert: `4`

#### CHARGER_FORECAST_THRESHOLD

Obere Grenze für den erwarteten PV-Ertrag (in kWh) in den nächsten 24 Stunden, unterhalb derer das Laden aus dem Netz erfolgen soll.

Standardwert: `20`

#### CHARGER_DRY_RUN

Trockenlauf-Modus: Der Ladevorgang wird nicht gestartet (Standard: false)

#### INFLUX_HOST

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

#### INFLUX_SCHEMA

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Standardwert: `http`

#### INFLUX_PORT

Port für die Verbindung zu InfluxDB.

Optional, Standard ist `8086`

Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

#### INFLUX_TOKEN

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **lesen**.

#### INFLUX_ORG

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

#### INFLUX_BUCKET

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

## Beispielhafte .env

```properties
TZ=Europe/Berlin

SENEC_HOST=192.168.1.42
SENEC_SCHEMA=https

CHARGER_INTERVAL=3600
CHARGER_PRICE_MAX=70
CHARGER_PRICE_TIME_RANGE=4
CHARGER_FORECAST_THRESHOLD=20
CHARGER_DRY_RUN=false

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_READ=${INFLUX_ADMIN_TOKEN}
INFLUX_ORG=solectrus
INFLUX_PASSWORD=my-password
INFLUX_USERNAME=my-user
INFLUX_BUCKET=solectrus
INFLUX_MEASUREMENT_PRICES=my-prices
INFLUX_MEASUREMENT_FORECAST=my-forecast
```
