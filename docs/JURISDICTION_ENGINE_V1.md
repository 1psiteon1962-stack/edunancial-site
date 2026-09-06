# Edunancial Jurisdiction Engine V1

## Objective
Replace hard-wired country assumptions and static completion percentages with source-grounded, effective-dated jurisdiction knowledge that can be applied dynamically to canonical lessons.

Language and jurisdiction are independent. A learner may study in Spanish while applying United States/Florida rules, or in English while applying Dominican Republic rules.

## Non-negotiable behavior
1. Preserve one canonical curriculum; do not create a permanent lesson copy for every country/language combination.
2. Jurisdiction-sensitive claims require verified authority sources and effective dates.
3. Fail closed: absent verified local rules, teach universal principles and explicitly withhold local-law conclusions.
4. Never translate US law and present it as another country's law.
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
Phase 3: wire lesson UI to independent Language and Apply laws & financial rules of selectors, including state/province where applicable.
Phase 4: add official-source monitoring, change detection, impact mapping, and review queues.
Phase 5: activate automated low-risk updates and cross-border context.

## Initial launch jurisdictions
United States and Canada are the commercial launch priority. Puerto Rico and Dominican Republic are initial expansion/localization targets. Expand further only when readiness is computed as safe.
