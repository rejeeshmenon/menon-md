import { describe, expect, it } from 'vitest';
import { cv } from '../src/lib/cv';
import { SECTION_ORDER, formatCitation, orderSections, renderCvMarkdown } from '../src/lib/markdown';
import { findForbidden } from '../src/lib/text';

describe('renderCvMarkdown', () => {
  const md = renderCvMarkdown(cv);

  it('is deterministic', () => {
    expect(renderCvMarkdown(cv)).toBe(md);
  });

  it('starts with the name as H1 and front-loads identity', () => {
    const lines = md.split('\n');
    expect(lines[0]).toBe('# Rejeesh Menon, MD');
    expect(lines[2]).toContain('Academic internal medicine physician and clinical AI physician-builder');
    expect(lines[2]).toContain('Washington State University');
  });

  it('contains every section heading in canonical order', () => {
    let last = -1;
    for (const s of SECTION_ORDER) {
      const idx = md.indexOf(`\n## ${s.title}\n`);
      expect(idx, s.title).toBeGreaterThan(last);
      last = idx;
    }
  });

  it('contains the canonical facts', () => {
    expect(md).toContain('223 citations, h-index 6, i10-index 6, 96 citations since 2021');
    expect(md).toContain('American Board of Internal Medicine, Internal Medicine (2016)');
    expect(md).toContain('Washington (active');
    expect(md).toContain('Oregon (active');
    expect(md).toContain('California (active');
    expect(md).toContain('doi:10.7326/aimcc.2023.0565');
    expect(md).toContain('PMID 24477233');
    expect(md).toContain('doi:10.1016/S0973-3698(10)60189-6');
    expect(md).toContain('SuperHuman');
    expect(md).toContain('DermaVue Clinic OS');
    expect(md).toContain('DermaVue Commerce');
  });

  it('has no forbidden characters', () => {
    expect(findForbidden(md)).toBeNull();
  });

  it('reorders sections for an audience without dropping any', () => {
    const ordered = orderSections(['research', 'clinical-ai']);
    expect(ordered.map((s) => s.id).slice(0, 2)).toEqual(['research', 'clinical-ai']);
    expect(ordered).toHaveLength(SECTION_ORDER.length);
    expect(new Set(ordered.map((s) => s.id)).size).toBe(SECTION_ORDER.length);
  });

  it('formats a citation with volume, issue and pages', () => {
    const p = cv.publications.find((x) => x.id === 'yin-2014')!;
    expect(formatCitation(p)).toBe(
      'Yin L, Vijaygopal P, MacGregor GG, Menon R, et al. Glucose stimulates calcium-activated chloride secretion in small intestinal cells. American Journal of Physiology - Cell Physiology. 2014;306(7):C687-C696.',
    );
  });

  it('states the authorship ladder and the safety-claims disclosure', () => {
    expect(md).toContain('Authorship across projects, oldest to newest:');
    expect(md).toContain('Designed and built -> Built and shipped -> Built and shipped -> Built and maintains');
    expect(md).toContain(cv.projects.disclosure);
  });

  it('labels every project bullet by dimension', () => {
    expect(md).toContain("- AI's role: Author of the clinical logic and the autonomy boundary");
    expect(md).toContain('- Safety and compliance: Every piece of generated guidance is checked');
  });

  it('states the research lineage from bench to license', () => {
    expect(md).toContain('Bench research (Ussing-chamber intestinal-transport work');
    expect(md).toContain('Commercial license (Licensed worldwide to Nestle Health Science, 2018)');
  });
});
