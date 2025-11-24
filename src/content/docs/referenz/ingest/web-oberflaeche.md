---
title: Web-Oberfläche von Ingest
sidebar:
  order: 4
  label: Web-Oberfläche
---

**Ingest** hat eine kleine Web-Oberfläche, die einige Kennzahlen zum Betrieb anzeigt, u.a.:

- Datendurchsatz
- Warteschlangenlänge
- Messwerte mit ihrer Häufigkeit
- CPU-Auslastung
- RAM-Auslastung
- Durchschnittliche Antwortzeit
- ...

Die Web-Oberfläche ist unter `http://<IP>:4567` erreichbar und sieht so aus:

![Ingest Web-Oberfläche](@assets/ingest.png)

## Zugriffsschutz

Ein Zugriffsschutz ist optional möglich, indem die Variable `STATS_PASSWORD` gesetzt wird. Beim ersten Aufruf der Web-Oberfläche wird dann dieses Passwort abgefragt:

![Ingest Web-Oberfläche Login](@assets/login-ingest.png)
