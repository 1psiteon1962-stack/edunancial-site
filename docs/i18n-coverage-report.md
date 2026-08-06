# i18n Coverage Report

**Architecture:** Single-pipeline canonical i18n system  
**Last updated:** 2026-08-06  
**Branch:** fix/i18n-scalable-architecture

---

## Architecture Summary

All translations in the Edunancial site flow through a single pipeline:

| Component | Path | Role |
|-----------|------|------|
| **Locale Registry** | `src/lib/international/languages.ts` — `LANGUAGE_CATALOG` | Single source of truth for all supported locales, RTL flags, labels |
| **Translator function** | `src/lib/international/i18n.ts` — `translate()` | All text resolution; loads from `src/locales/<code>.json` |
| **React hook** | `src/components/international/InternationalPreferencesProvider.tsx` — `useInternationalPreferences().t()` | Client-side translation; reads current locale from context |
| **Selector component** | `src/components/international/LanguagePreferenceSelector.tsx` | Single selector; reads options from `LANGUAGE_CATALOG` |

### Adding a new locale — checklist (no other changes required)

1. Add one entry to `LANGUAGE_CATALOG` in `src/lib/international/languages.ts`
2. Create `src/locales/<code>.json` with all translation keys
3. Add one `import` and one catalog entry in `src/lib/international/i18n.ts`

The selector, routing, and all pages automatically pick up the new locale.

---

## Supported Locale Set (Final)

| Code | Language | Native Label | RTL | Locale file |
|------|----------|--------------|-----|-------------|
| `en` / `en-US` | English | English (United States) | No | `en.json` |
| `es` | Spanish | Español | No | `es.json` |
| `fr-CA` | French (Canada) | Français (Canada) | No | `fr-CA.json` |
| `fr-FR` | French (France) | Français (France) | No | `fr-FR.json` |
| `ja` | Japanese | 日本語 | No | `ja.json` |
| `ko` | Korean | 한국어 | No | `ko.json` |
| `ar` | Arabic | العربية | **Yes** | `ar.json` |
| `sw` | Swahili | Kiswahili | No | `sw.json` |
| `zu` | Zulu | isiZulu | No | `zu.json` |
| `el` | Greek | Ελληνικά | No | `el.json` |
| `it` | Italian | Italiano | No | `it.json` |
| `pt` | Portuguese | Português | No | `pt.json` |
| `de` | German | Deutsch | No | `de.json` |
| `ru` | Russian | Русский | No | `ru.json` |
| `pl` | Polish | Polski | No | `pl.json` |
| `sr` | Serbian | Српски | No | `sr.json` |
| `so` | Somali | Soomaali | No | `so.json` |
| `sm` | Samoan | Gagana Samoa | No | `sm.json` |
| `hi` | Hindi | हिन्दी | No | `hi.json` |

Additional locales supported in the registry (not in the required set above but present):
`fr`, `nl`, `ht`, `pap`, `he`, `th`, `vi`, `ms`, `id`, `fil`, `ta`, `bn`, `ur`, `zh-Hans`, `zh-Hant`, `cs`, `sk`, `ro`, `bg`, `lt`, `lv`, `et`, `be`, `fa`, `prs`, `ps`, `lg`, `yo`, `ig`, `ha`, `am`

---

## Arabic RTL Handling

Arabic (`ar`) has `rtl: true` in `LANGUAGE_CATALOG`. The root layout (`src/app/layout.tsx`) reads the active locale from the cookie and sets:

```tsx
const dir = isRtlLanguage(savedLocale) ? "rtl" : "ltr";
// ...
<html lang={savedLocale} dir={dir}>
```

This drives the global HTML `dir` attribute automatically — no per-page RTL handling is needed.

---

## Hindi / Devanagari Font

`src/app/globals.css` imports **Noto Sans Devanagari** from Google Fonts and places it first in the `font-family` stack:

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap');

