---
title: Web-Oberfläche
layout: page
parent: Ingest
nav_order: 3
---

# Web-Oberfläche

**Ingest** hat eine kleine Web-Oberfläche, die einige Kennzahlen zum Betrieb anzeigt, u.a.:

- Datendurchsatz
- Messwerte mit ihrer Häufigkeit
- CPU-Auslastung
- RAM-Auslastung
- Durchschnittliche Antwortzeit
- ...

Die Web-Oberfläche ist unter `http://<IP>:4567` erreichbar und sieht so aus:

<img src="{{ site.baseurl }}/assets/images/ingest.png" alt="Ingest Web-Oberfläche" />

## Zugriffsschutz

Ein Zugriffsschutz ist optional möglich, indem die Variable `STATS_PASSWORD` gesetzt wird. Beim ersten Aufruf der Web-Oberfläche wird dann dieses Passwort abgefragt:

<img src="{{ site.baseurl }}/assets/images/ingest-login.png" alt="Ingest Web-Oberfläche" />
