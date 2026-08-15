#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const ROOT = process.cwd();
const REGISTRY = 'curriculum/registry.json';
const REMOVALS = 'curriculum/curriculum-removals.json';
const COURSE_DIRS = ['content/curriculum', 'content/courses'];
const ID_RE = /^[A-Z][A-Z0-9]*-L[1-9][0-9]*-[0-9]{3,}$/u;
const LOCALE_RE = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/u;

// The application historically uses this explicit regional alias in committed
// translation artifacts. Preserve it as a supported compatibility locale while
// requiring all other locale keys to follow the normal structured locale form.
const SUPPORTED_LEGACY_LOCALE_ALIASES = new Set(['es-Caribbean']);

function gitText(ref, path) {
  try {
    return execFileSync('git', ['show', `${ref}:${path}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

function parseRegistry(text) {
  if (!text) return [];
  const parsed = JSON.parse(text);
  const rows = [];
  for (const [trackCode, track] of Object.entries(parsed.tracks || {})) {
    for (const [levelKey, level] of Object.entries(track.levels || {})) {
      for (const asset of Object.values(level.assets || {})) {
        if (asset?.type !== 'lesson' || asset?.status !== 'active') continue;
        rows.push({
          id: String(asset.id || ''),
          track: String(asset.track || trackCode),
          level: Number(asset.level || levelKey),
          path: String(asset.path || ''),
        });
      }
    }
  }
  return rows;
}

function localeFromFilename(canonicalPath, localizedPath) {
  const base = basename(canonicalPath).replace(/\.md$/u, '');
  const name = basename(localizedPath);
  const match = name.match(
    new RegExp(
      `^${base.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\.([A-Za-z0-9-]+)\\.md$`,
      'u',
    ),
  );
  return match?.[1] || null;
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function addTranslationJsonLocalesFromWorktree(inventory) {
  for (const relDir of COURSE_DIRS) {
    for (const file of walk(join(ROOT, relDir))) {
      if (!file.endsWith('-translations.json')) continue;
      const parsed = JSON.parse(readFileSync(file, 'utf8'));
      const id = String(parsed.id || parsed.lesson_id || '').toUpperCase();
      if (!id || !inventory.has(id)) continue;
      for (const locale of Object.keys(parsed.translations || {})) {
        inventory.get(id).locales.add(locale);
      }
    }
  }
}

function localInventory() {
  const registryText = readFileSync(join(ROOT, REGISTRY), 'utf8');
  const lessons = parseRegistry(registryText);
  const result = new Map();

  for (const lesson of lessons) {
    const locales = new Set(['en']);
    const canonical = join(ROOT, lesson.path);
    if (!existsSync(canonical)) {
      throw new Error(`Registry lesson ${lesson.id} is missing file ${lesson.path}`);
    }

    const dir = dirname(canonical);
    const base = basename(canonical).replace(/\.md$/u, '');
    for (const name of readdirSync(dir)) {
      if (name === `${base}.md` || !name.startsWith(`${base}.`) || !name.endsWith('.md')) {
        continue;
      }
      const locale = localeFromFilename(lesson.path, join(dir, name));
      if (locale) locales.add(locale);
    }

    result.set(lesson.id, { ...lesson, locales });
  }

  addTranslationJsonLocalesFromWorktree(result);
  return result;
}

function refInventory(ref) {
  const lessons = parseRegistry(gitText(ref, REGISTRY));
  const result = new Map(
    lessons.map((lesson) => [lesson.id, { ...lesson, locales: new Set(['en']) }]),
  );

  let files = [];
  try {
    files = execFileSync('git', ['ls-tree', '-r', '--name-only', ref], {
      encoding: 'utf8',
    })
      .split(/\r?\n/u)
      .filter(Boolean);
  } catch {
    return result;
  }

  for (const lesson of result.values()) {
    const base = lesson.path.replace(/\.md$/u, '');
    for (const file of files) {
      if (file.startsWith(`${base}.`) && file.endsWith('.md')) {
        const locale = file.slice(base.length + 1, -3);
        if (locale) lesson.locales.add(locale);
      }
    }
  }

  for (const file of files.filter(
    (candidate) =>
      COURSE_DIRS.some((dir) => candidate.startsWith(`${dir}/`)) &&
      candidate.endsWith('-translations.json'),
  )) {
    const text = gitText(ref, file);
    if (!text) continue;
    try {
      const parsed = JSON.parse(text);
      const id = String(parsed.id || parsed.lesson_id || '').toUpperCase();
      if (!result.has(id)) continue;
      for (const locale of Object.keys(parsed.translations || {})) {
        result.get(id).locales.add(locale);
      }
    } catch {
      // Head/worktree validation reports malformed JSON. Historical malformed
      // JSON must not crash a preservation comparison.
    }
  }

  return result;
}

function approvedRemovals() {
  const parsed = JSON.parse(readFileSync(join(ROOT, REMOVALS), 'utf8'));
  return new Set(
    (parsed.removals || [])
      .map((record) => String(record.id || '').toUpperCase())
      .filter(Boolean),
  );
}

function isSupportedLocale(locale) {
  return LOCALE_RE.test(locale) || SUPPORTED_LEGACY_LOCALE_ALIASES.has(locale);
}

function validateHead(head) {
  const errors = [];
  const seen = new Set();

  for (const [id, lesson] of head) {
    if (!ID_RE.test(id)) errors.push(`Malformed canonical lesson ID: ${id}`);
    if (seen.has(id)) errors.push(`Duplicate canonical lesson ID: ${id}`);
    seen.add(id);

    for (const locale of lesson.locales) {
      if (!isSupportedLocale(locale)) {
        errors.push(`Malformed locale ${locale} on ${id}`);
      }
    }
  }

  return errors;
}

const baseRef = process.env.CURRICULUM_BASE_REF || process.argv[2] || 'origin/main';
const base = refInventory(baseRef);
const head = localInventory();
const removals = approvedRemovals();
const errors = validateHead(head);

for (const [id, previous] of base) {
  const current = head.get(id);
  if (!current) {
    if (!removals.has(id)) {
      errors.push(`Missing production lesson: ${id} (${previous.path})`);
    }
    continue;
  }

  for (const locale of previous.locales) {
    if (!current.locales.has(locale) && !removals.has(id)) {
      errors.push(`Missing production translation: ${id} locale=${locale}`);
    }
  }
}

const report = {
  baseRef,
  baseLessons: base.size,
  proposedLessons: head.size,
  baseTranslations: [...base.values()].reduce((count, lesson) => count + lesson.locales.size, 0),
  proposedTranslations: [...head.values()].reduce((count, lesson) => count + lesson.locales.size, 0),
  errors,
};

console.log(JSON.stringify(report, null, 2));

if (errors.length) {
  console.error('\nCURRICULUM PRESERVATION FAILURE');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nCurriculum Preservation Gate passed.');
