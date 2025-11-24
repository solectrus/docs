---
title: Konfiguration des SENEC-Collectors
sidebar:
  order: 2
  label: Konfiguration
---

Der SENEC-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

In der `compose.yaml` wird ein neuer Service namens `senec-collector` hinzugefügt. Dieser sollte so aussehen:

```yaml
services:
  # ...
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
      - SENEC_TOTP_URI
      - INFLUX_HOST
      - INFLUX_SCHEMA
      - INFLUX_PORT
      - INFLUX_TOKEN=${INFLUX_TOKEN_WRITE}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_MEASUREMENT=${INFLUX_MEASUREMENT_SENEC}
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
| `INFLUX_MEASUREMENT_SENEC`   | `INFLUX_MEASUREMENT`          |

:::

## Umgebungsvariablen (`.env`)

#### SENEC_ADAPTER

Betriebsmodus des Collectors. Bestimmt, ob die Daten lokal vom SENEC-Gerät oder aus der SENEC-Cloud abgerufen werden.

:::note[Optional]
Standard: `local`

Mögliche Werte: `local`, `cloud`
:::

```properties title="Beispiel"
SENEC_ADAPTER=cloud
```

#### SENEC_HOST

Hostname des SENEC Stromspeichers. Dies ist üblicherweise eine IP-Adresse, kann aber auch eine lokale Domain sein. Es darf **kein** `http://` oder `https://` enthalten sein!

:::note[Pflicht bei `SENEC_ADAPTER=local`]
Für den lokalen Zugriff zwingend benötigt.
:::

```properties title="Beispiel"
SENEC_HOST=192.168.178.29
```

#### SENEC_SCHEMA

Das zu verwendende Protokoll für die Verbindung zum SENEC-Stromspeicher.

:::note[Optional]
Standard: `https`

Mögliche Werte: `http`, `https`

Wird nur verwendet, wenn `SENEC_ADAPTER=local`.
:::

```properties title="Beispiel"
SENEC_SCHEMA=http
```

#### SENEC_LANGUAGE

Die Sprache, die für Status-Texte verwendet werden soll.

:::note[Optional]
Standard: `de`

Mögliche Werte: `de` (Deutsch), `en` (Englisch), `it` (Italienisch)

Wird nur verwendet, wenn `SENEC_ADAPTER=local`.
:::

```properties title="Beispiel"
SENEC_LANGUAGE=de
```

#### SENEC_USERNAME

E-Mail-Adresse für die Anmeldung bei `mein-senec.de`.

:::note[Pflicht bei `SENEC_ADAPTER=cloud`]
Für den Cloud-Zugriff zwingend benötigt.
:::

```properties title="Beispiel"
SENEC_USERNAME=mail@example.com
```

#### SENEC_PASSWORD

Passwort für die Anmeldung bei `mein-senec.de`.

:::note[Pflicht bei `SENEC_ADAPTER=cloud`]
Für den Cloud-Zugriff zwingend benötigt.
:::

```properties title="Beispiel"
SENEC_PASSWORD=my-secret-password
```

#### SENEC_TOTP_URI

URI für die Multi-Faktor-Authentifizierung (MFA) bei `mein-senec.de` (sofern aktiviert). Anzugeben ist der vollständige String, sinnvollerweise mit Anführungszeichen.

Hat man den initialen QR-Code von SENEC vorliegen oder verwendet den Google Authenticator, so lässt sich die URI mit dem [QR Code Secret Decoder](https://marq24.github.io/qr-code-decoder/) ermitteln.

:::note[Optional]
Wird nur bei Cloud-Zugriff verwendet und auch nur, wenn MFA aktiviert ist.
:::

```properties title="Beispiel"
SENEC_TOTP_URI="otpauth://totp/SENEC:mail%40example.com?secret=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&digits=6&algorithm=SHA1&issuer=SENEC&period=30"
```

#### SENEC_SYSTEM_ID

Die System-ID des SENEC-Geräts. Kann leer bleiben, wenn es nur ein System gibt. Der Collector ermittelt dann die verfügbaren IDs, listet sie im Protokoll auf und verwendet die **erste**.

Um eine andere als die erste ID zu verwenden, sollte die Angabe zunächst leer bleiben, der Collector gestartet und die ID aus dem Protokoll entnommen werden. Die gewünschte ID kann dann in die Umgebungsvariablen eingetragen werden und wird beim nächsten Start verwendet.

:::note[Optional]
Wird nur bei Cloud-Zugriff verwendet.
:::

```properties title="Beispiel"
SENEC_SYSTEM_ID=12345
```

#### SENEC_INTERVAL

Das Intervall in Sekunden für die Häufigkeit der Datenabfrage.

:::note[Optional]
Standard bei `SENEC_ADAPTER=cloud`: `60` Sekunden (Minimum: 60)

Standard bei `SENEC_ADAPTER=local`: `5` Sekunden (Minimum: 5)
:::

```properties title="Beispiel"
SENEC_INTERVAL=10
```

#### SENEC_IGNORE

Deaktivieren bestimmter Messwerte, die **nicht** an InfluxDB gesendet werden sollen. Dies kann nützlich sein, wenn einzelne Messwerte (z.B. der Wallbox) aus einer anderen Quelle entnommen werden sollen.

Komma-getrennte Liste von Feldern, keine Leerzeichen.

:::note[Optional]
Standard: leer (d.h. alle Messwerte werden gesendet)
:::

```properties title="Beispiel"
SENEC_IGNORE=wallbox_charge_power,grid_power_minus
```

#### INFLUX_HOST

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Docker-Services (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_HOST=influxdb
```

#### INFLUX_SCHEMA

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

:::note[Optional]
Standard: `http`
:::

```properties title="Beispiel"
INFLUX_SCHEMA=https
```

#### INFLUX_PORT

Port für die Verbindung zu InfluxDB. Bei Verwendung einer externen, per TLS abgesicherten InfluxDB kann z.B. `443` eingestellt werden.

:::note[Optional]
Standard: `8086`
:::

```properties title="Beispiel"
INFLUX_PORT=443
```

#### INFLUX_TOKEN

Token für den Zugriff auf InfluxDB. Dieser Token muss die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

Das Token kann manuell in InfluxDB erstellt werden, alternativ kann aber auch das `INFLUX_ADMIN_TOKEN` verwendet werden.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_TOKEN=my-super-secret-admin-token
```

#### INFLUX_ORG

Organisation in InfluxDB, in der die Messwerte gespeichert werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_ORG=solectrus
```

#### INFLUX_BUCKET

Bucket in InfluxDB, in der die Messwerte gespeichert werden sollen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_BUCKET=solectrus
```

#### INFLUX_MEASUREMENT

Name des Measurements in InfluxDB, das die Messwerte aufnehmen soll.

:::note[Optional]
Standard: `SENEC`
:::

```properties title="Beispiel"
INFLUX_MEASUREMENT=power_storage
```

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

:::note[Optional]
Standard: `Europe/Berlin`
:::

```properties title="Beispiel"
TZ=Europe/Rome
```
