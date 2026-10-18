import assert from "node:assert/strict";
import test from "node:test";

import { persistWithFallbacks, type KpiSpoolStore } from "./spool";

const row = { event_name: "page_view", path: "/courses", ip_hash: "abc" };
const fail = (message: string) => async () => { throw new Error(message); };
const memoryStore = () => {
  const saved = new Map<string, unknown>();
  const store: KpiSpoolStore = { async setJSON(key, value) { saved.set(key, value); } };
  return { saved, store };
};
const quiet = () => {};

test("primary success writes nowhere else", async () => {
  const { saved, store } = memoryStore();
  let fallbackCalls = 0;
  const out = await persistWithFallbacks(row, { primary: async () => ({ id: 1 }), fallback: async () => { fallbackCalls++; }, spool: () => store, log: quiet });
  assert.deepEqual(out, { stored: "primary", result: { id: 1 } });
  assert.equal(fallbackCalls, 0);
  assert.equal(saved.size, 0);
});

test("legacy fallback is used when primary fails", async () => {
  const { saved, store } = memoryStore();
  const out = await persistWithFallbacks(row, { primary: fail('relation "kpi_events" does not exist'), fallback: async () => {}, spool: () => store, log: quiet });
  assert.deepEqual(out, { stored: "fallback" });
  assert.equal(saved.size, 0);
});

test("event is spooled durably, not discarded, when both databases fail (current production case)", async () => {
  const { saved, store } = memoryStore();
  const out = await persistWithFallbacks(row, {
    primary: fail('relation "kpi_events" does not exist'),
    fallback: fail("legacy store unavailable"),
    spool: () => store,
    now: () => new Date("2026-10-18T00:51:00.000Z"),
    log: quiet,
  });
  assert.equal(out.stored, "spool");
  assert.equal(saved.size, 1);
  const [key, value] = [...saved.entries()][0] as [string, { row: unknown; failures: { primary: string; fallback: string }; spooledAt: string }];
  assert.match(key, /^pending\/2026-10-18\/2026-10-18T00:51:00\.000Z-[0-9a-f-]{36}\.json$/);
  assert.deepEqual(value.row, row, "the full event row is preserved for replay");
  assert.match(value.failures.primary, /kpi_events/);
  assert.equal(value.spooledAt, "2026-10-18T00:51:00.000Z");
});

test("spooled keys never collide for simultaneous events", async () => {
  const { saved, store } = memoryStore();
  const deps = { primary: fail("x"), fallback: fail("y"), spool: () => store, now: () => new Date("2026-10-18T00:00:00.000Z"), log: quiet };
  await Promise.all(Array.from({ length: 20 }, () => persistWithFallbacks(row, deps)));
  assert.equal(saved.size, 20);
});

test("still fails loudly when the spool is also unavailable (no silent loss)", async () => {
  const brokenStore: KpiSpoolStore = { async setJSON() { throw new Error("blobs down"); } };
  await assert.rejects(
    persistWithFallbacks(row, { primary: fail("x"), fallback: fail("y"), spool: () => brokenStore, log: quiet }),
    /primary, fallback and spool/,
  );
});
