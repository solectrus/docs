---
title: Konfiguration
layout: page
parent: MQTT-Collector
---

# Konfiguration über Umgebungsvariablen

SOLECTRUS wird über Umgebungsvariablen konfiguriert. Diese stehen in der Datei `.env` im gleichen Verzeichnis wie die `compose.yml`. Jeder Container hat seine eigenen Variablen, mache Variablen werden von verschiedenen Containern benutzt.

Es ist zu beachten, dass die Umgebungsvariablen nicht nur in der `.env` definiert werden, sondern auch in der `compose.yml` aufgeführt werden (als Auflistung im Abschnitt `environment` des Services `mqtt-collector`). Andernfalls sind sie für den Collector nicht erreichbar.

Nach einer Bearbeitung von `.env` oder `compose.yml` müssen die Container neu erstellt werden, um die Änderungen zu übernehmen. Dies geschieht mit dem Befehl `docker compose up -d` (bei älteren Docker-Versionen `docker-compose up -d`, also mit Bindestrich).

Es folgt eine Auflistung der für den MQTT-Collector definierten Umgebungsvariablen, gültig ab Version `v0.2.0`.

## Zugang zum MQTT-Broker

- `MQTT_HOST`

  Hostname des MQTT-Brokers. Dies kann die IP-Adresse des lokal erreichbaren ioBroker sein, aber auch die Domain eines extern erreichbaren Brokers. Darf **kein** `http://` oder `https://` enthalten!

- `MQTT_PORT`

  Port des MQTT-Brokers. Meist ist das `1883`.

- `MQTT_SSL` (standardmäßig `false`)

  Wenn der MQTT-Broker über TLS abgesichert ist, muss dieser Wert auf `true` gesetzt werden. Bei einem lokalen ioBroker ist das üblicherweise nicht der Fall, die Angabe kann dann entfallen oder auf `false` gesetzt werden.

- `MQTT_USERNAME` (optional)

  Falls erforderlich: Benutzername für den Zugriff auf den MQTT-Broker.

- `MQTT_PASSWORD` (optional)

  Falls erforderlich: Passwort für den Zugriff auf den MQTT-Broker.

## Zugriff auf InfluxDB

- `INFLUX_HOST`

  Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

- `INFLUX_SCHEMA` (standardmäßig `http`)

  Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

- `INFLUX_PORT` (standardmäßig `8086`)

  Port für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB könnte eine Anpassung erforderlich sein, z.B. auf `443`.

- `INFLUX_ORG`

  Organisation in InfluxDB, in der die Daten gespeichert werden sollen.

- `INFLUX_BUCKET`

  Bucket in InfluxDB, in der die Daten gespeichert werden sollen.

- `INFLUX_TOKEN`

  Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten in den angegebenen Bucket zu **schreiben**.

## Abonnieren von MQTT-Nachrichten

Der MQTT-Collector kann Nachrichten von verschiedenen (beliebig vielen) Topics abonnieren, verarbeiten und dann in die InfluxDB schreiben. Dazu werden Zuordnungen ("Mappings") definiert und für jedes Mapping drei Dinge festgelegt:

- Wo kommt der Wert her, also welches "Topic" muss abonniert werden?
- Welche Verarbeitung ist notwendig (Vorzeichen-Behandlung, Datentyp-Konvertierung, JSON-Extraktion, Formelbildung)?
- Wohin in der InfluxDB soll der ermittelte Wert geschrieben werden (Measurement und Field)?

Jedes Mapping wird durch mehrere Umgebungsvariablen definiert, die mit dem Präfix `MAPPING_X_` beginnen, wobei `X` eine Zahl ab 0 sein sollte (was aber nicht zwingend ist). Sinnvoll, aber ebenfalls nicht zwingend ist, dass die Mappings in aufsteigender Reihenfolge definiert werden.

### Mögliche Umgebungsvariable je Mapping

Für jedes einzelne Mapping stehen verschiedene Umgebungsvariablen zur Verfügung, von denen einige optional sind:

- `MAPPING_X_TOPIC`

  Das Topic, das abonniert werden soll, z.B. `senec/0/ENERGY/GUI_INVERTER_POWER`.

- `MAPPING_X_JSON_KEY` (optional)

  Falls das Topic einen JSON-Payload (mit **nicht** verschachtelten key/value-Paaren) enthält, kann hier der Schlüssel angegeben werden, aus dem der Wert extrahiert werden soll. Ein Schlüssel ist immer ein String, z.B. `inverter_power`.

