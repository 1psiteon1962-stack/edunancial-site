import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

// Q3 contract: malformed finalize requests are deterministic client errors,
// never retryable infrastructure failures. These assertions intentionally
// fail until the finalize endpoint implements the contract.
const source = readFileSync(resolve('src/app/api/admin/content/upload/finalize/route.ts'), 'utf8');

test('Q3: finalize validates JSON object before accessing batchId', () => {
  assert.match(source, /body\s*===\s*null|!body\s*\|\||typeof body\s*!==\s*["']object["']/);
});

test('Q3: empty batchId returns HTTP 400 without retry', () => {
  assert.match(source, /batchId[^\n]{0,180}status:\s*400/);
});

test('Q3: zero or multiple uploads return HTTP 400, not 422', () => {
  assert.match(source, /uploads\.length\s*!==\s*1[^\n]{0,260}retryable:\s*false[^\n]{0,100}status:\s*400/);
});
