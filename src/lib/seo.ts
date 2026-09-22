import type { Cv } from './cv';

/**
 * Meta description built from cv.yaml: headline, institution, then as many
 * whole sentences of the summary as fit in `max` characters. Never cuts a word.
 */
export function metaDescription(cv: Cv, max = 300): string {
  const id = cv.identity;
  const lead = `${id.headline}. ${id.subheadline}.`;
  // Split on a period that follows a lowercase letter or a closing paren, so
  // abbreviations like "U.S." do not end a sentence.
  const sentences = cv.summary.split(/(?<=[a-z)])\.\s+/).map((s) => (s.endsWith('.') ? s : `${s}.`));
  let out = lead;
  for (const s of sentences) {
    const candidate = `${out} ${s.trim()}`;
    if (candidate.length > max) break;
    out = candidate;
  }
  return out;
}

export function pageTitle(cv: Cv, suffix?: string): string {
  const base = `${cv.identity.displayName}: ${cv.identity.headline}`;
  return suffix ? `${suffix}. ${base}` : base;
}
