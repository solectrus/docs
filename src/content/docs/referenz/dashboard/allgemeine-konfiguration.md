---
title: Allgemeine Konfiguration des Dashboards
sidebar:
  order: 2
  label: Allgemeine Konfiguration
---

Das Dashboard wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

In der `compose.yaml` wird ein Service namens `dashboard` konfiguriert. Dieser sollte so aussehen:

```yaml
services:
  # ...
  dashboard:
    image: ghcr.io/solectrus/solectrus:latest
    depends_on:
      postgresql:
        condition: service_healthy
      influxdb:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - 3000:3000
    environment:
      - TZ
      - APP_HOST
      - FORCE_SSL
      - SECRET_KEY_BASE
      - WEB_CONCURRENCY
      - INSTALLATION_DATE
      - ADMIN_PASSWORD
      - FRAME_ANCESTORS
      - UI_THEME
      - CO2_EMISSION_FACTOR
      - DB_HOST=postgresql
      - DB_PASSWORD=${POSTGRES_PASSWORD}
      - DB_USER=postgres
      - REDIS_URL
      - INFLUX_HOST
      - INFLUX_TOKEN=${INFLUX_TOKEN_READ}
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_POLL_INTERVAL
      - INFLUX_SENSOR_INVERTER_POWER
      - INFLUX_SENSOR_INVERTER_POWER_1
      - INFLUX_SENSOR_INVERTER_POWER_2
      - INFLUX_SENSOR_INVERTER_POWER_3
      - INFLUX_SENSOR_INVERTER_POWER_4
      - INFLUX_SENSOR_INVERTER_POWER_5
      - INFLUX_SENSOR_HOUSE_POWER
      - INFLUX_SENSOR_GRID_IMPORT_POWER
      - INFLUX_SENSOR_GRID_EXPORT_POWER
      - INFLUX_SENSOR_BATTERY_CHARGING_POWER
      - INFLUX_SENSOR_BATTERY_DISCHARGING_POWER
      - INFLUX_SENSOR_BATTERY_SOC
      - INFLUX_SENSOR_WALLBOX_POWER
      - INFLUX_SENSOR_WALLBOX_CAR_CONNECTED
      - INFLUX_SENSOR_CASE_TEMP
      - INFLUX_SENSOR_INVERTER_POWER_FORECAST
      - INFLUX_SENSOR_SYSTEM_STATUS
      - INFLUX_SENSOR_SYSTEM_STATUS_OK
      - INFLUX_SENSOR_GRID_EXPORT_LIMIT
      - INFLUX_SENSOR_HEATPUMP_POWER
      - INFLUX_SENSOR_CAR_BATTERY_SOC
      - INFLUX_SENSOR_CUSTOM_POWER_01
      - INFLUX_SENSOR_CUSTOM_POWER_02
      - INFLUX_SENSOR_CUSTOM_POWER_03
      - INFLUX_SENSOR_CUSTOM_POWER_04
      - INFLUX_SENSOR_CUSTOM_POWER_05
      - INFLUX_SENSOR_CUSTOM_POWER_06
      - INFLUX_SENSOR_CUSTOM_POWER_07
      - INFLUX_SENSOR_CUSTOM_POWER_08
      - INFLUX_SENSOR_CUSTOM_POWER_09
      - INFLUX_SENSOR_CUSTOM_POWER_10
      - INFLUX_SENSOR_CUSTOM_POWER_11
      - INFLUX_SENSOR_CUSTOM_POWER_12
      - INFLUX_SENSOR_CUSTOM_POWER_13
      - INFLUX_SENSOR_CUSTOM_POWER_14
      - INFLUX_SENSOR_CUSTOM_POWER_15
      - INFLUX_SENSOR_CUSTOM_POWER_16
      - INFLUX_SENSOR_CUSTOM_POWER_17
      - INFLUX_SENSOR_CUSTOM_POWER_18
      - INFLUX_SENSOR_CUSTOM_POWER_19
      - INFLUX_SENSOR_CUSTOM_POWER_20
      - INFLUX_EXCLUDE_FROM_HOUSE_POWER
    healthcheck:
      test:
        - CMD-SHELL
        - nc -z 127.0.0.1 3000 || exit 1
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 10s
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus
  # ...
```

:::note
Einige Variablen für den Service werden anders lautenden Umgebungsvariablen entnommen. Dies ermöglicht eine Nutzung von Variablen für verschiedene Services und vermeidet Redundanzen.

| Name der Variablen in `.env` | Name der Variablen im Service |
| ---------------------------- | ----------------------------- |
| `POSTGRES_PASSWORD`          | `DB_PASSWORD`                 |
| `INFLUX_TOKEN_READ`          | `INFLUX_TOKEN`                |

