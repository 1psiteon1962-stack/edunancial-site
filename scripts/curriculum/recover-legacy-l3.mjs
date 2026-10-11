#!/usr/bin/env node
// scripts/curriculum/recover-legacy-l3.mjs
//
// One-time recovery of the English Level 3 lessons for all eight tracks that
// were uploaded in Sept 2026 in the legacy format
//   content/courses/<track>/level-3/en_us/<track>-level-3-<track>-l3-NNN.md
// but never merged. Each source is pinned to an exact PR head commit, so the
// recovered bytes are fixed and auditable.
//
// For each lesson the script:
//   1. reads the legacy file from the pinned commit;
//   2. checks its "Filename:" header names the expected canonical ID;
//   3. prepends a front-matter block built only from fields already in the
//      legacy header (Title, Meta Description). The body is kept byte-for-byte;
//   4. writes it to an input folder for the repository importer
//      (scripts/curriculum/bulk-import.mjs), which validates, writes the
//      canonical file, computes checksums and registers it.
//
// Safety: refuses to run if any target canonical file or registry record
// already exists, if a source commit or lesson is missing, or if a header
// does not match. It never edits or deletes existing curriculum.
//
// Usage: node scripts/curriculum/recover-legacy-l3.mjs <output-dir>
//        (sources must be fetched first: git fetch origin pull/<N>/head)

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readRegistry, getAsset } from './lib/registry.mjs';
import { OFFICIAL_TRACK_NAMES } from './lib/taxonomy.mjs';

export const SOURCES = [
  { track: 'BLACK',  pr: 651, commit: 'f6691ddeecea8440cd42fc78f57a43c02a979b3f' },
  { track: 'BLUE',   pr: 650, commit: '0ea29ca203e63e5e4c39d389ffe7ca13660bb50d' },
  { track: 'GOLD',   pr: 646, commit: 'e213feadb0f9a967658a3478fabca5fd464cba5f' },
  { track: 'GREEN',  pr: 647, commit: '23218cf4634ba58ee6ba5b2e20d007cde9278b84' },
  { track: 'ORANGE', pr: 638, commit: 'd0f9592530f134496c8a12cdc6171230ec8682e3' },
  { track: 'PURPLE', pr: 643, commit: '818591c609a71ae84bd347fcaaa2ac5222b71d4e' },
  { track: 'RED',    pr: 649, commit: 'c3ba97f1d906e320d3ed565aa1aada452cf11974' },
  { track: 'WHITE',  pr: 644, commit: 'edc7fa5acbcd9533ac8a77ea100b418ca82dcc1c' },
];

const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
// Front-matter values are written unquoted (as in content/curriculum/GOLD/L2):
// the repository parser takes everything after the first ":" verbatim, so
// unquoted values keep titles exact and avoid stored quote characters.
const plain = (s) => String(s).replace(/[\r\n]+/g, ' ').trim();

function header(body, key) {
  const m = body.match(new RegExp(`^${key}:[ \\t]*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

function main() {
  const out = process.argv[2];
  if (!out) { console.error('Usage: recover-legacy-l3.mjs <output-dir>'); process.exit(2); }
  const registry = readRegistry();
  const problems = [];
  const plan = [];

  for (const { track, pr, commit } of SOURCES) {
    try { git('cat-file', '-e', `${commit}^{commit}`); }
    catch { problems.push(`${track}: source commit ${commit} (PR #${pr}) not fetched`); continue; }
    const t = track.toLowerCase();
    const dir = `content/courses/${t}/level-3/en_us/`;
    const files = git('ls-tree', '-r', '--name-only', commit, dir).split('\n').filter(Boolean);
    const date = git('show', '-s', '--format=%cs', commit).trim();
    for (let n = 1; n <= 50; n++) {
      const num = String(n).padStart(3, '0');
      const id = `${track}-L3-${num}`;
      const src = files.filter((f) => f.endsWith(`${t}-l3-${num}.md`));
      if (src.length !== 1) { problems.push(`${id}: expected 1 source file in ${commit}, found ${src.length}`); continue; }
      const canonical = `content/curriculum/${track}/L3/${id}.md`;
      if (existsSync(canonical)) { problems.push(`${id}: ${canonical} already exists`); continue; }
      if (getAsset(registry, id)) { problems.push(`${id}: already registered`); continue; }
      const body = git('show', `${commit}:${src[0]}`);
      if (header(body, 'Filename') !== `${id}.md`) { problems.push(`${id}: Filename header is "${header(body, 'Filename')}"`); continue; }
      const title = header(body, 'Title');
      const summary = header(body, 'Meta Description');
      if (!title) { problems.push(`${id}: no Title header`); continue; }
      if (!/^## Learning Objectives$/m.test(body) || !/^## Core Content$/m.test(body)) { problems.push(`${id}: missing required section`); continue; }
      const fm = [
        '---',
        `id: ${id}`,
        `track: ${track}`,
        `officialTrackName: ${plain(OFFICIAL_TRACK_NAMES[track])}`,
        'level: 3',
        `lessonNumber: ${n}`,
        `title: ${plain(title)}`,
        ...(summary ? [`summary: ${plain(summary)}`] : []),
        'version: 1.0',
        'author: Edunancial Faculty',
        `date: ${date}`,
        '---',
        '',
      ].join('\n');
      plan.push({ id, track, file: join(out, track, `${id}.md`), text: fm + body, source: `${commit}:${src[0]}` });
    }
  }

  if (problems.length) {
    console.error(`SAFETY STOP: ${problems.length} problem(s); nothing written.`);
    for (const p of problems.slice(0, 60)) console.error(' -', p);
    process.exit(1);
  }
  for (const p of plan) { mkdirSync(join(out, p.track), { recursive: true }); writeFileSync(p.file, p.text); }
  writeFileSync(join(out, 'SOURCES.json'), `${JSON.stringify(plan.map(({ id, source }) => ({ id, source })), null, 2)}\n`);
  console.log(`Prepared ${plan.length} Level 3 lessons for import in ${out}`);
}

main();
