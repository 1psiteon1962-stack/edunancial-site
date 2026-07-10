# Enterprise API Platform

This document describes the API platform, authentication, webhooks, integration hub, and observability infrastructure built into Edunancial.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Conventions](#api-conventions)
3. [Authentication](#authentication)
4. [Rate Limiting](#rate-limiting)
5. [Webhooks](#webhooks)
6. [Integration Hub](#integration-hub)
7. [Monitoring & Observability](#monitoring--observability)
8. [Developer Portal](#developer-portal)
9. [Environment Variables](#environment-variables)
10. [Local Development](#local-development)

---

## Architecture Overview

```
src/
├── lib/
│   ├── api/              Core API utilities (responses, errors, pagination, rate limiting, validation)
│   ├── auth/             JWT, API keys, RBAC, token store, service accounts, OAuth
│   ├── integrations/     Provider adapters (Stripe, PayPal, GA, email, SMS, AI, CRM, …)
│   ├── webhooks/         Incoming/outgoing webhook framework
│   └── monitoring/       Structured logging, analytics hooks, audit logging
└── app/
    ├── api/
    │   ├── v1/           Versioned REST API routes
    │   └── v2/           Forward-compatible v2 routes
    └── developer/        Developer portal pages
```

The API follows an **API-first, domain-driven** design. Transport (HTTP routes) is separated from domain logic (lib/) enabling future GraphQL compatibility by swapping transport without touching domain code.

---

## API Conventions

### Versioning

All routes are prefixed: `/api/v1/`, `/api/v2/`

v1 is the current stable version. v2 is forward-compatible.

### Response Envelope

**Success**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1"
  }
}
```

**Error**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [ ... ]
  },
  "meta": { "timestamp": "..." }
}
```

### Pagination

| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | `1` | Page number |
| `per_page` | `20` | Items per page (max 100) |
| `sort` | — | `field:asc` or `field:desc`, comma-separated |
| `filter[field]` | — | Field-level filtering |

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Malformed request |
| `UNAUTHORIZED` | 401 | Missing or invalid credentials |
| `TOKEN_EXPIRED` | 401 | JWT has expired |
| `TOKEN_REVOKED` | 401 | Token has been revoked |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Input validation failed |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |
| `INVALID_SIGNATURE` | 401 | Webhook signature mismatch |
| `REPLAY_DETECTED` | 400 | Duplicate webhook event |

---

## Authentication

### JWT Tokens

```bash
# Issue tokens
curl -X POST /api/v1/auth/token \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ek_test_..." \
  -d '{"grant_type":"api_key"}'

# Use token
curl /api/v1/... \
  -H "Authorization: ******"

# Refresh
curl -X POST /api/v1/auth/refresh \
  -d '{"refresh_token":"<refresh_token>"}'

# Revoke
curl -X POST /api/v1/auth/revoke \
  -H "Authorization: ******"
```

- Access token TTL: `JWT_ACCESS_TTL_S` (default: 900 seconds / 15 min)
- Refresh token TTL: `JWT_REFRESH_TTL_S` (default: 604800 seconds / 7 days)

### API Keys

Pass via `X-API-Key` header or `?api_key=` query param.

Keys are prefixed: `ek_live_` (production) or `ek_test_` (test/sandbox).

### Roles

| Role | Rank | Description |
|------|------|-------------|
| `super_admin` | 100 | Full platform access |
| `admin` | 80 | User and content management |
| `staff` | 60 | Content editing |
| `instructor` | 40 | Course management |
| `member` | 20 | Enrolled user |
| `guest` | 0 | Unauthenticated |

### Scopes

Scopes follow `resource:action`. Use `resource:*` for all actions.

- `courses:read`, `courses:write`, `courses:delete`
- `billing:read`, `billing:write`
- `users:read`, `users:write`
- `webhooks:write`
- `admin:*`

### OAuth 2.0 (Readiness)

OAuth 2.0 infrastructure is in place (`src/lib/auth/oauth.ts`). Full provider setup is deferred. Supported grant types when enabled: `authorization_code` (with PKCE), `refresh_token`, `client_credentials`.

---

## Rate Limiting

Rate limits apply per IP. Response headers report current status.

| Group | Limit | Window |
|-------|-------|--------|
| API | 120 | 1 minute |
| Auth | 10 | 1 minute |
| Webhooks | 200 | 1 minute |
| Public | 30 | 1 minute |

Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

The rate limiter uses an in-memory sliding window by default. **Replace with a Redis adapter** in multi-instance production by calling `setRateLimitStore(redisAdapter)` at startup.

---

## Webhooks

### Incoming Webhooks

**Endpoint:** `POST /api/v1/webhooks/incoming`

Signature header format: `X-Webhook-Signature: t=<timestamp>,v1=<hmac_sha256>`

Replay protection: events are deduplicated by `id` for 24 hours.

Timestamp tolerance: ±5 minutes.

```bash
# Build the signature header (see src/lib/webhooks/validator.ts)
# Then POST:
curl -X POST /api/v1/webhooks/incoming \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: t=1234567890,v1=abc123..." \
  -d '{
    "id": "evt_unique_id",
    "timestamp": "2024-01-01T00:00:00Z",
    "type": "payment.succeeded",
    "data": { ... }
  }'
```

### Outgoing Webhooks

**Endpoint:** `POST /api/v1/webhooks/outgoing` (requires `admin` role or `webhooks:write` scope)

Register subscriptions with `registerWebhookSubscription()` from `src/lib/webhooks/dispatcher.ts`.

Delivery includes 3 retry attempts with exponential back-off (1s, 2s, 4s).

### Event Types

| Category | Events |
|----------|--------|
| Membership | `membership.created`, `.updated`, `.cancelled`, `.expired` |
| Billing | `billing.invoice.*`, `billing.subscription.*` |
| Payment | `payment.succeeded`, `.failed`, `.refunded` |
| Course | `course.enrolled`, `.completed`, `.progress.updated` |
| Certificate | `certificate.generated`, `.revoked` |
| Admin | `admin.user.*`, `admin.role.changed` |
| Notification | `notification.sent`, `.failed` |

---

## Integration Hub

Provider adapters live in `src/lib/integrations/`. All providers implement a common interface so implementations can be swapped without changing consumers.

| Provider | Module | Env Prefix |
|----------|--------|------------|
| Stripe | `integrations/stripe` | `STRIPE_` |
| PayPal | `integrations/paypal` | `PAYPAL_` |
| Google Analytics | `integrations/analytics` | `GA4_` |
| Google Search Console | `integrations/analytics` | `GSC_` |
| Microsoft Clarity | `integrations/analytics` | `CLARITY_` |
| Email (SendGrid/Resend) | `integrations/email` | `SENDGRID_` / `RESEND_` |
| SMS (Twilio) | `integrations/sms` | `TWILIO_` |
| AI (OpenAI/Anthropic) | `integrations/ai` | `OPENAI_` / `ANTHROPIC_` |
| CRM (HubSpot) | `integrations/crm` | `HUBSPOT_` |
| Accounting (QuickBooks) | `integrations/accounting` | `QUICKBOOKS_` |
| Learning (Teachable) | `integrations/learning` | `TEACHABLE_` |

When a provider's environment variables are absent, a console-stub adapter is used automatically (safe for development).

**Usage:**
```typescript
import { integrations } from "@/lib/integrations";

// Payment
await integrations.payment.stripe.createPaymentIntent({ amount: 4999, currency: "usd" });

// Email
await integrations.email.send({ to: "user@example.com", subject: "Welcome!", html: "<p>Hi!</p>" });

// AI
const result = await integrations.ai.complete({ prompt: "Explain compound interest" });
```

---

## Monitoring & Observability

### Structured Logging

All logs are emitted as JSON (`src/lib/monitoring/logger.ts`).

```typescript
import { logger } from "@/lib/monitoring/logger";
logger.info("payment.processed", { amount: 4999, userId: "u_123" });
```

Set `LOG_LEVEL=debug|info|warn|error` (default: `info`).

### API Analytics

Request metrics are recorded automatically. Add custom sinks:

```typescript
import { addMetricsSink } from "@/lib/monitoring/analytics";
addMetricsSink({ record: (metric) => sendToDatadog(metric) });
```

Get in-process stats for the health endpoint: `getEndpointStats()`.

### Audit Logging

Security-relevant events are audit-logged:

```typescript
import { audit } from "@/lib/monitoring/audit";
audit("payment.completed", { actorId: userId, result: "success", metadata: { amount } });
```

Add audit sinks for SIEM/compliance systems:
```typescript
import { addAuditSink } from "@/lib/monitoring/audit";
addAuditSink({ log: (entry) => writeToComplianceStore(entry) });
```

---

## Developer Portal

Routes under `/developer/`:

| Route | Description |
|-------|-------------|
| `/developer` | Portal landing page |
| `/developer/docs` | API reference |
| `/developer/auth` | Authentication guide |
| `/developer/changelog` | API changelog |
| `/developer/sandbox` | Sandbox environment guide |
| `/developer/sdks` | SDK downloads |

---

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ | JWT signing secret (≥32 chars) |
| `API_KEY_SECRET` | ✅ | API key hashing secret |
| `WEBHOOK_INCOMING_SECRET` | ✅ | Shared secret for webhook signature validation |
| `STRIPE_SECRET_KEY` | Payment | Stripe secret key |
| `EMAIL_PROVIDER` | Email | `sendgrid` \| `resend` |
| `AI_PROVIDER` | AI | `openai` \| `anthropic` |

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env
cp .env.example .env.local
# Fill in at minimum: JWT_SECRET, API_KEY_SECRET, WEBHOOK_INCOMING_SECRET

# Start dev server
npm run dev

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build
```

Test the health endpoint:
```bash
curl http://localhost:3000/api/v1/health
```
