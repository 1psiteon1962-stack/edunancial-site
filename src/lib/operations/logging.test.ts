import test from "node:test";
import assert from "node:assert/strict";

import { createStructuredLogEvent, validateStructuredLogEvent } from "@/lib/operations/logging";

test("createStructuredLogEvent redacts sensitive fields", () => {
  const event = createStructuredLogEvent({
    id: "evt-1",
    eventType: "security",
    severity: "critical",
    message: "Security event",
    correlationId: "corr-1",
    timestamp: "2026-07-09T00:00:00.000Z",
    context: {
      password: "secret",
      nested: {
        apiKey: "123",
      },
    },
  });

  assert.equal(event.context.password, "[REDACTED]");
  assert.deepEqual(event.context.nested, { apiKey: "[REDACTED]" });
  assert.deepEqual(event.redactedFields, ["password", "nested.apiKey"]);
  assert.equal(validateStructuredLogEvent(event).valid, true);
});

test("validateStructuredLogEvent reports invalid records", () => {
  const result = validateStructuredLogEvent({
    id: "",
    schemaVersion: "1.0",
    eventType: "application",
    severity: "info",
    message: "",
    correlationId: "",
    timestamp: "invalid",
    context: {},
    redactedFields: [],
  });

  assert.equal(result.valid, false);
  assert.equal(result.issues.length >= 3, true);
});
