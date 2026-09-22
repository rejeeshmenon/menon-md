#!/usr/bin/env node
/**
 * Build-time OG image: a 1200x630 SVG filled from cv.yaml, rasterized with
 * sharp to public/og.png. Navy on white, serif name, no gradients.
 * Runs as `prebuild`, so the PNG always matches the current YAML.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parse } from 'yaml';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cv = parse(readFileSync(join(root, 'src/content/cv.yaml'), 'utf8'));
const id = cv.identity;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const NAVY = '#1F3A5F';
const GOLD = '#8A6A24';
const MUTED = '#4F5864';
const W = 1200;
const H = 630;

const stats = cv.stats.map((s) => ({ value: s.value, label: s.label }));
const statX = [96, 372, 648, 924];

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="#E3E6EA" stroke-width="2"/>
  <text x="96" y="176" font-family="Georgia, 'Times New Roman', serif" font-size="76" fill="${NAVY}">${esc(id.name)}<tspan font-size="46" fill="${MUTED}">, ${esc(id.postNominal)}</tspan></text>
  <text x="96" y="238" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#14181F">${esc(id.headline)}</text>
  <text x="96" y="286" font-family="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" font-size="24" fill="${MUTED}">${esc(id.subheadline)}</text>
  <line x1="96" y1="340" x2="${W - 96}" y2="340" stroke="${GOLD}" stroke-width="1.5"/>
  ${stats
    .map(
      (s, i) => `
  <text x="${statX[i]}" y="428" font-family="Georgia, 'Times New Roman', serif" font-size="64" fill="${NAVY}">${esc(s.value)}</text>
  <text x="${statX[i]}" y="466" font-family="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" font-size="21" fill="#14181F">${esc(s.label)}</text>`,
    )
    .join('')}
  <text x="96" y="548" font-family="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" font-size="22" fill="${MUTED}">${esc(id.location.city)}, ${esc(id.location.region)}  ${esc('|')}  ${esc(id.email)}  ${esc('|')}  menon.md</text>
</svg>`;

const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'og.png');
const png = await sharp(Buffer.from(svg), { density: 144 }).resize(W, H).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(out, png);
console.log(`[og-image] wrote ${out} (${png.length} bytes)`);
