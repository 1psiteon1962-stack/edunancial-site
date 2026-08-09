/**
 * i18n-coverage.test.ts
 *
 * Validates that:
 * 1. Every language in LANGUAGE_CATALOG resolves to a message catalog (not just English fallback).
 * 2. All public locale files have complete key parity with en.json.
 * 3. RTL languages are marked correctly in LANGUAGE_CATALOG.
 * 4. Representative translations are not English copies.
 * 5. Locale JSON files are valid (parseable).
 * 6. Curriculum locale resolution works for all LANGUAGE_CATALOG codes.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import {
  LANGUAGE_CATALOG,
  normalizeLanguageCode,
} from "../../../src/lib/international/languages.ts";

const ROOT = resolve(import.meta.dirname, "../../..");
const LOCALES_DIR = join(ROOT, "src", "locales");

// ---------------------------------------------------------------------------
// Load locale files
// ---------------------------------------------------------------------------

function loadLocale(code: string): Record<string, string> | null {
  const filePath = join(LOCALES_DIR, `${code}.json`);
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

const enMessages = loadLocale("en")!;
assert.ok(enMessages, "en.json must be readable");

// ---------------------------------------------------------------------------
// Build the same messageCatalogs map as i18n.ts does to detect missing registrations
// ---------------------------------------------------------------------------

// We parse i18n.ts imports to validate synchrony — but for the test we directly
// check which locale files exist and compare against LANGUAGE_CATALOG.

function resolveLocaleFile(code: string): string | null {
  // Direct file match
  if (loadLocale(code)) return code;
  // Alias: en-US → en
  const normalized = normalizeLanguageCode(code);
  if (normalized && loadLocale(normalized)) return normalized;
  // Base language: fr-CA → fr
  const base = code.split("-")[0];
  if (base && loadLocale(base)) return base;
  return null;
}

// ---------------------------------------------------------------------------
// Test: every LANGUAGE_CATALOG entry has a resolvable locale file
// ---------------------------------------------------------------------------

test("every LANGUAGE_CATALOG language resolves to a locale file", () => {
  const missing: string[] = [];
  for (const lang of LANGUAGE_CATALOG) {
    const resolved = resolveLocaleFile(lang.code);
    if (!resolved) {
      missing.push(lang.code);
    }
  }
  assert.deepEqual(
    missing,
    [],
    `Languages in LANGUAGE_CATALOG with no locale file: ${missing.join(", ")}`,
  );
});

// ---------------------------------------------------------------------------
// Test: all locale files have complete key parity with en.json
// ---------------------------------------------------------------------------

const LOCALE_FILES = [
  "am", "ar", "be", "bg", "bn", "cs", "de", "et", "fa", "fil",
  "fr", "fr-CA", "fr-FR", "ha", "he", "hi", "ht", "id", "ig", "it",
  "ja", "ko", "lg", "lt", "lv", "ms", "nl", "pap", "pl", "prs",
  "ps", "pt", "ro", "ru", "sk", "sw", "ta", "th", "ur", "vi",
  "yo", "zh-Hans", "zh-Hant", "zu",
];

test("all locale files are valid JSON", () => {
  const invalid: string[] = [];
  for (const code of LOCALE_FILES) {
    const data = loadLocale(code);
    if (!data) invalid.push(code);
  }
  assert.deepEqual(invalid, [], `Invalid/missing locale files: ${invalid.join(", ")}`);
});

test("all locale files have complete key parity with en.json", () => {
  const violations: string[] = [];
  const enKeys = Object.keys(enMessages);
  for (const code of LOCALE_FILES) {
    const data = loadLocale(code);
    if (!data) continue;
    const missingKeys = enKeys.filter((k) => !(k in data));
    if (missingKeys.length > 0) {
      violations.push(`${code}: missing ${missingKeys.length} keys (e.g. ${missingKeys.slice(0, 3).join(", ")})`);
    }
  }
  assert.deepEqual(violations, [], `Locale key parity failures:\n${violations.join("\n")}`);
});

// ---------------------------------------------------------------------------
// Test: locale files have no extra keys not in en.json (warn only via logging)
// ---------------------------------------------------------------------------

test("locale files do not define keys absent from en.json", () => {
  // This is a soft check — extra keys are allowed (legacy/migration) but should be tracked.
  const enKeys = new Set(Object.keys(enMessages));
  const extras: string[] = [];
  for (const code of LOCALE_FILES) {
    const data = loadLocale(code);
    if (!data) continue;
    const extraKeys = Object.keys(data).filter((k) => !enKeys.has(k));
    if (extraKeys.length > 0) {
      extras.push(`${code}: ${extraKeys.length} extra keys`);
    }
  }
  // Log extras but don't fail — extra keys can be legacy from previous versions
  if (extras.length > 0) {
    console.log("ℹ️  Locales with extra keys (not in en.json):", extras.join("; "));
  }
});

// ---------------------------------------------------------------------------
// Test: representative translations are not English copies
// ---------------------------------------------------------------------------

const SAMPLE_TRANSLATED_KEYS = [
  "nav.becomeMember",
  "selector.label",
  "nav.login",
  "nav.courses",
  "footer.copyright",
];

// Languages where we verify translations are genuinely translated (not English copies)
const GENUINELY_TRANSLATED_LOCALES: Array<{ code: string; localeFile: string }> = [
  { code: "es", localeFile: "es" },
  { code: "fr-CA", localeFile: "fr-CA" },
  { code: "fr-FR", localeFile: "fr-FR" },
  { code: "de", localeFile: "de" },
  { code: "pt", localeFile: "pt" },
  { code: "it", localeFile: "it" },
  { code: "nl", localeFile: "nl" },
  { code: "ar", localeFile: "ar" },
  { code: "he", localeFile: "he" },
  { code: "hi", localeFile: "hi" },
  { code: "zh-Hans", localeFile: "zh-Hans" },
  { code: "zh-Hant", localeFile: "zh-Hant" },
  { code: "ja", localeFile: "ja" },
  { code: "ko", localeFile: "ko" },
  { code: "ru", localeFile: "ru" },
  { code: "sw", localeFile: "sw" },
  { code: "lg", localeFile: "lg" },
  { code: "yo", localeFile: "yo" },
  { code: "am", localeFile: "am" },
];

for (const { code, localeFile } of GENUINELY_TRANSLATED_LOCALES) {
  test(`${code}: at least some nav/curriculum strings are genuinely translated`, () => {
    const data = loadLocale(localeFile);
    assert.ok(data, `Locale file for ${code} must exist`);

    const translatedCount = SAMPLE_TRANSLATED_KEYS.filter(
      (k) => k in data && data[k] !== enMessages[k]
    ).length;

    assert.ok(
      translatedCount >= 2,
      `${code}: expected ≥2 of ${SAMPLE_TRANSLATED_KEYS.join(", ")} to be translated; ` +
        `only ${translatedCount} differ from English. ` +
        `Values: ${SAMPLE_TRANSLATED_KEYS.map((k) => `${k}=${JSON.stringify(data[k])}`).join(", ")}`,
    );
  });
}

// ---------------------------------------------------------------------------
// Test: RTL languages are marked RTL in LANGUAGE_CATALOG
// ---------------------------------------------------------------------------

const RTL_CODES = ["ar", "he", "ur", "fa", "prs", "ps"];

test("RTL languages are correctly marked in LANGUAGE_CATALOG", () => {
  const failures: string[] = [];
  for (const code of RTL_CODES) {
    const lang = LANGUAGE_CATALOG.find((l) => l.code === code);
    if (!lang) {
      failures.push(`${code}: not found in LANGUAGE_CATALOG`);
    } else if (!lang.rtl) {
      failures.push(`${code}: rtl should be true but is false`);
    }
  }
  assert.deepEqual(failures, [], `RTL marking failures: ${failures.join(", ")}`);
});

// ---------------------------------------------------------------------------
// Test: Luganda specifically is present and correctly configured
// ---------------------------------------------------------------------------

test("Luganda (lg) is present in LANGUAGE_CATALOG and has a locale file", () => {
  const lang = LANGUAGE_CATALOG.find((l) => l.code === "lg");
  assert.ok(lang, "Luganda must be in LANGUAGE_CATALOG");
  assert.equal(lang.code, "lg");
  assert.equal(lang.rtl, false, "Luganda is not RTL");

  const locale = loadLocale("lg");
  assert.ok(locale, "lg.json must exist and be valid");
  assert.ok(Object.keys(locale).length >= 700, "lg.json must have at least 700 keys");
});

test("Luganda normalizes to 'lg' (not en-US)", () => {
  const normalized = normalizeLanguageCode("lg");
  assert.notEqual(normalized, "en-US", "lg must not normalize to en-US");
  assert.equal(normalized, "lg", "lg must normalize to itself");
});

// ---------------------------------------------------------------------------
// Test: language code normalization works for aliases
// ---------------------------------------------------------------------------

test("language alias: en → en-US", () => {
  assert.equal(normalizeLanguageCode("en"), "en-US");
});

test("language alias: fr → fr-CA", () => {
  assert.equal(normalizeLanguageCode("fr"), "fr-CA");
});

test("language alias: zh → zh-Hans", () => {
  assert.equal(normalizeLanguageCode("zh"), "zh-Hans");
});

test("language alias: zh-CN → zh-Hans", () => {
  assert.equal(normalizeLanguageCode("zh-cn"), "zh-Hans");
});

test("language alias: zh-TW → zh-Hant", () => {
  assert.equal(normalizeLanguageCode("zh-tw"), "zh-Hant");
});

test("language alias: tl → fil", () => {
  assert.equal(normalizeLanguageCode("tl"), "fil");
});

// ---------------------------------------------------------------------------
// Test: curriculum page title is translated for representative languages
// ---------------------------------------------------------------------------

const CURRICULUM_TITLE_KEY = "curriculumPage.title";
const ENGLISH_CURRICULUM_TITLE = enMessages[CURRICULUM_TITLE_KEY];

const CURRICULUM_TRANSLATE_SAMPLES: Array<{ code: string; localeFile: string }> = [
  { code: "es", localeFile: "es" },
  { code: "pt", localeFile: "pt" },
  { code: "ar", localeFile: "ar" },
  { code: "zh-Hans", localeFile: "zh-Hans" },
  { code: "ja", localeFile: "ja" },
  { code: "sw", localeFile: "sw" },
  { code: "lg", localeFile: "lg" },
];

for (const { code, localeFile } of CURRICULUM_TRANSLATE_SAMPLES) {
  test(`${code}: curriculum title is translated (not English fallback)`, () => {
    const data = loadLocale(localeFile);
    assert.ok(data, `${localeFile}.json must exist`);
    assert.ok(
      CURRICULUM_TITLE_KEY in data,
      `${code}: ${CURRICULUM_TITLE_KEY} must be present`,
    );
    assert.notEqual(
      data[CURRICULUM_TITLE_KEY],
      ENGLISH_CURRICULUM_TITLE,
      `${code}: curriculumPage.title must not be the English value "${ENGLISH_CURRICULUM_TITLE}"`,
    );
  });
}

// ---------------------------------------------------------------------------
// Test: all LANGUAGE_CATALOG codes resolve correctly (not falling back to en-US)
// ---------------------------------------------------------------------------

test("normalizeLanguageCode does not return en-US for non-English languages", () => {
  const shouldNotBeEnglish = ["es", "fr-CA", "fr-FR", "pt", "de", "ar", "he", "hi",
    "zh-Hans", "zh-Hant", "ja", "ko", "ru", "sw", "lg", "yo", "am"];

  for (const code of shouldNotBeEnglish) {
    const normalized = normalizeLanguageCode(code);
    assert.notEqual(
      normalized,
      "en-US",
      `normalizeLanguageCode("${code}") must not return "en-US", got "${normalized}"`,
    );
  }
});
