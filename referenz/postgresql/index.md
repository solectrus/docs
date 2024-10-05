---
title: PostgreSQL
layout: page
parent: Referenz
nav_order: 11
---

# PostgreSQL

SOLECTRUS legt alle Daten, die nichts mit Messwerten zu tun haben (z.B. Einstellungen, Strompreise, Registrierung) in der OpenSource-Datenbank **PostgreSQL** ab. Unterstützt wird die Version 12 oder höher, wobei für eine Neuinstallation die Version **16** empfohlen wird.

## Protokollierung

Wie alle Docker-Container schreibt auch PostgreSQL ein Protokoll ins Docker-Log, das im Normalfall so aussieht:

```plaintext
...
2024-10-05 17:53:12.399 CEST [1] LOG:  starting PostgreSQL 16.4 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit
2024-10-05 17:53:12.399 CEST [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2024-10-05 17:53:12.399 CEST [1] LOG:  listening on IPv6 address "::", port 5432
2024-10-05 17:53:12.401 CEST [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2024-10-05 17:53:12.407 CEST [1] LOG:  database system is ready to accept connections
...
```

Das Protokoll kann über folgenden Befehl abgerufen werden:

```bash
docker compose logs postgresql
```

Dass es hier Probleme gibt, ist recht unwahrscheinlich. Dennoch sollte im Zweifelsfall das Protokoll geprüft werden.

## Offizielles Docker-Image

Das offizielle Docker-Image von PostgreSQL ist auf Docker Hub verfügbar: \
[https://hub.docker.com/\_/postgres](https://hub.docker.com/_/postgres)
