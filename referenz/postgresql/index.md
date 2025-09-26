---
title: PostgreSQL
layout: page
parent: Referenz
nav_order: 12
---

# PostgreSQL

SOLECTRUS legt alle Daten, die nichts mit Messwerten zu tun haben (z.B. Einstellungen, Strompreise, Registrierung) in der OpenSource-Datenbank **PostgreSQL** ab. Unterstützt wird die Version 12 oder höher, wobei für eine Neuinstallation die Version **18** empfohlen wird.

## Protokollierung

Wie alle Docker-Container schreibt auch PostgreSQL ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
...
2025-05-18 05:05:23.021 UTC [1] LOG:  starting PostgreSQL 18.0 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit
2025-05-18 05:05:23.021 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2025-05-18 05:05:23.021 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2025-05-18 05:05:23.025 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2025-05-18 05:05:23.051 UTC [1] LOG:  database system is ready to accept connections
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
