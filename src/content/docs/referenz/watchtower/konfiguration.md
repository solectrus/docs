---
title: Konfiguration von Watchtower
sidebar:
  order: 2
  label: Konfiguration
---

**Watchtower** wird üblicherweise in die Gesamtkonfiguration von SOLECTRUS integriert, d.h. die bestehende Datei `compose.yaml` ist zu erweitern.

## compose.yaml

```yaml
services:
  # ....
  watchtower:
    image: containrrr/watchtower
    environment:
      - TZ
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --scope solectrus --cleanup
    restart: unless-stopped
    logging:
      options:
        max-size: 10m
        max-file: '3'
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  dashboard:
    # ...
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus

  senec-collector:
    # ...
    labels:
      - com.centurylinklabs.watchtower.scope=solectrus
  # ...
```

Wesentlich sind hier zwei Dinge:

- Watchtower wird als eigener Service definiert. Dieser Service hat Zugriff auf den Docker-Daemon, um Container zu aktualisieren. Außerdem wird (über den Parameter `scope`) festgelegt, dass nicht sämtliche Container aktualisiert werden sollen, sondern nur die mit entsprechender Kennzeichnung. Falls SOLECTRUS also auf einem Docker-Host läuft, auf dem auch ganz andere Container laufen, werden diese nicht angetastet.
- Jeder Service, der von Watchtower aktualisiert werden soll, erhält das Label `com.centurylinklabs.watchtower.scope=solectrus`. Dadurch wird Watchtower angewiesen, den zugehörigen Container aktuell zu halten.

Watchtower lässt sich ansonsten vielfältig konfigurieren. Die hier angegebene Standardkonfiguration ist für SOLECTRUS aber vollkommen ausreichen.

:::note
Watchtower läuft standardmäßig einmal täglich, die erste Prüfung erfolgt 24 Stunden nach dem Start. Wenn Watchtower gerade erst eingerichtet wurde, musst also für die erste Update-Prüfung einen Tag gewartet werden.
:::

## Alternativen

Watchtower scheint vom ursprünglichen Entwickler nicht mehr aktiv gepflegt zu werden. Die Verwendung in SOLECTRUS ist jedoch weiterhin unverändert und problemlos möglich.

Bei Interesse kann man sich diese zwei Forks anschauen, die man statt des Originals verwenden kann:

- https://github.com/beatkind/watchtower (Docker-Image: [beatkind/watchtower](https://hub.docker.com/r/beatkind/watchtower))
- https://github.com/nicholas-fedor/watchtower (Docker-Image: [nickfedor/watchtower](https://hub.docker.com/r/nickfedor/watchtower))

Die Forks sind kompatibel zum Original-Watchtower, es genügt also, in der `compose.yaml`-Datei das Image auszutauschen. Die Konfiguration bleibt ansonsten unverändert.
