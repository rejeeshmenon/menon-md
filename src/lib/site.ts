/**
 * Site-level constants that are not CV facts. CV facts live in cv.yaml only.
 */
export const SITE = {
  url: 'https://menon.md',
  name: 'menon.md',
  /** Cloudflare Web Analytics token. Replace with the token from the dashboard. */
  analyticsToken: 'REPLACE_WITH_CLOUDFLARE_WEB_ANALYTICS_TOKEN',
  ogImagePath: '/og.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}
