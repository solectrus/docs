---
title: Administrator-Zugang
layout: page
parent: Bedienung
---

Der Administrator-Zugang gewährleistet, dass nur autorisierte Benutzer bestimmte kritische Funktionen von SOLECTRUS ausführen können. Zu den gegenwärtig geschützten Funktionen gehören:

- Festlegung der Strompreise, der Einspeisevergütung und weiterer Optionen
- Durchführung der Registrierung

Ohne vorherigen Admin-Login hat ein Benutzer nur Lesezugriff und kann dementsprechend keine Einstellungen ändern.

<img src="{{ site.baseurl }}/assets/images/login.png" alt="Login" class="mx-auto w-full max-w-2xl rounded-full border-8 border-indigo-300" />

Übrigens: Wie du hier sehen kannst, ist es wirklich nur ein Passwort. Aus Gründen der Einfachheit gibt es keinen Benutzernamen oder E-Mail-Adresse.

Diese Funktion ist besonders nützlich, wenn deine Installation von SOLECTRUS von mehreren Benutzern genutzt wird, insbesondere wenn sie über das Internet zugänglich ist. Als Administrator kannst du sicherstellen, dass niemand außer dir die Einstellungen ändert.

### Festlegen und Ändern des Passwortes

Das Passwort für den Administrator-Zugang wird während der Installation von SOLECTRUS festgelegt und befindet sich in der `.env`-Datei:

```bash
# ...
#
# Password to login as administrator, required to manage settings like historical prices
ADMIN_PASSWORD=my-secret-login-password
```

Möchtest du das Passwort ändern, ist dies ausschließlich über die Bearbeitung der `.env`-Datei möglich. Nachdem du es dort geändert hast, muss SOLECTRUS neu gestartet werden, damit die Änderung wirksam wird.
