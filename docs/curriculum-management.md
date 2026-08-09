# Curriculum Management System

This repository includes a permanent curriculum-management subsystem for storing, validating, locating, auditing, and importing curriculum assets without adding any new npm dependencies.

## Goals

- Keep the curriculum taxonomy locked and explicit.
- Store lesson files in deterministic, canonical paths.
- Maintain an authoritative registry and append-only ingestion ledger.
- Detect drift between the registry and the filesystem.
- Preserve migration notes showing that legacy curriculum assets were not found in the repository.

## Locked Taxonomy

The taxonomy is defined in `scripts/curriculum/lib/taxonomy.mjs` and must not change without authorization.

| Code | Official Name |
| ---- | ------------- |
| RED | Real Estate |
| WHITE | Paper Assets |
| BLUE | Business |
| GREEN | Taxes |
| GOLD | Investing |
| PURPLE | Law |
| ORANGE | Sales & Marketing |
| BLACK | Leadership & Executive Management |

## Asset IDs

Canonical format:

```text
{TRACK}-L{LEVEL}-{NUMBER:3d}
```

Examples:

- `RED-L1-001`
- `WHITE-L2-004`
- `BLACK-L9-120`

Special asset IDs:

- `{TRACK}-L{LEVEL}-MANIFEST`
- `{TRACK}-L{LEVEL}-BATCH-VERIFICATION`

## Directory Layout

```text
content/curriculum/              # Canonical lesson storage
curriculum/                      # Registry, ledger, schemas, reports, migrations
scripts/curriculum/              # CLI tooling and tests
examples/curriculum-package/     # Reference package for contributors
```

Important subdirectories:

- `curriculum/manifests/`
- `curriculum/verification/`
- `curriculum/staging/`
- `curriculum/rejected/`
- `curriculum/superseded/`
- `curriculum/reports/imports/`

## System Files

### Registry

`curriculum/registry.json` is the authoritative catalog of imported curriculum assets.

Each active asset records:

- asset ID
- asset type
- track and level
- title, version, author, date
- canonical repository path
- checksum
- ingestion ID and import timestamp
- validation result metadata

### Ingestion Ledger

`curriculum/ingestion-ledger.json` is append-only and records:

- imports
- updates
- duplicate skips
- staging outcomes
- superseded assets
- rejections and conflicts

### Inventory

`curriculum/inventory.json` is generated from the registry and summarizes total assets, tracks, levels, and asset metadata.

### Schemas

JSON Schemas are stored in `curriculum/schemas/` for:

- lesson metadata
- registry
- ingestion ledger
- manifest metadata

## Commands

Additions in `package.json`:

```bash
npm run curriculum:import -- <path>
npm run curriculum:validate
npm run curriculum:audit
npm run curriculum:localization
npm run curriculum:locate -- <asset-id>
npm run curriculum:inventory
npm run curriculum:migrate-legacy
npm run curriculum:test
```

### Import

`npm run curriculum:import -- <path>` supports:

- one markdown file
- one directory of markdown files
- one ZIP file containing markdown files

Import behavior:

- validates front matter and required sections
- skips exact duplicates
- blocks same-version content conflicts
- rejects lower versions unless `--force-lower-version` is used
- archives superseded versions in `curriculum/superseded/`
- stages non-fatal validation failures in `curriculum/staging/`

### Validate

`npm run curriculum:validate` validates every registered asset and writes:

- `curriculum/reports/CURRICULUM-VALIDATION.json`
- `curriculum/reports/CURRICULUM-VALIDATION.md`

### Audit

`npm run curriculum:audit` checks registry/filesystem consistency and writes:

- `curriculum/reports/CURRICULUM-AUDIT.json`
- `curriculum/reports/CURRICULUM-AUDIT.md`

It detects:

- orphan files
- missing files
- checksum drift
- duplicate IDs
- non-canonical paths

### Localization Coverage

`npm run curriculum:localization` audits active canonical lessons against the live curriculum locales currently exposed by the site language selector and writes:

- `curriculum/reports/CURRICULUM-LOCALIZATION-COVERAGE.json`
- `curriculum/reports/CURRICULUM-LOCALIZATION-COVERAGE.md`

Coverage tracks:

- canonical lesson presence
- exact-locale localized files
- base-language fallback usage
- English fallback usage
- title / summary / body completeness
- localized-file validation failures

### Locate

`npm run curriculum:locate -- <asset-id>` shows:

- registry details
- disk location
- checksum comparison
- last git commit touching the file
- ingestion metadata

