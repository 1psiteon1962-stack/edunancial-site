// scripts/curriculum/lib/paths.mjs
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Absolute path to repository root */
export const REPO_ROOT = resolve(__dirname, '../../..');

/** Resolve a path relative to the repo root */
export function repoPath(...parts) {
  return join(REPO_ROOT, ...parts);
}

/** Curriculum metadata root */
export const CURRICULUM_ROOT = repoPath('curriculum');
export const REGISTRY_PATH = repoPath('curriculum', 'registry.json');
export const LEDGER_PATH = repoPath('curriculum', 'ingestion-ledger.json');
export const INVENTORY_PATH = repoPath('curriculum', 'inventory.json');
export const REPORTS_DIR = repoPath('curriculum', 'reports');
export const IMPORTS_REPORTS_DIR = repoPath('curriculum', 'reports', 'imports');
export const STAGING_DIR = repoPath('curriculum', 'staging');
export const REJECTED_DIR = repoPath('curriculum', 'rejected');
export const SUPERSEDED_DIR = repoPath('curriculum', 'superseded');
export const MIGRATIONS_DIR = repoPath('curriculum', 'migrations');
export const CONTENT_CURRICULUM_ROOT = repoPath('content', 'curriculum');
