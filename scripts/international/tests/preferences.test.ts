import test from "node:test";
import assert from "node:assert/strict";

import {
  parseCountryCodeFromLanguageTag,
  resolveRegion,
} from "../../../src/lib/international/detection.ts";
import {
  LANGUAGE_CATALOG,
  isRtlLanguage,
  normalizeLanguageCode,
} from "../../../src/lib/international/languages.ts";
import { resolveAvailablePaymentMethods } from "../../../src/lib/international/preference-architecture.ts";
import {
  buildRegionalPreferenceCookie,
  decodeRegionalPreferenceCookie,
  resolveRegionalPreference,
} from "../../../src/lib/international/preference-engine.ts";
import {
  reportMissingTranslation,
  resolveLanguageForRegion,
  resolveSeoAlternates,
  selectPaymentProviderServerSide,
  selectPricingRecord,
} from "../../../src/lib/international/global-regional-architecture.ts";

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

test("explicit selection overrides browser and geo detection", () => {
  const resolved = resolveRegionalPreference({
    explicitSelection: {
      region: "north-america",
      country: "CA",
      language: "fr-CA",
      currency: "CAD",
    },
    browserLanguages: ["ja-JP"],
    geoDetection: { enabled: true, country: "JP", region: "asia" },
  });

  assert.equal(resolved.region, "north-america");
  assert.equal(resolved.country, "CA");
  assert.equal(resolved.language, "fr-CA");
  assert.equal(resolved.currency, "CAD");
  assert.equal(resolved.source.region, "explicit-user-selection");
});

test("cookie preference can be encoded and decoded safely", () => {
  const cookie = buildRegionalPreferenceCookie({
    region: "north-america",
    country: "US",
    language: "es",
    currency: "USD",
  });
  const raw = cookie.split(";")[0].split("=")[1];
  const decoded = decodeRegionalPreferenceCookie(raw);

  assert.deepEqual(decoded, {
    region: "north-america",
    country: "US",
    language: "es",
    currency: "USD",
  });
});

test("URL context is used when no explicit or saved preference exists", () => {
  const resolved = resolveRegionalPreference({
    urlContext: { region: "north-america", language: "es" },
  });

  assert.equal(resolved.region, "north-america");
  assert.equal(resolved.language, "es");
  assert.equal(resolved.source.language, "url-context");
});

test("browser language fallback is deterministic", () => {
  const resolved = resolveRegionalPreference({
    browserLanguages: ["fr-CA"],
  });

  assert.equal(resolved.region, "north-america");
  assert.equal(resolved.language, "fr-CA");
});

test("geo detection fallback works without forcing relocation", () => {
  const resolved = resolveRegionalPreference({
    geoDetection: { enabled: true, country: "JP", region: "asia" },
  });

  assert.equal(resolved.region, "asia");
  assert.equal(resolved.redirectRequired, false);
});

test("region default and global fallback return North America launch values", () => {
  const resolved = resolveRegionalPreference({});

  assert.equal(resolved.region, "north-america");
  assert.equal(resolved.country, "US");
  assert.equal(resolved.language, "en-US");
  assert.equal(resolved.currency, "USD");
});

test("fr-CA and fr-FR stay separate and preserve fallback order", () => {
  assert.equal(resolveLanguageForRegion("fr-CA", "north-america"), "fr-CA");
  assert.equal(resolveLanguageForRegion("fr-FR", "north-america"), "fr-FR");
});

test("Spanish regional fallback remains Spanish before English", () => {
  assert.equal(resolveLanguageForRegion("es-MX", "north-america"), "es");
});

test("disabled languages do not resolve as public options", () => {
  assert.notEqual(resolveLanguageForRegion("ht", "caribbean"), "ht");
});

test("unsupported country uses region default country and currency", () => {
  const resolved = resolveRegionalPreference({
    countrySelection: "ZZ",
  });

  assert.equal(resolved.country, "US");
  assert.equal(resolved.currency, "USD");
});

test("pricing selection only returns active approved price records", () => {
  const active = selectPricingRecord({
    region: "north-america",
    membershipTier: "starter",
    asOf: "2026-07-01",
  });
  const planned = selectPricingRecord({
    region: "latin-america",
    membershipTier: "starter",
    asOf: "2026-07-01",
  });

  assert.equal(active?.id, "na-starter-v1");
  assert.equal(planned, null);
});

test("payment provider selection is server gated by active region/provider", () => {
  const northAmerica = selectPaymentProviderServerSide({
    region: "north-america",
    country: "US",
    preferredProvider: "square",
  });
  const inactiveRegion = selectPaymentProviderServerSide({
    region: "asia",
    country: "JP",
  });

  assert.equal(northAmerica.provider, "square");
  assert.equal(inactiveRegion.provider, null);
});

test("missing translation reporting exposes fallback chain", () => {
  const report = reportMissingTranslation({
    language: "fr-FR",
    key: "membership.hero.title",
    namespace: "page-copy",
  });

  assert.equal(report.isMissing, true);
  assert.deepEqual(report.fallbackChain.slice(0, 2), ["fr-FR", "fr-CA"]);
});

test("alternate-language URL generation includes x-default", () => {
  const alternates = resolveSeoAlternates({ canonicalPath: "/" });

  assert.equal(alternates["x-default"], "https://www.edunancial.com/");
  assert.ok(alternates["en-US"]);
});

test("Arabic is marked as right-to-left", () => {
  assert.equal(isRtlLanguage("ar"), true);
});
