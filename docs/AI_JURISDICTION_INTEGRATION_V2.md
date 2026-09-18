# AI Jurisdiction Integration V2

## Goal

Build one source-grounded AI learning architecture that can launch in the United States and Canada now and expand globally without creating country-specific copies of the curriculum.

## Non-negotiable product rules

1. Language and jurisdiction are independent. The learner may read French while Ontario law applies, or English while Quebec law applies.
2. Curriculum identity is independent from presentation/localization. Changing language or jurisdiction must never erase lesson completion, saved work, bookmarks, notes, or resume position.
3. Membership access is cumulative: Basic = L1-L2; Pro = L1-L4; Gold = L1-L5. Upgrading never removes lower-level access.
4. Jurisdiction-sensitive claims must be source-grounded. If verified material is unavailable, teach universal principles and fail closed on local claims.
5. Do not translate U.S. law into another jurisdiction or silently substitute common-law assumptions.
6. Production launch priority is United States and Canada. Global architecture must remain extensible.

## Target runtime

canonical lesson
  -> learner durable state
  -> topic inference
  -> jurisdiction selection (country + subdivision + optional cross-border dimensions)
  -> jurisdiction policy validation
  -> verified effective-dated rule/source repository
  -> grounding context
  -> AI explanation in selected language
  -> source/effective-date/review metadata

## Learner durable state

The existing database already models per-user lesson progress and track progress. The AI layer must consume that state, not replace it. Browser storage can remain a fast/offline cache, but authenticated server state is authoritative for cross-device resume.

Required behavior:
- automatically resume the most recent lesson and position;
- preserve completed lessons and progress percentages;
- preserve explicit bookmarks, notes, and saved questions;
- synchronize authenticated learner state across devices;
- never reset curriculum progress when language or jurisdiction changes;
- keep AI conversation/localization state separable from curriculum completion.

## Jurisdiction model

Primary dimensions:
- countryCode
- subdivisionCode (state/province/territory when required)
- language

Cross-border dimensions supported by the context contract:
- taxResidenceCountryCode
- assetCountryCode
- businessCountryCode

A later treaty/citizenship layer can be added without changing curriculum identity.

## Canada

Canada is first-class, not a single undifferentiated jurisdiction. Province/territory is required for topics where provincial law or tax treatment materially matters. Quebec and Alberta administration differences must be represented by verified source records rather than model memory.

## Regulatory truth

The language model is not the regulatory database. `JurisdictionRepository` is the boundary between AI orchestration and authoritative regulatory knowledge. Rules must carry verification status, confidence, risk, effective dates, and source IDs. Sources must be resolvable before a rule can ground an answer.

The initial deterministic repository is replaceable by a Supabase/database adapter without changing AI orchestration.

## Consolidation requirement

The repository currently contains older AI localization/jurisdiction paths as well as the V2 grounding engine. V2 should become the single orchestration path before merge. Existing useful functionality (canonical lesson scoping, official-domain guidance, localization output metadata, guardrails) should be adapted into V2 rather than duplicated.

Do not delete legacy paths until callers are migrated and validation proves equivalent or safer behavior.

## Merge gate

Do not merge V2 until:
- AI service uses source-grounded jurisdiction context;
- Canada subdivision fail-closed behavior is tested;
- language/jurisdiction independence is tested;
- stale/unverified/source-less rules are excluded;
- no U.S.-law substitution is tested;
- learner progress/resume behavior remains intact;
- existing curriculum/upload workflows pass;
- branch is reconciled with current main without overwriting newer production fixes.
