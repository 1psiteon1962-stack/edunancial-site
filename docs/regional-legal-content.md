# Regional Legal Content Registry

Registry source:
- `/home/runner/work/edunancial-site/edunancial-site/src/lib/international/global-regional-architecture.ts`

## Supported legal document types
- terms
- privacy
- cookies
- refunds
- accessibility
- recurring-payment consent
- regional disclosures
- educational disclaimer
- financial-advice disclaimer
- age requirements
- data-processing notice

## Status lifecycle
- draft
- translated
- legal-review-required
- approved
- active
- retired

## Selection behavior
`resolveLegalDocument({ region, country, type, language })` resolves:
1. exact region+country+language active/approved variant
2. language fallback chain within region
3. null when no approved legal document exists

This prevents automatic legal publication for untranslated/unapproved entries.
