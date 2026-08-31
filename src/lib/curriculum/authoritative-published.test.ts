import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";

import {
  exportPublishedLessonTranslations,
  getPublishedLesson,
  getPublishedTracks,
  importPublishedLessonTranslations,
} from "@/lib/curriculum/authoritative-published";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";

const STORE_ROOT = join(process.cwd(), ".admin-content-store");
const STATE_PATH = join(STORE_ROOT, "published", "curriculum-state.json");
const TRANSLATION_TEST_LESSON_ID = "GOLD-L5-099";

const ORIGINAL_FALLBACK_FLAG = process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK;
let originalState: string | null = null;

beforeEach(() => {
  originalState = existsSync(STATE_PATH) ? readFileSync(STATE_PATH, "utf8") : null;
  rmSync(STATE_PATH, { force: true });
  delete process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK;
});

afterEach(() => {
  if (originalState === null) {
    rmSync(STATE_PATH, { force: true });
  } else {
    mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
    writeFileSync(STATE_PATH, originalState, "utf8");
  }
  if (ORIGINAL_FALLBACK_FLAG === undefined) {
    delete process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK;
  } else {
    process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK = ORIGINAL_FALLBACK_FLAG;
  }
});

function findTrackLesson(
  tracks: Awaited<ReturnType<typeof getPublishedTracks>>,
  trackCode: string,
  levelNumber: number,
  lessonId: string,
) {
  return tracks
    .find((track) => track.code === trackCode)
    ?.levels.find((level) => level.level === levelNumber)
    ?.lessons.find((lesson) => lesson.id === lessonId);
}

test("empty store exposes exactly RED-L2-001 and RED-L2-002 without the legacy flag", async () => {
  const tracks = await getPublishedTracks("en");
  assert.ok(tracks.length > 0, "academy tracks should be returned");
  const redTrack = tracks.find((t) => t.code === "RED");
  assert.ok(redTrack, "RED track should be present");
  const redL2 = redTrack?.levels.find((l) => l.level === 2);
  assert.ok(redL2, "RED Level 2 should be present");
  assert.ok(redL2 && redL2.lessonCount > 0);
  assert.ok(redL2?.lessons.some((lesson) => lesson.id === "RED-L2-001"));
  assert.ok(redL2?.lessons.some((lesson) => lesson.id === "RED-L2-002"));
});

test("unrelated registry-only lessons are hidden without the legacy flag", async () => {
  const lesson = await getPublishedLesson("GOLD-L1-001", "en");
  assert.equal(lesson, null);
});

test("enabling legacy flag hydrates all active registry lessons", async () => {
  process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK = "true";
  invalidateRegistryCache();
  const lesson = await getPublishedLesson("GOLD-L1-001", "en");
  assert.ok(lesson);
});

test("explicit store record overrides RED Level 2 fallback entry", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify({
    schemaVersion: "1.0", initialized: true, updatedAt: new Date().toISOString(),
    lessons: { "RED-L2-001": { id: "RED-L2-001", track: "RED", trackName: "Real Estate", level: 2, lessonNumber: 1, title: "Store-override title", summary: "Store-override summary", author: "Test Author", date: "2026-01-01", version: "2.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/RED/L2/RED-L2-001.md", body: "Store-override body", frontMatter: {} } }, batchLessonIds: {}
  }, null, 2), "utf8");
  const lesson = await getPublishedLesson("RED-L2-001", "en");
  assert.ok(lesson);
  assert.equal(lesson?.version, "2.0");
});

