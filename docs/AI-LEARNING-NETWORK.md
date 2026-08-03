# Edunancial AI Learning Network

## Overview

The AI Learning Network is embedded across public pages through `SiteChrome` and is not a standalone chatbot.

It uses centralized learner context (curriculum path, lesson, track, level, language, membership, jurisdiction, progress, and certification path) and returns educational coaching responses with guardrails and disclaimers.

## Architecture

- **Context model:** `src/lib/ai-learning/context.ts`
  - Parses curriculum route (`/curriculum/{track}/l{level}/{lesson}`)
  - Merges context across navigation and stores in session storage (`edunancial:ai-learning-context`)
  - Includes language, membership, jurisdiction/country, progress, completed lessons, and certification path
- **Policy/config model:** `src/lib/ai-learning/config.ts`
  - Global enable/disable
  - Track enable/disable
  - Lesson-level disable list
  - Supported jurisdictions
  - Supported languages
  - Public-visitor assistance enable/disable
- **Coach service:** `src/lib/ai-learning/service.ts`
  - Membership-aware behavior (public vs member guidance)
  - Jurisdiction comparison support using `src/lib/ai/country-selection.ts`
  - Existing investment guardrails from `src/lib/ai/guardrails.ts`
  - Educational-not-advice disclaimers for sensitive domains
- **Embedded UX:**
  - Provider: `src/components/ai-learning/AILearningProvider.tsx`
  - Widget: `src/components/ai-learning/AILearningCoachWidget.tsx`
  - Global integration: `src/components/layout/SiteChrome.tsx`
- **API surface:** `src/app/api/ai-learning/respond/route.ts`

## Admin Controls

Admin page: `/admin/ai-learning`

Component: `src/components/admin/AILearningAdministrationPanel.tsx`

Current persistence is browser-local (`localStorage` key: `edunancial:ai-learning-config`) to provide immediate operational control in this repository architecture. For durable multi-admin production persistence, wire this schema to server-side storage (e.g., Supabase).

## Extension Points

- Replace response generator internals in `service.ts` with model provider calls while keeping the same request/response contract.
- Expand `supportedJurisdictions` and country knowledge (`src/lib/ai/country-knowledge.ts`) without changing widget or route plumbing.
- Reuse context model for voice/video/live tutoring, role-play, case studies, and adaptive study planning.

## Safety

- Guardrail policy blocks specific investment picks and redirects to educational framing.
- Sensitive topics include educational-not-advice disclaimers.
- Curriculum context is explicit in every response (`contextSummary`).
