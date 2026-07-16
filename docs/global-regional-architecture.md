# Global Regional Architecture

## Authoritative configuration
Primary source:
- `/home/runner/work/edunancial-site/edunancial-site/src/lib/international/global-regional-architecture.ts`

This configuration now separates and types:
- Region
- Country
- Language
- Currency
- Pricing records (versioned/effective dated)
- Payment provider capabilities
- Legal registry entries
- Content availability rules
- Launch/status flags and emergency disable controls

## Active launch priority
- North America: `enabled: true`, `status: active`
- Latin America, Caribbean, Europe, Africa, Asia: staged (`planned`/`internal`) by default

## Supported target regions
- north-america
- latin-america
- caribbean
- europe
- africa
- asia

## URL strategy (phase-based, backward compatible)
1. Keep existing North America routes authoritative.
2. Keep existing route families working (no broad breaking rewrites).
3. Use regional config to power future canonical region/country/language paths.
4. Add/expand redirects only when equivalent canonical destinations are confirmed.
5. Avoid generating hreflang links for locales/pages that are not publicly available.

## Preference precedence
1. Explicit user selection
2. Authenticated member preference
3. Anonymous cookie preference
4. URL context
5. Country selection
6. Browser language
7. Geo-detection (if enabled)
8. Region default
9. Global fallback

Implemented in:
- `/home/runner/work/edunancial-site/edunancial-site/src/lib/international/preference-engine.ts`

## Translation contract
Contract supports:
- common UI copy
- page copy
- legal copy
- pricing copy
- payment copy
- error messages
- email copy
- course/book content
- metadata

Includes fallback chains and missing translation reporting via:
- `reportMissingTranslation(...)`

## SEO readiness
- `resolveSeoAlternates(...)` returns canonical language alternates plus `x-default`
- alternates now tied to public, enabled language status
- sitemap alternates constrained to launch-safe paths
