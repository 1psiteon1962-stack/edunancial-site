// Blog archive and restore core (PR-6). Pure logic plus SQL builders; no I/O
// and no driver. export-archive.mjs and restore-from-archive.mjs supply a
// `runTransaction(queries, { readOnly })` executor.
//
// Source of truth for blog content is Neon (blog_* tables). The archive is a
// BACKUP ONLY: the site never reads it, and restore only ever writes to an
// empty, explicitly confirmed, non-production database.
import { createHash } from 'node:crypto';

export const ARCHIVE_SCHEMA_VERSION = 1;

// Restore order respects foreign keys. Every row is exported with to_jsonb so
// Postgres itself serializes it (full timestamp precision, every column, any
// column added later) and restored with jsonb_populate_record, its inverse.
export const TABLES = [
  { name: 'blog_articles', order: 'id' },
  { name: 'blog_article_revisions', order: 'id' },
  { name: 'blog_article_approvals', order: 'id' },
  { name: 'blog_article_audit_log', order: 'id' },
];
const TABLE_NAMES = new Set(TABLES.map((t) => t.name));

// Columns on blog_articles that point at other rows, set only after those rows exist.
export const ARTICLE_DEFERRED = ['current_revision_id', 'approved_revision_id', 'published_revision_id'];

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = canonicalize(value[k]);
    return out;
  }
  return value;
}
export const canonicalJson = (v) => JSON.stringify(canonicalize(v));
export const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

export function revisionContentSha(rev) {
  const { title, summary, body, author, seo_title, seo_description, sources } = rev;
  return sha256(canonicalJson({ title, summary, body, author, seo_title, seo_description, sources }));
}

export function tableJsonl(rows) {
  const sorted = [...rows].sort((a, b) => cmpId(a.id, b.id));
  return sorted.map((r) => canonicalJson(r)).join('\n') + (sorted.length ? '\n' : '');
}
function cmpId(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
}

// The manifest is deterministic (no timestamp), so an unchanged database
// produces a byte-identical archive and the nightly job commits nothing.
export function buildManifest(data) {
  const tables = {};
  for (const { name } of TABLES) {
    const rows = data[name] || [];
    tables[name] = { rows: rows.length, sha256: sha256(tableJsonl(rows)) };
  }
  const revisions = {};
  for (const r of [...(data.blog_article_revisions || [])].sort((a, b) => cmpId(a.id, b.id))) {
    revisions[r.id] = revisionContentSha(r);
  }
  return { schema: ARCHIVE_SCHEMA_VERSION, tables, revisions };
}

const safeSeg = (s) => String(s ?? 'unknown').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'unknown';

export function revisionMarkdown(rev, article) {
  const front = {
    article_id: rev.article_id, revision_id: rev.id, version: rev.version,
    slug: article?.slug ?? null, locale: article?.locale ?? null, track: article?.track ?? null,
    status_at_export: article?.status ?? null,
    is_current: article?.current_revision_id === rev.id,
    is_approved: article?.approved_revision_id === rev.id,
    is_published: article?.published_revision_id === rev.id,
    author: rev.author, created_by: rev.created_by, created_at: rev.created_at,
    seo_title: rev.seo_title ?? null, seo_description: rev.seo_description ?? null,
    content_sha256: revisionContentSha(rev),
  };
  const lines = ['---', ...Object.entries(front).map(([k, v]) => `${k}: ${JSON.stringify(v)}`), '---', '',
    `# ${rev.title}`, '', rev.summary, '', rev.body.replace(/\s+$/, ''), ''];
  const srcs = Array.isArray(rev.sources) ? rev.sources : [];
  if (srcs.length) lines.push('## Sources', '', ...srcs.map((s, i) => `${i + 1}. ${typeof s === 'string' ? s : canonicalJson(s)}`), '');
  lines.push('<!-- Backup copy only. Neon is the source of truth. Restore with scripts/blog/restore-from-archive.mjs. -->', '');
  return lines.join('\n');
}

