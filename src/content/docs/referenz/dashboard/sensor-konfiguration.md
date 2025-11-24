---
title: Sensor-Konfiguration des Dashboards
sidebar:
  order: 3
  label: Sensor-Konfiguration
---

In [InfluxDB](/referenz/influxdb) werden die Messwerte in Form von Zeitreihen gespeichert. Jeder Messwert gehört zu einem **Measurement** und einem **Field**. SOLECTRUS abstrahiert davon und definierten **Sensoren**, die über einen eindeutigen Namen identifiziert werden. Über Umgebungsvariablen wird definiert, wo genau in der InfluxDB die Messwerte zu einem Sensor zu finden sind.

Die Umgebungsvariable gibt dabei die Zuordnung in einer speziellen Schreibweise an, bei der Measurement und Field mit einem Doppelpunkt getrennt angegeben werden. Wenn beispielsweise die PV-Erzeugung im Measurement _SENEC_ und dort im Field _inverter_power_ erfolgt, sieht der Eintrag wie folgt aus:

```properties
INFLUX_SENSOR_INVERTER_POWER=SENEC:inverter_power
```

:::caution
Die Angabe von Measurement und Field ist **case-sensitive**, also auf die Groß- und Kleinschreibung ist unbedingt zu achten, da InfluxDB hier unterscheidet!
:::

Jeder Sensor muss definiert werden, um keine Warnung im Protokoll zu provozieren. Wenn für einen Sensor keine Werte zur Verfügung stehen (weil man z.B. keine Wärmepumpe hat), muss der Sensor "leer" definiert werden, und zwar so:

```properties
INFLUX_SENSOR_HEATPUMP_POWER=
```

## Verfügbare Sensoren

Die von SOLECTRUS unterstützten Sensoren lassen sich in verschiedene Kategorien einteilen. Jeder Sensor ist mit der zugehörigen Umgebungsvariablen verlinkt, in der sich weitere Informationen zur Bedeutung und Verwendung des Sensors finden.

#### Wechselrichter

