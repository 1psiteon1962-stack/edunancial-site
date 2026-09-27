# Edunancial AI-First Marketing System

## Purpose
One controlled pipeline for LinkedIn, Facebook, X, Instagram, TikTok and YouTube.

## Workflow
1. Create one campaign and canonical educational message.
2. AI prepares platform-specific variants and language variants.
3. Variants enter a batch review window.
4. Owner approves or rejects the batch/items.
5. Only approved items may be scheduled.
6. Scheduler sends due items to the configured publishing adapter.
7. Every attempt is logged; failures are retryable and never silently marked published.
8. Analytics are attached to the publication and used to inform later campaigns.

## Approval rule
There is no per-minute approval loop. Content is accumulated into approval batches. Publishing is fail-closed: no approval means no scheduling; no scheduling means no publishing.

## Platforms
- LinkedIn: professional educational posts and video
- Facebook: educational posts, link distribution and video
- X: concise posts/threads
- Instagram: posts, carousels and Reels
- TikTok: short-form video
- YouTube: Shorts and long-form video

## Provider boundary
The campaign database is provider-neutral. Metricool or direct platform APIs can be attached through adapters without changing campaign records. OAuth tokens and social passwords must never be committed to Git or stored in marketing content tables.

## AI / deterministic split
AI: ideation, drafting, adaptation, translation, titles/descriptions, performance analysis.
Backend: queue ownership, approval state, scheduling, retries, audit events, provider IDs, metrics storage and cost/accounting hooks.

## Phase 1 acceptance
Schema and provider boundary exist; all six platforms are modeled; approval is fail-closed; no Supabase dependency is introduced.

## Phase 2
Connect authorized publishing provider(s), scheduler/worker, admin approval UI, analytics ingestion and campaign KPI dashboard.
