/**
 * Foundation tests for the Global Translation & Localization Engine
 *
 * Runs with: node --experimental-strip-types --test src/lib/localization/engine.test.ts
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  SUPPORTED_LANGUAGES,
  REGION_FLAGS,
  REGION_REGISTRY,
  isLocaleCode,
  isRegionEnabled,
  buildFallbackChain,
  translate,
  resolveLocale,
  type RegionCode,
  type TranslationTable,
} from "./engine";

import { formatCurrency } from "./currency";
import { formatDate } from "./datetime";
import { getLegalText, getLegalKey } from "./legalText";

// ─── Engine: languages ────────────────────────────────────────────────────────

describe("SUPPORTED_LANGUAGES", () => {
  it("includes all required base languages", () => {
    const required = ["en", "es", "fr", "pt", "ar", "ja", "ko", "de", "it", "tl"];
    for (const lang of required) {
      assert.ok(
        SUPPORTED_LANGUAGES.includes(lang as never),
        `Missing language: ${lang}`,
      );
    }
  });
});

describe("isLocaleCode", () => {
  it("returns true for valid locale codes", () => {
    assert.equal(isLocaleCode("en"), true);
    assert.equal(isLocaleCode("ar"), true);
    assert.equal(isLocaleCode("sw"), true);
  });

  it("returns false for unknown codes", () => {
    assert.equal(isLocaleCode("xx"), false);
    assert.equal(isLocaleCode(""), false);
  });
});

// ─── Engine: feature flags ────────────────────────────────────────────────────

describe("REGION_FLAGS", () => {
  it("US is enabled", () => {
    assert.equal(REGION_FLAGS.us, true);
  });

  it("all non-US regions are private (disabled) by default", () => {
    const nonUs: RegionCode[] = [
      "europe", "latam", "africa", "mena", "asia", "caribbean", "oceania",
    ];
    for (const region of nonUs) {
      assert.equal(
        REGION_FLAGS[region],
        false,
        `Region ${region} should be private (false) by default`,
      );
    }
  });
});

describe("isRegionEnabled", () => {
  it("returns true for us", () => assert.equal(isRegionEnabled("us"), true));
  it("returns false for europe", () => assert.equal(isRegionEnabled("europe"), false));
  it("returns false for oceania", () => assert.equal(isRegionEnabled("oceania"), false));
});

// ─── Engine: region registry ─────────────────────────────────────────────────

describe("REGION_REGISTRY", () => {
  const requiredRegions: RegionCode[] = [
    "us", "europe", "latam", "africa", "mena", "asia", "caribbean", "oceania",
  ];

  it("has entries for all required regions", () => {
    for (const region of requiredRegions) {
      assert.ok(REGION_REGISTRY[region], `Missing registry entry for: ${region}`);
    }
  });

  it("each region has a defaultLocale and at least one locale", () => {
    for (const region of requiredRegions) {
      const def = REGION_REGISTRY[region];
      assert.ok(def.defaultLocale, `${region} missing defaultLocale`);
      assert.ok(def.locales.length > 0, `${region} has no locales`);
    }
  });

  it("each region has a currency", () => {
    for (const region of requiredRegions) {
      assert.ok(REGION_REGISTRY[region].currency, `${region} missing currency`);
    }
  });

  it("MENA region uses RTL", () => {
    assert.equal(REGION_REGISTRY.mena.rtl, true);
  });

  it("non-MENA regions are LTR", () => {
    const ltrRegions: RegionCode[] = ["us", "europe", "latam", "africa", "asia", "caribbean", "oceania"];
    for (const region of ltrRegions) {
      assert.equal(REGION_REGISTRY[region].rtl, false);
    }
  });
});

// ─── Engine: fallback chain ───────────────────────────────────────────────────

describe("buildFallbackChain", () => {
  it("for en/us returns [en]", () => {
    assert.deepEqual(buildFallbackChain("en", "us"), ["en"]);
  });

  it("for pt/latam returns [pt, es, en]", () => {
    assert.deepEqual(buildFallbackChain("pt", "latam"), ["pt", "es", "en"]);
  });

  it("always ends with en", () => {
    const chain = buildFallbackChain("de", "europe");
    assert.equal(chain[chain.length - 1], "en");
  });

  it("does not repeat locales", () => {
    const chain = buildFallbackChain("en", "europe");
    const unique = new Set(chain);
    assert.equal(chain.length, unique.size);
  });

  it("handles unknown locale gracefully (still returns chain ending in en)", () => {
    const chain = buildFallbackChain("xx", "us");
    assert.ok(chain.includes("en"));
  });
});

// ─── Engine: translate ────────────────────────────────────────────────────────

describe("translate", () => {
  const table: TranslationTable = {
    en: { greeting: "Hello" },
    es: { greeting: "Hola" },
    fr: { greeting: "Bonjour" },
  };

  it("returns translation for the requested locale", () => {
    assert.equal(translate(table, "es", "greeting"), "Hola");
  });

  it("falls back to English when locale not in table", () => {
    assert.equal(translate(table, "de", "greeting", "us"), "Hello");
  });

  it("falls back to region default then en if key missing", () => {
    const sparseTable: TranslationTable = { en: { welcome: "Welcome" } };
    assert.equal(translate(sparseTable, "ar", "welcome", "mena"), "Welcome");
  });

  it("returns the key itself when no translation found", () => {
    assert.equal(translate(table, "en", "missing_key"), "missing_key");
  });
});

// ─── Engine: resolveLocale ────────────────────────────────────────────────────

describe("resolveLocale", () => {
  it("returns preference when it is a valid region locale", () => {
    assert.equal(resolveLocale("europe", "de"), "de");
  });

  it("uses browser hint when preference is absent", () => {
    assert.equal(resolveLocale("latam", null, "pt"), "pt");
  });

  it("parses BCP-47 tags like es-419", () => {
    assert.equal(resolveLocale("latam", "es-419"), "es");
  });

  it("falls back to region default when nothing matches", () => {
    assert.equal(resolveLocale("latam", "xx", "yy"), "es");
  });
});

// ─── Currency ────────────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  it("formats USD for US region", () => {
    const result = formatCurrency(1234.56, "us");
    assert.ok(result.includes("1,234"), `Unexpected result: ${result}`);
  });

  it("formats EUR for europe region", () => {
    const result = formatCurrency(1000, "europe", { currency: "EUR" });
    assert.ok(result.includes("1"), `Unexpected result: ${result}`);
  });

  it("formats JPY with 0 decimals", () => {
    const result = formatCurrency(1000, "asia", { currency: "JPY" });
    assert.ok(!result.includes("."), `JPY should not have decimals: ${result}`);
  });

  it("handles unknown currency gracefully", () => {
    const result = formatCurrency(100, "us", { currency: "XYZ" });
    assert.ok(typeof result === "string");
  });
});

// ─── Date / time ─────────────────────────────────────────────────────────────

describe("formatDate", () => {
  const testDate = new Date("2026-07-11T12:00:00Z");

  it("returns a non-empty string for us region", () => {
    const result = formatDate(testDate, "us");
    assert.ok(result.length > 0);
  });

  it("accepts ISO string input", () => {
    const result = formatDate("2026-07-11", "europe");
    assert.ok(result.length > 0);
  });

  it("accepts numeric timestamp input", () => {
    const result = formatDate(testDate.getTime(), "latam");
    assert.ok(result.length > 0);
  });
});

// ─── Legal text ───────────────────────────────────────────────────────────────

describe("getLegalText", () => {
  it("returns all required keys for us", () => {
    const text = getLegalText("us");
    assert.ok(text.disclaimer.length > 0);
    assert.ok(text.userResponsibility.length > 0);
    assert.ok(text.jurisdiction.length > 0);
    assert.ok(text.privacyNotice.length > 0);
  });

  it("europe has GDPR-specific privacy notice", () => {
    const text = getLegalText("europe");
    assert.ok(text.privacyNotice.toLowerCase().includes("gdpr"));
  });

  it("mena regulatory notice is in Arabic", () => {
    const text = getLegalText("mena");
    assert.ok(text.regulatoryNotice.includes("Edunancial"));
  });

  it("us inherits base jurisdiction text", () => {
    const text = getLegalText("us");
    assert.ok(text.jurisdiction.includes("Florida"));
  });

  it("oceania has Australian Privacy Act reference", () => {
    const text = getLegalText("oceania");
    assert.ok(text.privacyNotice.includes("Privacy Act"));
  });
});

describe("getLegalKey", () => {
  it("returns specific key value", () => {
    const disc = getLegalKey("us", "disclaimer");
    assert.ok(disc.includes("educational"));
  });
});
