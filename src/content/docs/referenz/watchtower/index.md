---
title: Was ist Watchtower?
sidebar:
  order: 1
  label: Übersicht
---

**Watchtower** ist ein Tool, das Docker-Container automatisiert auf dem aktuellen Stand hält.

## Das Problem

Docker lädt ein Image nur einmal herunter und verwendet es dann immer wieder. Auch wenn du in deiner `compose.yaml` das Tag `latest` verwendest, prüft Docker **nicht** automatisch, ob eine neuere Version verfügbar ist.

**Beispiel:** Du hast SOLECTRUS mit dem Image `ghcr.io/solectrus/solectrus:latest` installiert. Eine Woche später gibt es eine neue Version mit Bugfixes. Deine laufenden Container verwenden aber weiterhin die alte Version – solange, bis du manuell `docker compose pull` und `docker compose up -d` ausführst.

## Die Lösung

Watchtower übernimmt genau diese Aufgabe automatisch:

- Es prüft regelmäßig (standardmäßig einmal täglich), ob neue Versionen der verwendeten Docker-Images verfügbar sind
- Findet es eine neue Version, lädt es das Image herunter, stoppt den alten Container und startet ihn mit der neuen Version neu

Watchtower selbst läuft als Docker-Container und aktualisiert sich auch selbst.

## Über Watchtower

[Watchtower](https://containrrr.dev/watchtower/) ist ein Open-Source-Projekt mit langer und bewegter Geschichte. Das ursprüngliche Projekt wird seit kurzem leider nicht mehr gepflegt und funktioniert mit Docker 29+ auch nicht mehr ohne weiteres. Als Alternative bietet sich der aktiv weiterentwickelte und kompatible [Fork von Nicholas Fedor](https://github.com/nicholas-fedor/watchtower) an.

:::note[Wechsel zum Fork]

Wer Watchtower schon länger verwendet, sollte auf diesen Fork wechseln, denn andernfalls werden möglicherweise keine Updates mehr für SOLECTRUS installiert (nämlich dann, wenn man bereits auf Docker 29 oder höher aktualisiert hat).

Der Wechsel ist einfach vorzunehmen, es ist nur ein kleine Änderung in der `compose.yaml` notwendig:

#### Vorher

```yaml
watchtower:
  image: containrrr/watchtower
```

#### Nachher

```yaml
watchtower:
  image: nickfedor/watchtower
```

Danach einmal alles neu starten und fortan sorgt der Fork für automatische Updates:

```bash
docker compose pull
docker compose up -d
```

:::