test("published lesson content follows active locale with fr-CA -> fr -> en fallback", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify({ schemaVersion: "1.0", initialized: true, updatedAt: new Date().toISOString(), lessons: {
    [TRANSLATION_TEST_LESSON_ID]: { id: TRANSLATION_TEST_LESSON_ID, track: "GOLD", trackName: "Investing", level: 5, lessonNumber: 99, title: "Understanding Net Worth", summary: "English summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/GOLD/L5/GOLD-L5-099.md", body: "English body", frontMatter: {}, translations: { es: { title: "Comprender tu patrimonio neto", body: "## Objetivos de aprendizaje\n\nComprende tu patrimonio neto." }, fr: { title: "Comprendre votre valeur nette" } } }
  }, batchLessonIds: {} }, null, 2), "utf8");
  const spanish = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Comprender tu patrimonio neto");
  assert.match(spanish.body, /Objetivos de aprendizaje/u);
  const spanishSpain = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "es-ES");
  assert.ok(spanishSpain);
  assert.equal(spanishSpain.title, spanish.title);
  assert.equal(spanishSpain.summary, spanish.summary);
  assert.equal(spanishSpain.body, spanish.body);
  const spanishTrackLesson = findTrackLesson(await getPublishedTracks("es"), "GOLD", 5, TRANSLATION_TEST_LESSON_ID);
  assert.ok(spanishTrackLesson);
  assert.equal(spanishTrackLesson.title, spanish.title);
  assert.equal(spanishTrackLesson.summary, spanish.summary);
  assert.equal(spanishTrackLesson.body, spanish.body);
  const frenchCanada = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "fr-CA");
  assert.ok(frenchCanada);
  assert.equal(frenchCanada.title, "Comprendre votre valeur nette");
  const britishEnglish = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "en-GB");
  assert.ok(britishEnglish);
  assert.equal(britishEnglish.title, "Understanding Net Worth");
});

