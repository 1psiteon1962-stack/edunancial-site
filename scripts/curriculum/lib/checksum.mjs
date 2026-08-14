// scripts/curriculum/lib/checksum.mjs
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/** Compute SHA-256 checksum of a buffer or file path */
export function checksumBuffer(buf) {
  return `sha256:${createHash('sha256').update(buf).digest('hex')}`;
}

export function checksumFile(filePath) {
  return checksumBuffer(readFileSync(filePath));
}

/**
 * Normalize a checksum string to a single `sha256:` prefix.
 * Corrects double-prefixed values (e.g. `sha256:sha256:hex`) produced by
 * pipelines that wrapped an already-prefixed checksumFile/checksumBuffer
 * result in an additional `sha256:` literal.
 */
export function normalizeChecksum(checksum) {
  if (typeof checksum !== 'string') return checksum;
  while (checksum.startsWith('sha256:sha256:')) {
    checksum = checksum.slice('sha256:'.length);
  }
  return checksum;
}
