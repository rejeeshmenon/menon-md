/**
 * Copy hygiene shared by the content loader, the audience loader and the
 * post-build dist scanner. The site bans em dashes (U+2014), en dashes
 * (U+2013) and emoji in all copy. Hyphens, commas and periods are used instead.
 */

const FORBIDDEN_PATTERN = /[–—]|\p{Extended_Pictographic}/gu;

export interface ForbiddenHit {
  index: number;
  char: string;
  codePoint: string;
  reason: 'em-dash' | 'en-dash' | 'emoji';
}

export function findForbidden(text: string): ForbiddenHit | null {
  FORBIDDEN_PATTERN.lastIndex = 0;
  const match = FORBIDDEN_PATTERN.exec(text);
  if (!match) return null;
  const char = match[0];
  const cp = char.codePointAt(0) ?? 0;
  const reason: ForbiddenHit['reason'] =
    cp === 0x2014 ? 'em-dash' : cp === 0x2013 ? 'en-dash' : 'emoji';
  return {
    index: match.index,
    char,
    codePoint: 'U+' + cp.toString(16).toUpperCase().padStart(4, '0'),
    reason,
  };
}

export function findAllForbidden(text: string): ForbiddenHit[] {
  const hits: ForbiddenHit[] = [];
  FORBIDDEN_PATTERN.lastIndex = 0;
  for (const match of text.matchAll(FORBIDDEN_PATTERN)) {
    const char = match[0];
    const cp = char.codePointAt(0) ?? 0;
    hits.push({
      index: match.index,
      char,
      codePoint: 'U+' + cp.toString(16).toUpperCase().padStart(4, '0'),
      reason: cp === 0x2014 ? 'em-dash' : cp === 0x2013 ? 'en-dash' : 'emoji',
    });
  }
  return hits;
}

/** Line and column (1-based) for an index into `text`, for error messages. */
export function locate(text: string, index: number): { line: number; column: number } {
  let line = 1;
  let lastBreak = -1;
  for (let i = 0; i < index; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      lastBreak = i;
    }
  }
  return { line, column: index - lastBreak };
}
