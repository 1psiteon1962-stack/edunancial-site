import { LogQuery, StructuredLogEvent } from "@/lib/operations/types";

const REDACTION_PATTERN = /(password|token|secret|authorization|cookie|card|cvv|ssn|api[-_]?key)/i;

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }

  if (value && typeof value === "object") {
    return sanitizeContext(value as Record<string, unknown>).context;
  }

  return value;
}

export function sanitizeContext(input: Record<string, unknown>, path = "") {
  const redactedFields: string[] = [];
  const context = Object.entries(input).reduce<Record<string, unknown>>((accumulator, [key, value]) => {
    const nextPath = path ? `${path}.${key}` : key;

    if (REDACTION_PATTERN.test(key)) {
      redactedFields.push(nextPath);
      accumulator[key] = "[REDACTED]";
      return accumulator;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = sanitizeContext(value as Record<string, unknown>, nextPath);
      redactedFields.push(...nested.redactedFields);
      accumulator[key] = nested.context;
      return accumulator;
    }

    accumulator[key] = redactValue(value);
    return accumulator;
  }, {});

  return { context, redactedFields };
}

export function createStructuredLogEvent(
  input: Omit<StructuredLogEvent, "schemaVersion" | "redactedFields" | "context"> & {
    context?: Record<string, unknown>;
  },
): StructuredLogEvent {
  const { context, redactedFields } = sanitizeContext(input.context ?? {});

  return {
    ...input,
    schemaVersion: "1.0",
    context,
    redactedFields,
  };
}

export function validateStructuredLogEvent(event: StructuredLogEvent) {
  const issues: string[] = [];

  if (!event.id) {
    issues.push("Missing event id.");
  }

  if (!event.message) {
    issues.push("Missing log message.");
  }

  if (!event.correlationId) {
    issues.push("Missing correlation id.");
  }

  if (!event.timestamp || Number.isNaN(Date.parse(event.timestamp))) {
    issues.push("Invalid timestamp.");
  }

  if (event.schemaVersion !== "1.0") {
    issues.push("Unsupported schema version.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function filterStructuredLogs(events: StructuredLogEvent[], query: LogQuery) {
  const normalizedQuery = query.query?.trim().toLowerCase();

  return events.filter((event) => {
    const matchesSeverity = !query.severity || query.severity === "all" || event.severity === query.severity;
    const matchesEventType = !query.eventType || query.eventType === "all" || event.eventType === query.eventType;
    const matchesText = !normalizedQuery
      || event.message.toLowerCase().includes(normalizedQuery)
      || event.correlationId.toLowerCase().includes(normalizedQuery)
      || JSON.stringify(event.context).toLowerCase().includes(normalizedQuery);

    return matchesSeverity && matchesEventType && matchesText;
  });
}