- `MAPPING_X_JSON_PATH` (optional)

  Falls das Topic einen komplexen (z.B. verschachtelten) JSON-Payload enthält, kann hier der [JSONPath](https://goessner.net/articles/JsonPath/) angegeben werden, um den Wert zu extrahieren. Ein JSONPath beginnt immer mit `$.`, z.B. `$.example.foo.bar[2]`.

- `MAPPING_X_JSON_FORMULA` (optional)

  Falls das Topic JSON liefert, kann ein Berechnungsschritt erfolgen, um den zu speichernden Messwert zu ermitteln. Hierzu muss eine Formel angegeben werden, die [einige mathematische Operationen](https://github.com/rubysolo/dentaku?tab=readme-ov-file#built-in-operators-and-functions) enthalten darf, z.B. `round({value} * 1.5`).

  Die geschweiften Klammern `{}` dienen dazu, Werte aus dem JSON-Payload zu referenzieren. Es können dabei einfache Schlüssel oder JSONPath verwendet werden.

- `MAPPING_X_MEASUREMENT`

  Der Name des InfluxDB-Measurement, in das der Wert geschrieben werden soll (unabhängig davon, ob er positiv oder negativ ist).

- `MAPPING_X_MEASUREMENT_POSITIVE` (optional)

  Name des InfluxDB-Measurement, in das der Wert geschrieben werden soll, wenn er **positiv** ist. Andernfalls (also wenn er negativ oder `0` ist), wird `0` geschrieben.

- `MAPPING_X_MEASUREMENT_NEGATIVE`

  Der Name des InfluxDB-Measurement, in das der (absolute) Wert geschrieben werden soll, wenn er **negativ** ist. Andernfalls (also wenn er positiv oder `0` ist), wird `0` geschrieben.

- `MAPPING_X_FIELD`

  Der Name des InfluxDB-Feldes, in das der Wert geschrieben werden soll.

- `MAPPING_X_FIELD_POSITIVE` (optional)

  Name des InfluxDB-Field, in das der Wert geschrieben werden soll, wenn er **positiv** ist. Andernfalls (also wenn er negativ oder `0` ist), wird `0` geschrieben.

- `MAPPING_X_FIELD_NEGATIVE` (optional)

  Name des InfluxDB-Field, in das der Wert geschrieben werden soll, wenn er **negativ** ist. Andernfalls (also wenn er positiv oder `0` ist), wird `0` geschrieben.

- `MAPPING_X_TYPE`

  Der Datentyp des Feldes. Möglich sind: `integer`, `float`, `string` oder `boolean`.

- `MAPPING_X_MIN` (optional, ab `v0.3.0`)

  Untererer Grenzwert für Messwerte. Wird ein Wert unterhalb dieses Grenzwerts empfangen, wird er ignoriert und **nicht** in die InfluxDB geschrieben. Nützlich für Ausreißer oder offensichtlich fehlerhafte Werte, die sonst die Statistik verfälschen würden.

- `MAPPING_X_MAX` (optional, ab `v0.3.0`)

  Oberer Grenzwert für Messwerte. Wird ein Wert oberhalb dieses Grenzwerts empfangen, wird er ignoriert und **nicht** in die InfluxDB geschrieben. Nützlich für Ausreißer oder offensichtlich fehlerhafte Werte, die sonst die Statistik verfälschen würden.

### Beispiele

#### 1. Einfaches Mapping

Topic wird abonniert, der erhaltene Wert wird unverändert als Float in die InfluxDB geschrieben:

```env
MAPPING_0_TOPIC=senec/0/ENERGY/GUI_INVERTER_POWER
MAPPING_0_MEASUREMENT=PV
MAPPING_0_FIELD=inverter_power
MAPPING_0_TYPE=float
```

#### 2. Mapping mit Vorzeichen-Behandlung

Wenn die Werte des Topics positiv oder negativ sein können, erfolgt hier eine Aufteilung. Positive Werte werden in `grid_import_power` geschrieben, negative Werte in `grid_export_power`.

```env
MAPPING_1_TOPIC=senec/0/ENERGY/GUI_GRID_POW
MAPPING_1_MEASUREMENT_POSITIVE=PV
MAPPING_1_MEASUREMENT_NEGATIVE=PV
MAPPING_1_FIELD_POSITIVE=grid_import_power
MAPPING_1_FIELD_NEGATIVE=grid_export_power
MAPPING_1_TYPE=float
```

- Falls der empfangene Wert positiv ist (z.B. `1000`): `grid_import_power` wird auf `1000` gesetzt, `grid_export_power` auf `0`.
- Falls der empfangene Wert negativ ist (z.B. `-500`): `grid_import_power` wird auf `0` gesetzt, `grid_export_power` auf `500`.
- Falls der empfangene Wert `0` ist: `grid_import_power` und `grid_export_power` werden beide auf `0` gesetzt.

#### 3. Mapping mit einfachem JSON-Payload

Verwendung von `JSON_KEY`:

```env
MAPPING_2_TOPIC=my/little/nuclear/plant
MAPPING_2_JSON_KEY=radiation_level
MAPPING_2_MEASUREMENT=nuclear_power_plant
MAPPING_2_FIELD=radiation_level
MAPPING_2_TYPE=float
```

Aus einem JSON von beispielsweise `{"radiation_level": 90.5, "reactivity": 0.7}` resultiert der Wert `90.5`.

#### 4. Mapping mit komplexem JSON-Payload

Verwendung von `JSON_PATH`:

```env
MAPPING_3_TOPIC=go-e/ATTR
MAPPING_3_JSON_PATH=$.ccp[2]
MAPPING_3_MEASUREMENT=WALLBOX
MAPPING_3_FIELD=power
MAPPING_3_TYPE=float
```

Dies extrahiert den Wert aus einem Payload wie `{"ccp": [1,2,42,3]}`. In diesem Beispiel gibt es den Wert an der Stelle 2 (drittes Element) des Arrays `ccp` zurück, der `42` ist.

#### 5. Mapping mit Formel

```env
MAPPING_4_TOPIC=my/little/nuclear/plant
MAPPING_4_JSON_FORMULA="round({reactivity} * {radiation_level}) + 42"
MAPPING_4_MEASUREMENT=nuclear_power_plant
MAPPING_4_FIELD=danger_level
MAPPING_4_TYPE=float
```

Aus einem JSON von z.B. `{"radiation_level": 90.5, "reactivity": 0.7}` entsteht `danger_level` mit `round(0.7 * 90.5) + 42`, also `105`.

#### 6. Mapping mit Grenzwerten

```env
MAPPING_0_TOPIC=senec/0/ENERGY/GUI_INVERTER_POWER
MAPPING_0_MEASUREMENT=PV
MAPPING_0_FIELD=inverter_power
MAPPING_0_TYPE=float
MAPPING_0_MIN=5
MAPPING_0_MAX=15000
```

Werte unter `5` oder über `15000` werden ignoriert und nicht in die InfluxDB geschrieben.
