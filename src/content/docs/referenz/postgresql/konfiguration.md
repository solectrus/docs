---
title: Konfiguration von PostgreSQL
sidebar:
  order: 2
  label: Konfiguration
---

PostgreSQL wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die Dateien `compose.yaml` und `.env` enthalten auch die Konfiguration für PostgreSQL.

## `compose.yaml`

```yaml
services:
  postgresql:
    image: postgres:18-alpine
    environment:
      - TZ
      - POSTGRES_PASSWORD
    volumes:
      - ${DB_VOLUME_PATH}:/var/lib/postgresql
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
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  watchtower:
    # ...
```

:::note
Es gibt normalerweise keine Notwendigkeit, von außen direkt auf die Datenbank zuzugreifen. Daher muss auch kein Port nach außen geöffnet werden.
:::

## Umgebungsvariablen (`.env`)

#### TZ

Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

```properties title="Beispiel"
TZ=Europe/Berlin
```

#### POSTGRES_PASSWORD

Passwort für den internen Benutzer `postgres`. Da die Datenbank nicht von außen erreichbar ist, ist das Passwort nicht sonderlich kritisch, es muss aber auf einen Wert gesetzt werden.

**Bitte beachten:** Dieses Passwort darf nach dem ersten Start von PostgreSQL nicht mehr geändert werden, da es in der Datenbank selbst gespeichert wird.

```properties title="Beispiel"
POSTGRES_PASSWORD=my-secret-db-password
```

#### DB_VOLUME_PATH

Pfad, in dem die Datenbank gespeichert wird. Dieser Pfad wird als Volume in den Container gemountet.

Wenn am angegebenen Pfad bereits eine Datenbank existiert, wird diese verwendet. Andernfalls wird eine neue Datenbank angelegt, was üblicherweise nur beim ersten Start des Containers der Fall ist.

```properties title="Beispiel"
DB_VOLUME_PATH=/somewhere/solectrus/postgresql
```
