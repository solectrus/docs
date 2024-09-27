---
title: PostgreSQL
layout: page
parent: Referenz
nav_order: 11
---

SOLECTRUS speichert sämtliche sonstigen Daten (Einstellungen, Strompreise, Registrierung) in der OpenSource-Datenbank **PostgreSQL** ab. Unterstützt wird die Version 12 oder höher, wobei für eine Neuinstallation die Version **16** empfohlen wird.

PostgreSQL erscheint jährlich in einer neuen Major-Version. Ein Upgrade ist aber nicht so einfach vorzunehmen, weil es ein Backup/Restore erfordert. Da die Vorteile einer neuen Version überschaubar sind, kann problemlos bei einer älteren Version verblieben werden, für die es üblicherweise fünf Jahre lang Minor-Updates gibt.

{: .warning }

Keineswegs darf bei Verfügbarkeit einer neuen Version von PostgreSQL einfach die neue Versionsnummer in die `compose.yaml` eingetragen werden. PostgreSQL wird dann nicht mehr starten!

Offizielles Docker-Image: \
[https://hub.docker.com/\_/postgres](https://hub.docker.com/_/postgres)
