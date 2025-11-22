---
title: Was ist der Power-Splitter?
sidebar:
  order: 1
  label: Übersicht
---

Der Power-Splitter analysiert den Stromverbrauch der Verbraucher (E-Auto, Wärmepumpe, Haus und selbstdefinierte Verbraucher). Der Verbrauch wird aufgeteilt in den Anteil, der mit Photovoltaik-Strom gedeckt wird und den Anteil, der aus dem Netz bezogen wird. Daraus ergeben sich interessante Einblicke in die Verbrauchskosten, die sonst so nicht möglich waren.

:::note
Zur Darstellung der Berechnungen des Power-Splitters in SOLECTRUS ist ein [Sponsoring-Abo](https://solectrus.de/sponsoring/) erforderlich.
:::

Zunächst ein paar wichtige Hinweise:

- Die Berechnung erfolgt für sämtliche Verbrauchswerte, die in der InfluxDB vorhanden sind. Das bedeutet, dass nicht nur zukünftige Messwerte, sondern **auch die Messwerte der Vergangenheit** berücksichtigt werden.

- Für die Berechnung kommt ein zusätzlicher Docker-Container (der eigentliche Power-Splitter) zum Einsatz. Dieser läuft dauerhaft im Hintergrund, berechnet die Aufteilung und schreibt sie in ein neues Measurement der InfluxDB.

- Der Power-Splitter ergibt nur Sinn, wenn man neben dem Hausverbrauch weitere Verbraucher überwacht - z.B. ein E-Auto, eine Wärmepumpe oder Selbstdefinierte Verbraucher. Wer dies **nicht** hat, für den ist es uninteressant, weil es dann nichts aufzuteilen gibt. Die von SOLECTRUS bereits berechnete Autarkie stellt in diesem Fall die Situation bereits dar.

## Berechnete Werte

Der Power-Splitter schreibt die folgenden Werte als _Field_ in das Measurement `power_splitter` der InfluxDB:

- `wallbox_power_grid`: Netzbezug der Wallbox, in Watt
- `house_power_grid`: Netzbezug des Hauses, in Watt
- `heatpump_power_grid`: Netzbezug der Wärmepumpe, in Watt
- `custom_power_XX_grid`: Netzbezug eines benutzerdefinierten Verbrauchers (`XX` von 01 bis 20), in Watt
- `battery_charging_power_grid`: Netzbezug der Batterie, in Watt

Beim Start prüft der Power-Splitter zunächst, ob Messwerte aus der Vergangenheit vorliegen, für die noch kein Split erfolgt ist. Dies wird dann nachgeholt, beginnend beim ältesten noch nicht bearbeiteten Tag. Dies kann einige Zeit in Anspruch nehmen, je nachdem, wie viele Daten nachzuarbeiten sind. Etwa 30min sind hierbei nicht ungewöhnlich.

Anschließend erfolgt die Berechnung für den aktuellen Tag. Der Power-Splitter läuft dann im Endlosmodus und berechnet den aktuellen Tag in einem vorgegebenen Intervall (standardmäßig 1 Stunde) permanent neu, um hinzugekommene Messwerte zu berücksichtigen. Um Mitternacht wird der Tag abgeschlossen und der nächste Tag begonnen.

## Neuberechnung erzwingen

In seltenen Fällen kann es erforderlich sein, die berechneten Werte zu löschen und neu zu berechnen. Eine denkbare Situation ist z.B. ein nachträglicher Datenimport von Messwerten.

Wenn der Power-Splitter läuft, kann eine Neuberechnung mit folgendem Befehl ausgelöst werden:

```bash
docker compose kill --signal USR1 power-splitter
```

Dieser "Kill-Befehl" ist dabei nicht so drastisch, wie er sich anhört. Es wird nur ein benutzerdefiniertes Signal (`USR1`) an den Container geschickt, der darauf reagiert, ohne sich zu beenden. Der Status der Neuberechnung kann im Protokoll des Power-Splitters mitverfolgt werden. Nach dem Neuberechnung wechselt der Container wieder in den Endlosmodus und bearbeitet die aktuellen Messwerte, die hereinkommen.

:::caution
Seit Version `v0.18` von SOLECTRUS gibt es "Tageszusammenfassungen", die auch die Werte des Power-Splitters enthalten. Nach einer Neuberechnung des Power-Splitters müssen daher die Tageszusammenfassungen in SOLECTRUS zurückgesetzt werden. Hierzu ist in der SOLECTRUS-Oberfläche unter _Einstellungen_ der entsprechende Button zu betätigen.
:::

## Protokollierung

Der Power-Splitter schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
Power Splitter for SOLECTRUS, Version 0.7.0, built at 2025-09-27 10:30:07 +0200
Using Ruby 3.4.6 on platform aarch64-linux-musl
Copyright (c) 2024-2025 Georg Ledermann <georg@ledermann.dev>
https://github.com/solectrus/power-splitter

Accessing InfluxDB at http://influxdb:8086, bucket solectrus
Sensor initialization started
  - Sensor 'grid_import_power' mapped to 'SENEC:grid_power_plus'
  - Sensor 'house_power' mapped to 'SENEC:house_power'
  - Sensor 'heatpump_power' mapped to 'Consumer:power'
  - Sensor 'wallbox_power' mapped to 'SENEC:wallbox_charge_power'
  - Sensor 'battery_charging_power' mapped to 'SENEC:bat_power_plus'
  - Sensor 'custom_power_01' mapped to 'Washer:power'
  - Sensor 'custom_power_02' mapped to 'Fridge:power'
  - Sensor 'custom_power_03' mapped to 'KabelFritz:power'
  - Sensor 'custom_power_04' mapped to 'Synology:power'
  - Sensor 'custom_power_05' mapped to 'iMac:power'
  - Sensor 'custom_power_06' mapped to 'Dishwasher:power'
  - Sensor 'house_power' excluded 'heatpump_power'
Sensor initialization completed

Starting endless loop for processing current data...

2025-05-27 10:07:34 +0200 - Processing day 2025-05-27
  Pushing 121 records to InfluxDB
  Sleeping for 3600 seconds...
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs power-splitter
```

Bei Problemen oder Fehlern (z.B. wenn die InfluxDB nicht erreichbar ist) wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

## Quelltext

Der Power-Splitter ist in Ruby implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/power-splitter](https://github.com/solectrus/power-splitter)
