/**
 * Reads the build-time-generated test summary (scripts/test-summary.mjs).
 * Uses import.meta.glob rather than node:fs: this module is bundled into
 * Astro's prerender output, which runs in a virtualized workerd sandbox
 * where node:fs cannot see the real project directory (process.cwd()
 * resolves to a bundler-internal path there, not the repo root). glob with
 * zero matches returns an empty object rather than throwing, so this
 * degrades to null gracefully on a fresh checkout before the first build.
 */
export interface TestSummary {
  total: number;
  passed: number;
  success: boolean;
  generatedAt: string;
}

const files = import.meta.glob('../generated/test-summary.json', {
  eager: true,
  import: 'default',
}) as Record<string, TestSummary>;

const summary = Object.values(files)[0] ?? null;

export function loadTestSummary(): TestSummary | null {
  return summary;
}
