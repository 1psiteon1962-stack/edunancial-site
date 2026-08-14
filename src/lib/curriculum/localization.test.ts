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

test("listAcademies keeps all academies and canonical levels available", () => {
  const academies = listAcademies("admin", "es");
  assert.deepEqual(
    academies.map((academy) => academy.code),
    ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"],
  );
  for (const academy of academies) {
    assert.equal(academy.levels.length, 5);
  }

  // Published lesson counts belong to the authoritative production catalog.
  // The filesystem registry reader may intentionally be empty in production-validation
  // environments where legacy registry content is not auto-loaded.
  const courses = getLocalizedCourseMap("es");
  assert.equal(courses.red.lessons.length, 2);
  assert.equal(courses.white.lessons.length, 0);
  assert.equal(courses.blue.lessons.length, 0);
});

test("track and lesson queries distinguish empty registry tracks, published content, and missing lessons", () => {
  assert.ok(getTrack("BLUE", "free", "fr-CA"));
  assert.deepEqual(getLessonsForLevel("BLUE", 1, "free", "fr-CA"), []);
  assert.equal(getLessonContent("BLUE-L1-001", "fr-CA"), null);

  // The August RED lessons are authoritative published-state content. Verify them
  // through the production catalog rather than requiring the optional legacy
  // filesystem registry reader to auto-load them in this test environment.
  const courses = getLocalizedCourseMap("es");
  assert.deepEqual(courses.red.lessons, ["RED-L2-001", "RED-L2-002"]);

  // A non-existent registry lesson ID must still return null.
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
