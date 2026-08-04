// scripts/curriculum/lib/export-filter.mjs
// Allowlist-based file filter for curriculum export ZIPs.
// Only curriculum assets explicitly permitted by the importer are included.
// Executable, development, repository-support, and transient files are excluded
// regardless of where they appear in the source tree.

import { basename, extname } from 'node:path';

/**
 * File extensions allowed in a curriculum export ZIP.
 * This is an explicit allowlist — anything not listed here is excluded.
 *
 * Rationale for each group:
 *   .md   — lesson content, manifests, batch-verification assets
 *   .json — curriculum metadata, manifests, registry data
 *   .jpg/.jpeg/.png/.gif/.webp/.svg — approved lesson images and diagrams
 *   .mp3/.mp4/.webm/.ogg — approved lesson audio/video media
 *   .pdf  — approved reference documents
 */
export const ALLOWED_EXTENSIONS = new Set([
  '.md',
  '.json',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.mp3',
  '.mp4',
  '.webm',
  '.ogg',
  '.pdf',
]);

/**
 * Directory name segments that must never be traversed during export.
 * Any file whose path includes one of these segments will be excluded.
 */
export const EXCLUDED_DIRECTORY_SEGMENTS = new Set([
  '.git',
  '.github',
  'node_modules',
  'dist',
  'build',
  'out',
  'coverage',
  '.next',
  'tmp',
  'temp',
  '__pycache__',
]);

/**
 * Returns true if the given file path is an approved curriculum asset
 * and should be included in an export ZIP.
 *
 * @param {string} filePath - The path of the file, relative or absolute.
 *   Forward-slash and back-slash separators are both accepted.
 * @returns {boolean}
 */
export function isAllowedCurriculumAsset(filePath) {
  const normalised = filePath.replace(/\\/g, '/');
  const segments = normalised.split('/');

  // Exclude any file whose path passes through a forbidden directory.
  for (const segment of segments.slice(0, -1)) {
    if (EXCLUDED_DIRECTORY_SEGMENTS.has(segment)) {
      return false;
    }
  }

  const fileName = basename(normalised);

  // Exclude hidden files (dot-files such as .DS_Store, .gitignore, etc.).
  if (fileName.startsWith('.')) {
    return false;
  }

  const ext = extname(fileName).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}
