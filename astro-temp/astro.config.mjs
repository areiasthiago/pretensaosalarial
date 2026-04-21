// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://areiasthiago.github.io',
  base: '/pretensaosalarial',
  integrations: [sitemap()]
});