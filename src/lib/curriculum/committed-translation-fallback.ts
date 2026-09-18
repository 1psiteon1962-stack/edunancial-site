import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";
import { getCurriculumLocaleFallbackChain, resolveCurriculumLocale } from "@/lib/curriculum/localization";

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
  const summary = frontMatter.summary?.trim() || frontMatter.description?.trim();
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

function deterministicCandidates(lessonId: string, locale: string): string[] {
  const match = lessonId.toUpperCase().match(LESSON_ID);
  if (!match) return [];
  const [, track, level] = match;
  const trackLower = track.toLowerCase();
  const idLower = lessonId.toLowerCase();
  const paths: string[] = [];
  for (const token of localeTokens(locale)) {
    const hyphen = token.toLowerCase();
    const underscore = hyphen.replaceAll("-", "_");
    // Preferred canonical layout. This is O(1) and works for newly imported translations.
    paths.push(join(REPO_ROOT, "content", "curriculum", track, `L${level}`, `${lessonId}.${token}.md`));
    paths.push(join(REPO_ROOT, "content", "curriculum", track, `L${level}`, `${lessonId}.${hyphen}.md`));
    // Historical L1/L2/L3 packages use a deterministic directory/file convention.
    paths.push(join(REPO_ROOT, "content", "courses", trackLower, `level-${level}`, underscore,
      `${trackLower}-l${level}-${hyphen}-complete-${idLower}-${hyphen}.md`));
    paths.push(join(REPO_ROOT, "content", "courses", trackLower, `level-${level}`, underscore,
      `${idLower}-${hyphen}.md`));
    // Uploaded curriculum packages are not consistent about their filename prefix.
    // WHITE uses e.g. white-l1-it-complete-white-l1-001-it.md while PURPLE uses
    // purple-level-1-purple-l1-001-it.md. Search only the resolved locale directory
    // and require the exact lesson id + locale suffix, so every track gets the same fallback.
    const localeDirs = [
      join(REPO_ROOT, "content", "courses", trackLower, `level-${level}`, underscore),
      join(REPO_ROOT, "content", "courses", trackLower, `level-${level}`, hyphen),
      join(REPO_ROOT, "content", "curriculum", track, `L${level}`, underscore),
      join(REPO_ROOT, "content", "curriculum", track, `L${level}`, hyphen),
    ];
    for (const localeDir of localeDirs) try {
      for (const filename of readdirSync(localeDir)) {
        const lower = filename.toLowerCase();
        if (lower.endsWith(".md") && lower.includes(idLower) && lower.endsWith(`-${hyphen}.md`)) {
          paths.push(join(localeDir, filename));
        }
      }
    } catch {
      // Optional historical locale directory may not exist.
    }
  }
  return [...new Set(paths)];
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

export function getCommittedLessonTranslation(lessonId: string, languageOrLocale: string): PublishedLessonTranslation | undefined {
  const requested = resolveCurriculumLocale(languageOrLocale);
  if (requested === "en" || requested === "en-US") return undefined;
  for (const candidateLocale of getCurriculumLocaleFallbackChain(requested)) {
    if (candidateLocale === "en" || candidateLocale === "en-US") break;
    for (const path of deterministicCandidates(lessonId.trim().toUpperCase(), candidateLocale)) {
      try {
        if (!existsSync(path)) continue;
        const translation = parseMarkdown(readFileSync(path, "utf8"), lessonId.trim().toUpperCase());
        if (translation && isCompleteLocaleTranslation(translation, candidateLocale)) return translation;
      } catch {
        // A missing/unreadable optional translation must never crash a public Server Component.
        continue;
      }
    }
  }
  return undefined;
}

export function resetCommittedTranslationIndexForTests(): void {
  // Kept for API compatibility. Deterministic lookup has no process-wide mutable index.
}
