---
title: Administrator-Zugang
sidebar:
  order: 2
---

Einige Bereiche von SOLECTRUS sind geschützt und nur für autorisierte Benutzer zugänglich. Dazu gehören:

- Festlegung der Strompreise, der Einspeisevergütung und weiterer Optionen
- Zurücksetzen der Tageszusammenfassungen
- Durchführung der Registrierung
- Abschließen eines Sponsoring-Abos

Diese Funktionen sind dem Administrator vorbehalten. Die normalen Benutzer haben nur Lesezugriff und können keine Einstellungen ändern.

Die Anmeldung erfolgt über das Seitenmenü und sieht dann so aus:

![Login](@assets/login.png)

Wie man hier sehen kann, ist es wirklich nur ein Passwort. Aus Gründen der Einfachheit gibt es keinen Benutzernamen oder E-Mail-Adresse. Das Passwort kann einer weiteren Person mitgeteilt werden, die dann ebenfalls Zugriff auf die Einstellungen erhält.

Diese Funktion ist besonders nützlich, wenn eine Installation von SOLECTRUS von mehreren Benutzern genutzt wird, insbesondere wenn sie über das Internet zugänglich ist. Es wird dadurch sichergestellt, dass nur berechtigte Personen Zugriff auf die Einstellungen haben.

### Festlegen und Ändern des Passwortes

Das Passwort für den Administrator-Zugang wird während der Installation von SOLECTRUS festgelegt und befindet sich in der `.env`-Datei:

```bash
# ...
ADMIN_PASSWORD=me1n-gehe1mes-passw0rt
```

Eine Änderung des Passworts ist über die Bearbeitung der `.env`-Datei möglich. Nachdem es dort geändert wurde, muss SOLECTRUS neu gestartet werden, damit die Änderung wirksam wird:

```
docker-compose up -d
```