test("published lesson prefers localized sibling curriculum files for title, summary, and body", async () => {
  const REGISTRY_PATH = join(process.cwd(), "curriculum", "registry.json");
  const originalRegistry = existsSync(REGISTRY_PATH) ? readFileSync(REGISTRY_PATH, "utf8") : null;
  const baseRegistry = originalRegistry ? (JSON.parse(originalRegistry) as Record<string, unknown>) : { tracks: {} };
  const patchedRegistry = { ...baseRegistry, tracks: { ...(baseRegistry.tracks as Record<string, unknown>), BLUE: { code: "BLUE", name: "Business", levels: { "1": { assets: { "BLUE-L1-003": { id: "BLUE-L1-003", type: "lesson", track: "BLUE", trackName: "Business", officialTrackName: "Business", level: 1, lessonNumber: 3, title: "Cash Flow in Business — Reading the Numbers", summary: "English canonical summary", author: "Canonical Author", date: "2026-08-03", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, membership: "free", path: "content/curriculum/BLUE/L1/BLUE-L1-003.md" } } } } } } };
  writeFileSync(REGISTRY_PATH, JSON.stringify(patchedRegistry, null, 2), "utf8");
  invalidateRegistryCache();
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify({ schemaVersion: "1.0", initialized: true, updatedAt: new Date().toISOString(), lessons: { "BLUE-L1-003": { id: "BLUE-L1-003", track: "BLUE", trackName: "Business", level: 1, lessonNumber: 3, title: "Cash Flow in Business — Reading the Numbers", summary: "English published summary", author: "Published Author", date: "2026-08-03", version: "9.9", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/BLUE/L1/BLUE-L1-003.md", body: "English published body", frontMatter: { title: "Published Front Matter Title", summary: "Published Front Matter Summary" } } }, batchLessonIds: {} }, null, 2), "utf8");
  const lessonDir = join(process.cwd(), "content", "curriculum", "BLUE", "L1");
  mkdirSync(lessonDir, { recursive: true });
  writeFileSync(join(lessonDir, "BLUE-L1-003.md"), `---\nid: BLUE-L1-003\ntrack: BLUE\nofficialTrackName: Business\nlevel: 1\nlessonNumber: 3\ntitle: Cash Flow in Business — Reading the Numbers\nversion: 1.0\nauthor: Canonical Author\ndate: 2026-08-03\nsummary: English canonical summary\n---\n\n## Learning Objectives\n\n- Read business cash flow basics.\n\n## Core Content\n\nEnglish canonical body.\n`, "utf8");
  writeFileSync(join(lessonDir, "BLUE-L1-003.es.md"), `---\nid: BLUE-L1-003\ntrack: BLUE\nofficialTrackName: Business\nlevel: 1\nlessonNumber: 3\ntitle: Flujo de caja en los negocios — leer los números\nversion: 1.0\nauthor: Localized Author\ndate: 2026-08-04\nsummary: Resumen localizado en español\n---\n\n## Learning Objectives\n\n- Comprender los fundamentos del flujo de caja empresarial.\n\n## Core Content\n\nCuerpo localizado en español.\n`, "utf8");
  try {
    const spanish = await getPublishedLesson("BLUE-L1-003", "es");
    assert.ok(spanish);
    assert.equal(spanish.title, "Flujo de caja en los negocios — leer los números");
    assert.equal(spanish.summary, "Resumen localizado en español");
    assert.match(spanish.body, /Cuerpo localizado en español/u);
    assert.equal(spanish.author, "Published Author");
    assert.equal(spanish.version, "9.9");
  } finally {
    if (originalRegistry === null) rmSync(REGISTRY_PATH, { force: true }); else writeFileSync(REGISTRY_PATH, originalRegistry, "utf8");
    rmSync(join(lessonDir, "BLUE-L1-003.md"), { force: true });
    rmSync(join(lessonDir, "BLUE-L1-003.es.md"), { force: true });
    invalidateRegistryCache();
  }
});

test("published tracks fall back to stub copy when no localized file or translation map exists", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify({ schemaVersion: "1.0", initialized: true, updatedAt: new Date().toISOString(), lessons: { "BLUE-L1-005": { id: "BLUE-L1-005", track: "BLUE", trackName: "Business", level: 1, lessonNumber: 5, title: "Key Performance Indicators — Measuring What Matters", summary: "English published summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/BLUE/L1/BLUE-L1-005.md", body: "English published body", frontMatter: {} } }, batchLessonIds: {} }, null, 2), "utf8");
  const spanish = await getPublishedLesson("BLUE-L1-005", "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Key Performance Indicators — Measuring What Matters");
  assert.equal(spanish.summary, "English published summary");
  assert.equal(spanish.body, "English published body");
});

test("importPublishedLessonTranslations merges locale entries into published lessons", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify({ schemaVersion: "1.0", initialized: true, updatedAt: new Date().toISOString(), lessons: {
    [TRANSLATION_TEST_LESSON_ID]: { id: TRANSLATION_TEST_LESSON_ID, track: "GOLD", trackName: "Investing", level: 5, lessonNumber: 99, title: "Understanding Net Worth", summary: "English summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/GOLD/L5/GOLD-L5-099.md", body: "English body", frontMatter: {}, translations: { es: { title: "Comprender tu patrimonio neto" } } }
  }, batchLessonIds: {} }, null, 2), "utf8");
  const result = await importPublishedLessonTranslations([
    { lessonId: TRANSLATION_TEST_LESSON_ID.toLowerCase(), locale: "es", summary: "Resumen en español", body: "Cuerpo en español" },
    { lessonId: TRANSLATION_TEST_LESSON_ID, locale: "fr-CA", title: "Comprendre votre valeur nette", summary: "Résumé en français canadien", body: "Corps en français canadien" },
  ]);
  assert.deepEqual(result.missingLessonIds, []);
  assert.equal(result.updatedRecords, 2);
  assert.deepEqual(result.updatedLessonIds, [TRANSLATION_TEST_LESSON_ID]);
  const spanish = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Comprender tu patrimonio neto");
  assert.equal(spanish.summary, "Resumen en español");
  assert.equal(spanish.body, "Cuerpo en español");
  const frenchCanada = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "fr-CA");
  assert.ok(frenchCanada);
  assert.equal(frenchCanada.title, "Comprendre votre valeur nette");
});

test("importPublishedLessonTranslations persists valid records while reporting missing lesson IDs", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify({ schemaVersion: "1.0", initialized: true, updatedAt: new Date().toISOString(), lessons: {
    [TRANSLATION_TEST_LESSON_ID]: { id: TRANSLATION_TEST_LESSON_ID, track: "GOLD", trackName: "Investing", level: 5, lessonNumber: 99, title: "Understanding Net Worth", summary: "English summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/GOLD/L5/GOLD-L5-099.md", body: "English body", frontMatter: {} }
  }, batchLessonIds: {} }, null, 2), "utf8");
  const result = await importPublishedLessonTranslations([
    { lessonId: TRANSLATION_TEST_LESSON_ID, locale: "es", title: "Comprender tu patrimonio neto" },
    { lessonId: "GOLD-L1-999", locale: "es", title: "No existe" },
  ]);
  assert.equal(result.updatedRecords, 1);
  assert.deepEqual(result.updatedLessonIds, [TRANSLATION_TEST_LESSON_ID]);
  assert.deepEqual(result.missingLessonIds, ["GOLD-L1-999"]);
  const spanish = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Comprender tu patrimonio neto");
});

