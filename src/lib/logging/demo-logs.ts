// Demo log data for the log viewer admin panel
import { type LogEntry } from "./types";

const SERVICES = ["api-gateway", "auth-service", "course-engine", "payment-service", "notification-service", "admin-panel", "background-worker"];
const MESSAGES: Record<string, string[]> = {
  authentication: [
    "User login succeeded",
    "User login failed — invalid credentials",
    "Password reset requested",
    "Session expired",
    "MFA verification passed",
    "Account locked after 5 failed attempts",
  ],
  security: [
    "Suspicious login from new geolocation",
    "Rate limit exceeded on /api/auth/login",
    "SQL injection attempt blocked",
    "CSRF token validation failed",
    "Unauthorized admin area access attempt",
  ],
  payment: [
    "Payment processed successfully",
    "Payment declined — insufficient funds",
    "Subscription renewed",
    "Refund issued",
    "Webhook received from payment provider",
  ],
  api_request: [
    "GET /api/courses — 200 OK",
    "POST /api/auth/login — 200 OK",
    "GET /api/users/profile — 200 OK",
    "POST /api/payments — 201 Created",
    "GET /api/courses — 429 Too Many Requests",
    "DELETE /api/admin/users/:id — 403 Forbidden",
  ],
  admin_action: [
    "Admin exported user data",
    "Course published by editor",
    "System settings updated",
    "User account suspended",
    "Bulk email campaign launched",
  ],
  application: [
    "Application started successfully",
    "Configuration reloaded",
    "Feature flag updated",
    "Cache invalidated",
    "Memory threshold warning",
  ],
  database: [
    "Slow query detected: 720ms",
    "Connection pool near capacity",
    "Replication lag increased to 45ms",
    "Database backup completed",
    "Index rebuild scheduled",
  ],
  background_process: [
    "Daily backup completed",
    "Sitemap regeneration started",
    "Email digest dispatched",
    "Analytics rollup failed — retrying",
    "Cache warmup completed",
  ],
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDemoLogs(count = 100): LogEntry[] {
  const categories = Object.keys(MESSAGES) as Array<keyof typeof MESSAGES>;
  const severities: LogSeverity[] = ["info", "info", "info", "info", "warning", "warning", "error", "critical"];
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const category = randomFrom(categories);
    const service = randomFrom(SERVICES);
    const messages = MESSAGES[category];
    const severity = randomFrom(severities);
    const tsMs = now - i * 30_000 - Math.floor(Math.random() * 15_000);
    return {
      id: Math.random().toString(36).slice(2),
      timestamp: new Date(tsMs).toISOString(),
      timestampMs: tsMs,
      severity,
      category,
      service,
      message: randomFrom(messages),
      correlationId: Math.random() > 0.7 ? Math.random().toString(36).slice(2, 10) : undefined,
      actor: Math.random() > 0.5
        ? { userId: `usr_${Math.random().toString(36).slice(2, 8)}`, role: randomFrom(["user", "admin", "editor"]) }
        : undefined,
    } satisfies LogEntry;
  });
}
