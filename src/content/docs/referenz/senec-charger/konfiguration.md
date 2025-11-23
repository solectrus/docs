---
title: Konfiguration des SENEC-Chargers
sidebar:
  order: 3
  label: Konfiguration
---

Der SENEC-Charger wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

In der `compose.yaml` wird ein neuer Service namens `senec-charger` hinzugefügt. Dieser sollte so aussehen:

```yaml
services:
  # ...
  senec-charger:
    image: ghcr.io/solectrus/senec-charger:latest
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
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_READ}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT_PRICES
      - INFLUX_MEASUREMENT_FORECAST
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
Die Variable `INFLUX_TOKEN` wird einer anders lautenden Umgebungsvariable entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Services und vermeidet Redundanzen.

| Name der Variablen in `.env` | Name der Variablen im Service |
| ---------------------------- | ----------------------------- |
| `INFLUX_TOKEN_READ`          | `INFLUX_TOKEN`                |

:::

## Umgebungsvariablen (`.env`)

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

:::note[Optional]
Standard: `Europe/Berlin`
:::

```dotenv title="Beispiel"
TZ=Europe/Rome
```

#### SENEC_HOST

Hostname des SENEC-Stromspeichers. Dies ist üblicherweise eine IP-Adresse, kann aber auch eine lokale Domain sein. Es darf **kein** `http://` oder `https://` enthalten sein!

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
SENEC_HOST=192.168.1.42
```

#### SENEC_SCHEMA

Protokoll für die Verbindung zum SENEC-Stromspeicher.

:::note[Optional]
Standard: `https`

Erlaubte Werte: `http`, `https`
:::

```dotenv title="Beispiel"
SENEC_SCHEMA=http
```

#### CHARGER_INTERVAL

Intervall, in dem der Charger die Strompreise prüft und Ladeentscheidungen trifft, in Sekunden.

:::note[Optional]
Standard: `3600` (= 1 Stunde)
:::

```dotenv title="Beispiel"
CHARGER_INTERVAL=1800
```

#### CHARGER_PRICE_MAX

Maximaler Durchschnittspreis (in Prozent bezogen auf den Durchschnittspreis der nächsten 24 Stunden), **unterhalb** dessen der Speicher geladen werden soll.

:::note[Optional]
Standard: `70`

Beim Wert von `70` wird geladen, wenn der Preis 70% oder weniger des 24-Stunden-Durchschnitts beträgt.
:::

```dotenv title="Beispiel"
CHARGER_PRICE_MAX=60
```

#### CHARGER_PRICE_TIME_RANGE

Ungefähre Dauer (in Stunden), die der Speicher für eine volle Beladung benötigt. Das hängt vor allem von der Kapazität des Speichers und der maximalen Ladeleistung ab.

Für diese Zeitspanne wird der erwartete Preis berechnet und mit den Preisen danach verglichen.

:::note[Optional]
Standard: `4`
:::

```dotenv title="Beispiel"
CHARGER_PRICE_TIME_RANGE=3
```

#### CHARGER_FORECAST_THRESHOLD

Obere Grenze für den erwarteten PV-Ertrag (in kWh) in den nächsten 24 Stunden, **unterhalb** derer das Laden aus dem Netz erfolgen soll.

:::note[Optional]
Standard: `20`

Wenn die Prognose einen PV-Ertrag von mehr als diesem Wert vorhersagt, wird der Speicher **nicht** aus dem Netz geladen, da genug Solarstrom erwartet wird.
:::

```dotenv title="Beispiel"
CHARGER_FORECAST_THRESHOLD=25
```

#### CHARGER_DRY_RUN

Trockenlauf-Modus: Wenn aktiviert, werden alle Berechnungen durchgeführt und protokolliert, aber der Ladevorgang wird **nicht** tatsächlich gestartet. Das ist nützlich zum Testen der Konfiguration.

:::note[Optional]
Standard: `false`

Erlaubte Werte: `true`, `false`
:::

```dotenv title="Beispiel"
CHARGER_DRY_RUN=true
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

Token für den Zugriff auf InfluxDB. Dieser Token muss die Berechtigung haben, Daten aus dem angegebenen Bucket zu **lesen**.

Das Token kann manuell in InfluxDB erstellt werden, alternativ kann aber auch das `INFLUX_ADMIN_TOKEN` verwendet werden.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_TOKEN=my-super-secret-admin-token
```

#### INFLUX_ORG

Organisation in InfluxDB, aus der die Messwerte gelesen werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_ORG=solectrus
```

#### INFLUX_BUCKET

Bucket in InfluxDB, aus dem die Messwerte gelesen werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_BUCKET=solectrus
```

#### INFLUX_MEASUREMENT_PRICES

Name des Measurements in InfluxDB, aus dem die Strompreise gelesen werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden

Üblicherweise ist das das Measurement, in das der [Tibber-Collector](/referenz/tibber-collector) die Preise schreibt.
:::

```dotenv title="Beispiel"
INFLUX_MEASUREMENT_PRICES=prices
```

#### INFLUX_MEASUREMENT_FORECAST

Name des Measurements in InfluxDB, aus dem die Wettervorhersage gelesen werden soll.

:::note[Pflicht]
Muss zwingend gesetzt werden

Üblicherweise ist das das Measurement, in das der [Forecast-Collector](/referenz/forecast-collector) die PV-Prognose schreibt.
:::

```dotenv title="Beispiel"
INFLUX_MEASUREMENT_FORECAST=forecast
```
