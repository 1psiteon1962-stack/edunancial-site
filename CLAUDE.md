# Edunancial Repository Guardrails

## Curriculum preservation is a production-safety rule

The curriculum is protected production data. AI agents and developers must not delete, hide, rename, recycle, orphan, or reduce existing production curriculum unless the task explicitly authorizes removal and the repository's destructive-change approval process is satisfied.

### Mandatory rules

- Canonical lesson IDs such as `RED-L2-001` are permanent and must never be recycled for unrelated content.
- Do not interpret absence from a database, publication-state store, cache, or new loader as authorization to hide an existing committed lesson.
- Do not replace a curriculum source-of-truth path without migrating and validating all existing active lessons and translations.
- Authored lesson title/body/structure remains committed in Git. Runtime databases may hold publication flags, entitlements, member progress, scheduling, and other dynamic state.
- Translation artifacts belong to their canonical lesson IDs. Adding one locale must not overwrite or remove another locale.
- Never weaken, skip, delete, or lower expectations in curriculum preservation/integrity tests merely to make CI pass.
- Never lower generated inventory counts to accommodate an accidental deletion. Fix the underlying regression.
- If a proposed change reduces canonical lesson IDs or locales, stop and require the explicit destructive-change process.
- Member progress must continue to reference permanent canonical lesson IDs.
- Normal application work (payments, authentication, cybersecurity, UI, hosting, database changes) must not reduce the effective curriculum inventory.

### Destructive curriculum changes

Intentional removal/depublication is exceptional. It must be documented in `curriculum/curriculum-removals.json` with a canonical ID, reason, and date, and it must receive explicit human owner approval. AI agents must not self-authorize destructive curriculum changes.

### Before modifying curriculum loaders or publication state

Verify that deleting or emptying the dynamic publication-state store does not make existing committed active curriculum disappear. Existing Git/registry curriculum must remain discoverable unless it has been explicitly unpublished through an approved destructive action.
