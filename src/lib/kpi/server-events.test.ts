import assert from "node:assert/strict";
import test from "node:test";

import { buildServerKpiRow } from "@/lib/kpi/server-events";

test("server KPI row: idempotency key, business date, trusted country only", () => {
  const row = buildServerKpiRow({
    eventName: "signup",
    replayKey: "signup:user-1",
    userId: "user-1",
    occurredAt: "2026-10-01T12:00:00Z",
    countryCode: "DO",
    countrySource: "netlify-geo",
    metadata: { account_country: "Dominican Republic" },
  });
  assert.equal(row.replay_key, "signup:user-1");
  assert.equal(row.created_at, "2026-10-01T12:00:00.000Z");
  assert.equal(row.event_name, "signup");
  assert.equal(row.metadata.visitor_country_code, "DO");
  assert.equal(row.metadata.source, "server");
  assert.equal(row.metadata.account_country, "Dominican Republic");
});

test("server KPI row: invalid country code and date are not trusted", () => {
  const row = buildServerKpiRow({ eventName: "lesson_complete", replayKey: "k", userId: "u", occurredAt: "not-a-date", countryCode: "Dominican" });
  assert.equal(row.metadata.visitor_country_code, undefined);
  assert.ok(Date.parse(row.created_at) > Date.parse("2026-01-01"));
});
