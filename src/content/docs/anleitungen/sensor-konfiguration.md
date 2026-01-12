---
title: Umstellung auf neue Sensor-Konfiguration
sidebar:
  hidden: true
---

Mit Version `0.15` wurde in SOLECTRUS eine neue Konfiguration eingeführt. Dieser Text soll erklären, warum das notwendig war, welche Vorteile es bringt und was bisherige Benutzer von SOLECTRUS tun sollten.

Für Benutzer, die erst mit Version `0.15` (oder später) eingestiegen sind, ist das alles nicht relevant. Sie haben vermutlich den [Konfigurator](/installation/konfigurator) verwendet und müssen nichts umstellen. Der Konfigurator erzeugt automatisch die neue Konfiguration.

Dieser Text richtet sich also an Benutzer, die SOLECTRUS schon länger verwenden, also vor Version `0.15` eingestiegen sind.

:::note
Für die Umstellung sollte eher **nicht** der Konfigurator verwendet werden, da dieser einige andere Bezeichnungen verwendet, z.B. für InfluxDB-Bucket und -Measurements, Docker-Services und anderes. Das würde einige manuelle Anpassungen erfordern, die ein tieferes Verständnis von InfluxDB und Docker voraussetzen.

Der Konfigurator ist nur für eine **Neuinstallation** gedacht, bei der keine bestehenden Datenbanken fortgeführt werden müssen.
:::

## Warum überhaupt eine neue Konfiguration?

Ursprünglich orientierte sich SOLECTRUS begrifflich am Hersteller SENEC. Die ersten Versionen von SOLECTRUS unterstützten nur den SENEC-Stromspeicher und verwendeten daher intern (insbesondere in der Datenbank InfluxDB) auch deren Bezeichnungen für einzelne Messwerte. Diese Bezeichnung wie z.B. `bat_fuel_charge` (Batterie-Ladestand), `bat_power_minus` (Batterie-Entladeleistung) oder `bat_power_plus` (Batterie-Ladeleistung) waren nicht immer selbsterklärend. Es erschien anfangs aber als eine gute Idee, wenn die SENEC-Begriffe ein-zu-eins in SOLECTRUS wieder auftauchten.

