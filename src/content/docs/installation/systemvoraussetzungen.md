---
title: Systemvoraussetzungen für SOLECTRUS
description: Über die unterstützten Photovoltaik-Geräte und was außer Raspberry Pi noch in Frage kommt.
sidebar:
  order: 2
  label: Systemvoraussetzungen
---

Für den Betrieb von SOLECTRUS wird neben der Photovoltaik-Anlage (optional mit Stromspeicher, Wärmepumpe und/oder Wallbox) bzw. einem Balkonkraftwerk lediglich ein kleiner Linux-Server benötigt.

## Linux-Server

Zum Ausführen von SOLECTRUS wird ein kleiner Server mit einem **64bit-Linux**-Betriebssystem benötigt, der [Docker](https://www.docker.com/)-Container ausführen kann und rund um die Uhr (24/7) in Betrieb ist. Der **freie** Arbeitsspeicher (RAM) sollte mindestens **1GB** betragen, besser mehr.

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

Wer SOLECTRUS auf einem anderen Gerät erfolgreich betreibt, kann gerne die Liste ergänzen.

:::note[Empfehlung]
Falls du dir speziell für SOLECTRUS einen Minicomputer zulegen möchtest und unsicher bist, was du nehmen solltest, dann ist ein **Raspberry Pi 5** mit **8GB RAM** sicherlich eine gute Wahl.
:::

## Anbindung per MQTT

Über das verbreitete Netzwerkprotokoll <a href="https://de.wikipedia.org/wiki/MQTT">MQTT</a> können beliebige Stromspeicher, Wechselrichter, Wallboxen, Wärmepumpen und E-Autos integriert werden, sofern diese ein Auslesen von Messwerten ermöglichen. Hierfür ist zusätzliche Software notwendig, insbesondere ein MQTT-Broker. Erfolgreiche Installationen basieren auf [Home Assistant](https://www.home-assistant.io/), [ioBroker](https://www.iobroker.net/) oder [evcc](https://evcc.io). Entscheidend ist, dass man per MQTT an die Messwerte herankommt.

## Stromspeicher von SENEC

SOLECTRUS unterstützt außerdem nativ die Stromspeicher **SENEC.Home V2.1 und V3**, deren Messwerte über eine proprietäre Schnittstelle lokal ausgelesen werden. Auch der **SENEC.Home P4** wird unterstützt – per Anbindung an `meine-senec.de`.

## Reine Cloud-Installation

In bestimmten Fällen (z.B. bei Verwendung eines SENEC Stromspeichers) ist auch eine reine Cloud-Installation möglich, also ganz ohne lokalen Server. In anderen Fällen ist eine verteilte Installation möglich, bei der die Datensammlung auf einem lokalen Server erfolgt, während die Datenspeicherung und das Dashboard auf einem Cloud-Server betrieben wird.

Für beides benötigt man einen Cloud-Server. Erfolgreich getestet wurde SOLECTRUS unter folgenden Umgebungen:

- Virtueller Server in der [Hetzner-Cloud](https://hetzner.cloud/?ref=NggV8HU9FqCz) mit 2 vCPUs und 4GB RAM (ca. 5€/Monat).
- Virtueller Server von Strato [VC 1-2](https://www.strato.de/server/linux-vserver/) mit 1 vCPU und 2GB RAM (ca. 2€/Monat) mit [evcc](https://evcc.io/).

## Nicht unterstützte Geräte

Es gibt jedoch auch Geräte, auf denen SOLECTRUS leider nicht funktioniert. Dazu gehören:

- FritzBox
- Apple TimeCapsule (geschlossenes System, Installation von Docker nicht möglich)
- Alte Synology NAS wie z.B. DS216+ mit Linux-Kernel 3.x (es wird mindestens **4.x** benötigt). Es gibt aber Berichte, dass SOLECTRUS mittlerweile auch mit einem 3.x-Kernel funktioniert - im Zweifel einfach ausprobieren.
