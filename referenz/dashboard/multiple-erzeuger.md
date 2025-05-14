---
title: Multiple Erzeuger
layout: page
parent: Dashboard
nav_order: 2
---

# Multiple Erzeuger

SOLECTRUS kann ab Version `0.20` mit mehreren Erzeugern umgehen. Das ist dann nützlich, wenn man beispielsweise ein **Balkonkraftwerk** ("Steckersolar") oder mehrere Flächen mit PV-Modulen betreibt.

Man kann bis zu fünf verschiedene Erzeuger konfigurieren, deren Messwerte getrennt voneinander sowie in Summe verwaltet werden. Dies können verschiedene Dachseiten sein (Südseite, Ost-Seite, etc.), zusätzliche PV-Module auf Nebengebäuden oder eben auch ein Balkonkraftwerk.

Es gibt dafür insgesamt sechs Variablen:

```
INFLUX_SENSOR_INVERTER_POWER
INFLUX_SENSOR_INVERTER_POWER_1
INFLUX_SENSOR_INVERTER_POWER_2
INFLUX_SENSOR_INVERTER_POWER_3
INFLUX_SENSOR_INVERTER_POWER_4
INFLUX_SENSOR_INVERTER_POWER_5
```

## Szenarien

Damit sind verschiedene Szenarien möglich, die hier beispielhaft aufgeführt werden.

{: .important}

Bevor das Dashboard die verschiedenen Erzeuger korrekt darstellen kann, müssen die Messwerte in InfluxDB auch tatsächlich vorhanden sein. Das bedeutet, dass zuvor z.B. mit dem [MQTT-Collector](/referenz/mqtt-collector/) die Messwerte nach InfluxDB geschrieben werden müssen.
\
\
Im Fall des [SENEC-Collectors](/referenz/senec-collector/) gibt es eine Ausnahme: Wenn dieser die Messwerte direkt beim Speicher abholt (also nicht über die SENEC-Cloud), dann landen die Messwerte der drei Strings automatisch in InfluxDB - benannt als `mpp1_power`, `mpp2_power` und `mpp3_power`.

{: .note}

In den folgenden Konfigurationsbeispielen werden Begriffe wie `my-pv`, `east` oder `balcony` verwendet. Das sind nur Beispiele. Bitte verwende stattdessen die Measurement und Fields, die auch tatsächlich bei dir in InfluxDB vorhanden sind.

### 1. Einzelnes Dach ohne Differenzierung

Man gibt nur die Gesamterzeugung an. Die einzelnen Teile bleiben hingegen leer. Das entspricht der Konfiguration, wie sie bis Version `0.19.0` ausschließlich möglich war.

Beispiel:

```env
INFLUX_SENSOR_INVERTER_POWER=my-pv:inverter_power
INFLUX_SENSOR_INVERTER_POWER_1=
INFLUX_SENSOR_INVERTER_POWER_2=
INFLUX_SENSOR_INVERTER_POWER_3=
INFLUX_SENSOR_INVERTER_POWER_4=
INFLUX_SENSOR_INVERTER_POWER_5=
```

### 2. Mehrere Flächen mit PV-Modulen

Man gibt einen Sensor für jede Fläche an. Falls man die Erzeugung der einzelnen Flächen nicht von Anfang an gemessen hat, gibt man zusätzlich die Summe an, sodass für die Anfangszeiten zumindest die Gesamterzeugung vorhanden ist.

Beispiel:

```env
INFLUX_SENSOR_INVERTER_POWER=my-pv:inverter_power
INFLUX_SENSOR_INVERTER_POWER_1=my-pv:east
INFLUX_SENSOR_INVERTER_POWER_2=my-pv:west
INFLUX_SENSOR_INVERTER_POWER_3=my-pv:south
INFLUX_SENSOR_INVERTER_POWER_4=
INFLUX_SENSOR_INVERTER_POWER_5=
```

Weiteres Beispiel bei Verwendung eines SENEC-Stromspeichers:

```env
INFLUX_SENSOR_INVERTER_POWER=SENEC:inverter_power
INFLUX_SENSOR_INVERTER_POWER_1=SENEC:mpp1_power
INFLUX_SENSOR_INVERTER_POWER_2=SENEC:mpp2_power
INFLUX_SENSOR_INVERTER_POWER_3=SENEC:mpp3_power
INFLUX_SENSOR_INVERTER_POWER_4=
INFLUX_SENSOR_INVERTER_POWER_5=
```

### 3. Ein Dach (ohne Differenzierung) und zusätzlich ein Balkonkraftwerk

Man definiert das Dach sowie das BKW als einzelne Sensoren. Die Summe gibt man NICHT an, weil man diese höchstwahrscheinlich gar nicht als einzelne Messgröße hat. Durch das Freilassen der Summe wird sie automatisch aus den Teilen berechnet.

Beispiel:

```env
INFLUX_SENSOR_INVERTER_POWER=
INFLUX_SENSOR_INVERTER_POWER_1=my-pv:inverter_power
INFLUX_SENSOR_INVERTER_POWER_2=balcony:inverter_power
INFLUX_SENSOR_INVERTER_POWER_3=
INFLUX_SENSOR_INVERTER_POWER_4=
INFLUX_SENSOR_INVERTER_POWER_5=
```

### 4. Ein Dach mit mehreren Flächen und zusätzlich ein Balkonkraftwerk

Auch hier wird man höchstwahrscheinlich nicht die Gesamtsumme verfügbar habe, daher lässt man die Variable leer.

Beispiel:

```env
INFLUX_SENSOR_INVERTER_POWER=
INFLUX_SENSOR_INVERTER_POWER_1=my-pv:east
INFLUX_SENSOR_INVERTER_POWER_2=my-pv:west
INFLUX_SENSOR_INVERTER_POWER_3=my-pv:south
INFLUX_SENSOR_INVERTER_POWER_4=my-pv:north
INFLUX_SENSOR_INVERTER_POWER_5=balcony:inverter_power
```

{: .note}

Diese Konfiguration macht es erforderlich, dass man die Einzelwerte wirklich für den gesamten Zeitraum seit Installation des ersten Erzeugers vorliegen hat. Ist das nicht gegeben, greift man besser auf Szenario 3 zurück und differenziert nicht nach Dachflächen.

## Zurücksetzen der Tageszusammenfassungen

Nach einer Änderung der konfigurierten Sensoren für die Erzeugung ist es erforderlich, die Tageszusammenfassungen zurückzusetzen, damit auch historische Werte korrekt angezeigt werden.
