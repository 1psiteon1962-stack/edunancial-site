#!/usr/bin/env node
// scripts/curriculum/validate.mjs
// Validates all registered curriculum assets.
// Exit 0 = all pass. Exit 1 = failures.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

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
let localizedFileCount = 0;

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontMatter: {}, body: content };
  const frontMatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key) frontMatter[key] = value;
  }
  return { frontMatter, body: match[2] };
}

function missingLocalizedFields(frontMatter, body) {
  const missing = [];
  if (!(frontMatter.id ?? '').trim()) missing.push('id');
  if (!(frontMatter.track ?? '').trim()) missing.push('track');
  if (!(frontMatter.level ?? '').trim()) missing.push('level');
  if (!(frontMatter.lessonNumber ?? '').trim()) missing.push('lessonNumber');
  if (!(frontMatter.title ?? '').trim()) missing.push('title');
  if (!(frontMatter.summary ?? '').trim()) missing.push('summary');
  if (!body.trim()) missing.push('body');
  return missing;
}

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

  const canonicalName = basename(absPath).replace(/\.md$/u, '');
  const siblingDir = dirname(absPath);
  const localizedFiles = readdirSync(siblingDir)
    .filter((name) => name !== `${canonicalName}.md`)
    .filter((name) => name.startsWith(`${canonicalName}.`) && name.endsWith('.md'));

  for (const localizedFile of localizedFiles) {
    localizedFileCount += 1;
    const localizedPath = join(siblingDir, localizedFile);
    const localizedContent = readFileSync(localizedPath, 'utf8');
    const localizedParsed = parseFrontMatter(localizedContent);
    const missingFields = missingLocalizedFields(localizedParsed.frontMatter, localizedParsed.body);
    const localizedErrors = [];
    if ((localizedParsed.frontMatter.id ?? '').trim() !== asset.assetId) {
      localizedErrors.push(`Localized lesson id must remain canonical: expected ${asset.assetId}`);
    }
    if (missingFields.length > 0) {
      localizedErrors.push(`Localized lesson is incomplete: missing ${missingFields.join(', ')}`);
    }
    const localizedResult = {
      assetId: `${asset.assetId}:${localizedFile}`,
      path: localizedPath.replace(`${process.cwd()}/`, ''),
      errors: localizedErrors,
      warnings: [],
    };
    results.push(localizedResult);
    if (localizedErrors.length > 0) {
      failCount += 1;
      log.error(`[FAIL] ${localizedResult.assetId}: ${localizedErrors.length} error(s)`);
      for (const error of localizedErrors) {
        log.error(`       - ${error}`);
      }
    } else {
      passCount += 1;
      log.ok(`[PASS] ${localizedResult.assetId}`);
    }
  }
}

mkdirSync(REPORTS_DIR, { recursive: true });
const timestamp = new Date().toISOString();
const jsonReport = {
  timestamp,
  totalAssets: assets.length,
  localizedFiles: localizedFileCount,
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
  `**Localized Files Audited:** ${localizedFileCount}`,
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
log.raw(`  Passed: ${passCount}`);
log.raw(`  Failed: ${failCount}`);
log.raw(`  Localized files audited: ${localizedFileCount}`);
log.raw(`  Report: ${mdPath}`);

if (failCount > 0) {
  log.error(`Validation failed: ${failCount} asset(s) have errors`);
  process.exit(1);
}

log.ok('All curriculum assets passed validation');
