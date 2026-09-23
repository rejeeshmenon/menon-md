/**
 * The single markdown serializer for the CV.
 *
 * Used by /llms-full.txt, by the chat grounding context, and (through the same
 * section model) by /plain. Output is deterministic: same cv.yaml, same bytes.
 * Section headings are the exact section names the chat is told to cite.
 */
import { type Cv, type CvPublication, type CvRole, doiUrl, formatRange, pmidUrl } from './cv';

export interface SectionDef {
  id: string;
  title: string;
  /** Short running head used in the nav and the printed-CV margin label. */
  short: string;
}

/**
 * Canonical order and ids of the CV sections. HTML anchors use these ids.
 *
 * Order and grouping per the 2026-09-22 multi-agent design audit
 * (docs/portfolio-audit.md, Section 6): Technical Capabilities moved
 * directly behind the products it substantiates, Education and Credentials
 * brought forward, and the two thinnest sections (Teaching, Honors) merged
 * into one "Teaching and Recognition" section rather than each carrying
 * full-section visual weight for five one-line entries.
 */
export const SECTION_ORDER: readonly SectionDef[] = [
  { id: 'clinical-ai', title: 'Clinical AI and Software', short: 'Software' },
  { id: 'technical', title: 'Technical Capabilities', short: 'Capabilities' },
  { id: 'clinical-practice', title: 'Clinical Practice', short: 'Practice' },
  { id: 'entrepreneurship', title: 'Entrepreneurship', short: 'Ventures' },
  { id: 'research', title: 'Research', short: 'Research' },
  { id: 'education', title: 'Education and Credentials', short: 'Credentials' },
  { id: 'recognition', title: 'Teaching and Recognition', short: 'Recognition' },
] as const;

export type SectionId = (typeof SECTION_ORDER)[number]['id'];

export function sectionTitle(id: SectionId): string {
  const def = SECTION_ORDER.find((s) => s.id === id);
  if (!def) throw new Error(`Unknown section id: ${id}`);
  return def.title;
}

export function orderSections(emphasize: readonly string[] = []): SectionDef[] {
  const known = new Map(SECTION_ORDER.map((s) => [s.id, s]));
  const first = emphasize.map((id) => known.get(id)).filter((s): s is SectionDef => Boolean(s));
  const rest = SECTION_ORDER.filter((s) => !emphasize.includes(s.id));
  return [...first, ...rest];
}

export function formatCitation(p: CvPublication): string {
  const authors = p.authors.replace(/\.$/, '');
  const parts = [`${authors}. ${p.title}. ${p.journal}. ${p.year}`];
  if (p.volume) parts.push(`;${p.volume}`);
  if (p.issue) parts.push(`(${p.issue})`);
  if (p.pages) parts.push(`:${p.pages}`);
  return parts.join('') + '.';
}

function role(r: CvRole): string[] {
  const lines = [`### ${r.title}`, `${r.organization}, ${r.location}. ${formatRange(r.start, r.end)}.`];
  for (const b of r.bullets) lines.push(`- ${b}`);
  lines.push('');
  return lines;
}

