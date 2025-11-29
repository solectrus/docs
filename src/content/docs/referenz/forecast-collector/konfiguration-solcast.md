---
title: Konfiguration für Solcast
sidebar:
  order: 4
  label: Für Solcast
---

Diese Seite beschreibt die spezifischen Umgebungsvariablen für den Anbieter [Solcast](https://solcast.com). Diese beschränken sich auf die Angabe der API-Zugangsdaten und der Standort-IDs, da bei Solcast Standort- und Anlagendaten direkt im Solcast-Portal hinterlegt werden, nicht in der SOLECTRUS-Konfiguration.

Zusätzlich zu den hier beschriebenen Variablen müssen die [allgemeinen Einstellungen](/referenz/forecast-collector/allgemeine-konfiguration/) konfiguriert werden.

## Vollständiges Beispiel

```properties title=".env"
# Anbieter
FORECAST_PROVIDER=solcast

# Zeitzone
TZ=Europe/Berlin

# Solcast-Zugangsdaten
SOLCAST_APIKEY=my-solcast-api-key

# Dachflächen (Site-IDs aus dem Solcast-Portal)
FORECAST_CONFIGURATIONS=2

# Erste Dachfläche
SOLCAST_0_SITE=1111-1111-1111-1111

# Zweite Dachfläche
SOLCAST_1_SITE=2222-2222-2222-2222

# Abfrageintervall
FORECAST_INTERVAL=10800

# InfluxDB
INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
INFLUX_MEASUREMENT_FORECAST=forecast
```

## Die Variablen im Detail

### API-Zugang

#### SOLCAST_APIKEY

API-Key für die Nutzung von Solcast. Der Key kann im Solcast-Dashboard unter _Your API key_ abgerufen werden.

:::note[Pflicht]
:::

```properties title="Beispiel"
SOLCAST_APIKEY=my-solcast-api-key
```

### Abfrageintervall

#### FORECAST_INTERVAL

Intervall in Sekunden, in dem die Ertragsprognose abgerufen wird.

:::note[Pflicht]
Bei der kostenlosen Variante sind max. 10 Abfragen pro Tag erlaubt, also mindestens 8640 Sekunden.

Beachte, dass für jede Dachfläche eine separate Abfrage durchgeführt wird. Bei mehreren Dachflächen muss das Intervall entsprechend angepasst werden, um die maximal erlaubte Anzahl an Abfragen nicht zu überschreiten.
:::

```properties title="Beispiel"
FORECAST_INTERVAL=10800
```

### Einzelne Dachfläche

Bei einer einzelnen Dachfläche wird die folgende Variable verwendet:

#### SOLCAST_SITE

ID der Dachfläche bei Solcast.

:::note[Pflicht bei einzelner Dachfläche]
Format: `xxxx-xxxx-xxxx-xxxx`
:::

```properties title="Beispiel"
SOLCAST_SITE=1111-1111-1111-1111
```

### Mehrere Dachflächen

Bei mehreren Dachflächen muss zunächst die Anzahl festgelegt werden. Anschließend wird die Variable für jede Dachfläche gesetzt, wobei `X` für die Nummer der Dachfläche steht (0 oder 1).

#### FORECAST_CONFIGURATIONS

Anzahl der konfigurierten Dachflächen.

:::note[Pflicht bei mehreren Dachflächen]
Maximal 2 Konfigurationen werden unterstützt.
:::

```properties title="Beispiel"
FORECAST_CONFIGURATIONS=2
```

#### SOLCAST_X_SITE

ID der jeweiligen Dachfläche bei Solcast.

:::note[Pflicht bei mehreren Dachflächen]
Format: `xxxx-xxxx-xxxx-xxxx`
:::

```properties title="Beispiel"
SOLCAST_0_SITE=1111-1111-1111-1111
SOLCAST_1_SITE=2222-2222-2222-2222
```
