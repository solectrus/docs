---
title: Was ist der Forecast-Collector?
sidebar:
  order: 1
  label: Übersicht
---

Der **Forecast-Collector** ermittelt den erwarteten Photovoltaik-Ertrag einer PV-Anlage über die Anbieter [forecast.solar](https://forecast.solar) oder [solcast.com](https://solcast.com) und schreibt diesen in die InfluxDB.

Die Ermittlung des Ertrags erfolgt auf Basis von Wetterdaten und der Anlagenkonfiguration. Folgende Parameter sind erforderlich:

- Standort der Anlage (Längen- und Breitengrad)
- Anzahl, Ausrichtung, Neigung und maximale Leistung (in kWp) der Dachflächen

Die beiden Anbieter arbeiten mit unterschiedlichen Modellen zur Prognose des Ertrags, die sich in der Genauigkeit der Vorhersage unterscheiden.

Zur Nutzung ist bei `solcast.com` eine (kostenfreie) Registrierung erforderlich, die Daten der Anlagen werden dann dort hinterlegt. Bei `forecast.solar` ist keine Registrierung erforderlich, die Daten werden direkt im Collector konfiguriert. Beide Anbieter bieten auch eine kostenpflichtige Variante an.

## Ermittelte Werte

Der Collector schreibt die folgenden Werte als _Field_ in das angegebene _Measurement_ der InfluxDB:

- `watt`: Erwarteter Ertrag, in Watt

## Protokollierung

Der Collector schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
Forecast collector for SOLECTRUS, Version 0.5.3, built at 2024-08-30T23:27:59.224Z
https://github.com/solectrus/forecast-collector
Copyright (c) 2020-2024 Georg Ledermann, released under the MIT License

Using Ruby 3.3.5 on platform x86_64-linux-musl
Pulling from api.solcast.com.au every 1800 seconds
Pushing to InfluxDB at http://influxdb:8086, bucket SENEC, measurement Forecast

#1 Fetching forecast at 2024-10-02T06:53:49+02:00
  0: https://api.solcast.com.au/rooftop_sites/1234-4567-89012-3456/forecasts?format=json&api_key=xxxx ... OK
  Pushing forecast to InfluxDB ... OK
  Sleeping for 1800 seconds (until 2024-10-02 07:23:51 +0200) ...
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs forecast-collector
```

Bei Problemen oder Fehlern (z.B. wenn der Anbieter erreichbar ist oder der API-Key nicht akzeptiert wird) wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

## Quelltext

Der Forecast-Collector ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/forecast-collector](https://github.com/solectrus/forecast-collector)
