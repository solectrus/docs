---
title: Konfiguration
layout: page
parent: PostgreSQL
---

## compose.yaml

```yaml
services:
  postgresql:
    image: postgres:16-alpine
    environment:
      - TZ
      - POSTGRES_PASSWORD
    volumes:
      - ${DB_VOLUME_PATH}:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -U postgres
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

- `TZ`

  Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

- `POSTGRES_PASSWORD`

  Passwort für den internen Benutzer `postgres`. Da die Datenbank nicht von außen erreichbar ist, ist das Passwort nicht sonderlich kritisch, es muss aber auf einen Wert gesetzt werden.

  Wird beim ersten Start gesetzt und darf danach nicht mehr geändert werden!

- `DB_VOLUME_PATH`

  Pfad für die Dateiablage der Datenbank.

  Wird beim ersten Start angelegt und darf nicht mehr geändert werden.

## Beispielhafte .env

```properties
TZ=Europe/Berlin
POSTGRES_PASSWORD=geheimes-datenbank-passwort
DB_VOLUME_PATH=./postgresql
```
