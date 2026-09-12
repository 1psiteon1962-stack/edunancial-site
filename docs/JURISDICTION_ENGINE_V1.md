# Edunancial Jurisdiction Engine V1

## Objective
Replace hard-wired country assumptions and static completion percentages with source-grounded, effective-dated jurisdiction knowledge that can be applied dynamically to canonical lessons.

Language and jurisdiction are independent. A learner may study in Canadian French while applying Ontario rules, in English while applying Quebec rules, in Spanish while applying United States/Florida rules, or in English while applying Dominican Republic rules.

## Non-negotiable behavior
1. Preserve one canonical curriculum; do not create a permanent lesson copy for every country/language combination.
2. Jurisdiction-sensitive claims require verified authority sources and effective dates.
3. Fail closed: absent verified local rules, teach universal principles and explicitly withhold local-law conclusions.
4. Never translate US law and present it as another country's law. Never treat Canadian federal rules as a complete substitute for provincial/territorial rules where subnational law applies.
5. Country/subdivision selection applies from Level 1. Higher levels increase comparative and cross-border sophistication, not basic jurisdiction correctness.
6. Tax/legal changes use risk-based review: GREEN may publish after automated verification; YELLOW requires approval; RED requires qualified expert review.
7. Language selection never determines legal/tax jurisdiction.
8. Architecture must remain extensible as countries, subdivisions, regulators, languages, and cross-border use cases expand.

## Membership entitlement rule
Curriculum access is cumulative downward, never substitutive.
- Basic: Levels 1-2.
- Pro: Levels 1-4, including unrestricted ability to revisit Levels 1-2.
- Gold: Levels 1-5, including unrestricted ability to revisit all lower levels.

Authorization should be based on the membership's maximum permitted level: a learner may access a lesson when lesson.level <= membership.maximumLevel. Upgrading must never remove previously available lower-level curriculum access. This rule applies across every curriculum color/track.

## Commercial launch principle
Do not delay commercialization until worldwide localization is complete. United States and Canada are the initial production priority. Preserve working production functionality while improvements are built and tested in isolated branches, then replace legacy components only after the replacement is demonstrated to be equivalent or safer. The product should improve continuously while in commerce.

Canada does not need every possible rule modeled before launch. Launch-safe behavior is: provide verified coverage where available; distinguish federal from provincial/territorial treatment; and fail closed on jurisdiction-sensitive conclusions that are not yet verified. Continue expanding coverage after launch.

## Canada launch standard
Canada is a first-class jurisdiction, not a translation of United States content.

### Jurisdiction hierarchy
- Country: CA
- Subdivision: province or territory (AB, BC, MB, NB, NL, NS, NT, NU, ON, PE, QC, SK, YT)
- Language is independent: at minimum English and Canadian French are supported presentation choices and neither language selects a province.

### Required Canadian source hierarchy
Prefer authoritative sources in this order when applicable:
1. Federal legislation and Government of Canada / Canada Revenue Agency material.
2. Provincial or territorial legislation, finance/tax authorities, and regulators.
3. Revenu Quebec for Quebec-administered tax matters.
4. Courts and official regulatory guidance when required by the lesson topic.

### Canadian tax behavior
- The engine must be capable of combining federal and applicable provincial/territorial treatment rather than presenting either layer as the entire answer.
- Personal income tax includes federal plus provincial/territorial treatment; province/territory must therefore be available to localization.
- Quebec is a special administration path and must not be treated as merely another CRA-administered province for individual/corporate income tax.
- Corporate tax administration must allow special handling for Quebec and Alberta where applicable.
- Sales/consumption tax localization must distinguish GST/HST/QST and provincial sales-tax regimes as applicable rather than assuming one national sales-tax treatment.
- Business and property topics must allow province-specific rules and regulators.
- Effective dates and tax years are mandatory for rate/rule records that change over time.

### Canada launch UX
Language: English | Francais (Canada)
Apply laws & financial rules of: Canada
Province/Territory: required when a lesson contains subdivision-sensitive material; otherwise the system may use Canada-wide verified rules.

The selected province/territory persists across lessons but can be changed by the learner. A learner may use English for Quebec rules or Canadian French for Ontario rules.

## Data model
- jurisdiction_sources: official legislation, tax authorities, regulators, courts, official guidance.
- jurisdiction_rules: normalized rules linked to sources, topics, effective dates, confidence, verification status, and risk.
- lesson_topics: maps canonical lessons to concepts requiring localization.
- regulatory_changes: detected source changes and AI-produced diffs.
- localization_review_queue: human review for yellow/red/conflicting changes.
- jurisdiction_readiness: computed from verified coverage, freshness, conflicts, and tests; never a manually hard-coded percentage.

## Runtime
Canonical lesson -> identify lesson topics -> learner jurisdiction/subdivision -> retrieve current verified rules -> assemble localization context -> AI explanation in learner language -> display jurisdiction/source/effective-date metadata.

## Cross-border extension
The selection model allows separate residence/tax-residence, asset, and business jurisdictions. V1 should use primary country/subdivision first; later phases can resolve multi-jurisdiction conflicts and treaty issues.

## Migration plan
Phase 1: introduce engine/types and fail-closed behavior without deleting existing country data.
Phase 2: adapt existing country knowledge into sourced/effective-dated rules; remove hard-coded readiness percentages.
Phase 3: wire lesson UI to independent Language and Apply laws & financial rules of selectors, including state/province/territory where applicable.
Phase 4: add official-source monitoring, change detection, impact mapping, and review queues.
Phase 5: activate automated low-risk updates and cross-border context.

## Initial launch jurisdictions
United States and Canada are the commercial launch priority. Canada must support federal + province/territory layering from the beginning, with coverage expanding continuously after launch. Puerto Rico and Dominican Republic are initial expansion/localization targets. Expand further only when readiness is computed as safe.
