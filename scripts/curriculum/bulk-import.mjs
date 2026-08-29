#!/usr/bin/env node
// Recursively stages nested curriculum folders, then delegates validation,
// versioning, ledger updates, localization handling, and reports to import.mjs.
// Usage: npm run curriculum:bulk-import -- <path-to-file-or-directory-or-zip> [--force-lower-version]

import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const inputPath = args[0];
const passthroughArgs = args.slice(1);

if (!inputPath) {
  console.error('Usage: npm run curriculum:bulk-import -- <path> [--force-lower-version]');
  process.exit(1);
}

const absoluteInput = resolve(inputPath);
if (!existsSync(absoluteInput)) {
  console.error(`Path not found: ${absoluteInput}`);
  process.exit(1);
}

function collectMarkdownFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectMarkdownFiles(fullPath));
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') files.push(fullPath);
  }
  return files;
}

function runImporter(source) {
  const importer = resolve('scripts/curriculum/import.mjs');
  const result = spawnSync(process.execPath, [importer, source, ...passthroughArgs], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

const extension = extname(absoluteInput).toLowerCase();
if (extension === '.md' || extension === '.zip' || !statSync(absoluteInput).isDirectory()) {
  process.exit(runImporter(absoluteInput));
}

const markdownFiles = collectMarkdownFiles(absoluteInput);
if (markdownFiles.length === 0) {
  console.warn(`No markdown files found recursively under ${absoluteInput}`);
  process.exit(0);
}

const stagingDirectory = mkdtempSync(join(tmpdir(), 'edunancial-curriculum-bulk-'));
const seenNames = new Map();

try {
  for (const source of markdownFiles) {
    const fileName = basename(source);
    const prior = seenNames.get(fileName);
    if (prior) {
      console.error(`Duplicate filename in nested bulk import: ${fileName}`);
      console.error(`  First:  ${prior}`);
      console.error(`  Second: ${source}`);
      console.error('Rename one file so every canonical/localized lesson filename is unique before importing.');
      process.exitCode = 1;
      break;
    }
    seenNames.set(fileName, source);
    cpSync(source, join(stagingDirectory, fileName));
  }

  if (!process.exitCode) {
    console.log(`Discovered ${markdownFiles.length} markdown file(s) recursively under ${absoluteInput}`);
    process.exitCode = runImporter(stagingDirectory);
  }
} finally {
  rmSync(stagingDirectory, { recursive: true, force: true });
}
