# Jurisdiction Localization — Build Spec (V1 implementation)

Status: SPEC FOR OWNER REVIEW — no code changes yet. Implements `docs/JURISDICTION_ENGINE_V1.md`.
Owner: Waldemar M. Caban. Drafted 2026-11-26.

## 1. The model (two sides of one coin)

- **Side A — Translation.** Committed curriculum (`content/curriculum/**`) translated faithfully. US rules stay labeled as US rules (REGION-SPECIFIC RULE). Language only.
- **Side B — Jurisdiction application.** AI explains how each lesson's principles apply under the learner's selected country/subdivision, grounded in verified, sourced, dated rules. Never rewrites committed curriculum.
- Language and jurisdiction are independent selections. Language never selects law.

## 2. Current state (audited 2026-11-26)

| Piece | Exists | Problem |
|---|---|---|
| `src/lib/jurisdiction/engine.ts` (verified-rules, fail-closed) | Yes | No repository implementation, no data, no caller |
| `src/app/api/ai-learning/localize` + `jurisdiction-service.ts` | Yes | Ignores the engine; free web search per request; hard-wired to one provider; no UI caller |
| Learner country/language prefs (`learner_ai_preferences`) | Yes | Not used by lessons |
| Canada subdivisions + topics (`canada.ts`) | Yes | Good base |
| Jurisdiction list | 17 codes in 3 drifting copies (`jurisdictions.ts`, `jurisdiction-policy.ts`, `localization.ts`) | Missing MX, Central/South America, DO and Caribbean |
| Lesson → topic mapping | No | AI cannot know which lesson parts need localization |
| Lesson UI country selector / panel | No | — |

## 3. Decisions

1. **One jurisdiction registry.** Merge the three lists into `src/lib/jurisdiction/registry.ts` (code, name, parent, subdivisions, legal family, languages, authoritative domains, launch wave, status PRIVATE/BETA/ACTIVE). Others re-export from it.
2. **Rules data authored in Git** under `content/jurisdictions/<CODE>/` as JSON (`sources.json`, `rules.json`, `entities.json`, `tax-calendar.json`). Public regulatory facts, reviewable by PR, reproducible. Compiled at build into a runtime manifest. Rule changes ship by normal deploy. (Neon holds only dynamic state: generated explanations, review queue, learner prefs.)
3. **Every rule** carries: topics, statement, source IDs (official URLs), effectiveFrom/To, lastVerifiedAt, risk GREEN/YELLOW/RED, verificationStatus. Unverified or stale → not used (engine already enforces).
4. **Lesson topics as a sidecar file**, not lesson edits: `curriculum/lesson-topics.json` maps canonical lesson IDs → controlled topic list. Zero changes to committed lesson files. Validated: every ID must exist in the registry.
5. **Controlled topic taxonomy** (`src/lib/jurisdiction/topics.ts`, ~30 topics), e.g. business-formation, entity-liability, personal-income-tax, corporate-income-tax, consumption-tax (VAT/IVA/ITBIS/GST/HST/QST/sales tax), advance-tax-payments, depreciation-expensing, capital-gains, like-kind-or-rollover-relief, real-estate-transfer, property-tax, mortgage-lending, retirement-accounts, payroll-employment, social-security, consumer-credit, credit-reporting, banking-deposit-insurance, securities-investing, insurance, inheritance-estate, intellectual-property, bankruptcy-insolvency, foreign-exchange-controls, cross-border.
6. **Archetype layer to scale across Latin America/Caribbean.** Define universal archetypes once — sole proprietor, general partnership, limited partnership, limited-liability company, corporation, simplified stock company (SAS) — and per-country `entities.json` maps local forms to archetypes (e.g. DO S.R.L./S.A./S.A.S.; MX S.A. de C.V./S. de R.L./S.A.S.; CO S.A.S.; CA federal/provincial corporations). Same for tax archetypes (VAT, monthly advances, withholding). Adding a country = filling tables, not code.
7. **Grounded generation, generated once, reused.** Per (lessonId, jurisdiction[-subdivision], language): build context from engine → AI writes the application panel → stored in Neon `jurisdiction_explanations` with lesson hash, rules version hash, model, prompt hash, createdAt, reviewStatus. Regenerate when lesson or rules hash changes. Live Q&A uses the same grounded context. Free web search removed from the production path (allowed only in the offline research tool that drafts rules for review).
8. **Review by risk:** GREEN auto-publish after automated checks; YELLOW owner approval; RED qualified local expert. Unreviewed YELLOW/RED explanations are not shown; learner sees the principle-only fallback.
9. **Fail closed:** no verified rules for a topic → "This lesson's principle applies; [country]-specific rules are not yet verified on Edunancial." Never translate US law as local law.
10. **Provider interface:** `src/lib/ai/provider.ts` (`generateStructured(...)`), OpenAI adapter moved behind it; Anthropic adapter addable. AI failure never blocks lesson display.
11. **UI:** lesson page gets "Language" and "Apply rules of: Country [+ Province/State]" selectors (defaults from profile, never from language) and an "In your country" panel with jurisdiction badge, sources, effective date, review status and disclaimer.
12. **Readiness computed, not typed:** per jurisdiction × topic coverage, freshness and conflicts; a country turns ACTIVE only when readiness passes for its launch topics.

