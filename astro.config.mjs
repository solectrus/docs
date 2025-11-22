// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeRapide from 'starlight-theme-rapide';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.solectrus.de',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  integrations: [
    mermaid(),
    starlight({
      plugins: [starlightThemeRapide()],
      title: 'Dokumentation',
      description: 'Dokumentation für SOLECTRUS',
      logo: {
        light: './public/logo-light.svg',
        dark: './public/logo.svg',
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
      editLink: {
        baseUrl: 'https://github.com/solectrus/docs/tree/main/',
      },
      sidebar: [
        {
          slug: 'index',
        },
        {
          label: 'Installation',
          collapsed: true,
          autogenerate: { directory: 'installation' },
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
              autogenerate: { directory: 'referenz/dashboard' },
            },
            {
              label: 'InfluxDB',
              collapsed: true,
              autogenerate: { directory: 'referenz/influxdb' },
            },
            {
              label: 'PostgreSQL',
              collapsed: true,
              autogenerate: { directory: 'referenz/postgresql' },
            },
            {
              label: 'Redis',
              collapsed: true,
              autogenerate: { directory: 'referenz/redis' },
            },
            {
              label: 'Forecast-Collector',
              collapsed: true,
              autogenerate: { directory: 'referenz/forecast-collector' },
            },
            {
              label: 'MQTT-Collector',
              collapsed: true,
              autogenerate: { directory: 'referenz/mqtt-collector' },
            },
            {
              label: 'Power-Splitter',
              collapsed: true,
              autogenerate: { directory: 'referenz/power-splitter' },
            },
            {
              label: 'SENEC-Charger',
              collapsed: true,
              autogenerate: { directory: 'referenz/senec-charger' },
            },
            {
              label: 'SENEC-Collector',
              collapsed: true,
              autogenerate: { directory: 'referenz/senec-collector' },
            },
            {
              label: 'Shelly-Collector',
              collapsed: true,
              autogenerate: { directory: 'referenz/shelly-collector' },
            },
            {
              label: 'Tibber-Collector',
              collapsed: true,
              autogenerate: { directory: 'referenz/tibber-collector' },
            },
            {
              label: 'Ingest',
              collapsed: true,
              autogenerate: { directory: 'referenz/ingest' },
            },
            {
              label: 'Watchtower',
              collapsed: true,
              autogenerate: { directory: 'referenz/watchtower' },
            },
            {
              label: 'CSV-Importer',
              collapsed: true,
              autogenerate: { directory: 'referenz/csv-importer' },
            },
          ],
        },
        {
          label: 'Wartung',
          collapsed: true,
          autogenerate: { directory: 'wartung' },
        },
        {
          label: 'Bedienung',
          collapsed: true,
          autogenerate: { directory: 'bedienung' },
        },
        {
          label: 'Support',
          collapsed: true,
          autogenerate: { directory: 'support' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Head: './src/components/Head.astro',
      },
    }),
  ],
});
