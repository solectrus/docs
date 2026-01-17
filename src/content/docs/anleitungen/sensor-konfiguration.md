---
title: Umstellung auf neue Sensor-Konfiguration
sidebar:
  hidden: true
---

Im [Sommer 2024](https://solectrus.de/blog/2024-07-15-version-0-15/) wurde mit Version `0.15` eine neue Konfiguration für SOLECTRUS eingeführt. Dieser Text soll genauer erklären, warum das notwendig war, welche Vorteile es bringt und was Nutzer von SOLECTRUS tun sollten.

Für Benutzer, die erst mit Version `0.15` (oder später) eingestiegen sind, ist das alles nicht relevant. Sie haben vermutlich den [Konfigurator](/installation/konfigurator) verwendet und müssen nichts umstellen. Der Konfigurator erzeugt bereits automatisch die neue Konfiguration.

Dieser Text richtet sich also an Benutzer, die SOLECTRUS schon länger verwenden, also vor Version `0.15` eingestiegen sind.

## Warum überhaupt eine neue Konfiguration?

Ursprünglich orientierte sich SOLECTRUS begrifflich am Hersteller SENEC. Die ersten Versionen von SOLECTRUS unterstützten nur den SENEC-Stromspeicher und verwendeten daher intern (insbesondere in der Datenbank InfluxDB) auch deren Bezeichnungen für einzelne Messwerte. Diese Bezeichnung wie z.B. `bat_fuel_charge` (Batterie-Ladestand), `bat_power_minus` (Batterie-Entladeleistung) oder `bat_power_plus` (Batterie-Ladeleistung) waren nicht immer selbsterklärend. Es erschien anfangs aber als eine gute Idee, wenn die SENEC-Begriffe ein-zu-eins in SOLECTRUS wieder auftauchten.

Mit Einführung der [MQTT-Anbindung](https://github.com/solectrus/mqtt-collector) und der Unterstützung von weiteren Herstellern wurde das aber zu einem unschönen Nachteil: Die Messwerte kamen nun aus verschiedenen Quellen (hießen also auch anders) und mussten in das Schema von SOLECTRUS gepresst werden, das auf SENEC basierte. Das führte nicht gerade zu einer übersichtlichen Konfiguration.

Dies führte zum Entschluss, eine eigene Namensgebung einzuführen, die **herstellerunabhängig** ist und in sich konsistent ist. Die Messwerte nennen sich jetzt "Sensoren". Jeder Sensor hat einen eindeutigen Namen, der innerhalb von SOLECTRUS verwendet wird.

## Was genau ist ein Sensor?

Ein Sensor ist die Definition eines Messwerts und eine zusätzliche Schicht, die von der Datenbank abstrahiert. Ein Sensor hat einen Namen, der nicht zwingend mit dem Namen in InfluxDB übereinstimmen muss.

Welche Sensoren es gibt, wird von SOLECTRUS festgelegt. Beispiele für Sensoren sind:

- `INVERTER_POWER` (erzeugte Leistung des Wechselrichters)
- `HOUSE_POWER` (Hausverbrauch)
- `GRID_IMPORT_POWER` (Netzbezug)
- `GRID_EXPORT_POWER` (Netzeinspeisung)
- `BATTERY_CHARGING_POWER` (Batterie-Ladeleistung)
- ...

Eine vollständige Liste aller Sensoren findet sich in der [Referenz zum Dashboard](/referenz/dashboard/sensor-konfiguration/).

## Definition von Sensoren

In der `.env`-Datei werden die Sensoren definiert. Sie erhalten dabei den Prefix `INFLUX_SENSOR_`, gefolgt vom Sensor-Namen. Ein Beispiel:

```properties
INFLUX_SENSOR_BATTERY_CHARGING_POWER=SENEC:bat_power_plus
```

Das ist folgendermaßen zu lesen: Der Sensor `BATTERY_CHARGING_POWER` ist im _Measurement_ `SENEC` zu finden und dort im _Field_ `bat_power_plus`.

Der Doppelpunkt trennt also _Measurement_ und _Field_. Dies sind Begriffe aus InfluxDB und dienen der Strukturierung der Datenbank.

## Fallback-Kompatibilität mit älteren Versionen

In älteren Versionen von SOLECTRUS findet sich keine Sensor-Definition. SOLECTRUS hat daher einen Fallback-Mechanismus implementiert, der beim Start automatisch eine alte Konfiguration interpretiert.

Damit können bestehende SOLECTRUS-Nutzer ihre gesammelten Messwerte weiter verwenden und müssen auch gar nicht zwingend eine Sensor-Konfiguration anlegen. Langfristig ist es aber **sehr** zu empfehlen, die Sensoren explizit zu definieren. Der Fallback wird möglicherweise irgendwann entfernt werden.

Außerdem: Die Sensor-Konfiguration ist Voraussetzung für die Nutzung des [Power-Splitters](/referenz/power-splitter).

## Besonderheit bei MQTT

Der MQTT-Collector (ab Version 0.2.0) profitiert auch von dieser Umstellung. Er muss nämlich gar nicht wissen, welche Sensoren es in SOLECTRUS gibt. Er kann beliebige Messwerte empfangen, verarbeiten und in die InfluxDB schreiben. Der Collector muss sich an keinem vorgegebenen Namensschema orientieren, sondern die Messwerte können sinnvoll z.B. nach Quelle strukturiert werden.

Für jedes Topic, das der MQTT-Collector abonniert, kann einzeln festgelegt werden, was mit den Messwerten geschehen soll und insbesondere wohin sie gespeichert werden sollen. Die Werte können insbesondere auf unterschiedliche Measurements verteilt werden, was früher nicht möglich war.

Das bedeutet, dass auch Messwerte, die gar nichts mit einem Stromspeicher zu tun haben, sinnvoll mit dem MQTT-Collector gesammelt werden können. Beispiele sind der Stromverbrauch einer Wärmepumpe, der Kilometerstand eines E-Autos, die Außentemperatur, ein CO2-Emissionsfaktor etc. Zukünftige Versionen von SOLECTRUS können diese Werte dann sinnvoll verarbeiten.

Auch sind Verarbeitungsschritte möglich, z.B. die Umrechnung oder die Extraktion von Werten aus verschachtelten JSON-Strukturen. Im Referenz-Bereich finden sich Details zur [Konfiguration des MQTT-Collectors](/referenz/mqtt-collector).

## Anleitung zur Umstellung

Die Umstellung betrifft sowohl das Dashboard als auch den MQTT-Collector (sofern verwendet).

:::note
Für die Umstellung sollte eher **nicht** der Konfigurator verwendet werden, da dieser einige andere Bezeichnungen verwendet, z.B. für InfluxDB-Bucket und -Measurements, Docker-Services und anderes. Das würde einige manuelle Anpassungen erfordern, die ein tieferes Verständnis von InfluxDB und Docker voraussetzen.

Der Konfigurator ist nur für eine **Neuinstallation** gedacht, bei der keine bestehenden Datenbanken fortgeführt werden müssen.
:::

Um die Sensor-Konfiguration zu erstellen, sind einige Umgebungsvariablen in der `.env`-Datei zu ergänzen - und außerdem in der `compose.yaml` aufzuführen.

:::note

Bei älteren SOLECTRUS-Installationen wirst du vermutlich keine `compose.yaml` finden, sondern eine `docker-compose.yml`. Das ist völlig in Ordnung und hat keine Nachteile, beide Dateien sind äquivalent. In diesem Text wird der Begriff `compose.yaml`verwendet, da dies [der offizielle Name im Docker-Umfeld](https://docs.docker.com/compose/intro/compose-application-model/#the-compose-file) ist.

:::

### Dashboard

Eine Warnung im Docker-Log des Dashboards sieht z.B. so aus:

```log
───── SENSOR INITIALIZATION ──────────────────────────────────────────────────

····· ⚠️  LEGACY CONFIGURATION ···············································

Legacy configuration detected and automatically converted.
Everything works as expected, but please consider updating your configuration:

INFLUX_SENSOR_INVERTER_POWER=SENEC:inverter_power
INFLUX_SENSOR_INVERTER_POWER_FORECAST=Forecast:watt
INFLUX_SENSOR_HOUSE_POWER=SENEC:house_power
INFLUX_SENSOR_GRID_IMPORT_POWER=SENEC:grid_power_plus
INFLUX_SENSOR_GRID_EXPORT_POWER=SENEC:grid_power_minus
INFLUX_SENSOR_GRID_EXPORT_LIMIT=SENEC:power_ratio
INFLUX_SENSOR_BATTERY_CHARGING_POWER=SENEC:bat_power_plus
INFLUX_SENSOR_BATTERY_DISCHARGING_POWER=SENEC:bat_power_minus
INFLUX_SENSOR_BATTERY_SOC=SENEC:bat_fuel_charge
INFLUX_SENSOR_WALLBOX_POWER=SENEC:wallbox_charge_power
INFLUX_SENSOR_CASE_TEMP=SENEC:case_temp
INFLUX_SENSOR_SYSTEM_STATUS=SENEC:current_state
INFLUX_SENSOR_SYSTEM_STATUS_OK=SENEC:current_state_ok

After updating, you can remove INFLUX_MEASUREMENT_PV and INFLUX_MEASUREMENT_FORECAST.
```

Es sind dann zwei Schritte zu tun:

1. Einfügen der aufgeführten Variablen in die `.env`-Datei
2. Ergänzen der Umgebungsvariablen in der `compose.yaml`

#### .env ergänzen

Es sind genau die Variablen in die `.env`-Datei einzufügen, die in der Warnung ausgegeben werden - und zwar genau so, wie sie dort stehen. Aus dem obigen Beispiel der Warnung ergibt sich also:

```properties
# ...
INFLUX_SENSOR_INVERTER_POWER=SENEC:inverter_power
INFLUX_SENSOR_INVERTER_POWER_FORECAST=Forecast:watt
INFLUX_SENSOR_HOUSE_POWER=SENEC:house_power
INFLUX_SENSOR_GRID_IMPORT_POWER=SENEC:grid_power_plus
INFLUX_SENSOR_GRID_EXPORT_POWER=SENEC:grid_power_minus
INFLUX_SENSOR_GRID_EXPORT_LIMIT=SENEC:power_ratio
INFLUX_SENSOR_BATTERY_CHARGING_POWER=SENEC:bat_power_plus
INFLUX_SENSOR_BATTERY_DISCHARGING_POWER=SENEC:bat_power_minus
INFLUX_SENSOR_BATTERY_SOC=SENEC:bat_fuel_charge
INFLUX_SENSOR_WALLBOX_POWER=SENEC:wallbox_charge_power
INFLUX_SENSOR_CASE_TEMP=SENEC:case_temp
INFLUX_SENSOR_SYSTEM_STATUS=SENEC:current_state
INFLUX_SENSOR_SYSTEM_STATUS_OK=SENEC:current_state_ok
```

#### compose.yaml erweitern

Im Abschnitt `environment` des services `dashboard` sind die ergänzten Variablen ebenfalls aufzuführen, aber ohne Wert. Dadurch erhält der Container Zugriff auf diese Variablen. Hier im Beispiel ergibt sich also:

```yaml
services:
  # ...
  dashboard:
    # ...
    environment:
      # ...
      - INFLUX_SENSOR_INVERTER_POWER
      - INFLUX_SENSOR_INVERTER_POWER_FORECAST
      - INFLUX_SENSOR_HOUSE_POWER
      - INFLUX_SENSOR_GRID_IMPORT_POWER
      - INFLUX_SENSOR_GRID_EXPORT_POWER
      - INFLUX_SENSOR_GRID_EXPORT_LIMIT
      - INFLUX_SENSOR_BATTERY_CHARGING_POWER
      - INFLUX_SENSOR_BATTERY_DISCHARGING_POWER
      - INFLUX_SENSOR_BATTERY_SOC
      - INFLUX_SENSOR_WALLBOX_POWER
      - INFLUX_SENSOR_CASE_TEMP
      - INFLUX_SENSOR_SYSTEM_STATUS
      - INFLUX_SENSOR_SYSTEM_STATUS_OK
```

:::note

Falls in deiner `compose.yaml` der Service noch `app` heißt, sollte er in `dashboard` umbenannt werden. Das ist zwar nicht zwingend erforderlich, aber diese (neue) Bezeichnung wird in der Dokumentation überall verwendet und vermeidet Verwirrung.

**Vorsicht:** Bevor (!) du den Service umbenennst, müssen die Container beendet werden, sonst gibt es später Durcheinander:

```bash
docker compose down
```

:::

#### Neustart

Nach dem Anpassen der beiden Dateien muss der Container mit folgendem Befehl neu gestartet werden, um die Änderungen zu übernehmen. Das geht am einfachsten so:

```bash
docker compose up -d
```

Wenn beim Start keine Legacy-Warnung mehr im Log des Dashboards erscheint, ist die Umstellung abgeschlossen.

### MQTT-Collector

Falls man den MQTT-Collector verwendet, gibt es dort ebenfalls eine Warnung zur Umstellung der Konfiguration.

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

#### .env ergänzen

```properties
# ...
MAPPING_3_TOPIC=PV/SignedBat
MAPPING_3_FIELD_POSITIVE=bat_power_minus
MAPPING_3_FIELD_NEGATIVE=bat_power_plus
MAPPING_3_MEASUREMENT_POSITIVE=SUNGROW
MAPPING_3_MEASUREMENT_NEGATIVE=SUNGROW
MAPPING_3_TYPE=integer
```

#### compose.yaml erweitern

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
