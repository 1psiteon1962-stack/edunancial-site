#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checksumBuffer, normalizeChecksum } from './lib/checksum.mjs';
import { assetPath, parseAssetId } from './lib/id-parser.mjs';
import { repoPath } from './lib/paths.mjs';
import { readRegistry, upsertAsset, writeRegistry } from './lib/registry.mjs';
import { parseFrontMatter, validateAsset } from './lib/validator.mjs';

const track = 'RED';
const level = 1;
const directory = repoPath('content/curriculum/RED/L1');
const files = readdirSync(directory)
  .filter((name) => /^RED-L1-\d{3}\.md$/u.test(name))
  .sort();

const expectedIds = Array.from({ length: 50 }, (_, index) => `RED-L1-${String(index + 1).padStart(3, '0')}`);
const actualIds = files.map((name) => name.replace(/\.md$/u, ''));

if (files.length !== 50 || expectedIds.some((id, index) => actualIds[index] !== id)) {
  throw new Error(`Expected exactly RED-L1-001 through RED-L1-050; found ${actualIds.join(', ')}`);
}

const registry = readRegistry();
const ingestionId = randomUUID();
const importedAt = new Date().toISOString();

for (const filename of files) {
  const content = readFileSync(join(directory, filename), 'utf8');
  const meta = parseFrontMatter(content);
  if (!meta?.id) throw new Error(`${filename}: missing front-matter id`);

  const parsed = parseAssetId(meta.id);
  if (!parsed.valid || parsed.track !== track || parsed.level !== level || parsed.type !== 'lesson') {
    throw new Error(`${filename}: invalid canonical RED Level 1 lesson identity`);
  }

  const validation = validateAsset(content, parsed.id);
  if (!validation.valid) {
    throw new Error(`${filename}: validation failed: ${validation.errors.join('; ')}`);
  }

  const destinationRelative = assetPath(parsed);
  if (destinationRelative !== `content/curriculum/RED/L1/${filename}`) {
    throw new Error(`${filename}: non-canonical path ${destinationRelative}`);
  }

  const reservedMetadataKeys = new Set([
    'id', 'track', 'officialTrackName', 'level', 'lessonNumber', 'title', 'version', 'author', 'date',
  ]);
  const metadata = Object.fromEntries(
    Object.entries(meta).filter(([key]) => !reservedMetadataKeys.has(key)),
  );

  upsertAsset(registry, parsed, {
    id: parsed.id,
    type: parsed.type,
    track: parsed.track,
    trackName: parsed.trackName,
    level: parsed.level,
    lessonNumber: Number.parseInt(meta.lessonNumber, 10) || parsed.number,
    title: meta.title || '',
    version: meta.version || '1.0',
    author: meta.author || '',
    date: meta.date || '',
    path: destinationRelative,
    checksum: normalizeChecksum(checksumBuffer(Buffer.from(content, 'utf8'))),
    status: 'active',
    ingestionId,
    importedAt,
    validationPassed: true,
    warnings: validation.warnings,
    metadata: {
      officialTrackName: meta.officialTrackName || parsed.trackName,
      ...metadata,
    },
  });
}

writeRegistry(registry);
console.log(`Registered ${files.length} canonical RED Level 1 lessons without changing any other registry assets.`);
