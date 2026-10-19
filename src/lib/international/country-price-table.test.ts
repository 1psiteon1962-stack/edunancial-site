import test from "node:test";
import assert from "node:assert/strict";
import { COUNTRY_PRICE_TABLE, formatCountryPrice, getDisplayCountryPrices } from "./country-price-table";

test("Dominican Republic shows approved peso prices", () => {
  const entry = getDisplayCountryPrices("do");
  if (!entry) throw new Error("DO prices missing");
  assert.equal(entry.currency, "DOP");
  assert.deepEqual(entry.plans.basic, { monthly: 399, annual: 3199 });
  assert.deepEqual(entry.plans.premium, { monthly: 699, annual: 5599 });
  assert.deepEqual(entry.plans.enterprise, { monthly: 999, annual: 7499 });
  assert.match(formatCountryPrice(399, entry), /399/u);
});
test("Peso checkout stays closed until the processor can charge DOP", () => {
  assert.equal(COUNTRY_PRICE_TABLE.DO.checkoutEnabled, false);
});
test("Countries without an approved entry get no invented price", () => {
  for (const code of ["US", "CA", "JM", "TC", "BB", "GP", "", undefined]) {
    assert.equal(getDisplayCountryPrices(code), null);
  }
});
