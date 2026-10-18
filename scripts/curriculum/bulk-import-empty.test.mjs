import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

const importer = resolve('scripts/curriculum/bulk-import.mjs');

test('bulk import rejects empty nested directories without reporting success', () => {
  const directory = mkdtempSync(join(tmpdir(), 'edunancial-empty-bulk-'));
  try {
    mkdirSync(join(directory, 'nested', 'deeper'), { recursive: true });
    const result = spawnSync(process.execPath, [importer, directory], {
      cwd: process.cwd(), encoding: 'utf8', timeout: 15000,
    });
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, /no markdown files found recursively/i);
    assert.match(result.stderr, /No lessons were imported/i);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('bulk import rejects directories containing only non-Markdown files', () => {
  const directory = mkdtempSync(join(tmpdir(), 'edunancial-nonmarkdown-bulk-'));
  try {
    mkdirSync(join(directory, 'nested'), { recursive: true });
    writeFileSync(join(directory, 'nested', 'readme.txt'), 'Not a curriculum lesson');
    const result = spawnSync(process.execPath, [importer, directory], {
      cwd: process.cwd(), encoding: 'utf8', timeout: 15000,
    });
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, /no markdown files found recursively/i);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
