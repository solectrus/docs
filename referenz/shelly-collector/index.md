---
title: Shelly-Collector
layout: page
parent: Referenz
nav_order: 4
---

# Shell-Collector

Der **Shelly-Collector** sammelt den Stromverbrauch, der von einem Shelly-Stromzähler gemessen wird und schreibt diesen in die InfluxDB.

Unterstützt werden Shelly-Geräte der ersten und zweiten Generation. Erfolgreich getestet wurden die folgenden Geräte:

- Shelly Pro 3EM
- Shelly Plus Plug S
- Shelly EM
- Shelly 3EM

{:.note}

Wer einen anderen Shelly erfolgreich getestet hat, kann die Liste gerne ergänzen.

## Ausgabe

Der Collector schreibt die folgenden Messwerte als _Fields_ in das angegebene _Measurement_ der InfluxDB:

- `power` (Leistung, in Watt)
- `power_a` (Leistung Phase A, in Watt) [sofern vorhanden]
- `power_b` (Leistung Phase B, in Watt, [sofern vorhanden]
- `power_c` (Leistung Phase C, in Watt), [sofern vorhanden]
- `temp` (Temperatur, in °C) [sofern vorhanden]
- `response_duration` (Dauer der Antwort, in ms)

## Quelltext

Der Shelly-Collector wurde in Ruby implementiert. Der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/shelly-collector](https://github.com/solectrus/shelly-collector)
