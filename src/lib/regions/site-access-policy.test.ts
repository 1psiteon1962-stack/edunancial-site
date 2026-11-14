import assert from "node:assert/strict";
import test from "node:test";

import { ALL_COUNTRY_CODES, DEFAULT_BLOCKED, decideSiteAccess, parseOverrides } from "./site-access-policy";

test("sanctioned jurisdictions are blocked by default", () => {
  for (const code of ["CU", "IR", "KP"]) {
    assert.equal(decideSiteAccess({ country: code }, {}).allowed, false, code);
  }
  assert.equal(decideSiteAccess({ country: "UA", subdivision: "43" }, {}).allowed, false);
  assert.equal(decideSiteAccess({ country: "UA", subdivision: "UA-14" }, {}).allowed, false);
});

test("other locations are open by default, including the rest of Ukraine and Syria", () => {
  for (const code of ["US", "PR", "DO", "GB", "ES", "BR", "SY", "YE"]) {
    assert.equal(decideSiteAccess({ country: code }, {}).allowed, true, code);
  }
  assert.equal(decideSiteAccess({ country: "UA", subdivision: "30" }, {}).allowed, true);
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
  assert.equal("ZZ" in overrides, false);
});

test("country list is complete and every default-blocked location is known", () => {
  assert.ok(ALL_COUNTRY_CODES.length >= 249);
  assert.equal(new Set(ALL_COUNTRY_CODES).size, ALL_COUNTRY_CODES.length);
  for (const code of Object.keys(DEFAULT_BLOCKED)) {
    assert.ok(ALL_COUNTRY_CODES.includes(code) || code.startsWith("UA-"), code);
  }
});
