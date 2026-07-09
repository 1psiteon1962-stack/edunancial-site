import { type LogEntry, type LogFilter, type LogSearchResult, type LogSeverity, type LogCategory, type LogTransport } from "./types";

// ─── Redaction Configuration ──────────────────────────────────────────────────

const REDACT_FIELDS = ["password", "token", "secret", "creditCard", "ssn", "cvv", "pin", "bankAccount"];
const REDACT_PATTERN = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g; // credit card numbers

function redactValue(key: string, value: unknown): [unknown, boolean] {
  if (typeof value === "string") {
    if (REDACT_PATTERN.test(value)) {
      return ["[REDACTED]", true];
    }
  }
  if (REDACT_FIELDS.some((f) => key.toLowerCase().includes(f))) {
    return ["[REDACTED]", true];
  }
  return [value, false];
}

function redactMetadata(meta: Record<string, unknown>): [Record<string, unknown>, string[]] {
  const cleaned: Record<string, unknown> = {};
  const redacted: string[] = [];
  for (const [key, val] of Object.entries(meta)) {
    const [clean, wasRedacted] = redactValue(key, val);
    cleaned[key] = clean;
    if (wasRedacted) redacted.push(key);
  }
  return [cleaned, redacted];
}

// ─── In-Memory Transport (development / demo) ─────────────────────────────────

const MEMORY_LIMIT = 2000;

class MemoryTransport implements LogTransport {
  name = "memory";
  minSeverity: LogSeverity = "debug";
  private entries: LogEntry[] = [];

  async write(entry: LogEntry): Promise<void> {
    this.entries.unshift(entry);
    if (this.entries.length > MEMORY_LIMIT) {
      this.entries = this.entries.slice(0, MEMORY_LIMIT);
    }
  }

  async query(filter: LogFilter): Promise<LogSearchResult> {
    let results = [...this.entries];

    if (filter.from) results = results.filter((e) => e.timestampMs >= filter.from!);
    if (filter.to) results = results.filter((e) => e.timestampMs <= filter.to!);
    if (filter.severity?.length) results = results.filter((e) => filter.severity!.includes(e.severity));
    if (filter.category?.length) results = results.filter((e) => filter.category!.includes(e.category));
    if (filter.service) results = results.filter((e) => e.service.includes(filter.service!));
    if (filter.correlationId) results = results.filter((e) => e.correlationId === filter.correlationId);
    if (filter.actorUserId) results = results.filter((e) => e.actor?.userId === filter.actorUserId);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter((e) => e.message.toLowerCase().includes(q) || e.service.toLowerCase().includes(q));
    }

    const total = results.length;
    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? 50;
    return { entries: results.slice(offset, offset + limit), total, hasMore: offset + limit < total };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

// ─── Console Transport ────────────────────────────────────────────────────────

class ConsoleTransport implements LogTransport {
  name = "console";
  minSeverity: LogSeverity = "info";

  private readonly COLORS: Record<LogSeverity, string> = {
    debug: "\x1b[37m",
    info: "\x1b[36m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    critical: "\x1b[35m",
  };
  private readonly RESET = "\x1b[0m";

  async write(entry: LogEntry): Promise<void> {
    const color = this.COLORS[entry.severity];
    const prefix = `${color}[${entry.severity.toUpperCase()}]${this.RESET}`;
    // eslint-disable-next-line no-console
    console.log(`${prefix} [${entry.timestamp}] [${entry.service}] ${entry.message}`, entry.correlationId ? `(correlationId: ${entry.correlationId})` : "");
  }

  async query(_filter: LogFilter): Promise<LogSearchResult> {
    return { entries: [], total: 0, hasMore: false };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

// ─── Centralized Logger ───────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<LogSeverity, number> = { debug: 0, info: 1, warning: 2, error: 3, critical: 4 };

export class CentralLogger {
  private transports: LogTransport[];

  constructor(transports?: LogTransport[]) {
    this.transports = transports ?? [new MemoryTransport(), new ConsoleTransport()];
  }

  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  private buildEntry(
    severity: LogSeverity,
    category: LogCategory,
    service: string,
    message: string,
    extras: Partial<Omit<LogEntry, "id" | "timestamp" | "timestampMs" | "severity" | "category" | "service" | "message">> = {}
  ): LogEntry {
    const now = new Date();
    const redactedFields: string[] = [];
    let cleanMeta = extras.metadata;
    if (cleanMeta) {
      const [cleaned, redacted] = redactMetadata(cleanMeta);
      cleanMeta = cleaned;
      redactedFields.push(...redacted);
    }

    return {
      id: Math.random().toString(36).slice(2),
      timestamp: now.toISOString(),
      timestampMs: now.getTime(),
      severity,
      category,
      service,
      message,
      ...extras,
      metadata: cleanMeta,
      redacted: redactedFields.length ? redactedFields : undefined,
    };
  }

  async log(
    severity: LogSeverity,
    category: LogCategory,
    service: string,
    message: string,
    extras: Partial<Omit<LogEntry, "id" | "timestamp" | "timestampMs" | "severity" | "category" | "service" | "message">> = {}
  ): Promise<void> {
    const entry = this.buildEntry(severity, category, service, message, extras);
    await Promise.all(
      this.transports
        .filter((t) => SEVERITY_ORDER[entry.severity] >= SEVERITY_ORDER[t.minSeverity])
        .map((t) => t.write(entry).catch(() => void 0))
    );
  }

  async query(filter: LogFilter): Promise<LogSearchResult> {
    // Merge results from the first queryable transport (memory in dev, external in prod)
    for (const t of this.transports) {
      try {
        const result = await t.query(filter);
        if (result.total > 0 || this.transports.indexOf(t) === this.transports.length - 1) {
          return result;
        }
      } catch {
        continue;
      }
    }
    return { entries: [], total: 0, hasMore: false };
  }

  // Convenience methods
  debug(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("debug", "application", service, message, extras);
  }
  info(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("info", "application", service, message, extras);
  }
  warn(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("warning", "application", service, message, extras);
  }
  error(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("error", "application", service, message, extras);
  }
  security(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("warning", "security", service, message, extras);
  }
  auth(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("info", "authentication", service, message, extras);
  }
  payment(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("info", "payment", service, message, extras);
  }
  admin(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("info", "admin_action", service, message, extras);
  }
  apiRequest(service: string, message: string, extras?: Parameters<typeof this.log>[4]) {
    return this.log("info", "api_request", service, message, extras);
  }
}

// ─── Singleton instance ───────────────────────────────────────────────────────

let _logger: CentralLogger | null = null;

export function getLogger(): CentralLogger {
  if (!_logger) _logger = new CentralLogger();
  return _logger;
}

export function configureLogger(transports: LogTransport[]): void {
  _logger = new CentralLogger(transports);
}
