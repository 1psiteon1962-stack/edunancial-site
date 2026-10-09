/**
 * PRODUCTION CURRICULUM AUDITOR
 *
 * The learner-facing resolver is the only authority. For each coordinate
 * (track × level × locale) this module calls the SAME functions the learner
 * pages call:
 *   - discovery:  getRuntimePublishedTrack()  (src/app/(public)/curriculum/[track]/[level]/page.tsx)
 *   - retrieval:  getRuntimePublishedLesson() (src/app/(public)/curriculum/[track]/[level]/[lesson]/page.tsx)
 *
 * A lesson counts as retrievable in a non-English locale ONLY when the learner
 * receives that locale's body. English fallback is reported, never counted.
 *
 * For every lesson that is not retrievable it inspects each storage layer
 * directly (bypassing indexes) and names the layer where the lesson disappears.
 *
 * This module is strictly READ-ONLY. It never writes publication state.
 */
import { ACADEMIES } from "@/lib/curriculum/academies";
import { getLastAtomicReadDiagnostics, readAtomicLessonIndex, readAtomicLessonObject, type AtomicReadDiagnostics } from "@/lib/curriculum/atomic-published-store";
import { getLessonContent } from "@/lib/curriculum/reader";
import { getRuntimePublishedLesson, getRuntimePublishedTrack } from "@/lib/curriculum/runtime-localization";
import { readTranslationPackageForLesson, readTranslationPackagesForLocale, sameLocale } from "@/lib/curriculum/translation-package-store";
import { LANGUAGE_CATALOG } from "@/lib/international/languages";
import { getNeonSql } from "@/lib/db/neon";

export const AUDIT_TRACKS = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"] as const;
export const AUDIT_LEVELS = [1, 2, 3, 4, 5] as const;
export const AUDIT_LESSONS_PER_LEVEL = 50;
/** Every locale the site offers learners. Derived from the catalog, never hard-wired. */
export function auditLocales(): string[] { return LANGUAGE_CATALOG.map((language) => language.code); }

export type LayerPresence = {
  gitCanonical: boolean;          // committed English lesson in Git
  gitLocaleFile: boolean;         // committed translation for this locale in Git
  atomicObject: boolean;          // durable lesson object exists (read directly, index bypassed)
  atomicObjectHasLocale: boolean; // durable lesson object carries this locale's translation
  atomicIndexed: boolean;         // lesson id present in the atomic lesson index
  translationPackage: boolean;    // locale translation package holds this lesson
  discovered: boolean;            // listed on the learner level page
  retrieved: boolean;             // lesson page returns a body
  servedLocale: string | null;    // locale whose body the learner actually receives
  servedSource: string | null;
};

export type LessonFailure = { lessonId: string; disappearsAt: string; layers: LayerPresence };

export type CoordinateAudit = {
  track: string;
  level: number;
  locale: string;
  expectedLessonCount: number;
  discoveredLessonCount: number;
  retrievableLessonCount: number;
  englishFallbackLessonCount: number;
  missingLessonIDs: string[];
  englishFallbackLessonIDs: string[];
  firstLessonRetrievable: boolean;
  lastLessonRetrievable: boolean;
  source: Record<string, number>;
  runtimeStatus: "PASS" | "FAIL";
  failures: LessonFailure[];
  receipts: { state: string; count: number }[] | { error: string };
  durationMs: number;
};

const ENGLISH = new Set(["en", "en-us"]);
function isEnglish(locale: string) { return ENGLISH.has(locale.toLowerCase()); }
function expectedIds(track: string, level: number) {
  return Array.from({ length: AUDIT_LESSONS_PER_LEVEL }, (_, index) => `${track}-L${level}-${String(index + 1).padStart(3, "0")}`);
}
function servedInLocale(servedLocale: string | undefined, locale: string) {
  if (isEnglish(locale)) return true;
  return Boolean(servedLocale && servedLocale !== "en" && sameLocale(servedLocale, locale));
}

