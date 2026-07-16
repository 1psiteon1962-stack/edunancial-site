# Translation Governance

## Principles
- No silent language mixing.
- Distinct regional variants remain distinct (`fr-CA` != `fr-FR`).
- Incomplete locales remain non-public by default.
- Legal content is never auto-approved from machine translation.

## Configuration fields
Each language tracks:
- code, base language, variant, direction
- enabled/public flags
- fallback chain
- translation completeness by domain
- SEO eligibility

## Missing translation handling
Use:
- `reportMissingTranslation({ language, key, namespace })`

This reports whether content is incomplete and which fallback chain applies.

## RTL / CJK readiness
- Direction metadata is explicit per language.
- Arabic is marked RTL.
- CJK locales are defined with independent fallback chains.
