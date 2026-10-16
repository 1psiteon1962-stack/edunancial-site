import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve('scripts/curriculum/production-audit.mjs');

test('timed-out production request is recorded as FAIL, never an empty success', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'curriculum-audit-timeout-'));
  try {
    const preload = join(tmp, 'preload.mjs');
    writeFileSync(preload, `
      AbortSignal.timeout = (milliseconds) => {
        if (milliseconds !== 45000) throw new Error('missing 45s request deadline');
        return AbortSignal.abort(new Error('simulated request deadline'));
      };
      globalThis.fetch = async (_url, options) => {
        if (!options?.signal?.aborted) throw new Error('missing abort signal');
        throw options.signal.reason;
      };
    `);
    const out = join(tmp, 'report');
    const child = spawnSync(process.execPath,
      ['--import', preload, script, '--tracks', 'RED', '--levels', '1', '--locales', 'en-US', '--out', out],
      { encoding: 'utf8', timeout: 5000 });
    assert.equal(child.error, undefined);
    assert.equal(child.status, 1, child.stderr);
    const report = JSON.parse(readFileSync(join(out, 'audit-full.json'), 'utf8'));
    assert.equal(report.results.length, 1);
    assert.equal(report.results[0].runtimeStatus, 'FAIL');
    assert.match(report.results[0].auditError, /simulated request deadline/);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
