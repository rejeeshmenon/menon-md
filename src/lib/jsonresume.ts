/**
 * JSON Resume (https://jsonresume.org/schema) built from cv.yaml.
 */
import { type Cv, doiUrl, pmidUrl } from './cv';
import { SITE } from './site';

function isoOrUndefined(d?: string): string | undefined {
  return d ? d : undefined;
}

export function buildJsonResume(cv: Cv): Record<string, unknown> {
  const id = cv.identity;
  const work = [
    ...cv.clinical.map((r) => ({
      name: r.organization,
      position: r.title,
      location: r.location,
      url: r.organizationUrl,
      startDate: r.start,
      endDate: isoOrUndefined(r.end),
      highlights: r.bullets,
    })),
    ...cv.ventures.map((r) => ({
      name: r.organization,
      position: r.title,
      location: r.location,
      url: r.organizationUrl,
      startDate: r.start,
      endDate: isoOrUndefined(r.end),
      highlights: r.bullets,
    })),
    ...cv.research.positions.map((r) => ({
      name: r.organization,
      position: r.title,
      location: r.location,
      startDate: r.start,
      endDate: isoOrUndefined(r.end),
      highlights: r.bullets,
    })),
  ].map(stripUndefined);

  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: id.displayName,
      label: id.headline,
      email: id.email,
      url: SITE.url,
      summary: cv.summary,
      location: {
        city: id.location.city,
        region: id.location.region,
        countryCode: id.location.countryCode,
      },
      profiles: cv.links.map((l) => ({
        network: l.label,
        username: l.id,
        url: l.url,
      })),
    },
    work,
    volunteer: [],
    education: cv.education.map((e) => ({
      institution: e.institution,
      area: e.degree,
      studyType: e.degree.startsWith('MBBS') ? 'MBBS' : e.degree.startsWith('Residency') ? 'Residency' : 'Postdoctoral fellowship',
      startDate: e.start,
      endDate: e.end,
      ...(e.note ? { courses: [e.note] } : {}),
    })),
    awards: cv.honors.map((h) =>
      stripUndefined({
        title: h.title,
        date: h.year ? String(h.year) : undefined,
        awarder: h.organization,
        summary: h.note,
      }),
    ),
    certificates: [
      ...cv.credentials.boards.map((b) => ({
        name: `${b.name}, ${b.field}`,
        date: String(b.year),
        issuer: b.name,
        url: b.verifyUrl,
      })),
      ...cv.credentials.certifications.map((c) =>
        stripUndefined({ name: c.name, date: String(c.year), issuer: c.name, url: c.verifyUrl }),
      ),
      ...cv.credentials.licenses.map((l) => ({
        name: `${l.state} physician license (${l.status.toLowerCase()})`,
        issuer: l.authority,
        url: l.verifyUrl,
      })),
    ],
    publications: cv.publications.map((p) =>
      stripUndefined({
        name: p.title,
        publisher: p.journal,
        releaseDate: String(p.year),
        url: p.doi ? doiUrl(p.doi) : p.pmid ? pmidUrl(p.pmid) : undefined,
        summary: [p.authors, p.doi ? `doi:${p.doi}` : undefined, p.pmid ? `PMID ${p.pmid}` : undefined, p.note]
          .filter(Boolean)
          .join('. '),
      }),
    ),
    skills: cv.skills.map((g) => ({ name: g.name, keywords: g.items })),
    languages: [{ language: 'English', fluency: 'Fluent' }],
    interests: id.targets.map((t) => ({ name: t })),
    references: [],
    projects: cv.projects.items.map((p) =>
      stripUndefined({
        name: p.name,
        description: `${p.tagline}. ${p.status}.`,
        highlights: p.bullets,
        keywords: p.stack,
        startDate: p.start,
        url: p.url,
        roles: [p.role],
        entity: 'DermaVue',
        type: 'application',
      }),
    ),
    meta: {
      canonical: `${SITE.url}/cv.json`,
      version: cv.meta.lastUpdated,
      lastModified: cv.meta.lastUpdated,
    },
  };
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}
