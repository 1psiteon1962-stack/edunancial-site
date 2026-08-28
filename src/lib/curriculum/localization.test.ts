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

test("getCurriculumLocaleFallbackChain preserves exact locale, base locale, and English fallback", () => {
  assert.deepEqual(getCurriculumLocaleFallbackChain("es-PR"), ["es-PR", "es", "en-US", "en"]);
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
  const blue = getTrack("BLUE", "admin", "en");
  assert.ok(blue);
  assert.equal(blue?.levels.find((level) => level.level === 1)?.lessonCount, 50);
  assert.equal(getLessonsForLevel("BLUE", 1, "admin", "fr-CA").length, 0);

  const courses = getLocalizedCourseMap("es");
  assert.deepEqual(courses.red.lessons.slice(0, 3), ["RED-L1-001", "RED-L1-002", "RED-L1-003"]);
  assert.deepEqual(courses.red.lessons.slice(-2), ["RED-L2-001", "RED-L2-002"]);
  assert.equal(courses.red.lessons.length, 52);
  assert.equal(courses.blue.lessons.length, 50);

  assert.equal(getLessonContent("GOLD-L5-999", "es"), null);
});

test("test drive lessons are empty when no sample lesson IDs are configured", () => {
  assert.deepEqual(getTestDriveLessons("es"), []);
});

test("localized course map is locale-aware with RED, WHITE, and BLUE published lessons", () => {
  const courses = getLocalizedCourseMap("es");
  assert.equal(courses.red.title, "RED: Bienes raíces");
  assert.equal(courses.white.title, "WHITE: Activos financieros");
  assert.equal(courses.blue.title, "BLUE: Negocios");
  assert.equal(courses.red.lessons.length, 52);
  assert.equal(courses.white.lessons.length, 50);
  assert.equal(courses.blue.lessons.length, 50);
});