// Returns { path: content } for the whole archive.
export function buildArchiveFiles(data) {
  for (const k of Object.keys(data)) if (!TABLE_NAMES.has(k)) throw new Error(`Unexpected table in export: ${k}`);
  const files = {};
  for (const { name } of TABLES) files[`data/${name}.jsonl`] = tableJsonl(data[name] || []);
  const byId = new Map((data.blog_articles || []).map((a) => [a.id, a]));
  for (const rev of data.blog_article_revisions || []) {
    const a = byId.get(rev.article_id);
    const p = `markdown/${safeSeg(a?.locale)}/${safeSeg(a?.slug || rev.article_id)}/v${String(rev.version).padStart(4, '0')}-${String(rev.id).slice(0, 8)}.md`;
    files[p] = revisionMarkdown(rev, a);
  }
  const manifest = buildManifest(data);
  files['MANIFEST.json'] = JSON.stringify(manifest, null, 2) + '\n';
  files['README.md'] = [
    '# Edunancial blog archive (backup only)', '',
    'Nightly export of the Neon blog tables by .github/workflows/blog-archive.yml.',
    'Neon is the source of truth. The website never reads this branch, and it is never merged into main.', '',
    '| Table | Rows |', '|---|---|',
    ...TABLES.map(({ name }) => `| ${name} | ${manifest.tables[name].rows} |`), '',
    'Restore procedure: docs/BLOG-OPERATIONS.md on main.', '',
  ].join('\n');
  return files;
}

export function parseArchive(files) {
  if (!files['MANIFEST.json']) throw new Error('Archive has no MANIFEST.json');
  const manifest = JSON.parse(files['MANIFEST.json']);
  if (manifest.schema !== ARCHIVE_SCHEMA_VERSION) throw new Error(`Unsupported archive schema ${manifest.schema}`);
  const data = {};
  for (const { name } of TABLES) {
    const text = files[`data/${name}.jsonl`];
    if (text == null) throw new Error(`Archive is missing data/${name}.jsonl`);
    data[name] = text.split('\n').filter(Boolean).map((l, i) => {
      try { return JSON.parse(l); } catch { throw new Error(`data/${name}.jsonl line ${i + 1} is not valid JSON`); }
    });
  }
  return { manifest, data };
}

// Compare two manifests. Returns a list of human-readable differences (empty = identical).
export function compareManifests(expected, actual, { ignoreTables = [] } = {}) {
  const diffs = [];
  for (const { name } of TABLES) {
    if (ignoreTables.includes(name)) continue;
    const e = expected.tables?.[name], a = actual.tables?.[name];
    if (!e || !a) { diffs.push(`${name}: missing from ${e ? 'actual' : 'expected'}`); continue; }
    if (e.rows !== a.rows) diffs.push(`${name}: ${e.rows} rows expected, ${a.rows} found`);
    else if (e.sha256 !== a.sha256) diffs.push(`${name}: same row count but content differs`);
  }
  for (const [id, sha] of Object.entries(expected.revisions || {})) {
    const got = actual.revisions?.[id];
    if (!got) diffs.push(`revision ${id}: missing`);
    else if (got !== sha) diffs.push(`revision ${id}: content_sha256 differs`);
  }
  for (const id of Object.keys(actual.revisions || {})) if (!expected.revisions?.[id]) diffs.push(`revision ${id}: unexpected extra revision`);
  return diffs;
}

// ---------- SQL ----------
const q = (text, params = []) => ({ text, params });

export function exportQueries() {
  // Every SELECT returns one jsonb column named r.
  return [q(`set local time zone 'UTC'`),
    ...TABLES.map(({ name, order }) => q(`select to_jsonb(t) as r from ${name} t order by t.${order}`))];
}
export function rowsFromExportResults(results) {
  const data = {};
  TABLES.forEach(({ name }, i) => { data[name] = (results[i + 1] || []).map((row) => row.r); });
  return data;
}

// A restore target must carry this table, created by hand in the drill branch
// (create table blog_restore_drill_target ();). Production never has it, so even
// an empty production database (e.g. before launch) is refused.
export const DRILL_MARKER_TABLE = 'blog_restore_drill_target';
export function drillMarkerQuery() {
  return q(`select to_jsonb(to_regclass('public.${DRILL_MARKER_TABLE}') is not null) as r`);
}

