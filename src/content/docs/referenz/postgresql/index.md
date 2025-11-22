---
title: Was ist PostgreSQL?
sidebar:
  order: 1
  label: Übersicht
---

Neben den eigentlichen Messwerten, die in [InfluxDB](../influxdb) abgelegt werden, speichert SOLECTRUS zusätzliche Daten wie Tageszusammenfassungen, Einstellungen, Strompreise und ein paar Dinge mehr in der OpenSource-Datenbank **PostgreSQL** ab. Unterstützt wird die Version 13 oder höher, wobei für eine Neuinstallation die Version **18** empfohlen wird.

## Logging

Wie alle Docker-Container schreibt auch PostgreSQL ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
...
2025-11-22 13:44:06.380 CET [1] LOG:  starting PostgreSQL 18.1 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit
2025-11-22 13:44:06.380 CET [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2025-11-22 13:44:06.381 CET [1] LOG:  listening on IPv6 address "::", port 5432
2025-11-22 13:44:06.392 CET [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2025-11-22 13:44:06.453 CET [1] LOG:  database system is ready to accept connections
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs postgresql
```

Dass es hier Probleme gibt, ist recht unwahrscheinlich. Dennoch sollte im Zweifelsfall das Protokoll geprüft werden.

### Datensicherung

Für die [Sicherung und -wiederherstellung von SOLECTRUS](/wartung/datensicherung) stehen einfach zu bedienende Scripte bereit, die auch PostgreSQL berücksichtigen.

## Offizielles Docker-Image

Das offizielle Docker-Image von PostgreSQL ist auf Docker Hub verfügbar: \
[https://hub.docker.com/\_/postgres](https://hub.docker.com/_/postgres)
