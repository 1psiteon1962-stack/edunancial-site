#!/usr/bin/env node
// Export every blog article, revision, approval and audit event from Neon
// (PR-6 backup). Reads run inside a READ ONLY transaction, so this script
// cannot change the database even if given a privileged URL.
//
// Encrypted (the ONLY mode the workflow uses; safe for the public repository):
//   BLOG_ARCHIVE_DATABASE_URL=... BLOG_ARCHIVE_ENCRYPTION_KEY=... \
//     node scripts/blog/export-archive.mjs --encrypt-to <dir>
//   Writes blog-archive.enc + blog-archive.hmac. Plaintext never touches disk.
//
// Plaintext (local inspection only):
//   node scripts/blog/export-archive.mjs --out <dir>
//   Refuses any directory inside a Git checkout, so readable drafts cannot be committed.
import fs from 'node:fs';
import path from 'node:path';
import { buildArchiveFiles, exportQueries, rowsFromExportResults, TABLES } from './archive-lib.mjs';
import { BUNDLE_FILE, HMAC_FILE, bundleHmac, hmacEquals, parseKey, sealBundle } from './archive-crypto.mjs';

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
}

export async function exportData(runTransaction) {
  const data = rowsFromExportResults(await runTransaction(exportQueries(), { readOnly: true }));
  const files = buildArchiveFiles(data);
  return { data, files, manifest: JSON.parse(files['MANIFEST.json']) };
}

export function insideGitCheckout(dir) {
  for (let d = path.resolve(dir); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.git'))) return true;
    if (path.dirname(d) === d) return false;
  }
}

export async function exportArchive({ runTransaction, outDir: dirArg, allowGit = false }) {
  const outDir = path.resolve(dirArg);
  if (!allowGit && insideGitCheckout(outDir)) {
    throw new Error(`Refusing to write a PLAINTEXT archive inside a Git checkout (${outDir}). Use --encrypt-to for anything that may be committed.`);
  }
  const { data, files, manifest } = await exportData(runTransaction);
  // Replace only what this script owns, so stale Markdown for renamed slugs disappears.
  for (const owned of ['data', 'markdown']) fs.rmSync(path.join(outDir, owned), { recursive: true, force: true });
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(outDir, rel);
    if (!full.startsWith(outDir + path.sep)) throw new Error(`Refusing to write outside ${outDir}: ${rel}`);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return { data, manifest };
}

// Returns { changed } - false when the plaintext is identical to the last bundle,
// in which case the existing bundle is left untouched (no nightly churn).
export async function exportEncrypted({ runTransaction, outDir: dirArg, key }) {
  const outDir = path.resolve(dirArg);
  const { data, files, manifest } = await exportData(runTransaction);
  const mac = bundleHmac(files, key);
  const macPath = path.join(outDir, HMAC_FILE);
  const previous = fs.existsSync(macPath) ? fs.readFileSync(macPath, 'utf8').trim() : '';
  const bundlePath = path.join(outDir, BUNDLE_FILE);
  if (hmacEquals(previous, mac) && fs.existsSync(bundlePath)) return { changed: false, data, manifest, files };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(bundlePath, sealBundle(files, key));
  fs.writeFileSync(macPath, mac + '\n');
  return { changed: true, data, manifest, files };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const encDir = arg('--encrypt-to');
  const outDir = arg('--out');
  const url = process.env.BLOG_ARCHIVE_DATABASE_URL?.trim();
  if (!encDir === !outDir) { console.error('Usage: export-archive.mjs (--encrypt-to <dir> | --out <dir>)'); process.exit(2); }
  try {
    if (!url) throw new Error('BLOG_ARCHIVE_DATABASE_URL is not set (use a read-only Neon role).');
    const key = encDir ? parseKey(process.env.BLOG_ARCHIVE_ENCRYPTION_KEY) : null;
    const { neonExecutor } = await import('./neon-executor.mjs');
    const runTransaction = neonExecutor(url);
    const res = encDir ? await exportEncrypted({ runTransaction, outDir: encDir, key }) : await exportArchive({ runTransaction, outDir });
    // Counts only. Never print content, identities or hashes of drafts to (public) logs.
    for (const { name } of TABLES) console.log(`${name}: ${res.manifest.tables[name].rows} rows`);
    if (encDir) console.log(res.changed ? 'Encrypted bundle written.' : 'No change since the last bundle; left untouched.');
  } catch (e) {
    console.error(`::error title=Blog archive export stopped::${e.message}`);
    process.exit(1);
  }
}
