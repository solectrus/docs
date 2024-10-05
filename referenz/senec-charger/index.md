---
title: SENEC-Charger
layout: page
parent: Referenz
nav_order: 8
---

# SENEC-Charger

Der **SENEC-Charger** ist ein Steuerungswerkzeug, das einen SENEC-Stromspeicher bei Verwendung eines dynamischen Stromtarifs (von [Tibber](https://tibber.com/de)) aus dem Netz belädt, wenn dies lohnenswert ist.

Damit der SENEC-Charger funktioniert, werden zwei weitere Container benötigt:

- Der [Tibber-Collector](/referenz/tibber-collector/) sammelt die Strompreise von Tibber und schreibt sie in die InfluxDB.
- Der [Forecast-Collector](/referenz/forecast-collector/) sammelt die Wettervorhersage und schreibt sie ebenfalls in die InfluxDB.

{: .note }

Da für die Beladung des Speichers ein direkter Zugriff auf den SENEC-Stromspeicher notwendig ist, funktioniert dies leider nicht mit dem Home 4 oder neuer. Es wird ausschließlich der SENEC V2.1 und V3 unterstützt.

## Protokollierung

Der SENEC-Charger schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
SENEC charger for SOLECTRUS, Version 0.4.5, built at 2024-08-30T10:32:56.142Z
https://github.com/solectrus/senec-charger
Copyright (c) 2023-2024 Georg Ledermann, released under the MIT License

Using Ruby 3.3.4 on platform aarch64-linux-musl
Connecting to SENEC at https://senec
Connecting to InfluxDB at http://influxdb:8086, bucket solectrus, measurements my-prices and my-forecast

#1 - 2024-10-05 16:48:10 +0200
Battery not empty, nothing to do
  Battery charge level: 75.8 %
Sleeping for 3600 seconds ...
...
```

Nützlich ist hier, dass jede Entscheidung, die der SENEC-Charger trifft, protokolliert wird. So kann nachvollzogen werden, warum der Stromspeicher beladen oder nicht beladen wurde.

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs senec-charger
```

Bei Problemen oder Fehlern (z.B. wenn der Stromspeicher oder die InfluxDB nicht erreichbar ist) wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

## Quelltext

Der SENEC-Charger ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/senec-charger](https://github.com/solectrus/senec-charger)
