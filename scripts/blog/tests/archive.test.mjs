import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertRestoreTargetAllowed, buildArchiveFiles, buildManifest, canonicalJson, compareManifests,
  parseArchive, restoreQueries, revisionContentSha, tableJsonl,
} from '../archive-lib.mjs';
import { exportArchive, exportEncrypted, insideGitCheckout } from '../export-archive.mjs';
import { loadArchiveFiles, loadVerifiedArchive, readArchiveDir, restoreArchive, verifyAgainst } from '../restore-from-archive.mjs';
import { BUNDLE_FILE, HMAC_FILE, bundleHmac, openBundle, parseKey, sealBundle } from '../archive-crypto.mjs';
import { applyBlogMigrations, createDatabase, pgAvailable, psqlExecutor, run } from './pg-helpers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'blog-archive-'));

// ---------------- pure unit tests ----------------
const A = '00000000-0000-4000-8000-000000000001';
const R1 = '00000000-0000-4000-8000-0000000000a1';
const R2 = '00000000-0000-4000-8000-0000000000a2';
const fixture = () => ({
  blog_articles: [{ id: A, slug: 'roth-ira', locale: 'en-US', status: 'published', current_revision_id: R2, approved_revision_id: R2, published_revision_id: R2, marketing_campaign_id: null, updated_at: '2026-10-12T00:00:00+00:00' }],
  blog_article_revisions: [
    { id: R2, article_id: A, version: 2, title: 'Roth IRA', summary: 'S2', body: 'Body "two" $1 \\ ñ', author: 'Edunancial', seo_title: null, seo_description: null, sources: [{ url: 'https://irs.gov' }], created_by: 'owner', created_at: '2026-10-12T00:00:01.123456+00:00' },
    { id: R1, article_id: A, version: 1, title: 'Roth IRA', summary: 'S1', body: 'Body one', author: 'Edunancial', seo_title: null, seo_description: null, sources: [], created_by: 'ai:claude', created_at: '2026-10-11T00:00:00+00:00' },
  ],
  blog_article_approvals: [{ id: '00000000-0000-4000-8000-0000000000b1', article_id: A, revision_id: R2, approved_by: 'owner', revoked_at: null }],
  blog_article_audit_log: [{ id: 2, article_id: A, action: 'approved' }, { id: 1, article_id: A, action: 'draft_created' }],
});

test('archive output is deterministic and independent of row/key order', () => {
  const a = fixture();
  const b = fixture();
  b.blog_article_revisions.reverse();
  b.blog_articles = b.blog_articles.map((r) => Object.fromEntries(Object.entries(r).reverse()));
  assert.deepEqual(buildArchiveFiles(a), buildArchiveFiles(b));
  assert.ok(!buildArchiveFiles(a)['MANIFEST.json'].includes('exported'), 'manifest carries no timestamp');
});

test('manifest round-trips and detects any content change', () => {
  const files = buildArchiveFiles(fixture());
  const { manifest, data } = parseArchive(files);
  assert.deepEqual(compareManifests(manifest, buildManifest(data)), []);
  const tampered = { ...files, 'data/blog_article_revisions.jsonl': files['data/blog_article_revisions.jsonl'].replace('Body one', 'Body 1') };
  assert.throws(() => loadVerifiedArchive(tampered), /corrupt/);
});

test('content_sha256 covers reader-visible fields only', () => {
  const r = fixture().blog_article_revisions[0];
  assert.equal(revisionContentSha(r), revisionContentSha({ ...r, created_at: 'other' }));
  assert.notEqual(revisionContentSha(r), revisionContentSha({ ...r, body: r.body + '.' }));
});

