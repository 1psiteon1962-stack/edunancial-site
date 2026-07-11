#!/usr/bin/env node
// scripts/curriculum/import.mjs
// Usage: npm run curriculum:import -- <path-to-file-or-directory-or-zip>

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { randomUUID } from 'node:crypto';
import { basename, dirname, extname, join, resolve } from 'node:path';

import { checksumBuffer } from './lib/checksum.mjs';
import { assetPath, parseAssetId } from './lib/id-parser.mjs';
import { appendLedgerEntry } from './lib/ledger.mjs';
import { log } from './lib/logger.mjs';
import { IMPORTS_REPORTS_DIR, REJECTED_DIR, repoPath, STAGING_DIR, SUPERSEDED_DIR } from './lib/paths.mjs';
import { getAsset, readRegistry, upsertAsset, writeRegistry } from './lib/registry.mjs';
import { parseFrontMatter, validateAsset } from './lib/validator.mjs';
import { extractZip } from './lib/zip.mjs';

const args = process.argv.slice(2);
const inputPath = args[0];
const forceLowerVersion = args.includes('--force-lower-version');

if (!inputPath) {
  log.error('Usage: npm run curriculum:import -- <path>');
  process.exit(1);
}

const absInput = resolve(inputPath);
if (!existsSync(absInput)) {
  log.error(`Path not found: ${absInput}`);
  process.exit(1);
}

const ingestionId = randomUUID();
const ingestionTimestamp = new Date().toISOString();
const report = {
  ingestionId,
  timestamp: ingestionTimestamp,
  source: inputPath,
  results: [],
};

log.section('Curriculum Import');
log.info(`Ingestion ID: ${ingestionId}`);
log.info(`Source: ${absInput}`);

function collectMarkdownFiles(input) {
  const files = [];
  const extension = extname(input).toLowerCase();

  if (extension === '.zip') {
    log.info('Reading ZIP archive...');
    const buffer = readFileSync(input);
    const entries = extractZip(buffer);
    for (const entry of entries) {
      if (extname(entry.name).toLowerCase() === '.md') {
        files.push({
          name: basename(entry.name),
          content: entry.data.toString('utf8'),
          fromZip: true,
          zipEntry: entry.name,
        });
      }
    }
    return files;
  }

  if (extension === '.md') {
    files.push({
      name: basename(input),
      content: readFileSync(input, 'utf8'),
      fromZip: false,
      srcPath: input,
    });
    return files;
  }

  const stats = statSync(input);
  if (!stats.isDirectory()) {
    log.error(`Unsupported file type: ${extension}. Supported: .md, .zip, directory`);
    process.exit(1);
  }

  for (const entry of readdirSync(input, { withFileTypes: true })) {
    if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') {
      const fullPath = join(input, entry.name);
      files.push({
        name: entry.name,
        content: readFileSync(fullPath, 'utf8'),
        fromZip: false,
        srcPath: fullPath,
      });
    }
  }

  return files;
}

