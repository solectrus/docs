---
title: Konfiguration des Shelly-Collectors
sidebar:
  order: 2
  label: Konfiguration
---

Der Shelly-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

In der `compose.yaml` wird ein neuer Service namens `shelly-collector` hinzugefügt. Dieser sollte so aussehen:

```yaml
services:
  # ...
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
      - INFLUX_POWER_DATA_TYPE
    logging:
      driver: 'json-file'
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
  # ...
```

:::note
Einige Variablen für den Service werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Services und vermeidet Redundanzen.

| Name der Variablen in `.env` | Name der Variablen im Service |
| ---------------------------- | ----------------------------- |
| `INFLUX_TOKEN_WRITE`         | `INFLUX_TOKEN`                |
| `INFLUX_MEASUREMENT_SHELLY`  | `INFLUX_MEASUREMENT`          |

:::

## Umgebungsvariablen (`.env`)

#### SHELLY_HOST

Hostname des Shelly. Dies ist üblicherweise eine IP-Adresse, kann aber auch eine lokale Domain sein. Es darf **kein** `http://` oder `https://` enthalten sein!

:::note[Pflicht für lokalen Zugriff]
Für den lokalen Zugriff auf das Gerät zwingend benötigt. Kann leer bleiben, wenn der Zugriff über die Shelly-Cloud erfolgt, also `SHELLY_CLOUD_SERVER` gesetzt sind.
:::

```dotenv title="Beispiel"
SHELLY_HOST=192.168.178.5
```

#### SHELLY_PASSWORD

Optionales Passwort des Shelly. Dieses wird nur benötigt, wenn der Zugriff auf den Shelly durch ein Passwort geschützt ist. Das Passwort wird in der Regel im Web-Interface des Shelly unter _Settings / Device Settings / Authentication_ festgelegt.

:::note[Optional]
Wird nur bei lokalem Zugriff verwendet, wenn das Gerät passwortgeschützt ist.
:::

```dotenv title="Beispiel"
SHELLY_PASSWORD=my-shelly-password
```

#### SHELLY_CLOUD_SERVER

Name des Shelly-Cloud-Servers, z.B. `https://shelly-42-eu.shelly.cloud`

