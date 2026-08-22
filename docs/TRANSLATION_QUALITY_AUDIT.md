# Translation Quality Audit

## Purpose

This specification extends curriculum localization reporting so runtime fallback is never confused with translation completeness. It is intentionally compatible with the existing translation-overlay architecture and canonical lesson IDs.

## Scope

Use only locales already enabled by the Edunancial production language configuration. `en-US` remains canonical. African-language curriculum localization remains paused until separately authorized; the audit may report existing artifacts but must not generate new African-language content.

## Required statuses

Each canonical lesson + locale pair must resolve to one of:

- `COMPLETE`: substantive translated title, summary, and learner-facing body are present and current.
- `PARTIAL`: substantive content exists but one or more canonical learner-facing components are absent.
- `STUB`: a translation artifact exists but is trivially short or substantially English copy-through.
- `MISSING`: no substantive translation exists. English runtime fallback does not change this status.
- `STALE`: translation was validated against an older materially different canonical source.
- `ORPHAN`: translation points to no active canonical lesson ID.
- `DUPLICATE`: more than one competing translation artifact exists for the same canonical lesson ID + locale.

## Actual-schema rule

Do not require hypothetical separate `quiz`, `answer_key`, `examples`, or `worked_examples` JSON fields. Some Edunancial translations place all learner-facing instructional material inside the translated `body`. Validation must follow the actual stored representation and compare the translated learner-facing structure with the canonical lesson.

## Completeness checks

For each active canonical lesson and configured locale:

1. Verify canonical lesson ID authority first. A translation must never create a canonical identity.
2. Verify translated title, summary, and substantive body.
3. Compare canonical and translated body structure. If canonical contains objectives, definitions, examples, scenarios, questions, answer choices, answers/explanations, or key takeaways, verify that the corresponding learner-facing components remain represented in the translation.
4. Detect English copy-through using normalized/substantive similarity, not exact string equality alone. Markdown, whitespace, or punctuation-only changes must not make English content count as translated.
5. Use length/ratio checks only as signals. Do not fail a legitimately short translation solely because it is under a fixed character threshold.
6. Keep runtime fallback separate from completeness. A page may safely render canonical English while the requested locale remains `MISSING` or `PARTIAL` in readiness reporting.

## Canonical staleness

Record a stable fingerprint of the canonical learner-facing source used when a translation is validated. If canonical content later changes materially, report the translation as `STALE` until revalidated/retranslated. The fingerprint must not include volatile metadata that changes without changing lesson meaning.

## Matrix output

Produce machine-readable JSON and CSV with at least:

`academy,level,lesson_id,locale,canonical_exists,title_status,summary_status,body_status,content_structure_status,english_copythrough_status,canonical_version_status,overall_status,required_action`

Human-readable Markdown may summarize the same data.

## Safety and CI

Preserve Curriculum Integrity, Curriculum Preservation, Integration Readiness, and Production Validation. Do not weaken orphan protection or branch protection. Add focused tests for COMPLETE, PARTIAL, STUB/copy-through, MISSING-with-English-fallback, STALE, ORPHAN, and DUPLICATE cases.

## Initial execution order

1. RED L1 Italian 001-050.
2. WHITE L1 001-050 across applicable existing website locales.
3. BLUE, GREEN, GOLD, PURPLE, ORANGE, and BLACK Level 1 gap audit.
4. Production spot-check of actual translated lesson bodies.
5. Certified Level 1 localization baseline before large-scale Levels 2-5 translation work.
