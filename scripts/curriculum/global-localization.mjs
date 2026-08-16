#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const registryPath = join(root, "content", "registries", "locales.json");
const curriculumRoot = join(root, "content", "curriculum");
const legacyRoot = join(root, "content", "courses");
const outputPath = join(root, "content", "generated", "translation-manifest.json");
const localeRegistry = JSON.parse(readFileSync(registryPath, "utf8"));
const knownLocales = new Set(localeRegistry.locales.map((x) => x.locale));
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
function hash(value) { return createHash("sha256").update(value).digest("hex"); }
function canonicalLocale(input) {
  try { return Intl.getCanonicalLocales(input)[0] ?? input; } catch { return input; }
}
function lessonIdFrom(value) {
  const match = String(value ?? "").toUpperCase().match(/([A-Z]+-L\d+-\d{3})/u);
  return match?.[1] ?? null;
}
function ensureLesson(id) {
  return (lessons[id] ??= { id, canonical: null, translations: {} });
}
function readJson(path) {
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { errors.push(`${relative(root,path)}: invalid JSON (${error.message})`); return null; }
}

// Canonical Markdown remains authoritative during compatibility phase.
for (const path of walk(curriculumRoot).filter((p) => p.endsWith(".md"))) {
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

// Compatibility discovery: current per-file translation JSONs remain valid.
for (const path of walk(legacyRoot).filter((p) => p.endsWith(".json"))) {
  const parsed = readJson(path);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") continue;
  const id = lessonIdFrom(parsed.id) ?? lessonIdFrom(path);
  if (!id) continue;
  const localeKeys = Object.keys(parsed).filter((key) => key !== "id" && parsed[key] && typeof parsed[key] === "object");
  for (const rawLocale of localeKeys) {
    const locale = canonicalLocale(rawLocale);
    if (!knownLocales.has(locale)) {
      warnings.push(`${relative(root,path)}: locale ${locale} is not yet registered; skipped`);
      continue;
    }
    const value = parsed[rawLocale];
    const missing = ["title", "summary", "body"].filter((key) => typeof value[key] !== "string" || !value[key].trim());
    if (missing.length) {
      errors.push(`${relative(root,path)}: ${id} [${locale}] missing ${missing.join(", ")}`);
      continue;
    }
    const lesson = ensureLesson(id);
    if (lesson.translations[locale] && lesson.translations[locale].checksum !== `sha256:${hash(JSON.stringify(value))}`) {
      errors.push(`${id} [${locale}]: conflicting duplicate translations`);
      continue;
    }
    lesson.translations[locale] = {
      status: "published",
      path: relative(root,path).replaceAll("\\", "/"),
      checksum: `sha256:${hash(JSON.stringify(value))}`,
      sourceVersion: value.sourceVersion ?? null,
      stale: Boolean(value.sourceVersion && lesson.canonical?.version && String(value.sourceVersion) !== String(lesson.canonical.version)),
    };
  }
}

for (const [id, lesson] of Object.entries(lessons)) {
  if (!lesson.canonical && Object.keys(lesson.translations).length) errors.push(`${id}: translations exist without canonical lesson`);
}

const manifest = {
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  defaultLocale: localeRegistry.defaultLocale,
  lessonCount: Object.values(lessons).filter((x) => x.canonical).length,
  translationCount: Object.values(lessons).reduce((n,x) => n + Object.keys(x.translations).length, 0),
  errors,
  warnings,
  lessons,
};
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Localization manifest: ${manifest.lessonCount} canonical lessons, ${manifest.translationCount} translations, ${errors.length} errors, ${warnings.length} warnings.`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
}