test("exportPublishedLessonTranslations returns deterministic English base content with optional filtering", async () => {
  const REGISTRY_PATH = join(process.cwd(), "curriculum", "registry.json");
  const originalRegistry = existsSync(REGISTRY_PATH) ? readFileSync(REGISTRY_PATH, "utf8") : null;
  writeFileSync(REGISTRY_PATH, JSON.stringify({ tracks: {} }, null, 2), "utf8");
  invalidateRegistryCache();
  try {
    mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
    writeFileSync(STATE_PATH, JSON.stringify({ schemaVersion: "1.0", initialized: true, updatedAt: new Date().toISOString(), lessons: {
      "RED-L2-001": { id: "RED-L2-001", track: "RED", trackName: "Real Estate", level: 2, lessonNumber: 1, title: "Level 2 lesson", summary: "Second level summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/RED/L2/RED-L2-001.md", body: "Level 2 body", frontMatter: {}, translations: { es: { title: "Lección de nivel 2", summary: "Resumen de nivel 2", body: "Cuerpo de nivel 2" } } },
      "RED-L1-002": { id: "RED-L1-002", track: "RED", trackName: "Real Estate", level: 1, lessonNumber: 2, title: "Second lesson", summary: "Second summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/RED/L1/RED-L1-002.md", body: "Second body", frontMatter: {} },
      "RED-L1-001": { id: "RED-L1-001", track: "RED", trackName: "Real Estate", level: 1, lessonNumber: 1, title: "First lesson", summary: "First summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/RED/L1/RED-L1-001.md", body: "First body", frontMatter: {} },
      "BLUE-L1-001": { id: "BLUE-L1-001", track: "BLUE", trackName: "Business", level: 1, lessonNumber: 1, title: "Blue lesson", summary: "Blue summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/BLUE/L1/BLUE-L1-001.md", body: "Blue body", frontMatter: {} },
      "RED-L1-099": { id: "RED-L1-099", track: "RED", trackName: "Real Estate", level: 1, lessonNumber: 99, title: "Later lesson", summary: "Later summary", author: "Edunancial Faculty", date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(), metadata: {}, path: "content/curriculum/RED/L1/RED-L1-099.md", body: "Inactive body", frontMatter: {} }
    }, batchLessonIds: {} }, null, 2), "utf8");
    const allLessons = await exportPublishedLessonTranslations();
    assert.deepEqual(allLessons, [
      { id: "BLUE-L1-001", title: "Blue lesson", summary: "Blue summary", body: "Blue body" },
      { id: "RED-L1-001", title: "First lesson", summary: "First summary", body: "First body" },
      { id: "RED-L1-002", title: "Second lesson", summary: "Second summary", body: "Second body" },
      { id: "RED-L1-099", title: "Later lesson", summary: "Later summary", body: "Inactive body" },
      { id: "RED-L2-001", title: "Level 2 lesson", summary: "Second level summary", body: "Level 2 body" },
    ]);
    const prefixedLessons = await exportPublishedLessonTranslations({ prefixes: ["RED-L1"] });
    assert.deepEqual(prefixedLessons, [
      { id: "RED-L1-001", title: "First lesson", summary: "First summary", body: "First body" },
      { id: "RED-L1-002", title: "Second lesson", summary: "Second summary", body: "Second body" },
      { id: "RED-L1-099", title: "Later lesson", summary: "Later summary", body: "Inactive body" },
    ]);
    const intersectedLessons = await exportPublishedLessonTranslations({ prefixes: ["RED-L1"], lessonIds: ["RED-L2-001", "RED-L1-002", "BLUE-L1-001"] });
    assert.deepEqual(intersectedLessons, [
      { id: "RED-L1-002", title: "Second lesson", summary: "Second summary", body: "Second body" },
      { id: "RED-L2-001", title: null, summary: null, body: null },
      { id: "BLUE-L1-001", title: null, summary: null, body: null },
    ]);
  } finally {
    if (originalRegistry === null) rmSync(REGISTRY_PATH, { force: true }); else writeFileSync(REGISTRY_PATH, originalRegistry, "utf8");
    invalidateRegistryCache();
  }
});
