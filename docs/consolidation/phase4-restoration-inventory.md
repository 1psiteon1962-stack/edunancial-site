# Phase 4 restoration inventory

This work item follows the Phase 4 restoration safety gate.

Before restoring curriculum, inventory recoverable material by track, level, locale, lesson number, and source package. Compare that inventory with the current canonical learner-visible curriculum and classify each lesson as already canonical, recoverable missing content, duplicate, or conflict.

## Guardrails

- Inventory is read-only. It must not publish or delete curriculum.
- Existing learner-visible lessons and translations are preserved.
- Recovery publication remains frozen.
- Runtime-manifest data is not learner authority.
- Restoration candidates must use the canonical publication pathway.
- Conflicts must be reported rather than silently replacing canonical lessons.
- Restoration batches must pass preservation, integrity, production validation, integration readiness, and migration safety gates before merge.

## Output required before restoration

Produce a deterministic gap list by track, level, locale, and lesson number so restoration can proceed in protected batches without guessing or overwriting existing curriculum.
