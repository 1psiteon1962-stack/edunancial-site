import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGE_CATALOG,
  PUBLIC_LANGUAGE_CATALOG,
  isLanguageSupported,
  normalizeLanguageCode,
  normalizePublicLanguageCode,
} from "./languages";
import { matchSupportedLocale, resolveLocale } from "./resolve-locale";

test("Haitian Creole is withheld from public language choices (owner directive 2026-11-16)", () => {
  assert.equal(PUBLIC_LANGUAGE_CATALOG.some((language) => language.code === "ht"), false);
  assert.equal(isLanguageSupported("ht"), false);
});

test("Haitian Creole stays in the catalog so curriculum files and tooling are untouched", () => {
  assert.equal(LANGUAGE_CATALOG.some((language) => language.code === "ht"), true);
  assert.equal(normalizeLanguageCode("ht"), "ht");
});

test("A saved, browser or session 'ht' falls back to the default language", () => {
  assert.equal(normalizePublicLanguageCode("ht"), DEFAULT_LANGUAGE_CODE);
  assert.equal(normalizePublicLanguageCode("ht-HT"), DEFAULT_LANGUAGE_CODE);
  assert.equal(matchSupportedLocale("ht"), null);
  assert.equal(resolveLocale({ savedPreference: "ht", acceptLanguageHeader: "ht-HT,ht;q=0.9" }), DEFAULT_LANGUAGE_CODE);
  assert.equal(resolveLocale({ sessionOverride: "ht", acceptLanguageHeader: "fr-FR,fr;q=0.9" }), "fr-FR");
});

test("Every other launch language remains publicly available", () => {
  for (const code of ["en-US", "en-GB", "es-Caribbean", "es-ES", "fr-CA", "fr-FR", "pt-BR", "pt-PT", "de", "it", "nl"]) {
    assert.equal(isLanguageSupported(code), true, code);
    assert.equal(normalizePublicLanguageCode(code), code);
  }
});
