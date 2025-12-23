# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt-Übersicht

Dies ist die deutschsprachige Dokumentation für SOLECTRUS, ein Photovoltaik-Monitoring-System. Die Dokumentation ist mit Astro Starlight aufgebaut und wird über GitHub Pages gehostet (https://docs.solectrus.de).

## Entwicklungs-Befehle

```bash
bun install        # Dependencies installieren
bun run dev        # Dev-Server starten (http://localhost:4321)
bun run build      # Production Build erstellen
bun run preview    # Build-Preview anzeigen
```

## Architektur

- **Framework**: Astro 5 mit Starlight Dokumentations-Theme
- **Package Manager**: Bun (lockfile: bun.lock)
- **Sprache**: Ausschließlich Deutsch (defaultLocale: 'de')
- **Deployment**: Automatisch via GitHub Actions bei Push auf `main`

### Verzeichnisstruktur

```
src/
├── content/docs/     # Markdown-Dokumentationsseiten
│   ├── installation/ # Installationsanleitungen
│   ├── referenz/     # Referenzdokumentation (Dashboard, Collectors, etc.)
│   ├── erweiterungen/# Erweiterte Konfigurationen
│   ├── wartung/      # Wartungsanleitungen
│   ├── bedienung/    # Bedienungsanleitungen
│   └── support/      # Support-Informationen
├── components/       # Astro-Komponenten (Head.astro, PlausibleAnalytics.astro)
├── assets/          # Bilder und andere Assets
└── styles/          # Custom CSS
```

### Konfigurationsdateien

- `astro.config.mjs`: Starlight-Sidebar-Struktur, Plugins (Mermaid, Sitemap), Theme-Konfiguration
- `src/content.config.ts`: Content Collections für Starlight
- `tsconfig.json`: TypeScript mit `@assets/*` Path-Alias

### Sidebar-Struktur

Die Sidebar wird in `astro.config.mjs` definiert und verwendet `autogenerate` für die meisten Verzeichnisse. Die Referenz-Sektion hat eine manuelle Struktur mit verschachtelten Untermenüs für die verschiedenen Komponenten (Dashboard, InfluxDB, PostgreSQL, Collectors, etc.).

## Dokumentations-Konventionen

### Seitenstruktur

Jede Markdown-Seite beginnt mit Frontmatter:

```yaml
---
title: Titel der Seite
sidebar:
  order: 2           # Reihenfolge in der Sidebar
  label: Kurzlabel   # Optional: Kürzerer Name für Sidebar
---
```

### Konfigurationsseiten-Aufbau

Konfigurationsseiten für Docker-Services folgen einem einheitlichen Muster:

1. **compose.yaml-Abschnitt**: Zeigt den Docker-Service mit allen Umgebungsvariablen
2. **Umgebungsvariablen-Abschnitt**: Dokumentiert jede Variable einzeln

### Dokumentation von Umgebungsvariablen

Jede Variable wird als H4-Überschrift (`####`) dokumentiert:

```markdown
#### VARIABLE_NAME

Beschreibung der Variable und ihres Zwecks.

:::note[Optional]
Standard: `default-value`

Mögliche Werte: `value1`, `value2`
:::

```properties title="Beispiel"
VARIABLE_NAME=example-value
```
```

**Status-Admonitions:**
- `:::note[Pflicht]` – Variable muss gesetzt werden
- `:::note[Optional]` – Variable kann weggelassen werden (mit Standard/Default)

### Starlight Admonitions

Verfügbare Typen: `:::note`, `:::tip`, `:::caution`, `:::danger`

Mit Titel: `:::note[Mein Titel]`

### Variablen-Mapping-Tabellen

Wenn Docker-Service-Variablen anders heißen als in der `.env`:

```markdown
:::note
| Name in `.env`     | Name im Service       |
| ------------------ | --------------------- |
| `POSTGRES_PASSWORD`| `DB_PASSWORD`         |
:::
```

## Weitere Hinweise

- Alle Dokumentationsseiten sind Markdown-Dateien im `src/content/docs/` Verzeichnis
- Neue Seiten werden automatisch in die Sidebar aufgenommen (via `autogenerate`)
- Mermaid-Diagramme werden über das `astro-mermaid` Plugin unterstützt
- Theme: `starlight-theme-rapide` für das Styling
- Interne Links verwenden absolute Pfade: `[Link](/referenz/dashboard/)`
