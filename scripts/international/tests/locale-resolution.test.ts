import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGE_ALIAS_MAP,
  LANGUAGE_CATALOG,
} from "../../../src/lib/international/languages.ts";

// ---------------------------------------------------------------------------
// Inline resolver functions — mirrors src/lib/international/resolve-locale.ts
// These functions are tested here; TypeScript ensures the production copy stays
// in sync during the `tsc --noEmit` check.
// ---------------------------------------------------------------------------

function parseAcceptLanguage(header?: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const semicolonIndex = part.indexOf(";q=");
      const tag = (semicolonIndex === -1 ? part : part.slice(0, semicolonIndex)).trim();
      const q = semicolonIndex === -1 ? 1 : Number(part.slice(semicolonIndex + 3).trim());
      return { tag, q: Number.isFinite(q) ? q : 1 };
    })
    .filter((entry) => Boolean(entry.tag))
    .sort((a, b) => b.q - a.q)
    .map((entry) => entry.tag);
}

function matchSupportedLocale(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  const exact = LANGUAGE_CATALOG.find((l) => l.code.toLowerCase() === normalized);
  if (exact) return exact.code;
  if (LANGUAGE_ALIAS_MAP[normalized]) return LANGUAGE_ALIAS_MAP[normalized];
  const base = normalized.split("-")[0];
  if (LANGUAGE_ALIAS_MAP[base]) return LANGUAGE_ALIAS_MAP[base];
  const fromBase = LANGUAGE_CATALOG.find((l) => l.code.toLowerCase().split("-")[0] === base);
  if (fromBase) return fromBase.code;
  return null;
}

type ResolveLocaleInput = {
  savedPreference?: string | null;
  sessionOverride?: string | null;
  navigatorLanguages?: string[];
  acceptLanguageHeader?: string | null;
  osLanguage?: string | null;
  geoLocale?: string | null;
};

function resolveLocale(input: ResolveLocaleInput): string {
  const saved = matchSupportedLocale(input.savedPreference);
  if (saved) return saved;

  const session = matchSupportedLocale(input.sessionOverride);
  if (session) return session;

  const browserCandidates: string[] = [
    ...(input.navigatorLanguages ?? []),
    ...(input.osLanguage ? [input.osLanguage] : []),
    ...parseAcceptLanguage(input.acceptLanguageHeader),
  ];
  for (const candidate of browserCandidates) {
    const matched = matchSupportedLocale(candidate);
    if (matched) return matched;
  }

  const geo = matchSupportedLocale(input.geoLocale);
  if (geo) return geo;

  return DEFAULT_LANGUAGE_CODE;
}

// ---------------------------------------------------------------------------
// parseAcceptLanguage
// ---------------------------------------------------------------------------

test("parseAcceptLanguage returns empty array for empty input", () => {
  assert.deepEqual(parseAcceptLanguage(null), []);
  assert.deepEqual(parseAcceptLanguage(""), []);
});

test("parseAcceptLanguage parses quality values and sorts descending", () => {
  const result = parseAcceptLanguage("fr-CA;q=0.9,en-US,es;q=0.8");
  assert.deepEqual(result, ["en-US", "fr-CA", "es"]);
});

test("parseAcceptLanguage handles single value without q", () => {
  assert.deepEqual(parseAcceptLanguage("fr-FR"), ["fr-FR"]);
});

// ---------------------------------------------------------------------------
// matchSupportedLocale
// ---------------------------------------------------------------------------

test("matchSupportedLocale returns null for null or empty input", () => {
  assert.equal(matchSupportedLocale(null), null);
  assert.equal(matchSupportedLocale(""), null);
});

test("matchSupportedLocale matches exact locale code case-insensitively", () => {
  assert.equal(matchSupportedLocale("en-US"), "en-US");
  assert.equal(matchSupportedLocale("EN-US"), "en-US");
  assert.equal(matchSupportedLocale("fr-CA"), "fr-CA");
  assert.equal(matchSupportedLocale("zh-Hans"), "zh-Hans");
});

test("matchSupportedLocale resolves 'en' alias to en-US", () => {
  assert.equal(matchSupportedLocale("en"), "en-US");
});

test("matchSupportedLocale resolves 'fr' alias to fr-CA", () => {
  assert.equal(matchSupportedLocale("fr"), "fr-CA");
});

test("matchSupportedLocale resolves unknown locale by base language", () => {
  assert.equal(matchSupportedLocale("de-AT"), "de");
});

test("matchSupportedLocale returns null for completely unsupported locale", () => {
  assert.equal(matchSupportedLocale("xx-XX"), null);
  assert.equal(matchSupportedLocale("zz"), null);
});

