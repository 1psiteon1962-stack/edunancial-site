# COMMAND Phase 0 Foundation

Status: implementation contract for the additive COMMAND spine.

## Non-negotiable invariants

- GitHub remains canonical for curriculum content.
- COMMAND must not modify curriculum publication behavior until the active bulk-publication recovery is verified in production.
- Neon is the operational system of record for COMMAND state.
- Global axes are separate: language, locale, jurisdiction, market.
- Unknown metric values are never represented as zero. Metric state is explicit: OK, INSUFFICIENT_DATA, STALE, ERROR.
- Humans, AI workers, and service identities share a PRINCIPAL model.
- AI workers may submit structured observations, evidence, recommendations, forecasts, drafts, and proposed tasks without receiving production credentials.
- Information authority, decision authority, and execution authority are separate.
- AI-to-AI coordination occurs through durable events/tasks/shared state, not uncontrolled agent conversations.
- Multiple responsible functions may fan out concurrently from one event.
- LLM providers are adapters behind a provider-independent gateway.
- LLMs never hold production provider credentials.
- Execution credentials are least-privilege and separated by domain where practical.
- Configuration changes are governed actions, versioned, reversible, and audited.
- Every accepted event receives a deterministic routing disposition; zero-task audit-only events are valid.
- Audit history is append-only.
- No hard-wired markets, locales, currencies, report recipients, approval identities, or model providers where configuration is appropriate.
- No placeholder cards, fake data, fake zeroes, or dead controls.

## Core operational chain

PRINCIPAL -> EVENT -> TASK -> DECISION (when required) -> ACTION + immediate result -> FORECAST/REVIEW

AUDIT LOG records state changes underneath the chain.

## AI workforce contract

An AI principal can:
1. observe or receive a task;
2. write structured evidence and confidence;
3. create a proposed task or recommendation for another function;
4. participate concurrently with other AI/human principals;
5. submit a proposed action;
6. receive measured results and approved institutional knowledge.

An AI principal cannot gain execution authority merely by generating a proposal. The authority engine and executor enforce action permissions in code.

## Functional ownership

S1-S9 are responsibility seats, not nine continuously running model processes. Product/Curriculum, Customer, and Legal/Compliance are first-class functions alongside them. A seat may be occupied by AI, human, or both without changing the core workflow model.

## Curriculum integration boundary

A curriculum publication is successful only after:
UPLOAD -> VALIDATE -> CANONICAL REPOSITORY WRITE -> REQUIRED CHECKS -> MERGE -> DEPLOY -> PRODUCTION VERIFICATION -> INVENTORY CONFIRMATION -> SUCCESS.

COMMAND will consume these outcomes after the current bulk-upload recovery is stable; Phase 0 must not compete with that repair.

## Phase 0 acceptance

Phase 0 is acceptable only if it is additive, does not alter learner curriculum resolution, does not alter bulk upload behavior, does not require fake dashboard data, and leaves existing build/validation protections intact.
