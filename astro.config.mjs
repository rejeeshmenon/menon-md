// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// Static-first: every page is prerendered. The only on-demand route is
// src/pages/api/chat.ts, which opts out with `export const prerender = false`.
export default defineConfig({
  site: 'https://menon.md',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  // No sessions: the site keeps no per-visitor state, so no SESSION KV binding.
  session: false,
  adapter: cloudflare({
    imageService: 'compile',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
