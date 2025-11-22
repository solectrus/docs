---
title: Limitierung der Protokoll-Dateien
sidebar:
  order: 5
  label: Logging limitieren
---

Die verschiedenen Docker-Container von SOLECTRUS schreiben zur Diagnose und Fehlersuche Protokoll-Dateien (Logs). Diese Dateien können sehr groß werden, wenn sie nicht begrenzt werden. Das kann irgendwann zu [Speicherplatzproblemen](https://github.com/orgs/solectrus/discussions/3748) führen.

In der `compose.yaml` kann die Größe der Log-Dateien begrenzt werden. Dazu wird die Option `logging` verwendet. Hier ein Beispiel:

```yaml
services:
  dashboard:
    logging:
      options:
        max-size: 10m
        max-file: '3'
```

Die Größe der Log-Dateien pro Container ist dann auf 10 MB begrenzt und es werden maximal 3 Dateien gespeichert, ältere Protokolle werden also jeweils gelöscht.

Hat man SOLECTRUS mit dem [SOLECTRUS-Konfigurator](https://configurator.solectrus.de/) installiert (verfügbar seit Sommer 2024), so enthält die `compose.yaml` bereits eine solche Konfiguration. Es ist nichts weiter zu tun.

Hat man hingegen eine ältere Installation von SOLECTRUS, dann fehlen möglicherweise diese Zeilen in der `compose.yaml` (die dann sicherlich auch noch `docker-compose.yml` heißt). Sie können dann aber einfach manuell ergänzt werden, d.h. für jeden Service, der in der `compose.yaml` aufgeführt ist, sind die obigen Zeilen einzufügen, das Ergebnis könnte dann so aussehen:

```yaml
services:
  app:
    # ...
    logging:
      options:
        max-size: 10m
        max-file: '3'
  influxdb:
    # ...
    logging:
      options:
        max-size: 10m
        max-file: '3'
  db:
    # ...
    logging:
      options:
        max-size: 10m
        max-file: '3'
  redis:
    # ...
    logging:
      options:
        max-size: 10m
        max-file: '3'
  senec-collector:
    # ...
    logging:
      options:
        max-size: 10m
        max-file: '3'
  forecast-collector:
    # ...
    logging:
      options:
        max-size: 10m
        max-file: '3'
```

Wichtig ist, auf die korrekte Einrückung zu achten, das YAML-Format ist da sehr empfindlich.

Nach einer Änderung der Compose-Datei müssen - wie üblich - die Container neu erstellt werden:

```bash
docker compose up -d
```
