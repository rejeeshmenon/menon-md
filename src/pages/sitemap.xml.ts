import type { APIRoute } from 'astro';
import { cv } from '../lib/cv';
import { SITE } from '../lib/site';

/** Indexable URLs only. /for/* pages are noindex and deliberately excluded. */
export const GET: APIRoute = () => {
  const lastmod = cv.meta.lastUpdated;
  const urls = ['/', '/plain', '/chat', '/llms.txt', '/llms-full.txt', '/cv.json'];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${SITE.url}${u === '/' ? '/' : u}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
      )
      .join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
