/**
 * Typed loader for src/content/cv.yaml, the single source of truth.
 *
 * The build fails if a required section is missing, if a field has the wrong
 * shape, or if the YAML contains an em dash, en dash or emoji. Import `cv` for
 * the validated document; import `parseCv` to validate arbitrary YAML in tests.
 */
import { parse } from 'yaml';
import { z } from 'zod';
import { findForbidden, locate } from './text';
import rawCv from '../content/cv.yaml?raw';

const isoDate = z.string().regex(/^\d{4}(-\d{2})?(-\d{2})?$/, 'expected YYYY, YYYY-MM or YYYY-MM-DD');
const url = z.string().url();
const nonEmpty = z.string().trim().min(1);

const linkSchema = z.object({
  id: nonEmpty,
  label: nonEmpty,
  url,
  primary: z.boolean().default(false),
});

const statSchema = z.object({
  value: nonEmpty,
  label: nonEmpty,
  sublabel: nonEmpty,
});

const projectSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  tagline: nonEmpty,
  status: nonEmpty,
  role: z.enum(['Designed and built', 'Built and shipped', 'Built and maintains', 'Led', 'Contributed']),
  start: isoDate,
  url: url.optional(),
  stack: z.array(nonEmpty).min(1),
  bullets: z.array(nonEmpty).min(1),
});

const roleSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  organization: nonEmpty,
  organizationUrl: url.optional(),
  location: nonEmpty,
  start: isoDate,
  end: isoDate.optional(),
  bullets: z.array(nonEmpty),
});

const publicationSchema = z.object({
  id: nonEmpty,
  authors: nonEmpty,
  title: nonEmpty,
  journal: nonEmpty,
  year: z.number().int().min(1990).max(2100),
  volume: nonEmpty.optional(),
  issue: nonEmpty.optional(),
  pages: nonEmpty.optional(),
  doi: nonEmpty.optional(),
  pmid: z.string().regex(/^\d+$/).optional(),
  citations: z.number().int().nonnegative().optional(),
  note: nonEmpty.optional(),
});

const teachingSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  organization: nonEmpty,
  start: isoDate.optional(),
  end: isoDate.optional(),
});

const skillGroupSchema = z.object({
  name: nonEmpty,
  items: z.array(nonEmpty).min(1),
});

const educationSchema = z.object({
  id: nonEmpty,
  degree: nonEmpty,
  institution: nonEmpty,
  location: nonEmpty,
  start: isoDate,
  end: isoDate,
  note: nonEmpty.optional(),
});

const honorSchema = z.object({
  title: nonEmpty,
  organization: nonEmpty.optional(),
  year: z.number().int().optional(),
  note: nonEmpty.optional(),
});

export const cvSchema = z.object({
  meta: z.object({
    lastUpdated: isoDate,
    metricsAsOf: nonEmpty,
  }),
  identity: z.object({
    givenName: nonEmpty,
    familyName: nonEmpty,
    name: nonEmpty,
    postNominal: nonEmpty,
    displayName: nonEmpty,
    alternateNames: z.array(nonEmpty).min(1),
    headline: nonEmpty,
    subheadline: nonEmpty,
    currentTitle: nonEmpty,
    employer: z.object({ name: nonEmpty, shortName: nonEmpty, url }),
    location: z.object({
      city: nonEmpty,
      region: nonEmpty,
      regionCode: nonEmpty,
      country: nonEmpty,
      countryCode: z.string().length(2),
    }),
    email: z.string().email(),
    academicEmail: z.string().email(),
    workAuthorization: nonEmpty,
    targets: z.array(nonEmpty).min(1),
  }),
  summary: nonEmpty,
  links: z.array(linkSchema).min(1),
  stats: z.array(statSchema).length(4),
  projects: z.object({
    intro: nonEmpty,
    items: z.array(projectSchema).min(1),
  }),
  clinical: z.array(roleSchema).min(1),
  ventures: z.array(roleSchema).min(1),
  research: z.object({
    narrative: nonEmpty,
    positions: z.array(roleSchema).min(1),
    metrics: z.object({
      citations: z.number().int().nonnegative(),
      hIndex: z.number().int().nonnegative(),
      i10Index: z.number().int().nonnegative(),
      citationsSince2021: z.number().int().nonnegative(),
      source: nonEmpty,
      asOf: nonEmpty,
      url,
    }),
  }),
  publications: z.array(publicationSchema).min(1),
  teaching: z.array(teachingSchema).min(1),
  skills: z.array(skillGroupSchema).min(1),
  education: z.array(educationSchema).min(1),
  credentials: z.object({
    boards: z
      .array(z.object({ name: nonEmpty, field: nonEmpty, year: z.number().int(), verifyUrl: url }))
      .min(1),
    certifications: z.array(z.object({ name: nonEmpty, year: z.number().int(), verifyUrl: url.optional() })),
    licenses: z
      .array(
        z.object({
          state: nonEmpty,
          stateCode: z.string().length(2),
          status: z.enum(['Active', 'Inactive']),
          authority: nonEmpty,
          verifyUrl: url,
        }),
      )
      .min(1),
  }),
  honors: z.array(honorSchema).min(1),
  chat: z.object({
    starters: z.array(nonEmpty).length(4),
    fallback: nonEmpty,
  }),
});

export type Cv = z.infer<typeof cvSchema>;
export type CvProject = Cv['projects']['items'][number];
export type CvRole = Cv['clinical'][number];
export type CvPublication = Cv['publications'][number];
export type CvLink = Cv['links'][number];

export class CvContentError extends Error {
  override name = 'CvContentError';
}

/** Validate raw YAML text and return the typed CV. Throws CvContentError. */
export function parseCv(yamlText: string): Cv {
  const hit = findForbidden(yamlText);
  if (hit) {
    const { line, column } = locate(yamlText, hit.index);
    throw new CvContentError(
      `cv.yaml contains a forbidden character (${hit.reason}, ${hit.codePoint}) at line ${line}, column ${column}. ` +
        'Use a hyphen, comma or period instead. Emoji are not allowed.',
    );
  }
  let data: unknown;
  try {
    data = parse(yamlText);
  } catch (err) {
    throw new CvContentError(`cv.yaml is not valid YAML: ${(err as Error).message}`);
  }
  const result = cvSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new CvContentError(`cv.yaml failed validation:\n${issues}`);
  }
  return result.data;
}

/** The validated CV. Evaluated once at build time. */
export const cv: Cv = parseCv(rawCv);

/** Human-readable date range. `end` omitted means present. */
export function formatRange(start: string, end?: string): string {
  const s = start.slice(0, 4);
  if (!end) return `${s} to present`;
  const e = end.slice(0, 4);
  return s === e ? s : `${s} to ${e}`;
}

export function doiUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}

export function pmidUrl(pmid: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
}
