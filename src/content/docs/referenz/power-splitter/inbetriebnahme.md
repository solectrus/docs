---
title: Inbetriebnahme des Power-Splitters
sidebar:
  order: 4
  label: Inbetriebnahme
---

Bei einer Neuinstallation von SOLECTRUS über den [Konfigurator](https://configurator.solectrus.de/) wird der Power-Splitter automatisch mit installiert. Wenn nicht der Konfigurator verwendet wurde oder eine ältere Installation vorliegt, muss der Power-Splitter händisch hinzugefügt werden. Hier wird beschrieben, wie das geht.

## 1. Geräte parat?

Zunächst ist sicherzustellen, dass ein E-Auto **und/oder** eine Wärmepumpe **und/oder** benutzerdefinierte Verbraucher an SOLECTRUS angebunden wurde. Deren Messwerte müssen also im Dashboard sichtbar sein.

Wenn es nur den Hausverbrauch gibt (also keine weiteren Verbraucher), macht der Power-Splitter keinen Sinn, weil es dann nichts aufzuteilen gibt. Eine Installation des Power-Splitters ist in diesem Fall nicht empfehlenswert.

## 2. Sensor-Konfiguration prüfen

Als nächstes ist zu prüfen, ob die [neue Sensor-Konfiguration](/anleitungen/sensor-konfiguration) bereits vorhanden ist. Bei älteren Installation (vor Juli 2024) ist meist die ältere Konfiguration vorhanden und muss zunächst angepasst werden.

Das bedeutet: Beim Start der Docker-Container von SOLECTRUS dürfen keine Warnungen bezüglich fehlender Sensoren im Log erscheinen. Falls doch, müssen diese zunächst behoben werden. Im Log steht genau, wie das geht.

Es müssen also folgende Umgebungs-Variablen (mit Werten) in der `.env`-Datei enthalten sein:

- `INFLUX_SENSOR_GRID_IMPORT_POWER`
- `INFLUX_SENSOR_HOUSE_POWER`
- `INFLUX_SENSOR_WALLBOX_POWER` (optional)
- `INFLUX_SENSOR_HEATPUMP_POWER` (optional)
- `INFLUX_SENSOR_BATTERY_CHARGING_POWER` (optional)
- `INFLUX_SENSOR_CUSTOM_POWER_01` bis `INFLUX_SENSOR_CUSTOM_POWER_20` (optional)

Üblicherweise gibt es weitere Sensoren in der `.env`, die sind für den Power-Splitter aber nicht relevant.

## 3. Aktuelle SOLECTRUS-Version?

Abschließend ist sicherzustellen, dass Version `0.16.0` oder neuer von SOLECTRUS verwendet wird. Im Zweifel hilft ein `docker compose pull`, um die neuesten Images herunterzuladen.

## 4. compose.yaml anpassen

Die eigentliche Integration des Power-Splitter erfolgt nun durch Anpassung der Datei `compose.yaml`. Hier ist der Power-Splitter als zusätzlicher Service zu ergänzen, siehe [Konfiguration](/referenz/power-splitter/konfiguration).

Der Power-Splitter liest aus der InfluxDB die Messwerte der Verbraucher sowie des Netzbezugs und schreibt die Aufteilung in ein neues Measurement.

Wichtig beim `INFLUX_TOKEN` ist, dass dieses sowohl zum Schreiben als auch zum Lesen berechtigt. Am einfachsten ist es, hierfür das Admin-Token zu nehmen (wie oben angegeben).

Die `REDIS_URL` wird benötigt, um nach dem ersten Durchlauf einmalig den Cache leeren zu können. Analog dient der `DB_HOST` (sowie `DB_USER` und `DB_PASSWORD`) dazu, die Tageszusammenfassungen zurücksetzen zu können.

## 5. Container neu starten

Abschließend ist ein Neustart der Container durchzuführen, mit `docker compose up -d` wird nun wird der Power-Splitter mit gestartet.

Wenn sich die Container gar nicht starten lassen sollten, ist vermutlich der Service nicht richtig in die `compose.yaml` eingefügt worden. Hier ist insbesondere die Einrückung zu prüfen, das ist bei YAML-Dateien äußerst wichtig.

Die Log-Ausgabe des neuen Containers kann mit folgendem Befehl verfolgt werden:\
 `docker compose logs power-splitter -f` (kann beendet werden mit `Strg+C`)

Bei etwaigen Fehlermeldungen muss unbedingt die Ursache gefunden und behoben werden.

Wenn alles fehlerfrei läuft, wird der Power-Splitter zunächst die Daten der Vergangenheit bearbeiten, anschließend im Hintergrund weiterlaufen und jeweils den aktuellen Tag berechnen. Dies lässt sich alles genau im Log nachvollziehen. Es ist empfehlenswert, das zu tun. Nach einer gewissen Zeit (abhängig von Rechenpower und Datenmenge) wird die Berechnung der Vergangenheit abgeschlossen sein.

:::caution
Wenn der Power-Splitter die Daten der Vergangenheit vollständig abgearbeitet hat, müssen im Dashboard noch einmalig die Tageszusammenfassungen zurückgesetzt werden!
:::

## 6. Fertig!

Wenn jetzt in SOLECTRUS ein Zeitraum gewählt wird (Tag/Woche/Monat/Jahr/Gesamt), sieht man bei den verschiedenen Verbrauchern jeweils im Tooltip die Aufteilung des Verbrauchs. Außerdem erscheinen deren Diagramme in einer gestapelten Darstellung.
