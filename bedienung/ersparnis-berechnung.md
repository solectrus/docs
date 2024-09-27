---
title: Ersparnis-Berechnung
layout: page
parent: Bedienung
---

# Berechnung der Ersparnis durch die Photovoltaikanlage

## Die zwei Komponenten der Ersparnis

Die Einsparung, die durch den Betrieb der PV-Anlage erzielt wird, besteht grundsätzlich aus zwei Komponenten:

1. Einsparung durch Reduzierung des aus dem Netz bezogenen Stroms
2. Einsparung durch Erhalt einer Einspeisevergütung für den ins Netz abgegebenen Strom

SOLECTRUS berechnet die Ersparnis aus einer Gegenüberstellung zweier Szenarien: Die aktuelle Situation (d.h. **mit** PV-Anlage) wird mit einem theoretischen Szenario verglichen, bei dem man **keine** PV-Anlage hat, aber den exakt gleichen Stromverbrauch verursacht. SOLECTRUS macht also einen Vorher-Nachher-Vergleich und bildet die Differenz. Das sieht dann so aus (im Beispiel für das Jahr 2022):

<img
  src="{{ site.baseurl }}/assets/images/ersparnis.png"
  alt="Einsparung durch PV-Anlage"
  class="mx-auto w-full max-w-2xl rounded-full border-8 border-indigo-300"
/>

## Berechnung der Ersparnis

Die Berechnung erfolgt in drei Schritten:

1. **Mit PV-Anlage**: Es werden zunächst die Kosten berechnet, die durch den Bezug von Strom tatsächlich entstehen (siehe auch die Erläuterungen zur [Kosten-Berechnung](/faq/kosten-berechnung/)). Der Betrag ist immer negativ, hier im Beispiel sind es `-386 €`. Außerdem erhält man eine Einspeisevergütung für den Überschuss (hier `624 €`, positiv). Zusammen ergibt das den "Solarpreis" als Summe, wobei die Vorzeichen zu beachten sind (hier: `-386 € + 624 € = 238 €`). Der Solarpreis ist meist positiv, kann aber je nach gewähltem Zeitraum auch negativ sein, z.B. im Winter, wenn der Strombezug mehr kostet als die Einspeisevergütung einbringt.

2. **Ohne PV-Anlage**: Der Strom für den gesamten Verbrauch muss gekauft werden und es gibt natürlich keine Einspeisevergütung. Gerechnet wird `(Hausverbrauch + Wallbox) * Strompreis`. In Beispiel ergibt sich ein "Vergleichspreis" (immer negativ) mit den theoretischen Strombezugskosten von `1.857 €`. Berücksichtigt werden bei der Berechnung die sich im Zeitverlauf ändernden Strompreise.

3. **Vergleich**: Die mit der PV-Anlage erzielte Ersparnis ist nun die Differenz zwischen Solarpreis und Vergleichspreis. Weil der Solarpreis sowohl positiv (Sommer) als auch negativ (Winter) sein kann, sind die Vorzeichen wichtig. Im Beispiel wird gerechnet: \
   `238 € - (- 1.857 €) = 2.095 €`. Das bedeutet: Dadurch, dass du eine PV-Anlage hast, hast du im gewählten Zeitraum 2095 € mehr im Geldbeutel, als wenn du keine PV-Anlage hättest.

Zusammengefasst lässt sich die Formel wie folgt darstellen:

```
Ersparnis (€) = (Hausverbrauch + Wallbox - Strombezug) * Strompreis +
                Einspeisung * Einspeisevergütung
```

Da sich der Strompreis im Zeitverlauf ändern kann, wird diese Berechnung für jeden Teilzeitraum einzeln durchgeführt und das Ganze dann aufsummiert.

:::caution

Diese Berechnungsformel unterscheidet sich von der SENEC-App, die in der aktuellen Version v4.3.2 aus mir nicht verständlichen Gründen die **Speicherentladung** (anstatt des **Strombezugs**) mit einbezieht und folgende Formel verwendet:

```
Ersparnis (€) = (Hausverbrauch + Wallbox + Speicherentladung) * Strompreis +
                Einspeisung * Einspeisevergütung
```

Dies ist aus meiner Sicht **falsch** und ergibt eine zu hohe Ersparnis.

:::

## Anteil des Speichers an der Ersparnis

Zum Schluss errechnet SOLECTRUS, welchen Anteil der Stromspeicher (Akku) an der Ersparnis hat:

```
Ersparnis durch Akku (€) =
    Akkuentnahme (kWh) * Strompreis (€/kWh)
  - Akkubeladung (kWh) * Einspeisevergütung (€/kWh)
```

Die Idee ist hier, dass man einerseits den aus dem Akku entnommenen Strom nicht kaufen muss, also den Strompreis einspart. Andererseits verliert man aber auch die Einspeisevergütung für die Strommenge, mit der man den Akku auflädt. Die Akku-Ersparnis ist also der Betrag, der gespart wird, weil man einen Akku hat - gegenüber der Situation, eine PV-Anlage ohne Akku zu betreiben. Anders ausgedrückt: Mit diesem Betrag amortisiert sich die Investition in den Akku.\
Der Betrag wird schließlich noch prozentual ins Verhältnis zur vorher ausgerechneten Gesamtersparnis gesetzt.

## Zugrunde liegende Annahmen

Zu beachten ist, dass diese Berechnung die Anfangsinvestitionen in die PV-Anlage nicht berücksichtigt und auch Wartungskosten, Versicherungsprämien etc. nicht mit einfließen.

Ebenfalls unberücksichtigt bleibt, dass der Speicher einen nicht unerheblichen Eigenverbrauch hat und somit der Hausverbrauch höher ist, als wenn man keine PV-Anlage bzw. keinen Stromspeicher hätte.
