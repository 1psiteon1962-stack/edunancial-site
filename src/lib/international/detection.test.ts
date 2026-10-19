import test from "node:test";
import assert from "node:assert/strict";
import { countryFromTimezone, resolveRegion, spanishLocaleForNetworkCountry } from "./detection";

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

test("Device time zone identifies the Dominican Republic even when the phone language is es-ES", () => {
  assert.equal(countryFromTimezone("America/Santo_Domingo"), "do");
  assert.equal(spanishLocaleForNetworkCountry("DO"), "es-Caribbean");
  assert.equal(resolveRegion("do", "America/Santo_Domingo"), "caribbean");
});
test("Launch Caribbean time zones map to their own countries", () => {
  assert.equal(countryFromTimezone("America/Jamaica"), "jm");
  assert.equal(countryFromTimezone("America/Barbados"), "bb");
  assert.equal(countryFromTimezone("America/Puerto_Rico"), "pr");
  assert.equal(countryFromTimezone("Europe/Madrid"), "es");
});
test("Unknown time zone gives no country guess", () => {
  assert.equal(countryFromTimezone("Antarctica/Troll"), null);
  assert.equal(countryFromTimezone(undefined), null);
});
