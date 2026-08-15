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
  // Regression guard (1): committed RED L2 lessons must remain visible with an empty
  // published-state store even when EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK
  // is absent — they are already-launched production lessons.
  // beforeEach deletes the store file and unsets the flag.
  const tracks = await getPublishedTracks("en");
  assert.ok(tracks.length > 0, "academy tracks should be returned");

  const redTrack = tracks.find((t) => t.code === "RED");
  assert.ok(redTrack, "RED track should be present");
  const redL2 = redTrack?.levels.find((l) => l.level === 2);
  assert.ok(redL2, "RED Level 2 should be present");
  assert.ok(
    redL2 && redL2.lessonCount > 0,
    "RED Level 2 must have lessons even when the published-state store is empty (regression guard for RED-L2-001/RED-L2-002)",
  );
  assert.ok(
    redL2?.lessons.some((lesson) => lesson.id === "RED-L2-001"),
    "RED-L2-001 must be discoverable with an empty published-state store and no legacy flag",
  );
  assert.ok(
    redL2?.lessons.some((lesson) => lesson.id === "RED-L2-002"),
    "RED-L2-002 must be discoverable with an empty published-state store and no legacy flag",
  );
});

test("unrelated registry-only lessons are hidden without the legacy flag", async () => {
  // Regression guard (2): the surgical RED L2 fallback must not bleed into
  // other tracks.  GOLD-L1-001 is an active registry lesson but must remain
  // hidden unless EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK=true.
  // beforeEach has already cleared the store and unset the flag.
  const lesson = await getPublishedLesson("GOLD-L1-001", "en");
  assert.equal(
    lesson,
    null,
    "GOLD-L1-001 must not be exposed when store is empty and legacy flag is absent",
  );
});

test("enabling legacy flag hydrates all active registry lessons", async () => {
  // Regression guard (3): setting EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK=true
  // must still hydrate all active registry lessons, including non-RED tracks.
  process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK = "true";
  invalidateRegistryCache();

  const lesson = await getPublishedLesson("GOLD-L1-001", "en");
  assert.ok(
    lesson,
    "GOLD-L1-001 must be discoverable when the legacy registry fallback flag is enabled",
  );
});

test("explicit store record overrides RED Level 2 fallback entry", async () => {
  // Regression guard (4): when the published-state store contains an explicit record
  // for a RED L2 lesson, that store record must win over the registry fallback.
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        schemaVersion: "1.0",
        initialized: true,
        updatedAt: new Date().toISOString(),
        lessons: {
          "RED-L2-001": {
            id: "RED-L2-001",
            track: "RED",
            trackName: "Real Estate",
            level: 2,
            lessonNumber: 1,
            title: "Store-override title",
            summary: "Store-override summary",
            author: "Test Author",
            date: "2026-01-01",
            version: "2.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/RED/L2/RED-L2-001.md",
            body: "Store-override body",
            frontMatter: {},
          },
        },
        batchLessonIds: {},
      },
      null,
      2,
    ),
    "utf8",
  );

  const lesson = await getPublishedLesson("RED-L2-001", "en");
  assert.ok(lesson, "RED-L2-001 should be discoverable with a store record present");
  // Non-content metadata fields like version are controlled by the store record.
  assert.equal(lesson?.version, "2.0", "store record metadata (version) should take precedence over registry fallback");
});

