#!/usr/bin/env node
// scripts/curriculum/inventory.mjs
// Generates curriculum/inventory.json from registry + committed translation artifacts.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { log } from './lib/logger.mjs';
import { INVENTORY_PATH, repoPath } from './lib/paths.mjs';
import { listAllAssets, readRegistry } from './lib/registry.mjs';

log.section('Curriculum Inventory Generator');

const registry = readRegistry();
const assets = listAllAssets(registry);
const assetById = new Map(assets.map((asset) => [String(asset.assetId).toUpperCase(), asset]));

const byTrack = {};
const levelsSeen = new Set();
let localizedVariantCount = 0;

function walk(directory, out = []) {
  if (!existsSync(directory)) return out;
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function listLocalizedMarkdownVariants(relativeCanonicalPath) {
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
        source: 'markdown',
      };
    });
}

function collectJsonTranslationVariants() {
  const variantsById = new Map();
  const roots = ['content/curriculum', 'content/courses'];

  for (const root of roots) {
    for (const absolutePath of walk(repoPath(root))) {
      if (!absolutePath.endsWith('.json')) continue;

      let parsed;
      try {
        parsed = JSON.parse(readFileSync(absolutePath, 'utf8'));
      } catch {
        continue;
      }

      const id = String(parsed.id || parsed.lesson_id || parsed.lessonId || '').toUpperCase();
      if (!id || !assetById.has(id) || !parsed.translations || typeof parsed.translations !== 'object') continue;

      const relativePath = relative(process.cwd(), absolutePath);
      const list = variantsById.get(id) || [];
      for (const locale of Object.keys(parsed.translations)) {
        list.push({ locale, path: relativePath, source: 'json' });
      }
      variantsById.set(id, list);
    }
  }

  return variantsById;
}

const jsonVariantsById = collectJsonTranslationVariants();

function listAllLocalizations(asset) {
  const seen = new Set();
  const combined = [
    ...listLocalizedMarkdownVariants(asset.path),
    ...(jsonVariantsById.get(String(asset.assetId).toUpperCase()) || []),
  ];

  return combined.filter((variant) => {
    const key = `${variant.locale}:${variant.source}:${variant.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

for (const asset of assets) {
  if (!byTrack[asset.trackCode]) {
    byTrack[asset.trackCode] = {
      name: asset.trackName || asset.trackCode,
      totalLessons: 0,
      localizedVariants: 0,
    };
  }

  byTrack[asset.trackCode].totalLessons += 1;
  levelsSeen.add(`${asset.trackCode}:L${asset.level}`);

  const variants = listAllLocalizations(asset);
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
    localizations: listAllLocalizations(asset),
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
log.raw(`  Localizations: ${localizedVariantCount}`);
for (const [code, data] of Object.entries(byTrack)) {
  log.raw(`    ${code}: ${data.totalLessons} asset(s), ${data.localizedVariants} localization artifact(s)`);
}