export function renderSectionMarkdown(cv: Cv, id: SectionId): string {
  const out: string[] = [`## ${sectionTitle(id)}`, ''];
  switch (id) {
    case 'clinical-ai': {
      out.push(cv.projects.intro, '');
      const ladder = cv.projects.items.map((p) => p.role).join(' -> ');
      out.push(`Authorship across projects, oldest to newest: ${ladder}.`, '');
      for (const p of cv.projects.items) {
        out.push(`### ${p.name}: ${p.tagline}`);
        out.push(`Status: ${p.status}. Role: ${p.role}. Stack: ${p.stack.join(', ')}.`);
        if (p.url) out.push(`URL: ${p.url}`);
        for (const b of p.bullets) out.push(`- ${b.label}: ${b.text}`);
        out.push('');
      }
      out.push(cv.projects.disclosure, '');
      break;
    }
    case 'clinical-practice': {
      for (const r of cv.clinical) out.push(...role(r));
      break;
    }
    case 'entrepreneurship': {
      for (const r of cv.ventures) out.push(...role(r));
      break;
    }
    case 'research': {
      out.push(cv.research.narrative, '');
      out.push(cv.research.lineage.map((l) => `${l.stage} (${l.detail})`).join(' -> '), '');
      for (const r of cv.research.positions) out.push(...role(r));
      const m = cv.research.metrics;
      out.push(
        `Metrics: ${m.citations} citations, h-index ${m.hIndex}, i10-index ${m.i10Index}, ${m.citationsSince2021} citations since 2021 (${m.source}, ${m.asOf}). ${m.url}`,
        '',
        '### Selected publications',
      );
      cv.publications.forEach((p, i) => {
        const ids: string[] = [];
        if (p.doi) ids.push(`doi:${p.doi} (${doiUrl(p.doi)})`);
        if (p.pmid) ids.push(`PMID ${p.pmid} (${pmidUrl(p.pmid)})`);
        const extras: string[] = [];
        if (ids.length) extras.push(ids.join('; '));
        if (p.citations !== undefined) extras.push(`${p.citations} citations`);
        if (p.note) extras.push(p.note);
        out.push(`${i + 1}. ${formatCitation(p)}${extras.length ? ' ' + extras.join('. ') + '.' : ''}`);
      });
      out.push('');
      break;
    }
    case 'technical': {
      for (const g of cv.skills) out.push(`- ${g.name}: ${g.items.join('; ')}.`);
      out.push('');
      break;
    }
    case 'education': {
      for (const e of cv.education) {
        const note = e.note ? ` ${e.note}.` : '';
        out.push(`- ${e.degree}, ${e.institution}, ${e.location} (${formatRange(e.start, e.end)}).${note}`);
      }
      out.push('');
      for (const b of cv.credentials.boards) {
        out.push(`- Board certification: ${b.name}, ${b.field} (${b.year}). Verify: ${b.verifyUrl}`);
      }
      for (const c of cv.credentials.certifications) {
        out.push(`- ${c.name} (${c.year}).${c.verifyUrl ? ' ' + c.verifyUrl : ''}`);
      }
      const lic = cv.credentials.licenses.map((l) => `${l.state} (${l.status.toLowerCase()}, ${l.authority})`).join('; ');
      out.push(`- Medical licenses: ${lic}.`, '');
      break;
    }
    case 'recognition': {
      for (const t of cv.teaching) {
        const when = t.start ? ` (${formatRange(t.start, t.end)})` : '';
        out.push(`- ${t.title}, ${t.organization}${when}.`);
      }
      for (const h of cv.honors) {
        const org = h.organization ? `, ${h.organization}` : '';
        const yr = h.year ? ` (${h.year})` : '';
        const note = h.note ? ` ${h.note}` : '';
        out.push(`- ${h.title}${org}${yr}.${note}`);
      }
      out.push('');
      break;
    }
  }
  return out.join('\n');
}

/** Full CV as deterministic markdown. */
export function renderCvMarkdown(cv: Cv, sectionOrder: readonly SectionDef[] = SECTION_ORDER): string {
  const id = cv.identity;
  const head: string[] = [
    `# ${id.displayName}`,
    '',
    `${id.headline}. ${id.subheadline}.`,
    `Location: ${id.location.city}, ${id.location.region}, ${id.location.country}.`,
    `Email: ${id.email} (academic: ${id.academicEmail}).`,
    `Work authorization: ${id.workAuthorization}`,
    `Target roles: ${id.targets.join('; ')}.`,
    `Last updated: ${cv.meta.lastUpdated}. Metrics as of ${cv.meta.metricsAsOf}.`,
    '',
    '## Summary',
    '',
    cv.summary,
    '',
    '## Profiles',
    '',
    ...cv.links.map((l) => `- ${l.label}: ${l.url}`),
    '',
    '## At a glance',
    '',
    ...cv.stats.map((s) => `- ${s.value} ${s.label} (${s.sublabel})`),
    '',
  ];
  const body = sectionOrder.map((s) => renderSectionMarkdown(cv, s.id as SectionId));
  return [...head, ...body].join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
