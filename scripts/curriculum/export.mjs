#!/usr/bin/env node
// scripts/curriculum/export.mjs
// Build a curriculum export ZIP containing only approved curriculum assets.
//
// Usage:
//   npm run curriculum:export -- --track RED --level 1 [--lessons 011-025] [--out ./exports]
//   npm run curriculum:export -- --track WHITE --level 1
//
// The exporter walks content/curriculum/<TRACK>/L<level>/ and packages only
// files permitted by the curriculum importer.  Executable, development, and
// repository-support files are excluded via an explicit allowlist.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, extname, join, relative, resolve } from 'node:path';

import { isAllowedCurriculumAsset } from './lib/export-filter.mjs';
import { log } from './lib/logger.mjs';
import { CONTENT_CURRICULUM_ROOT } from './lib/paths.mjs';
import { TRACK_CODES } from './lib/taxonomy.mjs';

// ── argument parsing ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function arg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
}

const track = (arg('--track') || '').toUpperCase();
const level = arg('--level');
const lessonsRange = arg('--lessons');           // optional: "011-025"
const outDir = resolve(arg('--out') || 'exports');

if (!track || !level) {
  log.error('Usage: npm run curriculum:export -- --track <TRACK> --level <N> [--lessons <START-END>] [--out <DIR>]');
  log.error('  Example: npm run curriculum:export -- --track RED --level 1 --lessons 011-025');
  process.exit(1);
}

if (!TRACK_CODES.includes(track)) {
  log.error(`Unknown track "${track}". Valid tracks: ${TRACK_CODES.join(', ')}`);
  process.exit(1);
}

const levelNum = parseInt(level, 10);
if (!Number.isInteger(levelNum) || levelNum < 1 || levelNum > 9) {
  log.error(`Invalid level "${level}". Must be a number 1–9.`);
  process.exit(1);
}

// Optional lesson number range filter.
let lessonStart = null;
let lessonEnd = null;
if (lessonsRange) {
  const match = lessonsRange.match(/^(\d+)-(\d+)$/);
  if (!match) {
    log.error(`Invalid --lessons value "${lessonsRange}". Expected format: START-END, e.g. 011-025`);
    process.exit(1);
  }
  lessonStart = parseInt(match[1], 10);
  lessonEnd = parseInt(match[2], 10);
  if (lessonStart > lessonEnd) {
    log.error(`--lessons start (${lessonStart}) must not exceed end (${lessonEnd})`);
    process.exit(1);
  }
}

// ── collect source files ──────────────────────────────────────────────────────

const levelDir = join(CONTENT_CURRICULUM_ROOT, track, `L${levelNum}`);
if (!existsSync(levelDir)) {
  log.error(`Source directory not found: ${levelDir}`);
  process.exit(1);
}

log.section('Curriculum Export');
log.info(`Track  : ${track}`);
log.info(`Level  : ${levelNum}`);
if (lessonStart !== null) {
  log.info(`Lessons: ${String(lessonStart).padStart(3, '0')}–${String(lessonEnd).padStart(3, '0')}`);
}

/**
 * Recursively collect files from a directory, applying the export allowlist filter
 * and the optional lesson-range filter.
 *
 * @param {string} dir - Absolute path of the directory to walk.
 * @param {string} baseDir - The root directory used for relative-path computation.
 * @returns {{ absPath: string, relPath: string }[]}
 */
function collectFiles(dir, baseDir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absPath = join(dir, entry.name);
    const relPath = relative(baseDir, absPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      results.push(...collectFiles(absPath, baseDir));
      continue;
    }

    // Apply the export allowlist — no executable / dev / repo-support files.
    if (!isAllowedCurriculumAsset(relPath)) {
      log.warn(`Skipping disallowed file: ${relPath}`);
      continue;
    }

    // Apply optional lesson-number range filter (operates on .md lesson files).
    if (lessonStart !== null && extname(entry.name).toLowerCase() === '.md') {
      // Lesson files follow the pattern <TRACK>-L<level>-<NNN>.md
      const m = entry.name.match(/^[A-Z]+-L\d+-(\d+)\.md$/i);
      if (m) {
        const lessonNum = parseInt(m[1], 10);
        if (lessonNum < lessonStart || lessonNum > lessonEnd) {
          continue;
        }
      }
    }

    results.push({ absPath, relPath });
  }
  return results;
}

