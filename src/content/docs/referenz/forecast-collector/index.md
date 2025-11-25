---
title: Was ist der Forecast-Collector?
sidebar:
  order: 1
  label: Übersicht
---

Der **Forecast-Collector** ermittelt den erwarteten Photovoltaik-Ertrag einer PV-Anlage über die Anbieter [Forecast.Solar](https://forecast.solar) oder [solcast.com](https://solcast.com) und schreibt diesen in die InfluxDB.

Die Ermittlung des Ertrags erfolgt auf Basis von Wetterdaten und der Anlagenkonfiguration. Folgende Parameter sind erforderlich:

- Standort der Anlage (Längen- und Breitengrad)
- Anzahl, Ausrichtung, Neigung und maximale Leistung (in kWp) der Dachflächen

Die beiden Anbieter arbeiten mit unterschiedlichen Modellen zur Prognose des Ertrags, die sich in der Genauigkeit der Vorhersage unterscheiden.

Zur Nutzung ist bei `solcast.com` eine (kostenfreie) Registrierung erforderlich, die Daten der Anlagen werden dann dort hinterlegt. Bei `Forecast.Solar` ist keine Registrierung erforderlich, die Daten werden direkt im Collector konfiguriert. Beide Anbieter bieten auch eine kostenpflichtige Variante an.

## Erfasste Messwerte

Der Collector schreibt die folgenden Messwerte als _Field_ in das angegebene _Measurement_ der InfluxDB:

| Field  | Beschreibung            |
| :----- | :---------------------- |
| `watt` | Erwarteter Ertrag, in W |

## Logging

Der Collector schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
Forecast collector for SOLECTRUS, Version 0.6.0, built at 2025-07-31T13:30:06.300Z
https://github.com/solectrus/forecast-collector
Copyright (c) 2020-2025 Georg Ledermann, released under the MIT License

Using Ruby 3.4.5 on platform aarch64-linux-musl
Pulling from api.forecast.solar every 3000 seconds
Pushing to InfluxDB at http://influxdb:8086, bucket solectrus, measurement forecast

Wait until InfluxDB is ready ... OK

#1 Fetching forecast at 2025-11-25T18:48:02+01:00
  0: https://api.forecast.solar/estimate/50.12345/6.12345/28/29/9.24?damping=0,0&time=seconds ... OK
  Pushing forecast to InfluxDB ... OK
  Sleeping for 3000 seconds (until 2025-11-25 19:38:03 +0100) ...
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
