# Durable Curriculum Migration

## Objective
Make curriculum publishing a data operation rather than an application deployment while guaranteeing that no currently working lesson is lost during migration.

## Non-destructive migration
The repository/file curriculum remains authoritative during the first migration phases. The durable Neon store is introduced additively.

1. Inventory and checksum every canonical lesson and localization.
2. Import them into immutable lesson/revision/localization records.
3. Compare counts, IDs, checksums, locale coverage and rendered output.
4. Dual-write new approved bulk uploads to the existing path and durable store.
5. Shadow-read the durable store and compare responses against production.
6. Enable durable reads for a narrowly scoped pilot only after parity is green.
7. Expand by track/level/locale with rollback switches.
8. Remove build-time curriculum dependence only after full parity and recovery tests.

## Identity and versioning
A canonical lesson ID never changes with locale, filename or deployment. Revisions are append-only. Publishing changes an active-version pointer; it does not overwrite the prior published revision. Localizations are independently versioned but reference the canonical revision they translate.

## Batch atomicity
A publish batch is validated before activation. The system records the previous active revision for every item so activation can be rolled back. A failed regional or locale batch cannot modify another region/locale.

## Runtime end-state
Learner runtime -> curriculum service -> active durable version -> cache.
Git/Netlify -> application code only.
Object storage -> upload packages, video/audio/images and large immutable assets.
Neon -> lesson identity, revisions, localizations, publication state, audit relationships.

## Safety gates
No cutover without inventory parity, checksum parity, rendering parity, access-control parity, localization fallback tests, rollback tests and production monitoring.