## 4. Country rollout (owner direction: US + Canada, then south)

- **Wave 0 — Launch:** US (federal; state layer for state-sensitive topics), Canada (federal + 13 provinces/territories; Quebec special path; GST/HST/QST/PST).
- **Wave 1 — Bridge:** Mexico (first country south; federal + states for some topics), Puerto Rico (US parent, own tax code), Dominican Republic (already named target).
- **Wave 2 — Central America:** GT, BZ (English, common law), SV, HN, NI, CR, PA.
- **Wave 3 — South America:** CO, VE, EC, PE, BO, CL, AR, UY, PY, BR (Portuguese, federal), GY (English), SR (Dutch).
- **Wave 4 — Caribbean:** independents JM, TT, BS, BB, HT, and the other CARICOM states; territories inherit parent rules plus local overrides (USVI→US, GP/MQ→FR, Dutch Caribbean→NL Kingdom constituent rules, UK territories local).
- **Cuba (owner direction):** prepare fully (fact sheet, explanations) so it can go live quickly if US policy changes, but keep it held: region registry stays `DISABLED` / `sanctions-review`, and `rollout.ts` carries an `activationHold`. Activation checklist in `content/jurisdictions/README.md`.

### Done 2026-11-26 (foundation, no behavior change)
- `src/lib/jurisdiction/topics.ts` — topic taxonomy + entity and consumption-tax archetypes.
- `src/lib/jurisdiction/rollout.ts` — wave order incl. Mexico, territories' parents, Cuba hold.
- `src/lib/jurisdiction/fact-sheet.ts` — fact-sheet type + validator (sources, dates, topics, archetypes).
- `content/jurisdictions/` — README, template, Cuba activation checklist.
- Tests: `src/lib/jurisdiction/jurisdiction-foundation.test.ts` (5 passing).
- Existing non-Americas codes (DE, FR, ES, GB, PT, NL, CH, AT, UG, KE, TZ) stay registered, PRIVATE until filled.
- Order inside each country: business-formation, consumption-tax, personal/corporate income tax, advance payments, real estate, then the rest.

## 5. Build steps (each a separate PR; owner approves merges)

1. **Engine join (Sunday start):** unified registry; Git rule store + loader implementing `JurisdictionRepository`; provider interface; `jurisdiction-service` uses `buildLessonLocalizationContext` + `buildJurisdictionPrompt`; remove production web search; tests (fail-closed, language≠jurisdiction, no-rules fallback, provider failure fallback).
2. **Topics:** taxonomy + `curriculum/lesson-topics.json` for business-formation and tax lessons first (BLUE/GREEN/GOLD/RED as applicable), validation script in `curriculum:test`.
3. **Registry expansion + fact-sheet format:** add Wave 0–4 codes (PRIVATE), JSON schemas, archetype tables, US + Canada seed rules with official sources.
4. **UI:** selectors + "In your country" panel behind a feature flag.
5. **Generation + review store:** Neon `jurisdiction_explanations` and `localization_review_queue` (additive migration), admin review screen, regenerate-on-hash-change.

## 6. Acceptance tests (production)

- Lessons render unchanged with the Neon explanation tables empty or AI disabled.
- Learner with Polish language + Canada/Ontario rules sees Polish lesson and Ontario explanation.
- Country with no verified rules shows principle-only fallback, no local legal claims.
- Negative: a Dominican Republic learner never sees §1031/§179 presented as local law.
- Canonical lesson count and locale inventory unchanged by every step.
