---
title: Konfiguration
layout: page
parent: SENEC-Collector
---

# Konfigurieren des SENEC-Collectors

Der Shelly-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  senec-collector:
    image: ghcr.io/solectrus/senec-collector:latest
    environment:
      - TZ
      - SENEC_ADAPTER
      - SENEC_HOST
      - SENEC_SCHEMA
      - SENEC_INTERVAL
      - SENEC_LANGUAGE
      - SENEC_USERNAME
      - SENEC_PASSWORD
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${SENEC_INFLUX_MEASUREMENT}
    restart: unless-stopped
    logging:
      options:
        max-size: 10m
        max-file: '3'
    depends_on:
      influxdb:
        condition: service_healthy
    links:
      - influxdb
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  influxdb:
    # ...

  watchtower:
    # ...
```

{:.note}

Die beiden Variablen `INFLUX_TOKEN` und `INFLUX_MEASUREMENT` werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Container und vermeidet Redundanzen.

## Umgebungsvariablen

### `SENEC_ADAPTER`

Betriebsmodus des Collectors

Erlaubte Werte: `local` oder `cloud` \
Standard: `local`

### `SENEC_HOST`

Hostname des SENEC Stromspeichers. Dies ist üblicherweise eine IP-Adresse, kann aber auch eine lokale Domain sein. Es darf **kein** `http://` oder `https://` enthalten sein!

Wird nur verwendet, wenn `SENEC_ADAPTER` auf `local` gesetzt ist.

### `SENEC_SCHEMA`

Das zu verwendende Protokoll für die Verbindung zum SENEC-Stromspeicher.

Erlaubte Werte: `http`, `https` \
Standard: `https`

Wird nur verwendet, wenn `SENEC_ADAPTER` auf `local` gesetzt ist.

### `SENEC_LANGUAGE`

Die Sprache, die für Status-Texte verwendet werden soll.

Erlaubte Werte: `de` (Deutsch), `en` (Englisch), `it` (Italienisch) \
Standard: `de`

Wird nur verwendet, wenn `SENEC_ADAPTER` auf `local` gesetzt ist.

### `SENEC_USERNAME`

E-Mail-Adresse für die Anmeldung bei `mein-senec.de`.

Wird nur verwendet, wenn `SENEC_ADAPTER` auf `cloud` gesetzt ist.

### `SENEC_PASSWORD`

Passwort für die Anmeldung bei `mein-senec.de`.

Wird nur verwendet, wenn `SENEC_ADAPTER` auf `cloud` gesetzt ist.

### `SENEC_SYSTEM_ID`

Die System-ID des SENEC-Geräts. Kann leer bleiben, wenn es nur ein System gibt. Der Collector ermittelt dann die verfügbaren IDs, listet sie im Protokoll auf und verwendet die **erste**.

Um eine andere als die erste ID zu verwenden, sollte die Angabe nächst leer bleiben, der Collector gestartet und die ID aus dem Protokoll entnommen werden. Die gewünschte ID kann dann in die Umgebungsvariablen eingetragen werden und wird beim nächsten Start verwendet.

Wird nur verwendet, wenn `SENEC_ADAPTER` auf `cloud` gesetzt ist.

### `SENEC_INTERVAL`

Das Intervall in Sekunden für die Häufigkeit der Datenabfrage

Wenn `SENEC_ADAPTER` auf `cloud` gesetzt ist, ist das Minimum 30 Sekunden, Standard ist 60 Sekunden.
Wenn `SENEC_ADAPTER` auf `local` gesetzt ist, ist das Minimum 5 Sekunden, Standard ist 5 Sekunden.

### `SENEC_IGNORE`

Deaktivieren bestimmter Messwerte, die nicht an InfluxDB gesendet werden sollen.
Dies ist nützlich, wenn einzelne Messwerte (z.B. der Wallbox) aus einer anderen Quelle entnommen werden sollen.

Komma-getrennte Liste von Feldern, keine Leerzeichen. Beispiel:

```properties
SENEC_IGNORE=wallbox_charge_power,grid_power_minus
```

Optional, Standard ist leer (d.h. alle Messwerte werden gesendet)

### `INFLUX_HOST`

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

### `INFLUX_SCHEMA`

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Optional, Standard ist `http`

### `INFLUX_PORT`

Port für die Verbindung zu InfluxDB.

Optional, Standard ist `8086`

Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

### `INFLUX_TOKEN`

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

### `INFLUX_ORG`

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `INFLUX_BUCKET`

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

### `INFLUX_MEASUREMENT`

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

Optional, Standard ist `SENEC`

## Beispielhafte .env

```properties
SENEC_ADAPTER=local
SENEC_HOST=192.168.178.29
SENEC_INTERVAL=5
SENEC_IGNORE=wallbox_charge_power
SENEC_INFLUX_MEASUREMENT=SENEC

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
```
