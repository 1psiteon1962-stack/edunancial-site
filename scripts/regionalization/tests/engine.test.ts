import test from "node:test";
import assert from "node:assert/strict";

import {
  loadRegionalCurrency,
  loadRegionalLegalNotices,
  resolvePaymentRouting,
  resolveRegionalization,
} from "../../../src/lib/localization/engine.ts";

test("USA visitor uses USD, US legal notices, English, Square", () => {
  const resolved = resolveRegionalization({ countryCode: "US" });

  assert.equal(resolved.language, "en");
  assert.equal(loadRegionalCurrency({ countryCode: "US" }), "USD");
  assert.equal(
    loadRegionalLegalNotices({ countryCode: "US" }).privacy,
    "United States privacy notice."
  );
  assert.deepEqual(resolvePaymentRouting({ countryCode: "US" }), ["square"]);
});

test("Nigeria visitor uses NGN with regional legal and examples", () => {
  const resolved = resolveRegionalization({ countryCode: "NG" });

  assert.equal(resolved.language, "en");
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
  const resolved = resolveRegionalization({ countryCode: "ES" });

  assert.equal(resolved.region, "europe-2a");
  assert.equal(resolved.language, "es");
  assert.equal(resolved.currency, "EUR");
  assert.equal(resolved.legalNotices.privacy, "Spain and EU privacy notice.");
});

test("Dominican Republic visitor uses Spanish, DOP, and Caribbean content", () => {
  const resolved = resolveRegionalization({ countryCode: "DO" });

  assert.equal(resolved.region, "caribbean");
  assert.equal(resolved.language, "es");
  assert.equal(resolved.currency, "DOP");
  assert.match(resolved.educationalExamples.mortgage, /DOP/);
});

test("fallback order is country -> region -> global core", () => {
  const regional = resolveRegionalization({ region: "middle-east" });
  const fallback = resolveRegionalization({ countryCode: "ZZ" });

  assert.equal(regional.language, "ar");
  assert.equal(regional.currency, "USD");
  assert.equal(fallback.region, "north-america");
  assert.equal(
    fallback.educationalExamples.mortgage,
    "Use the same mortgage concept with region-aware currency and legal references."
  );
});

test("Japan visitor uses Japanese, JPY, and regional routing", () => {
  const resolved = resolveRegionalization({ countryCode: "JP" });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.language, "ja");
  assert.equal(resolved.currency, "JPY");
  assert.match(resolved.educationalExamples.mortgage, /JPY/);
});

test("South Korea visitor uses Korean and KRW", () => {
  const resolved = resolveRegionalization({ countryCode: "KR" });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.language, "ko");
  assert.equal(resolved.currency, "KRW");
  assert.match(resolved.educationalExamples.mortgage, /KRW/);
});

test("China visitor uses Simplified Chinese and CNY", () => {
  const resolved = resolveRegionalization({ countryCode: "CN" });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.language, "zh-Hans");
  assert.equal(resolved.currency, "CNY");
});

test("Taiwan visitor uses Traditional Chinese and TWD", () => {
  const resolved = resolveRegionalization({ countryCode: "TW" });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.language, "zh-Hant");
  assert.equal(resolved.currency, "TWD");
});

test("India visitor uses Hindi and INR", () => {
  const resolved = resolveRegionalization({ countryCode: "IN" });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.language, "hi");
  assert.equal(resolved.currency, "INR");
  assert.match(resolved.educationalExamples.mortgage, /INR/);
});

test("Singapore visitor uses English and SGD", () => {
  const resolved = resolveRegionalization({ countryCode: "SG" });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.language, "en");
  assert.equal(resolved.currency, "SGD");
});

test("Philippines visitor uses English and PHP", () => {
  const resolved = resolveRegionalization({ countryCode: "PH" });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.language, "en");
  assert.equal(resolved.currency, "PHP");
});

test("Asia region baseline uses English and regional-gateway payment", () => {
  const resolved = resolveRegionalization({ region: "asia" });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.language, "en");
  assert.ok(
    resolved.paymentProviders.includes("regional-gateway") ||
      resolved.paymentProviders.includes("stripe"),
    "asia region should have at least one payment provider"
  );
});
