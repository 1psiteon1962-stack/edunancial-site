# i18n Coverage Report

| Area | Files | Status | Notes |
| --- | --- | --- | --- |
| Core navigation/footer | `src/components/layout/Footer.tsx` | Complete | Footer now uses `useInternationalPreferences().t()` keys. |
| Homepage | `src/app/page.tsx`, `src/app/HomePageClient.tsx`, `src/components/home/MemberSuccessStories.tsx` | Complete | Story, hero, dashboard, CTA, and success-story copy migrated to locale catalogs. |
| FAQ / Contact / AI Coach | `src/app/faq/*`, `src/app/contact/*`, `src/app/ai-coach/*` | Complete | Deprecated `BilingualContent` usage removed and replaced with client translation components. |
| Courses / Membership / Pricing | `src/app/courses/*`, `src/app/membership/*`, `src/app/pricing/*`, `src/components/membership/PricingTable.tsx`, `src/components/courses/TrackLandingPage.tsx` | Complete | Marketing copy and track copy now resolve through locale JSON files. |
| Legal / compliance pages | `src/app/cookies/*`, `src/app/privacy/*`, `src/app/accessibility/*`, `src/app/terms/*` | Complete | Legal headings, sections, labels, and footer links moved to locale catalogs. |
| Certificates / progress / checkout | `src/app/my-certificates/page.tsx`, `src/app/certificates/*`, `src/app/course-progress/page.tsx`, `src/components/payments/CheckoutForm.tsx` | Complete | Member-facing certificate, progress, and checkout copy now uses `t(key)`. |
| Locale catalogs | `src/locales/*.json` | Complete | Added the new translation keys across all locale files; key locales use migrated ES/FR copy and other locales carry English fallback values. |
| Audit enforcement | `scripts/i18n-audit.mjs`, `package.json` | Complete | `npm run i18n:audit` now flags deprecated `BilingualContent`, `useNorthAmericaLaunchLanguage`, and inline locale content maps. |

## Loaded locale coverage

Loaded by `src/lib/international/i18n.ts`: `en`, `es`, `fr`, `fr-CA`, `fr-FR`, `pt`, `de`, `it`, `ar`, `sw`, `ja`, `ko`, `zh-Hans`, `nl`, `hi`, `zh-Hant`, `ht`.

- `en`: full canonical source of truth
- `es`: migrated with extracted Spanish copy
- `fr`, `fr-CA`, `fr-FR`: migrated with extracted French copy (`fr-FR` keeps its page-specific wording where it previously differed)
- Other loaded locales: new keys populated with English fallback values for coverage tracking
