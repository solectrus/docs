---
title: Umstellung auf pvnode
sidebar:
  hidden: true
---

Diese Anleitung beschreibt die Umstellung des Forecast-Collectors von einem anderen Anbieter (Forecast.Solar oder Solcast) auf **pvnode**.

## Schritt 1: Registrierung bei pvnode

1. Erstelle einen kostenlosen Account bei [pvnode.com](https://pvnode.com)
2. Nach der Anmeldung navigiere zu [API Keys](https://pvnode.com/api-keys)
3. Erstelle einen neuen API-Key und kopiere ihn

:::tip
Der kostenlose Account hat zwei Einschränkungen:

- Maximal 40 API-Anfragen pro Monat (reicht für eine Dachfläche bei täglichen Updates)
- Nur Prognose für den nächsten Tag

Der kostenpflichtige Account bietet 1.000 Anfragen pro Monat und Prognosen für bis zu 7 Tage.
:::

## Schritt 2: `.env` anpassen

#### Provider ändern

```properties title=".env"
# Alt:
# FORECAST_PROVIDER=forecast.solar

# Neu:
FORECAST_PROVIDER=pvnode
```

#### API-Key hinzufügen

```properties title=".env"
PVNODE_APIKEY=pvn_dein-api-key-hier
```

#### Azimuth-Werte anpassen

pvnode verwendet ein anderes Koordinatensystem für die Dachausrichtung: **Grad von Nord** (0-360) statt Grad von Süd (-180 bis 180). Die Werte müssen daher umgerechnet werden:

| Himmelsrichtung | Forecast.Solar | pvnode |
| --------------- | -------------: | -----: |
| Süd             |              0 |    180 |
| Ost             |            -90 |     90 |
| West            |             90 |    270 |
| Nord            |     180 / -180 |      0 |

**Formel:** `pvnode = (alter_wert + 180) mod 360`

```properties title=".env (Beispiel für zwei Dachflächen)"
# Alt (Forecast.Solar):
# FORECAST_0_AZIMUTH=10
# FORECAST_1_AZIMUTH=-90

# Neu (pvnode):
FORECAST_0_AZIMUTH=190
FORECAST_1_AZIMUTH=90
```

Der Forecast-Collector schreibt in ein eigenes InfluxDB-Measurement, standardmäßig heißt dieses `Forecast`. Eine Umstellung auf pvnode erfordert keine Anpassung der InfluxDB-Einstellungen, da die Daten im selben Measurement bleiben. Prüfe aber, ob bei dir ggfs. ein anderes Measurement in der `.env` eingetragen ist:

```properties title=".env"
INFLUX_MEASUREMENT_FORECAST=Forecast
```

Der Forecast-Collector schreibt die erhaltenen in Prognosen in folgende Fields von InfluxDB:

| Feldname        | Beschreibung                    |
| --------------- | ------------------------------- |
| `watt`          | Prognostizierte Leistung (Watt) |
| `watt_clearsky` | Clearsky-Prognose (Watt)        |
| `temp`          | Außentemperatur (°C)            |

#### Dashboard-Sensoren hinzufügen

Um die zusätzlichen Daten von **pvnode** im Dashboard anzuzeigen, müssen zwei neue Sensoren in der `.env` definiert werden:

```properties title=".env"
# Bereits vorhanden
INFLUX_SENSOR_INVERTER_POWER_FORECAST=Forecast:watt

# Neu hinzuzufügen
INFLUX_SENSOR_INVERTER_POWER_FORECAST_CLEARSKY=Forecast:watt_clearsky
INFLUX_SENSOR_OUTDOOR_TEMP_FORECAST=Forecast:temp
```

Wichtig: Achte auf die korrekte Groß-/Kleinschreibung des Measurements, hier `Forecast` - InfluxDB ist case-sensitive. Wenn der Collector z.b. nach `forecast` schreibt, das Dashboard aber `Forecast` abfragt, werden keine Daten angezeigt!

#### Optionale Einstellungen

```properties title=".env"
# Bei kostenpflichtigem Account:
# PVNODE_PAID=true

# Optionale zusätzliche Parameter:
# PVNODE_EXTRA_PARAMS=diffuse_radiation_model=perez
```

## Schritt 3: `compose.yaml` anpassen

Damit die neuen Variablen aus der `.env` auch in die Container übernommen werden, müssen sie in der `compose.yaml` eingetragen werden.

#### A. Beim `forecast-collector`

Beim `forecast-collector`-Service müssen die pvnode-spezifischen Variablen ergänzt werden:

```yaml title="compose.yaml (Auszug)"
services:
  forecast-collector:
    # ...
    environment:
      # ...
      - PVNODE_APIKEY # NEU
      - PVNODE_PAID # NEU
      - PVNODE_EXTRA_PARAMS # NEU
      - PVNODE_0_EXTRA_PARAMS # NEU
      - PVNODE_1_EXTRA_PARAMS # NEU
      - PVNODE_2_EXTRA_PARAMS # NEU
      - PVNODE_3_EXTRA_PARAMS # NEU
      # ...
```

#### B. Beim `dashboard`

Beim `dashboard`-Service müssen die neuen Sensor-Variablen ergänzt werden:

```yaml title="compose.yaml (Auszug)"
services:
  dashboard:
    # ...
    environment:
      # ...
      - INFLUX_SENSOR_INVERTER_POWER_FORECAST
      - INFLUX_SENSOR_INVERTER_POWER_FORECAST_CLEARSKY # NEU
      - INFLUX_SENSOR_OUTDOOR_TEMP_FORECAST # NEU
      # ...
```

:::note

Bei alten Installationen heißt der Service möglicherweise `app` statt `dashboard`. Das kann so bleiben, passe einfach dort die Umgebungsvariablen an.

:::

## Schritt 4: Neustart der Container

Nach dem Speichern der Dateien müssen die Container aktualisiert und neu gestartet werden:

```bash
docker compose pull
docker compose up -d
```

Prüfe anschließend das Protokoll des Forecast-Collectors:

```bash
docker compose logs -f forecast-collector
```

Bei erfolgreicher Konfiguration sollten nach kurzer Zeit die ersten Prognosen abgerufen werden und mit "OK" quittiert werden.

## Tipps

#### Koordinaten nicht ändern

pvnode speichert Standorte auf 5 Nachkommastellen genau. Bei einer Änderung wird ein neuer Standort angelegt, was im kostenlosen Tarif zur Fehlermeldung _"Site limit has been exceeded"_ führen kann.

Daraus folgt: Nach dem ersten Abruf dürfen `FORECAST_LATITUDE` und `FORECAST_LONGITUDE` für eine Weile **nicht mehr geändert** werden! Sorge also dafür, dass die Koordinaten bereits vor dem ersten Abruf korrekt und genau eingetragen sind.

#### Bereits verwendete Standorte einsehen

Im [pvnode Studio](https://www.pvnode.com/studio) kannst du unter "Standort auswählen" → "Bereits verwendeten Standort auswählen" deine gespeicherten Standorte einsehen.

#### Fehlerbehebung

Wenn der Forecast-Collector Daten erfolgreich abruft, diese aber nicht im Dashboard erscheinen:

1. Prüfe, ob die Sensor-Variablen in der `.env` korrekt definiert sind
2. Prüfe, ob die Variablen auch in der `compose.yaml` beim Dashboard-Service eingetragen sind
3. Achte auf die korrekte Groß-/Kleinschreibung des Measurements (InfluxDB ist case-sensitive)

## Weiterführende Links

- [pvnode Referenz-Dokumentation](/referenz/forecast-collector/konfiguration-pvnode/)
- [Allgemeine Forecast-Collector Konfiguration](/referenz/forecast-collector/allgemeine-konfiguration/)
- [Dashboard Sensor-Konfiguration](/referenz/dashboard/sensor-konfiguration/)
