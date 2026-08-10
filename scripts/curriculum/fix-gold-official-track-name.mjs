#!/usr/bin/env node
// scripts/curriculum/fix-gold-official-track-name.mjs
// Repairs GOLD Level 1 lesson files whose officialTrackName is the outdated
// "Investing & Wealth Building" value.  Only YAML front matter is changed;
// body text and all other metadata are left byte-for-byte unchanged.
//
// Usage:
//   node scripts/curriculum/fix-gold-official-track-name.mjs
//   npm run curriculum:fix-gold-track-name

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(import.meta.url), '..', '..', '..');
const GOLD_L1_DIR = join(REPO_ROOT, 'content', 'curriculum', 'GOLD', 'L1');

const CANONICAL_VALUE = 'Investing';
const OUTDATED_QUOTED = '"Investing & Wealth Building"';
const OUTDATED_UNQUOTED = 'Investing & Wealth Building';

/**
 * Normalise `officialTrackName` in the YAML front matter of a single file
 * that belongs to the GOLD track.
 *
 * Returns one of:
 *   'changed'          – file was updated on disk
 *   'already-correct'  – value was already canonical
 *   'missing'          – field is absent from front matter
 *   'unexpected'       – field has an unrecognised value (non-zero exit)
 *   'skipped'          – file is not a GOLD lesson (track != GOLD)
 */
export function normalizeGoldOfficialTrackName(content) {
  // Locate the YAML front matter block (first --- ... --- pair)
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fmMatch) {
    return { status: 'missing', content };
  }

  const [, openDelim, fmBody, closeDelim] = fmMatch;
  const afterFm = content.slice(fmMatch[0].length);

  // Only process GOLD track files
  const trackMatch = fmBody.match(/^track:\s*(.+)$/m);
  if (!trackMatch || trackMatch[1].trim() !== 'GOLD') {
    return { status: 'skipped', content };
  }

  const fieldMatch = fmBody.match(/^(officialTrackName:\s*)(.+)$/m);
  if (!fieldMatch) {
    return { status: 'missing', content };
  }

  const rawValue = fieldMatch[2].trim();
  // Strip surrounding quotes for comparison
  const unquoted = rawValue.replace(/^"(.*)"$/, '$1');

  if (unquoted === CANONICAL_VALUE) {
    return { status: 'already-correct', content };
  }

  if (unquoted === OUTDATED_UNQUOTED) {
    // Replace only the matched line inside the front matter.
    // Output unquoted value to match what the validator expects (raw string comparison).
    const newFmBody = fmBody.replace(
      /^(officialTrackName:\s*)(.+)$/m,
      `$1${CANONICAL_VALUE}`,
    );
    const newContent = `${openDelim}${newFmBody}${closeDelim}${afterFm}`;
    return { status: 'changed', content: newContent };
  }

  return { status: 'unexpected', value: rawValue, content };
}

// ── CLI entry point ──────────────────────────────────────────────────────────

// Only run the CLI logic when this file is executed directly, not when imported.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let mdFiles;
  try {
    mdFiles = readdirSync(GOLD_L1_DIR).filter((f) => f.endsWith('.md'));
  } catch {
    console.error(`ERROR: Cannot read directory: ${GOLD_L1_DIR}`);
    console.error('Ensure content/curriculum/GOLD/L1/ exists before running this script.');
    process.exit(1);
  }

  let scanned = 0;
  let changed = 0;
  let alreadyCorrect = 0;
  let missing = 0;
  let unexpected = 0;
  let hasUnexpected = false;

  for (const filename of mdFiles) {
    const filePath = join(GOLD_L1_DIR, filename);
    const original = readFileSync(filePath, 'utf8');
    const result = normalizeGoldOfficialTrackName(original);
    scanned += 1;

    switch (result.status) {
      case 'changed':
        writeFileSync(filePath, result.content, 'utf8');
        changed += 1;
        console.log(`  [FIXED]   ${filename}`);
        break;
      case 'already-correct':
        alreadyCorrect += 1;
        console.log(`  [OK]      ${filename}`);
        break;
      case 'missing':
        missing += 1;
        console.warn(`  [MISSING] ${filename}  — officialTrackName field not found`);
        break;
      case 'unexpected':
        unexpected += 1;
        hasUnexpected = true;
        console.error(`  [ERROR]   ${filename}  — unexpected officialTrackName: ${result.value}`);
        break;
      case 'skipped':
        // Not a GOLD file — should not normally appear here but count it
        scanned -= 1;
        break;
      default:
        break;
    }
  }

  console.log('');
  console.log('── GOLD L1 officialTrackName repair summary ──────────────────');
  console.log(`  .md files scanned    : ${scanned}`);
  console.log(`  files changed        : ${changed}`);
  console.log(`  already correct      : ${alreadyCorrect}`);
  console.log(`  missing field        : ${missing}`);
  console.log(`  unexpected values    : ${unexpected}`);
  console.log('──────────────────────────────────────────────────────────────');

  if (hasUnexpected) {
    console.error('');
    console.error('ERROR: Unexpected officialTrackName values encountered. Review files above.');
    process.exit(1);
  }
}
