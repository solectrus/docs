---
title: Dashboard
layout: page
parent: Referenz
nav_order: 1
---

# Dashboard

Das **Dashboard** ist die sichtbare, interaktive Benutzeroberfläche von SOLECTRUS.

Das Dashboard benötigt Zugriff auf die drei Datenbanken (InfluxDB, PostgreSQL und Redis).

Über den Port 3000 ist das Dashboard im Browser erreichbar. Die Adresse lautet dann beispielsweise `http://raspi:3000`. Der Port kann bei Bedarf geändert werden.

## Protokollierung

Das Dashboard schreibt ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
SOLECTRUS Photovoltaic Dashboard
Copyright (C) 2020-2025 Georg Ledermann
License: GNU AGPLv3 - https://www.gnu.org/licenses/agpl-3.0.html
Version v0.19.1, built on 2025-04-22T15:26:27+02:00
Using ruby 3.4.3 (2025-04-14 revision d0b7e5b6a0) +PRISM [aarch64-linux-musl]
Based on Alpine Linux 3.21.3

## Waiting for services...
redis (172.18.0.3:6379) open
Redis is up and running!
influxdb (172.18.0.5:8086) open
InfluxDB is up and running!
postgresql (172.18.0.4:5432) open
PostgreSQL is up and running!

## Preparing database...
Database is ready!

## Starting Rails application...
=> Booting Puma
=> Rails 8.0.2 application starting in production
=> Run `bin/rails server --help` for more startup options
Sensor initialization started
  - Sensor inverter_power                 → SENEC:inverter_power
  - Sensor house_power                    → SENEC:house_power
  - Sensor grid_import_power              → SENEC:grid_power_plus
  - Sensor grid_export_power              → SENEC:grid_power_minus
  - Sensor battery_charging_power         → SENEC:bat_power_plus
  - Sensor battery_discharging_power      → SENEC:bat_power_minus
  - Sensor wallbox_power                  → SENEC:wallbox_charge_power
  - Sensor custom_power_01                → Fridge:power
  - Sensor custom_power_02                → Dishwasher:power
  - Sensor custom_power_03                → Washer:power
  - Sensor custom_power_04                → Oven:power
  - Sensor custom_power_05                → Dryer:power
  - Sensor custom_power_06                → Hob:power
  - Sensor custom_power_07                → Sauna:power
  - Sensor custom_power_08                → Pool:power
  - Sensor custom_power_09                → Garden:power
  - Sensor custom_power_10                → Heating:power
  - Sensor house_power_grid               → power_splitter:house_power_grid
  - Sensor wallbox_power_grid             → power_splitter:wallbox_power_grid
  - Sensor battery_charging_power_grid    → power_splitter:battery_charging_power_grid
  - Sensor custom_power_01_grid           → power_splitter:custom_power_01_grid
  - Sensor custom_power_02_grid           → power_splitter:custom_power_02_grid
  - Sensor custom_power_03_grid           → power_splitter:custom_power_03_grid
  - Sensor custom_power_04_grid           → power_splitter:custom_power_04_grid
  - Sensor custom_power_05_grid           → power_splitter:custom_power_05_grid
  - Sensor custom_power_06_grid           → power_splitter:custom_power_06_grid
  - Sensor custom_power_07_grid           → power_splitter:custom_power_07_grid
  - Sensor custom_power_08_grid           → power_splitter:custom_power_08_grid
  - Sensor custom_power_09_grid           → power_splitter:custom_power_09_grid
  - Sensor custom_power_10_grid           → power_splitter:custom_power_10_grid
  - Sensor inverter_power_forecast        → forecast:watt
  - Sensor grid_export_limit              → SENEC:power_ratio
  - Sensor battery_soc                    → SENEC:bat_fuel_charge
  - Sensor wallbox_car_connected          → SENEC:ev_connected
  - Sensor case_temp                      → SENEC:case_temp
  - Sensor system_status                  → SENEC:current_state
  - Sensor system_status_ok               → SENEC:current_state_ok
  - Sensor HOUSE_POWER remains unchanged
Sensor initialization completed
Configuration checked, no changes detected, summaries are still valid.
Puma starting in single mode...
* Puma version: 6.6.0 ("Return to Forever")
* Ruby version: ruby 3.4.3 (2025-04-14 revision d0b7e5b6a0) +YJIT +PRISM [aarch64-linux-musl]
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

Bei Problemen oder Fehlern wird dies ebenfalls protokolliert. Es empfiehlt sich daher, im Zweifelsfall zuerst das Protokoll zu prüfen.

{: .note}

Bei einer veralteten Konfiguration wird dies ebenfalls im Protokoll festgehalten. Es empfiehlt sich dann, in einer ruhigen Minute auf die neue [Sensor-Konfiguration umzustellen](/wartung/sensor-konfiguration).

## Quelltext

SOLECTRUS ist in Ruby on Rails implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/solectrus](https://github.com/solectrus/solectrus)
