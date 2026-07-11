import test from "node:test";
import assert from "node:assert/strict";

import {
  APAC_CURRENCY_REGISTRY,
  APAC_FOUNDATION_COUNTRIES,
  APAC_FOUNDATION_FLAGS,
  APAC_LANGUAGE_REGISTRY,
  isApacAudienceEnabled,
} from "../src/lib/regionalization/apacFoundation.ts";

test("APAC foundation remains private by default", () => {
  assert.equal(APAC_FOUNDATION_FLAGS.region, false);
  assert.equal(APAC_FOUNDATION_FLAGS.founderControls, false);
  assert.equal(APAC_FOUNDATION_FLAGS.betaTesterControls, false);

  for (const country of APAC_FOUNDATION_COUNTRIES) {
    assert.equal(isApacAudienceEnabled(country.id, "public"), false);
    assert.equal(isApacAudienceEnabled(country.id, "founders"), false);
    assert.equal(isApacAudienceEnabled(country.id, "betaTesters"), false);
  }
});

test("APAC foundation publishes unique locale and currency registries", () => {
  assert.ok(APAC_FOUNDATION_COUNTRIES.length >= 5);

  const localeCodes = APAC_LANGUAGE_REGISTRY.map((language) => language.code);
  const currencyCodes = APAC_CURRENCY_REGISTRY.map((currency) => currency.code);

  assert.deepEqual(localeCodes, [...new Set(localeCodes)]);
  assert.deepEqual(currencyCodes, [...new Set(currencyCodes)]);

  assert.ok(localeCodes.includes("hi"));
  assert.ok(localeCodes.includes("fil"));
  assert.ok(localeCodes.includes("zh"));
  assert.ok(currencyCodes.includes("INR"));
  assert.ok(currencyCodes.includes("JPY"));
  assert.ok(currencyCodes.includes("AUD"));
});
