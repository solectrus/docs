---
title: Konfiguration für pvnode
sidebar:
  order: 5
  label: Für pvnode
---

Diese Seite beschreibt die spezifischen Umgebungsvariablen für den Anbieter [pvnode](https://pvnode.com). Der Forecast-Collector unterstützt sowohl den kostenlosen als auch den kostenpflichtigen pvnode-Service. Es können bis zu 4 Dachflächen konfiguriert werden.

Zusätzlich zu den hier beschriebenen Variablen müssen die [allgemeinen Einstellungen](/referenz/forecast-collector/allgemeine-konfiguration/) konfiguriert werden.

## Vollständiges Beispiel

```properties title=".env"
# Anbieter
FORECAST_PROVIDER=pvnode

# Zeitzone
TZ=Europe/Berlin

# Standort
FORECAST_LATITUDE=50.12345
FORECAST_LONGITUDE=6.12345

# Anzahl der Dachflächen
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

# pvnode-Zugangsdaten
PVNODE_APIKEY=pvn_my-secret-api-key

# Optional: Kostenpflichtiger Account
# PVNODE_PAID=true

# Optional: Zusätzliche API-Parameter
# PVNODE_EXTRA_PARAMS=diffuse_radiation_model=perez

# Optional: Zusätzliche API-Parameter für einzelne Dachflächen
# PVNODE_0_EXTRA_PARAMS=snow_slide_coefficient=0.5
# PVNODE_1_EXTRA_PARAMS=snow_slide_coefficient=0.3

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

### Zugangsdaten

#### PVNODE_APIKEY

API-Key für die Nutzung von pvnode. Der Key muss zuvor bei pvnode erstellt werden: \
https://pvnode.com/api-keys

:::note[Pflicht]
Der API-Key identifiziert den Account und ist in jedem Fall erforderlich.
:::

```properties title="Beispiel"
PVNODE_APIKEY=pvn_my-secret-api-key
```

#### PVNODE_PAID

Aktiviert Funktionen für kostenpflichtige pvnode-Accounts.

:::note[Optional]
Diese Angabe ist bei Verwendung eines **kostenpflichtigen** Accounts nötig, da der Collector das nicht automatisch erkennen kann. Wenn bei einem kostenlosen Account hier dennoch `true` angegeben wird, kommt es bei der Abfrage zu Fehlermeldungen.

Standard: `false`
:::

```properties title="Beispiel"
PVNODE_PAID=true
```

Eine Aktivierung wirkt sich wie folgt aus:

- Nutzung von bis zu 1.000 API-Anfragen **pro Monat** (statt **40 pro Monat** bei kostenlosem Account)
- Abfrage von 7-Tage-Vorhersagen (statt 1 Tag bei kostenlosem Account)

### Abfrageintervall

Das Abfrageintervall (`FORECAST_INTERVAL`) muss bei pvnode **nicht konfiguriert werden**. Der Collector ermittelt automatisch die optimalen Abrufzeitpunkte basierend auf:

- den festen Update-Zeiten von pvnode (16-mal täglich zu festen Uhrzeiten)
- dem verfügbaren API-Kontingent (40 Anfragen/Monat kostenlos, 1.000 Anfragen/Monat bei kostenpflichtigem Account)
- der Anzahl der konfigurierten Dachflächen
- den konfigurierten zusätzlichen Parametern (`PVNODE_EXTRA_PARAMS`)

Der Forecast-Collector minimiert die Anzahl der Anfragen, indem er gleiche Parameter für mehrere Dachflächen zusammenfasst und nach Möglichkeit mit einer Abfrage zwei Dachflächen abdeckt. Falls notwendig, werden einzelne Slots oder auch ganze Tage übersprungen, um das monatliche Kontingent nicht zu überschreiten.

### Standort

pvnode arbeitet mit einem monatlichen **Standort-Limit** (Site-Limit). Im kostenlosen Tarif ist **ein Standort** enthalten. Standorte werden bei pvnode automatisch gespeichert, sobald eine Abfrage mit Koordinaten an die API gesendet wird.

:::caution[Vorsicht bei der Angabe der Koordinaten]
pvnode speichert Standorte auf 5 Nachkommastellen genau. Bei nachfolgenden Abfragen müssen **exakt dieselben Koordinaten** verwendet werden, damit pvnode die Abfrage dem richtigen Standort zuordnen kann.

Ein Ändern der Koordinaten (z.B. wegen eines Tippfehlers) führt dazu, dass ein neuer Standort angelegt wird. Im kostenlosen Tarif wird dann die Fehlermeldung _"Site limit has been exceeded"_ zurückgegeben.

Die bereits verwendeten Standorte können im [pvnode Studio](https://www.pvnode.com/studio) eingesehen werden (Klick auf die Karte oder "Standort auswählen" → "Bereits verwendeten Standort auswählen"). Die Standorte werden monatlich zurückgesetzt.
:::

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

Ausrichtung des Dachs in Grad von Nord.

:::note[Pflicht bei einzelner Dachfläche]
Wertebereich: 0 (Nord) ... 360, wobei 90 = Ost, 180 = Süd und 270 = West

Zu beachten ist, dass die Ausrichtung bei pvnode anders angegeben wird als bei den anderen Anbietern: pvnode verwendet Grad von Nord (0-360), während Forecast.Solar und Solcast Grad von Süd (-180 bis 180) verwenden.
:::

```properties title="Beispiel"
FORECAST_AZIMUTH=207
```

#### FORECAST_KWP

Maximale Leistung der PV-Anlage in kWp.

:::note[Pflicht bei einzelner Dachfläche]
:::

```properties title="Beispiel"
FORECAST_KWP=9.24
```

#### PVNODE_EXTRA_PARAMS

Zusätzliche Query-Parameter für die pvnode-API. Diese werden an alle Dachflächen-Abfragen angehängt.

:::note[Optional]
Format: `key1=value1&key2=value2` (ohne führendes `?` oder `&`)

Informationen zu den verfügbaren Parametern finden sich in der pvnode-Dokumentation: \
https://www.pvnode.com/docs/de/forecast#optional-parameters

:::

```properties title="Beispiel"
PVNODE_EXTRA_PARAMS=diffuse_radiation_model=perez&snow_slide_coefficient=0.5
```

### Mehrere Dachflächen

Bei mehreren Dachflächen muss zunächst die Anzahl festgelegt werden. Anschließend werden die Variablen für jede Dachfläche gesetzt, wobei `X` für die Nummer der Dachfläche steht (0, 1, 2, 3).

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

Ausrichtung der jeweiligen Dachfläche in Grad von Nord.

:::note[Pflicht bei mehreren Dachflächen]
Wertebereich: 0 (Nord) ... 360, wobei 180 = Süd und 270 = West
:::

```properties title="Beispiel"
FORECAST_0_AZIMUTH=180
FORECAST_1_AZIMUTH=270
```

#### FORECAST_X_KWP

Maximale Leistung der Module auf der jeweiligen Dachfläche in kWp.

:::note[Pflicht bei mehreren Dachflächen]
:::

```properties title="Beispiel"
FORECAST_0_KWP=3.9
FORECAST_1_KWP=5.5
```

#### PVNODE_X_EXTRA_PARAMS

Zusätzliche Query-Parameter für eine bestimmte Dachfläche. Diese überschreiben `PVNODE_EXTRA_PARAMS` für die jeweilige Dachfläche.

:::note[Optional]
Nur relevant bei mehreren Dachflächen mit unterschiedlichen Parametern.
:::

```properties title="Beispiel"
PVNODE_0_EXTRA_PARAMS=diffuse_radiation_model=perez
PVNODE_1_EXTRA_PARAMS=snow_slide_coefficient=0.3
```
