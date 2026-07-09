// Demo log data for the log viewer admin panel
import { type LogEntry, type LogCategory, type LogSeverity } from "./types";

const SERVICES = ["api-gateway", "auth-service", "course-engine", "payment-service", "notification-service", "admin-panel", "background-worker"];
const MESSAGES: Record<LogCategory, string[]> = {
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
  infrastructure: [
    "Server health check passed",
    "High CPU utilization detected on web-01",
    "Disk usage above 80% threshold",
    "Load balancer failover triggered",
    "SSL certificate renewed automatically",
  ],
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDemoLogs(count = 100): LogEntry[] {
  const categories = Object.keys(MESSAGES) as Array<keyof typeof MESSAGES>;
  const severities: LogSeverity[] = ["info", "info", "info", "info", "warning", "warning", "error", "critical"];
  // Demo user IDs — not cryptographically sensitive, used for display only
  const DEMO_USER_IDS = ["usr_001", "usr_002", "usr_003", "usr_004", "usr_005", "usr_006", "usr_007", "usr_008"];
  const DEMO_CORRELATION_IDS = ["req_a1b2c3d4", "req_e5f6g7h8", "req_i9j0k1l2", "req_m3n4o5p6", "req_q7r8s9t0"];
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const category = randomFrom(categories);
    const service = randomFrom(SERVICES);
    const messages = MESSAGES[category];
    const severity = randomFrom(severities);
    const tsMs = now - i * 30_000 - ((i * 7919) % 15_000);
    return {
      id: `log_${i.toString().padStart(6, "0")}`,
      timestamp: new Date(tsMs).toISOString(),
      timestampMs: tsMs,
      severity,
      category,
      service,
      message: randomFrom(messages),
      correlationId: i % 3 === 0 ? randomFrom(DEMO_CORRELATION_IDS) : undefined,
      actor: i % 2 === 0
        ? { userId: DEMO_USER_IDS[i % DEMO_USER_IDS.length], role: randomFrom(["user", "admin", "editor"]) }
        : undefined,
    } satisfies LogEntry;
  });
}
