# Enterprise Workflow Automation Engine

This document describes the architecture, configuration, and usage of the Edunancial workflow automation platform.

---

## Overview

The workflow automation engine enables administrators to build, publish, and monitor business process automations without writing code. It supports:

- **Event-driven processing** — workflows respond to platform events
- **Multi-step orchestration** — chains of actions with branching, delays, and approvals
- **Retry logic** — configurable exponential backoff per node
- **Parallel execution** — fan-out branches run concurrently
- **Idempotent execution** — duplicate events do not re-trigger completed workflows
- **Visual workflow builder** — drag-and-drop interface at `/admin/workflows/builder`
- **Administration console** — monitoring, queue, history, statistics, and audit trail

---

## Architecture

```
src/
  lib/
    workflow/
      workflowTypes.ts        # All type definitions and schema
      workflowEngine.ts       # Execution orchestrator / state machine
      workflowStore.ts        # In-memory store (replace with DB in production)
      workflowQueue.ts        # Queue-backed processing
      workflowValidator.ts    # Server-side validation
      triggerRegistry.ts      # Event trigger registry and dispatcher
      actionRegistry.ts       # Action executor registry
      aiIntegration.ts        # AI provider-agnostic interfaces
      index.ts                # Public API
      triggers/
        memberTriggers.ts     # member.registered, login, membership events
        paymentTriggers.ts    # payment.received, payment.failed
        courseTriggers.ts     # course.enrolled, completed, certificate, blog
        adminTriggers.ts      # admin.action, schedule.cron, manual
      actions/
        emailAction.ts        # send_email
        notificationAction.ts # send_notification
        memberAction.ts       # update_member
        achievementAction.ts  # award_achievement
        certificateAction.ts  # generate_certificate
        reminderAction.ts     # schedule_reminder
        apiCallAction.ts      # call_api (with SSRF protection)
        webhookAction.ts      # trigger_webhook (HMAC signed)
        auditLogAction.ts     # write_audit_log
        adminTaskAction.ts    # create_admin_task
  app/
    admin/workflows/
      page.tsx                # Active workflows list
      builder/page.tsx        # Visual workflow builder
      queue/page.tsx          # Processing queue
      failed/page.tsx         # Failed executions
      history/page.tsx        # Execution history
      statistics/page.tsx     # Performance statistics
      audit/page.tsx          # Audit trail
    api/workflows/
      route.ts                # GET list, POST create
      [id]/route.ts           # GET, PATCH, DELETE
      [id]/publish/route.ts   # POST publish, DELETE unpublish
      [id]/execute/route.ts   # POST manual execute
      executions/route.ts     # GET list executions
      executions/[id]/route.ts # GET execution, POST (retry/cancel/approve)
      dispatch/route.ts       # POST dispatch trigger event
      stats/route.ts          # GET statistics
```

---

## Workflow Definition Schema

A workflow is described as a directed graph with **nodes** and **edges**.

### Workflow

