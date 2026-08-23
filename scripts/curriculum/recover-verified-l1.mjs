#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { checksumFile, normalizeChecksum } from './lib/checksum.mjs';
import { parseAssetId } from './lib/id-parser.mjs';
import { repoPath } from './lib/paths.mjs';
import { readRegistry, upsertAsset, writeRegistry } from './lib/registry.mjs';
import { parseFrontMatter, validateAsset } from './lib/validator.mjs';

const RECOVERY = {
  WHITE: {
    count: 10,
    ingestionId: '0124e4a8-562d-43a6-8d8c-036a494b5b33',
    importedAt: '2026-08-02T23:42:42.498Z',
    checksums: [
      '50a93cf87b0667b3fb04b88ae1e15c8c3127d3dd82a00805c1372a252acdf65c',
      '6d61814bbfa29f62486b5c7193baaa80b2191ab65f8862b01b8b9e9957097c3a',
      '52b76db360232c0a990c153fd791b73b2b973b233a1255bc2800cc574427da0e',
      '9c705c5b0f0d4d0e67bff5e191d4bc4d7e599776ebab17d36b41ca51b897a5cf',
      'bf4b59bee4037474cd4fadf8d19c67fe37dbd857bafcf682057a306e6c3f48a4',
      'ec1bdf970b906d20f858189e4f027b95ce1d77490bce417f066bf1031fff561a',
      'ffd617f9948a66176388b1ce9ec4f11c6a325cbafad3f600426a2c6178122709',
      '348391d77dcb832eb2934c29e9dda2d23b407c69ee482682927b92113f5d604a',
      'f0c1b979c07f7dd611cc76e370cb0ed3b8c83f7418e378c39b1a598d1cfbb314',
      '735dd3ccf91e2c7b35cf19543e594c24f2b7551cee7c88dcfd08e66d48223c7a',
    ],
  },
  BLUE: {
    count: 10,
    ingestionId: '2bb9f56a-4781-4498-a5f4-b08bcf2bd711',
    importedAt: '2026-08-03T02:41:05.295Z',
    checksums: [
      'b3e9075b0a72cfe1f41c43aee082557c18e9cde5bd8e658a6de0be0c8701072d',
      '0541aa69dbabfdb161cabe1e894b68327828d4771eb820586ebdbbbe831b3daa',
      'd3cc9cab04b5a192f414e9f28099671095aad9d5dbd493992b13aab39c324405',
      '5e58bcfefe8a3c2b3b1904daa7a2346e85cfde61de9770bda8c6f6035446c84e',
      '4a6c632f44bc4c773a3cab504307221ddf3551f2b9928d5ec0498b3d6a1469b4',
      '3d3fa2442d10c1333e0509a358632b5437dc39cdf914b68dc0792307ce0b7cdb',
      '6e6e2929cc5da39eea83872006edaf47de103928db9c39136597b269e80883a6',
      '31b2170c2cd3f2cc74fa443abb06a0d8247b4e7698711855891d0a105d987eb9',
      '0a12cf116eb0b05c4e0ed1ba2427944d391ec1f3e12c6e5f4dc90de1eeef2f6b',
      '37fc4823f065a86c5cc9fd89ee245139b8e073e86c6188f423eb66735240ea13',
    ],
  },
};

const registry = readRegistry();
let recovered = 0;

for (const [track, spec] of Object.entries(RECOVERY)) {
  for (let number = 1; number <= spec.count; number += 1) {
    const suffix = String(number).padStart(3, '0');
    const id = `${track}-L1-${suffix}`;
    const relativePath = `content/curriculum/${track}/L1/${id}.md`;
    const absolutePath = repoPath(relativePath);
    if (!existsSync(absolutePath)) throw new Error(`${id}: verified historical file is missing`);

    const expectedChecksum = `sha256:${spec.checksums[number - 1]}`;
    const actualChecksum = normalizeChecksum(checksumFile(absolutePath));
    if (actualChecksum !== expectedChecksum) {
      throw new Error(`${id}: checksum does not match successful historical ingestion; expected ${expectedChecksum}, got ${actualChecksum}`);
    }

    const content = readFileSync(absolutePath, 'utf8');
    const meta = parseFrontMatter(content);
    const parsed = parseAssetId(meta?.id || id);
    if (!parsed.valid || parsed.id !== id || parsed.track !== track || parsed.level !== 1 || parsed.type !== 'lesson') {
      throw new Error(`${id}: invalid canonical identity`);
    }
    const validation = validateAsset(content, id);
    if (!validation.valid) throw new Error(`${id}: validation failed: ${validation.errors.join('; ')}`);

    const reserved = new Set(['id', 'track', 'officialTrackName', 'level', 'lessonNumber', 'title', 'version', 'author', 'date']);
    const metadata = Object.fromEntries(Object.entries(meta).filter(([key]) => !reserved.has(key)));

    upsertAsset(registry, parsed, {
      id,
      type: 'lesson',
      track,
      trackName: parsed.trackName,
      level: 1,
      lessonNumber: Number.parseInt(meta.lessonNumber, 10) || number,
      title: meta.title || '',
      version: meta.version || '1.0',
      author: meta.author || '',
      date: meta.date || '',
      path: relativePath,
      checksum: actualChecksum,
      status: 'active',
      ingestionId: spec.ingestionId,
      importedAt: spec.importedAt,
      validationPassed: true,
      warnings: validation.warnings,
      metadata: { officialTrackName: meta.officialTrackName || parsed.trackName, ...metadata },
    });
    recovered += 1;
  }
}

writeRegistry(registry);
console.log(`Recovered ${recovered} checksum-verified historical Level 1 registry entries without replacing unrelated registry assets.`);
