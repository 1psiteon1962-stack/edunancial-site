import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import type { PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";
import { getCurriculumLocaleFallbackChain, resolveCurriculumLocale } from "@/lib/curriculum/localization";

const COURSE_ROOT = join(process.cwd(), "content", "courses");
const CURRICULUM_ROOT = join(process.cwd(), "content", "curriculum");
const LESSON_ID = /([A-Z]+-L\d+-\d{3})/iu;

type TranslationEntry = { locale: string; translation: PublishedLessonTranslation };
let committedIndex: Map<string, TranslationEntry[]> | null = null;

function normalizeLocaleToken(value: string): string { return resolveCurriculumLocale(value.replaceAll("_", "-")); }
function localeFromPath(path: string, lessonId: string): string | null {
  const normalized = path.replaceAll("\\", "/"); const filename = normalized.split("/").pop() ?? "";
  const sibling = filename.match(new RegExp(`${lessonId.replaceAll("-", "\\-")}\\.([A-Za-z]{2}(?:[-_][A-Za-z]{2})?)\\.md$`, "iu"));
  if (sibling?.[1]) return normalizeLocaleToken(sibling[1]);
  const segments = normalized.split("/"); const levelIndex = segments.findIndex((segment) => /^level-\d+$/iu.test(segment));
  if (levelIndex >= 0 && segments[levelIndex + 1] && /^[a-z]{2}(?:[-_][a-z]{2})?$/iu.test(segments[levelIndex + 1])) return normalizeLocaleToken(segments[levelIndex + 1]);
  const lower = filename.toLowerCase(); const known = ["es-caribbean", "es-es", "fr-ca", "fr-fr", "pt-br", "pt-pt", "de", "it", "nl", "es", "fr", "pt"];
  const token = known.find((candidate) => lower.includes(`-${candidate}-`) || lower.endsWith(`-${candidate}.md`)); return token ? normalizeLocaleToken(token) : null;
}
function parseMarkdown(raw: string, lessonId: string): PublishedLessonTranslation | null {
  let body = raw.trim(); const frontMatter: Record<string, string> = {};
  if (body.startsWith("---")) { const parts = body.split("---"); if (parts.length >= 3) { for (const line of (parts[1] ?? "").split(/\r?\n/u)) { const i = line.indexOf(":"); if (i < 0) continue; const key = line.slice(0, i).trim(); const value = line.slice(i + 1).trim().replace(/^['\"]|['\"]$/g, ""); if (key) frontMatter[key] = value; } body = parts.slice(2).join("---").trim(); } }
  const heading = body.match(/^#\s+(.+)$/mu)?.[1]?.trim(); const title = frontMatter.title?.trim() || heading?.replace(new RegExp(`^${lessonId}:?\\s*`, "iu"), "").trim(); const summary = frontMatter.summary?.trim() || frontMatter.description?.trim();
  if (!title && !summary && !body) return null; return { ...(title ? { title } : {}), ...(summary ? { summary } : {}), ...(body ? { body } : {}) };
}
function walk(root: string, files: string[] = []): string[] { if (!existsSync(root)) return files; for (const name of readdirSync(root)) { const path = join(root, name); if (statSync(path).isDirectory()) walk(path, files); else if (name.toLowerCase().endsWith(".md")) files.push(path); } return files; }
function buildIndex(): Map<string, TranslationEntry[]> {
  const index = new Map<string, TranslationEntry[]>(); for (const path of [...walk(CURRICULUM_ROOT), ...walk(COURSE_ROOT)]) { const lessonId = path.toUpperCase().match(LESSON_ID)?.[1]?.toUpperCase(); if (!lessonId) continue; const locale = localeFromPath(path, lessonId); if (!locale || locale === "en" || locale === "en-US") continue; const translation = parseMarkdown(readFileSync(path, "utf8"), lessonId); if (!translation) continue; const entries = index.get(lessonId) ?? []; if (path.replaceAll("\\", "/").includes("/content/curriculum/")) entries.unshift({ locale, translation }); else entries.push({ locale, translation }); index.set(lessonId, entries); } return index;
}
export function getCommittedLessonTranslation(lessonId: string, languageOrLocale: string): PublishedLessonTranslation | undefined {
  const requested = resolveCurriculumLocale(languageOrLocale); if (requested === "en" || requested === "en-US") return undefined; committedIndex ??= buildIndex(); const entries = committedIndex.get(lessonId.trim().toUpperCase()); if (!entries?.length) return undefined;
  for (const candidate of getCurriculumLocaleFallbackChain(requested)) { const normalized = resolveCurriculumLocale(candidate); const exact = entries.find((entry) => entry.locale === normalized); if (exact) return exact.translation; const base = normalized.split("-")[0]; const sameBase = entries.find((entry) => entry.locale.split("-")[0] === base); if (sameBase) return sameBase.translation; } return undefined;
}
export function resetCommittedTranslationIndexForTests(): void { committedIndex = null; }
