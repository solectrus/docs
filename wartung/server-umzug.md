---
title: Server-Umzug
layout: page
parent: Wartung
nav_order: 3
---

# Umzug auf einen neuen Server

Ein Server-Umzug kann aus verschiedenen Gründen notwendig sein, z. B. bei einem Wechsel auf leistungsfähigere Hardware, einer Migration zu einem anderen Hosting-Anbieter oder zur Konsolidierung mehrerer Server.

Beim Umzug von SOLECTRUS auf einen neuen Server sollten keine Messwerte verloren gehen. Dies kann durch ein einfaches Kopieren der Datenbanken sichergestellt werden.

Hier sind die erforderlichen Schritte im Detail:

## 1. Docker-Container stoppen

Auf dem alten Server müssen die Docker-Container gestoppt werden, um Datenkonsistenz sicherzustellen:

```bash
docker compose down
```

## 2. Datenbanken kopieren

Die relevanten Datenbanken sind **InfluxDB** und **PostgreSQL**. **Redis** wird nur für Caching verwendet und muss nicht kopiert werden. Die Daten liegen in der Regel in den Verzeichnissen `./influxdb` und `./postgresql`, es sei denn, in der `.env`-Datei wurden andere Speicherorte definiert (Variablen `INFLUX_VOLUME_PATH` und `DB_VOLUME_PATH`). Diese Verzeichnisse müssen auf den neuen Server übertragen werden.

Beim Kopieren der Datenbank-Ordner kann es sein, dass dazu erhöhte Berechtigungen erforderlich sind. In diesem Fall kann das Kopieren mit vorangestelltem `sudo` hilfreich sein.

**Wichtig:** Während des Kopiervorgangs dürfen die Datenbanken nicht verändert werden. Daher müssen die Container vorher gestoppt werden.

{: .note}
Das [Backup-Script](/wartung/datensicherung) ist für diesen Zweck nicht ideal, da es eine leere Datenbank und laufende Container zur Wiederherstellung benötigt. Es dient primär der Datensicherung im laufenden Betrieb.

## 3. Konfigurationsdateien kopieren

Die Konfiguration von SOLECTRUS befindet sich in den Dateien `.env` und `compose.yaml` (bzw. `docker-compose.yaml`). Diese Dateien müssen ebenfalls auf den neuen Server übertragen werden.

## 4. Neuen Server vorbereiten

Auf dem neuen Server müssen die gesicherten Ordner und Dateien an die entsprechenden Zielorte kopiert werden:

- `.env`
- `compose.yaml`
- `./influxdb`
- `./postgresql`

Falls die Datenbanken an einem anderen Speicherort abgelegt werden sollen, muss die `.env`-Datei entsprechend angepasst werden (`INFLUX_VOLUME_PATH` und `DB_VOLUME_PATH`).

## 5. Docker-Container starten

Nach dem Kopieren kann SOLECTRUS auf dem neuen Server wie gewohnt gestartet werden:

```bash
docker compose up -d
```

SOLECTRUS sollte nun unter der neuen IP-Adresse oder dem neuen Hostnamen erreichbar sein. Die Messwerte bleiben erhalten und die Konfiguration bleibt unverändert.

Auch die Registrierung und ein etwaiges Sponsoring bleiben bestehen, da keine neue Instanz erstellt wurde, sondern die bestehende lediglich auf einen neuen Server umgezogen ist.
