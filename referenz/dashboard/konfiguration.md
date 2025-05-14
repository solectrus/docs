---
title: Konfiguration
layout: page
parent: Dashboard
nav_order: 1
---

# Konfigurieren des Dashboards

Das Dashboard wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  dashboard:
    image: ghcr.io/solectrus/solectrus:latest
    depends_on:
      postgresql:
        condition: service_healthy
      influxdb:
        condition: service_healthy
      redis:
        condition: service_healthy
    links:
      - postgresql
      - influxdb
      - redis
    ports:
      - 3000:3000
    environment:
      - TZ
      - APP_HOST
      - FORCE_SSL
      - SECRET_KEY_BASE
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
      options:
        max-size: 10m
        max-file: '3'
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  influxdb:
    # ...

  postgresql:
    # ...

  redis:
    # ...
```

## Allgemeine Umgebungsvariablen

### `TZ`

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) für die Darstellung und Berücksichtigung von Uhrzeiten. Wichtig für die korrekte Darstellung von Diagrammen und Statistiken.

Standardwert: `Europe/Berlin`

### `APP_HOST`

Host der Anwendung. Darf eine IP-Adresse (z.B. `192.168.123.45`) oder eine Domain (z.B. `solectrus.example.com`) sein. Darf **kein** `http://` oder `https://` enthalten!

### `FORCE_SSL`

Gibt an, ob die App automatisch auf `HTTPS` umleiten soll. Standardwert ist `false`. Dieser Wert darf nur dann auf `true` gesetzt werden, wenn man eine eigene Domain mit Reverse-Proxy und SSL-Zertifikat verwendet! In den allermeisten Fällen bleibt es also bei `false`.

Standardwert: `false`

### `SECRET_KEY_BASE`

Geheimer Schlüssel für die Verschlüsselung von Session-Cookies. Dieser Wert muss geheim bleiben und sichert das Admin-Passwort ab.

Der String muss genau 128 Zeichen lang sein und kann beispielsweise mit `openssl rand -hex 64` generiert werden.

### `ADMIN_PASSWORD`

Zugangspasswort für den Administrator. Nur der Admin kann sich über die Web-Oberfläche anmelden und dort einige Einstellungen vornehmen (z.B. Bearbeiten von Strompreisen)

### `INSTALLATION_DATE`

Datum der Installation der PV-Anlage (wann die ersten Erträge erzielt wurden). Regelt die Navigation in der Web-Oberfläche.

### `CO2_EMISSION_FACTOR`

Faktor zur Berechnung der CO₂-Emission aus der PV-Erzeugung. Angabe in g/kWh.

Standardwert: `401` g/kWh

(ab Version `0.15.1` verfügbar)

### `LOCKUP_CODEWORD`

Codewort für die Sperrung der Web-Oberfläche. Wenn dieses Codewort gesetzt ist, lässt sich die Web-Oberfläche nur mit diesem Codewort entsperren. Wenn das Codewort leer ist, gibt es keine Sperrung.

Optional

### `FRAME_ANCESTORS`

Um die Einbettung der Web-Oberfläche in eine andere Webseite (per `iframe`) zu erlauben, kann hier die URL der übergeordneten Webseite angegeben werden. Beispiel: `https://example.com`.

Standardmäßig erlaubt SOLECTRUS keine Einbettung.

### `UI_THEME` (ab Version 0.17.1)

Farbschema für die Web-Oberfläche. Mögliche Werte sind `light` und `dark`. Wenn gewählt, wird das Farbschema auf das gewählte Schema fest eingestellt und kann über über die Oberfläche nicht mehr geändert werden. Nützlich ist das für den Einsatz auf einem Digital Signage Display, das man nicht interaktiv bedienen kann oder will.

Optional, Standardwert: leer

### `INFLUX_HOST`

Hostname des InfluxDB-Servers. Im Normalfall, wenn InfluxDB im gleichen Docker-Netzwerk läuft, ist das der Name des Containers (z.B. `influxdb`). Es kann aber auch ein externer InfluxDB-Server sein, z.B. `influxdb.example.com`.

### `INFLUX_SCHEMA`

Schema für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB, die über TLS abgesichert ist, muss dieser Wert auf `https` gesetzt werden.

Standardwert: `http`

### `INFLUX_PORT`

