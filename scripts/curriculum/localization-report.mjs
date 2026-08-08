#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { REPORTS_DIR, repoPath } from './lib/paths.mjs';
import { listAllAssets, readRegistry } from './lib/registry.mjs';

const ACTIVE_CURRICULUM_LOCALES = ['en-US', 'es', 'fr-CA', 'fr-FR'];

function normalizeCurriculumLocale(locale) {
  if (!locale) return 'en';
  const trimmed = locale.trim();
  if (/^en(?:-|$)/i.test(trimmed)) return trimmed === 'en-US' ? 'en-US' : trimmed;
  if (/^es(?:-|$)/i.test(trimmed)) return trimmed === 'es' ? 'es' : trimmed;
  if (/^fr(?:-|$)/i.test(trimmed)) return trimmed;
  return trimmed;
}

function fallbackChain(locale) {
  const normalized = normalizeCurriculumLocale(locale);
  const chain = [normalized];
  const base = normalized.split('-')[0];
  if (base && base !== normalized) chain.push(base);
  if (!chain.includes('en')) chain.push('en');
  return chain;
}

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontMatter: {}, body: content };
  const frontMatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key) frontMatter[key] = value;
  }
  return { frontMatter, body: match[2] };
}

function missingFields(frontMatter, body) {
  const missing = [];
  if (!(frontMatter.title ?? '').trim()) missing.push('title');
  if (!(frontMatter.summary ?? '').trim()) missing.push('summary');
  if (!body.trim()) missing.push('body');
  return missing;
}

function localizedPathFor(canonicalPath, locale) {
  if (locale === 'en') return canonicalPath;
  return canonicalPath.replace(/\.md$/u, `.${locale}.md`);
}

function summarizeLocale(asset, locale) {
  const canonicalPath = repoPath(asset.path);
  const canonicalContent = readFileSync(canonicalPath, 'utf8');
  const canonicalParsed = parseFrontMatter(canonicalContent);
  const candidates = fallbackChain(locale);
  const attempts = [];

  for (const [index, candidate] of candidates.entries()) {
    const candidatePath = localizedPathFor(canonicalPath, candidate);
    const exists = candidate === 'en' ? true : existsSync(candidatePath);
    if (!exists) {
      attempts.push({ locale: candidate, exists: false, path: candidatePath, missingFields: ['file'] });
      continue;
    }

    const content = readFileSync(candidatePath, 'utf8');
    const parsed = parseFrontMatter(content);
    const completeness = candidate === 'en' ? [] : missingFields(parsed.frontMatter, parsed.body);
    const validationErrors = [];
    if ((parsed.frontMatter.id ?? '').trim() !== asset.assetId) {
      validationErrors.push(`expected canonical lesson id ${asset.assetId}`);
    }
    const valid = validationErrors.length === 0 && completeness.length === 0;

    attempts.push({
      locale: candidate,
      exists: true,
      path: candidatePath,
      missingFields: completeness,
      validationErrors,
      validationWarnings: [],
      valid,
    });

    if (candidate === 'en' || valid) {
      return {
        requestedLocale: locale,
        resolvedLocale: candidate === 'en' ? 'en' : candidate,
        resolution: index === 0 ? 'exact' : candidate === 'en' ? 'canonical-en' : 'base',
        fallbackRequired: index > 0,
        localized: candidate !== 'en',
        titleComplete: Boolean((parsed.frontMatter.title ?? '').trim()),
        summaryComplete: Boolean((parsed.frontMatter.summary ?? '').trim()),
        bodyComplete: Boolean(parsed.body.trim()),
        attempts,
      };
    }
  }

  return {
    requestedLocale: locale,
    resolvedLocale: 'en',
    resolution: 'canonical-en',
    fallbackRequired: true,
    localized: false,
    titleComplete: Boolean((canonicalParsed.frontMatter.title ?? '').trim()),
    summaryComplete: Boolean((canonicalParsed.frontMatter.summary ?? '').trim()),
    bodyComplete: Boolean(canonicalParsed.body.trim()),
    attempts,
  };
}

