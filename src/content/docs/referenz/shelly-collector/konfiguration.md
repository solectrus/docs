---
title: Konfiguration des Shelly-Collectors
sidebar:
  order: 2
  label: Konfiguration
---

Der Shelly-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  shelly-collector:
    image: ghcr.io/solectrus/shelly-collector:latest
    environment:
      - TZ
      - SHELLY_HOST
      - SHELLY_PASSWORD
      - SHELLY_CLOUD_SERVER
      - SHELLY_AUTH_KEY
      - SHELLY_DEVICE_ID
      - SHELLY_INTERVAL
      - SHELLY_INVERT_POWER
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${INFLUX_MEASUREMENT_SHELLY}
      - INFLUX_MODE
    logging:
      options:
        max-size: 10m
        max-file: '3'
    restart: unless-stopped
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

:::note
Die beiden Variablen `INFLUX_TOKEN` und `INFLUX_MEASUREMENT` werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Container und vermeidet Redundanzen.
:::

## Umgebungsvariablen

#### SHELLY_HOST (nur für lokalen Zugriff, ab Version 0.6.0)

Hostname des Shelly. Dies ist üblicherweise eine IP-Adresse, kann aber auch eine lokale Domain sein. Es darf **kein** `http://` oder `https://` enthalten sein!

#### SHELLY_PASSWORD (nur für lokalen Zugriff, ab Version 0.10.0)

Optionales Passwort des Shelly. Dieses wird nur benötigt, wenn der Zugriff auf den Shelly durch ein Passwort geschützt ist. Das Passwort wird in der Regel im Web-Interface des Shelly unter _Settings / Device Settings / Authentication_ festgelegt.

#### SHELLY_CLOUD_SERVER (nur für Cloud-Zugriff, ab Version 0.6.0)

Name des Shelly-Cloud-Servers, z.B. `https://shelly-42-eu.shelly.cloud`

Welcher Server hier einzutragen ist, lässt sich in der Shelly-Cloud unter folgendem Link ablesen:
[https://control.shelly.cloud](https://control.shelly.cloud), dort unter _Settings / User Settings / Authorization cloud key_

Der Shelly muss in der Shelly-Cloud registriert sein und die Datenübermittlung in die Cloud muss aktiviert sein.

#### SHELLY_AUTH_KEY (nur für Cloud-Zugriff, ab Version 0.6.0)

Authentifizierungsschlüssel für den Zugriff auf die Shelly-Cloud. Dieser Schlüssel muss in der Shelly-Cloud erstellt werden und die Berechtigung haben, Daten des angegebenen Geräts abzurufen.

Welcher Schlüssel hier einzutragen ist, lässt sich in der Shelly-Cloud unter folgendem Link ablesen:
[https://control.shelly.cloud](https://control.shelly.cloud), dort unter _Settings / User Settings / Authorization cloud key / Get Key_

#### SHELLY_DEVICE_ID (nur für Cloud-Zugriff, ab Version 0.6.0)

ID des Shelly-Geräts, das abgefragt werden soll. Diese ID kann in der Shelly-Cloud abgelesen werden.

Welche ID hier einzutragen ist, lässt sich in der Shelly-Cloud beim jeweiligen Gerät unter _Settings / Device information_ ablesen.

#### SHELLY_INTERVAL

Häufigkeit der Abfrage des aktuellen Messwertes (in Sekunden). Es empfiehlt sich eine Abfrage alle 5 Sekunden, um eine gute Auflösung zu erhalten. Bei Nutzung des Cloud-Zugriff ist zu beachten, dass die Shelly-Cloud höchstens **einen Request pro Sekunde** zulässt. Das ist relevant, wenn man viele Shelly-Geräte abfragen möchte.

Standardwert: `5`

#### SHELLY_INVERT_POWER (ab Version 0.9.0)

Das Vorzeichen der Leistung wird umgedreht, d.h. negative Werte werden zu positiven und umgekehrt. Dies ist nützlich, wenn der Shelly eine Stromerzeugung überwacht, z.B. bei einem Balkonkraftwerk.

Standardwert: `false`

#### INFLUX_HOST

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Docker-Services (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

#### INFLUX_SCHEMA

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Standardwert: `http`

#### INFLUX_PORT

Port für die Verbindung zu InfluxDB.

Optional, Standard ist `8086`

Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

#### INFLUX_TOKEN

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

#### INFLUX_ORG

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

#### INFLUX_BUCKET

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

#### INFLUX_MEASUREMENT

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

#### INFLUX_MODE (ab Version 0.5.0)

Modus, in dem die Messwerte an InfluxDB übertragen werden. Mögliche Werte sind `default` und `essential`. Im `essential`-Modus werden nur dann Messwerte nach InfluxDB geschrieben, wenn ein Verbrauch stattfindet (also nicht 0 ist). Dies spart Speicherplatz und schont die Datenbank. Es eignet sich vor allem für Geräte, die nur selten in Betrieb sind (z.B. Waschmaschine, Geschirrspüler etc).

Beim Abschalten des Geräts wird einmalig ein Wert von 0 Watt geschrieben, um InfluxDB eine präzise Berechnung der Verbrauchsmenge zu ermöglichen.

Im `default`-Modus wird jeder erhaltene Messwert nach InfluxDB geschrieben.

## Beispielhafte .env

### Für lokalen Zugriff

```properties
SHELLY_HOST=192.168.178.5
SHELLY_PASSWORD=my-shelly-password
SHELLY_INTERVAL=5
INFLUX_MEASUREMENT_SHELLY=heatpump

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
INFLUX_MODE=essential
```

### Für Cloud-Zugriff

```properties
SHELLY_CLOUD_SERVER=https://shelly-42-eu.shelly.cloud
SHELLY_AUTH_KEY=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
SHELLY_DEVICE_ID=12345abcdef0
SHELLY_INTERVAL=5
INFLUX_MEASUREMENT_SHELLY=heatpump

INFLUX_HOST=influxdb
INFLUX_SCHEMA=http
INFLUX_PORT=8086
INFLUX_TOKEN_WRITE=my-super-secret-admin-token
INFLUX_ORG=solectrus
INFLUX_BUCKET=solectrus
INFLUX_MODE=essential
```
