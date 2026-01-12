---
title: Erstellen von Datensicherungen
sidebar:
  hidden: true
---

Die beiden Datenbanken von SOLECTRUS (PostgreSQL und vor allem InfluxDB) sammeln Daten, die man nicht verlieren möchte. Daher ist es wichtig, regelmäßig Sicherungen zu erstellen.

Es stehen dafür Scripte zur Verfügung, die die Sicherung manuell oder automatisiert durchführen.

## Herunterladen der Scripte

Vor dem Gebrauch müssen die Scripte einmalig heruntergeladen und ausführbar gemacht werden. Dies muss im Verzeichnis ausgeführt werden, indem bereits die Dateien `.env` und `compose.yaml` liegen:

```bash
cd /pfad/zu/solectrus

curl -o backup.sh https://raw.githubusercontent.com/solectrus/backup-restore/refs/heads/main/backup.sh
curl -o restore.sh https://raw.githubusercontent.com/solectrus/backup-restore/refs/heads/main/restore.sh
chmod +x backup.sh restore.sh
```

Manchmal werden die Scripte aktualisiert. Um die neueste Version zu erhalten, sind die beiden `curl`-Befehle erneut auszuführen.

## Erstellen einer Datensicherung

Das Erstellen einer Sicherung erfolgt durch das Script `backup.sh`. Es erstellt eine Sicherung **beider** Datenbanken in **eine** Datei, die nach dem Datum benannt ist.

```bash
./backup.sh
```

Das Backup wird im laufenden Betrieb erstellt. Es muss (und darf) kein Container gestoppt werden. Das Ergebnis ist eine Datei wie `solectrus-backup-2024-10-06.tar.gz`. Das Script zeigt eine Ausgabe wie folgt:

```log
SOLECTRUS Backup Script

Checking if PostgreSQL and InfluxDB containers are running...
Ok, PostgreSQL and InfluxDB containers are both running.

Creating PostgreSQL backup...
PostgreSQL backup saved as solectrus-postgresql-backup-2024-10-06.sql.gz (4.0K)

Creating InfluxDB backup...
2024/10/06 11:49:15 INFO: Downloading metadata snapshot
2024/10/06 11:49:15 INFO: Backing up TSM for shard 33
2024/10/06 11:49:15 INFO: Backing up TSM for shard 34
2024/10/06 11:49:15 INFO: Backing up TSM for shard 35
2024/10/06 11:49:15 INFO: Backing up TSM for shard 36
2024/10/06 11:49:15 INFO: Backing up TSM for shard 37
2024/10/06 11:49:15 INFO: Backing up TSM for shard 38
2024/10/06 11:49:15 INFO: Backing up TSM for shard 39
2024/10/06 11:49:15 INFO: Backing up TSM for shard 40
Successfully copied 137kB to /home/ledermann/solectrus/solectrus-influxdb-backup-2024-10-06.tar.gz
InfluxDB backup saved as solectrus-influxdb-backup-2024-10-06.tar.gz (136K)

Combined backup saved as solectrus-backup-2024-10-06.tar.gz (136K)
Backup process completed.
```

Die Sicherung kann optional auf einem anderen Speicherort gespeichert werden. Dazu wird der Pfad als Parameter übergeben:

```bash
./backup.sh --backup-dir /pfad/zum/zielverzeichnis
```

Außerdem kann dafür gesorgt, dass nur eine begrenzte Anzahl von Sicherungen aufbewahrt wird. Dazu wird die Anzahl ebenfalls als Parameter übergeben:

```bash
./backup.sh --retentation-days 10
```

### Automatisieren der Datensicherung

Die Sicherung kann auch automatisiert werden, indem das Script in einem Cronjob aufgerufen wird.

1. Cron-Tabelle öffnen:

   ```bash
   crontab -e
   ```

2. Ergänze folgende Zeile und speichere die Änderung:

   ```
   0 2 * * * cd /pfad/zu/solectrus && ./backup.sh --backup-dir /pfad/zum/zielverzeichnis --retention-days 10
   ```

