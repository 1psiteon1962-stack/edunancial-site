import test from "node:test";
import assert from "node:assert/strict";

import {
  getCountryKnowledge,
  getSupportedKnowledgeCountries,
  getCountryKnowledgeSummary,
} from "./country-knowledge";

import {
  buildCountrySelectionContext,
  getCountrySelectionOptions,
  resolveCountryContext,
  buildCoachingInstruction,
  getSelectableCountries,
} from "./country-selection";

import {
  COMPLIANCE_GATED_COUNTRY_FLAGS,
  AI_COUNTRY_FEATURE_FLAGS,
} from "../../config/featureFlags";

// ── Country knowledge tests ──────────────────────────────────────────────────

test("getCountryKnowledge returns knowledge for US", () => {
  const k = getCountryKnowledge("US");
  assert.ok(k, "US knowledge should exist");
  assert.equal(k?.isoCode, "US");
  assert.ok(k?.businessEntities.length > 0);
  assert.ok(k?.taxation.taxAuthority.length > 0);
});

test("getCountryKnowledge returns knowledge for Uganda", () => {
  const k = getCountryKnowledge("UG");
  assert.ok(k, "Uganda knowledge should exist");
  assert.equal(k?.isoCode, "UG");
  assert.equal(k?.companyRegistration.registrationBodyLocalName, "URSB");
});

test("getCountryKnowledge returns knowledge for Nigeria", () => {
  const k = getCountryKnowledge("NG");
  assert.ok(k, "Nigeria knowledge should exist");
  assert.equal(k?.companyRegistration.registrationBodyLocalName, "CAC");
});

test("getCountryKnowledge returns knowledge for Japan", () => {
  const k = getCountryKnowledge("JP");
  assert.ok(k, "Japan knowledge should exist");
  assert.equal(k?.primaryLanguage, "ja");
});

test("getCountryKnowledge returns null for unknown country", () => {
  const k = getCountryKnowledge("XX");
  assert.equal(k, null);
});

test("getSupportedKnowledgeCountries returns array of ISO codes", () => {
  const codes = getSupportedKnowledgeCountries();
  assert.ok(Array.isArray(codes));
  assert.ok(codes.includes("US"));
  assert.ok(codes.includes("UG"));
  assert.ok(codes.includes("NG"));
});

test("getCountryKnowledgeSummary returns correct structure for known country", () => {
  const summary = getCountryKnowledgeSummary("US");
  assert.equal(summary.hasKnowledge, true);
  assert.equal(summary.country, "United States");
  assert.ok(summary.entityCount > 0);
  assert.equal(summary.hasAccountingInfo, true);
  assert.equal(summary.hasTaxationInfo, true);
});

test("getCountryKnowledgeSummary returns hasKnowledge false for unknown country", () => {
  const summary = getCountryKnowledgeSummary("XX");
  assert.equal(summary.hasKnowledge, false);
  assert.equal(summary.country, null);
  assert.equal(summary.entityCount, 0);
});

// ── US terminology not assumed for other countries ────────────────────────────

test("Uganda knowledge does not use US terminology like LLC or IRS", () => {
  const k = getCountryKnowledge("UG");
  assert.ok(k);
  // Confirm no US-specific term appears in Uganda's registration body
  assert.notEqual(k.companyRegistration.taxIdentifierLocalName, "EIN");
  assert.notEqual(k.companyRegistration.registrationBodyLocalName, "Secretary of State");
  // Confirm IRS is not the tax authority for Uganda
  assert.notEqual(k.taxation.taxAuthorityLocalName, "IRS");
});

test("Nigeria knowledge uses CAC and FIRS, not US-specific terms", () => {
  const k = getCountryKnowledge("NG");
  assert.ok(k);
  assert.equal(k.companyRegistration.registrationBodyLocalName, "CAC");
  assert.equal(k.taxation.taxAuthorityLocalName, "FIRS");
  assert.notEqual(k.taxation.taxAuthorityLocalName, "IRS");
});

// ── Country selection level tests ─────────────────────────────────────────────

test("Level 1: only home country option is available", () => {
  const options = getCountrySelectionOptions("UG", 1);
  const available = options.filter((o) => o.available);
  assert.equal(available.length, 1);
  assert.equal(available[0].mode, "home");
});

test("Level 2: only home country option is available", () => {
  const options = getCountrySelectionOptions("NG", 2);
  const available = options.filter((o) => o.available);
  assert.equal(available.length, 1);
  assert.equal(available[0].mode, "home");
});

test("Level 3: home, US, and other options are all available", () => {
  const options = getCountrySelectionOptions("JP", 3);
  const available = options.filter((o) => o.available);
  assert.equal(available.length, 3);
  const modes = available.map((o) => o.mode);
  assert.ok(modes.includes("home"));
  assert.ok(modes.includes("us"));
  assert.ok(modes.includes("other"));
});

test("buildCountrySelectionContext defaults to home mode", () => {
  const ctx = buildCountrySelectionContext({ homeCountryIso: "UG", level: 1 });
  assert.equal(ctx.selectedCountryIso, "UG");
  assert.equal(ctx.mode, "home");
});