const registry = readRegistry();
const assets = listAllAssets(registry).filter((asset) => asset.type === 'lesson' && asset.status === 'active');
const generatedAt = new Date().toISOString();
const reportRows = [];
const summaryByLocale = Object.fromEntries(
  ACTIVE_CURRICULUM_LOCALES.map((locale) => [locale, {
    totalLessons: assets.length,
    exactLocalized: 0,
    baseLocalized: 0,
    englishFallback: 0,
    incompleteLocalizedFiles: 0,
  }]),
);

for (const asset of assets) {
  for (const locale of ACTIVE_CURRICULUM_LOCALES) {
    const status = summarizeLocale(asset, locale);
    reportRows.push({
      lessonId: asset.assetId,
      track: asset.trackCode,
      level: asset.level,
      canonicalPath: asset.path,
      ...status,
    });

    if (status.localized && status.resolution === 'exact') summaryByLocale[locale].exactLocalized += 1;
    if (status.localized && status.resolution === 'base') summaryByLocale[locale].baseLocalized += 1;
    if (!status.localized) summaryByLocale[locale].englishFallback += 1;
    if (status.attempts.some((attempt) => attempt.exists && (attempt.missingFields?.length || attempt.validationErrors?.length))) {
      summaryByLocale[locale].incompleteLocalizedFiles += 1;
    }
  }
}

const jsonReport = {
  generatedAt,
  locales: ACTIVE_CURRICULUM_LOCALES,
  totalCanonicalLessons: assets.length,
  summaryByLocale,
  lessons: reportRows,
};

mkdirSync(REPORTS_DIR, { recursive: true });
const jsonPath = join(REPORTS_DIR, 'CURRICULUM-LOCALIZATION-COVERAGE.json');
writeFileSync(jsonPath, `${JSON.stringify(jsonReport, null, 2)}\n`, 'utf8');

const lines = [
  '# Curriculum Localization Coverage Report',
  '',
  `**Generated:** ${generatedAt}`,
  `**Canonical lessons audited:** ${assets.length}`,
  `**Locales audited:** ${ACTIVE_CURRICULUM_LOCALES.join(', ')}`,
  '',
  '## Locale Summary',
  '',
  '| Locale | Exact localized | Base fallback | English fallback | Incomplete localized files |',
  '| ------ | --------------- | ------------- | ---------------- | -------------------------- |',
];

for (const locale of ACTIVE_CURRICULUM_LOCALES) {
  const summary = summaryByLocale[locale];
  lines.push(`| ${locale} | ${summary.exactLocalized} | ${summary.baseLocalized} | ${summary.englishFallback} | ${summary.incompleteLocalizedFiles} |`);
}

lines.push('', '## Fallback-required lessons', '');
for (const locale of ACTIVE_CURRICULUM_LOCALES) {
  const fallbackRows = reportRows.filter((row) => row.requestedLocale === locale && row.fallbackRequired);
  lines.push(`### ${locale}`);
  if (fallbackRows.length === 0) {
    lines.push('- None');
  } else {
    for (const row of fallbackRows.slice(0, 50)) {
      lines.push(`- ${row.lessonId}: resolved ${row.resolvedLocale} via ${row.resolution}`);
    }
    if (fallbackRows.length > 50) {
      lines.push(`- ...and ${fallbackRows.length - 50} more`);
    }
  }
  lines.push('');
}

const mdPath = join(REPORTS_DIR, 'CURRICULUM-LOCALIZATION-COVERAGE.md');
writeFileSync(mdPath, `${lines.join('\n')}\n`, 'utf8');

console.log(`Localization coverage written to ${jsonPath}`);
console.log(`Localization coverage written to ${mdPath}`);
