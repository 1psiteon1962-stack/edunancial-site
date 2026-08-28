import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  getCommercialReadyCountries,
  getEnabledCountries,
  getLaunchReadyCountries,
  isCountryCommercialReady,
  isCountryLaunchReady,
} from "./country-service";

describe("country service readiness APIs", () => {
  test("configured enabled countries are broader than launch-ready countries", () => {
    const enabled = getEnabledCountries().map((country) => country.isoCode);
    const launchReady = getLaunchReadyCountries().map((country) => country.isoCode);
    assert.ok(enabled.includes("UG"));
    assert.ok(!launchReady.includes("UG"));
  });

  test("United States is launch and commercial ready", () => {
    assert.equal(isCountryLaunchReady("us"), true);
    assert.equal(isCountryCommercialReady("US"), true);
    assert.ok(getLaunchReadyCountries().some((country) => country.isoCode === "US"));
    assert.ok(getCommercialReadyCountries().some((country) => country.isoCode === "US"));
  });

  test("Canada remains blocked from launch and commercial readiness", () => {
    assert.equal(isCountryLaunchReady("CA"), false);
    assert.equal(isCountryCommercialReady("ca"), false);
  });
});
