// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: process.env.SITE || 'https://pretensaosalarial.com.br',
  base: process.env.BASE || '/',
  integrations: [sitemap(), pagefind()]
});