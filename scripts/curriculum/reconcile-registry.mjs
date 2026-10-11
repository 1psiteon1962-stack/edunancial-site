#!/usr/bin/env node
// scripts/curriculum/reconcile-registry.mjs
//
// Merge the registry records of one or more content-upload branches into the
// registry of the current working tree (which must already contain the lesson
// files copied from those branches by the Curriculum Reconcile workflow).
//
// Safety model
//   * Existing registry records are never modified or removed. The repository
//     writer (writeRegistry -> assertRegistryNonDestructive) enforces this too.
//   * Every accepted record is checked against the committed lesson bytes using
//     the repository checksum helper (scripts/curriculum/lib/checksum.mjs).
//   * Exactly one class of checksum mismatch is repaired automatically: records
//     written by the importer before #1203 (b91e7dac4), which stored the hash of
//     the pre-normalized upload file instead of the published lesson. The repair
//     is applied only when BOTH hold:
//       - the source branch does not contain the #1203 fix commit, and
//       - the stored checksum equals that branch's staging-manifest upload hash
//         for the same asset ID and destination path.
//   * Anything else (duplicate IDs with different content, unknown tracks,
//     non-canonical paths, unexplained mismatches, missing files) is a safety
//     stop: nothing is written and the process exits non-zero.
//
// Usage
//   node scripts/curriculum/reconcile-registry.mjs [--log <file>] <branch> [...]
//   Branches are read as origin/<branch>.

import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { readRegistry, writeRegistry, upsertAsset, listAllAssets, getAsset } from './lib/registry.mjs';
import { checksumFile, normalizeChecksum } from './lib/checksum.mjs';

const PRE_1203_FIX_COMMIT = 'b91e7dac4d2bca9096df7e2815570061ae5b2399';
const REGISTRY = 'curriculum/registry.json';
// <TRACK>/L<n>/<TRACK>-L<n>-<NNN>.md or ...-<NNN>.<locale>.md (BCP 47 style; the
// repository also uses non-standard subtags such as es-Caribbean).
const CANONICAL_LESSON = /^content\/curriculum\/([A-Z]+)\/L([1-5])\/(\1-L\2-\d{3})(?:\.([A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,16})*))?\.md$/;

const args = process.argv.slice(2);
let logPath = null;
const branches = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--log') logPath = args[++i];
  else branches.push(args[i]);
}
if (!branches.length) {
  console.error('Usage: reconcile-registry.mjs [--log <file>] <branch> [...]');
  process.exit(2);
}

const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const isAncestor = (commit, ref) => {
  try { execFileSync('git', ['merge-base', '--is-ancestor', commit, ref], { stdio: 'ignore' }); return true; }
  catch { return false; }
};

const countBy = (reg) => {
  const out = {};
  for (const a of listAllAssets(reg)) out[`${a.trackCode}-L${a.level}`] = (out[`${a.trackCode}-L${a.level}`] || 0) + 1;
  return out;
};

const registry = readRegistry();
const idByPath = new Map(listAllAssets(registry).map((a) => [a.path, a.assetId]));
const before = countBy(registry);
const beforeTotal = listAllAssets(registry).length;
const actions = [];
const stops = [];

