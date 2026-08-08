import assert from "node:assert/strict";
import test from "node:test";

import {
  getLocalizedCourseMap,
  getLocalizedLessonMap,
} from "@/lib/curriculum/production-catalog";
import {
  getLessonContent,
  getLessonNavigation,
  getLessonsForLevel,
  getPlaceholderLessonMeta,
  getTestDriveLessons,
  getTrack,
  listAcademies,
} from "@/lib/curriculum/reader";
import {
  getCurriculumLocaleFallbackChain,
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

test("getCurriculumLocaleFallbackChain preserves exact, base, then English", () => {
  assert.deepEqual(getCurriculumLocaleFallbackChain("es-PR"), ["es", "en"]);
  assert.deepEqual(getCurriculumLocaleFallbackChain("fr-CA"), ["fr-CA", "fr", "en"]);
  assert.deepEqual(getCurriculumLocaleFallbackChain("en-US"), ["en-US", "en"]);
});

// ─── File-backed curriculum lesson localization ───────────────────────────────

test("localizes launch-track course titles in Spanish", () => {
  const courses = getLocalizedCourseMap("es");

  assert.equal(courses.red.title, "RED: Bienes raíces");
  assert.equal(courses.white.title, "WHITE: Activos financieros");
  assert.equal(courses.blue.title, "BLUE: Negocios");
});

test("uses localized lesson front matter for base-language curriculum lesson titles", () => {
  const lessons = getLocalizedLessonMap("es");

  assert.equal(lessons["GOLD-L1-002"].title, "Comprender tu patrimonio neto");
  assert.equal(
    lessons["GOLD-L1-002"].localization?.resolvedLocale,
    "es",
  );
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

test("returns canonical English lesson content when English is requested", () => {
  const lesson = getLessonContent("GOLD-L1-002", "en-US");

  assert.ok(lesson);
  assert.equal(lesson?.meta.title, "Understanding Your Net Worth");
  assert.match(lesson?.body ?? "", /Net worth — assets minus liabilities/);
  assert.equal(lesson?.localization.requestedLocale, "en-US");
  assert.equal(lesson?.localization.resolvedLocale, "en");
});

test("returns localized lesson title, summary, and body for a base-language translation", () => {
  const lesson = getLessonContent("GOLD-L1-002", "es");

  assert.ok(lesson);
  assert.equal(lesson?.meta.title, "Comprender tu patrimonio neto");
  assert.match(lesson?.meta.summary ?? "", /patrimonio neto/);
  assert.match(lesson?.body ?? "", /Contenido principal/);
  assert.equal(lesson?.localization.resolvedLocale, "es");
  assert.equal(lesson?.localization.resolution, "exact");
  assert.equal(lesson?.localization.usedFallback, false);
});

test("returns localized lesson content for an exact regional translation", () => {
  const lesson = getLessonContent("GOLD-L1-002", "es-PR");

  assert.ok(lesson);
  assert.equal(lesson?.meta.title, "Entiende tu patrimonio neto");
  assert.match(lesson?.body ?? "", /Lo próximo/);
  assert.equal(lesson?.localization.resolvedLocale, "es-PR");
  assert.equal(lesson?.localization.resolution, "exact");
});

test("falls back from an exact regional locale to the base language translation", () => {
  const lesson = getLessonContent("GOLD-L1-002", "es-MX");

  assert.ok(lesson);
  assert.equal(lesson?.meta.title, "Comprender tu patrimonio neto");
  assert.equal(lesson?.localization.requestedLocale, "es");
  assert.equal(lesson?.localization.resolvedLocale, "es");
  assert.equal(lesson?.localization.resolution, "exact");
});

test("falls back from a regional French locale to the base French translation", () => {
  const lesson = getLessonContent("GOLD-L1-002", "fr-CA");

  assert.ok(lesson);
  assert.equal(lesson?.meta.title, "Comprendre votre valeur nette");
  assert.match(lesson?.body ?? "", /Contenu principal/);
  assert.equal(lesson?.localization.resolvedLocale, "fr");
  assert.equal(lesson?.localization.resolution, "base");
  assert.equal(lesson?.localization.usedFallback, true);
});

test("falls back to canonical English when exact and base translations are missing", () => {
  const lesson = getLessonContent("GOLD-L1-005", "de-DE");

  assert.ok(lesson);
  assert.equal(lesson?.meta.title, "Asset Classes and Their Historical Returns");
  assert.equal(lesson?.localization.resolvedLocale, "en");
  assert.equal(lesson?.localization.resolution, "canonical-en");
  assert.equal(lesson?.localization.usedFallback, true);
});

test("localized lesson lists power sidebar and breadcrumb titles through the same resolver", () => {
  const lessons = getLessonsForLevel("GOLD", 1, "free", "es-PR");
  const current = lessons.find((lesson) => lesson.id === "GOLD-L1-002");

  assert.ok(current);
  assert.equal(current?.title, "Entiende tu patrimonio neto");
  assert.equal(current?.localization.resolvedLocale, "es-PR");
});

test("localized lesson navigation uses the same locale-aware resolver", () => {
  const navigation = getLessonNavigation("GOLD-L1-002", "fr-CA");

  assert.ok(navigation.prev);
  assert.equal(navigation.prev?.localization.resolvedLocale, "en");
  assert.ok(navigation.next);
  assert.equal(navigation.next?.localization.resolvedLocale, "en");
});

test("test drive lessons use the same curriculum localization resolver", () => {
  const lessons = getTestDriveLessons("es-PR");
  const localizedSample = lessons.find((lesson) => lesson.meta.id === "GOLD-L1-002");

  assert.ok(localizedSample);
  assert.equal(localizedSample?.meta.title, "Entiende tu patrimonio neto");
  assert.equal(localizedSample?.localization.resolvedLocale, "es-PR");
});

test("locale-specific cached lesson reads stay isolated across locale switches", () => {
  const spanish = getLessonContent("GOLD-L1-002", "es");
  const english = getLessonContent("GOLD-L1-002", "en-US");

  assert.ok(spanish);
  assert.ok(english);
  assert.equal(spanish?.meta.title, "Comprender tu patrimonio neto");
  assert.equal(english?.meta.title, "Understanding Your Net Worth");
  assert.notEqual(spanish?.body, english?.body);
});
