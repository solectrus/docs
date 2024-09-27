---
title: Kosten-Berechnung
layout: page
parent: Bedienung
---

# Berechnung der entstandenen Stromkosten

SOLECTRUS berechnet Kosten, die für den Verbrauch von Strom anfallen, wobei zwischen Netzbezug und Eigenverbrauch unterschieden wird. Diese werden für den ausgewählten Zeitraum dargestellt, hier ein Beispiel:

<img
  src="{{ site.baseurl }}/assets/images/kosten.png"
  alt="Kostenberechnung"
  class="mx-auto w-full max-w-lg rounded-full border-8 border-indigo-300"
/>

Teil der Kosten ist die entgangene Einspeisevergütung, die beim Eigenverbrauch entsteht, wenn der erzeugte Strom nicht ins Netz eingespeist wird. Dieser Teil der Berechnung ist optional und kann auch deaktiviert werden.

:::note

Die hier beschriebene Berechnung gilt ab Version `0.16.0`. Frühere Versionen haben die Kosten anders dargestellt.

:::

Berechnungsgrundlage sind die eingestellten Strompreise, die sich regelmäßig ändern können. Auch hierzu ein Beispiel:

<img
  src="{{ site.baseurl }}/assets/images/strompreise.png"
  alt="Strompreise"
  class="mx-auto w-full max-w-2xl rounded-full border-8 border-indigo-300"
/>

Die Berechnung erfolgt in drei Schritten:

1. Ermittlung der Strompreise, die für den ausgewählten Zeitraum gelten - hier also für ein Jahr. Hat sich der Preis im gewählten Zeitraum geändert, wird das berücksichtigt, indem der Zeitraum in einzelne Abschnitte aufgeteilt wird. Hier im Beispiel ist das der Fall: Der Strompreis bewegte sich zwischen `0,2545 €/kWh` und `0,3244 €/kWh`. Insgesamt hat sich der Preis zweimal geändert, es gab also drei verschiedene Preise. Somit sind drei Zeitabschnitte zu bilden.

2. Für jeden Zeitabschnitt wird der Stromverbrauch in kWh aus den Messwerten ermittelt. Im Beispiel sind es aufsummiert `1.335 kWh`. Die Einzelverbräuche der Zeitabschnitte werden aus Gründen der Einfachheit nicht dargestellt. Gleiches gilt für den Eigenverbrauch, im Beispiel sind es `4.926 kWh`.

3. Die Netzbezugskosten ergeben sich für jeden Zeitabschnitt durch Multiplikation von Stromverbrauch und Strompreis. Zum Schluss wird alles aufaddiert. Im Beispiel resultieren daraus `386 €`. Hinzu kommt die entgangene Einspeisevergütung, im Beispiel `418 €`. Die Gesamtkosten betragen also `804 €`. Diese Kosten sind entstanden, um die benötigten Verbraucher mit Strom zu versorgen.

<h2>Power-Splitter</h2>

Mit dem [Power-Splitter](/features/#power-splitter) gibt es ein mächtiges Werkzeug, um die tatsächlichen Kosten der großen Verbraucher Haus, Wärmepumpe und E-Auto **separat** zu berechnen.

Beim Verbrauch entsteht üblicherweise ein Mix aus Eigenverbrauch (grüner Strom) und Netzbezug. Diese Aufteilung wird vom Power-Splitter für jeden der großen Verbraucher ermittelt und aufsummiert.

:::note

Die Berechnung erfolgt &dash; grob skizziert &dash; in etwa so:

Im Minutentakt wird der insgesamt bezogene Netzstrom (in Watt) ermittelt. Dieser wird anteilig auf die im gleichen Zeitabschnitt aktiven Verbraucher verteilt. Dabei wird das E-Auto erstrangig behandelt, da man dieses meist bewusst lädt. Der verbliebene Rest (sofern vorhanden) wird dann anteilig auf Haus und Wärmepumpe verteilt.

Insgesamt ist damit für jede Minute bekannt, welcher Verbraucher welchen Anteil am Netzbezug hat.

:::

Aus dem Anteil werden dann die echten Stromkosten dieser Verbraucher ermittelt, die sich aus Netzbezug und entgangener Einspeisevergütung (optional) zusammensetzen. Hier ein Beispiel für das E-Auto in einem Jahr:

<img
  src="{{ site.baseurl }}/assets/images/power-splitter-car.png"
  alt="Power-Splitter"
  class="mx-auto w-full max-w-xs rounded-full border-8 border-indigo-300"
/>

In diesem Beispiel hat das E-Auto etwa 2 MWh im Jahr über die Wallbox bezogen. 69% davon war grüner Strom, wurde also selbst über die PV-Anlage erzeugt. Der kleinere rote Teil des Balkens zeigt den Netzbezug an.

Die Summe aus Netzbezug und entgangener Einspeisevergütung beträgt `314 €`, wobei die jeweils gültigen Strompreise berücksichtigt werden. So kennt man jetzt die Stromkosten für ein Jahr Autofahren.

:::caution

Zu beachten ist bei diesem Beispiel, dass externe Ladungen (z.B. an öffentlichen Ladesäulen) hier nicht berücksichtigt werden, da es dafür keine Messwerte gibt. Zukünftige Versionen werden diese Lücke schließen, indem externe Beladungen manuell erfasst werden können.

:::
