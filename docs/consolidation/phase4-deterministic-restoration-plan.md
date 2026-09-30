# Phase 4 Deterministic Restoration Plan

## Purpose

Move from inventory/reconciliation infrastructure to actual curriculum restoration without inventing or replacing content.

## Global invariant

Restoration covers every configured track x Level 1-5 x centrally supported locale x lessons 1-50. New supported locales enter through central language configuration, not restoration-specific allow-lists.

## Restoration source rule

A coordinate may be restored only when a recoverable stored package has a valid package identity and its reconciliation key matches a reported canonical gap for the same track, level, and locale.

## Batch rule

For each matched package:

1. Read the stored ZIP without modifying other packages.
2. Create an independent upload batch using the existing package-specific configuration.
3. Run mixed-locale normalization.
4. Run the shared complete-package validator introduced in #1021.
5. Require exactly 50 unique lessons for the package identity.
6. Publish through the canonical trusted curriculum publication path.
7. Verify registry/learner resolution for all 50 lessons.
8. Record package-scoped success or failure; a failed package must not abort unrelated packages.

## Preservation rules

- Never invent missing lessons or translations.
- Never delete or replace unrelated canonical curriculum.
- Recovery publication remains frozen until the restoration executor is protected by the existing preservation, integrity, migration, integration, production, and Netlify gates.
- Do not restore runtime-manifest authority.
- Do not use destructive whole-state replacement as the restoration mechanism.
- Preserve content/courses and legacy read compatibility until the restored canonical learner path has been verified.

## Next implementation

Implement a deterministic restoration-plan generator that joins canonical gap coordinates to recoverable package reconciliation keys. Its output must identify: restorable package, unresolved gap, conflict, and recoverable package with no matching gap. The generator is read-only.

After that report is validated, execute matched restoration packages through protected batches and verify the learner-visible production deployment after each merge.
