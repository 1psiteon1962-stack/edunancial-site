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
