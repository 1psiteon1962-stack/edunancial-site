import test from "node:test";
import assert from "node:assert/strict";

import {
  countries,
  getCountry,
  isCountryInstalled,
  isCountryEnabled,
  getEnabledCountries,
  getDisabledCountries,
} from "./country-registry";

import {
  resolveRegionId,
  getRegionalConfiguration,
} from "../international/regions";

// ── Country registry presence tests ──────────────────────────────────────────

test("country registry contains Iraq (IQ)", () => {
  assert.ok(isCountryInstalled("IQ"), "IQ should be installed");
  const iq = getCountry("IQ");
  assert.ok(iq);
  assert.equal(iq?.isoCode, "IQ");
  assert.equal(iq?.country, "Iraq");
});

test("Iraq (IQ) is enabled in the registry", () => {
  assert.equal(isCountryEnabled("IQ"), true);
});

test("country registry contains all Middle East countries", () => {
  const meCodes = ["SA", "AE", "QA", "KW", "BH", "OM", "JO", "IL", "LB", "IQ"];
  for (const iso of meCodes) {
    assert.ok(isCountryInstalled(iso), `${iso} should be installed`);
  }
});

test("Iran (IR) is installed but disabled by compliance", () => {
  assert.ok(isCountryInstalled("IR"), "IR should be installed");
  assert.equal(isCountryEnabled("IR"), false);
});

test("Afghanistan (AF) is installed but disabled by compliance", () => {
  assert.ok(isCountryInstalled("AF"), "AF should be installed");
  assert.equal(isCountryEnabled("AF"), false);
});

test("China (CN) is installed but disabled by compliance", () => {
  assert.ok(isCountryInstalled("CN"), "CN should be installed");
  assert.equal(isCountryEnabled("CN"), false);
});

test("Russia (RU) is installed but disabled", () => {
  assert.ok(isCountryInstalled("RU"), "RU should be installed");
  assert.equal(isCountryEnabled("RU"), false);
});

test("Belarus (BY) is installed but disabled", () => {
  assert.ok(isCountryInstalled("BY"), "BY should be installed");
  assert.equal(isCountryEnabled("BY"), false);
});

// ── Asia-Pacific countries installed and enabled ──────────────────────────────

test("all required APAC countries are installed and enabled", () => {
  const apacCodes = ["JP", "KR", "PH", "VN", "TH", "SG", "MY", "ID", "IN", "PK", "BD", "LK"];
  for (const iso of apacCodes) {
    assert.ok(isCountryInstalled(iso), `${iso} should be installed`);
    assert.ok(isCountryEnabled(iso), `${iso} should be enabled`);
  }
});

// ── Europe countries ──────────────────────────────────────────────────────────

test("all required Europe countries are installed", () => {
  const euCodes = ["PL", "CZ", "SK", "RO", "BG", "LT", "LV", "EE"];
  for (const iso of euCodes) {
    assert.ok(isCountryInstalled(iso), `${iso} should be installed`);
    assert.ok(isCountryEnabled(iso), `${iso} should be enabled`);
  }
});

// ── Africa Phase One countries ────────────────────────────────────────────────

test("all Africa Phase One countries are installed and enabled", () => {
  const africaCodes = ["UG", "KE", "TZ", "NG", "GH", "ZA", "RW"];
  for (const iso of africaCodes) {
    assert.ok(isCountryInstalled(iso), `${iso} should be installed`);
    assert.ok(isCountryEnabled(iso), `${iso} should be enabled`);
  }
});

// ── getEnabledCountries / getDisabledCountries ────────────────────────────────

test("getEnabledCountries does not include Iran, Afghanistan, China, Russia, or Belarus", () => {
  const enabled = getEnabledCountries().map((c) => c.isoCode);
  assert.ok(!enabled.includes("IR"), "IR should not be enabled");
  assert.ok(!enabled.includes("AF"), "AF should not be enabled");
  assert.ok(!enabled.includes("CN"), "CN should not be enabled");
  assert.ok(!enabled.includes("RU"), "RU should not be enabled");
  assert.ok(!enabled.includes("BY"), "BY should not be enabled");
});

test("getDisabledCountries includes Iran, Afghanistan, China, Russia, Belarus", () => {
  const disabled = getDisabledCountries().map((c) => c.isoCode);
  assert.ok(disabled.includes("IR"), "IR should be disabled");
  assert.ok(disabled.includes("AF"), "AF should be disabled");
  assert.ok(disabled.includes("CN"), "CN should be disabled");
  assert.ok(disabled.includes("RU"), "RU should be disabled");
  assert.ok(disabled.includes("BY"), "BY should be disabled");
});

test("isCountryInstalled returns false for unknown ISO", () => {
  assert.equal(isCountryInstalled("XX"), false);
});

test("isCountryEnabled returns false for unknown ISO", () => {
  assert.equal(isCountryEnabled("XX"), false);
});

// ── Regional routing: Iraq maps to middle-east ────────────────────────────────

test("resolveRegionId maps IQ to middle-east", () => {
  assert.equal(resolveRegionId({ countryCode: "IQ" }), "middle-east");
});

test("resolveRegionId maps Asia/Baghdad timezone to middle-east", () => {
  assert.equal(resolveRegionId({ timezone: "Asia/Baghdad" }), "middle-east");
});

test("middle-east regional config includes IQ in countries list", () => {
  const config = getRegionalConfiguration("middle-east");
  assert.ok(config.countries.includes("IQ"), "IQ should be in middle-east config");
});

// ── Localization: language codes are valid catalog entries ────────────────────

test("all countries have a non-empty language field", () => {
  for (const country of countries) {
    assert.ok(
      country.language && country.language.length > 0,
      `${country.isoCode} should have a language`
    );
  }
});

test("all countries have a non-empty currency field (except disabled with empty intentionally)", () => {
  const withCurrency = countries.filter((c) => c.enabled);
  for (const country of withCurrency) {
    assert.ok(
      country.currency && country.currency.length > 0,
      `${country.isoCode} (enabled) should have a currency`
    );
  }
});
