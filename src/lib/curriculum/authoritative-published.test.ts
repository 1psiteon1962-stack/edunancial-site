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

test("does not auto-load legacy registry lessons unless explicitly enabled", async () => {
  // All academy tracks are returned (so the curriculum page can render Coming Soon cards),
  // but none have lessons until content is published or the legacy fallback is enabled.
  const tracksWithoutFallback = await getPublishedTracks("en");
  assert.ok(tracksWithoutFallback.length > 0, "all academy tracks should be returned");
  assert.ok(
    tracksWithoutFallback.every((t) => t.lessonCount === 0),
    "no lessons should be loaded without a published state or legacy flag",
  );

  process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK = "true";
  const tracksWithFallback = await getPublishedTracks("en");
  assert.ok(tracksWithFallback.length > 0);
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
          "GOLD-L1-002": {
            id: "GOLD-L1-002",
            track: "GOLD",
            trackName: "Investing",
            level: 1,
            lessonNumber: 2,
            title: "Understanding Net Worth",
            summary: "English summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/GOLD/L1/GOLD-L1-002.md",
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

  const spanish = await getPublishedLesson("GOLD-L1-002", "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Comprender tu patrimonio neto");
  assert.match(spanish.body, /Objetivos de aprendizaje/u);

  const spanishTrackLesson = findTrackLesson(await getPublishedTracks("es"), "GOLD", 1, "GOLD-L1-002");
  assert.ok(spanishTrackLesson);
  assert.equal(spanishTrackLesson.title, spanish.title);
  assert.equal(spanishTrackLesson.summary, spanish.summary);
  assert.equal(spanishTrackLesson.body, spanish.body);

  const frenchCanada = await getPublishedLesson("GOLD-L1-002", "fr-CA");
  assert.ok(frenchCanada);
  assert.equal(frenchCanada.title, "Comprendre votre valeur nette");

  const frenchCanadaTrackLesson = findTrackLesson(await getPublishedTracks("fr-CA"), "GOLD", 1, "GOLD-L1-002");
  assert.ok(frenchCanadaTrackLesson);
  assert.equal(frenchCanadaTrackLesson.title, frenchCanada.title);
  assert.equal(frenchCanadaTrackLesson.summary, frenchCanada.summary);
  assert.equal(frenchCanadaTrackLesson.body, frenchCanada.body);
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
          "GOLD-L1-002": {
            id: "GOLD-L1-002",
            track: "GOLD",
            trackName: "Investing",
            level: 1,
            lessonNumber: 2,
            title: "Understanding Net Worth",
            summary: "English summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/GOLD/L1/GOLD-L1-002.md",
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
      lessonId: "gold-l1-002",
      locale: "es",
      summary: "Resumen en español",
      body: "Cuerpo en español",
    },
    {
      lessonId: "GOLD-L1-002",
      locale: "fr-CA",
      title: "Comprendre votre valeur nette",
      summary: "Résumé en français canadien",
      body: "Corps en français canadien",
    },
  ]);

  assert.deepEqual(result.missingLessonIds, []);
  assert.equal(result.updatedRecords, 2);
  assert.deepEqual(result.updatedLessonIds, ["GOLD-L1-002"]);

  const spanish = await getPublishedLesson("GOLD-L1-002", "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Comprender tu patrimonio neto");
  assert.equal(spanish.summary, "Resumen en español");
  assert.equal(spanish.body, "Cuerpo en español");

  const frenchCanada = await getPublishedLesson("GOLD-L1-002", "fr-CA");
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
          "GOLD-L1-002": {
            id: "GOLD-L1-002",
            track: "GOLD",
            trackName: "Investing",
            level: 1,
            lessonNumber: 2,
            title: "Understanding Net Worth",
            summary: "English summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/GOLD/L1/GOLD-L1-002.md",
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
      lessonId: "GOLD-L1-002",
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

  const spanish = await getPublishedLesson("GOLD-L1-002", "es");
  assert.ok(spanish);
  assert.equal(spanish.title, "Understanding Net Worth");
});

test("exportPublishedLessonTranslations returns deterministic English base content with optional filtering", async () => {
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

  const prefixedLessons = await exportPublishedLessonTranslations({ prefix: "RED-L1" });
  assert.deepEqual(prefixedLessons, [
    { id: "RED-L1-001", title: "First lesson", summary: "First summary", body: "First body" },
    { id: "RED-L1-002", title: "Second lesson", summary: "Second summary", body: "Second body" },
    { id: "RED-L1-099", title: "Later lesson", summary: "Later summary", body: "Inactive body" },
  ]);

  const intersectedLessons = await exportPublishedLessonTranslations({
    prefix: "RED-L1",
    lessonIds: ["RED-L2-001", "RED-L1-002", "BLUE-L1-001"],
  });
  assert.deepEqual(intersectedLessons, [
    { id: "RED-L1-002", title: "Second lesson", summary: "Second summary", body: "Second body" },
  ]);
});
