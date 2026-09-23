#!/usr/bin/env node
/**
 * Runs the real vitest suite and writes a small, build-time-generated
 * summary the site can display truthfully near the chat launcher (the
 * "grounding test certificate", docs/portfolio-audit.md Section 16 item 10).
 * This is not a hand-maintained number: if a test is added, removed, or
 * starts failing, this file is regenerated from the actual run, every build.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(root, '.vitest', 'json');
const reportPath = join(outputDir, 'output.json');
const genDir = join(root, 'src', 'generated');
const genPath = join(genDir, 'test-summary.json');

let report;
try {
  // shell:true is required to resolve `npx` on Windows (it's npx.cmd, found
  // via PATH by the shell, not directly executable). Arguments are static
  // and hardcoded, never derived from external input, so this is safe.
  execFileSync('npx', ['vitest', 'run', '--reporter=json'], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'inherit'],
    shell: true,
  });
  report = JSON.parse(readFileSync(reportPath, 'utf8'));
} catch (err) {
  console.error('[test-summary] Test run failed; the build should not proceed on a red suite.');
  throw err;
}

mkdirSync(genDir, { recursive: true });
const summary = {
  total: report.numTotalTests,
  passed: report.numPassedTests,
  success: Boolean(report.success),
  generatedAt: new Date().toISOString(),
};
writeFileSync(genPath, JSON.stringify(summary, null, 2) + '\n');
rmSync(join(root, '.vitest'), { recursive: true, force: true });

if (!summary.success) {
  console.error(`[test-summary] ${summary.passed}/${summary.total} tests passed; the build should not proceed.`);
  process.exit(1);
}
console.log(`[test-summary] wrote ${genPath} (${summary.passed}/${summary.total} passing)`);
