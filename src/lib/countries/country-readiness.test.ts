import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  assessCountryLaunchReadiness,
  canActivateCountry,
  type CountryReadiness,
} from "./country-readiness";

const ready: CountryReadiness = {
  translations: true,
  legal: true,
  payments: true,
  tax: true,
  privacy: true,
  content: true,
  support: true,
};

describe("country rollout readiness", () => {
  test("planning countries are never treated as launched even when enabled", () => {
    const assessment = assessCountryLaunchReadiness(
      { enabled: true, status: "planning", paymentsEnabled: true },
      ready,
    );

    assert.equal(assessment.launchReady, false);
    assert.equal(assessment.commercialReady, false);
  });

  test("beta and live activation require every readiness dimension", () => {
    const incomplete = { ...ready, tax: false };

    assert.equal(canActivateCountry("development", incomplete), true);
    assert.equal(canActivateCountry("beta", incomplete), false);
    assert.equal(canActivateCountry("live", incomplete), false);
    assert.equal(canActivateCountry("beta", ready), true);
    assert.equal(canActivateCountry("live", ready), true);
  });

  test("reports exact missing launch dimensions", () => {
    const assessment = assessCountryLaunchReadiness(
      { enabled: true, status: "beta", paymentsEnabled: true },
      { ...ready, translations: false, privacy: false },
    );

    assert.equal(assessment.launchReady, false);
    assert.deepEqual(assessment.missing, ["translations", "privacy"]);
  });

  test("commercial readiness additionally requires payments to be enabled", () => {
    const assessment = assessCountryLaunchReadiness(
      { enabled: true, status: "live", paymentsEnabled: false },
      ready,
    );

    assert.equal(assessment.launchReady, true);
    assert.equal(assessment.commercialReady, false);
  });

  test("disabled countries fail closed even if every readiness check is green", () => {
    const assessment = assessCountryLaunchReadiness(
      { enabled: false, status: "live", paymentsEnabled: true },
      ready,
    );

    assert.equal(assessment.launchReady, false);
    assert.equal(assessment.commercialReady, false);
  });
});
