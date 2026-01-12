---
title: Korrektur von Messwerten in InfluxDB
sidebar:
  hidden: true
---

Bei der Übernahme von Messwerten z.B. über den [MQTT-Collector](/referenz/mqtt-collector/) nach SOLECTRUS kann es in seltenen Fällen vorkommen, dass fehlerhafte Messwerte geliefert und dann in InfluxDB gespeichert werden.

Es gibt zwar Mechanismen, um fehlerhafte Daten zu erkennen und zu verhindern (beispielsweise die [Min/Max-Optionen des MQTT-Collectors](/referenz/mqtt-collector/topics#mapping_x_min-optional-ab-v030)), aber in der Praxis verwendet man das erst, wenn es zu ungewöhnlichen Werten kommt - dann aber liegen bereits fehlerhafte Daten in InfluxDB vor, die die historischen Statistiken verfälschen.

Das Löschen von Messwerten ist in InfluxDB nicht ohne weiteres möglich. Es ist aber möglich, bereits vorhandene Daten zu überschreiben. Dabei kann wie folgt vorgegangen werden:

### 0. Vorbereitung

Bevor Daten in InfluxDB korrigiert werden, sollte unbedingt eine [Sicherung der Datenbank](/anleitungen/datensicherung) erstellt werden.

### 1. Fehlerhafte Daten selektieren

In der [Weboberfläche von InfluxDB](/referenz/influxdb/direktzugriff) können mit dem "Data Explorer" auf unterschiedliche Weise Daten selektiert werden. Es empfiehlt sich die Verwendung des Script-Editors und das Schreiben von Flux-Queries. [Flux](https://docs.influxdata.com/influxdb/v2/query-data/get-started/) ist die Abfragesprache von InfluxDB und ermöglicht es, Daten zu filtern, zu aggregieren und zu transformieren.

InfluxDB speichert Messwerte in folgender Hierarchie: `Bucket` > `Measurement` > `Field` > `Value`. Ein `Bucket` ist ein Container für Daten (= Datenbank), ein `Measurement` ist eine Art Tabelle, ein `Field` ist eine Spalte in dieser Tabelle und ein `Value` ist ein Eintrag in dieser Spalte.

Wie genau Bucket, Measurement und Field heißen, hängt von der eigenen Konfiguration ab.

Hier ein Beispiel, um alle Daten zum Ladestand des Hausakkus abzurufen, die einen Wert größer 100 oder kleiner 0 aufweisen (also offensichtlich fehlerhaft sind):

```
from(bucket: "solectrus")
|> range(start: 0) // Keine zeitliche Einschränkung
|> filter(fn: (r) => r._measurement == "pv")
|> filter(fn: (r) => r._field == "battery_soc")
|> filter(fn: (r) => r._value > 100 or r._value < 0)
```

![Query](@assets/datenkorrektur/influx-query.jpeg)

Möchte man die Werte beispielsweise nur für einen bestimmten Zeitraum erhalten, wäre folgende Abfrage einzugeben (hier am Beispiel für Januar 2024):

```
from(bucket: "solectrus")
|> range(start: 2024-01-01T00:00:00Z, stop: 2024-02-01T00:00:00Z) // Januar 2024
|> filter(fn: (r) => r._measurement == "pv")
|> filter(fn: (r) => r._field == "battery_soc")
|> filter(fn: (r) => r._value > 100 or r._value < 0)
```

### 2. Messwerte als CSV exportieren

Hat man fehlerhafte Messwerte selektiert, können diese im CSV-Format als Datei exportiert werden. Hier entsteht jedoch ein kleines Problem, da der zugehörige Button "CSV" nur bei einer sicheren HTTPS-Verbindung angezeigt wird. Wenn InfluxDB jedoch auf einem lokalen Server betrieben wird, ist die Verbindung in der Regel unverschlüsselt und der Button wird nicht angezeigt.

Zumindest für Chromium-basierte Browser (Chrome, Opera, Edge, ...) lässt sich dies temporär umgehen, indem über die URL `chrome://flags/#unsafely-treat-insecure-origin-as-secure` die Option "Insecure origins treated as secure" aktiviert wird. Hier kann die URL der InfluxDB-Weboberfläche eingetragen werden (z.B. `http://192.168.2.50:8086`), so dass die Verbindung als sicher behandelt wird.

![Query](@assets/datenkorrektur/chrome.jpeg)

### 3. CSV bearbeiten

Die heruntergeladene CSV-Datei enthält Daten in folgender Struktur:

```csv
#group,false,false,true,true,false,false,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string
#default,\_result,,,,,,,
,result,table,\_start,\_stop,\_time,\_value,\_field,\_measurement
,,0,1970-01-01T00:00:00Z,2024-12-08T09:02:04.372836299Z,2024-09-09T06:39:56Z,140,battery_soc,pv
,,0,1970-01-01T00:00:00Z,2024-12-08T09:02:04.372836299Z,2024-09-09T06:40:06Z,140,battery_soc,pv
,,0,1970-01-01T00:00:00Z,2024-12-08T09:02:04.372836299Z,2024-09-09T06:40:15Z,140,battery_soc,pv
```

Die Datei kann über einen Texteditor oder auch Excel bearbeitet werden. Zu korrigieren wären in diesem Beispiel die fehlerhaften Werte von 140, die für einen SOC des Akkus keinen Sinn ergeben. Wohlgemerkt: Die Daten müssen **korrigiert** werden und dürfen **nicht gelöscht** werden! Es müssen weiterhin sämtliche Zeilen und Spalten erhalten bleiben, da InfluxDB (auf dem gewählten Weg) keine Daten löschen kann.

:::caution
Beim Speichern der Datei ist unbedingt darauf zu achten, dass die Struktur nicht verändert wird. Insbesondere muss das Trennzeichen ein `,` (Komma) bleiben und darf nicht durch `;` (Semikolon) ersetzt werden, was bei der Nutzung von Excel automatisch passieren kann. Es ist daher sehr empfehlenswert, einen Texteditor (und nicht Excel) zu verwenden, sodass keine unbeabsichtigten Änderungen vorgenommen werden.
:::

### 4. Korrigierte CSV-Datei re-importieren

Im Menü der Weboberfläche kann nun über `Load Data` > `Sources` > `Upload a CSV` einfach per Drag-and-Drop die korrigierten Datei in den Bucket von SOLECTRUS geladen werden. InfluxDB überschreibt dabei die vorhandenen Daten.

![Query](@assets/datenkorrektur/influx-import.jpeg)

### 5. Abschluss

Nach dem erfolgreichen Import der korrigierten Datei müssen diese in der Weboberfläche von InfluxDB ersichtlich sein. Über den "Data Explorer" kann das geprüft werden.

Je nachdem, was genu man korrigiert hat, müssen abschließend die Tageszusammenfassungen in SOLECTRUS neu berechnet werden. Dies erreicht man dadurch, dass man in SOLECTRUS auf der Seite "Einstellungen" im Abschnitt "Tageszusammenfassungen" den Link "Zurücksetzen" betätigt.
