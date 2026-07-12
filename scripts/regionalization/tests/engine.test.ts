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

test("Egypt visitor uses Arabic, EGP, and Stripe-ready routing", () => {
  const resolved = resolveRegionalization({ countryCode: "EG" });

  assert.equal(resolved.region, "africa");
  assert.equal(resolved.language, "ar");
  assert.equal(resolved.currency, "EGP");
  assert.ok(resolved.paymentProviders.includes("stripe"));
});

test("Morocco visitor receives Francophone localization in Africa", () => {
  const resolved = resolveRegionalization({ countryCode: "MA" });

  assert.equal(resolved.region, "africa");
  assert.equal(resolved.language, "fr");
});

test("Spain visitor uses EUR, Spanish, and European legal notices", () => {
  const resolved = resolveRegionalization({
    countryCode: "ES",
    userPreferredLanguage: "ar",
  });

  assert.equal(resolved.region, "europe-2a");
  assert.equal(resolved.interfaceLanguage, "ar");
  assert.equal(resolved.currency, "EUR");
  assert.equal(resolved.legalNotices.privacy, "Spain GDPR privacy notice (Ley de Protección de Datos).");
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

test("Japan visitor keeps selected interface language while pricing in JPY", () => {
  const resolved = resolveRegionalization({
    countryCode: "JP",
    userPreferredLanguage: "hi",
  });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.interfaceLanguage, "hi");
  assert.equal(resolved.currency, "JPY");
  assert.match(resolved.educationalExamples.mortgage, /JPY/);
});

test("South Korea visitor uses KRW pricing and regional routing", () => {
  const resolved = resolveRegionalization({
    countryCode: "KR",
    userPreferredLanguage: "en",
  });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.interfaceLanguage, "en");
  assert.equal(resolved.currency, "KRW");
  assert.match(resolved.educationalExamples.mortgage, /KRW/);
});

test("China visitor supports Simplified Chinese selection with CNY", () => {
  const resolved = resolveRegionalization({
    countryCode: "CN",
    userPreferredLanguage: "zh-Hans",
  });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.interfaceLanguage, "zh-Hans");
  assert.equal(resolved.currency, "CNY");
});

test("Taiwan visitor supports Traditional Chinese selection with TWD", () => {
  const resolved = resolveRegionalization({
    countryCode: "TW",
    userPreferredLanguage: "zh-Hant",
  });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.interfaceLanguage, "zh-Hant");
  assert.equal(resolved.currency, "TWD");
});

test("India visitor supports Hindi selection with INR", () => {
  const resolved = resolveRegionalization({
    countryCode: "IN",
    userPreferredLanguage: "hi",
  });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.interfaceLanguage, "hi");
  assert.equal(resolved.currency, "INR");
  assert.match(resolved.educationalExamples.mortgage, /INR/);
});

test("Singapore visitor can use Japanese interface with SGD pricing", () => {
  const resolved = resolveRegionalization({
    countryCode: "SG",
    userPreferredLanguage: "ja",
  });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.interfaceLanguage, "ja");
  assert.equal(resolved.currency, "SGD");
});

test("Asia region baseline keeps language independent from payment routing", () => {
  const resolved = resolveRegionalization({
    region: "asia",
    userPreferredLanguage: "ko",
  });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.interfaceLanguage, "ko");
  assert.ok(
    resolved.paymentProviders.includes("regional-gateway") ||
      resolved.paymentProviders.includes("stripe"),
    "asia region should have at least one payment provider"
  );
});
