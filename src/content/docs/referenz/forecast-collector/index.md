---
title: Was ist der Forecast-Collector?
sidebar:
  order: 1
  label: Übersicht
---

Der **Forecast-Collector** ermittelt den erwarteten Photovoltaik-Ertrag einer PV-Anlage über die Anbieter [Forecast.Solar](https://forecast.solar), [Solcast](https://solcast.com) oder [pvnode](https://pvnode.com) und schreibt diesen in die InfluxDB.

Die Ermittlung des Ertrags erfolgt auf Basis von Wetterdaten und der Anlagenkonfiguration. Folgende Parameter sind erforderlich:

- Standort der Anlage (Längen- und Breitengrad)
- Anzahl, Ausrichtung, Neigung und maximale Leistung (in kWp) der Dachflächen

Die drei Anbieter arbeiten mit unterschiedlichen Modellen zur Prognose des Ertrags, die sich in der Genauigkeit stark unterscheiden können.

Zur Nutzung ist bei Solcast und pvnode eine (kostenfreie) Registrierung erforderlich. Bei Solcast werden die Daten der Anlagen im Solcast-Portal hinterlegt, bei pvnode und Forecast.Solar werden sie direkt im Collector konfiguriert. Alle drei Anbieter bieten auch eine kostenpflichtige Variante an.

## Erfasste Messwerte

Der Collector schreibt die folgenden Messwerte als _Field_ in das angegebene _Measurement_ der InfluxDB:

| Field           | Beschreibung                                   | Anbieter   |
| :-------------- | :--------------------------------------------- | :--------- |
| `watt`          | Erwarteter Ertrag, in W                        | Alle       |
| `watt_clearsky` | Erwarteter Ertrag bei wolkenlosem Himmel, in W | nur pvnode |
| `temp`          | Temperatur, in °C                              | nur pvnode |
| `weather_code`  | Wettercode (WMO-Standard)                      | nur pvnode |

## Logging

Der Collector schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
Forecast collector for SOLECTRUS, Version 0.7.0, built at 2025-11-26T16:38:00.589Z
https://github.com/solectrus/forecast-collector
Copyright (c) 2020-2025 Georg Ledermann, released under the MIT License

Using Ruby 3.4.7 on platform aarch64-linux-musl
Pulling from pvnode every 3000 seconds
Pushing to InfluxDB at http://influxdb:8086, bucket solectrus, measurement forecast

Wait until InfluxDB is ready ... OK

#1 Fetching forecast at 2025-11-26T17:39:05+01:00
  0: https://api.pvnode.com/v1/forecast/?latitude=50.12345&longitude=6.12345&slope=28&orientation=209&pv_power_kw=9.24&required_data=pv_watts%2Ctemp%2Cweather_code&clearsky_data=true&past_days=0&forecast_days=1 ... OK
  Pushing forecast to InfluxDB ... OK
  Sleeping until 2025-11-27 02:05:00 +0100 ...
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs forecast-collector
```

Bei Problemen oder Fehlern (z.B. wenn der Anbieter nicht erreichbar ist oder der API-Key nicht akzeptiert wird) wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

## Quelltext

Der Forecast-Collector ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/forecast-collector](https://github.com/solectrus/forecast-collector)
