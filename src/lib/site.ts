/**
 * Site-level constants that are not CV facts. CV facts live in cv.yaml only.
 */
export const SITE = {
  url: 'https://menon.md',
  name: 'menon.md',
  /** Cloudflare Web Analytics token. Replace with the token from the dashboard. */
  analyticsToken: 'ee61e45c98fd4c1cb1066a0d629def6e',
  ogImagePath: '/og.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}
