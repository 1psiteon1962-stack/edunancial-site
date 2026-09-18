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

## Mandatory curriculum file naming standard

All agents (Claude, ChatGPT, Copilot, humans, importers, and future automation) must use one canonical naming scheme for committed curriculum Markdown.

- Canonical English lesson: `content/curriculum/<TRACK>/L<LEVEL>/<TRACK>-L<LEVEL>-<NNN>.md`
- Localized lesson: `content/curriculum/<TRACK>/L<LEVEL>/<TRACK>-L<LEVEL>-<NNN>.<BCP47-LOCALE>.md`
- Examples: `RED-L5-001.md`, `RED-L5-001.it-IT.md`, `WHITE-L1-023.fr-CA.md`, `BLUE-L2-010.pt-BR.md`.
- TRACK is uppercase; LEVEL is 1-5; lesson number is three digits; locale uses canonical BCP 47 casing.
- Do not add descriptive prefixes/suffixes, duplicate track/level names, upload timestamps, words such as `complete`/`final`/`translations`, or alternate underscore locale directories to canonical curriculum files.
- Legacy files may remain for preservation, but all newly authored or normalized curriculum must use this scheme.
- Import/export tooling must normalize incoming filenames to this canonical scheme before publication.
- The permanent lesson ID inside metadata/content must exactly match the filename lesson ID.
- RED and WHITE completed work is not to be renamed destructively merely to satisfy this convention; migrate only through a validated preservation-safe change.


## Mandatory end-state execution protocol

When instructed to execute, implement, fix, deploy, translate, merge, or otherwise complete an Edunancial task, the requested observable end state is the definition of DONE. Intermediate technical events are not completion.

- Before making changes, determine the complete dependency chain from current state to requested production end state. Work backward from the production acceptance test.
- Execute the full chain as applicable: diagnose -> modify -> generate/migrate -> validate data/content -> test -> build -> pull request -> merge -> deploy -> production verification.
- A commit, pull request, passing check, merge, workflow run, or successful deployment is an intermediate event only.
- Verify prerequisites and inputs before modifying or merging, including branch/ref targets, source data, generated outputs, audits, runtime loaders, and deployment targets when relevant.
- Use evidence gates. Do not advance until expected artifacts exist and required audits pass.
- When a resolvable step fails, diagnose, correct, rerun, and continue. Do not stop merely to report an intermediate failure.
- Do not ask the owner to perform routine intermediate actions available tools can perform.
- For user-facing changes, verify the same production behavior the learner/customer sees. Repository state, CI, and deployment success alone are insufficient.
- Use negative testing where appropriate: look deliberately for leakage, stale content, partial translations, broken routes, missing data, and regressions.
- Do not merge speculative fixes when the required underlying result can be validated pre-merge.
- If intermediate status is requested, report it as status, not completion.
- Escalate mid-chain only for owner authorization, credentials, irreversible business decisions, required human approval, or an inaccessible external system that genuinely prevents continuation.

The task is DONE only when the requested observable end state has been validated. If production behavior does not satisfy the request, the task remains unfinished regardless of intermediate successes.