Mit Einführung der [MQTT-Anbindung](https://github.com/solectrus/mqtt-collector) und der Unterstützung von weiteren Herstellern wurde das aber zu einem unschönen Nachteil: Die Messwerte kamen nun aus verschiedenen Quellen (hießen also auch anders) und mussten in das Schema von SOLECTRUS gepresst werden, das auf SENEC basierte. Das führte nicht gerade zu einer übersichtlichen Konfiguration.

Dies führte zum Entschluss, eine eigene Namensgebung einzuführen, die **herstellerunabhängig** ist und in sich konsistent ist. Die Messwerte nennen sich jetzt "Sensoren". Jeder Sensor hat einen eindeutigen Namen, der innerhalb von SOLECTRUS verwendet wird.

## Was genau ist ein Sensor?

Ein Sensor ist die Definition eines Messwerts und eine zusätzliche Schicht, die von der Datenbank abstrahiert. Ein Sensor hat einen Namen, der nicht zwingend mit dem Namen in InfluxDB übereinstimmen muss.

Welche Sensoren es gibt, wird von SOLECTRUS festgelegt. Derzeit gibt es genau diese 16:

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
- `CAR_BATTERY_SOC` (Ladestand des E-Autos)
- `WALLBOX_CAR_CONNECTED` (Verbindungsstatus des E-Autos mit der Wallbox)

Zukünftige Versionen werden sicherlich weitere Sensoren einführen.

## Definition von Sensoren

In der `.env`-Datei werden die Sensoren definiert. Ein Beispiel:

```properties
INFLUX_SENSOR_BATTERY_CHARGING_POWER=SENEC:bat_power_plus
```

Das ist folgendermaßen zu lesen: Der Sensor `BATTERY_CHARGING_POWER` ist im Measurement `SENEC` zu finden und dort im Field `bat_power_plus`.

## Kompatibilität mit älteren Versionen

In älteren Versionen von SOLECTRUS findet sich keine Sensor-Definition. SOLECTRUS hat daher einen Fallback-Mechanismus implementiert, der beim Start automatisch eine alte Konfiguration interpretiert.

Damit können bestehende SOLECTRUS-Nutzer ihre gesammelten Messwerte weiter verwenden und müssen auch gar nicht zwingend eine Sensor-Konfiguration anlegen. Langfristig ist es aber **sehr** zu empfehlen, die Sensoren explizit zu definieren. Der Fallback wird nämlich irgendwann entfernt werden.

## Besonderheit bei MQTT

Der MQTT-Collector ab (Version 0.2.0) profitiert auch von dieser Umstellung. Er muss nämlich gar nicht wissen, welche Sensoren es in SOLECTRUS gibt. Er kann beliebige Messwerte empfangen, verarbeiten und in die InfluxDB schreiben. Der Collector muss sich an keinem vorgegebenen Namensschema orientieren, sondern die Messwerte können sinnvoll z.B. nach ihrer Quelle strukturiert werden.

Für jedes Topic, das der MQTT-Collector abonniert, kann einzeln festgelegt werden, was mit den Messwerten geschehen soll und insbesondere wohin sie gespeichert werden sollen. Die Werte können insbesondere auf unterschiedliche Measurements verteilt werden, was früher nicht möglich war.

Das bedeutet, dass auch Messwerte, die gar nichts mit einem Stromspeicher zu tun haben, sinnvoll mit dem MQTT-Collector gesammelt werden können. Beispiele sind der Stromverbrauch einer Wärmepumpe, der Kilometerstand eines E-Autos, die Außentemperatur, ein CO2-Emissionsfaktor etc. Zukünftige Versionen von SOLECTRUS können diese Werte dann sinnvoll verarbeiten.

Auch sind Verarbeitungsschritte möglich, z.B. die Umrechnung oder die Extraktion von Werten aus verschachtelten JSON-Strukturen. Im Referenz-Bereich finden sich Details zur [Konfiguration des MQTT-Collectors](/referenz/mqtt-collector).

## Anleitung zur Umstellung

Um die Sensor-Konfiguration zu erstellen, sind zusätzliche Umgebungsvariablen in der `.env`-Datei zu erstellen - und außerdem in der `compose.yaml` aufzuführen.

Die Umstellung betrifft sowohl das Dashboard als auch den MQTT-Collector (sofern verwendet).

### Dashboard

Eine Warnung im Docker-Log des Dashboards sieht z.B. so aus:

```log
DEPRECATION WARNING: Missing environment variable INFLUX_SENSOR_INVERTER_POWER.
  To remove this warning, add the following to your environment:
    INFLUX_SENSOR_INVERTER_POWER=SENEC:inverter_power
  or, when you want to ignore this sensor:
    INFLUX_SENSOR_INVERTER_POWER=
```

Es ist dann folgendes zu tun:

- Einfügen eines Eintrags in die `.env`-Datei
- Ergänzen der Umgebungsvariable in der `compose.yaml` im Abschnitt `environment` des services `dashboard` (früherer Name: `app`)

### .env

```properties
# ...
INFLUX_SENSOR_INVERTER_POWER=SENEC:inverter_power
```

### compose.yaml

```yaml
services:
  # ...
  dashboard:
    # ...
    environment:
      # ...
      - INFLUX_SENSOR_INVERTER_POWER
```

Mit diesen Hinweisen kann man schrittweise von der alten auf die neue Konfiguration umstellen. Nach jeder Änderung kann mit `docker compose up -d` die Konfiguration neu geladen werden.

Wenn beim Start keine Warnung mehr erscheinen, ist die Umstellung abgeschlossen.

### MQTT-Collector

Was genau zu tun ist, wird beim Start des MQTT-Collectors im Docker-Log ausgegeben. Dort findet sich z.B. eine Meldung wie diese:

```
Variables MQTT_TOPIC_BAT_POWER and MQTT_FLIP_BAT_POWER are deprecated.
To remove this warning, please replace the variables by:
  MAPPING_3_TOPIC=PV/SignedBat
  MAPPING_3_FIELD_POSITIVE=bat_power_minus
  MAPPING_3_FIELD_NEGATIVE=bat_power_plus
  MAPPING_3_MEASUREMENT_POSITIVE=SUNGROW
  MAPPING_3_MEASUREMENT_NEGATIVE=SUNGROW
  MAPPING_3_TYPE=integer
```

Es ist dann folgendes zu tun:

- Einfügen der Einträge (in diesem Fall sechs) in die `.env`-Datei
- Ergänzen der sechs Variablen in der `compose.yaml` im Abschnitt `environment` des services `mqtt-collector`

Es muss also wie folgt aussehen:

### .env

```properties
# ...
MAPPING_3_TOPIC=PV/SignedBat
MAPPING_3_FIELD_POSITIVE=bat_power_minus
MAPPING_3_FIELD_NEGATIVE=bat_power_plus
MAPPING_3_MEASUREMENT_POSITIVE=SUNGROW
MAPPING_3_MEASUREMENT_NEGATIVE=SUNGROW
MAPPING_3_TYPE=integer
```

### compose.yaml

```yaml
services:
  # ...
  mqtt-collector:
    # ...
    environment:
      # ...
      - MAPPING_3_TOPIC
      - MAPPING_3_FIELD_POSITIVE
      - MAPPING_3_FIELD_NEGATIVE
      - MAPPING_3_MEASUREMENT_POSITIVE
      - MAPPING_3_MEASUREMENT_NEGATIVE
      - MAPPING_3_TYPE
```

Mit diesen Hinweisen kann man schrittweise von der alten auf die neue Konfiguration umstellen. Nach jeder Änderung kann mit `docker compose up -d` die Konfiguration neu geladen werden.

Wenn beim Start keine Warnung mehr erscheinen, ist die Umstellung abgeschlossen.
