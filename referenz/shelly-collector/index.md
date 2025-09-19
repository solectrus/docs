---
title: Shelly-Collector
layout: page
parent: Referenz
nav_order: 4
---

# Shelly-Collector

Der **Shelly-Collector** sammelt den Stromverbrauch, der von einem Shelly-Stromzähler gemessen wird und schreibt diesen in die InfluxDB.

Die Messwerte können entweder direkt vom Gerät (über die HTTP-Rest-API) oder über die Shelly-Cloud abgerufen werden. Letzteres ermöglicht es, den Shelly-Collector auch von außerhalb des lokalen Netzwerks zu betreiben, z.B. auf einem Cloud-Server.

Unterstützt werden Shelly-Geräte der ersten, zweiten und dritten Generation. Erfolgreich getestet wurden (mit der aktuellen Version 0.7.0 des Collectors) die folgenden Geräte:

- Shelly Pro 3EM
- Shelly Pro EM-50
- Shelly Pro 1PM
- Shelly Pro 4PM
- Shelly 3EM
- Shelly Plus Plug S
- Shelly PM Mini Gen3
- Shelly Plug S (Gen3)
- Shelly Plug 2
- Shelly EM

{:.note}

Wer den Collector mit einen nicht aufgeführten Shelly erfolgreich getestet hat, kann die Liste gerne ergänzen.

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
Shelly collector for SOLECTRUS, Version 0.6.0, built at 2025-03-11T09:47:38.489Z
https://github.com/solectrus/shelly-collector
Copyright (c) 2024-2025 Georg Ledermann, released under the MIT License

Using Ruby 3.4.2 on platform aarch64-linux-musl
Pushing to InfluxDB at http://influxdb:8086, bucket solectrus, measurement heatpump
Pulling from your Shelly at http://192.168.178.5 every 5 seconds

Got record #1 at 2025-03-11 10:53:00 +0100 within 37 ms, Power 5.1 W, Temperature 37.3 °C
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
