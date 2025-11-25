---
title: Konfiguration für Solcast
sidebar:
  order: 4
  label: Für Solcast
---

Diese Seite beschreibt die spezifischen Umgebungsvariablen für den Anbieter [Solcast](https://solcast.com). Diese beschränken sich auf die Angabe der API-Zugangsdaten und der Standort-IDs, da bei Solcast Standort- und Anlagendaten direkt im Solcast-Portal hinterlegt werden, nicht in der SOLECTRUS-Konfiguration.

Zusätzlich zu den hier beschriebenen Variablen müssen die [allgemeinen Einstellungen](/referenz/forecast-collector/allgemeine-konfiguration/) konfiguriert werden.

## API-Zugang

#### SOLCAST_APIKEY

API-Key für die Nutzung von Solcast. Der Key kann im Solcast-Dashboard unter _Your API key_ abgerufen werden.

:::note[Pflicht]
:::

```properties title="Beispiel"
SOLCAST_APIKEY=my-solcast-api-key
```

## Abfrageintervall

#### FORECAST_INTERVAL

Intervall in Sekunden, in dem die Ertragsprognose abgerufen wird.

:::note[Pflicht]
Bei der kostenlosen Variante sind max. 10 Abfragen pro Tag erlaubt, also mindestens 8640 Sekunden.
:::

```properties title="Beispiel"
FORECAST_INTERVAL=10800
```

## Einzelner Standort

Bei einem einzelnen Standort wird die folgende Variable verwendet:

#### SOLCAST_SITE

ID des Standorts bei Solcast.

:::note[Pflicht bei einzelnem Standort]
Format: `xxxx-xxxx-xxxx-xxxx`
:::

```properties title="Beispiel"
SOLCAST_SITE=1234-5678-9012-3123
```

## Mehrere Standorte

Bei mehreren Standorten muss zunächst die Anzahl festgelegt werden. Anschließend wird die Variable für jeden Standort gesetzt, wobei `X` für die Nummer des Standorts steht (0, 1, ...).

#### FORECAST_CONFIGURATIONS

Anzahl der konfigurierten Standorte.

:::note[Pflicht bei mehreren Standorten]
Maximal 2 Konfigurationen werden unterstützt.
:::

```properties title="Beispiel"
FORECAST_CONFIGURATIONS=2
```

#### SOLCAST_X_SITE

ID des jeweiligen Standorts bei Solcast.

:::note[Pflicht bei mehreren Standorten]
Format: `xxxx-xxxx-xxxx-xxxx`
:::

```properties title="Beispiel"
SOLCAST_0_SITE=1234-5678-9012-3123
SOLCAST_1_SITE=1231-2334-3453-4534
```
