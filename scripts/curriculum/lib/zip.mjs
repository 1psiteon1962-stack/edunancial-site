// scripts/curriculum/lib/zip.mjs
// Pure Node.js ZIP extractor — no external dependencies
// Handles store (method 0) and DEFLATE (method 8) only.
// Security: zip-slip protection, max size check, forbidden extension rejection.

import { extname, normalize, sep } from 'node:path';
import { inflateRawSync } from 'node:zlib';
import { FORBIDDEN_EXTENSIONS, MAX_FILE_SIZE, MAX_ZIP_EXTRACT_SIZE } from './taxonomy.mjs';

const SIG_LOCAL = 0x04034b50;
const SIG_CD = 0x02014b50;
const SIG_EOCD = 0x06054b50;

/**
 * Extract entries from a ZIP buffer.
 * Returns array of { name: string, data: Buffer, size: number }
 * Throws on security violations.
 */
export function extractZip(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    buffer = Buffer.from(buffer);
  }

  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= 0; i -= 1) {
    if (buffer.readUInt32LE(i) === SIG_EOCD) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) {
    throw new Error('Invalid ZIP: End of Central Directory record not found');
  }

  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);
  const numEntries = buffer.readUInt16LE(eocdOffset + 8);

  const entries = [];
  let totalSize = 0;
  let pos = cdOffset;

  for (let i = 0; i < numEntries; i += 1) {
    if (pos + 46 > buffer.length) {
      throw new Error('ZIP central directory truncated');
    }
    if (buffer.readUInt32LE(pos) !== SIG_CD) {
      throw new Error(`Invalid central directory signature at offset ${pos}`);
    }

    const compressionMethod = buffer.readUInt16LE(pos + 10);
    const compressedSize = buffer.readUInt32LE(pos + 20);
    const uncompressedSize = buffer.readUInt32LE(pos + 24);
    const filenameLen = buffer.readUInt16LE(pos + 28);
    const extraLen = buffer.readUInt16LE(pos + 30);
    const commentLen = buffer.readUInt16LE(pos + 32);
    const localOffset = buffer.readUInt32LE(pos + 42);

    const name = buffer.slice(pos + 46, pos + 46 + filenameLen).toString('utf8');
    pos += 46 + filenameLen + extraLen + commentLen;

    if (name.endsWith('/') || name.endsWith('\\')) {
      continue;
    }

    const normalized = normalize(name);
    if (normalized.startsWith('..') || normalized.includes(`..${sep}`) || normalized.startsWith('/')) {
      throw new Error(`ZIP SECURITY: Path traversal detected in entry "${name}"`);
    }

    const extension = extname(name).toLowerCase();
    if (FORBIDDEN_EXTENSIONS.has(extension)) {
      throw new Error(`ZIP SECURITY: Forbidden file type "${extension}" in entry "${name}"`);
    }

    if (uncompressedSize > MAX_FILE_SIZE) {
      throw new Error(`ZIP SECURITY: Entry "${name}" exceeds max file size (${uncompressedSize} > ${MAX_FILE_SIZE})`);
    }
    totalSize += uncompressedSize;
    if (totalSize > MAX_ZIP_EXTRACT_SIZE) {
      throw new Error(`ZIP SECURITY: Total extraction size exceeds limit (${totalSize} > ${MAX_ZIP_EXTRACT_SIZE})`);
    }

    if (localOffset + 30 > buffer.length) {
      throw new Error(`ZIP: Local header offset ${localOffset} out of bounds`);
    }
    if (buffer.readUInt32LE(localOffset) !== SIG_LOCAL) {
      throw new Error(`ZIP: Invalid local file header at ${localOffset}`);
    }

    const localFilenameLen = buffer.readUInt16LE(localOffset + 26);
    const localExtraLen = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localFilenameLen + localExtraLen;
    const compressedData = buffer.slice(dataStart, dataStart + compressedSize);

    let data;
    switch (compressionMethod) {
      case 0:
        data = compressedData;
        break;
      case 8:
        data = inflateRawSync(compressedData);
        break;
      default:
        throw new Error(`ZIP: Unsupported compression method ${compressionMethod} in entry "${name}"`);
    }

    entries.push({ name, data, size: uncompressedSize });
  }

  return entries;
}
