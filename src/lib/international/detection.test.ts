import test from "node:test";
import assert from "node:assert/strict";
import { spanishLocaleForNetworkCountry } from "./detection";

test("Spain receives European Spanish recommendation", () => {
  assert.equal(spanishLocaleForNetworkCountry("ES"), "es-ES");
});
test("Caribbean and Latin American countries use Caribbean Spanish dialect", () => {
  for (const country of ["DO", "PR", "CU", "MX", "GT", "CO", "AR", "CL", "PE", "BR"]) {
    assert.equal(spanishLocaleForNetworkCountry(country), "es-Caribbean");
  }
});
test("English, French and other territories do not force a Spanish language", () => {
  for (const country of ["US", "CA", "GB", "FR", "PT", "DE", ""]) {
    assert.equal(spanishLocaleForNetworkCountry(country), null);
  }
});
