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
Copyright (C) 2020-2024 Georg Ledermann
License: GNU AGPLv3 - https://www.gnu.org/licenses/agpl-3.0.html
Version v0.17.0, built on 2024-09-23T18:44:47+02:00
Using ruby 3.3.5 (2024-09-03 revision ef084cc8f4) [aarch64-linux-musl]
Based on Alpine Linux 3.20.3

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
=> Rails 7.2.1 application starting in production
=> Run `bin/rails server --help` for more startup options
I, [2024-10-08T14:52:22.169801 #1]  INFO -- : Sensor initialization started
I, [2024-10-08T14:52:22.171149 #1]  INFO -- :   - Sensor 'inverter_power' mapped to 'SENEC:inverter_power'
I, [2024-10-08T14:52:22.171283 #1]  INFO -- :   - Sensor 'inverter_power_forecast' ignored
I, [2024-10-08T14:52:22.171336 #1]  INFO -- :   - Sensor 'house_power' mapped to 'SENEC:house_power'
I, [2024-10-08T14:52:22.171374 #1]  INFO -- :   - Sensor 'heatpump_power' ignored
I, [2024-10-08T14:52:22.171411 #1]  INFO -- :   - Sensor 'grid_import_power' mapped to 'SENEC:grid_power_plus'
I, [2024-10-08T14:52:22.171450 #1]  INFO -- :   - Sensor 'grid_export_power' mapped to 'SENEC:grid_power_minus'
I, [2024-10-08T14:52:22.171487 #1]  INFO -- :   - Sensor 'grid_export_limit' mapped to 'SENEC:power_ratio'
I, [2024-10-08T14:52:22.171529 #1]  INFO -- :   - Sensor 'battery_charging_power' mapped to 'SENEC:bat_power_plus'
I, [2024-10-08T14:52:22.171568 #1]  INFO -- :   - Sensor 'battery_discharging_power' mapped to 'SENEC:bat_power_minus'
I, [2024-10-08T14:52:22.171608 #1]  INFO -- :   - Sensor 'battery_soc' mapped to 'SENEC:bat_fuel_charge'
I, [2024-10-08T14:52:22.171645 #1]  INFO -- :   - Sensor 'car_battery_soc' ignored
I, [2024-10-08T14:52:22.171684 #1]  INFO -- :   - Sensor 'wallbox_car_connected' ignored
I, [2024-10-08T14:52:22.171720 #1]  INFO -- :   - Sensor 'wallbox_power' mapped to 'SENEC:wallbox_charge_power'
I, [2024-10-08T14:52:22.171757 #1]  INFO -- :   - Sensor 'case_temp' mapped to 'SENEC:case_temp'
I, [2024-10-08T14:52:22.171798 #1]  INFO -- :   - Sensor 'system_status' mapped to 'SENEC:current_state'
I, [2024-10-08T14:52:22.171836 #1]  INFO -- :   - Sensor 'system_status_ok' mapped to 'SENEC:current_state_ok'
I, [2024-10-08T14:52:22.171887 #1]  INFO -- :   - Sensor 'house_power_grid' mapped to 'power_splitter:house_power_grid'
I, [2024-10-08T14:52:22.171934 #1]  INFO -- :   - Sensor 'wallbox_power_grid' mapped to 'power_splitter:wallbox_power_grid'
I, [2024-10-08T14:52:22.171974 #1]  INFO -- :   - Sensor 'heatpump_power_grid' mapped to 'power_splitter:heatpump_power_grid'
I, [2024-10-08T14:52:22.172013 #1]  INFO -- :   - Sensor 'house_power' remains unchanged
I, [2024-10-08T14:52:22.172072 #1]  INFO -- : Sensor initialization completed
Puma starting in single mode...
* Puma version: 6.4.3 (ruby 3.3.5-p100) ("The Eagle of Durango")
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
