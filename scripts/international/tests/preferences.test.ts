import test from "node:test";
import assert from "node:assert/strict";

import {
  parseCountryCodeFromLanguageTag,
  resolveRegion,
} from "../../../src/lib/international/detection.ts";

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
