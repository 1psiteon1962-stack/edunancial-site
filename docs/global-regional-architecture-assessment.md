# Global Regional Architecture Assessment

## Scope inspected
- `/home/runner/work/edunancial-site/edunancial-site/src/components/international`
- `/home/runner/work/edunancial-site/edunancial-site/src/lib/international`
- `/home/runner/work/edunancial-site/edunancial-site/src/lib/localization/engine.ts`
- `/home/runner/work/edunancial-site/edunancial-site/src/lib/globalRegionArchitecture.ts`
- `/home/runner/work/edunancial-site/edunancial-site/src/app/layout.tsx`
- `/home/runner/work/edunancial-site/edunancial-site/src/app/sitemap.ts`
- `/home/runner/work/edunancial-site/edunancial-site/scripts/international/tests/preferences.test.ts`
- `/home/runner/work/edunancial-site/edunancial-site/scripts/regionalization/tests/engine.test.ts`

## Findings

### Duplicated locale and region checks
- Region logic is split across `detection.ts`, `regions.ts`, `preference-architecture.ts`, `globalRegionArchitecture.ts`, and `localization/engine.ts` with incompatible identifiers (`latin-america-2a`, `europe-2b`, `asia-pacific`, etc.).
- Language enablement/public visibility is controlled in multiple places (`languages.ts`, localStorage admin settings, component-level filtering).

### Hard-coded language and fallback assumptions
- Generic fallback aliases map `fr -> fr-CA` globally, which can incorrectly route French fallback for non-Canadian contexts.
- Existing i18n fallback can silently degrade to default English without structured missing-translation reporting.

### Country, currency, and North America assumptions
- Several code paths default unknown countries to `us` and unknown regions to `north-america`.
- USD and North America defaults appear in multiple modules.
- Country, language, and currency are mixed in the same resolution paths, making staged activation brittle.

### Alternate/hreflang risks
- Root metadata and sitemap previously generated language alternates across many locale paths not guaranteed to exist.
- x-default existed, but alternates could reference non-existent pages.

### Preference storage and browser-only behavior
- Anonymous preferences were localStorage-first. Cookies were not authoritative.
- Country/language detection was mostly browser-side; deterministic precedence across explicit/member/cookie/url/browser/geo/default was not centralized.

## Coupling hotspots
- `InternationalPreferencesProvider` and selector components performed preference logic that should be configuration-driven.
- Localization engine and international preference architecture had overlapping ownership for region, legal, payment, and pricing behavior.

## Resulting remediation strategy
- Add one authoritative typed regional architecture module for region/country/language/policy/status.
- Add deterministic preference engine with required precedence and cookie support.
- Gate public language exposure by region and language status.
- Add explicit translation-missing reporting contract and SEO alternate generation constrained to valid/publicly supported launch paths.
- Keep North America active and authoritative; keep other regions staged/planned by default.
