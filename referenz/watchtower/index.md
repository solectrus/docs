---
title: Watchtower
layout: page
parent: Referenz
nav_order: 13
---

# Watchtower

**Watchtower** ist ein Tool, das Docker-Container automatisch aktuell hält. Es überprüft regelmäßig, ob für ein verwendetes Docker-Image eine neuere Version verfügbar ist. Falls ja, wird das neue Image heruntergeladen und der zugehörige Container neu gestartet.

Die Grundlage für diese Überprüfung ist das Docker-Tag, das in der `compose.yaml`-Datei für die Docker-Services angegeben ist. Wenn z. B. `latest` verwendet wird, bedeutet das, dass die neueste Version des Images genutzt werden soll. Docker selbst überprüft jedoch nicht automatisch, ob ein neues Image verfügbar ist. Ein Image wird nur heruntergeladen, wenn es lokal noch nicht vorhanden ist – oder wenn man explizit `docker compose pull` ausführt.

Watchtower schließt diese Lücke, indem es im laufenden Betrieb regelmäßig prüft und Updates vornimmt. Watchtower selbst läuft dabei als Docker-Container und aktualisiert sich auch selbst.

## Website

Die offizielle Website und Dokumentation zu Watchtower findet sich hier:
[containrrr.dev/watchtower/](https://containrrr.dev/watchtower/)