:::

## Umgebungsvariablen (`.env`)

### Allgemein

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) für die Darstellung und Berücksichtigung von Uhrzeiten. Wichtig für die korrekte Darstellung von Diagrammen und Statistiken.

:::note[Optional]
Standard: `Europe/Berlin`
:::

```properties title="Beispiel"
TZ=Europe/Rome
```

#### APP_HOST

Hostname, über den das Dashboard erreichbar sein soll. Darf **kein** `http://` oder `https://` enthalten und auch keine Port-Nummer.

:::note[Optional]
Nur erforderlich, wenn eine eigene Domain verwendet wird
:::

```properties title="Beispiel"
APP_HOST=solectrus.example.com
```

#### FORCE_SSL

Gibt an, ob die App automatisch auf `HTTPS` umleiten soll. Dieser Wert darf **nur dann** auf `true` gesetzt werden, wenn man eine eigene Domain mit Reverse-Proxy und SSL-Zertifikat verwendet! In den allermeisten Fällen sollte man diesen Wert nicht setzen oder auf `false` lassen.

:::note[Optional]
Standard: `false`

Mögliche Werte: `true`, `false`
:::

```properties title="Beispiel"
FORCE_SSL=true
```

#### SECRET_KEY_BASE

Geheimer Schlüssel für die Verschlüsselung von Session-Cookies. Dieser Wert muss geheim bleiben und sichert das Admin-Passwort ab.

Der String muss genau 128 Zeichen lang sein und kann beispielsweise mit `openssl rand -hex 64` generiert werden. Eine Änderung bewirkt, dass bei Verwendung von `ADMIN_PASSWORD` oder `LOCKUP_CODEWORD` alle Benutzer sich erneut anmelden müssen.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
SECRET_KEY_BASE=6cce2d6cb3c86ae77f4a0471357830950b323eab4a99ee0e1b196dfd4767e6bf59c20c6404b64f66e67bdbd59aca37e9e2786d887010e16078d620e48186de88
```

#### WEB_CONCURRENCY

Anzahl der Web-Worker-Prozesse. Ein höherer Wert kann die Performance bei vielen gleichzeitigen Anfragen (durch viele Nutzer) verbessern, benötigt aber mehr RAM.

:::note[Optional]
Standard: `1`
:::

```properties title="Beispiel"
WEB_CONCURRENCY=3
```

#### ADMIN_PASSWORD

Zugangspasswort für den Administrator. Nur der Admin kann sich über die Web-Oberfläche [anmelden](/bedienung/administrator/) und dort einige Einstellungen vornehmen (z.B. Bearbeiten von Strompreisen).

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
ADMIN_PASSWORD=my-super-secret-password
```

#### INSTALLATION_DATE

Datum der Installation der PV-Anlage (wann die ersten Erträge erzielt wurden). Regelt die Navigation in der Web-Oberfläche.

:::note[Pflicht]
Muss zwingend gesetzt werden

Format: `YYYY-MM-DD`
:::

```properties title="Beispiel"
INSTALLATION_DATE=2024-01-15
```

#### CO2_EMISSION_FACTOR

Faktor zur Berechnung der CO₂-Emission aus der PV-Erzeugung. Angabe in g/kWh.

:::note[Optional]
Standard: `401`
:::

```properties title="Beispiel"
CO2_EMISSION_FACTOR=420
```

#### LOCKUP_CODEWORD

Codewort für die Sperrung der gesamten Web-Oberfläche. Wenn dieses Codewort gesetzt ist, lässt sich die Web-Oberfläche nur nach Eingabe dieses Codewort verwendet. Das ist nützlich, wenn man seine SOLECTRUS-Instanz über das Internet erreichbar macht und nicht möchte, dass unbefugte Personen die Messwerte einsehen können.