test("buildCountrySelectionContext throws when requesting US at Level 1", () => {
  assert.throws(
    () => buildCountrySelectionContext({ homeCountryIso: "UG", level: 1, mode: "us" }),
    /Level 3/
  );
});

test("buildCountrySelectionContext throws when requesting other at Level 2", () => {
  assert.throws(
    () =>
      buildCountrySelectionContext({
        homeCountryIso: "NG",
        level: 2,
        mode: "other",
        requestedIso: "JP",
      }),
    /Level 3/
  );
});

test("buildCountrySelectionContext allows US selection at Level 3", () => {
  const ctx = buildCountrySelectionContext({
    homeCountryIso: "UG",
    level: 3,
    mode: "us",
  });
  assert.equal(ctx.selectedCountryIso, "US");
  assert.equal(ctx.mode, "us");
});

test("buildCountrySelectionContext allows other country at Level 3", () => {
  const ctx = buildCountrySelectionContext({
    homeCountryIso: "UG",
    level: 3,
    mode: "other",
    requestedIso: "ng",
  });
  assert.equal(ctx.selectedCountryIso, "NG");
  assert.equal(ctx.mode, "other");
});

// ── resolveCountryContext tests ───────────────────────────────────────────────

test("resolveCountryContext returns knowledge for home country", () => {
  const ctx = buildCountrySelectionContext({ homeCountryIso: "UG", level: 1 });
  const resolved = resolveCountryContext(ctx);
  assert.equal(resolved.hasKnowledge, true);
  assert.equal(resolved.knowledge?.isoCode, "UG");
  assert.equal(resolved.comparisonCountry, null);
});

test("resolveCountryContext provides comparison country at Level 2 when different", () => {
  const ctx = buildCountrySelectionContext({
    homeCountryIso: "UG",
    level: 3,
    mode: "us",
  });
  // Override level to 2 for comparison test
  const ctx2 = { ...ctx, level: 2 as const };
  const resolved = resolveCountryContext(ctx2);
  assert.ok(resolved.comparisonCountry);
  assert.equal(resolved.comparisonCountry?.isoCode, "UG");
});

test("resolveCountryContext has no comparisonCountry at Level 1", () => {
  const ctx = buildCountrySelectionContext({ homeCountryIso: "NG", level: 1 });
  const resolved = resolveCountryContext(ctx);
  assert.equal(resolved.comparisonCountry, null);
});

// ── buildCoachingInstruction tests ────────────────────────────────────────────

test("buildCoachingInstruction for Uganda Level 1 does not mention foreign systems", () => {
  const ctx = buildCountrySelectionContext({ homeCountryIso: "UG", level: 1 });
  const resolved = resolveCountryContext(ctx);
  const instruction = buildCoachingInstruction(resolved);
  assert.ok(instruction.includes("Uganda"));
  assert.ok(instruction.includes("Do not reference foreign"));
  assert.ok(!instruction.includes("United States"), "Should not mention US for Level 1");
});

test("buildCoachingInstruction for unknown country uses fallback", () => {
  const ctx = buildCountrySelectionContext({ homeCountryIso: "XX", level: 1 });
  const resolved = resolveCountryContext(ctx);
  const instruction = buildCoachingInstruction(resolved);
  assert.ok(instruction.includes("not yet available"));
});

// ── Compliance-gated flag tests ───────────────────────────────────────────────

test("China is disabled via compliance-gated flag", () => {
  assert.equal(COMPLIANCE_GATED_COUNTRY_FLAGS.chinaEnabled, false);
});

test("Russia is disabled via compliance-gated flag", () => {
  assert.equal(COMPLIANCE_GATED_COUNTRY_FLAGS.russiaEnabled, false);
});

test("Belarus is disabled via compliance-gated flag", () => {
  assert.equal(COMPLIANCE_GATED_COUNTRY_FLAGS.belarusEnabled, false);
});

test("Iran is disabled via compliance-gated flag", () => {
  assert.equal(COMPLIANCE_GATED_COUNTRY_FLAGS.iranEnabled, false);
});

test("Afghanistan is disabled via compliance-gated flag", () => {
  assert.equal(COMPLIANCE_GATED_COUNTRY_FLAGS.afghanistanEnabled, false);
});

// ── AI country feature flags ──────────────────────────────────────────────────

test("AI country selection is enabled in feature flags", () => {
  assert.equal(AI_COUNTRY_FEATURE_FLAGS.aiCountrySelection, true);
});

test("AI country knowledge is enabled in feature flags", () => {
  assert.equal(AI_COUNTRY_FEATURE_FLAGS.aiCountryKnowledge, true);
});

// ── Selectable countries utility ──────────────────────────────────────────────

test("getSelectableCountries returns array with label and isoCode", () => {
  const countries = getSelectableCountries();
  assert.ok(Array.isArray(countries));
  assert.ok(countries.length > 0);
  const us = countries.find((c) => c.isoCode === "US");
  assert.ok(us);
  assert.equal(us?.label, "United States");
});
