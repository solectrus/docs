---
title: Umstellung auf neue Konfiguration
layout: page
parent: Wartung
nav_order: 3
---

# Neue Konfiguration mit v0.15

Mit Version `0.15` wurde in SOLECTRUS eine neue Konfiguration eingeführt. Dieser Text soll erklären, warum das notwendig war, welche Vorteile es bringt und was bisherige Benutzer von SOLECTRUS tun sollten.

Für neue Benutzer, die erst mit Version `0.15` einsteigen, ist das alles nicht relevant. Sie können SOLECTRUS mithilfe des [Konfigurators](https://configurator.solectrus.de/) installieren und müssen nichts umstellen. Der Konfigurator erzeugt automatisch die neue Konfiguration.

## Warum überhaupt eine neue Konfiguration?

Bislang orientierte sich SOLECTRUS begrifflich am Hersteller SENEC. Die ersten Versionen von SOLECTRUS unterstützten nur den SENEC-Speicher und verwendeten daher intern (insbesondere in der Datenbank InfluxDB) auch deren Bezeichnungen für einzelne Messwerte. Diese Bezeichnung wie z.B. `bat_fuel_charge` oder `bat_power_minus` oder `bat_power_plus` waren nicht immer selbsterklärend und führten zu Verwirrung. Es erschien mir anfangs aber als eine gute Idee, wenn die SENEC-Begriffe ein-zu-eins in SOLECTRUS wieder auftauchten.

Mit Einführung der [MQTT-Anbindung](https://github.com/solectrus/mqtt-collector) und der Unterstützung von weiteren Herstellern wurde das aber zu einem unschönen Nachteil: Die Messwerte kamen nun aus verschiedenen Quellen (hießen also auch anders) und mussten in das Schema von SOLECTRUS gepresst werden, das auf SENEC basierte. Das führte nicht gerade zu einer übersichtlichen Konfiguration.

Ich habe mich daher entschlossen, eine eigene Namensgebung einzuführen, die **herstellerunabhängig** ist und in sich konsistent ist. Die Messwerte nennen sich jetzt "Sensoren". Jeder Sensor hat einen eindeutigen Namen, der innerhalb von SOLECTRUS verwendet wird.

## Was ist ein Sensor?

Welche Sensoren es gibt, legt SOLECTRUS selbst fest. Derzeit gibt es genau diese 14:

- `INVERTER_POWER` (erzeugte Leistung des Wechselrichters)
- `HOUSE_POWER` (Hausverbrauch)
- `GRID_IMPORT_POWER` (Netzbezug)
- `GRID_EXPORT_POWER` (Netzeinspeisung)
- `HEATPUMP_POWER` (Leistung der Wärmepumpe)
- `BATTERY_CHARGING_POWER` (Ladeleistung des Speichers)
- `BATTERY_DISCHARGING_POWER` (Entladeleistung des Speichers)
- `BATTERY_SOC` (Ladestand des Speichers)
- `WALLBOX_POWER` (Ladeleistung der Wallbox)
- `CASE_TEMP` (Temperatur des Speichers)
- `INVERTER_POWER_FORECAST` (prognostizierte PV-Leistung)
- `SYSTEM_STATUS` (Status des Speichers oder der Anlage)
- `SYSTEM_STATUS_OK` (Status des Speichers gilt als "OK")
- `GRID_EXPORT_LIMIT` (Einspeisebegrenzung)

Zukünftige Versionen werden sicherlich weitere Sensoren einführen.

## Kompatibilität mit älteren Versionen

Ein bestehender SOLECTRUS-Nutzer hat eine InfluxDB, die mit den alten Bezeichnungen gefüllt ist. Da gibt es möglicherweise das Measurement `SENEC` mit dem Field `bat_power_plus`.

Um dies anzugehen, wurde ein Mapping eingeführt, also eine Zuordnung von Sensor-Namen zu InfluxDB-Bezeichnungen. Diese Zwischenschicht wird in der `.env`-Datei konfiguriert. Ein Beispiel:

```properties
INFLUX_SENSOR_BATTERY_CHARGING_POWER=SENEC:bat_power_plus
```

Das ist folgendermaßen zu lesen: Der Sensor `BATTERY_CHARGING_POWER` ist im Measurement `SENEC` zu finden und dort im Field `bat_power_plus`.

Damit können bestehende SOLECTRUS-Nutzer ihre gesammelten Messwerte weiter verwenden. Es sind nur die entsprechenden Einträge in der `.env`-Datei vorzunehmen.

## Besonderheit bei MQTT

Der MQTT-Collector ab [Version 0.2.0 ](https://github.com/solectrus/mqtt-collector/releases/tag/v0.2.0) profitiert sehr von dieser Umstellung. Er muss nämlich gar nicht wissen, welche Sensoren es in SOLECTRUS gibt. Er kann beliebige Messwerte empfangen, verarbeiten und in die InfluxDB schreiben. Der Collector muss sich an keinem vorgegebenen Namensschema orientieren, sondern die Messwerte können sinnvoll z.B. nach ihrer Quelle strukturiert werden.

Für jedes Topic, das der MQTT-Collector abonniert, kann einzeln festgelegt werden, was mit den Messwerten geschehen soll und insbesondere wohin sie gespeichert werden sollen. Die Werte können insbesondere auf unterschiedliche Measurements verteilt werden, was früher nicht möglich war.

Das bedeutet, dass auch Messwerte, die gar nichts mit einem Stromspeicher zu tun haben, sinnvoll mit dem MQTT-Collector gesammelt werden können. Beispiele sind der Stromverbrauch einer Wärmepumpe, der Kilometerstand eines E-Autos, die Außentemperatur, ein CO2-Emissionsfaktor etc. Zukünftige Versionen von SOLECTRUS können diese Werte dann sinnvoll verarbeiten.

Auch sind jetzt Verarbeitungsschritte möglich, z.B. die Umrechnung oder die Extraktion von Werten aus verschachtelten JSON-Strukturen. Die Details dazu sind hier zu finden:
https://github.com/solectrus/mqtt-collector/wiki/Konfiguration

## Anleitung zur Umstellung

Ich habe bei der Entwicklung sehr darauf geachtet, dass die Umstellung so einfach wie möglich ist. Die meisten User werden nach dem Update gar nicht gemerkt haben, dass eine solche grundlegende Umstellung stattgefunden hat. Die alte Konfiguration wird nämlich weiterhin unterstützt und beim Start der Docker-Container automatisch in die neue Konfiguration überführt.

Diese Fähigkeit wird aber vermutlich nicht auf Dauer bestehen bleiben. Es sind Altlasten, die ich gerne irgendwann über Bord werfen möchte. Im Docker-Log der Container werden daher Warnungen ausgegeben, wenn die alte Konfiguration noch verwendet wird. Außerdem, und das ist das Wichtigste, werden konkrete Hinweise gegeben, wie die Umstellung erfolgen kann.

Ein Beispiel dazu:

```
Variables MQTT_TOPIC_BAT_POWER and MQTT_FLIP_BAT_POWER are deprecated. To remove this warning, please replace the variables by:
  MAPPING_3_TOPIC=PV/SignedBat
  MAPPING_3_FIELD_POSITIVE=bat_power_minus
  MAPPING_3_FIELD_NEGATIVE=bat_power_plus
  MAPPING_3_MEASUREMENT_POSITIVE=SUNGROW
  MAPPING_3_MEASUREMENT_NEGATIVE=SUNGROW
  MAPPING_3_TYPE=integer
```

Mit diesen Hinweisen kann man schrittweise von der alten auf die neue Konfiguration umstellen.

---

(Dieser Text wird in der nächsten Zeit noch erweitert und verfeinert.)
