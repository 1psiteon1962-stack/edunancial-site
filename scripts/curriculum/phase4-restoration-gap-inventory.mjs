#!/usr/bin/env node
// Read-only Phase 4 canonical curriculum gap inventory.
// Reports the deterministic track x level x locale x lesson 1-50 matrix.
// It never publishes, deletes, moves, or rewrites curriculum.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { REPORTS_DIR, repoPath } from './lib/paths.mjs';
import { listAllAssets, readRegistry } from './lib/registry.mjs';

const EXPECTED_LESSONS = 50;
const registry = readRegistry();
const assets = listAllAssets(registry).filter((asset) => asset.type === 'lesson' && asset.status === 'active');

function activeLocales() {
  const source = readFileSync(repoPath('src/lib/international/languages.ts'), 'utf8');
  const found = [...source.matchAll(/code:\s*"([^"]+)"/gu)].map((match) => match[1]);
  return [...new Set(found.length ? found : ['en-US'])];
}

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/u);
  if (!match) return { frontMatter: {}, body: content };
  const frontMatter = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    frontMatter[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return { frontMatter, body: match[2] };
}

function lessonNumber(asset) {
  const direct = Number(asset.lessonNumber);
  if (Number.isInteger(direct)) return direct;
  const match = String(asset.assetId).match(/(?:^|[-_])(?:L\d+[-_])?(\d{1,3})$/u);
  return match ? Number(match[1]) : null;
}

function localizedPath(path, locale) {
  if (locale === 'en-US' || locale === 'en') return path;
  return path.replace(/\.md$/u, `.${locale}.md`);
}

function inspect(path, assetId) {
  const absolute = repoPath(path);
  if (!existsSync(absolute)) return { exists: false, complete: false, path };
  const parsed = parseFrontMatter(readFileSync(absolute, 'utf8'));
  const id = String(parsed.frontMatter.id ?? '').trim();
  const complete = Boolean(String(parsed.frontMatter.title ?? '').trim() && String(parsed.frontMatter.summary ?? '').trim() && parsed.body.trim());
  return { exists: true, complete, idMatches: id === assetId, path };
}

const locales = activeLocales();
const groups = new Map();
for (const asset of assets) {
  const key = `${asset.trackCode}:L${asset.level}`;
  if (!groups.has(key)) groups.set(key, { track: asset.trackCode, level: Number(asset.level), assets: new Map() });
  const number = lessonNumber(asset);
  if (number) groups.get(key).assets.set(number, asset);
}

const rows = [];
for (const group of [...groups.values()].sort((a,b) => a.track.localeCompare(b.track) || a.level-b.level)) {
  for (const locale of locales) {
    for (let number = 1; number <= EXPECTED_LESSONS; number += 1) {
      const asset = group.assets.get(number);
      if (!asset) {
        rows.push({ track: group.track, level: group.level, locale, lessonNumber: number, classification: 'missing-canonical', lessonId: null, path: null });
        continue;
      }
      const path = localizedPath(asset.path, locale);
      const status = inspect(path, asset.assetId);
      let classification = 'canonical';
      if (!status.exists) classification = locale === 'en-US' || locale === 'en' ? 'missing-canonical-file' : 'missing-localization';
      else if (!status.complete || !status.idMatches) classification = 'conflict';
      rows.push({ track: group.track, level: group.level, locale, lessonNumber: number, classification, lessonId: asset.assetId, path, ...status });
    }
  }
}

const counts = {};
for (const row of rows) counts[row.classification] = (counts[row.classification] ?? 0) + 1;
const report = {
  generatedAt: new Date().toISOString(),
  readOnly: true,
  expectedLessonsPerTrackLevelLocale: EXPECTED_LESSONS,
  locales,
  counts,
  rows,
};
mkdirSync(REPORTS_DIR, { recursive: true });
const jsonPath = join(REPORTS_DIR, 'PHASE4-RESTORATION-GAP-INVENTORY.json');
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const md = [
  '# Phase 4 Restoration Gap Inventory',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  'This report is read-only. It does not publish, delete, move, or replace curriculum.',
  '',
  '| Classification | Count |',
  '| --- | ---: |',
  ...Object.entries(counts).sort().map(([name,count]) => `| ${name} | ${count} |`),
  '',
  '## Non-canonical rows',
  '',
  ...rows.filter((row) => row.classification !== 'canonical').map((row) => `- ${row.track} L${row.level} ${row.locale} lesson ${String(row.lessonNumber).padStart(3,'0')}: ${row.classification}`),
];
const mdPath = join(REPORTS_DIR, 'PHASE4-RESTORATION-GAP-INVENTORY.md');
writeFileSync(mdPath, `${md.join('\n')}\n`, 'utf8');
console.log(`Phase 4 restoration gap inventory written to ${jsonPath}`);
console.log(`Phase 4 restoration gap inventory written to ${mdPath}`);