Welcher Server hier einzutragen ist, lässt sich in der Shelly-Cloud unter folgendem Link ablesen:
[https://control.shelly.cloud](https://control.shelly.cloud), dort unter _Settings / User Settings / Authorization cloud key_

Der Shelly muss in der Shelly-Cloud registriert sein und die Datenübermittlung in die Cloud muss aktiviert sein.

:::note[Pflicht für Cloud-Zugriff]
Für den Zugriff über die Shelly-Cloud zwingend benötigt. Muss leer bleiben, wenn der lokale Zugriff auf das Gerät erfolgen soll. Dann muss stattdessen `SHELLY_HOST` gesetzt werden.
:::

```dotenv title="Beispiel"
SHELLY_CLOUD_SERVER=https://shelly-42-eu.shelly.cloud
```

#### SHELLY_AUTH_KEY

Authentifizierungsschlüssel für den Zugriff auf die Shelly-Cloud. Dieser Schlüssel muss in der Shelly-Cloud erstellt werden und die Berechtigung haben, Daten des angegebenen Geräts abzurufen.

Welcher Schlüssel hier einzutragen ist, lässt sich in der Shelly-Cloud unter folgendem Link ablesen:
[https://control.shelly.cloud](https://control.shelly.cloud), dort unter _Settings / User Settings / Authorization cloud key / Get Key_

:::note[Pflicht für Cloud-Zugriff]
Für den Zugriff über die Shelly-Cloud zwingend benötigt, für lokalen Zugriff nicht benötigt.
:::

```dotenv title="Beispiel"
SHELLY_AUTH_KEY=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

#### SHELLY_DEVICE_ID

ID des Shelly-Geräts, das abgefragt werden soll. Diese ID kann in der Shelly-Cloud abgelesen werden.

Welche ID hier einzutragen ist, lässt sich in der Shelly-Cloud beim jeweiligen Gerät unter _Settings / Device information_ ablesen.

:::note[Pflicht für Cloud-Zugriff]
Für den Zugriff über die Shelly-Cloud zwingend benötigt, für lokalen Zugriff nicht benötigt.
:::

```dotenv title="Beispiel"
SHELLY_DEVICE_ID=12345abcdef0
```

#### SHELLY_INTERVAL

Häufigkeit der Abfrage des aktuellen Messwertes (in Sekunden). Es empfiehlt sich eine Abfrage alle 5 Sekunden, um eine gute Auflösung zu erhalten. Bei Nutzung des Cloud-Zugriff ist zu beachten, dass die Shelly-Cloud höchstens **einen Request pro Sekunde** zulässt. Das ist relevant, wenn man viele Shelly-Geräte abfragen möchte.

:::note[Optional]
Standard: `5`
:::

```dotenv title="Beispiel"
SHELLY_INTERVAL=10
```

#### SHELLY_INVERT_POWER

Das Vorzeichen der Leistung wird umgedreht, d.h. negative Werte werden zu positiven und umgekehrt. Dies ist nützlich, wenn der Shelly eine Stromerzeugung überwacht, z.B. bei einem Balkonkraftwerk.

:::note[Optional]
Standard: `false`

Mögliche Werte: `true`, `false`
:::

```dotenv title="Beispiel"
SHELLY_INVERT_POWER=true
```

#### INFLUX_HOST

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Docker-Services (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_HOST=influxdb
```

#### INFLUX_SCHEMA

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

:::note[Optional]
Standard: `http`
:::

```dotenv title="Beispiel"
INFLUX_SCHEMA=https
```

#### INFLUX_PORT

Port für die Verbindung zu InfluxDB. Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

:::note[Optional]
Standard: `8086`
:::

```dotenv title="Beispiel"
INFLUX_PORT=443
```

#### INFLUX_TOKEN

Token für den Zugriff auf InfluxDB. Dieser Token muss die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

Das Token kann manuell in InfluxDB erstellt werden, alternativ kann aber auch das `INFLUX_ADMIN_TOKEN` verwendet werden.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_TOKEN=my-super-secret-admin-token
```

#### INFLUX_ORG

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_ORG=solectrus
```

#### INFLUX_BUCKET

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```dotenv title="Beispiel"
INFLUX_BUCKET=solectrus
```

#### INFLUX_MEASUREMENT

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

:::note[Optional]
Standard: `Consumer`
:::

```dotenv title="Beispiel"
INFLUX_MEASUREMENT=Heatpump
```

Wenn man mehrere Shelly verwendet, müssen mehrere Collectoren eingerichtet werden, die jeweils ein eigenes Measurement verwenden, um die Messwerte sauber zu trennen. Mehr dazu in im Kapitel [Zusätzliche Shelly](/erweiterungen/mehrere-shelly/).

#### INFLUX_MODE

Modus, in dem die Messwerte an InfluxDB übertragen werden. Mögliche Werte sind `default` und `essential`:

- Im `essential`-Modus werden nur dann Messwerte nach InfluxDB geschrieben, wenn ein Verbrauch stattfindet (also nicht 0 ist). Dies spart Speicherplatz und schont die Datenbank. Es eignet sich vor allem für Geräte, die nur selten in Betrieb sind (z.B. Waschmaschine, Geschirrspüler etc). Beim Abschalten des Geräts wird einmalig ein Wert von 0 Watt geschrieben, um InfluxDB eine präzise Berechnung der Verbrauchsmenge zu ermöglichen.

- Im `default`-Modus wird jeder erhaltene Messwert nach InfluxDB geschrieben.

:::note[Optional]
Standard: `default`

Mögliche Werte: `default`, `essential`
:::

```dotenv title="Beispiel"
INFLUX_MODE=essential
```

#### INFLUX_POWER_DATA_TYPE

Datentyp für Leistungswerte in InfluxDB (Float oder Integer). Wenn dieser auf "Integer" gesetzt ist, werden alle Leistungswerte (power, power_a, power_b, power_c) als Ganzzahlen gespeichert. Dies ist nützlich bei der Migration von Systemen, die diese Werte zuvor als Ganzzahlen gespeichert haben, da InfluxDB keine Änderung des Datentyps eines Feldes erlaubt.

:::note[Optional]
Standard: `Float`

Mögliche Werte: `Float`, `Integer`
:::

```dotenv title="Beispiel"
INFLUX_POWER_DATA_TYPE=Integer
```

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

:::note[Optional]
Standard: `Europe/Berlin`
:::

```dotenv title="Beispiel"
TZ=Europe/Berlin
```
