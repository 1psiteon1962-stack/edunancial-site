# Phase 2 destructive-path audit

Status: report only. No curriculum or publication behavior is changed by this audit.

Base: ed2e5af0ef9c555ffb7e345ad9d2a5dfd85e8468

## Findings

1. **Full-replacement legacy state writes remain possible.**
   `src/lib/curriculum/authoritative-published.ts` still reads and writes `published/curriculum-state.json`. When atomic storage is unavailable, lesson upserts, translation imports, and batch deletion fall back to rewriting the complete legacy state. `src/lib/curriculum/published-registry-backfill.ts` also reads the whole state and saves the whole state after backfill. These are shadow authorities that must be retired under the Git-only design.

2. **Recovery and normal finalization use different normalization paths.**
   `src/app/api/admin/content/upload/finalize/route.ts` calls `normalizeMixedLocaleBatch(createdBatch)` before trusted publication. `src/app/api/admin/content/upload/recover/route.ts` creates the recovered batch and publishes it without that normalization call. Recovery can therefore classify/publish a stored package differently from the normal upload path. This is the Phase 3 repair target.

3. **Stored-ZIP ingestion is frozen but still writes the legacy tree.**
   `.github/workflows/ingest-stored-curriculum.yml` is correctly limited to manual `workflow_dispatch` during the Phase 0 freeze. If manually invoked, it runs `scripts/curriculum/ingest-stored-zips.mjs`, which writes accepted 50-lesson sets into `content/courses` and opens a publication PR. This conflicts with the final canonical `content/curriculum` tree and must remain frozen until routed through the single publisher.

4. **Learner resolution still depends on shadow sources.**
   `src/lib/curriculum/authoritative-published.ts` builds effective curriculum from legacy published state, atomic published rows, the registry, `content/courses`, and `content/generated/curriculum-runtime-manifest.json`. The runtime manifest is therefore still a learner read source, contrary to the final Git-only architecture.

5. **No production directory-clearing path was found in the targeted audit.**
   Search for curriculum-directory `rmSync` use found cleanup in tests and temporary-directory handling in bulk import, not a production path that clears `content/curriculum` or `content/courses`. This finding does not authorize removal of preservation gates.

6. **Mixed-locale normalization is not itself a full replacement, but it is bypassed by recovery.**
   `normalizeMixedLocaleBatch` updates each extracted file's inferred locale/track/level/destination and then persists the batch. Normal finalize calls it; recover does not. The bypass is the concrete locale-loss/divergence risk to fix in Phase 3.

7. **The #999 overlay remains transitional reconciliation, not a canonical authority.**
   `authoritative-published.ts` overlays atomic rows onto legacy state, supplements missing lessons from registry/`content/courses`/runtime manifest, and localizes through several fallbacks. This keeps content visible but can mask disagreement between sources. It is slated for retirement after the canonical Git resolver is proven.

## Phase 3 entry criteria

Phase 2 identifies a concrete repair target without modifying curriculum: recovery must use the same normalization/publication pathway as normal finalization, recovery must remain disabled during consolidation, and package failures must be isolated/reported rather than aborting unrelated packages.

No curriculum content was generated, deleted, restored, or conflict-resolved in this phase.
