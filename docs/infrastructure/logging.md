# Centralized Logging Standards

## Log Entry Schema

Every log entry conforms to `LogEntry` (defined in `src/lib/logging/types.ts`):

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✓ | Unique entry identifier |
| `timestamp` | string (ISO-8601) | ✓ | Wall-clock timestamp |
| `timestampMs` | number | ✓ | Unix ms — for fast sorting/range queries |
| `severity` | `debug\|info\|warning\|error\|critical` | ✓ | Log level |
| `category` | enum (see below) | ✓ | Domain classification |
| `service` | string | ✓ | Originating service/module |
| `message` | string | ✓ | Human-readable description |
| `correlationId` | string | — | Request / distributed trace ID |
| `actor` | LogActor | — | Authenticated user performing the action |
| `httpContext` | HttpLogContext | — | HTTP method, path, status, duration |
| `error` | ErrorLogContext | — | Error name, message, code |
| `metadata` | Record<string, unknown> | — | Structured contextual data |
| `redacted` | string[] | — | Fields that were automatically redacted |

## Log Categories

| Category | Description | Retention |
|---|---|---|
| `application` | General application events | 14 days |
| `authentication` | Login, logout, MFA, session events | 180 days |
| `admin_action` | Admin panel actions | 365 days |
| `security` | WAF, IDS, anomaly detection, access control | 365 days (archived after 90d) |
| `payment` | Payment processing, refunds, subscriptions | 7 years (2555 days) |
| `background_process` | Job execution, queue events | 14 days |
| `api_request` | HTTP request/response telemetry | 30 days |
| `database` | Query errors, slow queries, pool events | 30 days |
| `infrastructure` | Server events, deployment, scaling | 90 days |

## Privacy & Redaction

The logger automatically redacts:
- Any field whose key contains: `password`, `token`, `secret`, `creditCard`, `ssn`, `cvv`, `pin`, `bankAccount`
- Any string value matching a credit card pattern (`/\b(?:\d{4}[-\s]?){3}\d{4}\b/g`)

Redacted fields are replaced with `"[REDACTED]"` and the field names are listed in the `redacted` array on the entry.

## Using the Logger

```typescript
import { getLogger } from '@/lib/logging';

const logger = getLogger();

// General application log
await logger.info('course-engine', 'Course published', { courseId: 'c_123' });

// Authentication event
await logger.auth('auth-service', 'User login succeeded', {
  actor: { userId: 'usr_456', role: 'user' },
  httpContext: { method: 'POST', path: '/api/auth/login', statusCode: 200, durationMs: 45 },
  correlationId: 'req_abc123',
});

// Security event
await logger.security('auth-service', 'Account locked after failed attempts', {
  actor: { userId: 'usr_789', ipAddress: '192.168.1.42' },
  metadata: { failedAttempts: 5 },
});

// Payment event
await logger.payment('payment-service', 'Payment processed', {
  metadata: { amount: 9900, currency: 'USD', last4: '4242' },
});

// Admin action
await logger.admin('admin-panel', 'User account suspended', {
  actor: { userId: 'admin_001', role: 'admin' },
  metadata: { targetUserId: 'usr_999', reason: 'Terms violation' },
});
```

## Configuring Production Transports

Implement `LogTransport` to write logs to your chosen backend:

```typescript
import { configureLogger } from '@/lib/logging';
import type { LogTransport, LogEntry, LogFilter, LogSearchResult } from '@/lib/logging';

class OpenSearchTransport implements LogTransport {
  name = 'opensearch';
  minSeverity = 'info' as const;

  async write(entry: LogEntry): Promise<void> {
    // POST to OpenSearch index
  }

  async query(filter: LogFilter): Promise<LogSearchResult> {
    // Query OpenSearch with filter
  }

  async healthCheck(): Promise<boolean> {
    // Ping OpenSearch
  }
}

configureLogger([new OpenSearchTransport()]);
```

## Log Viewer

The admin log viewer is available at `/admin/logs`. It supports:
- Filtering by severity level
- Filtering by category
- Filtering by service
- Free-text search on message content
- Pagination via `?limit=50&offset=0`
- Server-side filtering via `/api/monitoring/logs` query parameters

## Retention Policy

Retention policies are defined in `src/lib/logging/types.ts` as `DEFAULT_RETENTION_POLICIES`. These define maximum retention days and whether archival or encryption is required per category. Enforcing these requires a background job that periodically calls your transport's purge/archive API.
