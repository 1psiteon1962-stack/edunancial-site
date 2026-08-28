import assert from "node:assert/strict";
import test from "node:test";

import {
  courseList,
  courses,
  getCoursePrimaryHref,
  getLocalizedLessonList,
} from "./production-catalog";

test("production course catalog always includes the three launch tracks", () => {
  assert.deepEqual(
    courseList.map((course) => course.id),
    ["red", "white", "blue"],
  );
  // RED has 50 Level 1 lessons plus 2 published Level 2 lessons; WHITE and BLUE have restored Level 1.
  assert.equal(courses.red.lessons.length, 52);
  assert.equal(courses.white.lessons.length, 50);
  assert.equal(courses.blue.lessons.length, 50);
});

test("getCoursePrimaryHref resolves to first lesson for all three launch tracks", () => {
  assert.equal(getCoursePrimaryHref(courses.red), "/courses/red/lessons/RED-L1-001");
  assert.equal(getCoursePrimaryHref(courses.white), "/courses/white/lessons/WHITE-L1-001");
  assert.equal(getCoursePrimaryHref(courses.blue), "/courses/blue/lessons/BLUE-L1-001");
});

test("getCoursePrimaryHref falls back to the track page when a course has no lessons", () => {
  const emptyCourse = { id: "test", lessons: [] };
  assert.equal(getCoursePrimaryHref(emptyCourse), "/courses/test");
});

// ─── Lesson description localization (bug fix) ───────────────────────────────

test("lesson descriptions are non-empty for English locale", () => {
  const lessons = getLocalizedLessonList("en");
  for (const lesson of lessons) {
    if (lesson.description) {
      assert.ok(lesson.description.length > 0, `English description should be non-empty for ${lesson.id}`);
    }
  }
});

test("lesson descriptions are non-empty for French locale (fallback to English when no French translation)", () => {
  const lessonsEn = getLocalizedLessonList("en");
  const lessonsFr = getLocalizedLessonList("fr");
  assert.equal(lessonsEn.length, lessonsFr.length, "lesson count must match across locales");
  for (let i = 0; i < lessonsEn.length; i++) {
    const en = lessonsEn[i];
    const fr = lessonsFr[i];
    if (en.description) {
      assert.ok(fr.description.length > 0, `French lesson description must not be blank when English source exists (lesson ${fr.id})`);
    }
  }
});

test("lesson descriptions are non-empty for Spanish locale (fallback to English when no Spanish translation)", () => {
  const lessonsEn = getLocalizedLessonList("en");
  const lessonsEs = getLocalizedLessonList("es");
  for (let i = 0; i < lessonsEn.length; i++) {
    const en = lessonsEn[i];
    const es = lessonsEs[i];
    if (en.description) {
      assert.ok(es.description.length > 0, `Spanish lesson description must not be blank when English source exists (lesson ${es.id})`);
    }
  }
});

test("lesson descriptions are non-empty for regional French (fr-CA) locale", () => {
  const lessonsEn = getLocalizedLessonList("en");
  const lessonsFrCA = getLocalizedLessonList("fr-CA");
  for (let i = 0; i < lessonsEn.length; i++) {
    const en = lessonsEn[i];
    const frCA = lessonsFrCA[i];
    if (en.description) {
      assert.ok(frCA.description.length > 0, `fr-CA lesson description must not be blank when English source exists (lesson ${frCA.id})`);
    }
  }
});

test("lesson descriptions are non-empty for regional Spanish (es-PR) locale", () => {
  const lessonsEn = getLocalizedLessonList("en");
  const lessonsEsPR = getLocalizedLessonList("es-PR");
  for (let i = 0; i < lessonsEn.length; i++) {
    const en = lessonsEn[i];
    const esPR = lessonsEsPR[i];
    if (en.description) {
      assert.ok(esPR.description.length > 0, `es-PR lesson description must not be blank when English source exists (lesson ${esPR.id})`);
    }
  }
});
