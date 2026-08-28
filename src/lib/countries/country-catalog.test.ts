import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { countryCatalog, getCountryCatalogDuplicateIsoCodes } from "./country-catalog";
import { getCountryByISO, isCountryLaunchReady } from "./country-service";

describe("country catalog", () => {
  test("catalog has unique ISO codes", () => {
    assert.deepEqual(getCountryCatalogDuplicateIsoCodes(), []);
  });

  test("priority Latin America, Caribbean, and Western Europe markets are represented", () => {
    for (const iso of ["MX", "BR", "PR", "DO", "GB", "ES", "FR", "DE", "IT", "NL", "PT"]) {
      assert.ok(countryCatalog.some((country) => country.isoCode === iso), `${iso} missing from country catalog`);
    }
  });

  test("new priority expansion records are planning and fail closed", () => {
    const mexico = getCountryByISO("MX");
    assert.ok(mexico);
    assert.equal(mexico.status, "planning");
    assert.equal(mexico.enabled, false);
    assert.equal(mexico.paymentsEnabled, false);
    assert.equal(isCountryLaunchReady("MX"), false);
  });

  test("Puerto Rico is represented separately for territory-specific handling", () => {
    const puertoRico = getCountryByISO("PR");
    assert.ok(puertoRico);
    assert.equal(puertoRico.currency, "USD");
    assert.equal(puertoRico.status, "planning");
    assert.equal(isCountryLaunchReady("PR"), false);
  });
});
