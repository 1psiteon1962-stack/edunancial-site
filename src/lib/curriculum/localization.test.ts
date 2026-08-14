import assert from "node:assert/strict";
import test from "node:test";

import { getLocalizedCourseMap } from "@/lib/curriculum/production-catalog";
import {
  getLessonContent,
  getLessonsForLevel,
  getTestDriveLessons,
  getTrack,
  listAcademies,
} from "@/lib/curriculum/reader";
import {
  getCurriculumLocaleFallbackChain,
  getLocalizedTrackCopy,
  resolveCurriculumLocale,
} from "@/lib/curriculum/localization";

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

test("listAcademies keeps all academies available and reports the complete published catalog for admin", () => {
  // Use admin here because lessonCount is visibility-aware. A free viewer intentionally
  // cannot see paid L2 lessons or GOLD L1 lessons beyond the public preview boundary.
  const academies = listAcademies("admin", "es");
  assert.deepEqual(
    academies.map((academy) => academy.code),
    ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"],
  );
  for (const academy of academies) {
    assert.equal(academy.levels.length, 5);
    if (academy.code === "RED") {
      const level2 = academy.levels.find((l) => l.level === 2);
      assert.ok(level2, "RED should have a Level 2 entry");
      assert.equal(level2!.lessonCount, 2, "RED Level 2 should have 2 published lessons");
      assert.ok(
        academy.levels.filter((l) => l.level !== 2).every((l) => l.lessonCount === 0),
        "All RED levels other than Level 2 should have 0 lessons",
      );
    } else if (academy.code === "GOLD") {
      const level1 = academy.levels.find((l) => l.level === 1);
      assert.ok(level1, "GOLD should have a Level 1 entry");
      assert.equal(level1!.lessonCount, 50, "GOLD Level 1 should have 50 published lessons");
      assert.ok(
        academy.levels.filter((l) => l.level !== 1).every((l) => l.lessonCount === 0),
        "All GOLD levels other than Level 1 should have 0 lessons",
      );
    } else {
      assert.ok(
        academy.levels.every((level) => level.lessonCount === 0),
        `All ${academy.code} levels should have 0 lessons`,
      );
    }
  }
});

test("track and lesson queries distinguish empty tracks, current published content, and missing lessons", () => {
  assert.ok(getTrack("BLUE", "free", "fr-CA"));
  assert.deepEqual(getLessonsForLevel("BLUE", 1, "free", "fr-CA"), []);
  assert.equal(getLessonContent("BLUE-L1-001", "fr-CA"), null);
  // RED-L2-001 is part of the current August content drop and must resolve from the registry/filesystem.
  assert.notEqual(getLessonContent("RED-L2-001", "es"), null);
  // A non-existent lesson ID must still return null.
  assert.equal(getLessonContent("GOLD-L5-999", "es"), null);
});

test("test drive lessons are empty when no sample lesson IDs are configured", () => {
  assert.deepEqual(getTestDriveLessons("es"), []);
});

test("localized course map is locale-aware with RED having 2 published lessons", () => {
  const courses = getLocalizedCourseMap("es");
  assert.equal(courses.red.title, "RED: Bienes raíces");
  assert.equal(courses.white.title, "WHITE: Activos financieros");
  assert.equal(courses.blue.title, "BLUE: Negocios");
  assert.equal(courses.red.lessons.length, 2);
  assert.equal(courses.white.lessons.length, 0);
  assert.equal(courses.blue.lessons.length, 0);
});