| Sensor-Name                                           | Einheit              |
| ----------------------------------------------------- | -------------------- |
| [INVERTER_POWER](#influx_sensor_inverter_power)       | Watt                 |
| [INVERTER_POWER_1](#influx_sensor_inverter_power_x)   | Watt                 |
| [INVERTER_POWER_2](#influx_sensor_inverter_power_x)   | Watt                 |
| [INVERTER_POWER_3](#influx_sensor_inverter_power_x)   | Watt                 |
| [INVERTER_POWER_4](#influx_sensor_inverter_power_x)   | Watt                 |
| [INVERTER_POWER_5](#influx_sensor_inverter_power_x)   | Watt                 |
| [GRID_IMPORT_POWER](#influx_sensor_grid_import_power) | Watt                 |
| [GRID_EXPORT_POWER](#influx_sensor_grid_export_power) | Watt                 |
| [GRID_EXPORT_LIMIT](#influx_sensor_grid_export_limit) | Prozent              |
| [CASE_TEMP](#influx_sensor_case_temp)                 | °C                   |
| [SYSTEM_STATUS](#influx_sensor_system_status)         | Text                 |
| [SYSTEM_STATUS_OK](#influx_sensor_system_status_ok)   | Logisch (True/False) |

#### Stromspeicher

| Sensor-Name                                                           | Einheit |
| --------------------------------------------------------------------- | ------- |
| [BATTERY_SOC](#influx_sensor_battery_soc)                             | Prozent |
| [BATTERY_CHARGING_POWER](#influx_sensor_battery_charging_power)       | Watt    |
| [BATTERY_DISCHARGING_POWER](#influx_sensor_battery_discharging_power) | Watt    |

#### Verbraucher

| Sensor-Name                                       | Einheit |
| ------------------------------------------------- | ------- |
| [HOUSE_POWER](#influx_sensor_house_power)         | Watt    |
| [HEATPUMP_POWER](#influx_sensor_heatpump_power)   | Watt    |
| [CUSTOM_POWER_01](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_02](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_03](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_04](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_05](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_06](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_07](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_08](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_09](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_10](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_11](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_12](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_13](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_14](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_15](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_16](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_17](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_18](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_19](#influx_sensor_custom_power_xx) | Watt    |
| [CUSTOM_POWER_20](#influx_sensor_custom_power_xx) | Watt    |

#### Wallbox

| Sensor-Name                                                   | Einheit              |
| ------------------------------------------------------------- | -------------------- |
| [WALLBOX_POWER](#influx_sensor_wallbox_power)                 | Watt                 |
| [WALLBOX_CAR_CONNECTED](#influx_sensor_wallbox_car_connected) | Boolean (True/False) |

#### E-Auto

| Sensor-Name                                       | Einheit |
| ------------------------------------------------- | ------- |
| [CAR_BATTERY_SOC](#influx_sensor_car_battery_soc) | Prozent |

#### Prognose

| Sensor-Name                                                       | Einheit |
| ----------------------------------------------------------------- | ------- |
| [INVERTER_POWER_FORECAST](#influx_sensor_inverter_power_forecast) | Watt    |

## Umgebungsvariablen

Die Variablen beginnen alle mit dem Präfix `INFLUX_SENSOR_`, gefolgt vom eindeutigen Sensor-Namen.

#### INFLUX_SENSOR_INVERTER_POWER

PV-Erzeugung (Leistung des Wechselrichters) in Watt

```properties title="Beispiel"
INFLUX_SENSOR_INVERTER_POWER=SENEC:inverter_power
```

Damit ist die Gesamterzeugung gemeint, also inklusive etwaiger Balkonkraftwerke oder separat betriebener Wechselrichter. Falls es einen Gesamtwert nicht gibt, ist die Variable explizit als leer zu definieren, also so:

```properties
INFLUX_SENSOR_INVERTER_POWER=
```

Damit wird der Gesamtwert dann automatisch berechnet, indem die Werte der einzelnen Wechselrichter addiert werden.

#### INFLUX_SENSOR_INVERTER_POWER_X

Bis zu **fünf** separate Erzeuger, X ist eine Zahl zwischen `1` und `5`. Diese Variablen sind optional und werden nur benötigt, wenn Messwerte für einzelne Wechselrichter (oder Strings) vorhanden sind.

```properties title="Beispiel"
INFLUX_SENSOR_INVERTER_POWER_1=SENEC:mpp_1_power
INFLUX_SENSOR_INVERTER_POWER_2=SENEC:mpp_2_power
INFLUX_SENSOR_INVERTER_POWER_3=SENEC:mpp_3_power
INFLUX_SENSOR_INVERTER_POWER_4=balcony:power
INFLUX_SENSOR_INVERTER_POWER_5=
```

#### INFLUX_SENSOR_HOUSE_POWER

Hausverbrauch in Watt

```properties title="Beispiel"
INFLUX_SENSOR_HOUSE_POWER=SENEC:house_power
```

#### INFLUX_SENSOR_GRID_IMPORT_POWER

Strombezug aus dem Netz in Watt

```properties title="Beispiel"
INFLUX_SENSOR_GRID_IMPORT_POWER=SENEC:grid_power_plus
```

#### INFLUX_SENSOR_GRID_EXPORT_POWER

Stromabgabe ins Netz (Einspeisung) in Watt

```properties title="Beispiel"
INFLUX_SENSOR_GRID_EXPORT_POWER=SENEC:grid_power_minus
```

#### INFLUX_SENSOR_BATTERY_CHARGING_POWER

Ladeleistung des Batteriespeichers in Watt

```properties title="Beispiel"
INFLUX_SENSOR_BATTERY_CHARGING_POWER=SENEC:bat_power_plus
```

#### INFLUX_SENSOR_BATTERY_DISCHARGING_POWER

Entladeleistung des Batteriespeichers in Watt

```properties title="Beispiel"
INFLUX_SENSOR_BATTERY_DISCHARGING_POWER=SENEC:bat_power_minus
```

#### INFLUX_SENSOR_BATTERY_SOC

Ladestand des Batteriespeichers in Prozent

```properties title="Beispiel"
INFLUX_SENSOR_BATTERY_SOC=SENEC:bat_fuel_charge
```

#### INFLUX_SENSOR_WALLBOX_POWER

Ladeleistung der Wallbox (E-Auto) in Watt

```properties title="Beispiel"
INFLUX_SENSOR_WALLBOX_POWER=SENEC:wallbox_charge_power
```

#### INFLUX_SENSOR_CASE_TEMP

Gehäuse-Temperatur des Wechselrichters (oder Stromspeichers) in °C

```properties title="Beispiel"
INFLUX_SENSOR_CASE_TEMP=SENEC:case_temp
```

#### INFLUX_SENSOR_INVERTER_POWER_FORECAST

Prognostizierte PV-Erzeugung in Watt

```properties title="Beispiel"
INFLUX_SENSOR_INVERTER_POWER_FORECAST=forecast:watt
```

#### INFLUX_SENSOR_SYSTEM_STATUS

Systemstatus (z.B. Fehlermeldungen) als Text

```properties title="Beispiel"
INFLUX_SENSOR_SYSTEM_STATUS=SENEC:current_state
```

#### INFLUX_SENSOR_SYSTEM_STATUS_OK

Kennzeichnung, ob der Systemstatus als "in Ordnung" aufgefasst werden soll (Darstellung als grüner Punkt) oder nicht (orangefarbener Punkt)

```properties title="Beispiel"
INFLUX_SENSOR_SYSTEM_STATUS_OK=SENEC:current_state_ok
```

#### INFLUX_SENSOR_GRID_EXPORT_LIMIT

Einspeiseleistungsbegrenzung in Prozent. Gemeint ist nicht die Obergrenze (meist 70%), sondern die in einem einzelnen Moment gerade wirksame Begrenzung. Manche Wechselrichter liefern diesen Wert.

```properties title="Beispiel"
INFLUX_SENSOR_GRID_EXPORT_LIMIT=SENEC:power_ratio
```

#### INFLUX_SENSOR_HEATPUMP_POWER

Aktuelle Leistung der Wärmepumpe in Watt

```properties title="Beispiel"
INFLUX_SENSOR_HEATPUMP_POWER=Heatpump:power
```

#### INFLUX_SENSOR_WALLBOX_CAR_CONNECTED

Verbindungsstatus des E-Auto (True/False)

```properties title="Beispiel"
INFLUX_SENSOR_WALLBOX_CAR_CONNECTED=Wallbox:car_connected
```

#### INFLUX_SENSOR_CAR_BATTERY_SOC

Ladestand des E-Autos in Prozent

```properties title="Beispiel"
INFLUX_SENSOR_CAR_BATTERY_SOC=Trabant:soc
```

#### INFLUX_SENSOR_CUSTOM_POWER_XX

Stromverbrauch eines benutzerdefinierten Sensors in Watt.

Es können bis zu zwanzig benutzerdefinierte Sensoren definiert werden, wobei `XX` für eine Zahl zwischen `01` und `20` steht. Diese Sensoren können z.B. für einzelne Verbraucher im Haushalt verwendet werden (z.B. Waschmaschine, Kühlschrank, etc.).

```properties title="Beispiel"
INFLUX_SENSOR_CUSTOM_POWER_01=Fridge:power
INFLUX_SENSOR_CUSTOM_POWER_02=Dishwasher:power
INFLUX_SENSOR_CUSTOM_POWER_03=Washer:power
# ...
```

## Spezialität: Hausverbrauch anpassen

#### INFLUX_EXCLUDE_FROM_HOUSE_POWER

Da der Hausverbrauch möglicherweise die Leistung von Wärmepumpe, die Wallbox oder andere Verbraucher enthält, können diese aus dem Hausverbrauch herausgerechnet werden, um eine doppelte Zählung zu verhindern. Hierzu kann eine Liste von Sensoren angegeben werden, die aus dem Hausverbrauch ausgeschlossen werden sollen:

```properties title="Beispiel"
INFLUX_EXCLUDE_FROM_HOUSE_POWER=HEATPUMP_POWER,WALLBOX_POWER
```

Die Angabe erfolgt als Komma-separierte Liste von Sensor-Namen.

Auch die Angabe eines benutzerdefinierten Sensors ist hier möglich, z.B. so:

```properties title="Beispiel"
INFLUX_EXCLUDE_FROM_HOUSE_POWER=WALLBOX_POWER,CUSTOM_POWER_02,CUSTOM_POWER_08
```

Hier gibt es die Besonderheit, dass die benutzerdefinierten Sensoren nicht nur aus dem Hausverbrauch herausgerechnet werden, sondern auch in der Strombilanz separat (als eigene Segmente) aufgeführt werden.

## Fallback auf alte Konfiguration

Wenn ein Sensor nicht definiert ist (z.B. weil die SOLECTRUS-Installation **vor** `v0.15` erfolgt ist), dann versucht SOLECTRUS, die Konfiguration automatisch zu vermittelt. Hierzu werden die früheren (und mittlerweile veralteten) Umgebungsvariablen `INFLUX_MEASUREMENT_PV` und `INFLUX_MEASUREMENT_FORECAST` verwendet.

Im Docker-Protokoll finden sich dann Hinweise, welche Konfiguration vorgenommen wurde und wie man diese explizit in die `.env` schreiben kann. Diese sollte [bei Gelegenheit gemacht werden](/wartung/sensor-konfiguration), da zukünftige Versionen von SOLECTRUS die alte Konfiguration möglicherweise nicht mehr unterstützen werden.
