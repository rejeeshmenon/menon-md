import type { APIRoute } from 'astro';
import { cv } from '../lib/cv';
import { SITE } from '../lib/site';

/**
 * /llms.txt per https://llmstxt.org: H1 name, blockquote summary, a context
 * paragraph, then H2 sections of markdown links with one-line descriptions.
 * `## Optional` may be skipped by consumers with a small context budget.
 */
export const GET: APIRoute = () => {
  const id = cv.identity;
  const m = cv.research.metrics;
  const lines = [
    `# ${id.displayName}`,
    '',
    `> ${id.headline}. ${id.subheadline}. ${id.location.city}, ${id.location.region}. ${id.workAuthorization}`,
    '',
    `This site is the authoritative, self-maintained curriculum vitae of ${id.displayName}. Every fact is generated from one source file and every credential links to its primary source (faculty profile, Google Scholar, DOI or PubMed, licensing boards). Target roles: ${id.targets.join('; ')}. Metrics as of ${cv.meta.metricsAsOf}: ${m.citations} citations, h-index ${m.hIndex}. Contact: ${id.email}.`,
    '',
    '## Core documents',
    '',
    `- [Full CV (markdown)](${SITE.url}/llms-full.txt): the complete CV as deterministic markdown, identical to what the site's chat is grounded on.`,
    `- [JSON Resume](${SITE.url}/cv.json): the same CV in JSON Resume v1 format for programmatic consumers.`,
    `- [Plain HTML CV](${SITE.url}/plain): semantic HTML only, no CSS or JavaScript, for ATS parsers and text browsers.`,
    '',
    '## Primary profiles',
    '',
    ...cv.links.map((l) => `- [${l.label}](${l.url}): ${profileDescription(l.id)}`),
    '',
    '## Contact',
    '',
    `- [Email](mailto:${id.email}): ${id.email}`,
    `- [Academic email](mailto:${id.academicEmail}): ${id.academicEmail}`,
    '',
    '## Optional',
    '',
    `- [Web CV](${SITE.url}/): the human-facing page with schema.org Person JSON-LD in the head.`,
    `- [Ask about my work](${SITE.url}/chat): a chat grounded only on the CV text; it cites the CV section for every claim and declines anything not in the CV.`,
    `- [Sitemap](${SITE.url}/sitemap.xml): all indexable URLs.`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

function profileDescription(id: string): string {
  switch (id) {
    case 'wsu':
      return 'faculty directory entry at the Elson S. Floyd College of Medicine, Washington State University.';
    case 'scholar':
      return 'publication list and citation metrics.';
    case 'linkedin':
      return 'professional profile.';
    case 'dermavue':
      return 'the seven-clinic dermatology group whose software he builds.';
    default:
      return 'profile.';
  }
}
