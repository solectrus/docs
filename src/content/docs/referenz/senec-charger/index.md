---
title: Was ist der SENEC-Charger?
sidebar:
  order: 1
  label: Übersicht
---

Der **SENEC-Charger** steuert einen SENEC-Stromspeicher bei Verwendung eines dynamischen Stromtarifs (von [Tibber](https://tibber.com/de)) und belädt ihn aus dem Netz, wenn dies lohnenswert ist.

Damit der SENEC-Charger funktioniert, werden zwei weitere Collector benötigt:

- Der [Tibber-Collector](/referenz/tibber-collector/) sammelt die Strompreise von Tibber und schreibt sie in die InfluxDB.
- Der [Forecast-Collector](/referenz/forecast-collector/) sammelt die Wettervorhersage und schreibt sie ebenfalls in die InfluxDB.

:::note
Da für die Beladung des Speichers ein direkter Zugriff auf den SENEC-Stromspeicher notwendig ist, funktioniert dies leider nicht mit dem SENEC.Home P4 oder neuer. Es wird ausschließlich der SENEC.Home V2.1 und V3 unterstützt.
:::

## Funktionsweise

Der SENEC-Charger liest stündlich die Strompreise und Wettervorhersage aus der InfluxDB und entscheidet auf Basis dieser Daten, ob der Stromspeicher aus dem Netz beladen werden soll. Dabei werden folgende Faktoren berücksichtigt:

- Aktueller Ladestand des Stromspeichers
- Strompreis in den kommenden Stunden
- Erwartete Solarproduktion basierend auf der Wettervorhersage

## Logging

Der Charger schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
SENEC charger for SOLECTRUS, Version 0.7.0, built at 2025-09-26T13:44:58.476Z
https://github.com/solectrus/senec-charger
Copyright (c) 2023-2025 Georg Ledermann, released under the MIT License

Using Ruby 3.4.6 on platform aarch64-linux-musl
Connecting to SENEC at https://192.168.178.29
Connecting to InfluxDB at http://influxdb:8086, bucket solectrus, measurements prices and forecast

#1 - 2025-11-23 07:19:23 +0100
Grid power not cheap, nothing to do
Checked prices between Sunday, 07:15 - Monday, 00:45, ⌀ 1.06
Best 4-hour range: Sunday, 07:15 - Sunday, 09:00, ⌀ 0.75
Ratio best/average: 70.9 %
Sleeping for 3600 seconds ...
...
```

Jede Entscheidung wird protokolliert, sodass nachvollzogen werden kann, warum der Stromspeicher beladen oder nicht beladen wurde.

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs senec-charger
```

Bei Problemen oder Fehlern (z.B. wenn der Stromspeicher oder die InfluxDB nicht erreichbar ist) wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

## Quelltext

Der SENEC-Charger ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/senec-charger](https://github.com/solectrus/senec-charger)
