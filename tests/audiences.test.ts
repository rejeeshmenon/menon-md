import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { audiences, getAudience, parseAudience } from '../src/lib/audiences';
import { SECTION_ORDER, orderSections } from '../src/lib/markdown';

describe('audiences', () => {
  it('loads both scaffolded audiences', () => {
    expect(audiences.map((a) => a.slug)).toEqual(['ai-startup', 'health-system']);
    for (const a of audiences) {
      expect(a.bullets).toHaveLength(3);
      for (const id of a.emphasize) expect(SECTION_ORDER.map((s) => s.id)).toContain(id);
    }
  });

  it('reorders sections per emphasize without losing any', () => {
    const a = getAudience('health-system')!;
    const ordered = orderSections(a.emphasize);
    expect(ordered.map((s) => s.id).slice(0, a.emphasize.length)).toEqual(a.emphasize);
    expect(ordered).toHaveLength(SECTION_ORDER.length);
  });

  it('rejects a file with a wrong bullet count or unknown section', () => {
    const raw = readFileSync(new URL('../src/content/audiences/ai-startup.yaml', import.meta.url), 'utf8');
    expect(() => parseAudience(raw.replace('  - technical\n', '  - nope\n'), 'ai-startup.yaml')).toThrow(/emphasize/);
    const twoBullets = raw.replace(/\n  - Practicing academic internal medicine physician[^\n]*\n/, '\n');
    expect(() => parseAudience(twoBullets, 'ai-startup.yaml')).toThrow(/bullets/);
  });

  it('rejects a slug that does not match the file name', () => {
    const raw = readFileSync(new URL('../src/content/audiences/ai-startup.yaml', import.meta.url), 'utf8');
    expect(() => parseAudience(raw, 'health-system.yaml')).toThrow(/slug/);
  });

  it('returns undefined for unknown slugs', () => {
    expect(getAudience('nope')).toBeUndefined();
    expect(getAudience(undefined)).toBeUndefined();
  });
});