test("published lesson content follows active locale with fr-CA -> fr -> en fallback", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        schemaVersion: "1.0",
        initialized: true,
        updatedAt: new Date().toISOString(),
        lessons: {
          [TRANSLATION_TEST_LESSON_ID]: {
            id: TRANSLATION_TEST_LESSON_ID,
            track: "GOLD",
            trackName: "Investing",
            level: 5,
            lessonNumber: 99,
            title: "Understanding Net Worth",
            summary: "English summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/GOLD/L5/GOLD-L5-099.md",
            body: "English body",
            frontMatter: {},
            translations: {
              es: {
                title: "Comprender tu patrimonio neto",
                body: "## Objetivos de aprendizaje\n\nComprende tu patrimonio neto.",
              },
              fr: {
                title: "Comprendre votre valeur nette",
              },
            },
          },
        },
        batchLessonIds: {},
      },
      null,
      2,
    ),
    "utf8",
  );

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

  const spanishSpainTrackLesson = findTrackLesson(await getPublishedTracks("es-ES"), "GOLD", 5, TRANSLATION_TEST_LESSON_ID);
  assert.ok(spanishSpainTrackLesson);
  assert.equal(spanishSpainTrackLesson.title, spanish.title);
  assert.equal(spanishSpainTrackLesson.summary, spanish.summary);
  assert.equal(spanishSpainTrackLesson.body, spanish.body);

  const frenchCanada = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "fr-CA");
  assert.ok(frenchCanada);
  assert.equal(frenchCanada.title, "Comprendre votre valeur nette");

  const frenchCanadaTrackLesson = findTrackLesson(await getPublishedTracks("fr-CA"), "GOLD", 5, TRANSLATION_TEST_LESSON_ID);
  assert.ok(frenchCanadaTrackLesson);
  assert.equal(frenchCanadaTrackLesson.title, frenchCanada.title);
  assert.equal(frenchCanadaTrackLesson.summary, frenchCanada.summary);
  assert.equal(frenchCanadaTrackLesson.body, frenchCanada.body);

  const britishEnglish = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "en-GB");
  assert.ok(britishEnglish);
  assert.equal(britishEnglish.title, "Understanding Net Worth");
  assert.equal(britishEnglish.summary, "English summary");
  assert.equal(britishEnglish.body, "English body");

  const britishEnglishTrackLesson = findTrackLesson(await getPublishedTracks("en-GB"), "GOLD", 5, TRANSLATION_TEST_LESSON_ID);
  assert.ok(britishEnglishTrackLesson);
  assert.equal(britishEnglishTrackLesson.title, britishEnglish.title);
  assert.equal(britishEnglishTrackLesson.summary, britishEnglish.summary);
  assert.equal(britishEnglishTrackLesson.body, britishEnglish.body);
});

test("published lesson prefers localized sibling curriculum files for title, summary, and body", async () => {
  const REGISTRY_PATH = join(process.cwd(), "curriculum", "registry.json");
  const originalRegistry = existsSync(REGISTRY_PATH) ? readFileSync(REGISTRY_PATH, "utf8") : null;
  const baseRegistry = originalRegistry ? (JSON.parse(originalRegistry) as Record<string, unknown>) : { tracks: {} };
  const patchedRegistry = {
    ...baseRegistry,
    tracks: {
      ...(baseRegistry.tracks as Record<string, unknown>),
      BLUE: {
        code: "BLUE",
        name: "Business",
        levels: {
          "1": {
            assets: {
              "BLUE-L1-003": {
                id: "BLUE-L1-003",
                type: "lesson",
                track: "BLUE",
                trackName: "Business",
                officialTrackName: "Business",
                level: 1,
                lessonNumber: 3,
                title: "Cash Flow in Business — Reading the Numbers",
                summary: "English canonical summary",
                author: "Canonical Author",
                date: "2026-08-03",
                version: "1.0",
                status: "active",
                importedAt: new Date().toISOString(),
                metadata: {},
                membership: "free",
                path: "content/curriculum/BLUE/L1/BLUE-L1-003.md",
              },
            },
          },
        },
      },
    },
  };
  writeFileSync(REGISTRY_PATH, JSON.stringify(patchedRegistry, null, 2), "utf8");
  invalidateRegistryCache();

  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        schemaVersion: "1.0",
        initialized: true,
        updatedAt: new Date().toISOString(),
        lessons: {
          "BLUE-L1-003": {
            id: "BLUE-L1-003",
            track: "BLUE",
            trackName: "Business",
            level: 1,
            lessonNumber: 3,
            title: "Cash Flow in Business — Reading the Numbers",
            summary: "English published summary",
            author: "Published Author",
            date: "2026-08-03",
            version: "9.9",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/BLUE/L1/BLUE-L1-003.md",
            body: "English published body",
            frontMatter: {
              title: "Published Front Matter Title",
              summary: "Published Front Matter Summary",
            },
          },
        },
        batchLessonIds: {},
      },
      null,
      2,
    ),
    "utf8",
  );

  const lessonDir = join(process.cwd(), "content", "curriculum", "BLUE", "L1");
  mkdirSync(lessonDir, { recursive: true });

  writeFileSync(
    join(lessonDir, "BLUE-L1-003.md"),
    `---
id: BLUE-L1-003
track: BLUE
officialTrackName: Business
level: 1
lessonNumber: 3
title: Cash Flow in Business — Reading the Numbers
version: 1.0
author: Canonical Author
date: 2026-08-03
summary: English canonical summary
---

## Learning Objectives

- Read business cash flow basics.

## Core Content

English canonical body.
`,
    "utf8",
  );

  writeFileSync(
    join(lessonDir, "BLUE-L1-003.es.md"),
    `---
id: BLUE-L1-003
track: BLUE
officialTrackName: Business
level: 1
lessonNumber: 3
title: Flujo de caja en los negocios — leer los números
version: 1.0
author: Localized Author
date: 2026-08-04
summary: Resumen localizado en español
---

## Learning Objectives

- Comprender los fundamentos del flujo de caja empresarial.

## Core Content

Cuerpo localizado en español.
`,
    "utf8",
  );

  try {
    const spanish = await getPublishedLesson("BLUE-L1-003", "es");
    assert.ok(spanish);
    assert.equal(spanish.title, "Flujo de caja en los negocios — leer los números");
    assert.equal(spanish.summary, "Resumen localizado en español");
    assert.match(spanish.body, /Cuerpo localizado en español/u);

    // Non-content metadata should remain sourced from published state.
    assert.equal(spanish.author, "Published Author");
    assert.equal(spanish.date, "2026-08-03");
    assert.equal(spanish.version, "9.9");
    assert.deepEqual(spanish.frontMatter, {
      title: "Published Front Matter Title",
      summary: "Published Front Matter Summary",
    });

    const spanishTrackLesson = findTrackLesson(await getPublishedTracks("es"), "BLUE", 1, "BLUE-L1-003");
    assert.ok(spanishTrackLesson);
    assert.equal(spanishTrackLesson.title, spanish.title);
    assert.equal(spanishTrackLesson.summary, spanish.summary);
    assert.equal(spanishTrackLesson.body, spanish.body);
    assert.equal(spanishTrackLesson.author, "Published Author");
    assert.equal(spanishTrackLesson.date, "2026-08-03");
    assert.equal(spanishTrackLesson.version, "9.9");
  } finally {
    // Restore registry and clean up lesson files.
    if (originalRegistry === null) {
      rmSync(REGISTRY_PATH, { force: true });
    } else {
      writeFileSync(REGISTRY_PATH, originalRegistry, "utf8");
    }
    rmSync(join(lessonDir, "BLUE-L1-003.md"), { force: true });
    rmSync(join(lessonDir, "BLUE-L1-003.es.md"), { force: true });
    invalidateRegistryCache();
  }
});

