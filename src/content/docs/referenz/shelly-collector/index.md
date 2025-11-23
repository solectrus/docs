---
title: Was ist der Shelly-Collector?
sidebar:
  order: 1
  label: Übersicht
---

Der **Shelly-Collector** sammelt den Stromverbrauch, der von einem Shelly-Stromzähler gemessen wird und schreibt diesen in die InfluxDB.

Die Messwerte können entweder direkt vom Gerät (über die HTTP-Rest-API) oder über die Shelly-Cloud abgerufen werden. Letzteres ermöglicht es, den Shelly-Collector auch von außerhalb des lokalen Netzwerks zu betreiben, z.B. auf einem Cloud-Server.

Unterstützt werden Shelly-Geräte der ersten, zweiten und dritten Generation. Erfolgreich getestet wurden die folgenden Geräte:

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

:::note
Wer den Collector mit einen nicht aufgeführten Shelly erfolgreich getestet hat, kann die Liste gerne ergänzen.
:::

## Erfasste Messwerte

Der Collector schreibt die folgenden Messwerte als _Field_ in das angegebene _Measurement_ der InfluxDB:

| Field               | Beschreibung             |
| :------------------ | :----------------------- |
| `power`             | Leistung, in W           |
| `power_a`           | Leistung Phase A, in W   |
| `power_b`           | Leistung Phase B, in W   |
| `power_c`           | Leistung Phase C, in W   |
| `temp`              | Temperatur, in °C        |
| `response_duration` | Dauer der Antwort, in ms |

:::note
Die Verfügbarkeit einzelner Messwerte hängt vom verwendeten Shelly-Gerät ab. Nicht alle Geräte liefern alle Messwerte.
:::

## Logging

Der Collector schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
Shelly collector for SOLECTRUS, Version 0.11.2, built at 2025-11-11T08:28:58.284Z
https://github.com/solectrus/shelly-collector
Copyright (c) 2024-2025 Georg Ledermann, released under the MIT License

Using Ruby 3.4.7 on platform aarch64-linux-musl
Pushing to InfluxDB at http://influxdb:8086, bucket solectrus, measurement heatpump
Wait until InfluxDB is ready ... OK

Pulling from your Shelly at http://192.168.178.83 every 19 seconds

Got record #1 at 2025-11-23 11:44:52 +0100 within 75 ms, Power 430.9 W, Temperature 46.2 °C
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
