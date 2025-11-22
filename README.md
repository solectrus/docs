# Dokumentation zu SOLECTRUS

Hier findet sich der Quelltext der **Dokumentation** zu SOLECTRUS. Die Texte sind in Markdown geschrieben und werden mit [Astro Starlight](https://starlight.astro.build/de/) gerendert. Das Hosting erfolgt über GitHub Pages.

## Lokale Entwicklung

```bash
# Dependencies installieren
bun install

# Dev-Server starten
bun run dev

# Production Build
bun run build

# Build Preview
bun run preview
```

Der Dev-Server läuft auf http://localhost:4321

## Deployment

Das Deployment erfolgt automatisch über GitHub Actions bei jedem Push auf `main`. Die Workflow-Datei liegt in `.github/workflows/pages.yml`.

## Beitragen

Bei Fehlern oder Verbesserungsvorschlägen (zur Dokumentation, nicht zu SOLECTRUS selbst!) ist ein Pull Request oder ein Issue sehr willkommen.
