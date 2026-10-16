import test from "node:test";
import assert from "node:assert/strict";
import handler, { config, localesForMinute, REQUEST_TIMEOUT_MS } from "../../../netlify/functions/catalog-warmer.mts";

const ALL = ["en-US","en-GB","es-419","es-Caribbean","es-ES","fr-CA","fr-FR","pt-BR","pt-PT","de","it","nl","ht"];
const MIN = 60_000;
function requestFor(next) {
  return new Request("https://example.test", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ next_run: new Date(next).toISOString() }),
  });
}

test("runs once per minute and preserves all locales without duplicates", () => {
  assert.equal(config.schedule, "* * * * *");
  for (const offset of [0, 1, 59, 1439, 1440, 100000]) {
    const first = Date.parse("2026-10-16T00:00:00Z") + offset * MIN;
    const batches = Array.from({ length: 5 }, (_, i) => localesForMinute(first + i * MIN));
    assert.deepEqual(batches.map((b) => b.length).sort(), [1, 3, 3, 3, 3]);
    assert.deepEqual(new Set(batches.flat()), new Set(ALL));
    assert.equal(batches.flat().length, 13);
  }
});

test("returns fresh locale arrays", () => {
  localesForMinute(0).push("BAD");
  assert.deepEqual(localesForMinute(0), ALL.slice(0, 3));
});

test("late invocation uses Netlify's next_run instead of wall clock", async () => {
  const previousFetch = globalThis.fetch;
  const previousNow = Date.now;
  const seen = [];
  globalThis.fetch = async (url) => {
    seen.push(new URL(url).searchParams.get("lang"));
    return { status: 200, ok: true, arrayBuffer: async () => new ArrayBuffer(0) };
  };
  Date.now = () => Date.parse("2026-10-16T10:22:00Z");
  try {
    const next = Date.parse("2026-10-16T09:07:00Z");
    const response = await handler(requestFor(next));
    assert.equal(response.status, 200);
    assert.deepEqual(seen, localesForMinute(next - MIN));
    assert.deepEqual(await response.json(), { checked: seen.length, succeeded: seen.length, failed: [] });
  } finally { globalThis.fetch = previousFetch; Date.now = previousNow; }
});

test("never starts more than three concurrent public GETs", async () => {
  const previousFetch = globalThis.fetch;
  const pending = [];
  let active = 0, peak = 0;
  globalThis.fetch = async () => {
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => pending.push(resolve));
    active--;
    return { status: 200, ok: true, arrayBuffer: async () => new ArrayBuffer(0) };
  };
  try {
    const p = handler(requestFor(Date.parse("2026-10-16T09:01:00Z")));
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(pending.length, 3);
    assert.equal(peak, 3);
    pending.forEach((resolve) => resolve());
    assert.equal((await (await p).json()).succeeded, 3);
  } finally { globalThis.fetch = previousFetch; }
});

test("reports failed locale without aborting other read-only requests", async () => {
  const previousFetch = globalThis.fetch;
  const chosen = localesForMinute(Date.parse("2026-10-16T09:00:00Z"));
  let called = 0;
  globalThis.fetch = async (url, opts) => {
    called++;
    assert.equal(new URL(url).pathname, "/api/public/curriculum/catalog");
    assert.ok(String(url).startsWith("https://edunancial.com/"));
    assert.equal(opts.cache, "no-store");
    assert.ok(opts.signal instanceof AbortSignal);
    if (new URL(url).searchParams.get("lang") === chosen[1]) throw Error("simulated read failure");
    return { status: 200, ok: true, arrayBuffer: async () => new ArrayBuffer(0) };
  };
  try {
    const outcome = await (await handler(requestFor(Date.parse("2026-10-16T09:01:00Z")))).json();
    assert.equal(called, 3);
    assert.deepEqual(outcome, { checked: 3, succeeded: 2, failed: [chosen[1]] });
  } finally { globalThis.fetch = previousFetch; }
});


test("scheduled locale request budget leaves headroom", () => {
  assert.equal(REQUEST_TIMEOUT_MS, 12_500);
  assert.ok(REQUEST_TIMEOUT_MS < 15_000);
});

test("warmer locales match selectable language registry", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync(new URL("../../../src/lib/international/languages.ts", import.meta.url), "utf8");
  const registry = [...source.matchAll(/code:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(registry.length >= 13);
  const start = Date.parse("2026-10-16T00:00:00Z");
  const covered = Array.from({ length: 5 }, (_, i) => localesForMinute(start + i * MIN)).flat();
  assert.deepEqual([...covered].sort(), [...registry].sort());
});