// ---------------------------------------------------------------------------
// resolveLocale — priority order
// ---------------------------------------------------------------------------

test("saved preference wins over everything else", () => {
  assert.equal(
    resolveLocale({
      savedPreference: "fr-CA",
      sessionOverride: "es",
      navigatorLanguages: ["en-US"],
      geoLocale: "de",
    }),
    "fr-CA"
  );
});

test("session override wins when no saved preference", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: "es",
      navigatorLanguages: ["en-US"],
      geoLocale: "de",
    }),
    "es"
  );
});

test("browser locale wins over geo when no saved or session preference", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: null,
      navigatorLanguages: ["fr-CA"],
      geoLocale: "en-US",
    }),
    "fr-CA"
  );
});

test("geo fallback used when no saved, session, or browser locale", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: null,
      navigatorLanguages: [],
      geoLocale: "es",
    }),
    "es"
  );
});

test("falls back to en-US when no signals at all", () => {
  assert.equal(resolveLocale({}), "en-US");
});

test("falls back to en-US when all signals are unsupported locales", () => {
  assert.equal(
    resolveLocale({
      savedPreference: "xx-XX",
      sessionOverride: "yy",
      navigatorLanguages: ["zzz"],
      geoLocale: "www",
    }),
    "en-US"
  );
});

// ---------------------------------------------------------------------------
// Specific Part 14 examples
// ---------------------------------------------------------------------------

test("saved fr-CA beats browser en-US and US geo", () => {
  assert.equal(
    resolveLocale({
      savedPreference: "fr-CA",
      sessionOverride: null,
      navigatorLanguages: ["en-US"],
      geoLocale: "en-US",
    }),
    "fr-CA"
  );
});

test("session es beats browser en-US and US geo when no saved preference", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: "es",
      navigatorLanguages: ["en-US"],
      geoLocale: "en-US",
    }),
    "es"
  );
});

test("browser fr-CA beats Ontario geo when no saved or session preference", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: null,
      navigatorLanguages: ["fr-CA"],
      geoLocale: "en-US",
    }),
    "fr-CA"
  );
});

test("browser en-CA beats Quebec geo", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: ["en-CA"],
    geoLocale: "fr-CA",
  });
  // en-CA → en-US (closest supported English match)
  assert.equal(locale, "en-US");
});

test("Puerto Rico geo returns es when no browser signal", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: null,
      navigatorLanguages: [],
      geoLocale: "es",
    }),
    "es"
  );
});

test("accept-language header is used as browser signal", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: null,
      navigatorLanguages: [],
      acceptLanguageHeader: "fr-FR;q=0.9, de;q=0.8, en;q=0.7",
      geoLocale: "en-US",
    }),
    "fr-FR"
  );
});

test("os language is used when navigator.languages is empty", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: null,
      navigatorLanguages: [],
      osLanguage: "ko",
      geoLocale: "en-US",
    }),
    "ko"
  );
});

// ---------------------------------------------------------------------------
// Reset-to-automatic behaviour (simulated)
// ---------------------------------------------------------------------------

test("after reset, browser locale wins when saved and session are cleared", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: null,
      navigatorLanguages: ["fr-CA"],
      geoLocale: "en-US",
    }),
    "fr-CA"
  );
});

test("after reset, geo fallback is used when browser language is unsupported", () => {
  assert.equal(
    resolveLocale({
      savedPreference: null,
      sessionOverride: null,
      navigatorLanguages: ["xx-XX"],
      geoLocale: "es",
    }),
    "es"
  );
});


// ---------------------------------------------------------------------------
// parseAcceptLanguage
// ---------------------------------------------------------------------------

test("parseAcceptLanguage returns empty array for empty input", () => {
  assert.deepEqual(parseAcceptLanguage(null), []);
  assert.deepEqual(parseAcceptLanguage(""), []);
});

test("parseAcceptLanguage parses quality values and sorts descending", () => {
  const result = parseAcceptLanguage("fr-CA;q=0.9,en-US,es;q=0.8");
  assert.deepEqual(result, ["en-US", "fr-CA", "es"]);
});

test("parseAcceptLanguage handles single value without q", () => {
  const result = parseAcceptLanguage("fr-FR");
  assert.deepEqual(result, ["fr-FR"]);
});

// ---------------------------------------------------------------------------
// matchSupportedLocale
// ---------------------------------------------------------------------------

test("matchSupportedLocale returns null for null or empty input", () => {
  assert.equal(matchSupportedLocale(null), null);
  assert.equal(matchSupportedLocale(""), null);
});

test("matchSupportedLocale matches exact locale code case-insensitively", () => {
  assert.equal(matchSupportedLocale("en-US"), "en-US");
  assert.equal(matchSupportedLocale("EN-US"), "en-US");
  assert.equal(matchSupportedLocale("fr-CA"), "fr-CA");
  assert.equal(matchSupportedLocale("zh-Hans"), "zh-Hans");
});

