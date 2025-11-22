---
title: Inbetriebnahme von Ingest
sidebar:
  order: 3
  label: Inbetriebnahme
---

### 1. Ergänze `compose.yaml` und `.env`

Füge die notwendigen Zeilen in deine `compose.yaml` sowie `.env` ein (siehe [Konfiguration](konfiguration)).

Ingest greift auf die bestehende Variablen der SOLECTRUS-Konfiguration zu.

Ingest speichert Messwerte der letzten 12 Stunden in einer SQLite-Datenbank. Diese wird in einem Volume abgelegt (`INGEST_VOLUME_PATH=./ingest`). Der Ordner muss vorhanden sein, daher bitte vorher `mkdir ./ingest` ausführen.

### 2. Docker-Container neu starten und Logs beachten

Starte zunächst den neuen Container, d.h. führe im SOLECTRUS-Ordner den folgenden Befehl aus:

```bash
docker compose up -d
```

Wie üblich gilt - immer auf die Logs achten:

```bash
docker compose logs ingest -f
```

Das sollte beispielsweise so aussehen:

```
Ingest for SOLECTRUS, Version 0.3.1 (4dfeeb2), built at 2025-11-15 16:47 CET
https://github.com/solectrus/ingest
Copyright (c) 2025 Georg Ledermann

Using Ruby 3.4.7 on platform aarch64-linux-musl

Configured sensors:
  inverter_power_1          → SENEC:inverter_power
  inverter_power_2          → Garage:inverter_power
  grid_import_power         → SENEC:grid_power_plus
  grid_export_power         → SENEC:grid_power_minus
  battery_discharging_power → SENEC:bat_power_minus
  battery_charging_power    → SENEC:bat_power_plus
  wallbox_power             → SENEC:wallbox_charge_power
  heatpump_power            → Consumer:power (excluded from house_power)
  house_power               → SENEC:house_power

Calculated house_power will OVERRIDE the incoming value!

Forwarding to http://influxdb:8086

SQLite retention: 12 hours

Compacting database...
Done.

Checking database schema...
Up to date.

Starting OutboxWorker...
Starting CleanupWorker...

Puma starting in single mode...
* Puma version: 7.1.0 ("Neon Witch")
* Ruby version: ruby 3.4.7 (2025-10-08 revision 7a5688e2a2) +YJIT +PRISM [aarch64-linux-musl]
*  Min threads: 0
*  Max threads: 5
*  Environment: production
*          PID: 1
* Listening on http://0.0.0.0:4567
Use Ctrl-C to stop

```

Wenn das Log so ungefähr aussieht, ist alles gut. Wenn nicht, dann bitte nicht weitermachen, sondern erst die Fehler beseitigen.

Bitte auch prüfen, ob das Web-Interface unter `http://<IP>:4567` erreichbar und funktionsfähig ist.

Bis zu dieser Stelle ist die Änderung an der Konfiguration noch unkritisch. Es läuft nun ein weiter Container, der aber noch keine Messwerte empfängt. Das Dashboard wird unverändert weiter funktionieren und die exakt gleichen Messwerte anzeigen wie vorher.

### 3. Kollektoren anpassen

Nun kommt der entscheidende Schritt. Die Kollektoren müssen jetzt so konfiguriert werden, dass sie nicht mehr direkt nach InfluxDB schreiben, sondern nach Ingest. Hier ein Beispiel für den SENEC-Collector, dargestellt sind nur die zu ändernden Zeilen:

```yaml
senec-collector:
  environment:
    - INFLUX_HOST=ingest
    - INFLUX_PORT=4567
  depends_on:
    - ingest
  links:
    - ingest
```

Das bedeutet: Der Kollektor soll nicht mehr `influxdb` (Port `8086`), sondern nach `ingest` (Port `4567`) schreiben.

Falls ein Shelly-Collector und/oder ein MQTT-Collector vorhanden ist, müssen diese ebenfalls angepasst werden. Aus Effizienzgründen sollte man aber nur die Kollektoren anpassen (und somit deren Messwerte durch Ingest schicken), die für die Berechnung des Hausverbrauchs relevante Werte liefern (siehe Formel). Alle anderen (z.B. ein Forecast-Collector) können weiter direkt nach InfluxDB schreiben.

Nach der Anpassung der Kollektoren bitte die Container neu starten:

```bash
docker compose up -d
```

Nun müssen unbedingt wieder die Logs geprüft werden, und zwar diesmal der Kollektoren. Zum einen dürfen sie keine Fehler enthalten, zum anderen müssen sie jetzt an Ingest schreiben und nicht mehr direkt an InfluxDB.

Beim SENEC-Collector würde das so aussehen:

```
SENEC collector for SOLECTRUS, Version 0.19.2, built at 2025-11-11T06:03:32.524Z
https://github.com/solectrus/senec-collector
Copyright (c) 2020-2025 Georg Ledermann, released under the MIT License

Using Ruby 3.4.7 on platform aarch64-linux-musl
Pushing to InfluxDB at http://ingest:4567, bucket solectrus, measurement SENEC

Wait until InfluxDB is ready ... OK
```

Die Kollektoren gehen also weiterhin davon aus, dass sie nach InfluxDB schreiben. Tatsächlich schreiben sie aber (aufgrund der veränderten Angabe für `INFLUX_HOST` und `INFLUX_PORT`) nach Ingest, wo ein kompatibles Interface zur Entgegennahme von Messwerten bereitsteht.

### 4. Fertig!

Im Dashboard ist **nichts** anzupassen. Wenn alles korrekt eingerichtet ist, wird das Dashboard für die neu eingehenden Messwerte einen korrigierten Hausverbrauch anzeigen.

Die [Web-Oberfläche von Ingest](../web-oberflaeche) mit einigen Kennzahlen ist unter `http://<IP>:4567` erreichbar.
