import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { countries } from "./country-registry";
import { getCountryByISO, getCountriesForFeature, isCountryFeatureEnabled } from "./country-service";

describe("authoritative country registry", () => {
  test("uses unique ISO-3166 alpha-2 style codes and ISO-4217 style currencies", () => {
    const codes = countries.map((country) => country.isoCode);
    assert.equal(new Set(codes).size, codes.length, "duplicate country ISO code");
    for (const country of countries) {
      assert.match(country.isoCode, /^[A-Z]{2}$/u, country.country);
      assert.match(country.currency, /^[A-Z]{3}$/u, country.country);
    }
  });

  test("never marks a disabled country live or grants enabled features", () => {
    for (const country of countries) {
      if (!country.enabled) {
        assert.notEqual(country.status, "live", country.country);
        assert.equal(country.membershipEnabled, false, `${country.country} membership`);
        assert.equal(country.marketplaceEnabled, false, `${country.country} marketplace`);
        assert.equal(country.paymentsEnabled, false, `${country.country} payments`);
        assert.equal(country.coursesEnabled, false, `${country.country} courses`);
        assert.equal(country.assessmentsEnabled, false, `${country.country} assessments`);
        assert.equal(country.hiringEnabled, false, `${country.country} hiring`);
        assert.equal(country.aiEnabled, false, `${country.country} AI`);
      }
    }
  });

  test("normalizes ISO lookups and fails closed for unknown countries", () => {
    assert.equal(getCountryByISO(" us ")?.isoCode, "US");
    assert.equal(isCountryFeatureEnabled("US", "paymentsEnabled"), true);
    assert.equal(isCountryFeatureEnabled("ZZ", "paymentsEnabled"), false);
  });

  test("feature lists include only enabled countries", () => {
    for (const country of getCountriesForFeature("paymentsEnabled")) {
      assert.equal(country.enabled, true);
      assert.equal(country.paymentsEnabled, true);
    }
  });
});
