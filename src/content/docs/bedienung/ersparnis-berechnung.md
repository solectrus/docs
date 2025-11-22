---
title: Ersparnis durch die Photovoltaikanlage
sidebar:
  order: 4
  label: Ersparnis-Berechnung
---

Die Einsparung, die durch den Betrieb der PV-Anlage erzielt wird, besteht grundsätzlich aus zwei Komponenten:

1. Einsparung durch Reduzierung des aus dem Netz bezogenen Stroms
2. Einsparung durch Erhalt einer Einspeisevergütung für den ins Netz abgegebenen Strom

SOLECTRUS berechnet die Ersparnis aus einer Gegenüberstellung zweier Szenarien: Die aktuelle Situation (d.h. **mit** PV-Anlage) wird mit einem theoretischen Szenario verglichen, bei dem man **keine** PV-Anlage hat, aber den exakt gleichen Stromverbrauch verursacht. SOLECTRUS macht also einen Vorher-Nachher-Vergleich und bildet die Differenz. Das sieht dann so aus (im Beispiel ein einzelnes Jahr):

![Ersparnis durch PV-Anlage](@assets/ersparnis.png)

## Berechnung der Ersparnis

Die Berechnung erfolgt in drei Schritten:

1. **Mit PV-Anlage**: Es werden zunächst die Kosten berechnet, die durch den Bezug von Strom tatsächlich entstehen (siehe auch die Erläuterungen zur [Kosten-Berechnung](/bedienung/kosten-berechnung/)). Der Betrag ist immer negativ, hier im Beispiel sind es `-386 €`. Außerdem erhält man eine Einspeisevergütung für den Überschuss (hier `624 €`, positiv). Zusammen ergibt das den "Solarpreis" als Summe, wobei die Vorzeichen zu beachten sind (hier: `-386 € + 624 € = 238 €`). Der Solarpreis ist meist positiv, kann aber je nach gewähltem Zeitraum auch negativ sein, z.B. im Winter, wenn der Strombezug mehr kostet als die Einspeisevergütung einbringt.

2. **Ohne PV-Anlage**: Der Strom für den gesamten Verbrauch muss gekauft werden und es gibt natürlich keine Einspeisevergütung. Gerechnet wird `(Hausverbrauch + Wallbox) * Strompreis`. In Beispiel ergibt sich ein "Vergleichspreis" (immer negativ) mit den theoretischen Strombezugskosten von `1.857 €`. Berücksichtigt werden bei der Berechnung die sich im Zeitverlauf ändernden Strompreise.

3. **Vergleich**: Die mit der PV-Anlage erzielte Ersparnis ist nun die Differenz zwischen Solarpreis und Vergleichspreis. Weil der Solarpreis sowohl positiv (Sommer) als auch negativ (Winter) sein kann, sind die Vorzeichen wichtig. Im Beispiel wird gerechnet: \
   `238 € - (- 1.857 €) = 2.095 €`. Das bedeutet: Dadurch, dass man eine PV-Anlage hast, hat man im gewählten Zeitraum 2095 € mehr im Geldbeutel, als wenn man keine PV-Anlage hätte.

Zusammengefasst lässt sich die Formel wie folgt darstellen:

```
Ersparnis (€) = (Hausverbrauch + Wallbox - Strombezug) * Strompreis +
                Einspeisung * Einspeisevergütung
```

Da sich der Strompreis im Zeitverlauf üblicherweise ändert, wird diese Berechnung für jeden Teilzeitraum einzeln durchgeführt und das Ganze dann aufsummiert, d.h. tatsächlich ist die Berechnung etwas komplexer.

## Anteil des Speichers an der Ersparnis

Zum Schluss errechnet SOLECTRUS, welchen Anteil der Stromspeicher (Akku) an der Ersparnis hat. Hierfür wird folgende Formel verwendet:

```
Ersparnis durch Akku (€) =   Akkuentnahme (kWh) * Strompreis (€/kWh)
                           - Akkubeladung (kWh) * Einspeisevergütung (€/kWh)
```

Die Idee ist hier, dass man einerseits den aus dem Akku entnommenen Strom nicht kaufen muss, also den Strompreis einspart. Andererseits verliert man aber auch die Einspeisevergütung für die Strommenge, mit der man den Akku auflädt.

Die Akku-Ersparnis ist also der Betrag, der gespart wird, weil man einen Akku hat - gegenüber der Situation, eine PV-Anlage ohne Akku zu betreiben. Anders ausgedrückt: Mit diesem Betrag amortisiert sich die Investition in den Akku.

Der Betrag wird schließlich noch prozentual ins Verhältnis zur vorher ausgerechneten Gesamtersparnis gesetzt.

## Zugrunde liegende Annahmen

Zu beachten ist, dass diese Berechnung die Anfangsinvestitionen in die PV-Anlage nicht berücksichtigt und auch Wartungskosten, Versicherungsprämien etc. nicht mit einfließen.

Ebenfalls unberücksichtigt bleibt, dass der Speicher einen nicht unerheblichen Eigenverbrauch hat und somit der Hausverbrauch höher ist, als wenn man keine PV-Anlage bzw. keinen Stromspeicher hätte. Da sich dies aber nicht genau beziffern lässt, wird dieser Effekt in der Berechnung nicht berücksichtigt.
