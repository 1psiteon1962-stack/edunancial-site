# International Markets Audit (in progress)

Audit of edunancial.com against `docs/INTERNATIONAL-MARKETS-REQUIREMENTS.md`.
Status labels follow section 21 of the requirements:
VERIFIED = implemented and tested; UNTESTED = implemented, not fully tested;
PARTIAL = partially implemented; MISSING = not implemented;
BLOCKED = needs an owner decision or third-party service.

Audit started 2026-11-16. Last updated 2026-11-16 against `main` at 1f14ff2a.

## 1. Country detection

| Item | Status | Evidence |
|---|---|---|
| Server-side country from hosting headers (Netlify `x-nf-country`/`x-nf-geo`, plus Vercel/Cloudflare/CloudFront) | UNTESTED | `src/lib/location/request-country.ts`, `/api/location/country` |
| ISO 3166-1 alpha-2 codes, rejects `XX`/`T1` | UNTESTED | `normalizeCountryCode` |
| Failed detection returns 503 "could not be verified" instead of guessing US (Test J) | UNTESTED | `/api/location/country` |
| Saved country preference / account country takes priority over IP for market selection | GAP | `resolveRequestCountry` lets network geography win and only flags a mismatch. Checkout refuses with 409 when the chosen country differs from the IP country, so a Brazilian member travelling in the US (Test H) cannot pay as a Brazilian customer. Requirement 10 says billing details, not IP, should settle the billing country. |
| Puerto Rico as its own market | PARTIAL | Formula row `PR: HIC, USD` gives US-equal prices in USD; Spanish speakers in PR get `es-Caribbean` via `spanishLocaleForNetworkCountry`. Checkout is limited to US/CA, so PR has no paid checkout. |

## 2. Language detection

| Item | Status | Evidence |
|---|---|---|
| Priority: explicit choice > saved cookie > browser > country default > en-US | UNTESTED | `src/lib/international/resolve-locale.ts` |
| Bare `es` maps to Caribbean Spanish, not Spain (the Santo Domingo bug) | UNTESTED | `LANGUAGE_ALIAS_MAP.es = "es-Caribbean"` |
| Regional variant follows the network country (es-ES vs es-Caribbean, en-GB, fr-FR vs fr-CA, pt-PT vs pt-BR) | UNTESTED | `regionalLocaleForNetworkCountry` in `detection.ts`, applied client-side via `setDetectedRegionalLocale` (never overrides a manual choice) |
| Country default language when the browser gives none (e.g. German browser in Berlin is fine; an English browser in Quebec stays English, which matches the spec) | PARTIAL | Server `getServerLanguage` passes no geo locale; `src/lib/i18n/geo-map.ts` is unused legacy (maps DO/PR/ES to bare `es`). Low impact because the client refines the regional variant. |
| Haitian Creole hidden until approved | VERIFIED (fixed) | PR #1508, merged 2026-11-16; production curriculum smoke 17170/17170 |
| Browser-facing locale tags are valid BCP 47 | GAP | `<html lang>` (root layout) and `document.documentElement.lang` are set to the internal code `es-Caribbean`, which is not a valid BCP 47 tag (variant subtags are 5–8 characters). Fix: emit `es-419`. |
| Account-level language preference | MISSING | Preferences live in the browser (localStorage + cookie, user-scoped key when signed in). `getCurrentMember()` returns a hard-coded demo member; no server-side saved language or country per account. |

## 3. Currency and 6. Country pricing

| Item | Status | Evidence |
|---|---|---|
| Country price table with currency, version, effective date, approver, checkoutEnabled flag | UNTESTED | `src/lib/international/country-price-table.ts` |
| Dominican Republic owner-approved prices (DOP 399/3199, 699/5599, 999/7499), checkout disabled | UNTESTED | same file, `do-pilot-v1` |
| All other countries priced by the owner-approved formula (2026-10-19): US price x income-group factor (1.0/0.45/0.3/0.2) x dated planning FX rate, clean rounding; sanctioned countries excluded | UNTESTED | `country-pricing-formula.ts`, `country-pricing-data.json` (as of 2026-10-19) |
| Prices shown in the right currency but always formatted with `en-US` conventions for formula countries | GAP | `getDisplayCountryPrices` sets `formatLocale: "en-US"`. Requirement 5 asks for local symbols/separators. No owner decision needed. |
| Canada has approved CAD prices in the system since 2026-08-26 (US price x 1.39, rounded to .99: Basic CAD 20.99/166.99, Premium 34.99/277.99, Enterprise 55.99/416.99) | DONE | `src/lib/location/pricing.ts` (`ca-2026-q3-1.39`); formula exempts US/CA so these stay as-is. Corrected 2026-11-16: earlier draft wrongly listed these as needing approval. |
| Prices editable by an admin without a deploy, versioned and audited | MISSING | Prices live in code/JSON; changes need a deploy. |

