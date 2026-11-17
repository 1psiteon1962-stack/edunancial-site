# Edunancial Architecture Review for Market Expansion

Date: 2026-11-17. Scope: a read-only review. No code, settings, environment variables, payment providers or countdown were changed.

## Owner requirement

The owner's launch plan (a 72-hour countdown, which stays off until the owner approves it) opens markets in this order:

1. USA and Canada.
2. Central and South America.
3. The Caribbean.
4. After revenue: Western and Central Europe, the Middle East, and fiscally sound parts of Asia.
5. Africa, the rest of Asia, and Eastern Europe.

The owner asked that the architecture let him expand without problems, and that any problem that does happen stays contained and limited.

## Summary

| Check | Result |
|---|---|
| Turn a market on or off without a deploy | Works for listed countries. Europe, the Middle East and Asia have no country entries yet. |
| Missing translation shows English, never a blank page | Works |
| Prices, tax and payment kept separate per market, with no invented prices | Works for checkout. One unused legacy pricing file has placeholder prices. |
| A payment-provider outage stays contained | Works. One improvement is recommended. |
| Middle East region file | Missing from the country registry |
| Canada as its own market | Works |
| Countries under embargo blocked | Works, and stays safe if the settings store is down |

## 1. Turning markets on and off without a deploy

These two controls exist and work today.

**Sales and launch state per country**
- This is the `country_launch_controls` table in Supabase, read by `src/lib/regions/runtime-controls.ts`.
- Checkout (Square and Stripe) calls `assertCountryOperationAllowed`, which only allows ACTIVE or BETA countries.
- The owner can change a country's state in the database without deploying.

**Who may enter the site**
- The owner manages this at `/admin/site-access`.
- The edge gate `netlify/edge-functions/country-gate.ts` enforces it from a Netlify Blobs store, with no deploy.

**Gap**
- The runtime controls only work for countries listed in `src/lib/regions/architecture.ts`.
- Right now only North America (US, CA), Latin America, the Caribbean and Africa have country entries.
- **Europe, the Middle East (`mena`), Asia-Pacific and Oceania have `countries: []`.**
- So no country in phase 4 can be turned on without a code change and a deploy. Any attempt is refused with "not in the canonical regional registry". It fails safe, but it would block the Europe and Middle East launch.

**Recommendation:** Add the phase-4 countries to the registry in the PRIVATE state, well before that phase:
- Europe: GB, ES, FR, DE, IT, NL, PT and the others planned.
- Middle East: AE, SA, QA, KW, BH, OM, JO, IL.
- Asia: JP, KR, SG and the others planned.

This changes nothing for visitors. It only makes a later switch-on possible without a deploy. The owner should approve the country list.

## 2. English fallback for missing translations

`src/lib/curriculum/reader.ts` tries the requested locale, then its base locale, then the canonical English lesson.
- A translation that is missing a title or body is skipped.
- The final step always returns the English lesson, marked as a fallback.
- So learners never see a blank lesson page.

## 3. Separate prices, tax and payments per market

Both checkout routes refuse to take payment unless all of these hold:
- the country has `paymentsEnabled`;
- the country is ACTIVE or BETA at runtime;
- the item's currency matches the country's currency;
- an approved local price exists (`getLocalizedCatalogPrice`);
- tax is configured whenever tax enforcement is on.

Every refusal is "closed": the checkout stops and no charge is made. One market's settings cannot affect another market.

**Risk found:** `src/lib/pricing/loadPricing.ts` contains hard-coded placeholder plans, including made-up Africa prices (5 and 25) and the same numbers relabelled as EUR.
- Nothing imports this file today, so it has no effect.
- But it conflicts with the rule that country prices are never invented, and someone could wire it in by mistake.

**Recommendation:** The owner decides whether to remove this file or mark it clearly as not-for-use. No change was made.

## 4. Payment-provider outage containment

If Square or Stripe returns an error, the route:
- logs a structured error;
- returns a clean 503 (the provider is not answering) or 409 (a price or setting does not match);
- leaves pages, lessons and sign-in working.

If Supabase is unreachable, the country check throws and checkout is refused. It fails closed.

**Improvement recommended:** The call to the Square Payment Links API has no timeout. A provider that hangs (instead of failing) keeps the shopper waiting until the platform timeout. Adding a 10-second timeout (`AbortSignal.timeout`) would make an outage fail fast.
- This only touches the checkout route.
- It does not turn on any payment provider.
- It should go out with the next payment-related change, once the owner approves it.

## 5. Middle East

The Middle East is defined in three different places, and none of them is complete:

| Where | What is there | What is missing |
|---|---|---|
| `src/lib/regions/architecture.ts` | Region `mena` | Country list is empty |
| `src/lib/countries/rollout-phases.ts` | Phase with AE, SA, QA, KW, BH, OM, JO, IL | — |
| `data/regions/` | Region files | No Middle East JSON file |

The legacy `data/` files are not imported by the running app, so the missing JSON file has no effect on visitors. What matters is the empty country list in `architecture.ts` (see item 1).

## 6. Canada as its own market

Canada (CA) has its own entry:
- currency CAD;
- languages English and French (fr-CA lessons exist);
- tax adapter `canada-indirect-tax`;
- runtime state ACTIVE;
- in the country registry it is "development", with payments allowed only once credentials are set.

Stripe checkout is set up for CAD, and Square is limited to US and CA. Canada can be launched and controlled separately from the US.

## 7. Embargoed countries

These are blocked by default at the edge, before any page or API runs:
- Cuba, Iran and North Korea;
- Crimea, Sevastopol, Donetsk and Luhansk.

If the settings store cannot be read, the gate uses the last known settings, or else these defaults. The block holds during an outage. Syria is open by default, as documented in the file.

## 8. Duplicate region definitions (cleanup risk)

Region settings appear in about seven places:
- `data/regions.ts`
- `data/regions/index.json`
- `data/regionReadiness.ts`
- `data/regionCompliance.ts`
- `lib/region-config.ts`
- `src/lib/regions/architecture.ts`
- `src/lib/countries/*`

The running app uses `src/lib/regions/architecture.ts` and `src/lib/countries/*`. The `data/` files above are not imported by the app.

The duplicates disagree. For example, one legacy file marks every region "active". This is harmless now, but it invites mistakes during expansion.

**Recommendation:** Treat `architecture.ts` plus the country registry as the single source of truth, and label the legacy files as legacy, with owner approval.

## Business-level next steps (owner decides)

1. Approve the phase-4 country list, so it can be added in the PRIVATE state ahead of time. This needs no deploy later.
2. Decide whether to remove the unused placeholder pricing file.
3. Approve a 10-second timeout on the Square checkout call.
4. Keep Stripe, Square, the countdown and tax registration off until credentials and approval are in place. Nothing in this review changed them.