function classify(layers: LayerPresence, english: boolean): string {
  const stored = layers.gitCanonical || layers.atomicObject;
  if (!stored) return "NOT IN ANY STORE — never published to Git or the durable store (or the durable object was deleted)";
  if (layers.atomicObject && !layers.gitCanonical && !layers.atomicIndexed) return "DURABLE OBJECT EXISTS BUT IS MISSING FROM THE ATOMIC LESSON INDEX — learner path cannot see it";
  if (!layers.discovered && !layers.retrieved) return "STORED BUT LEARNER RESOLVER RETURNS NOTHING — row unreadable, inactive, or overridden (see atomic diagnostics)";
  if (!layers.discovered) return "DISCOVERY/RETRIEVAL DISAGREE — lesson page works but the level page does not list it";
  if (!layers.retrieved) return "DISCOVERY/RETRIEVAL DISAGREE — listed on the level page but the lesson page returns nothing";
  if (english) return "RETRIEVED WITH EMPTY BODY";
  const hasTranslation = layers.gitLocaleFile || layers.atomicObjectHasLocale || layers.translationPackage;
  if (!hasTranslation) return "TRANSLATION NOT IN ANY STORE — learner receives English fallback";
  return `TRANSLATION STORED (${[layers.gitLocaleFile && "git", layers.atomicObjectHasLocale && "atomic-object", layers.translationPackage && "translation-package"].filter(Boolean).join(", ")}) BUT RESOLVER SERVES ${layers.servedLocale ?? "nothing"} — rejected by quality gate or locale-key mismatch`;
}

