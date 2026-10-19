import test from "node:test";
import assert from "node:assert/strict";
import { COUNTRY_PRICE_TABLE, formatCountryPrice, getDisplayCountryPrices } from "./country-price-table";
import { roundToCleanPrice } from "./country-pricing-formula";

function prices(code: string) {
  const entry = getDisplayCountryPrices(code);
  if (!entry) throw new Error(`no prices for ${code}`);
  return entry;
}

test("Dominican Republic keeps its hand-approved peso prices", () => {
  const entry = prices("do");
  assert.equal(entry.status, "APPROVED");
  assert.equal(entry.currency, "DOP");
  assert.deepEqual(entry.plans.basic, { monthly: 399, annual: 3199 });
  assert.deepEqual(entry.plans.premium, { monthly: 699, annual: 5599 });
  assert.deepEqual(entry.plans.enterprise, { monthly: 999, annual: 7499 });
  assert.match(formatCountryPrice(399, entry), /399/u);
  assert.equal(COUNTRY_PRICE_TABLE.DO.checkoutEnabled, false);
});

test("Formula prices match the owner-approved proposal (2026-10-19)", () => {
  const expected: Record<string, [string, number[]]> = {
    MX: ["MXN", [119, 999, 209, 1699, 329, 2499]],
    JM: ["JMD", [1099, 8499, 1799, 14199, 2799, 21299]],
    HT: ["HTG", [589, 4699, 979, 7799, 1599, 11799]],
    BB: ["BBD", [29.99, 239, 49.99, 399, 79.99, 599]],
    GP: ["EUR", [12.99, 109, 21.99, 179, 35.99, 269]],
  };
  for (const [code, [currency, values]] of Object.entries(expected)) {
    const entry = prices(code);
    assert.equal(entry.status, "FORMULA", code);
    assert.equal(entry.currency, currency, code);
    const actual = [entry.plans.basic, entry.plans.premium, entry.plans.enterprise].flatMap((p) => [p.monthly, p.annual]);
    assert.deepEqual(actual, values, code);
    assert.equal(entry.checkoutEnabled, false, code);
  }
});

test("High-income US-dollar countries get exact US prices with normal checkout", () => {
  for (const code of ["PR", "TC"]) {
    const entry = prices(code);
    assert.equal(entry.currency, "USD");
    assert.deepEqual(entry.plans.basic, { monthly: 14.99, annual: 119.99 });
    assert.deepEqual(entry.plans.enterprise, { monthly: 39.99, annual: 299.99 });
    assert.equal(entry.checkoutEnabled, true);
  }
});

test("US and Canada keep existing pricing; excluded or unknown countries get no invented price", () => {
  for (const code of ["US", "CA", "CU", "IR", "KP", "SY", "ZZ", "", undefined]) {
    assert.equal(getDisplayCountryPrices(code), null, String(code));
  }
});

test("Clean rounding", () => {
  assert.equal(roundToCleanPrice(13.35), 12.99);
  assert.equal(roundToCleanPrice(124.8), 119);
  assert.equal(roundToCleanPrice(1064), 1099);
  assert.equal(roundToCleanPrice(121773), 121999);
});
