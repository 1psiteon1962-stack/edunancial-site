#!/usr/bin/env node
// scripts/curriculum/locate.mjs
// Usage: npm run curriculum:locate -- <asset-id>

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { checksumFile } from './lib/checksum.mjs';
import { readLedger, findByAssetId } from './lib/ledger.mjs';
import { log } from './lib/logger.mjs';
import { repoPath } from './lib/paths.mjs';
import { readRegistry, getAsset } from './lib/registry.mjs';

const args = process.argv.slice(2);
const assetId = args[0];

if (!assetId) {
  log.error('Usage: npm run curriculum:locate -- <asset-id>');
  process.exit(1);
}

log.section(`Locate: ${assetId}`);

const registry = readRegistry();
const asset = getAsset(registry, assetId);

if (!asset) {
  log.warn(`Asset "${assetId}" not found in registry`);
  const ledger = readLedger();
  const ledgerEntries = findByAssetId(ledger, assetId);
  if (ledgerEntries.length > 0) {
    log.info(`Found ${ledgerEntries.length} ledger entry/entries (asset may have been rejected or staged):`);
    for (const entry of ledgerEntries) {
      log.raw(`  [${entry.timestamp}] ${entry.operation}: ${entry.outcome} — ${entry.reason || ''}`);
    }
  } else {
    log.raw('  No ledger entries found either.');
  }
  process.exit(1);
}

const absPath = repoPath(asset.path);
const onDisk = existsSync(absPath);
const currentChecksum = onDisk ? checksumFile(absPath) : null;

let fileCommit = 'unknown';
try {
  fileCommit = execSync(`git log -1 --format="%H" -- "${asset.path}"`, { cwd: repoPath() }).toString().trim();
} catch {
  // Ignore git lookup failures.
}

const checksumMatch = currentChecksum === asset.checksum;

log.raw('');
log.raw(`  Asset ID:          ${asset.id}`);
log.raw(`  Type:              ${asset.type}`);
log.raw(`  Track:             ${asset.track} (${asset.trackName})`);
log.raw(`  Level:             ${asset.level}`);
log.raw(`  Title:             ${asset.title || 'N/A'}`);
log.raw(`  Version:           ${asset.version}`);
log.raw(`  Author:            ${asset.author || 'N/A'}`);
log.raw(`  Status:            ${asset.status}`);
log.raw(`  Path:              ${asset.path}`);
log.raw(`  On Disk:           ${onDisk ? 'YES' : 'NO ⚠️'}`);
log.raw(`  Registered CK:     ${asset.checksum}`);
log.raw(`  Disk CK:           ${currentChecksum || 'N/A'}`);
log.raw(`  Checksum Match:    ${checksumMatch ? '✅ YES' : '⚠️ NO — file modified since registration'}`);
log.raw(`  Import Timestamp:  ${asset.importedAt || 'N/A'}`);
log.raw(`  Last File Commit:  ${fileCommit}`);
log.raw(`  Ingestion ID:      ${asset.ingestionId}`);
log.raw(`  Validation Passed: ${asset.validationPassed ? '✅ YES' : '❌ NO'}`);
log.raw('');