async function receiptStates(track: string, level: number, locale: string): Promise<CoordinateAudit["receipts"]> {
  try {
    const sql = getNeonSql();
    if (!sql) return { error: "Neon unavailable in this runtime" };
    const coordinates = [...new Set([`${track}:L${level}:${locale}`, ...(isEnglish(locale) ? [`${track}:L${level}:en`, `${track}:L${level}:en-US`] : [])])];
    const rows = await sql`select state, count(*)::int as count from curriculum_uploads where coordinate = any(${coordinates}::text[]) group by state order by state` as { state: string; count: number }[];
    return rows.map((row) => ({ state: String(row.state), count: Number(row.count) }));
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export async function auditCoordinate(track: string, level: number, locale: string, options: { atomicIndex?: Set<string> | null } = {}): Promise<CoordinateAudit> {
  const started = Date.now();
  const code = track.toUpperCase();
  const english = isEnglish(locale);
  const ids = expectedIds(code, level);

  // 1. Discovery — exactly what the learner level page renders.
  const runtimeTrack = await getRuntimePublishedTrack(code, locale);
  const levelLessons = runtimeTrack?.levels.find((entry) => entry.level === level)?.lessons ?? [];
  const discovered = new Map(levelLessons.map((lesson) => [lesson.id.toUpperCase(), lesson]));

  // 2. Retrieval — exactly what the learner lesson page renders, for every id.
  const retrievedById = new Map<string, Awaited<ReturnType<typeof getRuntimePublishedLesson>>>();
  for (let offset = 0; offset < ids.length; offset += 10) {
    const chunk = ids.slice(offset, offset + 10);
    const results = await Promise.all(chunk.map(async (id) => [id, await getRuntimePublishedLesson(id, locale).catch(() => null)] as const));
    for (const [id, lesson] of results) retrievedById.set(id, lesson);
  }

  const source: Record<string, number> = {};
  const missing: string[] = [];
  const fallback: string[] = [];
  const pass = new Set<string>();
  for (const id of ids) {
    const lesson = retrievedById.get(id);
    const retrievable = Boolean(lesson && lesson.track.toUpperCase() === code && lesson.level === level && lesson.body?.trim());
    const inLocale = retrievable && servedInLocale(lesson?.servedLocale, locale);
    const listed = discovered.has(id) && Boolean(discovered.get(id)?.body?.trim());
    if (retrievable && inLocale && listed) {
      pass.add(id);
      const key = lesson?.servedSource ?? "unknown";
      source[key] = (source[key] ?? 0) + 1;
    } else if (retrievable && listed && !inLocale) {
      fallback.push(id);
    } else {
      missing.push(id);
    }
  }

  // 3. Layer-by-layer root cause for every failed lesson.
  const failures: LessonFailure[] = [];
  const failed = [...missing, ...fallback];
  if (failed.length) {
    const atomicIndex = options.atomicIndex !== undefined ? options.atomicIndex : new Set((await readAtomicLessonIndex().catch(() => null) ?? []).map((id) => id.toUpperCase()));
    for (let offset = 0; offset < failed.length; offset += 10) {
      const chunk = failed.slice(offset, offset + 10);
      const rows = await Promise.all(chunk.map(async (id) => {
        const gitEnglish = getLessonContent(id, "en");
        const gitLocal = english ? null : getLessonContent(id, locale);
        const atomic = await readAtomicLessonObject(id).catch(() => null);
        const pkg = english ? null : await readTranslationPackageForLesson(id, locale).catch(() => null);
        const lesson = retrievedById.get(id);
        const layers: LayerPresence = {
          gitCanonical: Boolean(gitEnglish?.body?.trim()),
          gitLocaleFile: Boolean(gitLocal?.localization?.translated && gitLocal.localization.resolvedLocale && sameLocale(gitLocal.localization.resolvedLocale, locale)),
          atomicObject: Boolean(atomic?.id),
          atomicObjectHasLocale: !english && Object.keys(atomic?.translations ?? {}).some((key) => sameLocale(key, locale) && Boolean(atomic?.translations?.[key]?.body?.trim())),
          atomicIndexed: Boolean(atomicIndex?.has(id)),
          translationPackage: Boolean(pkg?.lessons?.[id]?.body?.trim()),
          discovered: discovered.has(id),
          retrieved: Boolean(lesson?.body?.trim()),
          servedLocale: lesson?.servedLocale ?? null,
          servedSource: lesson?.servedSource ?? null,
        };
        return { lessonId: id, disappearsAt: classify(layers, english), layers };
      }));
      failures.push(...rows);
    }
  }

  const passed = pass.size === AUDIT_LESSONS_PER_LEVEL;
  return {
    track: code,
    level,
    locale,
    expectedLessonCount: AUDIT_LESSONS_PER_LEVEL,
    discoveredLessonCount: ids.filter((id) => discovered.has(id)).length,
    retrievableLessonCount: pass.size,
    englishFallbackLessonCount: fallback.length,
    missingLessonIDs: missing,
    englishFallbackLessonIDs: fallback,
    firstLessonRetrievable: pass.has(ids[0]!),
    lastLessonRetrievable: pass.has(ids[ids.length - 1]!),
    source,
    runtimeStatus: passed ? "PASS" : "FAIL",
    failures,
    receipts: await receiptStates(code, level, locale),
    durationMs: Date.now() - started,
  };
}

export type AuditRunMeta = {
  generatedAt: string;
  deployCommit: string | null;
  curriculumSource: string;
  supportedLocales: string[];
  atomic: AtomicReadDiagnostics | null;
  translationPackagesForLocale: Record<string, string[]>;
};

/** Audit one or more coordinates within a single request. */
export async function runProductionAudit(input: { tracks?: string[]; levels?: number[]; locales?: string[] }): Promise<{ meta: AuditRunMeta; coordinates: CoordinateAudit[] }> {
  // Use the same caches real learner requests use. Forcing a cold reload here
  // made every audit request re-read the whole durable store (audit timed out).
  const knownTracks = new Set(ACADEMIES.map((academy) => academy.code));
  const tracks = (input.tracks?.length ? input.tracks : [...AUDIT_TRACKS]).map((t) => t.toUpperCase()).filter((t) => knownTracks.has(t));
  const levels = (input.levels?.length ? input.levels : [...AUDIT_LEVELS]).filter((l) => l >= 1 && l <= 5);
  const locales = input.locales?.length ? input.locales : auditLocales();
  const atomicIndex = new Set((await readAtomicLessonIndex().catch(() => null) ?? []).map((id) => id.toUpperCase()));
  const coordinates: CoordinateAudit[] = [];
  for (const locale of locales) for (const track of tracks) for (const level of levels) {
    coordinates.push(await auditCoordinate(track, level, locale, { atomicIndex }));
  }
  const translationPackagesForLocale: Record<string, string[]> = {};
  for (const locale of locales) {
    if (isEnglish(locale)) continue;
    const packages = await readTranslationPackagesForLocale(locale).catch(() => []);
    translationPackagesForLocale[locale] = packages.map((pkg) => `${pkg.key} (${Object.keys(pkg.lessons).length} lessons)`);
  }
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      deployCommit: process.env.COMMIT_REF ?? null,
      curriculumSource: process.env.EDUNANCIAL_CURRICULUM_SOURCE ?? "(unset: git + atomic store)",
      supportedLocales: auditLocales(),
      atomic: getLastAtomicReadDiagnostics(),
      translationPackagesForLocale,
    },
    coordinates,
  };
}

/** One line per coordinate, e.g. "RED L1 fr-CA        47/50 FAIL — missing [...]". */
export function formatAuditLine(row: CoordinateAudit): string {
  const head = `${row.track.padEnd(6)} L${row.level} ${row.locale.padEnd(13)} ${String(row.retrievableLessonCount).padStart(2)}/${row.expectedLessonCount} ${row.runtimeStatus}`;
  if (row.runtimeStatus === "PASS") return head;
  const parts: string[] = [];
  if (row.missingLessonIDs.length) parts.push(`missing ${row.missingLessonIDs.length} [${row.missingLessonIDs.join(",")}]`);
  if (row.englishFallbackLessonIDs.length) parts.push(`English fallback ${row.englishFallbackLessonIDs.length}`);
  return `${head} — ${parts.join("; ")}`;
}
