---
title: Konfiguration
layout: page
parent: Redis
---

# Konfigurieren von Redis

Redis wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  redis:
    image: redis:7-alpine
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
      options:
        max-size: 10m
        max-file: '3'
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  watchtower:
    # ...
```

## Umgebungsvariablen

### `TZ`

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### `REDIS_VOLUME_PATH`

Pfad, in dem die Datenbank beim Herunterfahren gespeichert wird, um die Persistenz zu gewährleisten. Dieser Pfad wird als Volume in den Container gemountet.

Wenn am angegebenen Pfad bereits eine Datenbank existiert (in Form der Datei `dump.rdb`), wird diese beim Start geladen und der Cache somit wiederhergestellt.

## Beispielhafte .env

```properties
TZ=Europe/Berlin
REDIS_VOLUME_PATH=/somewhere/solectrus/redis
```