Port für die Verbindung zu InfluxDB. Bei Verwendung einer externen InfluxDB könnte eine Anpassung erforderlich sein, z.B. auf `443`.

Standardwert: `8086`

### `INFLUX_ORG`

Organisation in InfluxDB, in der die Daten gespeichert werden.

###`INFLUX_BUCKET`

Bucket in InfluxDB, in der die Daten gespeichert werden.

### `INFLUX_TOKEN`

Token für den Zugriff auf InfluxDB. Dieser Token muss in InfluxDB erstellt werden und die Berechtigung haben, Daten aus dem angegebenen Bucket zu **lesen** (kein Schreibzugriff erforderlich).

### `INFLUX_POLL_INTERVAL`

Intervall in Sekunden, in dem die App die Daten von InfluxDB abfragt und die Darstellung im Browser aktualisiert. Wenn der Werte zu klein ist (d.h. wenn Messwerte gar nicht so schnell in die InfluxDB gelangen), kommt es zur Fehlermeldung "Keine Verbindung" in der Web-Oberfläche.

Standardwert: `5`

## Umgebungsvariablen für die Sensor-Konfiguration (ab Version 0.15)

In InfluxDB werden die Messwerte in Form von Zeitreihen gespeichert. Jeder Messwert gehört zu einem "Measurement" und einem "Field". SOLECTRUS abstrahiert davon und definierten Sensoren. Über Umgebungsvariablen wird definiert, wo in der InfluxDB die Messwerte zu finden sind.

Ein Sensor wird durch einen Namen identifiziert und einem "Measurement" und einem "Field" in InfluxDB zugeordnet. Die Umgebungsvariable gibt die Zuordnung mit einem Doppelpunkt getrennt an. Wenn beispielsweise die PV-Erzeugung im Measurement "SENEC" und dort im Field "inverter_power" erfolgt, sieht der Eintrag wie folgt aus:

```properties
INFLUX_SENSOR_INVERTER_POWER=SENEC:inverter_power
```

Jeder Sensor muss definiert werden, um keine Warnung im Protokoll zu provozieren. Wenn für einen Sensor keine Werte zur Verfügung stehen (weil man z.B. keine Wärmepumpe hat), muss der Sensor "leer" definiert werden, und zwar so:

```properties
INFLUX_SENSOR_HEATPUMP_POWER=
```

### `INFLUX_SENSOR_INVERTER_POWER`

PV-Erzeugung (Leistung des Wechselrichters) in Watt.

Ab Version `0.20` ist damit die Gesamterzeugung gemeint, also inklusive etwaiger Balkonkraftwerke oder separat betriebener Wechselrichter.

Falls es einen Gesamtwert nicht gibt, ist die Variable explizit als leer zu definieren, also so:

```properties
INFLUX_SENSOR_INVERTER_POWER=
```

Damit wird der Gesamtwert dann automatisch berechnet, indem die Werte der einzelnen Wechselrichter addiert werden.

### `INFLUX_SENSOR_INVERTER_POWER_X` (ab Version 0.20, optional)

Bis zu **fünf** separate Erzeuger. Diese Variablen sind optional und werden nur benötigt, wenn Messwerte für einzelne Wechselrichter (oder Stränge) vorhanden sind.

Beispiel:

```properties
INFLUX_SENSOR_INVERTER_POWER_1=pv:mpp_1
INFLUX_SENSOR_INVERTER_POWER_2=pv:mpp_2
INFLUX_SENSOR_INVERTER_POWER_3=pv:mpp_3
INFLUX_SENSOR_INVERTER_POWER_4=balcony:value
INFLUX_SENSOR_INVERTER_POWER_5=
```

### `INFLUX_SENSOR_HOUSE_POWER`

Hausverbrauch in Watt

### `INFLUX_SENSOR_GRID_IMPORT_POWER`

Strombezug aus dem Netz in Watt

### `INFLUX_SENSOR_GRID_EXPORT_POWER`

Stromabgabe ins Netz (Einspeisung) in Watt

### `INFLUX_SENSOR_BATTERY_CHARGING_POWER`

Ladeleistung des Batteriespeichers in Watt

### `INFLUX_SENSOR_BATTERY_DISCHARGING_POWER`

Entladeleistung des Batteriespeichers in Watt

### `INFLUX_SENSOR_BATTERY_SOC`

