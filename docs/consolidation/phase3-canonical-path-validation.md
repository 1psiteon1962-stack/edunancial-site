# Phase 3 canonical curriculum path validation

This is the final Phase 3 consolidation gate before curriculum restoration.

## Required invariants

1. Interrupted-upload recovery publication remains frozen during consolidation.
2. Recovery packages use the same mixed-locale normalization gate as normal finalization.
3. A failed stored package is reported by upload ID without implying sibling packages failed.
4. Legacy full-state curriculum writes are disabled outside explicit test/override use.
5. The generated runtime manifest is not a learner-facing curriculum authority.
6. Restoration must publish through the canonical pathway and pass curriculum preservation, integrity, production validation, integration readiness, and Phase 0 safety gates.

## Phase 4 entry criteria

Do not begin restoration until PRs #1008, #1009, #1010, and this validation PR have merged sequentially with required checks green.

Phase 4 restoration must preserve existing curriculum, restore in protected batches, and verify learner-visible output after each protected merge. It must not re-enable the legacy recovery or full-state write paths as alternate authorities.

<!-- canonical-main: 185e0330a9224056564b61e252f4b693ab2a0096 -->
