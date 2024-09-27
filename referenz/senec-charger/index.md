---
title: SENEC-Charger
layout: page
parent: Referenz
nav_order: 8
---

Der **SENEC-Charger** ist eine Komponente, die einen SENEC-Stromspeicher bei Verwendung eines dynamischen Stromtarifs (von [Tibber](https://tibber.com/de)) aus dem Netz belädt, wenn dies lohnenswert ist.

Die Beladung erfolgt unter folgenden Bedingungen:

- Der Strompreis ist gerade besonders günstig (ermittelt über den [Tibber-Collector](/komponenten/tibber-collector/))
- Es ist nur wenig Solarstrom zu erwarten (ermittelt über den [Forecast-Collector/](/komponenten/forecast-collector/))
- Der Speicher ist leer

Ob die Bedingung erfüllt ist, wird in regelmäßigen Abständen überprüft (normalerweise stündlich). Es Docker-Log wird genau protokolliert und begründet, ob eine Netzbeladung ausgelöst wurde oder nicht.

Der SENEC-Charger kann auch im "Trockenlauf" betrieben werden, d.h. es wird nur simuliert, ob der Speicher beladen werden würde.

{: .note }

Da für die Beladung des Speichers ein direkter Zugriff auf den SENEC-Stromspeicher notwendig ist, funktioniert dies leider nicht mit dem Home 4 oder neuer. Es wird ausschließlich der SENEC V2.1 und V3 unterstützt.

Quelltext im GitHub-Repository: \
[github.com/solectrus/senec-charger](https://github.com/solectrus/senec-charger)
