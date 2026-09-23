/**
 * schema.org JSON-LD for the site, generated from cv.yaml.
 *
 * One @graph with stable @ids: WebSite, ProfilePage (mainEntity Person), the
 * Person with Occupation and EducationalOccupationalCredential entries, and a
 * ScholarlyArticle per selected publication. Validated by tests and by the
 * post-build verify script.
 */
import { type Cv, doiUrl, pmidUrl } from './cv';
import { SITE, absoluteUrl } from './site';

const PERSON_ID = `${SITE.url}/#person`;
const SITE_ID = `${SITE.url}/#website`;
const PAGE_ID = `${SITE.url}/#profilepage`;

const ONET = {
  '@type': 'CategoryCodeSet',
  name: 'O*NET-SOC',
  url: 'https://www.onetonline.org/',
} as const;

function occupation(name: string, code: string, onetName: string, description: string) {
  return {
    '@type': 'Occupation',
    name,
    description,
    occupationalCategory: {
      '@type': 'CategoryCode',
      codeValue: code,
      name: onetName,
      inCodeSet: ONET,
      url: `https://www.onetonline.org/link/summary/${code}`,
    },
  };
}

export function buildJsonLd(cv: Cv): Record<string, unknown> {
  const id = cv.identity;
  const employer = {
    '@type': 'CollegeOrUniversity',
    name: id.employer.shortName,
    url: id.employer.url,
    department: {
      '@type': 'EducationalOrganization',
      name: 'Elson S. Floyd College of Medicine',
      url: id.employer.url,
    },
  };

  const credentials: Record<string, unknown>[] = [
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: 'Doctor of Medicine (MD equivalent, MBBS)',
      educationalLevel: 'Professional doctorate',
      recognizedBy: { '@type': 'CollegeOrUniversity', name: 'University of Kerala' },
    },
    ...cv.credentials.boards.map((b) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: `${b.name} board certification, ${b.field}`,
      dateCreated: String(b.year),
      recognizedBy: { '@type': 'Organization', name: b.name, url: b.verifyUrl },
      url: b.verifyUrl,
    })),
    ...cv.credentials.licenses.map((l) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: `${l.state} physician license`,
      validIn: { '@type': 'State', name: l.state, addressCountry: 'US' },
      recognizedBy: { '@type': 'GovernmentOrganization', name: l.authority, url: l.verifyUrl },
      url: l.verifyUrl,
    })),
  ];

  const alumniOf = cv.education.map((e) => ({
    '@type': 'CollegeOrUniversity',
    name: e.institution,
    description: `${e.degree} (${e.start} to ${e.end})`,
  }));

  const knowsAbout = [
    'Hospital medicine',
    'Internal medicine',
    'Clinical artificial intelligence',
    'Clinical AI safety and evaluation',
    'Human-in-the-loop clinical decision support',
    'HIPAA program design',
    'HL7 FHIR R4 and SMART on FHIR',
    'AI-assisted software development',
    'Intestinal ion transport physiology',
    'Chikungunya arthritis',
    'GLP-1 and metabolic care',
    'Medical education',
  ];

  const person = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: id.displayName,
    givenName: id.givenName,
    familyName: id.familyName,
    honorificSuffix: id.postNominal,
    alternateName: id.alternateNames,
    url: SITE.url,
    image: absoluteUrl(SITE.ogImagePath),
    email: `mailto:${id.email}`,
    jobTitle: [id.currentTitle, 'Co-Founder and Director, DermaVue Skin & Hair Clinics'],
    description: `${id.headline}. ${id.subheadline}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: id.location.city,
      addressRegion: id.location.regionCode,
      addressCountry: id.location.countryCode,
    },
    worksFor: employer,
    affiliation: [
      employer,
      { '@type': 'Hospital', name: 'Pullman Regional Hospital', address: { '@type': 'PostalAddress', addressLocality: 'Pullman', addressRegion: 'WA', addressCountry: 'US' } },
      { '@type': 'Organization', name: 'DermaVue Skin & Hair Clinics', url: 'https://dermavue.com' },
    ],
    hasOccupation: [
      occupation(
        'Academic Internal Medicine Physician',
        '29-1216.00',
        'General Internal Medicine Physicians',
        'Attending physician in hospital medicine and clinical assistant professor.',
      ),
      occupation(
        'Clinical AI Software Engineer',
        '15-1252.00',
        'Software Developers',
        'Designs and builds clinical software with AI-assisted development and owns clinical logic and safety boundaries.',
      ),
    ],
    hasCredential: credentials,
    alumniOf,
    knowsAbout,
    sameAs: cv.links.map((l) => l.url),
  };

  const articles = cv.publications.map((p) => {
    const node: Record<string, unknown> = {
      '@type': 'ScholarlyArticle',
      '@id': p.doi ? doiUrl(p.doi) : p.pmid ? pmidUrl(p.pmid) : `${SITE.url}/#pub-${p.id}`,
      headline: p.title,
      name: p.title,
      author: p.authors,
      contributor: { '@id': PERSON_ID },
      datePublished: String(p.year),
      isPartOf: { '@type': 'Periodical', name: p.journal },
    };
    if (p.doi) node['sameAs'] = doiUrl(p.doi);
    if (p.pmid) node['identifier'] = { '@type': 'PropertyValue', propertyID: 'PMID', value: p.pmid };
    if (p.volume) node['volumeNumber'] = p.volume;
    if (p.issue) node['issueNumber'] = p.issue;
    if (p.pages) node['pagination'] = p.pages;
    return node;
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: SITE.url,
        name: `${id.displayName}`,
        description: `${id.headline}. Curriculum vitae with verifiable credentials.`,
        inLanguage: 'en-US',
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'ProfilePage',
        '@id': PAGE_ID,
        url: SITE.url,
        name: `${id.displayName}: curriculum vitae`,
        dateModified: cv.meta.lastUpdated,
        isPartOf: { '@id': SITE_ID },
        mainEntity: { '@id': PERSON_ID },
        about: { '@id': PERSON_ID },
        inLanguage: 'en-US',
      },
      person,
      ...articles,
    ],
  };
}

/** Serialize for a <script type="application/ld+json"> tag, escaping `<` so the payload cannot close the tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
