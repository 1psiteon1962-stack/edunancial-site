import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

// Q3 acceptance gate for the upload finalization endpoint. Execute with:
// node --test scripts/curriculum/q3-finalize-validation-contract.test.mjs
// This is a source-level guard; full HTTP integration coverage is still needed.
const source = readFileSync(resolve('src/app/api/admin/content/upload/finalize/route.ts'), 'utf8');
const post = source.slice(source.indexOf('export async function POST('));
const beforeSideEffects = post.split('const configFormData = new FormData();')[0];

test('Q3: malformed JSON root is rejected before accessing batchId', () => {
  assert.match(beforeSideEffects, /(?:typeof\s+body\s*!==\s*["']object["']|body\s*===\s*null|!body\s*\|\|)/,
    'POST must explicitly reject null, arrays, and primitive JSON bodies');
});

test('Q3: missing or blank batchId returns HTTP 400 nonretryable', () => {
  assert.match(beforeSideEffects, /if\s*\(\s*!batchId\s*\)[\s\S]{0,300}status:\s*400/,
    'missing batchId must return HTTP 400 rather than throwing into the 503 handler');
  assert.match(beforeSideEffects, /if\s*\(\s*!batchId\s*\)[\s\S]{0,300}retryable:\s*false/,
    'missing batchId must be nonretryable');
});

test('Q3: zero or multiple uploads return HTTP 400 nonretryable', () => {
  const line = beforeSideEffects.split('\n').find((s) => s.includes('body.uploads.length !== 1'));
  assert.ok(line, 'exactly-one-upload guard is required');
  assert.match(line, /status:\s*400/, 'invalid upload count is a client error');
  assert.match(line, /retryable:\s*false/, 'invalid upload count is nonretryable');
});
