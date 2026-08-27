import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { getLocalizedCatalogPrice, localizeUsdPrice } from "@/lib/location/pricing";

describe("country pricing policy", () => {
  test("keeps the United States on the USD master price", () => {
    assert.deepEqual(localizeUsdPrice(39.99, "US"), {
      countryCode: "US",
      currency: "USD",
      amount: 39.99,
      baseUsdAmount: 39.99,
      exchangeRate: 1,
      rateVersion: "us-base-2026-q3",
    });
  });

  test("derives Canada from the USD master price at the approved planning rate", () => {
    assert.equal(localizeUsdPrice(39.99, "CA")?.amount, 55.99);
    assert.equal(localizeUsdPrice(69.99, "CA")?.amount, 97.99);
    assert.equal(localizeUsdPrice(99.99, "CA")?.amount, 139.99);
  });

  test("derives active catalog membership items without duplicating base prices", () => {
    const basic = getLocalizedCatalogPrice("membership-basic-monthly", "CA");
    assert.equal(basic?.currency, "CAD");
    assert.equal(basic?.amount, 55.99);
    assert.equal(basic?.baseUsdAmount, 39.99);
  });

  test("fails closed for countries without an approved pricing policy", () => {
    assert.equal(localizeUsdPrice(39.99, "GB"), null);
  });
});
