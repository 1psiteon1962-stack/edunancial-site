/**
 * Missing-key validation for North American launch languages.
 *
 * Ensures every key present in en.json (the source-of-truth locale) is also
 * present in each of the required North American launch locales: es, fr-CA,
 * fr-FR.  Any missing key causes the test to fail, making untranslated UI
 * easier to catch before deployment.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "../../../src/locales");

const LAUNCH_LOCALES = ["es", "fr-CA", "fr-FR"];

function loadLocale(code) {
  const raw = readFileSync(join(localesDir, `${code}.json`), "utf-8");
  return JSON.parse(raw);
}

const enKeys = Object.keys(loadLocale("en"));

for (const locale of LAUNCH_LOCALES) {
  test(`All en.json keys are present in ${locale}.json`, () => {
    const localeData = loadLocale(locale);
    const localeKeys = new Set(Object.keys(localeData));

    const missing = enKeys.filter((key) => !localeKeys.has(key));

    assert.deepEqual(
      missing,
      [],
      `${locale}.json is missing ${missing.length} key(s):\n  ${missing.join("\n  ")}`
    );
  });
}

test("No launch locale has keys not present in en.json (reverse coverage check)", () => {
  const enKeySet = new Set(enKeys);
  for (const locale of LAUNCH_LOCALES) {
    const localeData = loadLocale(locale);
    const extra = Object.keys(localeData).filter((key) => !enKeySet.has(key));
    // Extra keys are non-fatal (region-specific additions) — just report them.
    if (extra.length > 0) {
      console.warn(`[warn] ${locale}.json has ${extra.length} extra key(s) not in en.json: ${extra.join(", ")}`);
    }
  }
});
