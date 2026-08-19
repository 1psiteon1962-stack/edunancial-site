# Regional and Tax Architecture

## Objective

Edunancial uses one configuration-first regional layer and one jurisdiction-aware tax contract. Regional pages, checkout, reporting, and future compliance services should consume these shared contracts rather than embedding country/state/province rules in UI components.

## Regional contract

`src/lib/regions/architecture.ts` is the canonical forward-looking region registry. It separates:

- region identity and route slug
- launch state (`ACTIVE`, `PRIVATE`, `BETA`, `DISABLED`)
- supported languages
- currencies
- privacy frameworks
- tax frameworks
- country-specific adapters

New regions remain PRIVATE until explicitly activated. A region must not become public merely because configuration exists.

## Tax contract

`src/lib/tax/architecture.ts` defines the common transaction boundary for tax determination. The checkout layer supplies:

- seller country
- customer country/subdivision/postal location
- product classification
- transaction timestamp
- subtotal and currency
- customer type
- registration state
- nexus snapshot

A country adapter returns a tax quote containing collection status, components, rate-derived amounts, rule version, and reason.

## United States

The U.S. adapter must support all states and applicable local jurisdictions without hard-coding current rates into checkout components. Its rule data must support:

- state economic-nexus thresholds and effective dates
- transaction thresholds where legally applicable
- physical nexus flags where applicable
- registration/account state
- product/service taxability
- destination/origin sourcing rules
- state/local rate components
- tax collected and remitted
- filing periods and filing status
- historical rule versions

Threshold/rate data is regulatory data and must be independently maintained and versioned. A code deployment should not be required merely to change a rate or threshold.

## Canada

The Canada adapter must reuse the existing province configuration while moving calculation decisions behind the common tax contract. It must support:

- federal GST
- HST provinces
- Quebec QST
- applicable PST/RST
- province/territory registration accounts and thresholds
- place-of-supply/customer-location logic
- product/service taxability
- CAD threshold tracking
- currency conversion records when thresholds are measured in CAD
- filing/remittance status
- historical rule versions

Existing province rates are seed configuration, not a substitute for effective-dated regulatory rule data.

## Other regions

Europe, Latin America, Caribbean, Africa, MENA, Asia-Pacific, and Oceania use the same adapter boundary. VAT/GST/custom country engines can be added without changing checkout's core transaction contract.

## Safety rules

1. Never silently collect tax merely because a country/region exists in the registry.
2. Never silently stop collection because a rule lookup fails.
3. Tax decisions must retain the rule version and transaction timestamp used.
4. Production checkout must fail safely when a jurisdiction requires a decision but authoritative rule data is unavailable.
5. Tax rates, nexus thresholds, registrations, returns, and remittances are data records, not scattered constants in UI code.
6. Region activation and tax registration are separate concepts.
7. Currency display is separate from tax threshold currency.
8. No new regional architecture may duplicate the checkout, localization, or curriculum implementation.

## Migration path

1. Keep existing regional and Canada configuration working.
2. Introduce the canonical contracts without changing current public routes.
3. Add U.S. and Canada adapters behind tests.
4. Route checkout tax determination through the adapter registry.
5. Add persistent nexus/registration/rule-version records.
6. Add admin reporting for thresholds, registrations, filings, collected tax, and remittances.
7. Migrate other regions one at a time while they remain PRIVATE.
8. Remove legacy duplicate region registries only after callers have migrated and regression tests pass.