Ladestand des Batteriespeichers in Prozent

### `INFLUX_SENSOR_WALLBOX_POWER`

Ladeleistung der Wallbox (E-Auto) in Watt

### `INFLUX_SENSOR_CASE_TEMP`

Gehäuse-Temperatur des Wechselrichters (oder Stromspeichers) in °C

### `INFLUX_SENSOR_INVERTER_POWER_FORECAST`

Prognostizierte PV-Erzeugung in Watt

### `INFLUX_SENSOR_SYSTEM_STATUS`

Systemstatus (z.B. Fehlermeldungen) als Text

### `INFLUX_SENSOR_SYSTEM_STATUS_OK`

Kennzeichnung, ob der Systemstatus als "in Ordnung" aufgefasst werden soll (Darstellung als grüner Punkt) oder nicht (orangefarbener Punkt)

### `INFLUX_SENSOR_GRID_EXPORT_LIMIT`

Einspeiseleistungsbegrenzung in Prozent

### `INFLUX_SENSOR_HEATPUMP_POWER`

Leistung der Wärmepumpe in Watt

### `INFLUX_SENSOR_WALLBOX_CAR_CONNECTED` (ab Version 0.17)

Verbindungsstatus des E-Auto (True/False)

### `INFLUX_SENSOR_CAR_BATTERY_SOC` (ab Version 0.17)

Ladestand des E-Autos in Prozent

### `INFLUX_SENSOR_CUSTOM_POWER_01` bis `INFLUX_SENSOR_CUSTOM_POWER_20` (ab Version 0.19)

Stromverbrauch eines benutzerdefinierten Sensors in Watt.

## Fallback auf alte Konfiguration

Wenn ein Sensor nicht definiert ist (z.B. weil die SOLECTRUS-Installation mit `v0.14.5` oder früher erfolgt ist), dann versucht SOLECTRUS, die Konfiguration automatisch zu vermittelt. Hierzu werden die früheren (und mittlerweile veralteten) Umgebungsvariablen `INFLUX_MEASUREMENT_PV` und `INFLUX_MEASUREMENT_FORECAST` verwendet.

Im Docker-Protokoll finden sich dann Hinweise, welche Konfiguration vorgenommen wurde und wie man diese explizit in die `.env` schreiben kann. Diese sollte bei Gelegenheit gemacht werden, da zukünftige Versionen von SOLECTRUS die alte Konfiguration möglicherweise nicht mehr unterstützen werden.

## Erweiterte Sensor-Einstellungen

### `INFLUX_EXCLUDE_FROM_HOUSE_POWER` (optional)

Da der Hausverbrauch möglicherweise die Leistung von Wärmepumpe und/oder die Wallbox enthält, können Letztere aus dem Hausverbrauch herausgerechnet werden, um eine doppelte Zählung zu verhindern. Hierzu wird eine Liste von Sensoren angegeben, die aus dem Hausverbrauch ausgeschlossen werden sollen:

```properties
INFLUX_EXCLUDE_FROM_HOUSE_POWER=HEATPUMP_POWER,WALLBOX_POWER
```

Die Angabe erfolgt als Komma-separierte Liste von Sensor-Namen.

Auch die Angabe eines benutzerdefinierten Sensors ist hier möglich, z.B. so:

```properties
INFLUX_EXCLUDE_FROM_HOUSE_POWER=WALLBOX_POWER,CUSTOM_POWER_02,CUSTOM_POWER_08
```

Dadurch werden die angegebenen benutzerdefinierten Sensoren aus dem Hausverbrauch herausgerechnet und direkt in der Strombilanz aufgeführt.

### Veraltete Angaben

Frühere Versionen von SOLECTRUS haben folgende Umgebungsvariablen verwendet, die mittlerweile veraltet sind und gefahrlos entfernt werden können:

- `INFLUX_MEASUREMENT_PV` (ersetzt durch neue Sensor-Konfiguration)
- `INFLUX_MEASUREMENT_FORECAST` (ersetzt durch neue Sensor-Konfiguration)
- `ELECTRICITY_PRICE` (Strompreise, wird jetzt in der Web-Oberfläche konfiguriert)
- `FEED_IN_TARIFF` (Einspeisevergütung, wird jetzt in der Web-Oberfläche konfiguriert)
