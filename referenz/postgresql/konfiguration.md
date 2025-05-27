---
title: Konfiguration
layout: page
parent: PostgreSQL
nav_order: 1
---

# Konfigurieren von PostgreSQL

PostgreSQL wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehenden Dateien `compose.yaml` und `.env` sind zu erweitern.

## compose.yaml

```yaml
services:
  postgresql:
    image: postgres:17-alpine
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

{:.note}

Es gibt im Normalfall keine Notwendigkeit, direkt auf die Datenbank zuzugreifen. Daher muss auch kein Port nach außen geöffnet werden. Der Zugriff erfolgt ausschließlich über den Dashboard-Container von SOLECTRUS.

{: .important }

PostgreSQL erscheint jährlich in einer neuen Major-Version. Ein Upgrade erfordert aber ein Backup/Restore. Da die Vorteile einer neuen Major-Version aus Sicht von SOLECTRUS überschaubar sind, kann problemlos bei einer älteren Version verblieben werden, für die es üblicherweise fünf Jahre lang Minor-Updates gibt. \
\
Keineswegs darf bei Verfügbarkeit einer neuen Version von PostgreSQL einfach die neue Versionsnummer in die `compose.yaml` eingetragen werden. PostgreSQL wird dann nicht mehr starten! \
\
Neue Minor-Versionen von PostgreSQL können (und sollten auch) problemlos eingespielt werden, ohne dass ein Backup/Restore erforderlich ist. Darum kümmert sich idealerweise Watchtower.

## Umgebungsvariablen

- `TZ`

  Zeitzone gemäß [Liste](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

- `POSTGRES_PASSWORD`

  Passwort für den internen Benutzer `postgres`. Da die Datenbank nicht von außen erreichbar ist, ist das Passwort nicht sonderlich kritisch, es muss aber auf einen Wert gesetzt werden.

  Wird beim ersten Start gesetzt und darf danach nicht mehr geändert werden!

- `DB_VOLUME_PATH`

  Pfad, in dem die Datenbank gespeichert wird. Dieser Pfad wird als Volume in den Container gemountet.

  Wenn am angegebenen Pfad bereits eine Datenbank existiert, wird diese verwendet. Andernfalls wird eine neue Datenbank angelegt. Dies ist normalerweise nur beim ersten Start des Containers der Fall.

## Beispielhafte .env

```properties
TZ=Europe/Berlin
POSTGRES_PASSWORD=geheimes-datenbank-passwort
DB_VOLUME_PATH=/somewhere/solectrus/postgresql
```
