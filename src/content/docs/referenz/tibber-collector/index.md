---
title: Was ist der Tibber-Collector?
sidebar:
  order: 1
  label: Übersicht
---

Der **Tibber-Collector** fragt die Strompreise des Anbieters [Tibber](https://tibber.com/) über dessen API ab und schreibt sie in die InfluxDB.

Die erhaltenen Preise können für den [SENEC-Charger](/referenz/senec-charger/) verwendet werden, um einen SENEC-Stromspeicher kosten-optimiert aus dem Netz zu laden.

:::note
Zur Nutzung des Tibber-Collectors ist ein aktiver Vertrag bei Tibber erforderlich sowie ein API-Token, das kostenlos auf der Tibber-Website erstellt werden kann.

Die Preise werden von SOLECTRUS derzeit noch **nicht** verwendet, um die tatsächlichen Kosten durch den Netzbezug zu berechnen. Dies ist jedoch eine mögliche Erweiterung in der Zukunft.
:::

## Verarbeitete Werte

Der Collector schreibt die folgenden von der API erhaltenen Werte als _Field_ in das angegebene _Measurement_ der InfluxDB:

- `amount`: Strompreis, in Euro
- `level`: Preisstufe, in Textform (`NORMAL`, `CHEAP`, `VERY_CHEAP`, `EXPENSIVE`, `VERY_EXPENSIVE`)

## Logging

Der Collector schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
Tibber collector for SOLECTRUS, Version 0.4.1, built at 2025-11-11T09:37:33.776Z
https://github.com/solectrus/tibber-collector
Copyright (c) 2023-2025 Georg Ledermann, released under the MIT License

Using Ruby 3.4.7 on platform aarch64-linux-musl
Pulling from https://api.tibber.com/v1-beta/gql every 3600 seconds
Pushing to InfluxDB at http://influxdb:8086, bucket solectrus, measurement prices

#1 - 2025-11-23 06:01:18 +0100
  Fetching prices from Tibber ... OK
  Pushing prices to InfluxDB ... OK
  Sleeping for 3600 seconds ...
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs tibber-collector
```

Bei Problemen oder Fehlern (z.B. wenn die Tibber-API oder die InfluxDB nicht erreichbar ist) wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

## Quelltext

Der Tibber-Collector ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/tibber-collector](https://github.com/solectrus/tibber-collector)
