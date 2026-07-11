// scripts/curriculum/lib/registry.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { REGISTRY_PATH } from './paths.mjs';

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function readRegistry() {
  if (!existsSync(REGISTRY_PATH)) {
    return {
      _schema: 'curriculum/schemas/registry.schema.json',
      _version: '1.0',
      _generated: new Date().toISOString(),
      _note: 'Authoritative curriculum registry. Edit only via curriculum:import or curriculum:migrate-legacy.',
      tracks: {},
    };
  }
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
}

export function writeRegistry(registry) {
  registry._schema ||= 'curriculum/schemas/registry.schema.json';
  registry._version ||= '1.0';
  registry._note ||= 'Authoritative curriculum registry. Edit only via curriculum:import or curriculum:migrate-legacy.';
  registry._generated = new Date().toISOString();
  ensureDir(REGISTRY_PATH);
  writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
}

export function getAsset(registry, assetId) {
  for (const track of Object.values(registry.tracks || {})) {
    for (const level of Object.values(track.levels || {})) {
      if (level.assets && level.assets[assetId]) {
        return level.assets[assetId];
      }
    }
  }
  return null;
}

export function upsertAsset(registry, parsed, entry) {
  const { track, level } = parsed;
  if (!registry.tracks) {
    registry.tracks = {};
  }
  if (!registry.tracks[track]) {
    registry.tracks[track] = {
      code: track,
      name: parsed.trackName,
      levels: {},
    };
  }
  const levelKey = String(level);
  if (!registry.tracks[track].levels[levelKey]) {
    registry.tracks[track].levels[levelKey] = { assets: {} };
  }
  registry.tracks[track].levels[levelKey].assets[parsed.id] = entry;
}

export function removeAsset(registry, assetId) {
  for (const track of Object.values(registry.tracks || {})) {
    for (const level of Object.values(track.levels || {})) {
      if (level.assets && level.assets[assetId]) {
        delete level.assets[assetId];
        return true;
      }
    }
  }
  return false;
}

export function listAllAssets(registry) {
  const assets = [];
  for (const [trackCode, track] of Object.entries(registry.tracks || {})) {
    for (const [levelKey, level] of Object.entries(track.levels || {})) {
      for (const [assetId, asset] of Object.entries(level.assets || {})) {
        assets.push({ trackCode, level: Number.parseInt(levelKey, 10), assetId, ...asset });
      }
    }
  }
  return assets;
}
