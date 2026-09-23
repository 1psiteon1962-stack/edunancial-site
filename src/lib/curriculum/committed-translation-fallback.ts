import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import type { PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";
import { getCurriculumLocaleFallbackChain, resolveCurriculumLocale } from "@/lib/curriculum/localization";
import { curriculumRuntimeMarkdown } from "@/generated/curriculum-runtime-manifest";

const REPO_ROOT = process.cwd();
const LESSON_ID = /^([A-Z]+)-L(\d+)-(\d{3})$/u;

function parseMarkdown(raw: string, lessonId: string): PublishedLessonTranslation | null {
  let body = raw.trim();
  const frontMatter: Record<string, string> = {};
  if (body.startsWith("---")) {
    const parts = body.split("---");
    if (parts.length >= 3) {
      for (const line of (parts[1] ?? "").split(/\r?\n/u)) {
        const i = line.indexOf(":");
        if (i < 0) continue;
        const key = line.slice(0, i).trim();
        const value = line.slice(i + 1).trim().replace(/^['\"]|['\"]$/g, "");
        if (key) frontMatter[key] = value;
      }
      body = parts.slice(2).join("---").trim();
    }
  }
  const heading = body.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  const title = frontMatter.title?.trim() || heading?.replace(new RegExp(`^${lessonId}:?\\s*`, "iu"), "").trim();
  const explicitSummary = frontMatter.summary?.trim() || frontMatter.description?.trim();
  const proseParagraphs = body
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.replace(/^#+\s+.*$/gmu, "").trim())
    .filter((paragraph) =>
      paragraph.length >= 80 &&
      !/^(?:[-*+]\s|\d+[.)]\s|>\s)/u.test(paragraph) &&
      !paragraph.includes("\n- ") &&
      !paragraph.includes("\n1. "),
    );
  const derivedSummary = proseParagraphs[0]?.replace(/\s+/gu, " ").trim();
  const summary = explicitSummary || derivedSummary;
  if (!title && !summary && !body) return null;
  return { ...(title ? { title } : {}), ...(summary ? { summary } : {}), ...(body ? { body } : {}) };
}

function localeTokens(locale: string): string[] {
  const normalized = resolveCurriculumLocale(locale);
  const values = new Set<string>([normalized, normalized.toLowerCase()]);
  const base = normalized.split("-")[0];
  if (base) values.add(base);
  return [...values].filter((value) => value !== "en" && value !== "en-US");
}

type TranslationEntry = { locale: string; translation: PublishedLessonTranslation };
let committedIndex: Map<string, TranslationEntry[]> | null = null;

function bundledTranslationLookup(lessonId: string, languageOrLocale: string): PublishedLessonTranslation | undefined {
  const requested = resolveCurriculumLocale(languageOrLocale);
  const idNeedle = lessonId.trim().toLowerCase();
  for (const candidateLocale of getCurriculumLocaleFallbackChain(requested)) {
    const normalized = resolveCurriculumLocale(candidateLocale);
    if (normalized === "en" || normalized === "en-US") break;
    const tokens = localeTokens(normalized).map((token) => token.toLowerCase().replaceAll("_", "-"));
    for (const record of curriculumRuntimeMarkdown) {
      const recordPath = record.path.toLowerCase().replaceAll("_", "-");
      if (!recordPath.includes(idNeedle) || !tokens.some((token) =>
        recordPath.includes(`/${token}/`) ||
        recordPath.endsWith(`.${token}.md`) ||
        recordPath.endsWith(`-${token}.md`) ||
        recordPath.includes(`-${token}-`)
      )) continue;
      const translation = parseMarkdown(record.content, lessonId.trim().toUpperCase());
      if (translation && isCompleteLocaleTranslation(translation, normalized)) return translation;
    }
  }
  return undefined;
}

function localeFromPath(path: string, lessonId: string): string | null {
  const normalizedPath = path.replaceAll("\\", "/");
  const filename = normalizedPath.split("/").pop() ?? "";
  const escapedId = lessonId.replaceAll("-", "\\-");
  const sidecar = filename.match(new RegExp(`${escapedId}\\.([A-Za-z]{2}(?:[-_][A-Za-z]{2})?)\\.md$`, "iu"));
  if (sidecar?.[1]) return resolveCurriculumLocale(sidecar[1].replaceAll("_", "-"));
  const segments = normalizedPath.split("/");
  const levelIndex = segments.findIndex((segment) => /^level-\\d+$/iu.test(segment));
  const directoryLocale = levelIndex >= 0 ? segments[levelIndex + 1] : undefined;
  if (directoryLocale && /^[a-z]{2}(?:[-_][a-z]{2})?$/iu.test(directoryLocale)) {
    return resolveCurriculumLocale(directoryLocale.replaceAll("_", "-"));
  }
  const lower = filename.toLowerCase();
  const known = ["es-caribbean", "es-es", "fr-ca", "fr-fr", "pt-br", "pt-pt", "de", "it", "nl", "es", "fr", "pt"];
  const token = known.find((candidate) => lower.includes(`-${candidate}-`) || lower.endsWith(`-${candidate}.md`));
  return token ? resolveCurriculumLocale(token) : null;
}

function walk(root: string, files: string[] = []): string[] {
  if (!existsSync(root)) return files;
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (name.toLowerCase().endsWith(".md")) files.push(path);
  }
  return files;
}

function directTranslationLookup(lessonId: string, languageOrLocale: string): PublishedLessonTranslation | undefined {
  const match = lessonId.trim().toUpperCase().match(LESSON_ID);
  if (!match) return undefined;
  const [, track, level] = match;
  const requested = resolveCurriculumLocale(languageOrLocale);
  for (const candidateLocale of getCurriculumLocaleFallbackChain(requested)) {
    const normalized = resolveCurriculumLocale(candidateLocale);
    if (normalized === "en" || normalized === "en-US") break;
    const localeNames = Array.from(new Set([
      normalized,
      normalized.toLowerCase(),
      normalized.replaceAll("-", "_"),
      normalized.replaceAll("-", "_").toLowerCase(),
    ]));
    const currentPath = join(REPO_ROOT, "content", "curriculum", track, `L${level}`, `${lessonId.toUpperCase()}.${normalized}.md`);
    if (existsSync(currentPath) && statSync(currentPath).isFile()) {
      const translation = parseMarkdown(readFileSync(currentPath, "utf8"), lessonId.toUpperCase());
      if (translation && isCompleteLocaleTranslation(translation, normalized)) return translation;
    }
    for (const localeName of localeNames) {
      const legacyDir = join(REPO_ROOT, "content", "courses", track.toLowerCase(), `level-${level}`, localeName);
      if (!existsSync(legacyDir) || !statSync(legacyDir).isDirectory()) continue;
      const idNeedle = lessonId.toLowerCase();
      for (const filename of readdirSync(legacyDir)) {
        if (!filename.toLowerCase().endsWith(".md") || !filename.toLowerCase().includes(idNeedle)) continue;
        const path = join(legacyDir, filename);
        if (!statSync(path).isFile()) continue;
        const translation = parseMarkdown(readFileSync(path, "utf8"), lessonId.toUpperCase());
        if (translation && isCompleteLocaleTranslation(translation, normalized)) return translation;
      }
    }
  }
  return undefined;
}

function buildIndex(): Map<string, TranslationEntry[]> {
  const index = new Map<string, TranslationEntry[]>();
  for (const root of [join(REPO_ROOT, "content", "curriculum"), join(REPO_ROOT, "content", "courses")]) {
    for (const path of walk(root)) {
      const lessonId = path.toUpperCase().match(/([A-Z]+-L\\d+-\\d{3})/u)?.[1];
      if (!lessonId) continue;
      const locale = localeFromPath(path, lessonId);
      if (!locale || locale === "en" || locale === "en-US") continue;
      const translation = parseMarkdown(readFileSync(path, "utf8"), lessonId);
      if (!translation || !isCompleteLocaleTranslation(translation, locale)) continue;
      const entries = index.get(lessonId) ?? [];
      entries.push({ locale, translation });
      index.set(lessonId, entries);
    }
  }
  return index;
}

function looksItalian(text: string | undefined): boolean {
  if (!text) return false;
  return /\b(che|gli|della|delle|degli|sono|come|perché|obiettivi|contenuto|esempio|risposte|chiave|imparare|lezione|questa|questo|quando|dove|anche|può|più)\b/iu.test(text);
}

function isCompleteLocaleTranslation(translation: PublishedLessonTranslation, locale: string): boolean {
  const base = resolveCurriculumLocale(locale).split("-")[0]?.toLowerCase();
  if (!translation.title?.trim() || !translation.body?.trim()) return false;
  // Never allow a mixed/English body to override the canonical lesson merely because
  // a translated heading exists. Italian committed lessons must contain substantive
  // Italian body text; this also rejects PURPLE's historical partial files.
  if (base === "it") return looksItalian(translation.body);
  return true;
}

function localeMatchesRequested(entryLocale: string, requestedLocale: string): boolean {
  const entry = resolveCurriculumLocale(entryLocale);
  const requested = resolveCurriculumLocale(requestedLocale);
  if (entry === requested) return true;
  const entryBase = entry.split("-")[0]?.toLowerCase();
  const requestedBase = requested.split("-")[0]?.toLowerCase();
  // Base-language fallback is safe only when the request itself is a base locale.
  // Do not let es-ES satisfy es-Caribbean (or pt-PT satisfy pt-BR) merely because
  // another regional translation happens to be indexed first.
  return !requested.includes("-") && entryBase === requestedBase;
}

export function getCommittedLessonTranslation(lessonId: string, languageOrLocale: string): PublishedLessonTranslation | undefined {
  const requested = resolveCurriculumLocale(languageOrLocale);
  if (requested === "en" || requested === "en-US") return undefined;
  const bundled = bundledTranslationLookup(lessonId, requested);
  if (bundled) return bundled;
  const direct = directTranslationLookup(lessonId, requested);
  if (direct) return direct;
  committedIndex ??= buildIndex();
  const entries = committedIndex.get(lessonId.trim().toUpperCase());
  if (!entries?.length) return undefined;
  for (const candidateLocale of getCurriculumLocaleFallbackChain(requested)) {
    if (candidateLocale === "en" || candidateLocale === "en-US") break;
    const normalized = resolveCurriculumLocale(candidateLocale);
    const exact = entries.find((entry) => entry.locale === normalized);
    if (exact) return exact.translation;
    const sameLocale = entries.find((entry) => localeMatchesRequested(entry.locale, normalized));
    if (sameLocale) return sameLocale.translation;
  }
  return undefined;
}

export function resetCommittedTranslationIndexForTests(): void {
  committedIndex = null;
}
