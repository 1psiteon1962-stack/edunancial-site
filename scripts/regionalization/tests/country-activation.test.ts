import test from "node:test";
import assert from "node:assert/strict";

import {
  LANGUAGE_CATALOG,
  isRtlLanguage,
  isLanguageSupported,
  normalizeLanguageCode,
  FRAMEWORK_READY_LANGUAGE_CODES,
} from "../../../src/lib/international/languages.ts";

import {
  getCountryActivation,
  isCountryEnabled,
  isCountryBeta,
  isCountrySanctioned,
  canInitiatePayment,
  canRegister,
  getEnabledCountries,
  getBetaCountries,
  getSanctionedCountries,
  getDisabledCountries,
  COUNTRY_ACTIVATION_REGISTRY,
} from "../../../src/lib/international/countryActivation.ts";

// ---------------------------------------------------------------------------
// Language catalog tests
// ---------------------------------------------------------------------------

test("language catalog contains all required European expansion languages", () => {
  const required = ["cs", "sk", "ro", "bg", "lt", "lv", "et", "be", "ru", "pl"];
  for (const code of required) {
    assert.ok(isLanguageSupported(code), `Missing language: ${code}`);
  }
});

test("language catalog contains all required Middle East languages", () => {
  const required = ["ar", "he", "fa", "ps", "ur"];
  for (const code of required) {
    assert.ok(isLanguageSupported(code), `Missing language: ${code}`);
  }
});

test("language catalog contains all required Asia-Pacific languages", () => {
  const required = ["ja", "ko", "zh-Hans", "zh-Hant", "yue-Hant", "hi", "ur", "bn", "ta", "vi", "ms", "id", "fil", "th"];
  for (const code of required) {
    assert.ok(isLanguageSupported(code), `Missing language: ${code}`);
  }
});

test("language catalog contains all required Africa Phase One languages", () => {
  const required = ["en", "fr", "ar", "pt", "sw", "lg", "ha", "yo", "ig"];
  for (const code of required) {
    assert.ok(isLanguageSupported(code), `Missing language: ${code}`);
  }
});

test("language catalog has no duplicate language registrations", () => {
  const codes = LANGUAGE_CATALOG.map((l) => l.code);
  const uniqueCodes = new Set(codes);
  assert.equal(uniqueCodes.size, codes.length);
});

test("RTL languages are correctly flagged", () => {
  const rtlLanguages = ["ar", "he", "fa", "ps", "ur"];
  for (const code of rtlLanguages) {
    assert.ok(isRtlLanguage(code), `Expected ${code} to be RTL`);
  }
});

test("LTR languages are not flagged as RTL", () => {
  const ltrLanguages = ["en", "fr", "de", "ja", "ko", "zh-Hans", "zh-Hant", "hi", "ru", "pl", "cs"];
  for (const code of ltrLanguages) {
    assert.equal(isRtlLanguage(code), false, `Expected ${code} to be LTR`);
  }
});

test("yue-Hant (Cantonese) is distinct from zh-Hant (Mandarin Traditional)", () => {
  assert.ok(isLanguageSupported("yue-Hant"));
  assert.ok(isLanguageSupported("zh-Hant"));
  assert.notEqual(
    LANGUAGE_CATALOG.find((l) => l.code === "yue-Hant"),
    LANGUAGE_CATALOG.find((l) => l.code === "zh-Hant")
  );
});

test("alias yue maps to yue-Hant", () => {
  assert.equal(normalizeLanguageCode("yue"), "yue-Hant");
});

test("alias fa-AF maps to fa", () => {
  assert.equal(normalizeLanguageCode("fa-AF"), "fa");
});

test("alias prs maps to fa", () => {
  assert.equal(normalizeLanguageCode("prs"), "fa");
});

test("framework-ready codes include all scaffold-only languages", () => {
  const frameworkReady = new Set(FRAMEWORK_READY_LANGUAGE_CODES as readonly string[]);
  const scaffoldLanguages = ["cs", "sk", "ro", "bg", "lt", "lv", "et", "be", "fa", "ps", "ha", "ig", "lg", "yue-Hant"];
  for (const code of scaffoldLanguages) {
    assert.ok(frameworkReady.has(code), `Expected ${code} to be in FRAMEWORK_READY_LANGUAGE_CODES`);
  }
});

// ---------------------------------------------------------------------------
// Country activation — restricted/sanctioned countries
// ---------------------------------------------------------------------------

test("China remains disabled and not payments-enabled", () => {
  const cn = getCountryActivation("CN");
  assert.ok(cn, "CN should exist in registry");
  assert.equal(cn!.enabled, false);
  assert.equal(cn!.beta, false);
  assert.equal(cn!.marketingEnabled, false);
  assert.equal(cn!.paymentsEnabled, false);
  assert.equal(cn!.complianceReviewRequired, true);
});

