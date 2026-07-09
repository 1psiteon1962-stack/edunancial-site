// ─── Centralized Logging Types ───────────────────────────────────────────────

export type LogSeverity = "debug" | "info" | "warning" | "error" | "critical";

export type LogCategory =
  | "application"
  | "authentication"
  | "admin_action"
  | "security"
  | "payment"
  | "background_process"
  | "api_request"
  | "database"
  | "infrastructure";

export interface LogEntry {
  /** Unique log entry identifier */
  id: string;
  /** ISO-8601 timestamp */
  timestamp: string;
  /** Unix ms timestamp for sorting */
  timestampMs: number;
  severity: LogSeverity;
  category: LogCategory;
  /** Originating service/module */
  service: string;
  /** Human-readable message */
  message: string;
  /** Correlation/request ID for distributed tracing */
  correlationId?: string;
  /** Authenticated user performing the action */
  actor?: LogActor;
  /** Additional structured metadata */
  metadata?: Record<string, unknown>;
  /** HTTP request context, if applicable */
  httpContext?: HttpLogContext;
  /** Error details, if applicable */
  error?: ErrorLogContext;
  /** Data redaction applied */
  redacted?: string[];
}

export interface LogActor {
  userId?: string;
  email?: string; // may be redacted
  role?: string;
  ipAddress?: string; // may be redacted
  userAgent?: string;
}

export interface HttpLogContext {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  requestSize?: number;
  responseSize?: number;
}

export interface ErrorLogContext {
  name: string;
  message: string;
  stack?: string; // may be stripped in production
  code?: string | number;
}

export interface LogFilter {
  from?: number;
  to?: number;
  severity?: LogSeverity[];
  category?: LogCategory[];
  service?: string;
  correlationId?: string;
  search?: string;
  actorUserId?: string;
  limit?: number;
  offset?: number;
}

export interface LogSearchResult {
  entries: LogEntry[];
  total: number;
  hasMore: boolean;
}

// ─── Log Transport Interface (extension point) ────────────────────────────────

export interface LogTransport {
  name: string;
  minSeverity: LogSeverity;
  write(entry: LogEntry): Promise<void>;
  query(filter: LogFilter): Promise<LogSearchResult>;
  healthCheck(): Promise<boolean>;
}

// ─── Retention Policy Hook ─────────────────────────────────────────────────────

export interface RetentionPolicy {
  category: LogCategory;
  retentionDays: number;
  archiveAfterDays?: number;
  requireEncryption: boolean;
}

export const DEFAULT_RETENTION_POLICIES: RetentionPolicy[] = [
  { category: "security", retentionDays: 365, archiveAfterDays: 90, requireEncryption: true },
  { category: "payment", retentionDays: 2555, archiveAfterDays: 365, requireEncryption: true },
  { category: "authentication", retentionDays: 180, archiveAfterDays: 60, requireEncryption: true },
  { category: "admin_action", retentionDays: 365, archiveAfterDays: 90, requireEncryption: false },
  { category: "api_request", retentionDays: 30, requireEncryption: false },
  { category: "application", retentionDays: 14, requireEncryption: false },
  { category: "database", retentionDays: 30, requireEncryption: false },
  { category: "background_process", retentionDays: 14, requireEncryption: false },
  { category: "infrastructure", retentionDays: 90, requireEncryption: false },
];
