---
title: Konfiguration für pvnode
sidebar:
  order: 5
  label: Für pvnode
---

Diese Seite beschreibt die spezifischen Umgebungsvariablen für den Anbieter [pvnode](https://pvnode.com). Der Forecast-Collector unterstützt sowohl den kostenlosen als auch den kostenpflichtigen pvnode-Service. Es können bis zu 4 Dachflächen konfiguriert werden.

Zusätzlich zu den hier beschriebenen Variablen müssen die [allgemeinen Einstellungen](/referenz/forecast-collector/allgemeine-konfiguration/) konfiguriert werden.

## Zwei API-Varianten

Der Forecast-Collector kann pvnode auf zwei Arten ansprechen:

- **v1 (Plane-basiert)**: Standort und Dachflächen werden vollständig über die Umgebungsvariablen konfiguriert (`FORECAST_LATITUDE`, `FORECAST_LONGITUDE`, `FORECAST_DECLINATION`, `FORECAST_AZIMUTH`, `FORECAST_KWP` usw.). Dies ist das bisherige Verhalten.
- **v2 (Site-basiert)**: Der Standort und alle PV-Strings werden einmalig in der pvnode-Web-App als _Site_ angelegt. Der Collector referenziert diese Site nur noch über deren ID ([`PVNODE_SITE_ID`](#pvnode_site_id)). Die Geometrie liegt damit auf der Site, sodass die oben genannten Standort- und Dachflächen-Variablen sowie `PVNODE_EXTRA_PARAMS` **nicht mehr verwendet** werden.

:::caution[Noch nicht veröffentlicht]
Die v2-API über [`PVNODE_SITE_ID`](#pvnode_site_id) ist derzeit nur im `develop`-Branch des forecast-collector verfügbar und noch in keinem Release enthalten.
:::

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

# Optional: Site-ID aktiviert die pvnode-API v2 (nur in develop verfügbar)
# Ist sie gesetzt, werden Standort und Dachflächen aus der pvnode-Web-App
# verwendet; die obigen FORECAST_*- und PVNODE_EXTRA_PARAMS-Variablen entfallen.
# PVNODE_SITE_ID=site_xxxxxxxxxxxxxxxxxxxxxx

# Optional: Tarif des bezahlten pvnode-Accounts (Standard: kostenloser Tarif)
# PVNODE_PAID=true
# oder
# PVNODE_PAID=nowcast

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

#### PVNODE_SITE_ID

Aktiviert die pvnode-API **v2** (Site-basiert). Die _Site_ wird einmalig in der pvnode-Web-App angelegt – sie enthält den Standort und alle PV-Strings. Hier wird nur noch deren ID referenziert.

:::caution[Optional – nur in develop verfügbar]
Diese Variable ist derzeit nur im `develop`-Branch des forecast-collector verfügbar und noch in keinem Release enthalten.

Ist sie gesetzt, verwendet der Collector die v2-API. Die Geometrie liegt dann vollständig auf der Site, daher werden folgende Variablen **nicht mehr verwendet**:

- `FORECAST_LATITUDE`, `FORECAST_LONGITUDE`
- `FORECAST_DECLINATION`, `FORECAST_AZIMUTH`, `FORECAST_KWP` (bzw. deren `FORECAST_X_*`-Varianten)
- `PVNODE_EXTRA_PARAMS` (bzw. `PVNODE_X_EXTRA_PARAMS`)

Bleibt sie ungesetzt, nutzt der Collector weiterhin die v1-API (Konfiguration über die Dachflächen-Variablen).
:::

```properties title="Beispiel"
PVNODE_SITE_ID=site_xxxxxxxxxxxxxxxxxxxxxx
```

#### PVNODE_PAID

Wählt den pvnode-Tarif aus. Der Collector kann das nicht automatisch erkennen, daher muss der Tarif bei kostenpflichtigen Accounts explizit angegeben werden.

:::note[Optional]
Mögliche Werte:

- `false` – kostenloser Tarif
- `true` – kostenpflichtiger Basis-Tarif
- `nowcast` – kostenpflichtiger Nowcast-Tarif (verfügbar ab forecast-collector **v0.9.0**)

Standard: `false`

Der gewählte Wert muss zum aktiv abonnierten Tarif passen. Wird ein höherer Tarif angegeben als tatsächlich abonniert, kann es zu Fehlermeldungen kommen und/oder das monatliche Kontingent wird vorzeitig aufgebraucht, weil der Collector häufiger abfragt, als der abonnierte Tarif erlaubt.
:::

```properties title="Beispiel"
PVNODE_PAID=nowcast
```

Die Tarife unterscheiden sich wie folgt:

- **Kostenloser Tarif (`false`)**: bis zu 40 API-Anfragen pro Monat, 1-Tages-Vorhersage
- **Basis-Tarif (`true`)**: bis zu 1.000 API-Anfragen pro Monat, 7-Tages-Vorhersage, stündliche Slots
- **Nowcast-Tarif (`nowcast`)**: bis zu 3.000 API-Anfragen pro Monat, 7-Tages-Vorhersage, 10-Minuten-Updates während der Tageslichtstunden

### Abfrageintervall

Das Abfrageintervall (`FORECAST_INTERVAL`) muss bei pvnode **nicht konfiguriert werden**. Der Collector ermittelt automatisch die optimalen Abrufzeitpunkte basierend auf:

- den Update-Zeiten von pvnode (16-mal täglich zu festen Uhrzeiten bei Frei- und Basis-Tarif, zusätzlich alle 10 Minuten während der Tageslichtstunden beim Nowcast-Tarif)
- dem verfügbaren API-Kontingent (40 Anfragen/Monat kostenlos, 1.000 Anfragen/Monat im Basis-Tarif, 3.000 Anfragen/Monat im Nowcast-Tarif)
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

:::note[Optional – nur v1]
Wird nur bei der v1-API verwendet. Bei aktivierter v2-API ([`PVNODE_SITE_ID`](#pvnode_site_id)) ist dieser Parameter wirkungslos, da die Konfiguration auf der Site liegt.

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

:::note[Optional – nur v1]
Nur relevant bei mehreren Dachflächen mit unterschiedlichen Parametern. Bei aktivierter v2-API ([`PVNODE_SITE_ID`](#pvnode_site_id)) wirkungslos.
:::

```properties title="Beispiel"
PVNODE_0_EXTRA_PARAMS=diffuse_radiation_model=perez
PVNODE_1_EXTRA_PARAMS=snow_slide_coefficient=0.3
```