test("Iran remains disabled, payments disabled, and sanctions restricted", () => {
  const ir = getCountryActivation("IR");
  assert.ok(ir, "IR should exist in registry");
  assert.equal(ir!.enabled, false);
  assert.equal(ir!.beta, false);
  assert.equal(ir!.marketingEnabled, false);
  assert.equal(ir!.paymentsEnabled, false);
  assert.equal(ir!.complianceReviewRequired, true);
  assert.equal(ir!.sanctionsRestricted, true);
});

test("Afghanistan remains disabled and not payments-enabled", () => {
  const af = getCountryActivation("AF");
  assert.ok(af, "AF should exist in registry");
  assert.equal(af!.enabled, false);
  assert.equal(af!.beta, false);
  assert.equal(af!.marketingEnabled, false);
  assert.equal(af!.paymentsEnabled, false);
  assert.equal(af!.complianceReviewRequired, true);
});

test("Russia remains disabled, payments disabled, and sanctions restricted", () => {
  const ru = getCountryActivation("RU");
  assert.ok(ru, "RU should exist in registry");
  assert.equal(ru!.enabled, false);
  assert.equal(ru!.beta, false);
  assert.equal(ru!.marketingEnabled, false);
  assert.equal(ru!.paymentsEnabled, false);
  assert.equal(ru!.complianceReviewRequired, true);
  assert.equal(ru!.sanctionsRestricted, true);
});

test("Belarus remains disabled, payments disabled, and sanctions restricted", () => {
  const by = getCountryActivation("BY");
  assert.ok(by, "BY should exist in registry");
  assert.equal(by!.enabled, false);
  assert.equal(by!.beta, false);
  assert.equal(by!.marketingEnabled, false);
  assert.equal(by!.paymentsEnabled, false);
  assert.equal(by!.complianceReviewRequired, true);
  assert.equal(by!.sanctionsRestricted, true);
});

test("North Korea is disabled and sanctions restricted", () => {
  const kp = getCountryActivation("KP");
  assert.ok(kp, "KP should exist in registry");
  assert.equal(kp!.enabled, false);
  assert.equal(kp!.sanctionsRestricted, true);
  assert.equal(canInitiatePayment("KP"), false);
  assert.equal(canRegister("KP"), false);
});

test("Cuba is disabled and sanctions restricted", () => {
  const cu = getCountryActivation("CU");
  assert.ok(cu, "CU should exist in registry");
  assert.equal(cu!.enabled, false);
  assert.equal(cu!.sanctionsRestricted, true);
  assert.equal(canInitiatePayment("CU"), false);
});

test("Syria is disabled and sanctions restricted", () => {
  const sy = getCountryActivation("SY");
  assert.ok(sy, "SY should exist in registry");
  assert.equal(sy!.enabled, false);
  assert.equal(sy!.sanctionsRestricted, true);
  assert.equal(canInitiatePayment("SY"), false);
});

// ---------------------------------------------------------------------------
// Country activation — South Korea independent from North Korea
// ---------------------------------------------------------------------------

test("South Korea is enabled independently from North Korea", () => {
  assert.equal(isCountryEnabled("KR"), true);
  assert.equal(isCountryEnabled("KP"), false);
  assert.equal(isCountrySanctioned("KR"), false);
  assert.equal(isCountrySanctioned("KP"), true);
});

// ---------------------------------------------------------------------------
// Country activation — beta countries
// ---------------------------------------------------------------------------

test("Uganda is enabled and in beta", () => {
  const ug = getCountryActivation("UG");
  assert.ok(ug, "UG should exist in registry");
  assert.equal(ug!.enabled, true);
  assert.equal(ug!.beta, true);
  assert.equal(isCountryBeta("UG"), true);
});

test("Uganda supports en, lg, and sw", () => {
  const ug = getCountryActivation("UG");
  assert.ok(ug!.supportedLanguages.includes("en"));
  assert.ok(ug!.supportedLanguages.includes("lg"));
  assert.ok(ug!.supportedLanguages.includes("sw"));
});

test("Nigeria is enabled and in beta", () => {
  const ng = getCountryActivation("NG");
  assert.ok(ng, "NG should exist in registry");
  assert.equal(ng!.enabled, true);
  assert.equal(ng!.beta, true);
  assert.equal(isCountryBeta("NG"), true);
});

test("Nigeria supports en, ha, yo, ig", () => {
  const ng = getCountryActivation("NG");
  assert.ok(ng!.supportedLanguages.includes("en"));
  assert.ok(ng!.supportedLanguages.includes("ha"));
  assert.ok(ng!.supportedLanguages.includes("yo"));
  assert.ok(ng!.supportedLanguages.includes("ig"));
});

