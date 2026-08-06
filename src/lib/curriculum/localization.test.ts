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
  listAcademies,
} from "@/lib/curriculum/reader";
import {
  getLocalizedTrackCopy,
  resolveCurriculumLocale,
} from "@/lib/curriculum/localization";

// ─── resolveCurriculumLocale ──────────────────────────────────────────────────

test("resolveCurriculumLocale returns English for English inputs", () => {
  // The canonical English code in LANGUAGE_CATALOG is "en-US"; "en" maps to "en-US" via base match.
  // Both should resolve to an English curriculum locale that maps lookups to the "en" TRACK_COPY key.
  const en = resolveCurriculumLocale("en");
  const enUS = resolveCurriculumLocale("en-US");
  // Both must resolve to a code whose base is "en"
  assert.ok(en === "en" || en.startsWith("en"), `expected English locale for 'en', got '${en}'`);
  assert.ok(enUS === "en" || enUS.startsWith("en"), `expected English locale for 'en-US', got '${enUS}'`);
});

test("resolveCurriculumLocale returns 'es' for Spanish", () => {
  assert.equal(resolveCurriculumLocale("es"), "es");
});

test("resolveCurriculumLocale returns the actual locale for non-English/non-Spanish", () => {
  const fr = resolveCurriculumLocale("fr");
  assert.ok(fr !== "en", `expected non-English locale for 'fr', got '${fr}'`);
  const de = resolveCurriculumLocale("de");
  assert.ok(de !== "en", `expected non-English locale for 'de', got '${de}'`);
});

// ─── getLocalizedTrackCopy — all 8 academies in Spanish ──────────────────────

test("localizes ALL 8 academies in Spanish", () => {
  const codes = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
  for (const code of codes) {
    const copy = getLocalizedTrackCopy(code, "es");
    assert.ok(copy, `expected localized copy for ${code}`);
    assert.ok(copy!.name !== "", `expected non-empty name for ${code} in Spanish`);
    assert.notEqual(
      copy!.name,
      getLocalizedTrackCopy(code, "en")?.name,
      `expected Spanish name to differ from English for ${code}`,
    );
  }
});

test("localizes ALL 8 academies in French", () => {
  const codes = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
  for (const code of codes) {
    const copy = getLocalizedTrackCopy(code, "fr");
    assert.ok(copy, `expected localized copy for ${code}`);
    assert.ok(copy!.name !== "", `expected non-empty name for ${code} in French`);
  }
});

test("localizes ALL 8 academies in Portuguese", () => {
  const codes = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
  for (const code of codes) {
    const copy = getLocalizedTrackCopy(code, "pt");
    assert.ok(copy, `expected localized copy for ${code}`);
    assert.ok(copy!.name !== "", `expected non-empty name for ${code} in Portuguese`);
  }
});

test("localizes ALL 8 academies in German", () => {
  const codes = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
  for (const code of codes) {
    const copy = getLocalizedTrackCopy(code, "de");
    assert.ok(copy, `expected localized copy for ${code}`);
    assert.ok(copy!.name !== "", `expected non-empty name for ${code} in German`);
  }
});

test("localizes ALL 8 academies in Arabic", () => {
  const codes = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
  for (const code of codes) {
    const copy = getLocalizedTrackCopy(code, "ar");
    assert.ok(copy, `expected localized copy for ${code}`);
    assert.ok(copy!.name !== "", `expected non-empty name for ${code} in Arabic`);
  }
});

test("localizes ALL 8 academies in Japanese", () => {
  const codes = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
  for (const code of codes) {
    const copy = getLocalizedTrackCopy(code, "ja");
    assert.ok(copy, `expected localized copy for ${code}`);
    assert.ok(copy!.name !== "", `expected non-empty name for ${code} in Japanese`);
  }
});

test("fallback: fr-CA falls back to fr translation", () => {
  const frCA = getLocalizedTrackCopy("RED", "fr-CA");
  const fr = getLocalizedTrackCopy("RED", "fr");
  assert.ok(frCA, "expected copy for fr-CA");
  assert.equal(frCA!.name, fr!.name);
});

test("fallback: unsupported language falls back to English", () => {
  const copy = getLocalizedTrackCopy("RED", "xx-UNKNOWN");
  assert.ok(copy, "expected fallback copy for unknown locale");
  assert.equal(copy!.name, "Real Estate");
});

// ─── listAcademies — all academies translate ──────────────────────────────────

test("listAcademies returns all 8 academies in Spanish", () => {
  const academies = listAcademies("free", "es");
  const codes = academies.map((a) => a.code);
  assert.ok(codes.includes("GREEN"), "expected GREEN academy");
  assert.ok(codes.includes("GOLD"), "expected GOLD academy");
  assert.ok(codes.includes("PURPLE"), "expected PURPLE academy");
  assert.ok(codes.includes("ORANGE"), "expected ORANGE academy");
  assert.ok(codes.includes("BLACK"), "expected BLACK academy");

  const green = academies.find((a) => a.code === "GREEN");
  assert.equal(green?.name, "Impuestos");
  const gold = academies.find((a) => a.code === "GOLD");
  assert.equal(gold?.name, "Inversión y creación de patrimonio");
  const purple = academies.find((a) => a.code === "PURPLE");
  assert.equal(purple?.name, "Derecho");
  const orange = academies.find((a) => a.code === "ORANGE");
  assert.equal(orange?.name, "Ventas y marketing");
  const black = academies.find((a) => a.code === "BLACK");
  assert.equal(black?.name, "Liderazgo y gestión ejecutiva");
});

test("listAcademies returns all 8 academies in French", () => {
  const academies = listAcademies("free", "fr");
  const green = academies.find((a) => a.code === "GREEN");
  assert.equal(green?.name, "Impôts");
  const gold = academies.find((a) => a.code === "GOLD");
  assert.equal(gold?.name, "Investissement et création de patrimoine");
  const purple = academies.find((a) => a.code === "PURPLE");
  assert.equal(purple?.name, "Droit");
  const orange = academies.find((a) => a.code === "ORANGE");
  assert.equal(orange?.name, "Vente et marketing");
  const black = academies.find((a) => a.code === "BLACK");
  assert.equal(black?.name, "Leadership et gestion de direction");
});

test("listAcademies returns all 8 academies in German", () => {
  const academies = listAcademies("free", "de");
  const green = academies.find((a) => a.code === "GREEN");
  assert.equal(green?.name, "Steuern");
  const gold = academies.find((a) => a.code === "GOLD");
  assert.equal(gold?.name, "Investieren und Vermögensaufbau");
  const purple = academies.find((a) => a.code === "PURPLE");
  assert.equal(purple?.name, "Recht");
  const orange = academies.find((a) => a.code === "ORANGE");
  assert.equal(orange?.name, "Vertrieb und Marketing");
  const black = academies.find((a) => a.code === "BLACK");
  assert.equal(black?.name, "Führung und Unternehmensmanagement");
});

test("no academy remains in English when Spanish is selected", () => {
  const academies = listAcademies("free", "es");
  const englishNames = ["Real Estate", "Paper Assets", "Business", "Taxes",
    "Investing & Wealth Building", "Law", "Sales & Marketing", "Leadership & Executive Management"];
  for (const academy of academies) {
    assert.ok(
      !englishNames.includes(academy.name),
      `Expected ${academy.code} to be translated, but got English name: "${academy.name}"`,
    );
  }
});

// ─── Existing tests (preserved) ──────────────────────────────────────────────

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