test("published tracks fall back to stub copy when no localized file or translation map exists", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        schemaVersion: "1.0",
        initialized: true,
        updatedAt: new Date().toISOString(),
        lessons: {
          "BLUE-L1-005": {
            id: "BLUE-L1-005",
            track: "BLUE",
            trackName: "Business",
            level: 1,
            lessonNumber: 5,
            title: "Key Performance Indicators — Measuring What Matters",
            summary: "English published summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/BLUE/L1/BLUE-L1-005.md",
            body: "English published body",
            frontMatter: {},
          },
        },
        batchLessonIds: {},
      },
      null,
      2,
    ),
    "utf8",
  );

  const spanish = await getPublishedLesson("BLUE-L1-005", "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Key Performance Indicators — Measuring What Matters");
  assert.equal(spanish.summary, "English published summary");
  assert.equal(spanish.body, "English published body");

  const spanishTrackLesson = findTrackLesson(await getPublishedTracks("es"), "BLUE", 1, "BLUE-L1-005");
  assert.ok(spanishTrackLesson);
  assert.equal(spanishTrackLesson.title, spanish.title);
  assert.equal(spanishTrackLesson.summary, spanish.summary);
  assert.equal(spanishTrackLesson.body, spanish.body);
});

test("importPublishedLessonTranslations merges locale entries into published lessons", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        schemaVersion: "1.0",
        initialized: true,
        updatedAt: new Date().toISOString(),
        lessons: {
          [TRANSLATION_TEST_LESSON_ID]: {
            id: TRANSLATION_TEST_LESSON_ID,
            track: "GOLD",
            trackName: "Investing",
            level: 5,
            lessonNumber: 99,
            title: "Understanding Net Worth",
            summary: "English summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/GOLD/L5/GOLD-L5-099.md",
            body: "English body",
            frontMatter: {},
            translations: {
              es: {
                title: "Comprender tu patrimonio neto",
              },
            },
          },
        },
        batchLessonIds: {},
      },
      null,
      2,
    ),
    "utf8",
  );

  const result = await importPublishedLessonTranslations([
    {
      lessonId: TRANSLATION_TEST_LESSON_ID.toLowerCase(),
      locale: "es",
      summary: "Resumen en español",
      body: "Cuerpo en español",
    },
    {
      lessonId: TRANSLATION_TEST_LESSON_ID,
      locale: "fr-CA",
      title: "Comprendre votre valeur nette",
      summary: "Résumé en français canadien",
      body: "Corps en français canadien",
    },
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
  assert.equal(frenchCanada.summary, "Résumé en français canadien");
  assert.equal(frenchCanada.body, "Corps en français canadien");
});