test('markdown copy is written per revision with pointer flags', () => {
  const files = buildArchiveFiles(fixture());
  const md = Object.entries(files).filter(([p]) => p.startsWith('markdown/'));
  assert.equal(md.length, 2);
  const v2 = files['markdown/en-US/roth-ira/v0002-00000000.md'];
  assert.match(v2, /is_published: true/);
  assert.match(v2, /## Sources/);
  assert.match(files['markdown/en-US/roth-ira/v0001-00000000.md'], /is_published: false/);
});

test('restore inserts articles as drafts first, then sets pointers and status', () => {
  const { queries } = restoreQueries(fixture());
  const firstInsert = JSON.parse(queries[1].params[0]);
  assert.equal(firstInsert.status, 'draft');
  assert.equal(firstInsert.current_revision_id, null);
  const update = queries.find((x) => x.text.startsWith('update blog_articles'));
  assert.equal(JSON.parse(update.params[0]).status, 'published');
  assert.ok(queries.indexOf(update) > queries.findIndex((x) => x.text.includes('blog_article_approvals')));
});

test('restore target guard refuses production and unconfirmed targets', () => {
  const prod = 'postgres://ro:x@ep-prod-123.us-east-2.aws.neon.tech/neondb';
  const branch = 'postgres://rw:y@ep-drill-456.us-east-2.aws.neon.tech/neondb';
  assert.throws(() => assertRestoreTargetAllowed({ targetUrl: prod.replace('ro:x', 'admin:z'), protectedUrls: [prod], confirmHost: 'ep-prod-123.us-east-2.aws.neon.tech' }), /protected/);
  assert.throws(() => assertRestoreTargetAllowed({ targetUrl: branch, protectedUrls: [prod] }), /confirm-target/);
  assert.throws(() => assertRestoreTargetAllowed({ targetUrl: branch, protectedUrls: [prod], confirmHost: 'ep-prod-123.us-east-2.aws.neon.tech' }), /confirm-target/);
  assert.throws(() => assertRestoreTargetAllowed({ targetUrl: '', protectedUrls: [prod], confirmHost: 'x' }), /not set/);
  assert.equal(assertRestoreTargetAllowed({ targetUrl: branch, protectedUrls: [prod, undefined], confirmHost: 'EP-DRILL-456.us-east-2.aws.neon.tech' }), 'ep-drill-456.us-east-2.aws.neon.tech');
});

test('restore guard: pooler host of production is still production', () => {
  const prodDirect = 'postgres://ro:x@ep-prod-123.us-east-2.aws.neon.tech/neondb';
  const prodPooler = 'postgres://admin:z@ep-prod-123-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';
  assert.throws(() => assertRestoreTargetAllowed({ targetUrl: prodPooler, protectedUrls: [prodDirect], confirmHost: 'ep-prod-123-pooler.us-east-2.aws.neon.tech' }), /protected/);
  assert.throws(() => assertRestoreTargetAllowed({ targetUrl: prodDirect, protectedUrls: [prodPooler], confirmHost: 'ep-prod-123.us-east-2.aws.neon.tech' }), /protected/);
});

test('restore guard fails closed when no production URL is configured', () => {
  const branch = 'postgres://rw:y@ep-drill-456.us-east-2.aws.neon.tech/neondb';
  for (const protectedUrls of [[], [undefined, null, ''], ['  ']]) {
    assert.throws(() => assertRestoreTargetAllowed({ targetUrl: branch, protectedUrls, confirmHost: 'ep-drill-456.us-east-2.aws.neon.tech' }), /no protected production URL/);
  }
});

const KEY_B64 = Buffer.alloc(32, 7).toString('base64');
test('encryption: round trip, no readable content, wrong key and tampering rejected', () => {
  const key = parseKey(KEY_B64);
  const files = buildArchiveFiles(fixture());
  const sealed = sealBundle(files, key);
  const asText = sealed.toString('latin1');
  for (const secret of ['Roth IRA', 'Body one', 'owner', 'ai:claude', 'roth-ira', 'irs.gov']) assert.ok(!asText.includes(secret), `bundle leaks ${secret}`);
  assert.deepEqual(openBundle(sealed, key), files);
  assert.notDeepEqual(sealBundle(files, key), sealed, 'fresh IV every time');
  assert.throws(() => openBundle(sealed, parseKey(Buffer.alloc(32, 8).toString('base64'))), /failed authentication/);
  const flipped = Buffer.from(sealed); flipped[flipped.length - 1] ^= 1;
  assert.throws(() => openBundle(flipped, key), /failed authentication/);
  assert.throws(() => parseKey(''), /not set/);
  assert.throws(() => parseKey(Buffer.alloc(16).toString('base64')), /32 bytes/);
  assert.equal(bundleHmac(files, key), bundleHmac(buildArchiveFiles(fixture()), key));
  assert.notEqual(bundleHmac(files, key), bundleHmac(files, parseKey(Buffer.alloc(32, 9).toString('base64'))));
});

test('plaintext export refuses to write inside a Git checkout', async () => {
  const repo = tmp();
  fs.mkdirSync(path.join(repo, '.git'));
  const inside = path.join(repo, 'archive');
  assert.equal(insideGitCheckout(inside), true);
  assert.equal(insideGitCheckout(tmp()), false);
  let called = false;
  await assert.rejects(exportArchive({ runTransaction: async () => { called = true; return []; }, outDir: inside }), /PLAINTEXT archive inside a Git checkout/);
  assert.equal(called, false, 'refused before reading the database');
});

test('neon driver exposes the transaction API the scripts rely on', async (t) => {
  let neon;
  try { ({ neon } = await import('@neondatabase/serverless')); } catch { return t.skip('@neondatabase/serverless not installed here'); }
  const sql = neon('postgres://u:p@ep-x.us-east-2.aws.neon.tech/db');
  assert.equal(typeof sql.query, 'function');
  assert.equal(typeof sql.transaction, 'function');
});

// ---------------- real Postgres: export -> restore -> verify ----------------
const pg = pgAvailable();
const SEED = `
insert into marketing_campaigns(id,name,objective) values ('11111111-1111-4111-8111-111111111111','Fall','awareness');
-- published article: v1 by AI, v2 edited and approved by a human
insert into blog_articles(id,slug,locale,title,summary,body,status,version,marketing_campaign_id)
  values ('${A}','roth-ira','en-US','t','s','b','draft',2,'11111111-1111-4111-8111-111111111111');
insert into blog_article_revisions(id,article_id,version,title,summary,body,sources,provenance,created_by,created_at)
  values ('${R1}','${A}',1,'Roth IRA','S1','Body one','[]','{"author":"ai"}','ai:claude','2026-10-11 10:00:00.123456+00'),
         ('${R2}','${A}',2,'Roth IRA','S2',E'Body "two" $1 \\\\ \\u00f1\\nline','[{"url":"https://www.irs.gov"}]','{}','owner','2026-10-12 10:00:00.654321+00');
insert into blog_article_approvals(article_id,revision_id,approved_by,revoked_at) values ('${A}','${R1}','owner',now());
insert into blog_article_approvals(article_id,revision_id,approved_by) values ('${A}','${R2}','owner');
update blog_articles set current_revision_id='${R2}',approved_revision_id='${R2}',status='published',published_at='2026-10-12 11:00+00' where id='${A}';
-- draft article with one unapproved revision
insert into blog_articles(id,slug,locale,title,summary,body) values ('00000000-0000-4000-8000-000000000002','taxes','es-ES','t','s','b');
insert into blog_article_revisions(id,article_id,version,title,summary,body,created_by) values ('00000000-0000-4000-8000-0000000000c1','00000000-0000-4000-8000-000000000002',1,'Impuestos','R','Cuerpo','ai:chatgpt');
update blog_articles set current_revision_id='00000000-0000-4000-8000-0000000000c1' where id='00000000-0000-4000-8000-000000000002';
insert into blog_article_audit_log(article_id,revision_id,action,actor_type,actor_id) values
  ('${A}','${R1}','draft_created','ai','claude'),('${A}','${R2}','approved','human','owner'),('${A}','${R2}','published','system','scheduler');`;

function seededSource(name) {
  const url = createDatabase(name);
  applyBlogMigrations(url, repoRoot);
  run(url, SEED);
  return url;
}
function emptyTarget(name, { withCampaign = true, marker = true } = {}) {
  const url = createDatabase(name);
  applyBlogMigrations(url, repoRoot);
  if (marker) run(url, 'create table blog_restore_drill_target ();');
  if (withCampaign) run(url, `insert into marketing_campaigns(id,name,objective) values ('11111111-1111-4111-8111-111111111111','Fall','awareness');`);
  return url;
}

test('real Postgres: export, restore into empty DB, verify identical', { skip: !pg && 'set BLOG_TEST_PG_URL to run' }, async () => {
  const src = seededSource('blog_arch_src');
  const dir = tmp();
  const first = await exportArchive({ runTransaction: psqlExecutor(src), outDir: dir });
  assert.equal(first.manifest.tables.blog_article_revisions.rows, 3);
  const bytes1 = JSON.stringify(readArchiveDir(dir));
  await exportArchive({ runTransaction: psqlExecutor(src), outDir: dir });
  assert.equal(JSON.stringify(readArchiveDir(dir)), bytes1, 'second export is byte-identical');
  assert.ok(first.data.blog_article_revisions.some((r) => r.created_at.includes('.654321')), 'microsecond timestamps preserved');

  const dst = emptyTarget('blog_arch_dst');
  const res = await restoreArchive({ files: readArchiveDir(dir), runTransaction: psqlExecutor(dst) });
  assert.deepEqual(res.diffs, []);
  assert.deepEqual(res.report.droppedCampaignLinks, []);
  // Byte-level: re-export of the restored DB equals the original archive files.
  const dir2 = tmp();
  await exportArchive({ runTransaction: psqlExecutor(dst), outDir: dir2 });
  assert.equal(JSON.stringify(readArchiveDir(dir2)), bytes1);
  // The published article is still guarded: it points at the human-approved revision.
  assert.equal(run(dst, `select status||' '||(published_revision_id=approved_revision_id and current_revision_id=approved_revision_id) from blog_articles where slug='roth-ira'`).trim(), 'published true');
  // Audit sequence continues after restored ids.
  run(dst, `insert into blog_article_audit_log(article_id,action,actor_type,actor_id) values ('${A}','drill','system','test')`);
  // Read-only comparison mode against a matching and a drifted database.
  assert.deepEqual((await verifyAgainst({ files: readArchiveDir(dir), runTransaction: psqlExecutor(src) })).diffs, []);
  const drift = (await verifyAgainst({ files: readArchiveDir(dir), runTransaction: psqlExecutor(dst) })).diffs;
  assert.deepEqual(drift, ['blog_article_audit_log: 3 rows expected, 4 found']);
});

test('real Postgres: refuses a non-empty target and changes nothing', { skip: !pg && 'set BLOG_TEST_PG_URL to run' }, async () => {
  const src = seededSource('blog_arch_src2');
  const dir = tmp();
  await exportArchive({ runTransaction: psqlExecutor(src), outDir: dir });
  run(src, 'create table blog_restore_drill_target ();'); // pass the marker check so the emptiness check is what refuses
  await assert.rejects(restoreArchive({ files: readArchiveDir(dir), runTransaction: psqlExecutor(src) }), /already has blog data/);
  assert.equal(run(src, 'select count(*) from blog_article_revisions').trim(), '3');
});

test('real Postgres: an archive without the human approval cannot restore a published article', { skip: !pg && 'set BLOG_TEST_PG_URL to run' }, async () => {
  const src = seededSource('blog_arch_src3');
  const dir = tmp();
  const { data } = await exportArchive({ runTransaction: psqlExecutor(src), outDir: dir });
  // Forge an archive with the approval removed and a self-consistent manifest.
  const forged = buildArchiveFiles({ ...data, blog_article_approvals: data.blog_article_approvals.filter((a) => a.revoked_at) });
  const dst = emptyTarget('blog_arch_dst3');
  await assert.rejects(restoreArchive({ files: forged, runTransaction: psqlExecutor(dst) }), /no active human approval/);
  assert.equal(run(dst, 'select (select count(*) from blog_articles)+(select count(*) from blog_article_revisions)').trim(), '0', 'all-or-nothing: nothing was written');
});

test('real Postgres: missing campaign link is restored as null and reported', { skip: !pg && 'set BLOG_TEST_PG_URL to run' }, async () => {
  const src = seededSource('blog_arch_src4');
  const dir = tmp();
  await exportArchive({ runTransaction: psqlExecutor(src), outDir: dir });
  const dst = emptyTarget('blog_arch_dst4', { withCampaign: false });
  const res = await restoreArchive({ files: readArchiveDir(dir), runTransaction: psqlExecutor(dst) });
  assert.deepEqual(res.diffs, []);
  assert.deepEqual(res.report.droppedCampaignLinks.map((d) => d.article_id), [A]);
});

test('real Postgres: encrypted export -> decrypt -> restore -> identical; unchanged data is not rewritten', { skip: !pg && 'set BLOG_TEST_PG_URL to run' }, async () => {
  const src = seededSource('blog_arch_src5');
  const key = parseKey(KEY_B64);
  const dir = tmp();
  const r1 = await exportEncrypted({ runTransaction: psqlExecutor(src), outDir: dir, key });
  assert.equal(r1.changed, true);
  assert.deepEqual(fs.readdirSync(dir).sort(), [BUNDLE_FILE, HMAC_FILE].sort(), 'only the sealed bundle and its HMAC are written');
  const bundle1 = fs.readFileSync(path.join(dir, BUNDLE_FILE));
  for (const secret of ['Roth IRA', 'Impuestos', 'ai:chatgpt', 'irs.gov']) assert.ok(!bundle1.toString('latin1').includes(secret));
  const r2 = await exportEncrypted({ runTransaction: psqlExecutor(src), outDir: dir, key });
  assert.equal(r2.changed, false);
  assert.ok(fs.readFileSync(path.join(dir, BUNDLE_FILE)).equals(bundle1), 'unchanged data leaves the bundle byte-identical');
  assert.deepEqual((await verifyAgainst({ files: loadArchiveFiles(dir, KEY_B64), runTransaction: psqlExecutor(src) })).diffs, []);
  const dst = emptyTarget('blog_arch_dst5');
  const res = await restoreArchive({ files: loadArchiveFiles(dir, KEY_B64), runTransaction: psqlExecutor(dst) });
  assert.deepEqual(res.diffs, []);
  assert.throws(() => loadArchiveFiles(dir, ''), /not set/);
  run(src, `insert into blog_articles(slug,title,summary,body) values ('new','t','s','b')`);
  assert.equal((await exportEncrypted({ runTransaction: psqlExecutor(src), outDir: dir, key })).changed, true);
});

test('real Postgres: refuses an empty database without the drill marker (e.g. production before launch)', { skip: !pg && 'set BLOG_TEST_PG_URL to run' }, async () => {
  const src = seededSource('blog_arch_src6');
  const dir = tmp();
  await exportArchive({ runTransaction: psqlExecutor(src), outDir: dir });
  const dst = emptyTarget('blog_arch_dst6', { marker: false });
  await assert.rejects(restoreArchive({ files: readArchiveDir(dir), runTransaction: psqlExecutor(dst) }), /no blog_restore_drill_target/);
  assert.equal(run(dst, 'select count(*) from blog_articles').trim(), '0');
});

test('canonicalJson and tableJsonl are stable', () => {
  assert.equal(canonicalJson({ b: 1, a: { d: 2, c: [3, { f: 4, e: 5 }] } }), '{"a":{"c":[3,{"e":5,"f":4}],"d":2},"b":1}');
  assert.equal(tableJsonl([]), '');
});
