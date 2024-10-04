---
title: Konfiguration
layout: page
parent: MQTT-Collector
nav_order: 1
---

# Konfigurieren des MQTT-Collectors

Der MQTT-Collector wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  mqtt-collector:
    image: ghcr.io/solectrus/mqtt-collector:latest
    environment:
      - TZ
      - INFLUX_SCHEMA
      - INFLUX_HOST
      - INFLUX_TOKEN
      - INFLUX_ORG
      - INFLUX_BUCKET
      - INFLUX_PORT
      - MQTT_HOST
      - MQTT_PORT
      - MQTT_SSL
      - MQTT_USERNAME
      - MQTT_PASSWORD
      - MAPPING_0_TOPIC
      - MAPPING_0_JSON_KEY
      - MAPPING_0_JSON_PATH
      - MAPPING_0_JSON_FORMULA
      - MAPPING_0_MEASUREMENT
      - MAPPING_0_MEASUREMENT_POSITIVE
      - MAPPING_0_MEASUREMENT_NEGATIVE
      - MAPPING_0_FIELD
      - MAPPING_0_FIELD_POSITIVE
      - MAPPING_0_FIELD_NEGATIVE
      - MAPPING_0_TYPE
      - MAPPING_0_MIN
      - MAPPING_0_MAX
      - ... # weitere Mappings bei Bedarf
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

## Umgebungsvariablen

### `MQTT_HOST`

Hostname des MQTT-Brokers. Dies kann die IP-Adresse des lokal erreichbaren ioBroker sein, aber auch die Domain eines extern erreichbaren Brokers. Darf **kein** `http://` oder `https://` enthalten!

### `MQTT_PORT`

Port des MQTT-Brokers. Meist ist das `1883`.

### `MQTT_SSL`

Wenn der MQTT-Broker über TLS abgesichert ist, muss dieser Wert auf `true` gesetzt werden. Bei einem lokalen ioBroker ist das üblicherweise nicht der Fall, die Angabe kann dann entfallen oder auf `false` gesetzt werden.

### `MQTT_USERNAME`

Falls erforderlich: Benutzername für den Zugriff auf den MQTT-Broker.

### `MQTT_PASSWORD`

Falls erforderlich: Passwort für den Zugriff auf den MQTT-Broker.

### `INFLUX_HOST`

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

### `INFLUX_SCHEMA`

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Standardwert: `http`

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

### Topics

Für jedes Topic, das der MQTT-Collector abonnieren soll, muss ein Mapping definiert werden. Ein Mapping besteht aus mehreren Umgebungsvariablen, die mit dem Präfix `MAPPING_X_` beginnen, wobei `X` eine eindeutige Zahl sein muss.

Es stehen folgende Variablen zur Verfügung:

- `MAPPING_X_TOPIC`
- `MAPPING_X_JSON_KEY`
- `MAPPING_X_JSON_PATH`
- `MAPPING_X_JSON_FORMULA`
- `MAPPING_X_MEASUREMENT`
- `MAPPING_X_MEASUREMENT_POSITIVE`
- `MAPPING_X_MEASUREMENT_NEGATIVE`
- `MAPPING_X_FIELD`
- `MAPPING_X_FIELD_POSITIVE`
- `MAPPING_X_FIELD_NEGATIVE`
- `MAPPING_X_TYPE`
- `MAPPING_X_MIN`
- `MAPPING_X_MAX`

Eine ausführliche Beschreibung eines Mappings findet sich auf der folgenden Seite: \
[Abonnieren von Topics](topics).

{: .note}

Es ist unbedingt darauf zu achten, dass die definierten Variablen **alle** auch in der `compose.yaml` aufgeführt sind. Andernfalls sind sie für den MQTT-Collector nicht erreichbar.