3. Prüfen ob der Cronjob korrekt hinzugefügt wurde:

   ```bash
   crontab -l
   ```

## Wiederherstellen einer Datensicherung

Das Wiederherstellen einer Sicherung läuft ähnlich ab. Es wird das Script `restore.sh` verwendet, das alle Schritte automatisiert. Auch hier muss (und darf) kein Container manuell gestoppt werden. Das Script übernimmt das und startet die Container nach der Wiederherstellung wieder.

Das Script wird mit dem Pfad zur Backup-Datei als Parameter aufgerufen:

```bash
./restore.sh <BACKUP_DATEI>
```

Da eine Wiederherstellung den aktuellen Zustand der Datenbanken überschreibt, wird aus Sicherheitsgründen vor dem Wiederherstellen eine Bestätigung eingeholt. Die Ausgabe des Scripts sieht wie folgt aus:

```log
SOLECTRUS Restore Script

Validating backup files in solectrus-backup-2024-10-06.tar.gz...
Ok, backup file contains backups for both PostgreSQL and InfluxDB.

Checking if PostgreSQL, InfluxDB, and Redis containers are running...
Ok, PostgreSQL, InfluxDB, and Redis containers are all running.

WARNING: This will overwrite all existing data in PostgreSQL and InfluxDB!
Are you sure you want to continue? Type 'yes' to proceed: yes

Checking running containers...
Stopping all containers except PostgreSQL, InfluxDB, and Redis...
[+] Stopping 4/4
 ✔ Container solectrus-senec-collector-1  Stopped
 ✔ Container solectrus-dashboard-1        Stopped
 ✔ Container solectrus-power-splitter-1   Stopped
 ✔ Container solectrus-watchtower-1       Stopped
All other containers stopped.

Extracting backup files from solectrus-backup-2024-10-06.tar.gz...
Extraction completed.

Restoring PostgreSQL backup...
PostgreSQL restore completed successfully.

Restoring InfluxDB backup...
ID			Name		Retention	Shard group duration	Organization ID		Schema Type	Deleted
8617308794b3e561	solectrus	infinite	168h0m0s		a161178df503af35	implicit	true
Successfully copied 137kB to 4ee52044437a271f0b7fa0bb9a09a7ed5cd6b756b0bfdbb8081a8d29596b6dd8:/tmp/
2024/10/06 11:50:39 INFO: Restoring bucket "8617308794b3e561" as "solectrus"
2024/10/06 11:50:40 INFO: Restoring TSM snapshot for shard 41
2024/10/06 11:50:40 INFO: Restoring TSM snapshot for shard 42
2024/10/06 11:50:40 INFO: Restoring TSM snapshot for shard 43
2024/10/06 11:50:40 INFO: Restoring TSM snapshot for shard 44
2024/10/06 11:50:40 INFO: Restoring TSM snapshot for shard 45
2024/10/06 11:50:40 INFO: Restoring TSM snapshot for shard 46
2024/10/06 11:50:40 INFO: Restoring TSM snapshot for shard 47
2024/10/06 11:50:40 INFO: Restoring TSM snapshot for shard 48
InfluxDB restore completed.

Flushing Redis...
OK
Redis cache flushed successfully.

Restarting previously running containers...
[+] Running 7/7
 ✔ Container solectrus-watchtower-1       Started
 ✔ Container solectrus-influxdb-1         Healthy
 ✔ Container solectrus-redis-1            Healthy
 ✔ Container solectrus-postgresql-1       Healthy
 ✔ Container solectrus-power-splitter-1   Started
 ✔ Container solectrus-dashboard-1        Started
 ✔ Container solectrus-senec-collector-1  Started
Previously running containers restarted.
Restore process completed.
```

## Quelltext

Die Scripte sind in Bash implementiert, der Quelltext ist auf GitHub verfügbar: \
[github.com/solectrus/backup-restore](https://github.com/solectrus/backup-restore)
