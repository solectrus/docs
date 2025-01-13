---
title: Abonnieren von Topics
layout: page
parent: MQTT-Collector
nav_order: 2
---

# Abonnieren von MQTT-Nachrichten

Der MQTT-Collector kann Nachrichten von verschiedenen (beliebig vielen) Topics abonnieren, verarbeiten und dann in die InfluxDB schreiben. Dazu werden Zuordnungen ("Mappings") definiert und für jedes Mapping drei Dinge festgelegt:

- Wo kommt der Wert her, also welches "Topic" muss abonniert werden?
- Welche Verarbeitung ist notwendig (Vorzeichen-Behandlung, Datentyp-Konvertierung, JSON-Extraktion, Formelbildung)?
- Wohin in der InfluxDB soll der ermittelte Wert geschrieben werden (Measurement und Field)?

Jedes Mapping wird durch mehrere Umgebungsvariablen definiert, die mit dem Präfix `MAPPING_X_` beginnen, wobei `X` eine eindeutige Zahl (beginnend bei 0) sein muss.

## Verfügbare Umgebungsvariablen je Mapping

Für jedes einzelne Mapping stehen verschiedene Umgebungsvariablen zur Verfügung, von denen einige optional sind:

### `MAPPING_X_TOPIC`

Das Topic, das abonniert werden soll, z.B. `senec/0/ENERGY/GUI_INVERTER_POWER`.

### `MAPPING_X_JSON_KEY` (optional)

Falls das Topic einen JSON-Payload enthält (mit **nicht** verschachtelten Key/Value-Paaren), kann hier der Schlüssel angegeben werden, aus dem der Wert extrahiert werden soll. Ein Schlüssel ist immer ein String, z.B. `inverter_power`.

### `MAPPING_X_JSON_PATH` (optional)

