import assert from "node:assert/strict";
import test from "node:test";

import {
  getLocalizedCourseMap,
  getLocalizedLessonMap,
} from "@/lib/curriculum/production-catalog";
import {
  getLessonContent,
  getPlaceholderLessonMeta,
  getTrack,
} from "@/lib/curriculum/reader";

test("localizes launch-track course titles in Spanish", () => {
  const courses = getLocalizedCourseMap("es");

  assert.equal(courses.red.title, "RED: Bienes raíces");
  assert.equal(courses.white.title, "WHITE: Activos financieros");
  assert.equal(courses.blue.title, "BLUE: Negocios");
});

test("localizes launch-track lesson titles in Spanish", () => {
  const lessons = getLocalizedLessonMap("es");

  assert.equal(lessons["RED-L1-001"].title, "Comprender los bienes raíces como clase de activo");
  assert.equal(lessons["WHITE-L1-010"].title, "Construir tu estrategia de inversión en activos financieros");
  assert.equal(lessons["BLUE-L1-025"].title, "Del primer negocio a la independencia financiera");
});

test("localizes curriculum track summaries in Spanish", () => {
  const track = getTrack("RED", "free", "es");

  assert.ok(track);
  assert.equal(track?.name, "Bienes raíces");
  assert.match(track?.description ?? "", /Domina los bienes raíces/);
});

test("builds Spanish placeholder lesson metadata", () => {
  const placeholder = getPlaceholderLessonMeta("RED", "RED-L2-001", 2, "es");

  assert.ok(placeholder);
  assert.equal(placeholder?.title, "Lección 1 de Bienes raíces");
  assert.match(placeholder?.summary ?? "", /se publicará próximamente/);
});

test("returns localized lesson content metadata when Spanish body is unavailable", () => {
  const lesson = getLessonContent("RED-L1-004", "es");

  assert.ok(lesson);
  assert.equal(lesson?.meta.title, "El ciclo del mercado inmobiliario");
  assert.equal(lesson?.meta.summary, "");
});