### Inventory

`npm run curriculum:inventory` regenerates `curriculum/inventory.json` from the registry.

### Legacy Migration Scan

`npm run curriculum:migrate-legacy` refreshes `curriculum/migrations/legacy-migration-map.json`.

This repository currently records that the following legacy curriculum assets were **not found** in the repository history or working tree during implementation:

- `RED-L1-001` through `RED-L1-010`
- `RED-L1-MANIFEST`
- `RED-L1-BATCH-VERIFICATION`
- `WHITE-L1-001`
- `BLUE-L1-001`
- `red-01`
- `white-01`
- `blue-01`

That absence is intentionally documented in migration notes so future imports can start from a clean canonical registry.

## Lesson Format

Lessons are markdown files with YAML-style front matter:

```md
---
id: RED-L1-001
track: RED
officialTrackName: Real Estate
level: 1
lessonNumber: 1
title: Introduction to Real Estate
version: 1.0
author: Curriculum Team
date: 2026-07-11
regionalStatus: GLOBAL CORE
---

## Learning Objectives

- Objective 1

## Core Content

Lesson body.
```

Required lesson sections:

- `Learning Objectives`
- `Core Content`

Lessons may include practice quizzes, answer keys, worked solutions, and answer explanations as part of the same Markdown lesson. Edunancial supports self-paced learning and self-assessment, so sections such as `## Answer Key`, `## Answers`, `Correct Answer: B`, `## Worked Solution`, and `## Answers and Explanations` are all permitted and do not receive separate curriculum IDs. Answer material remains part of the canonical lesson body.

### Localized Lesson Format

English source files remain canonical:

```text
content/curriculum/GOLD/L1/GOLD-L1-002.md
```

Localized lesson bodies must stay beside the canonical file and keep the same lesson ID:

```text
content/curriculum/GOLD/L1/GOLD-L1-002.es.md
content/curriculum/GOLD/L1/GOLD-L1-002.fr.md
content/curriculum/GOLD/L1/GOLD-L1-002.es-PR.md
```

Rules:

- keep the canonical lesson ID, track, level, and lesson number in front matter
- translate the full lesson content object, not just the title
- localized files must include non-empty `title`, `summary`, and body content
- do **not** create separate lesson IDs per translation

### Locale Resolution Order

Curriculum lesson loading resolves localized markdown in this order:

1. exact locale (example: `es-PR`)
2. base language (example: `es`)
3. canonical English source (`.md`)

Examples:

- `es-PR -> es -> en`
- `fr-CA -> fr -> en`

Diagnostics preserve both the requested locale and the resolved locale so the app can distinguish exact translation, base fallback, and canonical English fallback.

### Registry, Inventory, and Progress Identity

- `curriculum/registry.json` indexes only the canonical lesson record for each lesson ID.
- `curriculum/inventory.json` now records localized sibling files under each canonical lesson without creating duplicate lesson IDs.
- progress, entitlements, navigation, and lesson identity must always remain bound to the canonical lesson ID (for example `GOLD-L1-002`) even when localized files are rendered.

### Adding a Translation

1. Start from the canonical English lesson file.
2. Create a localized sibling file using the locale suffix format above.
3. Preserve canonical identifiers in front matter.
4. Translate `title`, `summary`, and the full lesson body.
5. Run:
   - `npm run curriculum:validate`
   - `npm run curriculum:localization`
   - `npm run curriculum:inventory`

Localized imports through curriculum tooling preserve the canonical registry entry and write the localized sibling file instead of inventing a new lesson ID.

## ZIP Security Controls

ZIP import is implemented with built-in Node.js modules only. The extractor enforces:

- path traversal protection (zip-slip defense)
- file extension blocking for executable/script payloads
- max extracted file size: 10 MB
- max total extracted size: 100 MB
- support only for stored and DEFLATE ZIP entries

## CI Workflow

`.github/workflows/curriculum-integrity.yml` runs on curriculum-related changes and performs:

- curriculum tests
- curriculum validation
- curriculum audit
- inventory regeneration consistency check
- application lint
- TypeScript typecheck
- application build

## Contributor Workflow

1. Prepare lesson markdown files using the sample package in `examples/curriculum-package/`.
2. Import files with `npm run curriculum:import -- <path>`.
3. Review the import report in `curriculum/reports/imports/`.
4. Run `npm run curriculum:validate`.
5. Run `npm run curriculum:audit`.
6. Run `npm run curriculum:inventory`.
7. Commit both source lessons and generated curriculum metadata updates.
