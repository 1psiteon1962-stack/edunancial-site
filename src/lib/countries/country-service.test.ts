import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  getCommercialReadyCountries,
  getCountriesForFeature,
  getEnabledCountries,
  getLaunchReadyCountries,
  isCountryCommercialReady,
  isCountryFeatureEnabled,
  isCountryLaunchReady,
} from "./country-service";

describe("country service readiness APIs", () => {
  test("configured enabled countries are broader than launch-ready countries", () => {
    const enabled = getEnabledCountries().map((country) => country.isoCode);
    const launchReady = getLaunchReadyCountries().map((country) => country.isoCode);
    assert.ok(enabled.includes("UG"));
    assert.ok(!launchReady.includes("UG"));
  });

  test("United States is launch, commercial, and payment ready", () => {
    assert.equal(isCountryLaunchReady("us"), true);
    assert.equal(isCountryCommercialReady("US"), true);
    assert.equal(isCountryFeatureEnabled("US", "paymentsEnabled"), true);
    assert.ok(getLaunchReadyCountries().some((country) => country.isoCode === "US"));
    assert.ok(getCommercialReadyCountries().some((country) => country.isoCode === "US"));
    assert.ok(getCountriesForFeature("paymentsEnabled").some((country) => country.isoCode === "US"));
  });

  test("Canada remains blocked from launch, commercial, and payment readiness", () => {
    assert.equal(isCountryLaunchReady("CA"), false);
    assert.equal(isCountryCommercialReady("ca"), false);
    assert.equal(isCountryFeatureEnabled("CA", "paymentsEnabled"), false);
    assert.ok(!getCountriesForFeature("paymentsEnabled").some((country) => country.isoCode === "CA"));
  });

  test("a legacy paymentsEnabled flag cannot bypass commercial certification", () => {
    const canada = getEnabledCountries().find((country) => country.isoCode === "CA");
    assert.ok(canada);
    assert.equal(canada.paymentsEnabled, true);
    assert.equal(isCountryFeatureEnabled("CA", "paymentsEnabled"), false);
  });
});
