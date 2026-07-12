#!/usr/bin/env node
// scripts/curriculum/inventory.mjs
// Generates curriculum/inventory.json from registry.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { log } from './lib/logger.mjs';
import { INVENTORY_PATH } from './lib/paths.mjs';
import { listAllAssets, readRegistry } from './lib/registry.mjs';

log.section('Curriculum Inventory Generator');

const registry = readRegistry();
const assets = listAllAssets(registry);

const byTrack = {};
const levelsSeen = new Set();
for (const asset of assets) {
  if (!byTrack[asset.trackCode]) {
    byTrack[asset.trackCode] = { name: asset.trackName || asset.trackCode, totalLessons: 0 };
  }
  byTrack[asset.trackCode].totalLessons += 1;
  levelsSeen.add(`${asset.trackCode}:L${asset.level}`);
}

const inventory = {
  _note: 'Generated file. Run `npm run curriculum:inventory` to regenerate. Do not edit manually.',
  summary: {
    totalLessons: assets.length,
    totalTracks: Object.keys(byTrack).length,
    totalLevels: levelsSeen.size,
    byTrack,
  },
  assets: assets.map((asset) => ({
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
