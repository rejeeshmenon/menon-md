/**
 * Audience files for /for/[slug] pages: src/content/audiences/*.yaml.
 * Each file personalizes the CV for one recruiter or role without adding any
 * fact; it may only reorder sections and add three tailored bullets.
 */
import { parse } from 'yaml';
import { z } from 'zod';
import { findForbidden, locate } from './text';
import { SECTION_ORDER } from './markdown';

const sectionIds = SECTION_ORDER.map((s) => s.id) as [string, ...string[]];

export const audienceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,40}$/),
  company: z.string().trim().min(1),
  role: z.string().trim().min(1),
  greeting: z.string().trim().min(1),
  emphasize: z.array(z.enum(sectionIds)).min(1),
  bullets: z.array(z.string().trim().min(1)).length(3),
  jdContext: z.string().trim().min(1),
});

export type Audience = z.infer<typeof audienceSchema>;

export class AudienceContentError extends Error {
  override name = 'AudienceContentError';
}

export function parseAudience(yamlText: string, fileName = 'audience.yaml'): Audience {
  const hit = findForbidden(yamlText);
  if (hit) {
    const { line, column } = locate(yamlText, hit.index);
    throw new AudienceContentError(
      `${fileName} contains a forbidden character (${hit.reason}, ${hit.codePoint}) at line ${line}, column ${column}.`,
    );
  }
  const result = audienceSchema.safeParse(parse(yamlText));
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new AudienceContentError(`${fileName} failed validation:\n${issues}`);
  }
  const slugFromFile = fileName.replace(/^.*[\\/]/, '').replace(/\.ya?ml$/, '');
  if (slugFromFile !== 'audience' && slugFromFile !== result.data.slug) {
    throw new AudienceContentError(`${fileName}: slug "${result.data.slug}" must match the file name.`);
  }
  return result.data;
}

const files = import.meta.glob('../content/audiences/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const audiences: Audience[] = Object.entries(files)
  .map(([path, raw]) => parseAudience(raw, path))
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function getAudience(slug: string | undefined | null): Audience | undefined {
  if (!slug) return undefined;
  return audiences.find((a) => a.slug === slug);
}
