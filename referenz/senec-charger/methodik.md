---
title: Methodik
layout: page
parent: SENEC-Charger
nav_order: 2
---

# Methodik des SENEC-Chargers

Eine Beladung erfolgt unter folgenden Bedingungen, die alle erfüllt sein müssen:

- Der Strompreis ist gerade besonders günstig
- Es ist nur wenig Solarstrom zu erwarten
- Der Speicher ist leer

Ob die Bedingung erfüllt ist, wird in regelmäßigen Abständen überprüft (normalerweise stündlich). Es Docker-Log wird genau protokolliert und begründet, ob eine Netzbeladung ausgelöst wurde oder nicht.

Wenn der Akku voll ist, wird die Beladung wieder frei gegeben.

## Flussdiagramm

Jede einzelne Prüfung finden nach einem festen Ablauf statt, der in folgendem Flussdiagramm dargestellt ist:

<img
  src="{{ site.baseurl }}/assets/images/senec-charger.svg"
  alt="SENEC-Charger"
/>

{: .note }

Der SENEC-Charger kann auch im "Trockenlauf" betrieben werden, d.h. es wird nur simuliert, ob der Speicher beladen werden würde.
