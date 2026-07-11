import test from "node:test";
import assert from "node:assert/strict";

import { DefaultFeatures } from "../src/config/featureFlags.ts";
import { languages as supportedLanguages } from "../src/lib/i18n/languages.ts";
import {
  APAC_FOUNDATION_COUNTRIES,
  APAC_LANGUAGE_REGISTRY,
} from "../src/lib/regionalization/apacFoundation.ts";

test("APAC locales are supported by the global language framework", () => {
  const supported = new Set(supportedLanguages);

  for (const locale of APAC_LANGUAGE_REGISTRY) {
    assert.ok(supported.has(locale.code));
  }
});

test("APAC rollout surfaces stay disabled and noindex by default", () => {
  assert.equal(DefaultFeatures.apacFoundation, false);
  assert.equal(DefaultFeatures.apacRegionalPricing, false);
  assert.equal(DefaultFeatures.apacTax, false);
  assert.equal(DefaultFeatures.apacCompliance, false);
  assert.equal(DefaultFeatures.apacSeo, false);
  assert.equal(DefaultFeatures.founderControls, false);
  assert.equal(DefaultFeatures.betaTesterControls, false);

  for (const country of APAC_FOUNDATION_COUNTRIES) {
    assert.equal(country.seo.indexable, false);
    assert.equal(country.launchControls.public, false);
  }
});
