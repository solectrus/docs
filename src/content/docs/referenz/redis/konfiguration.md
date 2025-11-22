---
title: Konfiguration von Redis
sidebar:
  order: 2
  label: Konfiguration
---

Redis wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die Dateien `compose.yaml` und `.env` enthalten auch die Konfiguration für Redis.

## `compose.yaml`

```yaml
services:
  redis:
    image: redis:8-alpine
    environment:
      - TZ
    volumes:
      - ${REDIS_VOLUME_PATH}:/data
    restart: unless-stopped
    healthcheck:
      test:
        - CMD
        - redis-cli
        - ping
      interval: 10s
      timeout: 20s
      retries: 5
      start_period: 60s
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  watchtower:
    # ...
```

## Umgebungsvariablen (`.env`)

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

##### Beispiel

```dotenv title="Beispiel"
TZ=Europe/Berlin
```

#### REDIS_VOLUME_PATH

Pfad, in dem die Datenbank beim Herunterfahren gespeichert wird, um die Persistenz zu gewährleisten. Dieser Pfad wird als Volume in den Container gemountet.

Wenn am angegebenen Pfad bereits eine Datenbank existiert (in Form der Datei `dump.rdb`), wird diese beim Start geladen und der Cache somit wiederhergestellt.

##### Beispiel

```dotenv title="Beispiel"
REDIS_VOLUME_PATH=/somewhere/solectrus/redis
```
