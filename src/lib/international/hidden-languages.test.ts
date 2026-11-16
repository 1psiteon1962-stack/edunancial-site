import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGE_CATALOG,
  PUBLIC_LANGUAGE_CATALOG,
  isLanguageSupported,
  normalizeLanguageCode,
  normalizePublicLanguageCode,
  toHtmlLangTag,
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

test("The site never switches a visitor into Haitian Creole on its own", () => {
  assert.equal(normalizePublicLanguageCode("ht"), DEFAULT_LANGUAGE_CODE);
  assert.equal(normalizePublicLanguageCode("ht-HT"), DEFAULT_LANGUAGE_CODE);
  assert.equal(resolveLocale({ acceptLanguageHeader: "ht-HT,ht;q=0.9" }), DEFAULT_LANGUAGE_CODE);
  assert.equal(resolveLocale({ acceptLanguageHeader: "ht-HT,fr-FR;q=0.8" }), "fr-FR");
  assert.equal(resolveLocale({ geoLocale: "ht" }), DEFAULT_LANGUAGE_CODE);
});

test("An explicit request by code (content APIs) still resolves committed Haitian Creole curriculum", () => {
  assert.equal(matchSupportedLocale("ht"), "ht");
  assert.equal(resolveLocale({ savedPreference: "ht" }), "ht");
});

test("Every other launch language remains publicly available", () => {
  for (const code of ["en-US", "en-GB", "es-Caribbean", "es-ES", "fr-CA", "fr-FR", "pt-BR", "pt-PT", "de", "it", "nl"]) {
    assert.equal(isLanguageSupported(code), true, code);
    assert.equal(normalizePublicLanguageCode(code), code);
  }
});

test("The browser receives a valid BCP 47 tag for Caribbean Spanish", () => {
  assert.equal(toHtmlLangTag("es-Caribbean"), "es-419");
  assert.equal(toHtmlLangTag("es-ES"), "es-ES");
  assert.equal(toHtmlLangTag("pt-BR"), "pt-BR");
  assert.deepEqual(Intl.getCanonicalLocales(toHtmlLangTag("es-Caribbean")), ["es-419"]);
});
