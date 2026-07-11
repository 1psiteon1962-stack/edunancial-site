#!/usr/bin/env node
// scripts/curriculum/audit.mjs
// Audits filesystem vs registry, detects orphans, bad paths, duplicates, etc.

import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { checksumFile } from './lib/checksum.mjs';
import { assetPath, parseAssetId } from './lib/id-parser.mjs';
import { log } from './lib/logger.mjs';
import { CONTENT_CURRICULUM_ROOT, repoPath, REPORTS_DIR } from './lib/paths.mjs';
import { listAllAssets, readRegistry } from './lib/registry.mjs';

log.section('Curriculum Auditor');

const currentCommit = 'deterministic';

const registry = readRegistry();
const registeredAssets = listAllAssets(registry);
const registeredIds = new Set(registeredAssets.map((asset) => asset.assetId));

const issues = {
  orphanFiles: [],
  missingFiles: [],
  checksumMismatches: [],
  duplicateIds: [],
  badPaths: [],
  legacyIdFiles: [],
  manifestMismatches: [],
  brokenReferences: [],
};

const seenIds = new Map();
for (const asset of registeredAssets) {
  if (seenIds.has(asset.assetId)) {
    issues.duplicateIds.push({ id: asset.assetId, paths: [seenIds.get(asset.assetId), asset.path] });
  } else {
    seenIds.set(asset.assetId, asset.path);
  }

  const absPath = repoPath(asset.path);
  if (!existsSync(absPath)) {
    issues.missingFiles.push({ id: asset.assetId, registeredPath: asset.path });
    log.warn(`[MISSING FILE] ${asset.assetId}: ${asset.path}`);
    continue;
  }

  const diskChecksum = checksumFile(absPath);
  if (asset.checksum && diskChecksum !== asset.checksum) {
    issues.checksumMismatches.push({
      id: asset.assetId,
      path: asset.path,
      expected: asset.checksum,
      actual: diskChecksum,
    });
    log.warn(`[CHECKSUM MISMATCH] ${asset.assetId}`);
  }

  const parsed = parseAssetId(asset.assetId);
  if (parsed.valid) {
    const canonical = assetPath(parsed);
    if (asset.path !== canonical) {
      issues.badPaths.push({ id: asset.assetId, registered: asset.path, canonical });
      log.warn(`[BAD PATH] ${asset.assetId}: registered="${asset.path}" canonical="${canonical}"`);
    }
  }
}

function scanDir(dir) {
  if (!existsSync(dir)) {
    return;
  }
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      scanDir(fullPath);
      continue;
    }
    if (!entry.endsWith('.md')) {
      continue;
    }
    const relPath = relative(repoPath(), fullPath);
    const idCandidate = entry.replace(/\.md$/, '');
    const parsed = parseAssetId(idCandidate);
    if (parsed.valid && !registeredIds.has(idCandidate)) {
      issues.orphanFiles.push({ path: relPath, candidateId: idCandidate });
      log.warn(`[ORPHAN] ${relPath} (ID ${idCandidate} not in registry)`);
    }
  }
}

scanDir(CONTENT_CURRICULUM_ROOT);

mkdirSync(REPORTS_DIR, { recursive: true });
const timestamp = 'deterministic';
const totalIssues = Object.values(issues).reduce((sum, list) => sum + list.length, 0);

const jsonReport = {
  timestamp,
  commit: currentCommit,
  registeredAssets: registeredAssets.length,
  totalIssues,
  issues,
};
const jsonPath = join(REPORTS_DIR, 'CURRICULUM-AUDIT.json');
writeFileSync(jsonPath, `${JSON.stringify(jsonReport, null, 2)}\n`, 'utf8');

const mdLines = [
  '# Curriculum Audit Report',
  '',
  `**Generated:** ${timestamp}`,
  `**Commit:** \`${currentCommit}\``,
  `**Registered Assets:** ${registeredAssets.length}`,
  `**Total Issues:** ${totalIssues}`,
  '',
];

if (issues.orphanFiles.length > 0) {
  mdLines.push('## Orphan Files (on disk, not in registry)');
  for (const item of issues.orphanFiles) {
    mdLines.push(`- \`${item.path}\` (candidate ID: ${item.candidateId})`);
  }
  mdLines.push('');
}
if (issues.missingFiles.length > 0) {
  mdLines.push('## Missing Files (in registry, not on disk)');
  for (const item of issues.missingFiles) {
    mdLines.push(`- ${item.id}: \`${item.registeredPath}\``);
  }
  mdLines.push('');
}
if (issues.checksumMismatches.length > 0) {
  mdLines.push('## Checksum Mismatches');
  for (const item of issues.checksumMismatches) {
    mdLines.push(`- ${item.id}: \`${item.path}\``);
  }
  mdLines.push('');
}
if (issues.duplicateIds.length > 0) {
  mdLines.push('## Duplicate IDs in Registry');
  for (const item of issues.duplicateIds) {
    mdLines.push(`- ${item.id}: ${item.paths.join(', ')}`);
  }
  mdLines.push('');
}
if (issues.badPaths.length > 0) {
  mdLines.push('## Non-canonical Paths');
  for (const item of issues.badPaths) {
    mdLines.push(`- ${item.id}: registered=\`${item.registered}\` canonical=\`${item.canonical}\``);
  }
  mdLines.push('');
}
if (totalIssues === 0) {
  mdLines.push('## Result');
  mdLines.push('✅ No issues found. Registry and filesystem are consistent.');
  mdLines.push('');
}

const mdPath = join(REPORTS_DIR, 'CURRICULUM-AUDIT.md');
writeFileSync(mdPath, `${mdLines.join('\n')}\n`, 'utf8');

log.section('Audit Summary');
log.raw(`  Registered assets:    ${registeredAssets.length}`);
log.raw(`  Orphan files:         ${issues.orphanFiles.length}`);
log.raw(`  Missing files:        ${issues.missingFiles.length}`);
log.raw(`  Checksum mismatches:  ${issues.checksumMismatches.length}`);
log.raw(`  Duplicate IDs:        ${issues.duplicateIds.length}`);
log.raw(`  Bad paths:            ${issues.badPaths.length}`);
log.raw(`  Report:               ${mdPath}`);

if (totalIssues > 0) {
  log.warn(`Audit found ${totalIssues} issue(s)`);
  process.exit(1);
}
log.ok('Audit complete — no issues found');
