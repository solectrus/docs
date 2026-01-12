---
title: Was ist das Dashboard?
sidebar:
  order: 1
  label: Übersicht
---

Das **Dashboard** ist die interaktive Benutzeroberfläche von SOLECTRUS, die über einen Webbrowser verwendet wird.

Über den Port 3000 ist das Dashboard im Browser erreichbar. Die Adresse lautet dann beispielsweise `http://raspi:3000`. Der Port kann bei Bedarf geändert werden.

Das Dashboard benötigt Zugriff auf die drei Datenbanken (InfluxDB, PostgreSQL und Redis).

## Logging

Das Dashboard schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```log
SOLECTRUS Photovoltaic Dashboard
Copyright (C) 2020-2025 Georg Ledermann
License: GNU AGPLv3 - https://www.gnu.org/licenses/agpl-3.0.html
Version v0.20.3, built on 2025-10-01T12:31:42+02:00
Using ruby 3.4.6 (2025-09-16 revision dbd83256b1) +YJIT +PRISM [aarch64-linux-musl]
Based on Alpine Linux 3.22.1

## Waiting for services...
redis (172.18.0.3:6379) open
Redis is up and running!
influxdb (172.18.0.4:8086) open
InfluxDB is up and running!
postgresql (172.18.0.2:5432) open
PostgreSQL is up and running!

## Preparing database...
Database is ready!

## Starting Rails application...
=> Booting Puma
=> Rails 8.0.3 application starting in production
=> Run `bin/rails server --help` for more startup options
Sensor initialization started
  - Sensor INVERTER_POWER                 → SENEC:inverter_power
  - Sensor HOUSE_POWER                    → SENEC:house_power
  - Sensor HEATPUMP_POWER                 → Consumer:power
  - Sensor GRID_IMPORT_POWER              → SENEC:grid_power_plus
  - Sensor GRID_EXPORT_POWER              → SENEC:grid_power_minus
  - Sensor BATTERY_CHARGING_POWER         → SENEC:bat_power_plus
  - Sensor BATTERY_DISCHARGING_POWER      → SENEC:bat_power_minus
  - Sensor WALLBOX_POWER                  → SENEC:wallbox_charge_power
  - Sensor INVERTER_POWER_1               → SENEC:mpp1_power
  - Sensor INVERTER_POWER_2               → SENEC:mpp2_power
  - Sensor INVERTER_POWER_3               → SENEC:mpp3_power
  - Sensor CUSTOM_POWER_01                → Fridge:power
  - Sensor CUSTOM_POWER_02                → Dishwasher:power
  - Sensor CUSTOM_POWER_03                → Washer:power
  - Sensor CUSTOM_POWER_04                → Oven:power
  - Sensor CUSTOM_POWER_05                → Dryer:power
  - Sensor CUSTOM_POWER_06                → Hob:power
  - Sensor CUSTOM_POWER_07                → Sauna:power
  - Sensor CUSTOM_POWER_08                → Pool:power
  - Sensor CUSTOM_POWER_09                → Garden:power
  - Sensor CUSTOM_POWER_10                → Heating:power
  - Sensor HOUSE_POWER_GRID               → power_splitter:house_power_grid
  - Sensor WALLBOX_POWER_GRID             → power_splitter:wallbox_power_grid
  - Sensor HEATPUMP_POWER_GRID            → power_splitter:heatpump_power_grid
  - Sensor BATTERY_CHARGING_POWER_GRID    → power_splitter:battery_charging_power_grid
  - Sensor CUSTOM_POWER_01_GRID           → power_splitter:custom_power_01_grid
  - Sensor CUSTOM_POWER_02_GRID           → power_splitter:custom_power_02_grid
  - Sensor CUSTOM_POWER_03_GRID           → power_splitter:custom_power_03_grid
  - Sensor CUSTOM_POWER_04_GRID           → power_splitter:custom_power_04_grid
  - Sensor CUSTOM_POWER_05_GRID           → power_splitter:custom_power_05_grid
  - Sensor CUSTOM_POWER_06_GRID           → power_splitter:custom_power_06_grid
  - Sensor INVERTER_POWER_FORECAST        → forecast:watt
  - Sensor GRID_EXPORT_LIMIT              → SENEC:power_ratio
  - Sensor BATTERY_SOC                    → SENEC:bat_fuel_charge
  - Sensor CASE_TEMP                      → SENEC:case_temp
  - Sensor SYSTEM_STATUS                  → SENEC:current_state
  - Sensor SYSTEM_STATUS_OK               → SENEC:current_state_ok
  - Sensor HOUSE_POWER subtracts HEATPUMP_POWER
Sensor initialization completed
Configuration checked, no changes detected, summaries are still valid.
Redis available, cache enabled
Puma starting in single mode...
* Puma version: 7.0.4 ("Romantic Warrior")
* Ruby version: ruby 3.4.6 (2025-09-16 revision dbd83256b1) +YJIT +PRISM [aarch64-linux-musl]
*  Min threads: 3
*  Max threads: 3
*  Environment: production
*          PID: 1
* Listening on http://0.0.0.0:3000
Use Ctrl-C to stop
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs dashboard
```

Bei Problemen oder Fehlern wird dies ebenfalls protokolliert. Es empfiehlt sich daher unbedingt, im Zweifelsfall zuerst das Protokoll zu prüfen.

:::note
Bei einer veralteten Konfiguration wird dies ebenfalls im Protokoll festgehalten. Es empfiehlt sich dann, in einer ruhigen Minute auf die neue [Sensor-Konfiguration umzustellen](/anleitungen/sensor-konfiguration).
:::

## Quelltext

SOLECTRUS ist in Ruby on Rails implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/solectrus](https://github.com/solectrus/solectrus)
