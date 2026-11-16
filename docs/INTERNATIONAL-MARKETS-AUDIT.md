# International Markets Audit (in progress)

Audit of edunancial.com against `docs/INTERNATIONAL-MARKETS-REQUIREMENTS.md`.
Status labels follow section 21 of the requirements:
VERIFIED = implemented and tested; UNTESTED = implemented, not fully tested;
PARTIAL = partially implemented; MISSING = not implemented;
BLOCKED = needs an owner decision or third-party service.

Audit started 2026-11-16 against `main` at 6dd72c8a. Read-only so far; nothing deployed.

## 1. Country detection

| Item | Status | Evidence |
|---|---|---|
| Server-side country from hosting headers (Netlify `x-nf-country`/`x-nf-geo`, plus Vercel/Cloudflare/CloudFront) | UNTESTED | `src/lib/location/request-country.ts`, `/api/location/country` |
| ISO 3166-1 alpha-2 codes, rejects `XX`/`T1` | UNTESTED | `normalizeCountryCode` |
| Failed detection returns 503 "could not be verified" instead of guessing US | UNTESTED | `/api/location/country` |
| Saved country preference / account country takes priority over IP | GAP | `resolveRequestCountry` lets network geography win over the client's country and only flags a mismatch. Requirement 2 and Test H (traveler) need saved/account country to win for market selection, with IP as an estimate. |
| Puerto Rico as its own market | TO CHECK | |

## 2. Language detection

| Item | Status | Evidence |
|---|---|---|
| Priority: explicit choice > saved cookie > browser > country default > en-US | UNTESTED | `src/lib/international/resolve-locale.ts` |
| Bare `es` maps to Caribbean Spanish, not Spain (the Santo Domingo bug) | UNTESTED | `LANGUAGE_ALIAS_MAP.es = "es-Caribbean"` |
| Country default language used when no browser language | GAP | `getServerLanguage` never passes a geo locale; `src/lib/i18n/geo-map.ts` is unused and maps DO/PR/ES all to bare `es` and BR/PT both to `pt`. |
| Haitian Creole hidden until approved | GAP | `ht` is in `LANGUAGE_CATALOG`, so it is treated as a supported, selectable locale. |
| Browser-facing locale tags are valid BCP 47 (`es-Caribbean` is internal) | TO CHECK | |
| Account-level language preference | TO CHECK | |

## 3. Currency and 6. Country pricing

| Item | Status | Evidence |
|---|---|---|
| Country price table with currency, version, effective date, approver, checkoutEnabled flag | UNTESTED | `src/lib/international/country-price-table.ts` |
| Dominican Republic owner-approved prices (DOP 399/3199, 699/5599, 999/7499), checkout disabled | UNTESTED | same file, `do-pilot-v1` |
| Other countries priced by an "owner-approved formula" | TO CHECK | `country-pricing-formula.ts`, `country-pricing-data.json` (income tier + currency + USD rates) |
| A second, older pricing path converts USD by fixed FX for CA only | GAP (duplicate system) | `src/lib/location/pricing.ts` (`COUNTRY_PRICING_POLICIES`, CAD 1.39). Requirement 6 says FX conversion alone is not enough; prices for CA need owner approval. |
| Prices editable by admin without a deploy, versioned and audited | TO CHECK | |

## 4–11. Payments, checkout, tax, accounts, admin, countdown

TO CHECK: `src/lib/payments/*`, `src/lib/square.ts`, `src/lib/tax/*`, account settings, admin panel, countdown.

## Owner decisions known to be needed (BLOCKED)

- Country prices beyond the Dominican Republic (and confirmation that the formula is approved for public display).
- Payment processor and its credentials (Square keys pending).
- Tax registration and collection obligations by jurisdiction.
- Approval to start the 72-hour launch countdown.