test("beta-country payment gate is independent of site access", () => {
  const ng = getCountryActivation("NG");
  assert.equal(ng!.enabled, true);
  assert.equal(ng!.registrationEnabled, true);
  // Beta does not block payments for Nigeria
  assert.equal(ng!.paymentsEnabled, true);

  // Uganda beta gates payments
  const ug = getCountryActivation("UG");
  assert.equal(ug!.enabled, true);
  assert.equal(ug!.featureFlags.betaAccessGate, true);
  assert.equal(ug!.paymentsEnabled, false);
});

// ---------------------------------------------------------------------------
// Country activation — Africa phase one enabled countries
// ---------------------------------------------------------------------------

test("Kenya is enabled and not in beta", () => {
  const ke = getCountryActivation("KE");
  assert.ok(ke);
  assert.equal(ke!.enabled, true);
  assert.equal(ke!.beta, false);
  assert.ok(ke!.supportedLanguages.includes("en"));
  assert.ok(ke!.supportedLanguages.includes("sw"));
});

test("Tanzania supports sw and en", () => {
  const tz = getCountryActivation("TZ");
  assert.ok(tz);
  assert.equal(tz!.enabled, true);
  assert.ok(tz!.supportedLanguages.includes("sw"));
  assert.ok(tz!.supportedLanguages.includes("en"));
});

test("India supports hi, en, bn, ta at minimum", () => {
  const ind = getCountryActivation("IN");
  assert.ok(ind);
  assert.equal(ind!.enabled, true);
  assert.ok(ind!.supportedLanguages.includes("hi"));
  assert.ok(ind!.supportedLanguages.includes("en"));
  assert.ok(ind!.supportedLanguages.includes("bn"));
  assert.ok(ind!.supportedLanguages.includes("ta"));
});

test("Pakistan supports ur and en", () => {
  const pk = getCountryActivation("PK");
  assert.ok(pk);
  assert.equal(pk!.enabled, true);
  assert.ok(pk!.supportedLanguages.includes("ur"));
  assert.ok(pk!.supportedLanguages.includes("en"));
});

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

test("canInitiatePayment returns false for sanctioned countries", () => {
  assert.equal(canInitiatePayment("IR"), false);
  assert.equal(canInitiatePayment("RU"), false);
  assert.equal(canInitiatePayment("BY"), false);
  assert.equal(canInitiatePayment("KP"), false);
  assert.equal(canInitiatePayment("CU"), false);
  assert.equal(canInitiatePayment("SY"), false);
});

test("canInitiatePayment returns false for disabled countries", () => {
  assert.equal(canInitiatePayment("CN"), false);
  assert.equal(canInitiatePayment("AF"), false);
});

test("canRegister returns false for sanctioned countries", () => {
  assert.equal(canRegister("IR"), false);
  assert.equal(canRegister("RU"), false);
  assert.equal(canRegister("BY"), false);
  assert.equal(canRegister("KP"), false);
});

test("getSanctionedCountries returns only sanctioned entries", () => {
  const sanctioned = getSanctionedCountries();
  assert.ok(sanctioned.length > 0);
  for (const c of sanctioned) {
    assert.equal(c.sanctionsRestricted, true, `${c.isoCode} should be sanctioned`);
    assert.equal(c.enabled, false, `${c.isoCode} should be disabled`);
    assert.equal(c.paymentsEnabled, false, `${c.isoCode} should have payments disabled`);
  }
  const isoCodes = sanctioned.map((c) => c.isoCode);
  assert.ok(isoCodes.includes("IR"));
  assert.ok(isoCodes.includes("RU"));
  assert.ok(isoCodes.includes("BY"));
  assert.ok(isoCodes.includes("KP"));
  assert.ok(isoCodes.includes("CU"));
  assert.ok(isoCodes.includes("SY"));
});

test("country activation registry has no duplicate ISO codes", () => {
  const codes = COUNTRY_ACTIVATION_REGISTRY.map((c) => c.isoCode);
  const uniqueCodes = new Set(codes);
  assert.equal(uniqueCodes.size, codes.length);
});

test("every disabled country has paymentGate and registrationGate set", () => {
  const disabled = getDisabledCountries();
  for (const c of disabled) {
    assert.equal(c.featureFlags.paymentGate, true, `${c.isoCode} paymentGate should be true`);
    assert.equal(c.featureFlags.registrationGate, true, `${c.isoCode} registrationGate should be true`);
  }
});

test("language preference is independent from country activation", () => {
  // Iran is disabled/sanctioned, but fa should still be a valid language
  assert.equal(isLanguageSupported("fa"), true);
  assert.equal(isCountryEnabled("IR"), false);

  // Russia is sanctioned, but ru should still be a valid language
  assert.equal(isLanguageSupported("ru"), true);
  assert.equal(isCountryEnabled("RU"), false);
});
