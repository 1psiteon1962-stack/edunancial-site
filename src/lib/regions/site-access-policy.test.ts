import assert from "node:assert/strict";
import test from "node:test";

import { ALL_COUNTRY_CODES, DEFAULT_BLOCKED, decideSiteAccess, parseOverrides, countryPlan, planReasonLabel } from "./site-access-policy";

test("sanctioned jurisdictions are blocked by default", () => {
  for (const code of ["CU", "IR", "KP"]) {
    assert.equal(decideSiteAccess({ country: code }, {}).allowed, false, code);
  }
  assert.equal(decideSiteAccess({ country: "UA", subdivision: "43" }, {}).allowed, false);
  assert.equal(decideSiteAccess({ country: "UA", subdivision: "UA-14" }, {}).allowed, false);
});

test("other locations are open by default, including the rest of Ukraine and Syria", () => {
  for (const code of ["US", "PR", "DO", "GB", "ES", "BR", "CA", "DE", "CH", "SA", "AE", "AU", "SG", "HK", "IN"]) {
    assert.equal(decideSiteAccess({ country: code }, {}).allowed, true, code);
  }
  assert.equal(decideSiteAccess({ country: "UA", subdivision: "30" }, {}).allowed, false);
});

test("visitors without geolocation are allowed", () => {
  assert.equal(decideSiteAccess({}, {}).allowed, true);
  assert.equal(decideSiteAccess({ country: "XX" }, {}).allowed, true);
});

test("owner decisions override defaults in both directions", () => {
  const overrides = parseOverrides({
    CU: { state: "OPEN", reason: "U.S. policy change", updatedBy: "owner@example.com", updatedAt: "2026-11-14T00:00:00Z" },
    YE: { state: "BLOCKED", reason: null, updatedBy: "owner@example.com", updatedAt: "2026-11-14T00:00:00Z" },
    ZZ: { state: "BLOCKED" },
  });
  assert.equal(decideSiteAccess({ country: "CU" }, overrides).allowed, true);
  assert.equal(decideSiteAccess({ country: "YE" }, overrides).allowed, false);
  assert.equal(decideSiteAccess({ country: "PL" }, { PL: { state: "OPEN", reason: "Polish done", updatedBy: "owner@example.com", updatedAt: "2026-12-01T00:00:00Z" } }).allowed, true);
  assert.equal("ZZ" in overrides, false);
});

test("country list is complete and every default-blocked location is known", () => {
  assert.ok(ALL_COUNTRY_CODES.length >= 249);
  assert.equal(new Set(ALL_COUNTRY_CODES).size, ALL_COUNTRY_CODES.length);
  for (const code of Object.keys(DEFAULT_BLOCKED)) {
    assert.ok(ALL_COUNTRY_CODES.includes(code) || code.startsWith("UA-"), code);
  }
});

test("owner plan: countries wait for their language or owner approval", () => {
  for (const code of ["TR", "JP", "KR", "TW", "PL", "CZ", "HU", "SK", "SI", "HR", "GR", "RO", "BG", "UA"]) {
    assert.equal(decideSiteAccess({ country: code }, {}).allowed, false, code);
    assert.equal(countryPlan(code).reason, "WAITING_FOR_LANGUAGE", code);
  }
  for (const code of ["EG", "NG", "UG", "SY", "CN"]) {
    assert.equal(decideSiteAccess({ country: code }, {}).allowed, false, code);
    assert.equal(countryPlan(code).reason, "NOT_YET_SERVED", code);
  }
  assert.equal(decideSiteAccess({ country: "YE" }, {}).allowed, false);
  assert.equal(countryPlan("YE").reason, "OWNER_POLITICAL_BLOCK");
  assert.equal(countryPlan("SA").reason, "ENGLISH_APPROVED");
  assert.equal(countryPlan("MH").reason, "ENGLISH_APPROVED");
  for (const code of ["MH", "PW", "FM", "IL"]) assert.equal(decideSiteAccess({ country: code }, {}).allowed, true, code);
  for (const code of ["RU", "BY"]) assert.equal(decideSiteAccess({ country: code }, {}).allowed, false, code);
  assert.equal(countryPlan("SA").tier, "FULL");
  assert.equal(countryPlan("TR").tier, "REDUCED");
  assert.equal(planReasonLabel(countryPlan("JP")), "Waiting for Japanese");
});