export function emptinessQuery() {
  return q(`select jsonb_build_object(${TABLES.map(({ name }) => `'${name}', (select count(*) from ${name})`).join(', ')}) as r`);
}

// Builds the single restore transaction. Articles are inserted as drafts with
// their revision pointers empty, because the publication guard trigger refuses
// approved/scheduled/published rows until the exact approved revision and its
// active human approval exist. Pointers and status are then set in a second
// pass, so the trigger re-checks every published article during restore.
export function restoreQueries(data, { existingCampaignIds = new Set() } = {}) {
  const queries = [q(`set local time zone 'UTC'`)];
  const report = { droppedCampaignLinks: [] };
  for (const a of data.blog_articles) {
    const row = { ...a, status: 'draft' };
    for (const c of ARTICLE_DEFERRED) row[c] = null;
    if (row.marketing_campaign_id && !existingCampaignIds.has(row.marketing_campaign_id)) {
      report.droppedCampaignLinks.push({ article_id: a.id, marketing_campaign_id: row.marketing_campaign_id });
      row.marketing_campaign_id = null;
    }
    queries.push(q(`insert into blog_articles select * from jsonb_populate_record(null::blog_articles, $1::jsonb)`, [JSON.stringify(row)]));
  }
  for (const name of ['blog_article_revisions', 'blog_article_approvals', 'blog_article_audit_log']) {
    for (const r of data[name]) queries.push(q(`insert into ${name} select * from jsonb_populate_record(null::${name}, $1::jsonb)`, [JSON.stringify(r)]));
  }
  for (const a of data.blog_articles) {
    queries.push(q(
      `update blog_articles b set current_revision_id = s.current_revision_id, approved_revision_id = s.approved_revision_id,
         published_revision_id = s.published_revision_id, status = s.status, updated_at = s.updated_at
       from jsonb_populate_record(null::blog_articles, $1::jsonb) s where b.id = s.id`,
      [JSON.stringify({ id: a.id, current_revision_id: a.current_revision_id ?? null, approved_revision_id: a.approved_revision_id ?? null,
        published_revision_id: a.published_revision_id ?? null, status: a.status, updated_at: a.updated_at })]));
  }
  queries.push(q(`select setval(pg_get_serial_sequence('blog_article_audit_log','id'), greatest((select coalesce(max(id),0) from blog_article_audit_log),1), (select count(*) > 0 from blog_article_audit_log))`));
  return { queries, report };
}

// Neon endpoint identity: the same compute is reachable as ep-x.region... and
// ep-x-pooler.region..., so "-pooler" is stripped before comparing. Distinct
// Neon branches have distinct endpoints, so a branch never matches production.
export function databaseIdentity(url) {
  let u;
  try { u = new URL(url); } catch { throw new Error('Database URL is not a valid URL'); }
  const host = u.hostname.toLowerCase().replace(/^([^.]+)-pooler\./, '$1.');
  return `${host}/${u.pathname.replace(/^\//, '') || 'postgres'}`;
}
export function assertRestoreTargetAllowed({ targetUrl, protectedUrls, confirmHost }) {
  if (!targetUrl) throw new Error('BLOG_RESTORE_DATABASE_URL is not set.');
  const known = protectedUrls.map((p) => p?.trim()).filter(Boolean);
  // Fail closed: with no production URL to compare against, "not production" cannot be proven.
  if (!known.length) throw new Error('Refusing to restore: no protected production URL is configured (BLOG_ARCHIVE_DATABASE_URL or BLOG_PRODUCTION_DATABASE_URL), so the target cannot be proven non-production.');
  const target = databaseIdentity(targetUrl);
  for (const p of known) {
    if (databaseIdentity(p) === target) throw new Error('Refusing to restore: the target is a protected (production/archive source) database.');
  }
  const host = new URL(targetUrl).hostname.toLowerCase();
  if (!confirmHost || confirmHost.toLowerCase() !== host) {
    throw new Error(`Refusing to restore without --confirm-target=${host} (the target database host).`);
  }
  return host;
}
