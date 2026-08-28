#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const registryPath = join(root, "content", "registries", "locales.json");
const curriculumRoot = join(root, "content", "curriculum");
const legacyRoot = join(root, "content", "courses");
const outputPath = join(root, "content", "generated", "translation-manifest.json");

const errors = [];
const warnings = [];
const lessons = {};

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalLocale(input) {
  if (!input) return null;
  const normalized = String(input).trim().replaceAll("_", "-");
  if (normalized.toLowerCase() === "es-caribbean") return "es-Caribbean";
  try {
    return Intl.getCanonicalLocales(normalized)[0] ?? null;
  } catch {
    return null;
  }
}

function lessonIdFrom(value) {
  const match = String(value ?? "").toUpperCase().match(/([A-Z]+-L\d+-\d{3})/u);
  return match?.[1] ?? null;
}

function ensureLesson(id) {
  return (lessons[id] ??= { id, canonical: null, translations: {}, legacyPartials: {} });
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${relative(root, path)}: invalid JSON (${error.message})`);
    return null;
  }
}

function loadLocaleRegistry() {
  const parsed = readJson(registryPath);
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.locales)) {
    throw new Error("content/registries/locales.json must contain a locales array");
  }

  const localeMap = new Map();
  for (const entry of parsed.locales) {
    const locale = canonicalLocale(entry?.locale);
    if (!locale) {
      errors.push(`locale registry contains invalid locale: ${String(entry?.locale ?? "")}`);
      continue;
    }
    if (localeMap.has(locale)) {
      errors.push(`locale registry contains duplicate locale: ${locale}`);
      continue;
    }
    localeMap.set(locale, entry);
  }

  const defaultLocale = canonicalLocale(parsed.defaultLocale);
  if (!defaultLocale || !localeMap.has(defaultLocale)) {
    errors.push(`default locale ${String(parsed.defaultLocale ?? "")} is not registered`);
  }

  for (const [locale, entry] of localeMap) {
    if (!Array.isArray(entry.fallbackChain)) {
      errors.push(`${locale}: fallbackChain must be an array`);
      continue;
    }
    for (const fallback of entry.fallbackChain) {
      if (!canonicalLocale(fallback)) errors.push(`${locale}: invalid fallback locale ${String(fallback)}`);
    }
  }

  return { parsed, localeMap, defaultLocale };
}

const { parsed: localeRegistry, localeMap: knownLocales, defaultLocale } = loadLocaleRegistry();

function normalizeTranslationValue(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const summary = typeof value.summary === "string" ? value.summary.trim() : "";
  const body = typeof value.body === "string" ? value.body.trim() : "";
  return { ...value, title, summary, body };
}

function addTranslation({ id, rawLocale, value, path }) {
  const locale = canonicalLocale(rawLocale);
  const relativePath = relative(root, path).replaceAll("\\", "/");
  if (!id || !locale) return;

  if (!knownLocales.has(locale)) {
    warnings.push(`${relativePath}: ${id} uses unregistered locale ${locale}; skipped`);
    return;
  }

  const normalized = normalizeTranslationValue(value);
  if (!normalized) return;

  const missing = ["title", "summary", "body"].filter((key) => !normalized[key]);
  if (missing.length) {
    const lesson = ensureLesson(id);
    lesson.legacyPartials[locale] ??= [];
    lesson.legacyPartials[locale].push({ path: relativePath, missing });
    warnings.push(
      `${relativePath}: ${id} [${locale}] is a legacy/partial artifact missing ${missing.join(", ")}; excluded from published coverage`,
    );
    return;
  }

  const translationChecksum = `sha256:${hash(JSON.stringify(normalized))}`;
  const lesson = ensureLesson(id);
  const existing = lesson.translations[locale];
  if (existing && existing.checksum !== translationChecksum) {
    errors.push(`${id} [${locale}]: conflicting complete translations (${existing.path} vs ${relativePath})`);
    return;
  }

  lesson.translations[locale] = {
    status: "published",
    path: relativePath,
    checksum: translationChecksum,
    sourceVersion: normalized.sourceVersion ?? null,
    stale: Boolean(
      normalized.sourceVersion &&
      lesson.canonical?.version &&
      String(normalized.sourceVersion) !== String(lesson.canonical.version),
    ),
  };
}

function extractTranslationRecords(parsed, path) {
  const records = Array.isArray(parsed) ? parsed : [parsed];

  for (const record of records) {
    if (!record || typeof record !== "object" || Array.isArray(record)) continue;
    const id = lessonIdFrom(record.id ?? record.lessonId) ?? lessonIdFrom(path);
    if (!id) continue;

    if (record.translations && typeof record.translations === "object" && !Array.isArray(record.translations)) {
      for (const [rawLocale, value] of Object.entries(record.translations)) {
        addTranslation({ id, rawLocale, value, path });
      }
    }

    if (record.locale) {
      addTranslation({ id, rawLocale: record.locale, value: record, path });
    }

    for (const [rawLocale, value] of Object.entries(record)) {
      if (["id", "lessonId", "locale", "translations", "metadata"].includes(rawLocale)) continue;
      const locale = canonicalLocale(rawLocale);
      if (!locale || !knownLocales.has(locale)) continue;
      addTranslation({ id, rawLocale: locale, value, path });
    }
  }
}

for (const path of walk(curriculumRoot).filter((candidate) => candidate.endsWith(".md"))) {
  const raw = readFileSync(path, "utf8");
  const id = lessonIdFrom(path) ?? lessonIdFrom(raw);
  if (!id) continue;
  const versionMatch = raw.match(/^version:\s*["']?([^\n"']+)/mu);
  ensureLesson(id).canonical = {
    path: relative(root, path).replaceAll("\\", "/"),
    version: versionMatch?.[1]?.trim() ?? null,
    checksum: `sha256:${hash(raw)}`,
  };
}

for (const path of walk(legacyRoot).filter((candidate) => candidate.endsWith(".json"))) {
  const parsed = readJson(path);
  if (parsed === null) continue;
  extractTranslationRecords(parsed, path);
}

for (const [id, lesson] of Object.entries(lessons)) {
  if (!lesson.canonical && Object.keys(lesson.translations).length) {
    errors.push(`${id}: complete translations exist without canonical lesson`);
  }
}

const canonicalLessonCount = Object.values(lessons).filter((lesson) => lesson.canonical).length;
const coverage = {};
for (const locale of knownLocales.keys()) {
  const translated = Object.values(lessons).filter((lesson) => lesson.canonical && lesson.translations[locale]).length;
  coverage[locale] = {
    translated,
    canonical: canonicalLessonCount,
    completePercent: canonicalLessonCount ? Number(((translated / canonicalLessonCount) * 100).toFixed(2)) : 0,
  };
}

const manifest = {
  schemaVersion: "1.2",
  generatedAt: new Date().toISOString(),
  defaultLocale: defaultLocale ?? localeRegistry.defaultLocale,
  lessonCount: canonicalLessonCount,
  translationCount: Object.values(lessons).reduce(
    (count, lesson) => count + Object.keys(lesson.translations).length,
    0,
  ),
  legacyPartialArtifactCount: Object.values(lessons).reduce(
    (count, lesson) =>
      count + Object.values(lesson.legacyPartials).reduce((subtotal, entries) => subtotal + entries.length, 0),
    0,
  ),
  coverage,
  errors,
  warnings,
  lessons,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `Localization manifest: ${manifest.lessonCount} canonical lessons, ${manifest.translationCount} complete translations, ${manifest.legacyPartialArtifactCount} legacy partial artifacts, ${errors.length} errors, ${warnings.length} warnings.`,
);
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
}