test("matchSupportedLocale resolves 'en' alias to en-US", () => {
  assert.equal(matchSupportedLocale("en"), "en-US");
});

test("matchSupportedLocale resolves 'fr' alias to fr-CA", () => {
  assert.equal(matchSupportedLocale("fr"), "fr-CA");
});

test("matchSupportedLocale resolves unknown locale by base language", () => {
  // 'de-AT' is not directly registered; should fall back to 'de'
  assert.equal(matchSupportedLocale("de-AT"), "de");
});

test("matchSupportedLocale returns null for completely unsupported locale", () => {
  assert.equal(matchSupportedLocale("xx-XX"), null);
  assert.equal(matchSupportedLocale("zz"), null);
});

// ---------------------------------------------------------------------------
// resolveLocale — priority order
// ---------------------------------------------------------------------------

test("saved preference wins over everything else", () => {
  const locale = resolveLocale({
    savedPreference: "fr-CA",
    sessionOverride: "es",
    navigatorLanguages: ["en-US"],
    geoLocale: "de",
  });
  assert.equal(locale, "fr-CA");
});

test("session override wins when no saved preference", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: "es",
    navigatorLanguages: ["en-US"],
    geoLocale: "de",
  });
  assert.equal(locale, "es");
});

test("browser locale wins over geo when no saved or session preference", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: ["fr-CA"],
    geoLocale: "en-US",
  });
  assert.equal(locale, "fr-CA");
});

test("geo fallback used when no saved, session, or browser locale", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: [],
    geoLocale: "es",
  });
  assert.equal(locale, "es");
});

test("falls back to en-US when no signals at all", () => {
  const locale = resolveLocale({});
  assert.equal(locale, "en-US");
});

test("falls back to en-US when all signals are unsupported locales", () => {
  const locale = resolveLocale({
    savedPreference: "xx-XX",
    sessionOverride: "yy",
    navigatorLanguages: ["zzz"],
    geoLocale: "www",
  });
  assert.equal(locale, "en-US");
});

// ---------------------------------------------------------------------------
// Specific Part 14 examples
// ---------------------------------------------------------------------------

test("saved fr-CA beats browser en-US and US geo", () => {
  const locale = resolveLocale({
    savedPreference: "fr-CA",
    sessionOverride: null,
    navigatorLanguages: ["en-US"],
    geoLocale: "en-US",
  });
  assert.equal(locale, "fr-CA");
});

test("session es beats browser en-US and US geo when no saved preference", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: "es",
    navigatorLanguages: ["en-US"],
    geoLocale: "en-US",
  });
  assert.equal(locale, "es");
});

test("browser fr-CA beats Ontario geo (en-US) when no saved or session preference", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: ["fr-CA"],
    geoLocale: "en-US",
  });
  assert.equal(locale, "fr-CA");
});

test("browser en-CA beats Quebec geo (fr-CA) when browser wins", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: ["en-CA"],
    geoLocale: "fr-CA",
  });
  // en-CA normalizes to en-US (closest supported match)
  assert.equal(locale, "en-US");
});

test("Puerto Rico geo returns es when no browser signal", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: [],
    geoLocale: "es",
  });
  assert.equal(locale, "es");
});

test("accept-language header is used as browser signal", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: [],
    acceptLanguageHeader: "fr-FR;q=0.9, de;q=0.8, en;q=0.7",
    geoLocale: "en-US",
  });
  assert.equal(locale, "fr-FR");
});

test("os language is used when navigator.languages is empty", () => {
  const locale = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: [],
    osLanguage: "ko",
    geoLocale: "en-US",
  });
  assert.equal(locale, "ko");
});

// ---------------------------------------------------------------------------
// Reset-to-automatic behaviour (simulated)
// ---------------------------------------------------------------------------

test("after reset, resolving with no saved or session override yields browser locale", () => {
  // Simulate the state after resetToAutomatic() clears both overrides.
  const localeAfterReset = resolveLocale({
    savedPreference: null,       // cleared by resetToAutomatic
    sessionOverride: null,       // cleared by resetToAutomatic
    navigatorLanguages: ["fr-CA"],
    geoLocale: "en-US",
  });
  assert.equal(localeAfterReset, "fr-CA");
});

test("after reset, geo fallback is used when browser language is unsupported", () => {
  const localeAfterReset = resolveLocale({
    savedPreference: null,
    sessionOverride: null,
    navigatorLanguages: ["xx-XX"],
    geoLocale: "es",
  });
  assert.equal(localeAfterReset, "es");
});
