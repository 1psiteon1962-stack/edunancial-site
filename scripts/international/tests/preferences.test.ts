import test from "node:test";
import assert from "node:assert/strict";

import {
  parseCountryCodeFromLanguageTag,
  resolveRegion,
} from "../../../src/lib/international/detection.ts";
import {
  LANGUAGE_CATALOG,
  normalizeLanguageCode,
} from "../../../src/lib/international/languages.ts";
import { resolveAvailablePaymentMethods } from "../../../src/lib/international/preference-architecture.ts";

test("US locale resolves to US country code", () => {
  assert.equal(parseCountryCodeFromLanguageTag("en-US"), "us");
});

test("USA Spanish preference keeps region as north-america", () => {
  const region = resolveRegion("us", "America/New_York");

  assert.equal(region, "north-america");
});

test("Region is independent from browser language", () => {
  const regionFromEnglish = resolveRegion(
    parseCountryCodeFromLanguageTag("en-US"),
    "America/New_York"
  );
  const regionFromSpanish = resolveRegion(
    parseCountryCodeFromLanguageTag("es-US"),
    "America/New_York"
  );

  assert.equal(regionFromEnglish, "north-america");
  assert.equal(regionFromSpanish, "north-america");
});

test("Latin America timezone fallback remains region-driven", () => {
  const region = resolveRegion("", "America/Mexico_City");

  assert.equal(region, "latin-america-2a");
});

test("Egypt resolves to africa regardless of Arabic locale", () => {
  const region = resolveRegion(parseCountryCodeFromLanguageTag("ar-EG"), "Africa/Cairo");

  assert.equal(region, "africa");
});

test("language catalog has no duplicate language registrations", () => {
  const uniqueCodes = new Set(LANGUAGE_CATALOG.map((language) => language.code));
  assert.equal(uniqueCodes.size, LANGUAGE_CATALOG.length);
});

test("language preference is independent from payment provider routing", () => {
  const paymentMethods = resolveAvailablePaymentMethods("north-america", "us");
  const hindiLanguage = normalizeLanguageCode("hi");

  assert.equal(hindiLanguage, "hi");
  assert.deepEqual(paymentMethods.slice(0, 3), ["square", "stripe", "paypal"]);
});

test("normalization preserves distinct fr-CA and fr-FR selections", () => {
  assert.equal(normalizeLanguageCode("fr-CA"), "fr-CA");
  assert.equal(normalizeLanguageCode("fr-FR"), "fr-FR");
});

test("normalization aliases plain en and fr for North America launch", () => {
  assert.equal(normalizeLanguageCode("en"), "en-US");
  assert.equal(normalizeLanguageCode("fr"), "fr-CA");
});
