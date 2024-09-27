---
title: Konfiguration
layout: page
parent: CSV-Importer
---

## .env

```properties
# Zeitzone
TZ=Europe/Berlin

# Hostname of InfluxDB
INFLUX_HOST=influxdb

# Schema (http/https) of InfluxDB
INFLUX_SCHEMA=http

# Port of InfluxDB
INFLUX_PORT=8086

# Token for InfluxDB (requires write permissions)
INFLUX_TOKEN_WRITE=my

# Organization for InfluxDB
INFLUX_ORG=solectrus

# Bucket for InfluxDB
INFLUX_BUCKET=solectrus

# Measurement for InfluxDB
INFLUX_MEASUREMENT_PV=SENEC

# Timeout for InfluxDB connection (in seconds)
INFLUX_OPEN_TIMEOUT=30

# Timeout for InfluxDB read (in seconds)
INFLUX_READ_TIMEOUT=30

# Timeout for InfluxDB write (in seconds)
INFLUX_WRITE_TIMEOUT=30

# Folder where CSV files are located
IMPORT_FOLDER=/data

# Pause after each imported file (in seconds)
IMPORT_PAUSE=0
```
