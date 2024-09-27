---
title: Konfiguration
layout: page
parent: Redis
---

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

- `REDIS_VOLUME_PATH`

  Pfad für die Dateiablage der Datenbank, genutzt nur für die Persistenz beim Herunterfahren.

## Beispielhafte .env

```properties
REDIS_VOLUME_PATH=./redis
```