const collectedFiles = collectFiles(levelDir, levelDir);

if (collectedFiles.length === 0) {
  log.warn('No curriculum assets found matching the specified criteria.');
  process.exit(0);
}

log.info(`Collected ${collectedFiles.length} asset(s) to package.`);

// ── build a stored (method 0) ZIP ────────────────────────────────────────────

function writeUInt32LE(value) {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(value >>> 0, 0);
  return buf;
}

function writeUInt16LE(value) {
  const buf = Buffer.alloc(2);
  buf.writeUInt16LE(value & 0xffff, 0);
  return buf;
}

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function buildStoredZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const { path: filePath, content } of files) {
    const pathBuffer = Buffer.from(filePath, 'utf8');
    const checksum = crc32(content);

    const localHeader = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      writeUInt16LE(20),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(checksum),
      writeUInt32LE(content.length),
      writeUInt32LE(content.length),
      writeUInt16LE(pathBuffer.length),
      writeUInt16LE(0),
      pathBuffer,
      content,
    ]);
    localParts.push(localHeader);

    const centralHeader = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x01, 0x02]),
      writeUInt16LE(20),
      writeUInt16LE(20),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(checksum),
      writeUInt32LE(content.length),
      writeUInt32LE(content.length),
      writeUInt16LE(pathBuffer.length),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(0),
      writeUInt32LE(offset),
      pathBuffer,
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endRecord = Buffer.concat([
    Buffer.from([0x50, 0x4b, 0x05, 0x06]),
    writeUInt16LE(0),
    writeUInt16LE(0),
    writeUInt16LE(files.length),
    writeUInt16LE(files.length),
    writeUInt32LE(centralDirectory.length),
    writeUInt32LE(offset),
    writeUInt16LE(0),
  ]);

  return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

// ── assemble and write ZIP ────────────────────────────────────────────────────

const zipEntries = collectedFiles.map(({ absPath, relPath }) => ({
  path: relPath,
  content: readFileSync(absPath),
}));

const zipBuffer = buildStoredZip(zipEntries);

// Compute a SHA-256 manifest of included assets for traceability.
const manifestEntries = zipEntries.map(({ path: filePath, content }) => ({
  path: filePath,
  sha256: createHash('sha256').update(content).digest('hex'),
  bytes: content.length,
}));

const lessonsSuffix = lessonStart !== null
  ? `-${String(lessonStart).padStart(3, '0')}-${String(lessonEnd).padStart(3, '0')}`
  : '';
const zipName = `${track.toLowerCase()}-l${levelNum}${lessonsSuffix}-curriculum.zip`;
const manifestName = `${track.toLowerCase()}-l${levelNum}${lessonsSuffix}-curriculum-manifest.json`;

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const zipOutPath = join(outDir, zipName);
const manifestOutPath = join(outDir, manifestName);

writeFileSync(zipOutPath, zipBuffer);
writeFileSync(
  manifestOutPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      track,
      level: levelNum,
      lessonRange: lessonStart !== null ? { start: lessonStart, end: lessonEnd } : null,
      fileCount: zipEntries.length,
      files: manifestEntries,
    },
    null,
    2,
  ),
);

log.ok(`Export ZIP   : ${zipOutPath}`);
log.ok(`Manifest     : ${manifestOutPath}`);
log.info(`Files in ZIP : ${zipEntries.length}`);
for (const { path: filePath } of zipEntries) {
  log.info(`  ${filePath}`);
}
