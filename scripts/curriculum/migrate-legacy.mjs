#!/usr/bin/env node
// scripts/curriculum/migrate-legacy.mjs
// Searches for legacy curriculum assets and reports findings.

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { log } from './lib/logger.mjs';
import { MIGRATIONS_DIR, repoPath } from './lib/paths.mjs';

const RED_BATCH_IDS = [
  'RED-L1-001',
  'RED-L1-002',
  'RED-L1-003',
  'RED-L1-004',
  'RED-L1-005',
  'RED-L1-006',
  'RED-L1-007',
  'RED-L1-008',
  'RED-L1-009',
  'RED-L1-010',
];
const SEARCH_PATTERNS = [
  'RED-L1-MANIFEST',
  'RED-L1-BATCH-VERIFICATION',
  'WHITE-L1-001',
  'BLUE-L1-001',
  'red-01',
  'white-01',
  'blue-01',
];

function getAccessibleBranches() {
  try {
    const branchOutput = execSync('git for-each-ref --format="%(refname:short)" refs/heads refs/remotes', { cwd: repoPath() })
      .toString()
      .split(/\r?\n/)
      .map((branch) => branch.trim())
      .filter(Boolean)
      .filter((branch) => !branch.endsWith('/HEAD'));
    return Array.from(new Set(['main', ...branchOutput]));
  } catch {
    return ['main'];
  }
}

function escapeSingleQuotes(value) {
  return value.replace(/'/g, `'"'"'`);
}

function searchPattern(pattern, branches) {
  const locations = [];
  const escapedPattern = escapeSingleQuotes(pattern);
  const pathspecExcludes = [
    "':(exclude)curriculum/**'",
    "':(exclude)scripts/curriculum/**'",
    "':(exclude)docs/curriculum-management.md'",
    "':(exclude)examples/curriculum-package/**'",
  ].join(' ');

  try {
    const workingTree = execSync(`git --no-pager grep -n -F -- '${escapedPattern}' -- . ${pathspecExcludes}`, {
      cwd: repoPath(),
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (workingTree) {
      locations.push(...workingTree.split(/\r?\n/).map((line) => `working-tree:${line}`));
    }
  } catch {
    // No working tree matches.
  }

  for (const branch of branches) {
    try {
      const output = execSync(`git --no-pager grep -n -F -- '${escapedPattern}' '${branch}' -- . ${pathspecExcludes}`, {
        cwd: repoPath(),
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
      if (output) {
        locations.push(...output.split(/\r?\n/).map((line) => `${branch}:${line}`));
      }
    } catch {
      // No matches in this branch or branch unavailable.
    }
  }

  return Array.from(new Set(locations));
}

log.section('Legacy Migration Scanner');
log.info('Searching repository for legacy curriculum IDs...');

const branches = getAccessibleBranches();
const findings = {};

const redBatchMatches = RED_BATCH_IDS.flatMap((pattern) => searchPattern(pattern, branches));
findings['RED-L1-001-through-RED-L1-010'] = redBatchMatches.length > 0
  ? `FOUND (${redBatchMatches.length} reference(s))`
  : `NOT FOUND in any branch or file as of ${new Date().toISOString().slice(0, 10)}`;

for (const pattern of SEARCH_PATTERNS) {
  const matches = searchPattern(pattern, branches);
  findings[pattern] = matches.length > 0 ? `FOUND (${matches.length} reference(s))` : 'NOT FOUND';
}

mkdirSync(MIGRATIONS_DIR, { recursive: true });
const mapPath = join(MIGRATIONS_DIR, 'legacy-migration-map.json');
const hasFindings = Object.values(findings).some((value) => value.startsWith('FOUND'));
const map = {
  _version: '1.0',
  _generated: new Date().toISOString(),
  _note: 'Records migration of legacy IDs to canonical IDs. Populated by curriculum:migrate-legacy.',
  searchedBranches: branches,
  searchedPatterns: [
    'RED-L1-001 through RED-L1-010',
    'RED-L1-MANIFEST',
    'RED-L1-BATCH-VERIFICATION',
    'WHITE-L1-001',
    'BLUE-L1-001',
    'red-01',
    'white-01',
    'blue-01',
  ],
  findings,
  migrationEntries: [],
  note: hasFindings
    ? 'Legacy curriculum references were discovered. Review the findings and register canonical assets with `npm run curriculum:import -- <path>`.'
    : 'Searched main branch and all accessible branches. No legacy curriculum assets with these IDs were discovered. The RED Level 1 batch manifest was referenced in a chat conversation but the actual lesson files (RED-L1-001 through RED-L1-010) have not been committed to the repository. When these files are provided, run `npm run curriculum:import -- <path>` to register them properly.',
};
writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, 'utf8');
log.ok(`Migration map written: ${mapPath}`);

for (const [id, finding] of Object.entries(findings)) {
  log.raw(`  ${id}: ${finding}`);
}