for (const branch of branches) {
  const ref = `origin/${branch}`;
  const preFix = !isAncestor(PRE_1203_FIX_COMMIT, ref);
  const incoming = JSON.parse(git('show', `${ref}:${REGISTRY}`));

  // Staging-manifest upload hashes added by this branch (asset ID -> {checksum, path}).
  const base = git('merge-base', 'origin/main', ref).trim();
  const manifests = git('diff', '--name-only', '--diff-filter=A', base, ref, '--', 'curriculum/staging/')
    .split('\n').filter((p) => p.endsWith('manifest.json'));
  const uploadHash = new Map();
  for (const m of manifests) {
    for (const f of JSON.parse(git('show', `${ref}:${m}`)).files || []) {
      if (f.curriculumAssetId) uploadHash.set(f.curriculumAssetId, { checksum: normalizeChecksum(f.checksum), path: f.destinationPath });
    }
  }

  for (const [track, data] of Object.entries(incoming.tracks || {})) {
    for (const [level, section] of Object.entries(data.levels || {})) {
      for (const [id, asset] of Object.entries(section.assets || {})) {
        const existing = getAsset(registry, id);
        const where = `${branch}: ${id}`;

        if (existing) {
          // Already registered (e.g. inherited from main). Same lesson -> nothing to do.
          // The copy step already refused any incoming file whose bytes differ from the tree,
          // so an identical path means the same committed lesson. Anything else is a conflict.
          if (existing.path !== asset.path) stops.push({ class: 'duplicate-id-different-path', where, existing: existing.path, incoming: asset.path });
          else if (!existsSync(existing.path)) stops.push({ class: 'existing-record-file-missing', where, path: existing.path });
          else if (normalizeChecksum(existing.checksum) !== checksumFile(existing.path)) stops.push({ class: 'existing-record-checksum-mismatch', where, stored: existing.checksum });
          continue;
        }

        if (!registry.tracks?.[track]) { stops.push({ class: 'unknown-track', where, track }); continue; }
        const m = CANONICAL_LESSON.exec(asset.path || '');
        if (!m || m[1] !== track || m[2] !== String(level) || m[3] !== id || asset.id !== id) {
          stops.push({ class: 'non-canonical-path-or-id', where, path: asset.path });
          continue;
        }
        if (idByPath.has(asset.path) && idByPath.get(asset.path) !== id) { stops.push({ class: 'path-registered-under-other-id', where, path: asset.path, other: idByPath.get(asset.path) }); continue; }
        if (!existsSync(asset.path)) { stops.push({ class: 'missing-lesson-file', where, path: asset.path }); continue; }

        const actual = checksumFile(asset.path);
        const stored = normalizeChecksum(asset.checksum);
        const entry = { ...asset };
        if (stored !== actual) {
          const up = uploadHash.get(id);
          // Manifest must supply all three justification fields explicitly.
          if (preFix && up && typeof up.checksum === 'string' && up.checksum.startsWith('sha256:') && up.path === asset.path && up.checksum === stored) {
            entry.checksum = actual;
            actions.push({ class: 'checksum-repaired-pre-1203', branch, id, from: asset.checksum, to: actual });
          } else {
            stops.push({ class: 'unexplained-checksum-mismatch', where, stored: asset.checksum, committed: actual, preFix });
            continue;
          }
        }
        upsertAsset(registry, { track, level: Number(level), id, trackName: data.name }, entry);
        idByPath.set(asset.path, id);
        actions.push({ class: 'registered', branch, id, path: asset.path });
      }
    }
  }
}

const after = countBy(registry);
const summary = {
  branches,
  beforeTotal,
  afterTotal: listAllAssets(registry).length,
  added: actions.filter((a) => a.class === 'registered').length,
  checksumRepairs: actions.filter((a) => a.class === 'checksum-repaired-pre-1203').length,
  countsBefore: before,
  countsAfter: after,
  stops,
  actions,
};
if (logPath) writeFileSync(logPath, `${JSON.stringify(summary, null, 2)}\n`);

if (stops.length) {
  console.error(`SAFETY STOP: ${stops.length} unresolved issue(s); registry NOT written.`);
  for (const s of stops.slice(0, 50)) console.error(' -', JSON.stringify(s));
  process.exit(1);
}

writeRegistry(registry); // throws if any previously active record would disappear
console.log(`Registered ${summary.added} new lessons (${summary.checksumRepairs} pre-#1203 checksum repairs). Total ${beforeTotal} -> ${summary.afterTotal}.`);
for (const k of Object.keys(after).sort()) if ((before[k] || 0) !== after[k]) console.log(`  ${k}: ${before[k] || 0} -> ${after[k]}`);
