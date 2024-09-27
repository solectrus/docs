---
title: Power-Splitter
layout: page
parent: Referenz
nav_order: 6
---

# Verwendung für SOLECTRUS

Der Power-Splitter analysiert den Stromverbrauch großer Verbraucher (E-Auto, Wärmepumpe, Haus). Der gemessene Verbrauch wird aufgeteilt in den Anteil, der mit Photovoltaik-Strom gedeckt wird und den Anteil, der aus dem Netz bezogen wird. Daraus ergeben sich interessante Einblicke in die Verbrauchskosten, die sonst so nicht möglich waren.

Zunächst ein paar wichtige Hinweise:

- Der Power-Splitter ergibt nur Sinn, wenn man ein E-Auto und/oder eine Wärmepumpe hat (also **nicht** zwingend beides) und erfolgreich an SOLECTRUS angebunden hat. Wer also **beides nicht** hat, für den ist es uninteressant, weil es dann nichts aufzuteilen gibt.

- Die Berechnung erfolgt für sämtliche Verbrauchswerte von Wärmepumpe und/oder E-Auto, die in der InfluxDB vorhanden sind. Das bedeutet, dass nicht nur zukünftige Messwerte, sondern **auch die Messwerte der Vergangenheit** berücksichtigt werden.

- Für die Berechnung kommt ein neuer Docker-Container (der eigentliche "Power-Splitter") zum Einsatz. Dieser läuft permanent im Hintergrund, berechnet die Aufteilung und schreibt sie in ein neues Measurement der InfluxDB.

## Inbetriebnahme des Power-Splitters

1. Stelle sicher, dass du ein E-Auto und/oder eine Wärmepumpe an SOLECTRUS angebunden hast. Deren Messwerte müssen also in deiner SOLECTRUS-Instanz sichtbar sein.

2. Prüfe, ob die [neue Sensor-Konfiguration](https://github.com/solectrus/solectrus/wiki/Konfiguration#sensor-konfiguration) bei dir vorhanden ist. Das ist der Fall, wenn du zur Installation den neuen [Konfigurator](https://configurator.solectrus.de/) verwendet hast. Wenn du schon länger mit dabei ist, hast du vermutlich noch die alte Konfiguration (von Version `0.14.5` oder früher), das muss vorher [angepasst werden](https://github.com/solectrus/solectrus/wiki/Umstellung-auf-neue-Sensor%E2%80%90Konfiguration).

   Das bedeutet: Beim Start der Docker-Container von SOLECTRUS dürfen keine Warnungen bezüglich fehlender Sensoren im Log erscheinen. Falls doch, müssen diese zunächst behoben werden. Im Log steht genau, wie das geht.

   Es müssen also folgende ENV-Variablen (mit Werten) in der `.env`-Datei enthalten sein:

   - `INFLUX_SENSOR_GRID_IMPORT_POWER`
   - `INFLUX_SENSOR_HOUSE_POWER`
   - `INFLUX_SENSOR_WALLBOX_POWER` und/oder `INFLUX_SENSOR_HEATPUMP_POWER`

   Mehr [Infos zur Konfiguration](https://github.com/solectrus/power-splitter/wiki/Konfiguration) finden sich in einem separaten Artikel.

   Üblicherweise gibt es weitere Sensoren in der `.env`, die sind für den Power-Splitter aber nicht relevant.

3. Stelle sicher, dass du Version `0.16.0` oder neuer von SOLECTRUS verwendest.

4. Jetzt kommt der wichtigste Punkt: Bearbeite die `docker-compose.yml` (oder `compose.yml`) und ergänze den Power-Splitter als zusätzlichen Service. Achte unbedingt (!) auf die richtige Einrückung mit Leerzeichen.

   ```yaml
   services:
     # ...
     power-splitter:
       image: ghcr.io/solectrus/power-splitter:latest
       labels:
         - com.centurylinklabs.watchtower.scope=solectrus
       environment:
         - TZ
         - INFLUX_HOST
         - INFLUX_SCHEMA
         - INFLUX_TOKEN=${INFLUX_ADMIN_TOKEN}
         - INFLUX_PORT
         - INFLUX_ORG
         - INFLUX_BUCKET
         - INFLUX_SENSOR_GRID_IMPORT_POWER
         - INFLUX_SENSOR_HOUSE_POWER
         - INFLUX_SENSOR_WALLBOX_POWER
         - INFLUX_SENSOR_HEATPUMP_POWER
         - INFLUX_EXCLUDE_FROM_HOUSE_POWER
         - POWER_SPLITTER_INTERVAL
         - REDIS_URL=redis://redis:6379/1
       links:
         - influxdb
         - redis
       depends_on:
         influxdb:
           condition: service_healthy
         redis:
           condition: service_healthy
       restart: unless-stopped
   ```

   Der Power-Splitter liest aus der InfluxDB die Messwerte der Verbraucher sowie des Netzbezugs und schreibt die Aufteilung in ein neues Measurement mit der (unveränderlichen) Bezeichnung `power_splitter`.

   Wichtig beim `INFLUX_TOKEN` ist, dass dieses sowohl zum Schreiben als auch zum Lesen berechtigt. Du kannst das Admin-Token nehmen (wie oben angegeben) oder selbst ein neues Token im InfluxDB-Frontend anlegen (letzteres lohnt sich aber nur für bei hohen Sicherheitsanforderungen).

   Die `REDIS_URL` wird benötigt, um nach dem ersten Durchlauf einmalig den Cache leeren zu können.

   Wenn du eine verteilte Installation betreibst (Lokal + Cloud), solltest du den Service auf dem Cloud-Host installieren - also da, wo die InfluxDB läuft. Das reduziert den Traffic.

5. Starte die Container erneut mit `docker compose up -d`, diesmal wird der Power-Splitter mit gestartet.

   Wenn sich die Container gar nicht starten lassen sollten, hast du vermutlich den Service nicht richtig in die `docker-compose.yml` (oder `compose.yml`) eingefügt. Prüfe insbesondere die Einrückung, das ist bei YAML-Dateien äußerst wichtig.

   Verfolge nun die Log-Ausgabe des neuen Containers mit folgendem Befehl:\
   `docker compose logs power-splitter -f` (kann beendet werden mit `Strg+C`)

   Wenn du irgendwelche Fehlermeldungen siehst, kümmere dich zunächst darum, bevor du fortfährst.

   Wenn alles fehlerfrei läuft, wird der Power-Splitter zunächst die Daten der Vergangenheit bearbeiten, anschließend im Hintergrund weiterlaufen und jeweils den aktuellen Tag berechnen. Dies lässt sich alles genau im Log nachvollziehen. Es ist empfehlenswert, das zu tun. Nach einer gewissen Zeit (abhängig von Rechenpower und Datenmenge) wird die Berechnung der Vergangenheit abgeschlossen sein.

Geschafft :-) Wenn du in SOLECTRUS jetzt einen Zeitraum auswählst (Tag/Woche/Monat/Jahr/Gesamt), siehst du bei Haus, E-Auto und Wärmepumpe (sofern vorhanden) jeweils im Tooltip die Aufteilung des Verbrauchs. Außerdem erscheinen deren Diagramme in einer gestapelten Darstellung.

Quelltext im GitHub-Repository: \
[github.com/solectrus/power-splitter](https://github.com/solectrus/power-splitter)
