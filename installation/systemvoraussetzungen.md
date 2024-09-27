---
title: Systemvoraussetzungen
description: Über die unterstützten Photovoltaik-Geräte und was außer Raspberry Pi noch in Frage kommt.
layout: page
parent: Installation
nav_order: 1
---

Für den Betrieb von SOLECTRUS benötigst du neben der Photovoltaik-Anlage (optional mit Stromspeicher, Wärmepumpe und/oder Wallbox) oder einem Balkonkraftwerk lediglich einen kleinen Linux-Server.

## Geräte über MQTT

Über das Netzwerkprotokoll <a href="https://de.wikipedia.org/wiki/MQTT">MQTT</a> können beliebige Speicher, Wechselrichter, Wallboxen und Wärmepumpen integriert werden, sofern diese ein solches Auslesen von Messwerten ermöglichen. Hierfür ist zusätzliche Software notwendig, insbesondere ein MQTT-Broker. Erfolgreiche Installationen basieren auf [ioBroker](https://www.iobroker.net/) und [evcc](https://evcc.io), viele Nutzer betreiben SOLECTRUS jedoch auch in anderen Szenarien. Entscheidend ist, dass man per MQTT an die Messwerte herankommt.

## Stromspeicher von SENEC

SOLECTRUS unterstützt außerdem nativ die Stromspeicher **SENEC.Home V3 und V2.1**, deren Messwerte über die proprietäre `lala.cgi`-Schnittstelle direkt ausgelesen werden. Auch der **SENEC.Home 4** wird unterstützt – per Cloud-Anbindung über die App-API.

## Linux-Server

Zum Ausführen von SOLECTRUS wird ein kleiner Server mit einem **64bit-Linux**-Betriebssystem benötigt, der [Docker](https://www.docker.com/)-Container ausführen kann und rund um die Uhr (24/7) in Betrieb ist.

Diesen Zwecke erfüllt beispielsweise ein [Raspberry Pi](https://de.wikipedia.org/wiki/Raspberry_Pi), aber es funktioniert auch mit vielen anderen Servern. Berichte über den erfolgreichen Einsatz von SOLECTRUS gibt es für:

- Raspberry Pi 5 mit 8GB RAM
- Raspberry Pi 4 Model B Rev 1.4 mit 8GB RAM
- Raspberry Pi 400
- Raspberry Pi 3 Model B
- Synology DS220+ mit 10GB RAM
- Synology DS218+
- QNAP TS-264 mit 8GB RAM
- Windows 10/11 Pro mit Hyper-V und Debian-Linux
- Mac Mini mit Docker Desktop
- Lenovo ThinkCentre M73 mit Linux Mint
- Fujitsu Futro S920 mit Linux Mint

:::note

Diese Liste wird gerne erweitert. Wenn du SOLECTRUS auf einem anderen Gerät erfolgreich betreibst, schreibe bitte eine E-Mail an <ScrambledEmail subject="SOLECTRUS erfolgreich im Einsatz" />. Ich freue mich insbesondere über Berichte zu ungewöhnlichen Installationen.

:::

Beim Zugriff auf die SENEC-App-API kann SOLECTRUS auch auf einem beliebigen Cloud-Server betrieben werden, auf dem Docker installiert ist. Erfolgreich getestet wurde SOLECTRUS auf einem [Hetzner-Cloud](https://hetzner.cloud/?ref=NggV8HU9FqCz)-Server mit 2 vCPUs und 4GB RAM. 2GB RAM sollten jedoch auch ausreichen. **Eine solche Installation kommt gänzlich ohne ein lokales Gerät aus.**

Es gibt jedoch auch Geräte, auf denen SOLECTRUS leider nicht funktioniert. Dazu gehören:

- FritzBox
- Apple TimeCapsule (geschlossenes System, Installation von Docker nicht möglich)
- Alte Synology NAS wie z.B. DS216+ mit Linux-Kernel v3 (es wird mindestens **v4** benötigt)
