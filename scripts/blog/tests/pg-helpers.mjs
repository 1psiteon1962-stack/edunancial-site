// Test-only executor that runs the same { text, params } queries through psql
// against a real Postgres, in one transaction, so restore SQL and the real
// blog migrations (including the publication guard trigger) are exercised.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const PG_ADMIN_URL = process.env.BLOG_TEST_PG_URL || '';

const lit = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);

function psql(url, script) {
  const r = spawnSync('psql', [url, '-X', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1'], { input: script, encoding: 'utf8' });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`psql failed: ${r.stderr.trim()}`);
  return r.stdout;
}

export function psqlExecutor(url) {
  return async function runTransaction(queries, { readOnly = false } = {}) {
    let script = readOnly ? 'begin transaction read only;\n' : 'begin;\n';
    queries.forEach((qq, i) => {
      const text = qq.text.replace(/\$(\d+)/g, (_, n) => lit(qq.params[Number(n) - 1]));
      script += `\\echo __Q${i}__\n${text};\n`;
    });
    script += 'commit;\n';
    const out = psql(url, script);
    const results = queries.map(() => []);
    let cur = -1;
    for (const line of out.split('\n')) {
      const m = /^__Q(\d+)__$/.exec(line);
      if (m) { cur = Number(m[1]); continue; }
      if (cur < 0 || line === '') continue;
      try { results[cur].push({ r: JSON.parse(line) }); } catch { /* non-JSON output (setval etc.) */ }
    }
    return results;
  };
}

export function createDatabase(name) {
  psql(PG_ADMIN_URL, `drop database if exists ${name}; create database ${name};`);
  const u = new URL(PG_ADMIN_URL); u.pathname = `/${name}`;
  return u.toString();
}

export function applyBlogMigrations(url, repoRoot) {
  for (const f of ['20260927_ai_marketing_foundation.sql', '20260927_blog_marketing.sql', '20261012_blog_v2_schema.sql']) {
    psql(url, fs.readFileSync(path.join(repoRoot, 'db/neon', f), 'utf8'));
  }
}

export const run = (url, sql) => psql(url, sql);

export function pgAvailable() {
  if (!PG_ADMIN_URL) return false;
  const r = spawnSync('psql', [PG_ADMIN_URL, '-X', '-c', 'select 1'], { encoding: 'utf8' });
  return r.status === 0;
}