test("importPublishedLessonTranslations reports missing lesson IDs without persisting partial updates", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        schemaVersion: "1.0",
        initialized: true,
        updatedAt: new Date().toISOString(),
        lessons: {
          [TRANSLATION_TEST_LESSON_ID]: {
            id: TRANSLATION_TEST_LESSON_ID,
            track: "GOLD",
            trackName: "Investing",
            level: 5,
            lessonNumber: 99,
            title: "Understanding Net Worth",
            summary: "English summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/GOLD/L5/GOLD-L5-099.md",
            body: "English body",
            frontMatter: {},
          },
        },
        batchLessonIds: {},
      },
      null,
      2,
    ),
    "utf8",
  );

  const result = await importPublishedLessonTranslations([
    {
      lessonId: TRANSLATION_TEST_LESSON_ID,
      locale: "es",
      title: "Comprender tu patrimonio neto",
    },
    {
      lessonId: "GOLD-L1-999",
      locale: "es",
      title: "No existe",
    },
  ]);

  assert.equal(result.updatedRecords, 0);
  assert.deepEqual(result.updatedLessonIds, []);
  assert.deepEqual(result.missingLessonIds, ["GOLD-L1-999"]);

  const spanish = await getPublishedLesson(TRANSLATION_TEST_LESSON_ID, "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Understanding Net Worth");
});

test("exportPublishedLessonTranslations returns deterministic English base content with optional filtering", async () => {
  // Isolate the registry so that committed GOLD/RED lessons are not injected into the
  // test state by getEffectiveState().  Without isolation the test's exact-equality
  // assertions would fail because all 50+ committed registry lessons would be merged in.
  const REGISTRY_PATH = join(process.cwd(), "curriculum", "registry.json");
  const originalRegistry = existsSync(REGISTRY_PATH) ? readFileSync(REGISTRY_PATH, "utf8") : null;
  writeFileSync(REGISTRY_PATH, JSON.stringify({ tracks: {} }, null, 2), "utf8");
  invalidateRegistryCache();

  try {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        schemaVersion: "1.0",
        initialized: true,
        updatedAt: new Date().toISOString(),
        lessons: {
          "RED-L2-001": {
            id: "RED-L2-001",
            track: "RED",
            trackName: "Real Estate",
            level: 2,
            lessonNumber: 1,
            title: "Level 2 lesson",
            summary: "Second level summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/RED/L2/RED-L2-001.md",
            body: "Level 2 body",
            frontMatter: {},
            translations: {
              es: {
                title: "Lección de nivel 2",
                summary: "Resumen de nivel 2",
                body: "Cuerpo de nivel 2",
              },
            },
          },
          "RED-L1-002": {
            id: "RED-L1-002",
            track: "RED",
            trackName: "Real Estate",
            level: 1,
            lessonNumber: 2,
            title: "Second lesson",
            summary: "Second summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/RED/L1/RED-L1-002.md",
            body: "Second body",
            frontMatter: {},
          },
          "RED-L1-001": {
            id: "RED-L1-001",
            track: "RED",
            trackName: "Real Estate",
            level: 1,
            lessonNumber: 1,
            title: "First lesson",
            summary: "First summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/RED/L1/RED-L1-001.md",
            body: "First body",
            frontMatter: {},
          },
          "BLUE-L1-001": {
            id: "BLUE-L1-001",
            track: "BLUE",
            trackName: "Business",
            level: 1,
            lessonNumber: 1,
            title: "Blue lesson",
            summary: "Blue summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/BLUE/L1/BLUE-L1-001.md",
            body: "Blue body",
            frontMatter: {},
          },
          "RED-L1-099": {
            id: "RED-L1-099",
            track: "RED",
            trackName: "Real Estate",
            level: 1,
            lessonNumber: 99,
            title: "Later lesson",
            summary: "Later summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/RED/L1/RED-L1-099.md",
            body: "Inactive body",
            frontMatter: {},
          },
        },
        batchLessonIds: {},
      },
      null,
      2,
    ),
    "utf8",
  );

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

  const intersectedLessons = await exportPublishedLessonTranslations({
    prefixes: ["RED-L1"],
    lessonIds: ["RED-L2-001", "RED-L1-002", "BLUE-L1-001"],
  });
  assert.deepEqual(intersectedLessons, [
    { id: "RED-L1-002", title: "Second lesson", summary: "Second summary", body: "Second body" },
    { id: "RED-L2-001", title: null, summary: null, body: null },
    { id: "BLUE-L1-001", title: null, summary: null, body: null },
  ]);
  } finally {
    if (originalRegistry === null) {
      rmSync(REGISTRY_PATH, { force: true });
    } else {
      writeFileSync(REGISTRY_PATH, originalRegistry, "utf8");
    }
    invalidateRegistryCache();
  }
});
