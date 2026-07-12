import test from "node:test";
import assert from "node:assert/strict";

import {
  loadRegionalCurrency,
  loadRegionalLegalNotices,
  resolvePaymentRouting,
  resolveRegionalization,
} from "../../../src/lib/localization/engine.ts";

test("USA visitor uses USD, US legal notices, English, Square", () => {
  const resolved = resolveRegionalization({
    countryCode: "US",
    userPreferredLanguage: "hi",
  });

  assert.equal(resolved.interfaceLanguage, "hi");
  assert.equal(loadRegionalCurrency({ countryCode: "US" }), "USD");
  assert.equal(
    loadRegionalLegalNotices({ countryCode: "US" }).privacy,
    "United States privacy notice."
  );
  assert.deepEqual(resolvePaymentRouting({ countryCode: "US" }), ["square"]);
});

test("Nigeria visitor uses NGN with regional legal and examples", () => {
  const resolved = resolveRegionalization({
    countryCode: "NG",
    userPreferredLanguage: "fr",
  });

  assert.equal(resolved.interfaceLanguage, "fr");
  assert.equal(resolved.currency, "NGN");
  assert.equal(
    resolved.legalNotices.taxDisclaimer,
    "Nigeria-specific tax disclaimer."
  );
  assert.match(resolved.educationalExamples.mortgage, /NGN/);
});

test("Spain visitor uses EUR, Spanish, and European legal notices", () => {
  const resolved = resolveRegionalization({
    countryCode: "ES",
    userPreferredLanguage: "ar",
  });

  assert.equal(resolved.region, "europe-2a");
  assert.equal(resolved.interfaceLanguage, "ar");
  assert.equal(resolved.currency, "EUR");
  assert.equal(resolved.legalNotices.privacy, "Spain and EU privacy notice.");
});

test("Dominican Republic visitor uses Spanish, DOP, and Caribbean content", () => {
  const resolved = resolveRegionalization({
    countryCode: "DO",
    userPreferredLanguage: "zh-Hant",
  });

  assert.equal(resolved.region, "caribbean");
  assert.equal(resolved.interfaceLanguage, "zh-Hant");
  assert.equal(resolved.currency, "DOP");
  assert.match(resolved.educationalExamples.mortgage, /DOP/);
});

test("fallback order is country -> region -> global core", () => {
  const regional = resolveRegionalization({
    region: "middle-east",
    userPreferredLanguage: "ta",
  });
  const fallback = resolveRegionalization({ countryCode: "ZZ" });

  assert.equal(regional.interfaceLanguage, "ta");
  assert.equal(regional.currency, "USD");
  assert.equal(fallback.region, "north-america");
  assert.equal(
    fallback.educationalExamples.mortgage,
    "Use the same mortgage concept with region-aware currency and legal references."
  );
});