Falls das Topic einen komplexen (z.B. verschachtelten) JSON-Payload enthält, kann hier der [JSONPath](https://goessner.net/articles/JsonPath/) angegeben werden, um den Wert zu extrahieren. Ein JSONPath beginnt immer mit `$.`, z.B. `$.example.foo.bar[2]`.

### `MAPPING_X_JSON_FORMULA` (optional)

Falls das Topic JSON liefert, kann ein Berechnungsschritt erfolgen, um den zu speichernden Messwert zu ermitteln. Hierzu muss eine Formel angegeben werden, die [einige mathematische Operationen](https://github.com/rubysolo/dentaku?tab=readme-ov-file#built-in-operators-and-functions) enthalten darf, z.B. `round({value} * 1.5`).

Die geschweiften Klammern `{}` dienen dazu, Werte aus dem JSON-Payload zu referenzieren. Es können dabei einfache Schlüssel oder JSONPath verwendet werden.

### `MAPPING_X_MEASUREMENT`

Der Name des InfluxDB-Measurement, in das der Wert geschrieben werden soll (unabhängig davon, ob er positiv oder negativ ist).

### `MAPPING_X_MEASUREMENT_POSITIVE` (optional)

Name des InfluxDB-Measurement, in das der Wert geschrieben werden soll, wenn er **positiv** ist. Andernfalls (also wenn er negativ oder `0` ist), wird `0` geschrieben.

### `MAPPING_X_MEASUREMENT_NEGATIVE` (optional)

Der Name des InfluxDB-Measurement, in das der (absolute) Wert geschrieben werden soll, wenn er **negativ** ist. Andernfalls (also wenn er positiv oder `0` ist), wird `0` geschrieben.

### `MAPPING_X_FIELD`

Der Name des InfluxDB-Feldes, in das der Wert geschrieben werden soll (unabhängig davon, ob er positiv oder negativ ist).

### `MAPPING_X_FIELD_POSITIVE` (optional)

Name des InfluxDB-Field, in das der Wert geschrieben werden soll, wenn er **positiv** ist. Andernfalls (also wenn er negativ oder `0` ist), wird `0` geschrieben.

### `MAPPING_X_FIELD_NEGATIVE` (optional)

Name des InfluxDB-Field, in das der Wert geschrieben werden soll, wenn er **negativ** ist. Andernfalls (also wenn er positiv oder `0` ist), wird `0` geschrieben.

### `MAPPING_X_TYPE`

Der Datentyp des Feldes. Möglich sind: `integer`, `float`, `string` oder `boolean`.

### `MAPPING_X_MIN` (optional, ab `v0.3.0`)

Untererer Grenzwert für Messwerte. Wird ein Wert unterhalb dieses Grenzwerts empfangen, wird er ignoriert und **nicht** in die InfluxDB geschrieben. Nützlich für Ausreißer oder offensichtlich fehlerhafte Werte, die sonst die Statistik verfälschen würden.

### `MAPPING_X_MAX` (optional, ab `v0.3.0`)

Oberer Grenzwert für Messwerte. Wird ein Wert oberhalb dieses Grenzwerts empfangen, wird er ignoriert und **nicht** in die InfluxDB geschrieben. Nützlich für Ausreißer oder offensichtlich fehlerhafte Werte, die sonst die Statistik verfälschen würden.

## Beispiele

### 1. Einfaches Mapping

Topic wird abonniert, der erhaltene Wert wird unverändert als Fließkommazahl in die InfluxDB geschrieben:

```properties
MAPPING_0_TOPIC=senec/0/ENERGY/GUI_INVERTER_POWER
MAPPING_0_MEASUREMENT=PV
MAPPING_0_FIELD=inverter_power
MAPPING_0_TYPE=float
```

### 2. Mapping mit Vorzeichen-Behandlung

Wenn die Werte des Topics positiv oder negativ sein können, erfolgt hier eine Aufteilung. Positive Werte werden in `grid_import_power` geschrieben, negative Werte in `grid_export_power`.

```properties
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

### 3. Mapping mit einfachem JSON-Payload

Verwendung von `JSON_KEY`:

```properties
MAPPING_2_TOPIC=my/little/nuclear/plant
MAPPING_2_JSON_KEY=radiation_level
MAPPING_2_MEASUREMENT=nuclear_power_plant
MAPPING_2_FIELD=radiation_level
MAPPING_2_TYPE=float
```

Aus einem JSON von beispielsweise `{"radiation_level": 90.5, "reactivity": 0.7}` resultiert der Wert `90.5`.

### 4. Mapping mit komplexem JSON-Payload

Verwendung von `JSON_PATH`:

```properties
MAPPING_3_TOPIC=go-e/ATTR
MAPPING_3_JSON_PATH=$.ccp[2]
MAPPING_3_MEASUREMENT=WALLBOX
MAPPING_3_FIELD=power
MAPPING_3_TYPE=float
```

Dies extrahiert den Wert aus einem Payload wie `{"ccp": [1,2,42,3]}`. In diesem Beispiel gibt es den Wert an der Stelle 2 (drittes Element) des Arrays `ccp` zurück, der `42` ist.

### 5. Mapping mit Formel

Es gibt zwei Möglichkeiten, eine Formel zu verwenden:

#### a) Bei JSON-Payload

```properties
MAPPING_4_TOPIC=my/little/nuclear/plant
MAPPING_4_JSON_FORMULA="round({reactivity} * {radiation_level}) + 42"
MAPPING_4_MEASUREMENT=nuclear_power_plant
MAPPING_4_FIELD=danger_level
MAPPING_4_TYPE=float
```

Aus einem JSON von z.B. `{"radiation_level": 90.5, "reactivity": 0.7}` entsteht `danger_level` mit `round(0.7 * 90.5) + 42`, also `105`.

#### b) Bei String-Payload (ab Version 0.5.0)

```properties
MAPPING_4_TOPIC=my/little/nuclear/plant/powerInKwH
MAPPING_4_FORMULA="round({value} * 1000)"
MAPPING_4_MEASUREMENT=nuclear_power_plant
MAPPING_4_FIELD=power
MAPPING_4_TYPE=integer
```

Um Gegensatz zum JSON-Fall wird hier der Wert über `{value}` referenziert und die Variable heißt `MAPPING_X_FORMULA`.

Aus einem Payload von z.B. `42.5` entsteht `power` mit `round(42.5 * 1000)`, also `42500`.

### 6. Mapping mit Grenzwerten

```properties
MAPPING_0_TOPIC=senec/0/ENERGY/GUI_INVERTER_POWER
MAPPING_0_MEASUREMENT=PV
MAPPING_0_FIELD=inverter_power
MAPPING_0_TYPE=float
MAPPING_0_MIN=5
MAPPING_0_MAX=15000
```

Werte unter `5` oder über `15000` werden ignoriert und nicht in die InfluxDB geschrieben.
