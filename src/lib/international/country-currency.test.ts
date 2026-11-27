import assert from "node:assert/strict";
import test from "node:test";

import { getCountryCurrency } from "./country-currency";

test("Uganda resolves to UGX, not the Africa regional USD default", () => {
  assert.equal(getCountryCurrency("UG"), "UGX");
  assert.equal(getCountryCurrency("ug"), "UGX");
});

test("countries outside the edge profile resolve to their own currency", () => {
  assert.equal(getCountryCurrency("KE"), "KES");
  assert.equal(getCountryCurrency("NG"), "NGN");
  assert.equal(getCountryCurrency("GH"), "GHS");
  assert.equal(getCountryCurrency("US"), "USD");
  assert.equal(getCountryCurrency("DO"), "DOP");
});

test("unknown or invalid codes return null instead of guessing USD", () => {
  assert.equal(getCountryCurrency(""), null);
  assert.equal(getCountryCurrency(null), null);
  assert.equal(getCountryCurrency("XX"), null);
  assert.equal(getCountryCurrency("USA"), null);
});
