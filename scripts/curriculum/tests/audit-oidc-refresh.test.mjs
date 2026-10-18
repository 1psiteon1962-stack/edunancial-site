import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve('scripts/curriculum/production-audit.mjs'), 'utf8');

test('audit refreshes OIDC tokens well inside their lifetime', () => {
  const minutes = Number(source.match(/const OIDC_REFRESH_MS = (\d+) \* 60_000;/u)?.[1]);
  assert.ok(minutes > 0 && minutes <= 2, `refresh interval must be at most 2 minutes, got ${minutes}`);
});

test('a 401 retries exactly once with a fresh token, then fails the coordinate', () => {
  const block = source.slice(source.indexOf('if (response.status === 401) {'), source.indexOf('if (!response.ok) {'));
  assert.match(block, /if \(oidcCache && attempt === 0\) \{ oidcCache = null; return call\(query, 1\); \}/u);
  assert.match(block, /throw new Error\("401 Unauthorized/u, 'a repeated 401 must still fail');
});
