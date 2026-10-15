import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const file = new URL('../production-audit.mjs', import.meta.url);
const source = readFileSync(file, 'utf8');
const start = source.indexOf('async function call(query) {');
const end = source.indexOf('\nasync function main()', start);
assert.ok(start >= 0 && end > start, 'audit HTTP call routine found');
const callCode = source.slice(start, end);

function createCaller(fetcher) {
  return new Function('base', 'headers', 'fetch', `${callCode}\nreturn call;`)(
    'https://edunancial.test', () => ({ accept: 'application/json' }), fetcher,
  );
}

for (const status of [500, 502, 503, 504, 429]) {
  test(`HTTP ${status} fails once instead of repeating expensive live curriculum scans`, async () => {
    let calls = 0;
    const client = createCaller(async () => {
      calls++;
      return { ok: false, status, text: async () => 'error' };
    });
    await assert.rejects(client({ tracks: 'RED', levels: '1', locales: 'es-Caribbean' }), new RegExp(String(status)));
    assert.equal(calls, 1);
  });
}

test('an authorized healthy response is parsed without changing payload', async () => {
  let calls = 0;
  const body = { coordinates: [{ track: 'RED', runtimeStatus: 'FAIL' }] };
  const client = createCaller(async () => {
    calls++;
    return { ok: true, status: 200, json: async () => body };
  });
  assert.deepEqual(await client({ tracks: 'RED' }), body);
  assert.equal(calls, 1);
});

test('unauthorized API response is fatal on first attempt', async () => {
  let calls = 0;
  const client = createCaller(async () => {
    calls++;
    return { ok: false, status: 401, text: async () => 'bad token' };
  });
  await assert.rejects(client({ tracks: 'RED' }), /401 Unauthorized/);
  assert.equal(calls, 1);
});
