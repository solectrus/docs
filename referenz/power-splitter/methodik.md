---
title: Methodik
layout: page
parent: Power-Splitter
nav_order: 1
---

# Methodik des Power-Splitters

Der Power-Splitter unterteilt einen Tag in 1-Minuten-Abschnitt und betrachtet jeden separat. Für jeden Abschnitt wird die durchschnittliche Leistung (in W) des Hauses, der Wallbox und der Wärmepumpe ermittelt.

Die Aufteilung der Leistung auf die Verbraucher erfolgt dann so: Der Netzbezug wird zunächst der Wallbox zugeordnet (maximal bis zu deren Verbrauch). Ein etwaiger Rest wird dann zu gleichen Teilen auf Haus und Wärmepumpe aufgeteilt. Diese Priorisierung ergibt sich aus dem Gedanken, dass man das E-Auto bewusst an die die Wallbox anschließt, während Haus und Wärmepumpe eher dauerhaft oder zumindest weniger bewusst betrieben werden.

Ein Zahlenbeispiel zur Verdeutlichung:

- Netzbezug: 5 KW
- Wärmepumpe: 2 KW
- Wallbox: 4 KW
- Hausverbrauch: 1 KW

Es sind also 5 KW aufzuteilen. Die Wallbox hat 4 KW benötigt und erhält diese vollständig zugeordnet. Es bleiben 1 KW übrig, die zu gleichen Teilen (also 0,5 KW) auf Haus und Wärmepumpe aufgeteilt werden. Es ergibt sich somit:

- Netzbezug für Wallbox: 4 KW (von 4 KW)
- Netzbezug für Haus: 0,5 KW (von 1 KW)
- Netzbezug für Wärmepumpe: 0,5 KW (von 2 KW)

Es wird übrigens nur der Netzbezug aufgeteilt, also nicht etwa der PV-Strom. Daraus ergibt sich, dass der Akku gar nicht berücksichtigt werden muss. Strom aus dem Akku wird als PV-Strom angesehen, da der Akku üblicherweise nur PV-Strom aufnimmt und zeitverzögert wieder abgibt.
