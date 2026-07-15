import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_REGION_ID,
  getRegionalConfiguration,
  resolveRegionId,
} from "../../../src/lib/international/regions.ts";
import { resolveRegionalPaymentPlan } from "../../../src/lib/payments/regional-provider-registry.ts";
import {
  resolveRegionalContentValue,
  upsertRegionalOverride,
} from "../../../src/lib/international/regional-content.ts";
import { getRegionalCompliancePlaceholders } from "../../../src/lib/international/compliance.ts";
import {
  applyManualRegionalPreferences,
  suggestRegionalExperience,
} from "../../../src/lib/international/geo-detection.ts";
import { translate } from "../../../src/lib/international/i18n.ts";

test("regional config falls back to North America by default", () => {
  const resolved = getRegionalConfiguration("unknown-region");

  assert.equal(resolved.id, DEFAULT_REGION_ID);
  assert.deepEqual(resolved.paymentProviders, ["square"]);
});

test("north america supports distinct launch language variants", () => {
  const northAmerica = getRegionalConfiguration("north-america");

  assert.deepEqual(northAmerica.supportedLanguages, ["en-US", "es", "fr-CA", "fr-FR"]);
});

test("regional payment architecture preserves Square default in North America", () => {
  const paymentPlan = resolveRegionalPaymentPlan("north-america");

  assert.equal(paymentPlan.primaryProvider.id, "square");
  assert.equal(paymentPlan.defaultCurrency, "USD");
});

test("africa and europe payment providers include required regional methods", () => {
  const africa = getRegionalConfiguration("africa");
  const europe = getRegionalConfiguration("europe");

  assert.deepEqual(africa.paymentProviders, [
    "flutterwave",
    "paystack",
    "mobile-money",
    "stripe",
  ]);
  assert.deepEqual(europe.paymentProviders, ["stripe", "paypal", "local-eu-methods"]);
});

test("translation catalogs include all phase 1 supported languages", () => {
  const titleKey = "foundation.phase1.title";

  assert.notEqual(translate("en", titleKey), titleKey);
  assert.notEqual(translate("es", titleKey), titleKey);
  assert.notEqual(translate("fr", titleKey), titleKey);
  assert.notEqual(translate("pt", titleKey), titleKey);
  assert.notEqual(translate("ar", titleKey), titleKey);
  assert.notEqual(translate("sw", titleKey), titleKey);
  assert.notEqual(translate("ja", titleKey), titleKey);
  assert.notEqual(translate("ko", titleKey), titleKey);
  assert.notEqual(translate("zh-Hans", titleKey), titleKey);
});

test("regional content uses North America fallback when no override exists", () => {
  const entry = {
    id: "courses-foundations",
    type: "courses" as const,
    defaultValue: "North America launch course set",
  };

  assert.equal(
    resolveRegionalContentValue(entry, "middle-east"),
    "North America launch course set"
  );

  const updated = upsertRegionalOverride(entry, {
    regionId: "middle-east",
    value: "Middle East launch course set",
  });

  assert.equal(
    resolveRegionalContentValue(updated, "middle-east"),
    "Middle East launch course set"
  );
});

test("compliance placeholders are region-aware and require legal review", () => {
  const europePlaceholders = getRegionalCompliancePlaceholders("europe");

  assert.ok(europePlaceholders.some((item) => item.framework === "gdpr"));
  assert.ok(europePlaceholders.every((item) => item.legalReviewRequired));
});

test("geo detection suggests regional defaults and allows manual override", () => {
  const suggestion = suggestRegionalExperience({
    countryCode: "JP",
    acceptLanguage: "ja-JP",
    timezone: "Asia/Tokyo",
  });

  assert.equal(resolveRegionId({ countryCode: "JP" }), "asia-pacific");
  assert.equal(suggestion.regionId, "asia-pacific");
  assert.equal(suggestion.language, "ja");

  const manuallyAdjusted = applyManualRegionalPreferences(suggestion, {
    regionId: "north-america",
    currency: "CAD",
    language: "fr-CA",
  });

  assert.equal(manuallyAdjusted.regionId, "north-america");
  assert.equal(manuallyAdjusted.currency, "CAD");
  assert.equal(manuallyAdjusted.language, "fr-CA");
});
