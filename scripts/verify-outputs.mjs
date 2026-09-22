#!/usr/bin/env node
/**
 * Post-build guard: every generated surface must agree with cv.yaml.
 *
 * Parses dist/client/index.html (JSON-LD and visible text), llms.txt,
 * llms-full.txt, cv.json and plain.html, and asserts the canonical facts
 * (name, board certification and year, license states, citation count, clinic
 * count, project names, publication DOIs, profile links). Exits 1 on any
 * drift so CI fails.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parse } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist', 'client');
const cv = parse(readFileSync(join(root, 'src/content/cv.yaml'), 'utf8'));

const failures = [];
function check(cond, msg) {
  if (!cond) failures.push(msg);
}
function read(rel) {
  const p = join(dist, rel);
  if (!existsSync(p)) {
    failures.push(`missing output: ${rel}`);
    return '';
  }
  return readFileSync(p, 'utf8');
}
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const visibleText = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' '));

// Canonical facts from cv.yaml
const name = cv.identity.displayName;
const board = cv.credentials.boards[0];
const licenseStates = cv.credentials.licenses.map((l) => l.state);
const citations = String(cv.research.metrics.citations);
const clinicStat = cv.stats.find((s) => s.label.includes('clinics'));
const projectNames = cv.projects.items.map((p) => p.name);
const dois = cv.publications.filter((p) => p.doi).map((p) => p.doi);
const profileUrls = cv.links.map((l) => l.url);

// ---- index.html ----------------------------------------------------------
const index = read('index.html');
const text = visibleText(index);
check(index.includes(`<h1>${cv.identity.name}<span class="degree">, ${cv.identity.postNominal}</span></h1>`), 'index.html: h1 must be the name and degree');
check(text.includes(cv.identity.headline), 'index.html: headline missing');
for (const p of projectNames) check(text.includes(p), `index.html: project "${p}" missing`);
for (const s of licenseStates) check(text.includes(`${s} (active)`), `index.html: license "${s}" missing`);
check(text.includes(`${board.name}, ${board.field} (${board.year})`), 'index.html: board certification line missing');
check(text.includes(`${citations} citations`), 'index.html: citation count missing');
check(text.includes(clinicStat.value) && text.includes(clinicStat.label), 'index.html: clinic stat tile missing');
for (const d of dois) check(index.includes(`https://doi.org/${d}`), `index.html: DOI link ${d} missing`);
for (const u of profileUrls) check(index.includes(`href="${u.replace(/&/g, '&amp;')}"`), `index.html: profile link ${u} missing`);

// JSON-LD
const ldMatch = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
check(Boolean(ldMatch), 'index.html: JSON-LD script missing');
if (ldMatch) {
  let ld;
  try {
    ld = JSON.parse(ldMatch[1]);
  } catch (e) {
    failures.push(`index.html: JSON-LD is not valid JSON (${e.message})`);
  }
  if (ld) {
    const graph = ld['@graph'] ?? [];
    const person = graph.find((n) => n['@type'] === 'Person');
    const page = graph.find((n) => n['@type'] === 'ProfilePage');
    check(ld['@context'] === 'https://schema.org', 'JSON-LD: @context');
    check(Boolean(person), 'JSON-LD: Person node missing');
    check(Boolean(page) && page.mainEntity?.['@id'] === person?.['@id'], 'JSON-LD: ProfilePage.mainEntity must reference the Person');
    if (person) {
      check(person.name === name, `JSON-LD: Person.name "${person.name}" != "${name}"`);
      check(person.url === 'https://menon.md', 'JSON-LD: Person.url');
      check(Array.isArray(person.sameAs) && profileUrls.every((u) => person.sameAs.includes(u)), 'JSON-LD: sameAs must contain all profile links');
      const occ = person.hasOccupation ?? [];
      check(occ.some((o) => o.occupationalCategory?.codeValue === '29-1216.00'), 'JSON-LD: hospitalist O*NET code 29-1216.00 missing');
      check(occ.some((o) => o.occupationalCategory?.codeValue === '15-1252.00'), 'JSON-LD: software O*NET code 15-1252.00 missing');
      const creds = person.hasCredential ?? [];
      check(creds.some((c) => c.credentialCategory === 'degree'), 'JSON-LD: degree credential missing');
      const abim = creds.find((c) => c.credentialCategory === 'certification');
      check(abim && abim.name.includes(board.name) && abim.dateCreated === String(board.year), 'JSON-LD: ABIM certification with year missing');
      for (const s of licenseStates) check(creds.some((c) => c.credentialCategory === 'license' && c.name.startsWith(s)), `JSON-LD: ${s} license credential missing`);
      const lic = creds.filter((c) => c.credentialCategory === 'license');
      check(lic.every((c) => c.recognizedBy?.['@type'] === 'GovernmentOrganization'), 'JSON-LD: license recognizedBy must be GovernmentOrganization');
      check(Array.isArray(person.alumniOf) && person.alumniOf.length === cv.education.length, 'JSON-LD: alumniOf count');
      check(person.worksFor?.name === cv.identity.employer.shortName, 'JSON-LD: worksFor');
    }
    const articles = graph.filter((n) => n['@type'] === 'ScholarlyArticle');
    check(articles.length === cv.publications.length, `JSON-LD: expected ${cv.publications.length} ScholarlyArticle nodes, found ${articles.length}`);
    for (const d of dois) check(articles.some((a) => a['@id'] === `https://doi.org/${d}`), `JSON-LD: article for DOI ${d} missing`);
  }
}

// ---- llms.txt --------------------------------------------------------------
const llms = read('llms.txt');
check(llms.startsWith(`# ${name}\n`), 'llms.txt: must start with H1 name');
check(/^> /m.test(llms), 'llms.txt: blockquote summary missing');
for (const h of ['## Core documents', '## Primary profiles', '## Contact', '## Optional']) check(llms.includes(h), `llms.txt: section "${h}" missing`);
for (const u of ['https://menon.md/llms-full.txt', 'https://menon.md/cv.json', 'https://menon.md/plain']) check(llms.includes(`](${u})`), `llms.txt: link to ${u} missing`);
check(llms.includes(`${citations} citations`), 'llms.txt: citation count missing');

// ---- llms-full.txt ---------------------------------------------------------
const full = read('llms-full.txt');
check(full.startsWith(`# ${name}\n`), 'llms-full.txt: H1');
for (const p of projectNames) check(full.includes(p), `llms-full.txt: project "${p}" missing`);
check(full.includes(`${board.name}, ${board.field} (${board.year})`), 'llms-full.txt: board certification missing');
for (const s of licenseStates) check(full.includes(`${s} (active`), `llms-full.txt: license "${s}" missing`);
check(full.includes(`${citations} citations`), 'llms-full.txt: citation count missing');
for (const d of dois) check(full.includes(`doi:${d}`), `llms-full.txt: DOI ${d} missing`);
check(!/[–—]/.test(full), 'llms-full.txt: contains an em or en dash');

// ---- cv.json ---------------------------------------------------------------
let resume;
try {
  resume = JSON.parse(read('cv.json'));
} catch (e) {
  failures.push(`cv.json: invalid JSON (${e.message})`);
}
if (resume) {
  check(resume.basics?.name === name, 'cv.json: basics.name');
  check(resume.basics?.email === cv.identity.email, 'cv.json: basics.email');
  check(Array.isArray(resume.work) && resume.work.length === cv.clinical.length + cv.ventures.length + cv.research.positions.length, 'cv.json: work count');
  check(Array.isArray(resume.publications) && resume.publications.length === cv.publications.length, 'cv.json: publications count');
  for (const d of dois) check(resume.publications.some((p) => p.url === `https://doi.org/${d}`), `cv.json: publication URL for DOI ${d} missing`);
  const certs = resume.certificates ?? [];
  check(certs.some((c) => c.name.includes(board.name) && c.date === String(board.year)), 'cv.json: ABIM certificate with year missing');
  for (const s of licenseStates) check(certs.some((c) => c.name.startsWith(`${s} physician license`)), `cv.json: ${s} license missing`);
  check(Array.isArray(resume.projects) && projectNames.every((p) => resume.projects.some((x) => x.name === p)), 'cv.json: project names');
  check(resume.basics?.profiles?.length === profileUrls.length, 'cv.json: profiles count');
}

// ---- plain.html ------------------------------------------------------------
const plain = read('plain.html');
const plainText = visibleText(plain);
check(new RegExp(`<h1[^>]*>${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h1>`).test(plain), 'plain.html: h1 must be the display name');
check(!/data-astro-cid/.test(plain), 'plain.html: must not carry scoped-style attributes (keep <style is:global>)');
check(!/<script/.test(plain), 'plain.html: must contain no JavaScript');
for (const p of projectNames) check(plainText.includes(p), `plain.html: project "${p}" missing`);
for (const s of licenseStates) check(plainText.includes(`${s} physician license (active)`), `plain.html: license "${s}" missing`);
check(plainText.includes(`${citations} citations`), 'plain.html: citation count missing');

// ---- sitemap and robots ----------------------------------------------------
const sitemap = read('sitemap.xml');
check(!sitemap.includes('/for/'), 'sitemap.xml: must not list /for/ pages');
check(sitemap.includes('<loc>https://menon.md/</loc>'), 'sitemap.xml: home URL');
const robots = read('robots.txt');
check(robots.includes('Sitemap: https://menon.md/sitemap.xml'), 'robots.txt: Sitemap line');
for (const slug of ['ai-startup', 'health-system']) {
  const page = read(`for/${slug}.html`);
  check(page.includes('<meta name="robots" content="noindex, nofollow">'), `for/${slug}.html: noindex meta missing`);
}

// ---- report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n[verify-outputs] ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('[verify-outputs] all generated outputs match cv.yaml');
