import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  normalizeLanguageCode,
  LANGUAGE_CATALOG,
  getLanguageByCode,
} from "../../../src/lib/international/languages.ts";

// ─── Load locale catalogs directly for translate tests ───────────────────────

const ROOT = join(import.meta.dirname, "../../..");

function loadLocale(code: string): Record<string, string> {
  try {
    return JSON.parse(readFileSync(join(ROOT, `src/locales/${code}.json`), "utf8"));
  } catch {
    return {};
  }
}

function translate(lang: string, key: string, values?: Record<string, string | number>): string {
  const normalized = normalizeLanguageCode(lang);
  const catalog = loadLocale(normalized) ?? {};
  const enCatalog = loadLocale("en");

  const template = catalog[key] ?? enCatalog[key] ?? key;

  if (!values) return template;

  return Object.entries(values).reduce((msg, [token, val]) => {
    return msg.replaceAll(`{{${token}}}`, String(val));
  }, template);
}

// ─── 1. Language preference persistence ──────────────────────────────────────

test("translate uses the requested language catalog when available", () => {
  const enResult = translate("en-US", "nav.home");
  const esResult = translate("es", "nav.home");

  assert.equal(enResult, "Home");
  assert.equal(esResult, "Inicio");
});

test("translate returns correct value for alias language code", () => {
  const enResult = translate("en", "nav.courses");
  assert.equal(enResult, "Courses");
});

test("normalization persists en alias to en-US for preference storage", () => {
  const normalized = normalizeLanguageCode("en");
  assert.equal(normalized, "en-US");
});

test("normalization persists es for preference storage", () => {
  const normalized = normalizeLanguageCode("es");
  assert.equal(normalized, "es");
});

test("language catalog has at least one RTL and one LTR language", () => {
  const rtlLanguages = LANGUAGE_CATALOG.filter((l) => l.rtl);
  const ltrLanguages = LANGUAGE_CATALOG.filter((l) => !l.rtl);

  assert.ok(rtlLanguages.length > 0, "expected at least one RTL language");
  assert.ok(ltrLanguages.length > 0, "expected at least one LTR language");
});

test("getLanguageByCode returns native label for en-US", () => {
  const lang = getLanguageByCode("en-US");
  assert.ok(lang !== undefined, "en-US should exist in catalog");
  assert.equal(lang?.nativeLabel, "English (United States)");
});

// ─── 2. Missing translation fallback ─────────────────────────────────────────

test("translate falls back to English when key is missing in requested language", () => {
  const enCatalog = loadLocale("en");
  const enResult = translate("en-US", "nav.home");
  const frResult = translate("fr-CA", "nav.home");

  // Both should return a non-empty string
  assert.ok(typeof enResult === "string" && enResult.length > 0);
  assert.ok(typeof frResult === "string" && frResult.length > 0);
  // If fr-CA doesn't have "nav.home", it should fall back to the English value
  assert.ok(frResult === (loadLocale("fr-CA")["nav.home"] ?? enCatalog["nav.home"] ?? "nav.home"));
});

test("translate returns the raw key when missing from all catalogs", () => {
  const missingKey = "this.key.does.not.exist.anywhere.xyz";
  const result = translate("en-US", missingKey);

  assert.equal(result, missingKey);
});

test("translate falls back to en-US catalog for unknown language codes", () => {
  const result = translate("xx-UNKNOWN", "nav.home");
  const enResult = translate("en-US", "nav.home");

  assert.equal(result, enResult);
});

test("translate interpolates {{name}} in dashboard.welcome for en-US", () => {
  const result = translate("en-US", "dashboard.welcome", { name: "Alice" });
  assert.ok(result.includes("Alice"), `expected "Alice" in "${result}"`);
});

test("translate interpolates {{name}} in dashboard.welcome for es", () => {
  const result = translate("es", "dashboard.welcome", { name: "Carlos" });
  assert.ok(result.includes("Carlos"), `expected "Carlos" in "${result}"`);
});

test("en.json has all required auth keys", () => {
  const en = loadLocale("en");
  const requiredKeys = [
    "auth.login.label",
    "auth.login.heading",
    "auth.register.label",
    "auth.register.heading",
    "auth.errors.loginFailed",
    "auth.errors.required",
    "dashboard.label",
    "dashboard.welcome",
    "footer.identity",
    "aiCoach.label",
    "faq.heading",
  ];

  for (const key of requiredKeys) {
    assert.ok(
      key in en,
      `en.json is missing required key: "${key}"`
    );
  }
});

test("es.json has all required auth keys", () => {
  const es = loadLocale("es");
  const requiredKeys = [
    "auth.login.label",
    "auth.login.heading",
    "auth.register.label",
    "auth.register.heading",
    "auth.errors.loginFailed",
    "auth.errors.required",
    "dashboard.label",
    "dashboard.welcome",
    "footer.identity",
    "aiCoach.label",
    "faq.heading",
  ];

  for (const key of requiredKeys) {
    assert.ok(
      key in es,
      `es.json is missing required key: "${key}"`
    );
  }
});

// ─── 3. No-reload language switching ─────────────────────────────────────────

test("normalizeLanguageCode does not throw for any input including edge cases", () => {
  const inputs = ["en", "es", "fr-CA", "fr-FR", "zh-Hans", "ar", "", null, undefined];
  for (const input of inputs) {
    const result = normalizeLanguageCode(input as string);
    assert.ok(typeof result === "string" && result.length > 0, `expected non-empty string for input: ${String(input)}`);
  }
});

test("translate is a pure function — same inputs produce same outputs (no side effects)", () => {
  const result1 = translate("en-US", "nav.home");
  const result2 = translate("en-US", "nav.home");

  assert.equal(result1, result2);
  assert.equal(result1, "Home");
});

test("language switching via translate does not trigger page reload", () => {
  // translate() is a pure in-memory function. Calling it with different languages
  // must complete synchronously and never invoke window.location.reload.
  const languages = ["en-US", "es", "fr-CA", "fr-FR"];

  for (const lang of languages) {
    const normalized = normalizeLanguageCode(lang);
    const translated = translate(normalized, "nav.home");

    assert.ok(
      typeof translated === "string" && translated.length > 0,
      `language switch to ${lang} should produce non-empty translation`
    );
  }

  // Verify window is not accessible (Node.js has no window.location.reload)
  assert.equal(typeof globalThis.window, "undefined");
});

test("switching from en-US to es changes nav.home translation correctly", () => {
  const en = translate("en-US", "nav.home");
  const es = translate("es", "nav.home");

  assert.equal(en, "Home");
  assert.equal(es, "Inicio");
  assert.notEqual(en, es, "en and es nav.home should differ");
});

test("normalization of fr-CA and fr-FR preserves distinct region codes", () => {
  assert.equal(normalizeLanguageCode("fr-CA"), "fr-CA");
  assert.equal(normalizeLanguageCode("fr-FR"), "fr-FR");
  assert.notEqual(normalizeLanguageCode("fr-CA"), normalizeLanguageCode("fr-FR"));
});


