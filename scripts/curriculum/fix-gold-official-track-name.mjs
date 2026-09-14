#!/usr/bin/env node
// Curriculum officialTrackName normalization used by the import pipeline.
// Historical name retained to avoid breaking existing imports.
// Only recognized aliases are normalized; unknown values remain untouched so
// the locked taxonomy validator still rejects invalid metadata.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(import.meta.url), '..', '..', '..');
const GOLD_L1_DIR = join(REPO_ROOT, 'content', 'curriculum', 'GOLD', 'L1');

const RULES = Object.freeze({
  GOLD: {
    canonical: 'Investing',
    aliases: new Set(['Investing', 'Investing & Wealth Building']),
  },
  BLACK: {
    canonical: 'Leadership & Executive Management',
    aliases: new Set(['Leadership', 'Leadership & Executive Management']),
  },
});

export function normalizeGoldOfficialTrackName(content) {
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fmMatch) return { status: 'missing', content };

  const [, openDelim, fmBody, closeDelim] = fmMatch;
  const afterFm = content.slice(fmMatch[0].length);
  const trackMatch = fmBody.match(/^track:\s*["']?([^"'\r\n]+)["']?\s*$/m);
  if (!trackMatch) return { status: 'skipped', content };

  const track = trackMatch[1].trim().toUpperCase();
  const rule = RULES[track];
  if (!rule) return { status: 'skipped', content };

  const fieldMatch = fmBody.match(/^(officialTrackName:\s*)(.+)$/m);
  if (!fieldMatch) return { status: 'missing', content };

  const rawValue = fieldMatch[2].trim();
  const unquoted = rawValue.replace(/^["'](.*)["']$/, '$1').trim();
  if (unquoted === rule.canonical) return { status: 'already-correct', content };
  if (!rule.aliases.has(unquoted)) return { status: 'unexpected', value: rawValue, content };

  const newFmBody = fmBody.replace(
    /^(officialTrackName:\s*)(.+)$/m,
    `$1"${rule.canonical}"`,
  );
  return {
    status: 'changed',
    track,
    canonical: rule.canonical,
    content: `${openDelim}${newFmBody}${closeDelim}${afterFm}`,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let mdFiles;
  try {
    mdFiles = readdirSync(GOLD_L1_DIR).filter((f) => f.endsWith('.md'));
  } catch {
    console.error(`ERROR: Cannot read directory: ${GOLD_L1_DIR}`);
    process.exit(1);
  }

  let changed = 0;
  let unexpected = 0;
  for (const filename of mdFiles) {
    const filePath = join(GOLD_L1_DIR, filename);
    const original = readFileSync(filePath, 'utf8');
    const result = normalizeGoldOfficialTrackName(original);
    if (result.status === 'changed') {
      writeFileSync(filePath, result.content, 'utf8');
      changed += 1;
      console.log(`  [FIXED] ${filename}`);
    } else if (result.status === 'unexpected') {
      unexpected += 1;
      console.error(`  [ERROR] ${filename} — unexpected officialTrackName: ${result.value}`);
    }
  }
  console.log(`files changed: ${changed}`);
  console.log(`unexpected values: ${unexpected}`);
  if (unexpected > 0) process.exit(1);
}