function compareVersions(a, b) {
  const parsedA = String(a).split('.').map((part) => Number.parseInt(part, 10) || 0);
  const parsedB = String(b).split('.').map((part) => Number.parseInt(part, 10) || 0);
  for (let index = 0; index < Math.max(parsedA.length, parsedB.length); index += 1) {
    const diff = (parsedA[index] || 0) - (parsedB[index] || 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

async function processFile(file) {
  const result = {
    name: file.name,
    source: file.fromZip ? `ZIP:${file.zipEntry}` : file.srcPath,
    outcome: null,
    assetId: null,
    error: null,
    warnings: [],
  };

  const meta = parseFrontMatter(file.content);
  if (!meta || !meta.id) {
    result.outcome = 'rejected';
    result.error = 'Cannot determine asset ID: missing front-matter or "id" field';
    log.error(`[REJECTED] ${file.name}: ${result.error}`);
    appendLedgerEntry({
      ingestionId,
      timestamp: ingestionTimestamp,
      operation: 'reject',
      assetId: 'UNKNOWN',
      source: result.source,
      outcome: 'rejected',
      reason: result.error,
    });
    return result;
  }

  const parsed = parseAssetId(meta.id);
  if (!parsed.valid) {
    result.outcome = 'rejected';
    result.error = `Invalid asset ID "${meta.id}": ${parsed.error}`;
    log.error(`[REJECTED] ${file.name}: ${result.error}`);
    appendLedgerEntry({
      ingestionId,
      timestamp: ingestionTimestamp,
      operation: 'reject',
      assetId: meta.id || 'INVALID',
      source: result.source,
      outcome: 'rejected',
      reason: result.error,
    });
    return result;
  }

  result.assetId = parsed.id;

  const validation = validateAsset(file.content, parsed.id);
  if (!validation.valid && validation.errors.length > 0) {
    const hasAnswerKeyViolation = validation.errors.some((error) => error.includes('ANSWER KEY VIOLATION'));
    if (hasAnswerKeyViolation) {
      result.outcome = 'rejected';
      result.error = validation.errors.join('; ');
      log.error(`[REJECTED - ANSWER KEY] ${parsed.id}: ${result.error}`);
      const rejectedPath = join(REJECTED_DIR, `${parsed.id}-${Date.now()}.md`);
      mkdirSync(REJECTED_DIR, { recursive: true });
      writeFileSync(rejectedPath, file.content, 'utf8');
      appendLedgerEntry({
        ingestionId,
        timestamp: ingestionTimestamp,
        operation: 'reject',
        assetId: parsed.id,
        assetVersion: meta.version,
        source: result.source,
        destination: rejectedPath,
        outcome: 'rejected',
        reason: result.error,
      });
      return result;
    }

    result.outcome = 'staged-with-errors';
    result.error = validation.errors.join('; ');
    result.warnings = validation.warnings;
    log.warn(`[STAGED-WITH-ERRORS] ${parsed.id}: ${result.error}`);
    const stagePath = join(STAGING_DIR, `${parsed.id}.md`);
    mkdirSync(STAGING_DIR, { recursive: true });
    writeFileSync(stagePath, file.content, 'utf8');
    appendLedgerEntry({
      ingestionId,
      timestamp: ingestionTimestamp,
      operation: 'stage',
      assetId: parsed.id,
      assetVersion: meta.version || '?',
      source: result.source,
      destination: stagePath,
      outcome: 'staged-with-errors',
      reason: result.error,
    });
    return result;
  }

  const registry = readRegistry();
  const existing = getAsset(registry, parsed.id);
  const newChecksum = checksumBuffer(Buffer.from(file.content, 'utf8'));
  const newVersion = meta.version || '1.0';

  if (existing) {
    if (existing.checksum === newChecksum) {
      result.outcome = 'duplicate-skipped';
      result.warnings.push(`Exact duplicate of existing asset ${parsed.id} — skipped`);
      log.info(`[DUPLICATE-SKIPPED] ${parsed.id}: exact content duplicate`);
      appendLedgerEntry({
        ingestionId,
        timestamp: ingestionTimestamp,
        operation: 'skip',
        assetId: parsed.id,
        assetVersion: newVersion,
        source: result.source,
        outcome: 'duplicate-skipped',
        reason: 'Exact content duplicate',
      });
      return result;
    }

    const comparison = compareVersions(newVersion, existing.version);
    if (comparison === 0) {
      result.outcome = 'conflict-blocked';
      result.error = `Same version "${newVersion}" exists with different content. Increment the version number.`;
      log.error(`[CONFLICT-BLOCKED] ${parsed.id}: ${result.error}`);
      appendLedgerEntry({
        ingestionId,
        timestamp: ingestionTimestamp,
        operation: 'conflict',
        assetId: parsed.id,
        assetVersion: newVersion,
        source: result.source,
        outcome: 'conflict-blocked',
        reason: result.error,
      });
      return result;
    }

    if (comparison < 0 && !forceLowerVersion) {
      result.outcome = 'rejected-lower-version';
      result.error = `Lower version "${newVersion}" < existing "${existing.version}". Use --force-lower-version to override.`;
      log.warn(`[REJECTED-LOWER-VERSION] ${parsed.id}: ${result.error}`);
      appendLedgerEntry({
        ingestionId,
        timestamp: ingestionTimestamp,
        operation: 'reject',
        assetId: parsed.id,
        assetVersion: newVersion,
        source: result.source,
        outcome: 'rejected-lower-version',
        reason: result.error,
      });
      return result;
    }

    log.info(`[SUPERSEDE] ${parsed.id}: v${existing.version} -> v${newVersion}`);
    const supersededPath = join(SUPERSEDED_DIR, `${parsed.id}-v${existing.version}.md`);
    mkdirSync(SUPERSEDED_DIR, { recursive: true });
    const existingPath = repoPath(existing.path);
    if (existsSync(existingPath)) {
      copyFileSync(existingPath, supersededPath);
    }

    appendLedgerEntry({
      ingestionId,
      timestamp: ingestionTimestamp,
      operation: 'supersede',
      assetId: parsed.id,
      assetVersion: existing.version,
      source: existing.path,
      destination: supersededPath,
      outcome: 'superseded',
      reason: `Superseded by v${newVersion}`,
    });
  }

  const destinationRelative = assetPath(parsed);
  const destinationAbsolute = repoPath(destinationRelative);
  mkdirSync(dirname(destinationAbsolute), { recursive: true });
  writeFileSync(destinationAbsolute, file.content, 'utf8');

  const reservedMetadataKeys = new Set([
    'id',
    'track',
    'officialTrackName',
    'level',
    'lessonNumber',
    'title',
    'version',
    'author',
    'date',
  ]);
  const metadata = Object.fromEntries(
    Object.entries(meta).filter(([key]) => !reservedMetadataKeys.has(key)),
  );

  const freshRegistry = readRegistry();
  upsertAsset(freshRegistry, parsed, {
    id: parsed.id,
    type: parsed.type,
    track: parsed.track,
    trackName: parsed.trackName,
    level: parsed.level,
    lessonNumber: parsed.type === 'lesson' ? (Number.parseInt(meta.lessonNumber, 10) || parsed.number) : undefined,
    title: meta.title || '',
    version: newVersion,
    author: meta.author || '',
    date: meta.date || '',
    path: destinationRelative,
    checksum: newChecksum,
    status: 'active',
    ingestionId,
    importedAt: ingestionTimestamp,
    validationPassed: validation.valid,
    warnings: validation.warnings,
    metadata: {
      officialTrackName: meta.officialTrackName || parsed.trackName,
      ...metadata,
    },
  });
  writeRegistry(freshRegistry);

  appendLedgerEntry({
    ingestionId,
    timestamp: ingestionTimestamp,
    operation: existing ? 'update' : 'import',
    assetId: parsed.id,
    assetVersion: newVersion,
    source: result.source,
    destination: destinationRelative,
    checksum: newChecksum,
    outcome: 'success',
  });

  result.outcome = existing ? 'updated' : 'imported';
  log.ok(`[${result.outcome.toUpperCase()}] ${parsed.id} -> ${destinationRelative}`);
  return result;
}

let files;
try {
  files = collectMarkdownFiles(absInput);
} catch (error) {
  log.error(`Failed to read input: ${error.message}`);
  process.exit(1);
}

if (files.length === 0) {
  log.warn('No markdown files found to import');
  process.exit(0);
}

log.info(`Found ${files.length} markdown file(s) to import`);

for (const file of files) {
  try {
    const result = await processFile(file);
    report.results.push(result);
  } catch (error) {
    log.error(`Unexpected error processing ${file.name}: ${error.message}`);
    report.results.push({ name: file.name, outcome: 'error', error: error.message });
  }
}

mkdirSync(IMPORTS_REPORTS_DIR, { recursive: true });
const reportMdPath = join(IMPORTS_REPORTS_DIR, `${ingestionId}.md`);
const successCount = report.results.filter((entry) => ['imported', 'updated'].includes(entry.outcome)).length;
const rejectedCount = report.results.filter((entry) => entry.outcome?.startsWith('rejected')).length;
const skippedCount = report.results.filter((entry) => entry.outcome?.includes('skip') || entry.outcome?.includes('duplicate')).length;
const errorCount = report.results.filter((entry) => ['error', 'staged-with-errors', 'conflict-blocked'].includes(entry.outcome)).length;

const resultLines = report.results.map(
  (entry) => `- **${entry.assetId || entry.name}**: \`${entry.outcome}\`${entry.error ? ` — ${entry.error}` : ''}`,
);
const reportMd = `# Import Report

**Ingestion ID:** ${ingestionId}  
**Timestamp:** ${ingestionTimestamp}  
**Source:** ${inputPath}

## Summary

| Metric | Count |
|--------|-------|
| Total files processed | ${files.length} |
| Imported/Updated | ${successCount} |
| Rejected | ${rejectedCount} |
| Skipped (duplicate) | ${skippedCount} |
| Errors/Staged | ${errorCount} |

## Results

${resultLines.join('\n')}
`;

writeFileSync(reportMdPath, reportMd, 'utf8');
log.ok(`Import report: ${reportMdPath}`);

log.section('Import Complete');
log.raw(`  Imported/Updated: ${successCount}`);
log.raw(`  Rejected:         ${rejectedCount}`);
log.raw(`  Skipped:          ${skippedCount}`);
log.raw(`  Errors/Staged:    ${errorCount}`);

if (rejectedCount > 0 || errorCount > 0) {
  process.exit(1);
}
