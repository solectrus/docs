---
title: Upgrade
layout: page
parent: PostgreSQL
nav_order: 2
---

# Major-Upgrade

PostgreSQL erscheint jährlich in einer neuen Major-Version. Ein Upgrade auf eine neue Major-Version erfordert ein Backup/Restore, da PostgreSQL keine automatische Migration zwischen Major-Versionen durchführt.

{: .warning }
Keineswegs darf bei Verfügbarkeit einer neuen Major-Version von PostgreSQL einfach die neue Versionsnummer in die `compose.yaml` eingetragen werden. PostgreSQL wird dann nicht mehr starten!

## Minor-Versionen vs. Major-Versionen

- **Minor-Versionen** (z.B. 17.0 → 17.1): Können (und sollten) problemlos eingespielt werden, ohne dass ein Backup/Restore erforderlich ist. Darum kümmert sich idealerweise [Watchtower](/referenz/watchtower) automatisch.

- **Major-Versionen** (z.B. 17 → 18): Erfordern ein manuelles Upgrade mit Backup/Restore.

## Schritt-für-Schritt-Anleitung für Major-Upgrade

Die folgende Anleitung beschreibt das Upgrade auf eine neue Major-Version, z.B. von PostgreSQL 17 auf PostgreSQL 18. Auch ältere Versionen (z.B. 13, 14, 15, 16) können auf diese Weise aktualisiert werden.

{: .warning }
Bitte führe die folgenden Schritte sorgfältig durch und versuche zu verstehen, was passiert. Bei Fehlern kann es passieren, dass SOLECTRUS nicht mehr startet.

{: .note }
In neueren SOLECTRUS-Installationen heißt der PostgreSQL-Service `postgresql`, in älteren Versionen hingegen wurde er `db` genannt. Ersetze in den folgenden Befehlen `postgresql` durch `db`, falls deine Installation den älteren Service-Namen verwendet.
\
\
Möglich ist auch, dass der Ordner mit der Datenbank nicht `postgresql/` heißt, sondern anders oder an einem ganz anderen Ort liegt. Auch dann sind einige Befehle (`mv`, `mkdir` und `rm`) anzupassen.

### 1. In SOLECTRUS-Ordner wechseln

Wechsle in den SOLECTRUS-Ordner, der die `compose.yaml` und `.env` Dateien enthält:

```bash
cd /pfad/zu/solectrus
```

### 2. Container-Status prüfen

Stelle sicher, dass die Docker-Container laufen:

```bash
docker compose ps
```

In der ausgegeben Liste muss ein Eintrag für PostgreSQL vorhanden sein, z.B.:

```plaintext
...
solectrus-postgresql-1  postgres:17-alpine  "docker-entrypoint.s…"  postgresql  2 days ago  Up 2 days (healthy). 5432/tcp
...
```

Wichtig ist, dass der Status `Up` ist, hier zu sehen in `Up 2 days (healthy)`.

### 3. Backup erstellen

Erstelle ein Backup der bestehenden Datenbank:

```bash
docker compose exec postgresql pg_dumpall -U postgres | gzip > postgresql_backup.sql.gz
```

### 4. Container stoppen

Stoppe nun den PostgreSQL-Container, während die anderen SOLECTRUS-Dienste weiterlaufen sollen:

```bash
docker compose stop postgresql
```

### 5. Datenverzeichnis umbenennen

Benenne das bestehende PostgreSQL-Datenverzeichnis um (falls etwas schief gehen sollte) und erstelle ein neues, leeres Verzeichnis:

```bash
mv postgresql postgresql.bak
mkdir postgresql
```

### 6. compose.yaml aktualisieren

Aktualisiere die PostgreSQL-Version in deiner `compose.yaml` auf die gewünschte Version (aktuell ist 18). **Wichtig**: Bei Upgrade auf Version 18 muss auch das Volume-Mapping angepasst werden:

```yaml
services:
  # ...
  postgresql:
    image: postgres:18-alpine
    # ...
    volumes:
      - ${DB_VOLUME_PATH}:/var/lib/postgresql # Unterordner 'data' entfernt!
    # ... Rest der Konfiguration bleibt unverändert
```

### 7. Neue PostgreSQL-Version starten

```bash
docker compose up -d postgresql
```

Es wird das neue Docker-Image heruntergeladen (sofern noch nicht vorhanden) und ein Container gestartet. PostgreSQL wird eine neue, leere Datenbank erstellen.

### 8. Backup wiederherstellen

Warte, bis PostgreSQL vollständig gestartet ist:

```bash
docker compose logs -f postgresql
```

Es muss darin (nach kurzer Zeit) folgende Meldung erscheinen:

```plaintext
postgresql-1  | starting PostgreSQL 18.0 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit
...
postgresql-1  | database system is ready to accept connections
```

Wichtig ist, dass wirklich die gewünschte Versionsnummer erscheint (hier: `18.0`) und dass die letzte Zeile `database system is ready to accept connections` lautet. Beende die Protokoll-Ausgabe mit `Strg + C`.

Stelle nun dann das Backup wieder her:

```bash
zcat postgresql_backup.sql.gz | docker compose exec -T postgresql psql -U postgres
```

Die Ausgabe ist etwas kryptisch und enthält diverse SQL-Befehle wie `SET`, `CREATE DATABASE`, `ALTER TABLE` usw. Es darf hier keine Fehlermeldung erscheinen. Einzige Ausnahme ist die Zeile `ERROR: role "postgres" already exists`, diese Meldung kann ignoriert werden.

### 9. Prüfen

Prüfe nun, ob alles funktioniert, indem du SOLECTRUS im Browser aufrufst. Es muss alles wie gewohnt funktionieren und insbesondere müssen alle Einstellungen (z.B. Preise) noch vorhanden sein. Bitte prüfe das sorgfältig!

### 10. Aufräumen (optional)

Nach erfolgreichem Upgrade (alles geprüft?) kannst du die Backup-Dateien aufräumen:

```bash
# Altes Datenverzeichnis entfernen (ggfs. sudo erforderlich)
rm -rf postgresql.bak

# Backup-Datei löschen
rm postgresql_backup.sql.gz
```

Fertig! Das Upgrade ist abgeschlossen und du hast jetzt ein Jahr lang wieder Ruhe, Minor-Versionen werden ja automatisch eingespielt (sofern [Watchtower](/referenz/watchtower) läuft).
