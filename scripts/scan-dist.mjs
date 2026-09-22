#!/usr/bin/env node
/**
 * Post-build copy and budget scan.
 *
 * 1. Fails if any em dash, en dash or emoji appears in the visible text of any
 *    built HTML page or in any text output (llms*.txt, cv.json).
 * 2. Reports JavaScript bytes: inline scripts per page, external scripts, and
 *    the lazy chat widget (excluded from the main-page budget). Fails if the
 *    main page's JS exceeds 50 KB excluding the widget.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist', 'client');
const FORBIDDEN = /[–—]|\p{Extended_Pictographic}/gu;
const BUDGET = 50 * 1024;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(dist);
const failures = [];
const report = [];

for (const file of files) {
  const rel = relative(dist, file).replace(/\\/g, '/');
  if (/\.(html|txt|json|xml)$/.test(rel)) {
    let text = readFileSync(file, 'utf8');
    if (rel.endsWith('.html')) {
      text = text
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<style[\s\S]*?<\/style>/g, '')
        .replace(/<[^>]+>/g, ' ');
    }
    if (rel === 'wrangler.json') continue;
    const hits = [...text.matchAll(FORBIDDEN)];
    for (const h of hits.slice(0, 5)) {
      const cp = h[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
      failures.push(`${rel}: forbidden character U+${cp} near "${text.slice(Math.max(0, h.index - 30), h.index + 30).replace(/\s+/g, ' ')}"`);
    }
  }
}

// JS budget
const pages = files.filter((f) => f.endsWith('.html'));
for (const page of pages) {
  const rel = relative(dist, page).replace(/\\/g, '/');
  const html = readFileSync(page, 'utf8');
  let inline = 0;
  let external = 0;
  const ext = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1];
    if (/type="application\/(ld\+)?json"/.test(attrs)) continue;
    const src = /src="([^"]+)"/.exec(attrs)?.[1];
    if (src) {
      if (/^https?:/.test(src)) {
        ext.push(`${src} (external, deferred)`);
        continue;
      }
      const p = join(dist, src.replace(/^\//, ''));
      try {
        external += statSync(p).size;
        ext.push(src);
      } catch {
        ext.push(`${src} (not in dist)`);
      }
    } else {
      inline += Buffer.byteLength(m[2], 'utf8');
    }
  }
  report.push({ page: rel, inlineBytes: inline, externalBytes: external, external: ext, htmlBytes: Buffer.byteLength(html, 'utf8') });
  if (rel === 'index.html' && inline + external > BUDGET) {
    failures.push(`index.html: ${inline + external} bytes of JS exceeds the ${BUDGET} byte budget`);
  }
}

const widget = files.find((f) => f.endsWith('chat-widget.js'));
const widgetBytes = widget ? statSync(widget).size : 0;

console.log('\n[scan-dist] JavaScript budget (excluding the lazy chat widget):');
for (const r of report) {
  console.log(`  ${r.page.padEnd(26)} html ${String(r.htmlBytes).padStart(6)} B   inline JS ${String(r.inlineBytes).padStart(5)} B   external JS ${String(r.externalBytes).padStart(5)} B${r.external.length ? '   (' + r.external.join(', ') + ')' : ''}`);
}
console.log(`  lazy chat widget           chat-widget.js ${widgetBytes} B (loaded only on first click or on /chat)`);
const total = files.reduce((n, f) => n + statSync(f).size, 0);
console.log(`[scan-dist] dist/client: ${files.length} files, ${total} bytes total`);

if (failures.length) {
  console.error(`\n[scan-dist] ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('[scan-dist] no em dashes, en dashes or emoji in built copy; JS budget respected');
