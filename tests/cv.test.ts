import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { CvContentError, cv, parseCv } from '../src/lib/cv';
import { findForbidden } from '../src/lib/text';

const raw = readFileSync(new URL('../src/content/cv.yaml', import.meta.url), 'utf8');

describe('cv.yaml', () => {
  it('loads and validates', () => {
    expect(cv.identity.displayName).toBe('Rejeesh Menon, MD');
    expect(cv.stats).toHaveLength(4);
    expect(cv.credentials.licenses.map((l) => l.stateCode)).toEqual(['WA', 'OR', 'CA']);
    expect(cv.research.metrics.citations).toBe(223);
    expect(cv.chat.starters).toHaveLength(4);
  });

  it('contains no forbidden characters', () => {
    expect(findForbidden(raw)).toBeNull();
  });

  it('rejects an em dash', () => {
    const bad = raw.replace('Academic hospitalist and', 'Academic hospitalist — and');
    expect(() => parseCv(bad)).toThrow(CvContentError);
    expect(() => parseCv(bad)).toThrow(/em-dash/);
  });

  it('rejects an en dash', () => {
    const bad = raw.replace('2025 to 2026', '2025–2026');
    expect(() => parseCv(bad)).toThrow(/en-dash/);
  });

  it('rejects emoji', () => {
    const bad = raw.replace('headline: Academic', 'headline: \u{1F680} Academic');
    expect(() => parseCv(bad)).toThrow(/emoji/);
  });

  it('rejects a missing required section', () => {
    const bad = raw.replace(/\nhonors:[\s\S]*?\nchat:/, '\nchat:');
    expect(() => parseCv(bad)).toThrow(/honors/);
  });

  it('rejects a malformed DOI-bearing publication year', () => {
    const bad = raw.replace('year: 2024', 'year: "twenty twenty-four"');
    expect(() => parseCv(bad)).toThrow(CvContentError);
  });
});
