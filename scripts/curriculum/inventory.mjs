#!/usr/bin/env node
// scripts/curriculum/inventory.mjs
// Generates curriculum/inventory.json from registry.

import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { log } from './lib/logger.mjs';
import { INVENTORY_PATH, repoPath } from './lib/paths.mjs';
import { listAllAssets, readRegistry } from './lib/registry.mjs';

log.section('Curriculum Inventory Generator');

const registry = readRegistry();
const assets = listAllAssets(registry);

const byTrack = {};
const levelsSeen = new Set();
let localizedVariantCount = 0;

function listLocalizedVariants(relativeCanonicalPath) {
  const absolutePath = repoPath(relativeCanonicalPath);
  const directory = dirname(absolutePath);
  const canonicalBase = basename(absolutePath).replace(/\.md$/u, '');
  return readdirSync(directory)
    .filter((name) => name !== `${canonicalBase}.md`)
    .filter((name) => name.startsWith(`${canonicalBase}.`) && name.endsWith('.md'))
    .map((name) => {
      const localeMatch = name.match(/\.([A-Za-z0-9-]+)\.md$/u);
      return {
        locale: localeMatch?.[1] ?? 'unknown',
        path: join(directory, name).replace(`${process.cwd()}/`, ''),
      };
    });
}

for (const asset of assets) {
  if (!byTrack[asset.trackCode]) {
    byTrack[asset.trackCode] = { name: asset.trackName || asset.trackCode, totalLessons: 0, localizedVariants: 0 };
  }
  byTrack[asset.trackCode].totalLessons += 1;
  levelsSeen.add(`${asset.trackCode}:L${asset.level}`);
  const variants = listLocalizedVariants(asset.path);
  localizedVariantCount += variants.length;
  byTrack[asset.trackCode].localizedVariants += variants.length;
}

const inventory = {
  _note: 'Generated file. Run `npm run curriculum:inventory` to regenerate. Do not edit manually.',
  summary: {
    totalLessons: assets.length,
    totalTracks: Object.keys(byTrack).length,
    totalLevels: levelsSeen.size,
    localizedVariants: localizedVariantCount,
    byTrack,
  },
  assets: assets.map((asset) => ({
    localizations: listLocalizedVariants(asset.path),
    id: asset.assetId,
    type: asset.type,
    track: asset.trackCode,
    trackName: asset.trackName,
    level: asset.level,
    title: asset.title,
    version: asset.version,
    status: asset.status,
    path: asset.path,
    checksum: asset.checksum,
    importedAt: asset.importedAt,
  })),
};

mkdirSync(dirname(INVENTORY_PATH), { recursive: true });
writeFileSync(INVENTORY_PATH, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');

log.ok(`Inventory generated: ${INVENTORY_PATH}`);
log.raw(`  Total assets: ${assets.length}`);
log.raw(`  Tracks:       ${Object.keys(byTrack).length}`);
for (const [code, data] of Object.entries(byTrack)) {
  log.raw(`    ${code}: ${data.totalLessons} asset(s)`);
}