Das `LOCKUP_CODEWORD` ist nicht mit dem [`ADMIN_PASSWORD`](#admin_password) zu verwechseln. Das `ADMIN_PASSWORD` sichert nur verschiedene Einstellmöglichkeiten ab, während das `LOCKUP_CODEWORD` die gesamte Web-Oberfläche sperrt.

:::note[Optional]
Kann leer bleiben, wenn keine Sperrung gewünscht ist
:::

```properties title="Beispiel"
LOCKUP_CODEWORD=my-secret-codeword
```

#### FRAME_ANCESTORS

Um die Einbettung der Web-Oberfläche in eine andere Webseite (per `iframe`) zu erlauben, kann hier die URL der übergeordneten Webseite angegeben werden. Nützlich ist das beispielweise, wenn man SOLECTRUS direkt in Home Assistant darstellen möchte.

:::note[Optional]
Kann leer bleiben, wenn keine Einbettung gewünscht ist
:::

```properties title="Beispiel"
FRAME_ANCESTORS=https://example.com
```

#### UI_THEME

Farbschema für die Web-Oberfläche. Mögliche Werte sind `light` und `dark`. Wenn gewählt, wird das Farbschema auf das gewählte Schema fest eingestellt und kann über die Oberfläche nicht mehr geändert werden. Nützlich ist das für den Einsatz auf einem Digital Signage Display, das man nicht interaktiv bedienen kann oder will.

:::note[Optional]
Standard: leer (Benutzer kann wählen)

Mögliche Werte: `light`, `dark`
:::

```properties title="Beispiel"
UI_THEME=dark
```

#### DB_HOST

Hostname für den Zugriff auf [PostgreSQL](/referenz/postgresql). Muss dem Namen des Services in der `compose.yaml` entsprechen, also normalerweise `postgresql`.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
DB_HOST=postgresql
```

#### DB_USER

Benutzername für den Zugriff auf [PostgreSQL](/referenz/postgresql).

:::note[Optional]
Standard: `postgres`
:::

```properties title="Beispiel"
DB_USER=postgres
```

#### DB_PASSWORD

Passwort für den Zugriff auf [PostgreSQL](/referenz/postgresql). Da die Variable in der `.env` anders heißt (nämlich `POSTGRES_PASSWORD`), wird der Wert in der `compose.yaml` über `${POSTGRES_PASSWORD}` referenziert.

:::note[Pflicht]
Muss zwingend gesetzt werden (als `POSTGRES_PASSWORD` in `.env`)
:::

```properties title="Beispiel"
POSTGRES_PASSWORD=my-postgres-password
```

#### REDIS_URL

URL für die Verbindung zu zum In-Memory-Cache [Redis](/referenz/redis).

:::note[Optional]
Standard: `redis://redis:6379/1`
:::

```properties title="Beispiel"
REDIS_URL=redis://redis:6379/1
```

#### INFLUX_HOST

Hostname von [InfluxDB](/referenz/influxdb). Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Docker-Services (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_HOST=influxdb
```

#### INFLUX_SCHEMA

Schema für die Verbindung zu [InfluxDB](/referenz/influxdb). Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

:::note[Optional]
Standard: `http`
:::

```properties title="Beispiel"
INFLUX_SCHEMA=https
```

#### INFLUX_PORT

Port für die Verbindung zu [InfluxDB](/referenz/influxdb). Bei Verwendung einer externen InfluxDB könnte eine Anpassung erforderlich sein, z.B. auf `443`.

:::note[Optional]
Standard: `8086`
:::

```properties title="Beispiel"
INFLUX_PORT=443
```

#### INFLUX_ORG

Organisation in [InfluxDB](/referenz/influxdb), in der die Daten gespeichert werden.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_ORG=solectrus
```

#### INFLUX_BUCKET

Bucket in [InfluxDB](/referenz/influxdb), in dem die Daten gespeichert werden.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_BUCKET=solectrus
```

#### INFLUX_TOKEN

Token für den Zugriff auf [InfluxDB](/referenz/influxdb). Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten aus dem angegebenen Bucket zu **lesen** (kein Schreibzugriff erforderlich).

Das Token kann manuell in InfluxDB erstellt werden, alternativ kann aber auch das `INFLUX_ADMIN_TOKEN` verwendet werden.

:::note[Pflicht]
Muss zwingend gesetzt werden
:::

```properties title="Beispiel"
INFLUX_TOKEN=my-super-secret-read-token
```

#### INFLUX_POLL_INTERVAL

Intervall in Sekunden, mit dem das Dashboard aktuelle Messwerte aus [InfluxDB](/referenz/influxdb) abfragt und die Darstellung im Browser aktualisiert.

Wenn der Wert zu klein ist, kann es zur Warnung "Keine Verbindung" in der Web-Oberfläche kommen.

:::note[Optional]
Standard: `5`
:::

```properties title="Beispiel"
INFLUX_POLL_INTERVAL=10
```

### Sensor-Konfiguration

Die Auflistung findet sich auf einer eigenen Seite: \
[Sensor-Konfiguration des Dashboards](/referenz/dashboard/sensor-konfiguration).

### Veraltete Angaben

Frühere Versionen von SOLECTRUS haben folgende Umgebungsvariablen verwendet, die mittlerweile veraltet sind und gefahrlos entfernt werden können:

- `ELECTRICITY_PRICE` (Strompreise, wird jetzt in der Web-Oberfläche konfiguriert)
- `FEED_IN_TARIFF` (Einspeisevergütung, wird jetzt in der Web-Oberfläche konfiguriert)
