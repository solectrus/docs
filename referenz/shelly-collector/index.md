---
title: Shelly-Collector
layout: page
parent: Referenz
nav_order: 4
---

# Shelly-Collector

Der **Shelly-Collector** sammelt den Stromverbrauch, der von einem Shelly-Stromzähler gemessen wird und schreibt diesen in die InfluxDB.

Unterstützt werden Shelly-Geräte der ersten und zweiten Generation. Erfolgreich getestet wurden die folgenden Geräte:

- Shelly Pro 3EM
- Shelly Plus Plug S
- Shelly EM
- Shelly 3EM

{:.note}

Wer den Collector mit einen anderen Shelly erfolgreich getestet hat, kann die Liste gerne ergänzen.

## Überwachte Messwerte

Der Collector schreibt die folgenden Messwerte als _Field_ in das angegebene _Measurement_ der InfluxDB:

- `power`: Leistung, in Watt
- `power_a`: Leistung Phase A, in Watt (sofern vorhanden)
- `power_b`: Leistung Phase B, in Watt (sofern vorhanden)
- `power_c`: Leistung Phase C, in Watt (sofern vorhanden)
- `temp`: Temperatur, in °C (sofern vorhanden)
- `response_duration`: Dauer der Antwort, in ms

## Protokollierung

Der Collector schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
Shelly collector for SOLECTRUS, Version 0.4.0, built at 2024-10-01T23:55:03.133Z
https://github.com/solectrus/shelly-collector
Copyright (c) 2024 Georg Ledermann, released under the MIT License

Using Ruby 3.3.5 on platform x86_64-linux-musl
Pushing to InfluxDB at http://influxdb, bucket solectrus, measurement heatpump
Pulling from your Shelly (Gen2) at http://192.168.178.5/rpc/Shelly.GetStatus every 5 seconds

Got record #1 at 2024-10-02 10:00:33 +0200 within 37 ms, Power 5.1 W, Temperature 37.3 °C
Successfully pushed record #1 to InfluxDB
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs shelly-collector
```

Bei Problemen oder Fehlern (z.B. wenn der Shelly oder die InfluxDB nicht erreichbar ist) wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

## Quelltext

Der Shelly-Collector ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/shelly-collector](https://github.com/solectrus/shelly-collector)
