---
title: SENEC-Collector
layout: page
parent: Referenz
nav_order: 2
---

Der **SENEC-Collector** sammelt die Messwerte, die von einem SENEC Stromspeicher gemeldet werden und schreibt diese in die InfluxDB.

Erfolgreich getestet wurde der Collector mit folgenden Stromspeichern:

- SENEC.Home V2.1
- SENEC.Home V3
- SENEC.Home P4

{:.note}

Wer den Collector mit einen anderen SENEC-Stromspeicher erfolgreich getestet hat, kann die Liste gerne ergänzen.

## Betriebsmodi

Grundsätzlich kann der Collector in zwei verschiedenen **Betriebsmodi** eingesetzt werden:

- **Lokal:** Direkter Zugriff auf den SENEC-Stromspeicher über dessen lokale IP-Adresse. Die Daten werden über die `lala.cgi`-Schnittstelle ausgelesen. Möglich ist das beim V2.1 und V3, nicht aber beim Home P4, denn dieser hat keine lokale Schnittstelle. Ein Auslesen der Messwerte ist in einem kurzen Intervall möglich, standardmäßig sind es 5 Sekunden.

- **Cloud:** Abholen der Messwerte aus der SENEC-Cloud aus unter Verwendung der Schnittstelle, die von SENEC für die Mobil-Apps bereitgestellt wird. Für den Zugriff sind SENEC-Zugangsdaten anzugeben (E-Mail und Passwort). Möglich ist das auch für den Home P4. Das Auslesen der Messwerte ist nur einem einem längeren Intervall erlaubt, das vom Gerät abhängt. Beim Home P4 ist eine Abfrage im 1-Minuten-Takt möglich, beim V2.1 und V3 im 5-Minuten-Takt.

### Vergleich der Betriebsmodi

|                 | Lokal     | Cloud     |
| :-------------- | :-------- | :-------- |
| SENEC.Home V2.1 | Ja (5sec) | Ja (5min) |
| SENEC.Home V3   | Ja (5sec) | Ja (5min) |
| SENEC.Home P4   | Nein      | Ja (1min) |

Beim V2.1 und V3 ist es also möglich, sich für einen der beiden Adapter zu entscheiden. Dies eröffnet die Möglichkeit, SOLECTRUS vollständig auf einem Cloud-Server zu betreiben, also ohne einen Raspberry o.ä. im lokalen Netzwerk. Diesem Vorteil steht der Nachteil gegenüber, dass die Daten nicht so häufig aktualisiert werden (nur alle 5 Minuten, statt alle 5 Sekunden).

## Überwachte Messwerte

Der Collector schreibt die folgenden Messwerte als _Field_ in das angegebene _Measurement_ der InfluxDB. Einige Messwerte sind nur im lokalen Betrieb verfügbar.

- `application_version`: Version der Firmware
- `bat_charge_current`: Batterie-Ladestrom, in A
- `bat_fuel_charge`: Batterie-Ladestand, in %
- `bat_power_minus`: Batterie-Entladeleistung, in W
- `bat_power_plus`: Batterie-Ladeleistung, in W
- `bat_voltage`: Batterie-Spannung, in V
- `case_temp`: Gehäuse-Temperatur, in °C
- `current_state_code`: Aktueller Betriebszustand, als Zahl (nur Lokal)
- `current_state_ok`: Aktueller Betriebszustand gilt als OK, Ja/Nein
- `current_state`: Aktueller Betriebszustand, als Text
- `ev_connected`: Elektroauto verbunden, Ja/Nein
- `grid_power_minus`: Netzeinspeisung, in W
- `grid_power_plus`: Netzbezug, in W
- `house_power`: Hausverbrauch, in W
- `inverter_power`: Erzeugte Leistung des Wechselrichters, in W
- `mpp1_power`: Leistung des MPP1, in W (nur Lokal)
- `mpp2_power`: Leistung des MPP2, in W (nur Lokal)
- `mpp3_power`: Leistung des MPP3, in W (nur Lokal)
- `power_ratio`: Leistungsbegrenzung, in % (nur Lokal)
- `response_duration`: Dauer der Antwort, in ms (nur Lokal)
- `wallbox_charge_power`: Wallbox-Ladeleistung, in W
- `wallbox_charge_power0`: Wallbox-Ladeleistung für erste Wallbox, in W (nur Lokal)
- `wallbox_charge_power1`: Wallbox-Ladeleistung für zweite Wallbox, in W (nur Lokal)
- `wallbox_charge_power2`: Wallbox-Ladeleistung für dritte Wallbox, in W (nur Lokal)
- `wallbox_charge_power3`: Wallbox-Ladeleistung für vierte Wallbox, in W (nur Lokal)

## Protokollierung

Der Collector schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
SENEC collector for SOLECTRUS, Version 0.16.1, built at 2024-09-03T04:48:19.640Z
https://github.com/solectrus/senec-collector
Copyright (c) 2020-2024 Georg Ledermann, released under the MIT License

Using Ruby 3.3.4 on platform aarch64-linux-musl
Pushing to InfluxDB at http://influxdb:8086, bucket solectrus, measurement SENEC
Pulling from your local SENEC at https://192.168.178.29 every 5 seconds

Getting state names (language: de) from SENEC by parsing source code...
OK, got 99 state names

Got record #1 at 2024-10-02 10:00:42 +0200 within 7 ms, LADEN, Inverter 766 W, House 413 W, Wallbox 0 W
Successfully pushed record #1 to InfluxDB
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs senec-collector
```

Bei Problemen oder Fehlern (z.B. wenn der Stromspeicher oder die InfluxDB nicht erreichbar ist) wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

## Quelltext

Der SENEC-Collector ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/senec-collector](https://github.com/solectrus/senec-collector)
