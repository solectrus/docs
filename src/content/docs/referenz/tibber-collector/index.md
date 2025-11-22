---
title: Was ist der Tibber-Collector?
sidebar:
  order: 1
  label: Übersicht
---

Der **Tibber-Collector** fragt die Strompreise des Anbieters über dessen API ab und schreibt sie in die InfluxDB.

Die erhaltenen Preise könnnen für den [SENEC-Charger](/referenz/senec-charger/) verwendet werden, um einen SENEC-Stromspeicher kostenoptimiert aus dem Netz zu laden.

:::note
Die Preise werden von SOLECTRUS derzeitig noch **nicht** verwendet, um die tatsächlichen Kosten durch den Netzbezug zu berechnen. Dies ist jedoch eine mögliche Erweiterung in der Zukunft.
:::

## Überwachte Werte

Der Collector schreibt die folgenden Werte als _Field_ in das angegebene _Measurement_ der InfluxDB:

- `amount`: Strompreis, in Euro
- `level`: Preisstufe, in Textform (`NORMAL`, `CHEAP`, `VERY_CHEAP`, `EXPENSIVE`, `VERY_EXPENSIVE`)

## Protokollierung

Der Collector schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
Tibber collector for SOLECTRUS, Version 0.2.7, built at 2024-08-30T10:31:40.483Z
https://github.com/solectrus/tibber-collector
Copyright (c) 2023-2024 Georg Ledermann, released under the MIT License

Using Ruby 3.3.4 on platform aarch64-linux-musl
Pulling from https://api.tibber.com/v1-beta/gql every 10 seconds
Pushing to InfluxDB at http://influxdb:8086, bucket solectrus, measurement my-prices

#1 - 2024-10-05 16:25:10 +0200
  Fetching prices from Tibber ... OK
  Pushing prices to InfluxDB ... OK
  Sleeping for 10 seconds ...
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