## 9–11. Payments, checkout, tax

| Item | Status | Evidence |
|---|---|---|
| Hosted checkout (Square payment links); no card data stored by Edunancial | UNTESTED | `src/app/api/square/payment-link/route.ts` |
| Server-authoritative price from the catalog; browser price ignored | UNTESTED | `resolveCatalogItem`, `finalPrice` computed server-side |
| Activation by verified webhook, idempotent | UNTESTED | `src/app/api/square/webhook/route.ts`, `webhookIdempotency.ts` |
| Checkout refuses when currency does not match the country | UNTESTED | 409 "country-specific catalog price must be configured" |
| Checkout limited to US and CA | BLOCKED | Square is the only approved provider; other markets show prices with "purchase not yet open" |
| Canadian checkout will fail: catalog items are USD but CA requires CAD | BUILT, SWITCHED OFF | Stripe Checkout adapter (`src/lib/payments/stripe.ts`, `/api/stripe/checkout`, `/api/stripe/webhook`) charges the exact approved CAD price; CA checkout is routed there, US stays on Square. Off until the owner completes the Stripe go-live steps below. |
| Tax calculation (US adapter, Canada adapter) behind env flags | PARTIAL / BLOCKED | `src/lib/tax/*`; `EDUNANCIAL_RUNTIME_TAX_ENFORCEMENT_ENABLED`, `EDUNANCIAL_SQUARE_TAX_LINE_ITEM_ENABLED`. Registration decisions needed. |
| Square production credentials | BLOCKED | owner to supply keys |

## 12–16, 20. Accounts, admin, marketing, countdown

| Item | Status | Evidence |
|---|---|---|
| 72-hour launch countdown | MISSING | No countdown code found. Must not start without owner approval. |
| Account settings (language, country, billing country, plan, renewal, history, cancel) | PARTIAL | `/settings` has a Language tab that points to the header selector; `/account` links to Downloads and Membership. No billing country, renewal date, payment history or cancel controls yet (depends on live payments). |
| Admin panel: prices | PARTIAL | `/admin/pricing` shows the US checkout catalog read-only and states regional prices are not editable. Country prices cannot be edited without a deploy. |
| Admin panel: countries, languages, regional dashboards | UNTESTED | `/admin/regional-management`, `/admin/regions`, `/admin/languages`, `/admin/country-dashboard`, `/admin/site-access` exist |
| Revenue / registrations / conversion by country | TO CHECK in a later pass | `/admin/country-dashboard`, KPI pages |

## Owner decisions needed (BLOCKED)

- Any hand-set country prices beyond the existing DO and CA prices.
- Whether Canadian payments settle through a Canadian Square account (needed to charge CAD).
- Payment processor for markets outside US/CA, and Square production credentials.
- Tax registration and collection obligations by jurisdiction.
- Approval to build and later start the 72-hour launch countdown.

## No-decision fixes planned

1. Format formula-country prices with local conventions (`formatLocale` per country).
2. Let a saved/account country win for market display, and confirm billing country at checkout instead of refusing on IP mismatch (Test H) — payment flow change, tested on preview with checkout still gated.
3. Send a valid BCP 47 tag to the browser for internal codes such as `es-Caribbean`.


## Update 2026-11-16: traveling members at checkout

- Before: a member whose selected country differed from the network country (for example a US member traveling in Mexico) was refused at checkout with HTTP 409.
- Now: the checkout asks the member to confirm their billing country. After an explicit confirmation the confirmed billing country is used; the network country is kept as evidence (`network_country_code`, `billing_country_confirmed` in Square order metadata and in the persisted checkout record).
- Unchanged: country payment controls, approved currencies, server-side prices, Square US/CA-only restriction, tax rules and sanctions. A confirmed country that is not enabled for payment is still refused.

## Stripe for Canada: owner go-live steps (nothing is live until all are done)

1. Owner opens a Stripe account for Edunancial (USD payouts; Stripe converts CAD charges).
2. Owner adds in Netlify env (never in chat or Git): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
3. Owner creates a Stripe webhook to `https://edunancial.com/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
4. Owner enables Canada payments in the country registry (`paymentsEnabled`) and runtime country controls.
5. Owner decides Canadian tax (GST/HST) handling; while `EDUNANCIAL_RUNTIME_TAX_ENFORCEMENT_ENABLED=true`, Stripe checkout refuses to charge.
6. Owner sets `EDUNANCIAL_STRIPE_CHECKOUT_ENABLED=true`.

Known limits of this first version: one-time payment per period (no automatic Stripe renewal yet); discount codes are refused for CAD checkout; membership is granted only when the paid CAD amount equals the approved price exactly.