```json
{
  "id": "wf_...",
  "version": 1,
  "name": "Welcome New Member",
  "description": "...",
  "status": "published",
  "triggerEvent": "member.registered",
  "nodes": [...],
  "edges": [...],
  "tags": ["onboarding"],
  "createdBy": "admin",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Node types

| Type | Description |
|------|-------------|
| `trigger` | Entry point — fires when `triggerEvent` occurs |
| `action` | Executes an action (email, webhook, etc.) |
| `condition` | Evaluates an expression, branches on true/false |
| `delay` | Waits a specified duration before continuing |
| `parallel` | Fan-out: all outgoing edges execute simultaneously |
| `approval` | Pauses execution until approved or rejected by a role |
| `end` | Terminal node |

### Condition expressions

Condition nodes support simple expressions with `{{triggerPayload.field}}` substitution:

```
{{triggerPayload.amount}} > 100
{{triggerPayload.plan}} === "premium"
```

---

## Supported Triggers

| Event | Description |
|-------|-------------|
| `member.registered` | New member registration |
| `member.login` | Member login |
| `membership.upgraded` | Plan upgrade |
| `membership.cancelled` | Cancellation |
| `payment.received` | Successful payment |
| `payment.failed` | Failed payment attempt |
| `course.enrolled` | Course enrollment |
| `course.completed` | Course completion |
| `certificate.earned` | Certificate earned |
| `support.ticket_created` | Support ticket opened |
| `blog.published` | Blog post published |
| `admin.action` | Administrative action |
| `schedule.cron` | Scheduled (cron-based) trigger |
| `manual` | Administrator-initiated manual trigger |

---

## Supported Actions

| Action | Description |
|--------|-------------|
| `send_email` | Send email via configured provider |
| `send_notification` | In-app notification |
| `update_member` | Update member record fields |
| `award_achievement` | Award badge/achievement |
| `generate_certificate` | Generate and deliver certificate |
| `schedule_reminder` | Schedule future reminder |
| `call_api` | HTTP call to external API (with SSRF protection) |
| `trigger_webhook` | POST signed webhook to endpoint |
| `write_audit_log` | Append to audit log |
| `create_admin_task` | Create an administrative task |

---

## API Reference

### Workflows

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/workflows` | List all workflows |
| `POST` | `/api/workflows` | Create new workflow (draft) |
| `GET` | `/api/workflows/:id` | Get workflow by ID |
| `PATCH` | `/api/workflows/:id` | Update workflow |
| `DELETE` | `/api/workflows/:id` | Delete draft workflow |
| `POST` | `/api/workflows/:id/publish` | Validate and publish |
| `DELETE` | `/api/workflows/:id/publish` | Unpublish (back to draft) |
| `POST` | `/api/workflows/:id/execute` | Manual execution trigger |

### Executions

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/workflows/executions` | List executions (filter by `workflowId`, `status`) |
| `GET` | `/api/workflows/executions/:id` | Get execution details |
| `POST` | `/api/workflows/executions/:id` | Operational control (retry/cancel/approve/reject) |

### Events & Stats

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/workflows/dispatch` | Dispatch a trigger event |
| `GET` | `/api/workflows/stats` | Execution statistics |

---

## Dispatching Events

To trigger workflows from application code:

```typescript
await fetch('/api/workflows/dispatch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eventType: 'member.registered',
    actorId: userId,
    entityType: 'member',
    entityId: userId,
    data: { userId, email, name, plan },
  }),
});
```

---

## Extending the Engine

### Adding a new trigger

1. Create a handler in `src/lib/workflow/triggers/yourTrigger.ts`
2. Export it in the appropriate trigger file
3. Import and register it in `src/lib/workflow/triggerRegistry.ts`

### Adding a new action

1. Create an executor in `src/lib/workflow/actions/yourAction.ts`
2. Export `yourActionExecutor` implementing the `ActionExecutor` interface
3. Import and register it in `src/lib/workflow/actionRegistry.ts`

---

## AI Integration

Implement the `AIWorkflowProvider` interface from `src/lib/workflow/aiIntegration.ts` with your chosen AI provider, then call:

```typescript
import { setAIWorkflowProvider } from '@/lib/workflow';
setAIWorkflowProvider(new OpenAIWorkflowProvider({ apiKey: process.env.OPENAI_API_KEY }));
```

This enables:
- **Workflow recommendations** — suggest workflows based on activity
- **Optimization suggestions** — identify inefficiencies
- **Natural language workflow creation** — describe → auto-generate
- **Predictive automation** — anticipate trigger events

---

## Environment Variables

Add these to `.env.local` as needed:

```env
# Webhook signing (optional — set per workflow in node config)
WORKFLOW_WEBHOOK_SECRET=

# Email provider credentials (consumed by send_email action)
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=

# AI provider (for future AI integration)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

---

## Production Considerations

The current implementation uses an **in-memory store** suitable for development and preview. For production:

1. **Replace `workflowStore`** with a persistent database (Supabase, PostgreSQL)
2. **Replace `workflowQueue`** with a managed queue (Redis BullMQ, AWS SQS, Inngest)
3. **Schedule cron triggers** via a cron service or Vercel Cron Jobs
4. **Secure API routes** with authentication middleware
5. **Add distributed tracing** for execution observability (OpenTelemetry)

---

## Administration

Navigate to `/admin/workflows` to:

- View all workflows and their status
- Create new workflows in the visual builder
- Monitor the processing queue
- Investigate failed executions
- Review execution history
- Analyse performance statistics
- Browse the audit trail
