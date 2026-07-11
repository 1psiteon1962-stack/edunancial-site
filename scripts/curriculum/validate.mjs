#!/usr/bin/env node
// scripts/curriculum/validate.mjs
// Validates all registered curriculum assets.
// Exit 0 = all pass. Exit 1 = failures.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { checksumFile } from './lib/checksum.mjs';
import { log } from './lib/logger.mjs';
import { repoPath, REPORTS_DIR } from './lib/paths.mjs';
import { listAllAssets, readRegistry } from './lib/registry.mjs';
import { validateAsset } from './lib/validator.mjs';

log.section('Curriculum Validator');

const registry = readRegistry();
const assets = listAllAssets(registry);

if (assets.length === 0) {
  log.warn('No assets registered. Run `npm run curriculum:import` to add curriculum files.');
  process.exit(0);
}

log.info(`Validating ${assets.length} registered asset(s)...`);

const results = [];
let failCount = 0;
let passCount = 0;

for (const asset of assets) {
  const absPath = repoPath(asset.path);
  const result = { assetId: asset.assetId, path: asset.path, errors: [], warnings: [] };

  if (!existsSync(absPath)) {
    result.errors.push(`File not found on disk: ${asset.path}`);
    results.push(result);
    failCount += 1;
    log.error(`[FAIL] ${asset.assetId}: file not found`);
    continue;
  }

  const content = readFileSync(absPath, 'utf8');
  const currentChecksum = checksumFile(absPath);
  if (asset.checksum && currentChecksum !== asset.checksum) {
    result.warnings.push(`Checksum mismatch: registry=${asset.checksum} disk=${currentChecksum}`);
  }

  const validation = validateAsset(content, asset.assetId);
  result.errors.push(...validation.errors);
  result.warnings.push(...validation.warnings);
  results.push(result);

  if (result.errors.length > 0) {
    failCount += 1;
    log.error(`[FAIL] ${asset.assetId}: ${result.errors.length} error(s)`);
    for (const error of result.errors) {
      log.error(`       - ${error}`);
    }
  } else {
    passCount += 1;
    log.ok(`[PASS] ${asset.assetId}`);
    for (const warning of result.warnings) {
      log.warn(`       - ${warning}`);
    }
  }
}

mkdirSync(REPORTS_DIR, { recursive: true });
const timestamp = new Date().toISOString();
const jsonReport = {
  timestamp,
  totalAssets: assets.length,
  passed: passCount,
  failed: failCount,
  results,
};
const jsonPath = join(REPORTS_DIR, 'CURRICULUM-VALIDATION.json');
writeFileSync(jsonPath, `${JSON.stringify(jsonReport, null, 2)}\n`, 'utf8');

const mdLines = [
  '# Curriculum Validation Report',
  '',
  `**Generated:** ${timestamp}`,
  `**Total Assets:** ${assets.length}`,
  `**Passed:** ${passCount}`,
  `**Failed:** ${failCount}`,
  '',
  '## Results',
  '',
];

for (const result of results) {
  const status = result.errors.length === 0 ? '✅ PASS' : '❌ FAIL';
  mdLines.push(`### ${result.assetId} — ${status}`);
  mdLines.push(`Path: \`${result.path}\``);
  if (result.errors.length > 0) {
    mdLines.push('**Errors:**');
    for (const error of result.errors) {
      mdLines.push(`- ${error}`);
    }
  }
  if (result.warnings.length > 0) {
    mdLines.push('**Warnings:**');
    for (const warning of result.warnings) {
      mdLines.push(`- ${warning}`);
    }
  }
  mdLines.push('');
}

const mdPath = join(REPORTS_DIR, 'CURRICULUM-VALIDATION.md');
writeFileSync(mdPath, `${mdLines.join('\n')}\n`, 'utf8');

log.section('Validation Summary');
log.raw(`  Passed: ${passCount} / ${assets.length}`);
log.raw(`  Failed: ${failCount} / ${assets.length}`);
log.raw(`  Report: ${mdPath}`);

if (failCount > 0) {
  log.error(`Validation failed: ${failCount} asset(s) have errors`);
  process.exit(1);
}

log.ok('All curriculum assets passed validation');
