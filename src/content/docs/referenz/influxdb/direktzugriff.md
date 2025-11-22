---
title: Zugriff auf die Weboberfläche von InfluxDB
sidebar:
  order: 3
  label: Direktzugriff
---

Es kann praktisch sein, auf InfluxDB auch direkt zugreifen zu können, um beispielsweise ganz spezielle Abfragen zu machen oder auszugsweise Daten zu exportieren.

InfluxDB bietet dafür eine sehr benutzerfreundliche Weboberfläche, die über den Browser erreichbar ist. Dazu muss der Port `8086` nach außen geöffnet werden, was durch folgende Ergänzung in der `compose.yaml` gelingt:

```yaml title="compose.yaml"
services:
  influxdb:
    # ...
    ports:
      - 8086:8086
```

Der Zugriff erfolgt dann über die URL `http://<IP-Adresse>:8086`. Es erscheint dann ein Login-Formular, in das die Zugangsdaten des Administrators von InfluxDB eingetragen werden müssen. Diese sind in der `.env`-Datei zu finden (`INFLUX_USERNAME` und `INFLUX_PASSWORD`).
