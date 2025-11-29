---
title: Konfiguration für Forecast.Solar
sidebar:
  order: 3
  label: Für Forecast.Solar
---

Diese Seite beschreibt die spezifischen Umgebungsvariablen für den Anbieter [Forecast.Solar](https://forecast.solar).

Zusätzlich zu den hier beschriebenen Variablen müssen die [allgemeinen Einstellungen](/referenz/forecast-collector/allgemeine-konfiguration/) konfiguriert werden.

## Vollständiges Beispiel

```properties title=".env"
# Anbieter
FORECAST_PROVIDER=forecast.solar

# Zeitzone
TZ=Europe/Berlin

# Standort
FORECAST_LATITUDE=50.12345
FORECAST_LONGITUDE=6.12345

# Dachflächen
FORECAST_CONFIGURATIONS=2

# Erste Dachfläche
FORECAST_0_DECLINATION=30
FORECAST_0_AZIMUTH=180
FORECAST_0_KWP=5.5

# Zweite Dachfläche
FORECAST_1_DECLINATION=30
FORECAST_1_AZIMUTH=270
FORECAST_1_KWP=3.9

# Dritte Dachfläche
# FORECAST_2_DECLINATION=25
# FORECAST_2_AZIMUTH=200
# FORECAST_2_KWP=4.2

# Vierte Dachfläche
# FORECAST_3_DECLINATION=35
# FORECAST_3_AZIMUTH=150
# FORECAST_3_KWP=6.0

# Abfrageintervall
FORECAST_INTERVAL=900

# Optional: API-Key für kostenpflichtiges Abo
# FORECAST_SOLAR_APIKEY=abc123def456

# Optional: Dämpfungsfaktoren (0-1)
# FORECAST_DAMPING_MORNING=0.5
# FORECAST_DAMPING_EVENING=0.5

# Optional: Horizontprofil
# FORECAST_HORIZON=5,10,15,20,25,30

# Optional: Wechselrichter-Begrenzung in Watt
# FORECAST_INVERTER=8000

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

### Standort

#### FORECAST_LATITUDE

Breitengrad des Standorts der PV-Anlage.

:::note[Pflicht]
Wertebereich: -90 (Süd) ... 90 (Nord)
:::

```properties title="Beispiel"
FORECAST_LATITUDE=50.12345
```

#### FORECAST_LONGITUDE

Längengrad des Standorts der PV-Anlage.

:::note[Pflicht]
Wertebereich: -180 (West) ... 180 (Ost)
:::

```properties title="Beispiel"
FORECAST_LONGITUDE=6.12345
```

### Einzelne Dachfläche

Bei einer einzelnen Dachfläche werden die folgenden Variablen verwendet:

#### FORECAST_DECLINATION

Dachneigung in Grad.

:::note[Pflicht bei einzelner Dachfläche]
Wertebereich: 0 (horizontal) ... 90 (vertikal)
:::

```properties title="Beispiel"
FORECAST_DECLINATION=30
```

#### FORECAST_AZIMUTH

Ausrichtung des Dachs in Grad.

:::note[Pflicht bei einzelner Dachfläche]
Wertebereich:

- -180 = Nord
- -90 = Ost
- 0 = Süd
- 90 = West
- 180 = Nord

:::

```properties title="Beispiel"
FORECAST_AZIMUTH=10
```

#### FORECAST_KWP

Maximale Leistung der PV-Anlage in kWp.

:::note[Pflicht bei einzelner Dachfläche]
:::

```properties title="Beispiel"
FORECAST_KWP=9.24
```

### Mehrere Dachflächen

Bei mehreren Dachflächen muss zunächst die Anzahl festgelegt werden. Anschließend werden die Variablen für jede Dachfläche gesetzt, wobei `X` für die Nummer der Dachfläche steht (0-3).

#### FORECAST_CONFIGURATIONS

Anzahl der konfigurierten Dachflächen.

:::note[Pflicht bei mehreren Dachflächen]
Maximal 4 Konfigurationen werden unterstützt.
:::

```properties title="Beispiel"
FORECAST_CONFIGURATIONS=2
```

#### FORECAST_X_DECLINATION

Dachneigung der jeweiligen Dachfläche in Grad.

:::note[Pflicht bei mehreren Dachflächen]
Wertebereich: 0 (horizontal) ... 90 (vertikal)
:::

```properties title="Beispiel"
FORECAST_0_DECLINATION=27
FORECAST_1_DECLINATION=30
```

#### FORECAST_X_AZIMUTH

Ausrichtung der jeweiligen Dachfläche in Grad.

:::note[Pflicht bei mehreren Dachflächen]
Wertebereich: -180 (Nord) ... 180 (Nord), 0 = Süd
:::

```properties title="Beispiel"
FORECAST_0_AZIMUTH=10
FORECAST_1_AZIMUTH=170
```

#### FORECAST_X_KWP

Maximale Leistung der Module auf der jeweiligen Dachfläche in kWp.

:::note[Pflicht bei mehreren Dachflächen]
:::

```properties title="Beispiel"
FORECAST_0_KWP=3.9
FORECAST_1_KWP=5.5
```

### Abfrageintervall

#### FORECAST_INTERVAL

Intervall in Sekunden, in dem die Ertragsprognose abgerufen wird.

:::note[Pflicht]
Kostenlos: max. 12 Abfragen pro Stunde, also mindestens 300 Sekunden
Personal-Abo: max. 60 Abfragen pro Stunde, also mindestens 60 Sekunden

Beachte, dass für jede Dachfläche eine separate Abfrage durchgeführt wird. Bei mehreren Dachflächen muss das Intervall entsprechend angepasst werden, um die maximal erlaubte Anzahl an Abfragen nicht zu überschreiten.
:::

```properties title="Beispiel"
FORECAST_INTERVAL=900
```

### Optionale Einstellungen

#### FORECAST_DAMPING_MORNING

Dämpfungsfaktor für die Morgenprognose.

:::note[Optional]
Standard: `0`

Wertebereich: 0 ... 1
:::

```properties title="Beispiel"
FORECAST_DAMPING_MORNING=0.5
```

#### FORECAST_DAMPING_EVENING

Dämpfungsfaktor für die Abendprognose.

:::note[Optional]
Standard: `0`

Wertebereich: 0 ... 1
:::

```properties title="Beispiel"
FORECAST_DAMPING_EVENING=0.5
```

#### FORECAST_HORIZON

Horizontprofil als durch Kommas getrennte Liste von Höhenwinkeln.

:::note[Optional]
:::

```properties title="Beispiel"
FORECAST_HORIZON=5,10,15,20,25,30
```

#### FORECAST_INVERTER

Maximale Wechselrichterleistung in Watt.

:::note[Optional]
:::

```properties title="Beispiel"
FORECAST_INVERTER=8000
```

#### FORECAST_SOLAR_APIKEY

API-Key für den Zugriff auf die kostenpflichtige Variante von forecast.solar.

:::note[Optional]
Nur relevant, wenn ein kostenpflichtiges Abo genutzt wird.
:::

```properties title="Beispiel"
FORECAST_SOLAR_APIKEY=abc123def456
```
