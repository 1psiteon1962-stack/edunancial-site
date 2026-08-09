import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { getLocaleFallbackChain, LANGUAGE_CATALOG } from "../../../src/lib/international/languages.ts";

const ROUTE_KEYS = [
  "nav.home",
  "nav.courses",
  "nav.curriculum",
  "nav.pricing",
  "nav.faq",
  "nav.contact",
  "membership.label",
  "curriculumPage.title",
];

test("every enabled locale resolves major route shell keys", () => {
  const localesDir = resolve("src/locales");
  const englishMessages = JSON.parse(readFileSync(resolve(localesDir, "en.json"), "utf8"));

  const readMessages = (localeCode) => {
    const fallbackFile = getLocaleFallbackChain(localeCode)
      .map((candidate) => `${candidate}.json`)
      .find((candidate) => {
        try {
          readFileSync(resolve(localesDir, candidate), "utf8");
          return true;
        } catch {
          return false;
        }
      });

    return fallbackFile
      ? JSON.parse(readFileSync(resolve(localesDir, fallbackFile), "utf8"))
      : englishMessages;
  };

  for (const language of LANGUAGE_CATALOG) {
    const messages = readMessages(language.code);
    for (const key of ROUTE_KEYS) {
      const translated =
        messages[key] ??
        getLocaleFallbackChain(language.code)
          .map((candidate) => {
            try {
              const candidateMessages = JSON.parse(
                readFileSync(resolve(localesDir, `${candidate}.json`), "utf8"),
              );
              return candidateMessages[key];
            } catch {
              return undefined;
            }
          })
          .find((value) => typeof value === "string") ??
        englishMessages[key] ??
        key;

      assert.equal(typeof translated, "string", `${language.code}: ${key} should resolve to a string`);
      assert.notEqual(translated, key, `${language.code}: ${key} should not fall back to the raw key`);
    }
  }
});

test("every enabled locale has a deterministic fallback chain", () => {
  for (const language of LANGUAGE_CATALOG) {
    const chain = getLocaleFallbackChain(language.code);
    assert.ok(chain.length >= 2, `${language.code}: fallback chain should include at least locale + English`);
    assert.ok(chain.includes("en"), `${language.code}: fallback chain must include base English`);
  }

  assert.deepEqual(getLocaleFallbackChain("fr-CA"), ["fr-CA", "fr", "en-US", "en"]);
  assert.deepEqual(getLocaleFallbackChain("fr-FR"), ["fr-FR", "fr", "en-US", "en"]);
  assert.deepEqual(getLocaleFallbackChain("fr"), ["fr", "fr-CA", "en-US", "en"]);
});

test("major public routes use centralized locale helpers", () => {
  const majorRoutes = [
    "src/app/(public)/page.tsx",
    "src/app/(public)/courses/page.tsx",
    "src/app/(public)/curriculum/page.tsx",
    "src/app/(public)/pricing/page.tsx",
    "src/app/(public)/membership/page.tsx",
    "src/app/(public)/login/page.tsx",
    "src/app/(public)/register/page.tsx",
    "src/app/(public)/faq/page.tsx",
    "src/app/(public)/contact/page.tsx",
    "src/app/(public)/curriculum/[track]/[level]/[lesson]/page.tsx",
  ];

  for (const route of majorRoutes) {
    const source = readFileSync(resolve(route), "utf8");
    assert.match(
      source,
      /(getServerTranslator|getServerLanguage|resolveRequestLanguage|useInternationalPreferences|from "\.\/|from "@\/components\/)/,
      `${route} should use a centralized locale helper`,
    );
  }
});

test("curriculum lesson route uses centralized request locale and localized access gating", () => {
  const source = readFileSync(
    resolve("src/app/(public)/curriculum/[track]/[level]/[lesson]/page.tsx"),
    "utf8",
  );

  assert.match(source, /resolveRequestLanguage/);
  assert.match(source, /checkLessonAccess\(.*language\)/s);
});
