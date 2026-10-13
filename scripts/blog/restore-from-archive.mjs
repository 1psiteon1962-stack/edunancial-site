#!/usr/bin/env node
// Restore a blog archive into an EMPTY, NON-PRODUCTION database (normally a
// fresh Neon branch), then prove the restore by re-exporting and comparing
// row counts, table hashes and every revision's content_sha256.
//
// Restore drill (writes to the target):
//   BLOG_RESTORE_DATABASE_URL=<new branch URL> node scripts/blog/restore-from-archive.mjs \
//     --archive <dir> --confirm-target=<target host>
//
// Compare only (read-only, e.g. archive vs production):
//   BLOG_VERIFY_DATABASE_URL=<read-only URL> node scripts/blog/restore-from-archive.mjs --archive <dir> --verify-only
//
// Safety (every check must pass; any one failing stops before a single write):
//  1. at least one production URL is configured to compare against (fail closed);
//  2. the target is not BLOG_ARCHIVE_DATABASE_URL, BLOG_PRODUCTION_DATABASE_URL,
//     DATABASE_URL or NETLIFY_DATABASE_URL (Neon "-pooler" hosts normalized);
//  3. the target host is typed back exactly via --confirm-target;
//  4. the target has the hand-made blog_restore_drill_target marker table;
//  5. every blog table in the target is empty;
//  6. the archive decrypts and authenticates, and its data matches its MANIFEST.
// All writes happen in one transaction (all or nothing).
// Approval history is restored exactly. The publication guard trigger still
// re-checks every approved/scheduled/published article during the restore.
import fs from 'node:fs';
import path from 'node:path';
import {
  DRILL_MARKER_TABLE, TABLES, assertRestoreTargetAllowed, buildManifest, compareManifests, drillMarkerQuery,
  emptinessQuery, exportQueries, parseArchive, restoreQueries, rowsFromExportResults,
} from './archive-lib.mjs';
import { BUNDLE_FILE, openBundle, parseKey } from './archive-crypto.mjs';

export function readArchiveDir(dir) {
  const files = {};
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.name === '.git') continue;
      if (e.isDirectory()) walk(r);
      else if (r === 'MANIFEST.json' || r.startsWith('data/')) files[r] = fs.readFileSync(path.join(dir, r), 'utf8');
    }
  };
  walk('');
  return files;
}

// Encrypted archive (blog-archive.enc) is decrypted in memory only.
export function loadArchiveFiles(dir, rawKey) {
  const bundle = path.join(dir, BUNDLE_FILE);
  if (fs.existsSync(bundle)) return openBundle(fs.readFileSync(bundle), parseKey(rawKey));
  return readArchiveDir(dir);
}

export function loadVerifiedArchive(files) {
  const { manifest, data } = parseArchive(files);
  const diffs = compareManifests(manifest, buildManifest(data));
  if (diffs.length) throw new Error(`Archive is corrupt (its data does not match its MANIFEST):\n- ${diffs.join('\n- ')}`);
  return { manifest, data };
}

export async function snapshotManifest(runTransaction) {
  return buildManifest(rowsFromExportResults(await runTransaction(exportQueries(), { readOnly: true })));
}

export async function verifyAgainst({ files, runTransaction }) {
  const { manifest } = loadVerifiedArchive(files);
  const actual = await snapshotManifest(runTransaction);
  return { diffs: compareManifests(manifest, actual), expected: manifest, actual };
}

export async function restoreArchive({ files, runTransaction }) {
  const { data } = loadVerifiedArchive(files);
  const [marker] = await runTransaction([drillMarkerQuery()], { readOnly: true });
  if (marker[0]?.r !== true) {
    throw new Error(`Refusing to restore: the target has no ${DRILL_MARKER_TABLE} table. Create it by hand in the drill branch only (create table ${DRILL_MARKER_TABLE} ();). Production must never have it.`);
  }
  const [counts] = await runTransaction([emptinessQuery()], { readOnly: true });
  const nonEmpty = Object.entries(counts[0].r).filter(([, n]) => Number(n) > 0);
  if (nonEmpty.length) {
    throw new Error(`Refusing to restore into a database that already has blog data: ${nonEmpty.map(([t, n]) => `${t}=${n}`).join(', ')}. Use a new, empty (schema-only) Neon branch.`);
  }
  const [campaigns] = await runTransaction([{ text: `select to_jsonb(id) as r from marketing_campaigns`, params: [] }], { readOnly: true });
  const existingCampaignIds = new Set(campaigns.map((x) => x.r));
  const { queries, report } = restoreQueries(data, { existingCampaignIds });
  await runTransaction(queries);

  // Campaign links whose campaign does not exist in the target are restored as
  // null and reported; everything else must match the archive exactly.
  const dropped = new Set(report.droppedCampaignLinks.map((d) => d.article_id));
  const expected = buildManifest({ ...data, blog_articles: data.blog_articles.map((a) => (dropped.has(a.id) ? { ...a, marketing_campaign_id: null } : a)) });
  const actual = await snapshotManifest(runTransaction);
  return { diffs: compareManifests(expected, actual), report, actual };
}

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`${name}=`));
  if (hit) return hit.slice(name.length + 1);
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
}

function printSummary(title, manifest, diffs) {
  console.log(`\n${title}`);
  for (const { name } of TABLES) console.log(`  ${name}: ${manifest.tables[name].rows} rows`);
  if (diffs.length) { console.log('  DIFFERENCES:'); for (const d of diffs) console.log(`  - ${d}`); }
  else console.log('  Result: IDENTICAL to the archive (counts, table hashes and every revision content_sha256).');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = arg('--archive');
  if (!dir) { console.error('Usage: restore-from-archive.mjs --archive <dir> (--confirm-target=<host> | --verify-only)'); process.exit(2); }
  const { neonExecutor } = await import('./neon-executor.mjs');
  try {
    const files = loadArchiveFiles(path.resolve(dir), process.env.BLOG_ARCHIVE_ENCRYPTION_KEY);
    if (process.argv.includes('--verify-only')) {
      const url = process.env.BLOG_VERIFY_DATABASE_URL?.trim();
      if (!url) throw new Error('BLOG_VERIFY_DATABASE_URL is not set.');
      const { diffs, actual } = await verifyAgainst({ files, runTransaction: neonExecutor(url) });
      printSummary('Archive vs database (read-only comparison)', actual, diffs);
      process.exit(diffs.length ? 1 : 0);
    }
    const targetUrl = process.env.BLOG_RESTORE_DATABASE_URL?.trim();
    const host = assertRestoreTargetAllowed({
      targetUrl, confirmHost: arg('--confirm-target'),
      protectedUrls: [process.env.BLOG_ARCHIVE_DATABASE_URL, process.env.DATABASE_URL, process.env.NETLIFY_DATABASE_URL, process.env.BLOG_PRODUCTION_DATABASE_URL],
    });
    console.log(`Restoring into ${host} ...`);
    const { diffs, report, actual } = await restoreArchive({ files, runTransaction: neonExecutor(targetUrl) });
    for (const d of report.droppedCampaignLinks) console.log(`::warning title=Campaign link not restored::article ${d.article_id} referenced marketing campaign ${d.marketing_campaign_id}, which does not exist in the target.`);
    printSummary(`Restore drill into ${host}`, actual, diffs);
    process.exit(diffs.length ? 1 : 0);
  } catch (e) {
    console.error(`::error title=Blog restore stopped::${String(e.message).replace(/\n/g, ' ')}`);
    process.exit(1);
  }
}
