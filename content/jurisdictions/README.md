# Jurisdiction fact sheets

Verified country/subdivision facts the Edunancial AI uses to explain how each lesson applies in a learner's selected jurisdiction. Spec: `docs/JURISDICTION_LOCALIZATION_BUILD_SPEC.md`.

- One folder per jurisdiction: `content/jurisdictions/<CODE>/fact-sheet.json` (e.g. `DO`, `CA-QC`).
- Start from `_template/fact-sheet.json`. Types and validator: `src/lib/jurisdiction/fact-sheet.ts`. Topic and archetype keys: `src/lib/jurisdiction/topics.ts`.
- Every entity form, tax and rule must cite an official source (https) listed in `sources`. Every rule needs an `effectiveFrom` date, a risk level (green/yellow/red) and a verification status. Only `verified` rules with confidence >= 0.85 reach the AI.
- Facts are public regulatory information. Never put learner data here.
- Order of work: `src/lib/jurisdiction/rollout.ts` (US + Canada, then Mexico/PR/DR, Central America, South America, Caribbean).
- A fact sheet existing does NOT make a country visible on the site. Activation is controlled separately by `src/lib/regions/architecture.ts` and requires owner approval.

## Cuba (CU) — prepared, held

Cuba is prepared like any other wave-4 country so it can go live quickly if US policy changes. It is held from activation (`launchState: "DISABLED"`, `activationPolicy: "sanctions-review"` in the region registry; `activationHold` in `rollout.ts`).

Activation checklist (all required, owner-approved):
1. Legal review confirms offering educational services to learners in Cuba is permitted under current US sanctions rules.
2. A payment route that is lawful for Cuban learners is confirmed.
3. `content/jurisdictions/CU/fact-sheet.json` passes validation and RED-risk rules have qualified expert review.
4. Owner approves changing the CU region registry entry and removing the `activationHold`.
