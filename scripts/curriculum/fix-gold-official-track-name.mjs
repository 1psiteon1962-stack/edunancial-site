#!/usr/bin/env node
// scripts/curriculum/fix-gold-official-track-name.mjs
// Repairs GOLD Level 1 lesson files whose officialTrackName is the outdated
// "Investing & Wealth Building" value. Only YAML front matter is changed.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(import.meta.url), '..', '..', '..');
const GOLD_L1_DIR = join(REPO_ROOT, 'content', 'curriculum', 'GOLD', 'L1');
const CANONICAL_VALUE = 'Investing';
const OUTDATED_UNQUOTED = 'Investing & Wealth Building';

export function normalizeGoldOfficialTrackName(content) {
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fmMatch) return { status: 'missing', content };
  const [, openDelim, fmBody, closeDelim] = fmMatch;
  const afterFm = content.slice(fmMatch[0].length);
  const trackMatch = fmBody.match(/^track:\s*(.+)$/m);
  if (!trackMatch || trackMatch[1].trim() !== 'GOLD') return { status: 'skipped', content };
  const fieldMatch = fmBody.match(/^(officialTrackName:\s*)(.+)$/m);
  if (!fieldMatch) return { status: 'missing', content };
  const rawValue = fieldMatch[2].trim();
  const unquoted = rawValue.replace(/^"(.*)"$/, '$1');
  if (unquoted === CANONICAL_VALUE) return { status: 'already-correct', content };
  if (unquoted === OUTDATED_UNQUOTED) {
    const newFmBody = fmBody.replace(/^(officialTrackName:\s*)(.+)$/m, `$1${CANONICAL_VALUE}`);
    return { status: 'changed', content: `${openDelim}${newFmBody}${closeDelim}${afterFm}` };
  }
  return { status: 'unexpected', value: rawValue, content };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let mdFiles;
  try { mdFiles = readdirSync(GOLD_L1_DIR).filter((f) => f.endsWith('.md')); }
  catch { console.error(`ERROR: Cannot read directory: ${GOLD_L1_DIR}`); process.exit(1); }
  let hasUnexpected = false;
  for (const filename of mdFiles) {
    const filePath = join(GOLD_L1_DIR, filename);
    const original = readFileSync(filePath, 'utf8');
    const result = normalizeGoldOfficialTrackName(original);
    if (result.status === 'changed') writeFileSync(filePath, result.content, 'utf8');
    if (result.status === 'unexpected') hasUnexpected = true;
  }
  if (hasUnexpected) process.exit(1);
}
