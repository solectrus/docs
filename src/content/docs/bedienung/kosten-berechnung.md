---
title: Kosten durch den Stromverbrauch
sidebar:
  order: 3
  label: Kosten-Berechnung
---

SOLECTRUS berechnet Kosten, die für den Verbrauch von Strom anfallen, wobei zwischen **Netzbezug** und **Eigenverbrauch** unterschieden wird. Die Darstellung erfolgt für jeden beliebigen Zeitraum, z.B. für einen Monat oder ein Jahr. Hier ein Beispiel:

![Kostenberechnung](@assets/kosten.png)

:::note
Die hier beschriebene Berechnung gilt ab Version `0.16`. Frühere Versionen haben die Kosten anders dargestellt.
:::

## Strompreise als Grundlagen

Berechnungsgrundlage sind, neben dem gemessenen Netzbezug und dem Eigenverbrauch insbesondere die eingestellten Strompreise. Auch hierzu ein Beispiel:

![Strompreise](@assets/strompreise.png)

## Opportunitätskosten

Teil der Kosten ist die entgangene Einspeisevergütung (Opportunitätskosten), die beim Eigenverbrauch dadurch entstehen, wenn der erzeugte Strom nicht ins Netz eingespeist wird. Dieser Teil der Berechnung ist optional und kann in den Einstellungen auch deaktiviert werden.

![Opportunitätskosten](@assets/opportunitaetskosten.png)

## Die Berechnung im Detail

Die Berechnung erfolgt in mehreren Schritten:

1. Ermittlung der Strompreise, die für den ausgewählten Zeitraum gelten - hier also für ein Jahr. Hat sich der Preis im gewählten Zeitraum geändert, wird das berücksichtigt, indem der Zeitraum in einzelne Abschnitte aufgeteilt wird. Hier im Beispiel ist das der Fall: Der Strompreis bewegte sich zwischen `0,2545 €/kWh` und `0,3244 €/kWh`. Insgesamt hat sich der Preis zweimal geändert, es gab also drei verschiedene Preise. Somit sind drei Zeitabschnitte zu bilden.

2. Für jeden Zeitabschnitt wird der Netzbezug in kWh aus den Messwerten ermittelt. Im Beispiel sind es aufsummiert `1.335 kWh`. Analog wird der Eigenverbrauch ermittelt (aus der Differenz von Erzeugung und Einspeisung), im Beispiel sind es `4.926 kWh`.

3. Die Netzbezugskosten ergeben sich für jeden Zeitabschnitt durch Multiplikation von Stromverbrauch und Strompreis. Zum Schluss wird alles aufaddiert. Im Beispiel resultieren daraus `386 €`.

   Wenn die Berechnung der Opportunitätskosten aktiviert ist, geht es noch weiter:

4. Hinzu kommt die entgangene Einspeisevergütung, also der Eigenverbrauch multipliziert mit der Einspeisevergütung. Im Beispiel sind das `418 €`.

5. Die Gesamtkosten betragen also `804 €`. Diese Kosten sind entstanden, um die benötigten Verbraucher mit Strom zu versorgen.

## Mehr Details mit dem Power-Splitter

Dargestellt wurden bislang die **Gesamtkosten**, die im gewählten Zeitraum entstanden sind (im Beispiel `804 €`). Wenn man wissen möchte, wie viel davon auf die einzelnen Verbraucher entfällt, z.B. das Haus, die Wärmepumpe oder das E-Auto, dann kommt der [Power-Splitter](/referenz/power-splitter) ins Spiel.

Beim Verbrauch entsteht üblicherweise ein Mix aus Eigenverbrauch (grüner Strom) und Netzbezug. Diese Aufteilung wird vom Power-Splitter für jeden der großen Verbraucher ermittelt und aufsummiert.

Aus dem Anteil werden dann die echten Stromkosten dieser Verbraucher ermittelt, die sich aus Netzbezug und entgangener Einspeisevergütung (optional) zusammensetzen. Hier ein Beispiel für das E-Auto in einem Jahr:

![Power-Splitter](@assets/power-splitter-car.png)

Hier hat das E-Auto etwa 2 MWh im Jahr über die Wallbox bezogen. 69% davon war grüner Strom, wurde also selbst über die PV-Anlage erzeugt. Der kleinere rote Teil des Balkens zeigt den Netzbezug an.

Die Summe aus Netzbezug und entgangener Einspeisevergütung beträgt `314 €`, wobei die jeweils gültigen Strompreise berücksichtigt werden. So kennt man jetzt die Stromkosten, die das E-Auto über die Wallbox verursacht hat.

:::caution
Zu beachten ist bei diesem Beispiel, dass externe Ladungen (z.B. an öffentlichen Ladesäulen) hier nicht berücksichtigt werden, da es dafür keine Messwerte gibt. Es ist geplant, dass zukünftige Versionen von SOLECTRUS diese Lücke schließen werden, indem externe Beladungen manuell erfasst werden können.
:::
