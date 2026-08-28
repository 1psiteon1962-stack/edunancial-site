import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import test, { afterEach, beforeEach } from "node:test";

import { getLocalizedCourseMap } from "@/lib/curriculum/production-catalog";
import {
  getLessonContent,
  getLessonsForLevel,
  getTestDriveLessons,
  getTrack,
  invalidateRegistryCache,
  listAcademies,
} from "@/lib/curriculum/reader";
import {
  getCurriculumLocaleFallbackChain,
  getLocalizedTrackCopy,
  resolveCurriculumLocale,
} from "@/lib/curriculum/localization";

const REGISTRY_PATH = join(process.cwd(), "curriculum", "registry.json");
let originalRegistry: string | null = null;

beforeEach(() => {
  originalRegistry = existsSync(REGISTRY_PATH) ? readFileSync(REGISTRY_PATH, "utf8") : null;
  rmSync(REGISTRY_PATH, { force: true });
  invalidateRegistryCache();
});

afterEach(() => {
  if (originalRegistry === null) {
    rmSync(REGISTRY_PATH, { force: true });
  } else {
    writeFileSync(REGISTRY_PATH, originalRegistry, "utf8");
  }
  invalidateRegistryCache();
});

test("resolveCurriculumLocale keeps French regional locales for fallback chaining", () => {
  assert.equal(resolveCurriculumLocale("fr-CA"), "fr-CA");
  assert.equal(resolveCurriculumLocale("fr-FR"), "fr-FR");
  assert.equal(resolveCurriculumLocale("fr"), "fr");
});

test("getCurriculumLocaleFallbackChain preserves exact locale, launch locale, base locale, and English fallback", () => {
  assert.deepEqual(getCurriculumLocaleFallbackChain("es-PR"), ["es-PR", "es-Caribbean", "es", "en-US", "en"]);
  assert.deepEqual(getCurriculumLocaleFallbackChain("fr-CA"), ["fr-CA", "fr", "en-US", "en"]);
  assert.deepEqual(getCurriculumLocaleFallbackChain("fr-FR"), ["fr-FR", "fr", "en-US", "en"]);
  assert.deepEqual(getCurriculumLocaleFallbackChain("en-US"), ["en-US", "en"]);
});

test("localizes all curriculum academies in Spanish", () => {
  const codes = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
  for (const code of codes) {
    const copy = getLocalizedTrackCopy(code, "es");
    assert.ok(copy, `expected localized copy for ${code}`);
    assert.notEqual(copy?.name, getLocalizedTrackCopy(code, "en")?.name);
  }
});

test("listAcademies keeps all academies and canonical levels available", () => {
  const academies = listAcademies("admin", "es");
  assert.deepEqual(
    academies.map((academy) => academy.code),
    ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"],
  );
  for (const academy of academies) {
    assert.equal(academy.levels.length, 5);
  }

  const courses = getLocalizedCourseMap("es");
  assert.equal(courses.red.lessons.length, 52);
  assert.equal(courses.white.lessons.length, 50);
  assert.equal(courses.blue.lessons.length, 50);
});

test("canonical BLUE is restored while unrecovered fr-CA lesson files remain absent", () => {
  assert.ok(getTrack("BLUE", "admin", "en"));
  assert.equal(getLocalizedCourseMap("en").blue.lessons.length, 50);
  assert.equal(getLessonsForLevel("BLUE", 1, "admin", "fr-CA").length, 0);
});

test("test drive lessons are empty when no sample lesson IDs are configured", () => {
  assert.deepEqual(getTestDriveLessons("en"), []);
});

test("localized course map is locale-aware with RED, WHITE, and BLUE published lessons", () => {
  const english = getLocalizedCourseMap("en");
  const spanish = getLocalizedCourseMap("es");
  assert.equal(english.red.lessons.length, 52);
  assert.equal(english.white.lessons.length, 50);
  assert.equal(english.blue.lessons.length, 50);
  assert.equal(spanish.red.lessons.length, 52);
  assert.equal(spanish.white.lessons.length, 50);
  assert.equal(spanish.blue.lessons.length, 50);
});
