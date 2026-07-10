import { activeLogLevel, LogLevel, shouldLog } from "@/lib/observability/config";

const REDACTED_VALUE = "[REDACTED]";
const SENSITIVE_KEY_PATTERN = /(pass(word)?|secret|token|authorization|cookie|key)/i;

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (typeof value === "object") {
    return sanitizeContext(value as Record<string, unknown>);
  }

  return value;
}

function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, item] of Object.entries(context)) {
    sanitized[key] = SENSITIVE_KEY_PATTERN.test(key)
      ? REDACTED_VALUE
      : sanitizeValue(item);
  }

  return sanitized;
}

function write(level: LogLevel, message: string, context: Record<string, unknown> = {}) {
  if (!shouldLog(level, activeLogLevel)) {
    return;
  }

  const payload: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
    environment: process.env.NODE_ENV ?? "development",
    ...sanitizeContext(context),
  };

  const serialized = JSON.stringify(payload);

  if (level === "debug" || level === "info") {
    console.log(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.error(serialized);
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    write("debug", message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    write("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    write("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    write("error", message, context),
};
