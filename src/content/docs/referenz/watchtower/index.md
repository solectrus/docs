---
title: Was ist Watchtower?
sidebar:
  order: 1
  label: Übersicht
---

**Watchtower** ist ein Tool, das Docker-Container automatisch aktuell hält.

## Das Problem

Docker lädt ein Image nur einmal herunter und verwendet es dann immer wieder. Auch wenn du in deiner `compose.yaml` das Tag `latest` verwendest, prüft Docker **nicht** automatisch, ob eine neuere Version verfügbar ist.

**Beispiel:** Du hast SOLECTRUS mit dem Image `ghcr.io/solectrus/solectrus:latest` installiert. Eine Woche später gibt es eine neue Version mit Bugfixes. Deine laufenden Container verwenden aber weiterhin die alte Version – solange, bis du manuell `docker compose pull` und `docker compose up -d` ausführst.

## Die Lösung

Watchtower übernimmt genau diese Aufgabe automatisch:

- Es prüft regelmäßig (z.B. täglich), ob neue Versionen der verwendeten Docker-Images verfügbar sind
- Findet es eine neue Version, lädt es das Image herunter, stoppt dann den alten Container und startet ihn mit der neuen Version neu

Watchtower selbst läuft als Docker-Container und aktualisiert sich auch selbst.

## Website

Die offizielle Website und Dokumentation zu Watchtower findet sich hier:
[containrrr.dev/watchtower/](https://containrrr.dev/watchtower/)