body {
  font-family: "Noto Sans Devanagari", Arial, Helvetica, sans-serif;
}
```

This ensures Devanagari script renders correctly for Hindi text.

---

## Scalability Proof

To demonstrate that adding a locale requires changes only to the registry and its translation file:

1. **Add** `{ code: "xx-TEST", label: "Test Language", nativeLabel: "Test", rtl: false }` to `LANGUAGE_CATALOG`
2. **Create** `src/locales/xx-TEST.json`
3. **Add** one import and one catalog entry to `src/lib/international/i18n.ts`

Expected automatic effects (no other file changes needed):
- `LanguagePreferenceSelector` shows the new locale (reads `LANGUAGE_CATALOG`)
- `useInternationalPreferences().t()` resolves translations for the new locale
- The root layout sets `dir` correctly based on the `rtl` flag
- All migrated pages render translated content

This was verified by code inspection: `LanguagePreferenceSelector` maps directly over `LANGUAGE_CATALOG` to build its options list.

---

## Deprecated Mechanisms Removed

| Mechanism | File | Status |
|-----------|------|--------|
| Legacy inline translator + inline translation maps | `src/lib/i18n.ts` | **Deleted** |
| `supportedLanguages` re-export from `@/lib/i18n` | `src/lib/i18n.ts` | **Deleted** |
| Legacy `Locale` type + `supportedLangs` | `data/site-config.ts` | **Deleted** |
| `LanguageSelector` with `localStorage` + `window.location.reload()` | `src/components/LanguageSelector.tsx` | **Migrated** → re-exports `LanguagePreferenceSelector` |
| `LanguageSwitcher` using `supportedLanguages` from legacy path | `src/components/LanguageSwitcher.tsx` | **Migrated** → re-exports `LanguagePreferenceSelector` |
| APAC `ApacLanguageSelector` with custom link list | `src/components/asia-pacific/LanguageSelector.tsx` | **Migrated** → re-exports `LanguagePreferenceSelector` |
| APAC page hardcoded per-locale string maps | `src/app/(public)/asia-pacific/[locale]/page.tsx` | **Migrated** → uses `translate()` with locale keys |
| `LocalizedDoctrine` using legacy `t(lang, key)` | `src/components/LocalizedDoctrine.tsx` | **Migrated** → uses `useInternationalPreferences().t()` |
| `regionCurriculumContent.ts` with inline per-locale maps | `src/lib/regionCurriculumContent.ts` | **Replaced** → keys moved to locale JSON files |
| `BilingualContent.tsx` hardcoded en/es/fr-CA/fr-FR branching | `src/components/international/BilingualContent.tsx` | Retained as deprecated stub (no active usages) |

---

## Audit Command

```
npm run i18n:audit
```

Enforces:
- No `BilingualContent` usages
- No `useNorthAmericaLaunchLanguage` usages
- No `contentByLocale` usages
- No inline locale copy maps
- No legacy `@/lib/i18n` imports
- No `edunancial-language` localStorage key
- No `window.location.reload()` in non-canonical files
- No hardcoded per-locale ternary branches

---

## Post-Merge Verification

Live site verification must be performed after merge to `main` and deployment to production. The following table should be completed on the live site:

| Page | Language | Pass/Fail | Notes |
|------|----------|-----------|-------|
| / (Home) | en | - | Pending deploy |
| / (Home) | ar | - | RTL check |
| / (Home) | hi | - | Devanagari check |
| /membership | es | - | Pending deploy |
| /membership | fr-CA | - | Pending deploy |
| /curriculum | ja | - | Pending deploy |
| /curriculum | ko | - | Pending deploy |
| /faq | de | - | Pending deploy |
| /contact | pt | - | Pending deploy |
| /admin | en | - | Admin check |
| /asia-pacific/hi | hi | - | APAC + Devanagari |
| /asia-pacific/ja | ja | - | APAC Japanese |
| /asia-pacific/ar | ar | - | N/A (not APAC locale) |

