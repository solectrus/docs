// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeRapide from 'starlight-theme-rapide';
import mermaid from 'astro-mermaid';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.solectrus.de',
  // Astro 7 uses the native Sätteri processor by default, which does not run
  // remark/rehype plugins. astro-mermaid relies on a rehype plugin, so we keep
  // the unified() pipeline to ensure Mermaid diagrams are rendered.
  markdown: {
    processor: unified(),
  },
  redirects: {
    '/wartung/updates/': '/anleitungen/updates/',
    '/wartung/datensicherung/': '/anleitungen/datensicherung/',
    '/wartung/server-umzug/': '/anleitungen/server-umzug/',
    '/wartung/datenkorrektur/': '/anleitungen/datenkorrektur/',
    '/wartung/logging/': '/anleitungen/logging/',
    '/wartung/sensor-konfiguration/': '/anleitungen/sensor-konfiguration/',
    '/erweiterungen/': '/anleitungen/',
    '/erweiterungen/multiple-erzeuger/': '/anleitungen/multiple-erzeuger/',
    '/erweiterungen/mehrere-shelly/': '/anleitungen/mehrere-shelly/',
    '/support/docker/': '/anleitungen/docker/',
    '/support/community/': '/anleitungen/',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  vite: {
    build: {
      // The Mermaid bundle exceeds Vite's default 500 kB warning threshold.
      // This is expected and not a regression, so raise the limit to keep the
      // build output clean (CI treats any remaining warning as a failure).
      chunkSizeWarningLimit: 2000,
    },
  },
  integrations: [
    sitemap(),
    mermaid(),
    starlight({
      plugins: [starlightThemeRapide()],
      title: 'Dokumentation',
      description: 'Dokumentation für SOLECTRUS',
      logo: {
        light: './public/logo-light.svg',
        dark: './public/logo-dark.svg',
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Deutsch',
          lang: 'de',
        },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/solectrus/docs',
        },
      ],
      sidebar: [
        {
          label: 'Installation',
          collapsed: true,
          items: [{ autogenerate: { directory: 'installation' } }],
        },
        {
          label: 'Referenz',
          collapsed: true,
          items: [
            {
              slug: 'referenz',
            },
            {
              label: 'Dashboard',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/dashboard' } }],
            },
            {
              label: 'InfluxDB',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/influxdb' } }],
            },
            {
              label: 'PostgreSQL',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/postgresql' } }],
            },
            {
              label: 'Redis',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/redis' } }],
            },
            {
              label: 'Forecast-Collector',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/forecast-collector' } }],
            },
            {
              label: 'MQTT-Collector',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/mqtt-collector' } }],
            },
            {
              label: 'Power-Splitter',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/power-splitter' } }],
            },
            {
              label: 'SENEC-Charger',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/senec-charger' } }],
            },
            {
              label: 'SENEC-Collector',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/senec-collector' } }],
            },
            {
              label: 'Shelly-Collector',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/shelly-collector' } }],
            },
            {
              label: 'Tibber-Collector',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/tibber-collector' } }],
            },
            {
              label: 'Ingest',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/ingest' } }],
            },
            {
              label: 'Watchtower',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/watchtower' } }],
            },
            {
              label: 'CSV-Importer',
              collapsed: true,
              items: [{ autogenerate: { directory: 'referenz/csv-importer' } }],
            },
          ],
        },
        {
          label: 'Praxis',
          collapsed: true,
          items: [{ slug: 'anleitungen' }, { slug: 'bedienung' }, { slug: 'support' }],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Head: './src/components/Head.astro',
      },
    }),
  ],
});
