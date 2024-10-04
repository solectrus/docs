---
title: Inbetriebnahme
layout: page
parent: Power-Splitter
nav_order: 3
---

# Inbetriebnahme des Power-Splitters

Bei einer Neuinstallation von SOLECTRUS über den [Konfigurator](https://configurator.solectrus.de/) wird der Power-Splitter automatisch mit installiert. Wenn nicht der Konfigurator verwendet wurde oder eine ältere Installation vorliegt, muss der Power-Splitter händisch hinzugefügt werden. Hier wird beschrieben, wie das geht.

1. Zunächst ist sicherzustellen, dass ein E-Auto und/oder eine Wärmepumpe an SOLECTRUS angebunden wurde. Deren Messwerte müssen also in der SOLECTRUS-Instanz sichtbar sein.

2. Als nächstes ist zu prüfen, ob die [neue Sensor-Konfiguration](/wartung/sensor-konfiguration) bereits vorhanden ist. Bei älteren Installation (vor Juli 2024) ist meist die ältere Konfiguration vorhanden und muss zunächst angepasst werden.

   Das bedeutet: Beim Start der Docker-Container von SOLECTRUS dürfen keine Warnungen bezüglich fehlender Sensoren im Log erscheinen. Falls doch, müssen diese zunächst behoben werden. Im Log steht genau, wie das geht.

   Es müssen also folgende ENV-Variablen (mit Werten) in der `.env`-Datei enthalten sein:

   - `INFLUX_SENSOR_GRID_IMPORT_POWER`
   - `INFLUX_SENSOR_HOUSE_POWER`
   - `INFLUX_SENSOR_WALLBOX_POWER` und/oder `INFLUX_SENSOR_HEATPUMP_POWER`

   Üblicherweise gibt es weitere Sensoren in der `.env`, die sind für den Power-Splitter aber nicht relevant.

3. Abschließend ist sicherzustellen, dass Version `0.16.0` oder neuer von SOLECTRUS verwendet wird.

4. Die eigentliche Integration des Power-Splitter erfolgt nun durch Anpassung der Dateien `compose.yaml`. Hier ist derPower-Splitter als zusätzlicher Service zu ergänzen:

   ```yaml
   services:
     # ...
     power-splitter:
       image: ghcr.io/solectrus/power-splitter:latest
       environment:
         - TZ
         - POWER_SPLITTER_INTERVAL
         - INFLUX_HOST
         - INFLUX_SCHEMA
         - INFLUX_PORT
         - INFLUX_TOKEN=${INFLUX_ADMIN_TOKEN}
         - INFLUX_ORG
         - INFLUX_BUCKET
         - INFLUX_SENSOR_GRID_IMPORT_POWER
         - INFLUX_SENSOR_HOUSE_POWER
         - INFLUX_SENSOR_WALLBOX_POWER
         - INFLUX_SENSOR_HEATPUMP_POWER
         - INFLUX_EXCLUDE_FROM_HOUSE_POWER
         - REDIS_URL
       logging:
         options:
         max-size: 10m
         max-file: '3'
       restart: unless-stopped
       depends_on:
         influxdb:
           condition: service_healthy
         redis:
           condition: service_healthy
       links:
         - influxdb
         - redis
       labels:
         - com.centurylinklabs.watchtower.scope=solectrus
   ```

   Der Power-Splitter liest aus der InfluxDB die Messwerte der Verbraucher sowie des Netzbezugs und schreibt die Aufteilung in ein neues Measurement mit der (unveränderlichen) Bezeichnung `power_splitter`.

   Wichtig beim `INFLUX_TOKEN` ist, dass dieses sowohl zum Schreiben als auch zum Lesen berechtigt. Es empfiehlt sich, hierfür das Admin-Token zu nehmen (wie oben angegeben).

   Die `REDIS_URL` wird benötigt, um nach dem ersten Durchlauf einmalig den Cache leeren zu können.

5. Abschließend ist ein Neustart der Container durchzuführen, mit `docker compose up -d` wird nun wird der Power-Splitter mit gestartet.

   Wenn sich die Container gar nicht starten lassen sollten, ist vermutlich der Service nicht richtig in die `compose.yaml` eingefügt worden. Hier ist insbesondere die Einrückung zu prüfen, das ist bei YAML-Dateien äußerst wichtig.

   Die Log-Ausgabe des neuen Containers kann mit folgendem Befehl vefolgt werden:\
   `docker compose logs power-splitter -f` (kann beendet werden mit `Strg+C`)

   Bei etwaigen Fehlermeldungen muss unbedingt die Ursache gefunden und behoben werden.

   Wenn alles fehlerfrei läuft, wird der Power-Splitter zunächst die Daten der Vergangenheit bearbeiten, anschließend im Hintergrund weiterlaufen und jeweils den aktuellen Tag berechnen. Dies lässt sich alles genau im Log nachvollziehen. Es ist empfehlenswert, das zu tun. Nach einer gewissen Zeit (abhängig von Rechenpower und Datenmenge) wird die Berechnung der Vergangenheit abgeschlossen sein.

Wenn jetzt in SOLECTRUS ein Zeitraum gewählt wird (Tag/Woche/Monat/Jahr/Gesamt), sieht man bei Haus, E-Auto und Wärmepumpe (sofern vorhanden) jeweils im Tooltip die Aufteilung des Verbrauchs. Außerdem erscheinen deren Diagramme in einer gestapelten Darstellung.
