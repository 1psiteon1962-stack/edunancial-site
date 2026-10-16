import assert from "node:assert/strict";
import test from "node:test";

import { createExpiringFallbackCache } from "./expiring-fallback-cache";

test("concurrent index lookups share one read", async () => {
  let reads = 0;
  const cache = createExpiringFallbackCache(async () => ({ version: ++reads }), () => ({ version: 0 }), 30_000);
  const [a, b, c] = await Promise.all([cache.read(), cache.read(), cache.read()]);
  assert.equal(reads, 1);
  assert.equal(a, b);
  assert.equal(b, c);
  assert.equal(a.version, 1);
});

test("missing index is retried after TTL instead of being cached forever", async () => {
  let now = 1_000;
  let indexed = false;
  const cache = createExpiringFallbackCache(async () => indexed ? { count: 27 } : null, () => ({ count: 0 }), 30, () => now);
  assert.deepEqual(await cache.read(), { count: 0 });
  indexed = true;
  assert.deepEqual(await cache.read(), { count: 0 });
  now += 31;
  assert.deepEqual(await cache.read(), { count: 27 });
});

test("transient storage failure retains the last successful index", async () => {
  let now = 0;
  let fail = false;
  const cache = createExpiringFallbackCache(async () => {
    if (fail) throw new Error("temporary Blob outage");
    return { lesson: "RED-L1-001.fr-CA" };
  }, () => ({ lesson: "" }), 10, () => now);
  assert.equal((await cache.read()).lesson, "RED-L1-001.fr-CA");
  fail = true;
  now += 11;
  assert.equal((await cache.read()).lesson, "RED-L1-001.fr-CA");
});

test("null read retains the last known index until a successful replacement", async () => {
  let now = 0;
  let state: { version: number } | null = { version: 1 };
  const cache = createExpiringFallbackCache(async () => state, () => ({ version: 0 }), 10, () => now);
  assert.equal((await cache.read()).version, 1);
  state = null;
  now += 11;
  assert.equal((await cache.read()).version, 1);
  state = { version: 2 };
  now += 11;
  assert.equal((await cache.read()).version, 2);
});

test("seed immediately exposes a completed rebuild despite an older in-flight read", async () => {
  let resolve!: (value: { version: number }) => void;
  const read = new Promise<{ version: number }>((r) => { resolve = r; });
  const cache = createExpiringFallbackCache(() => read, () => ({ version: 0 }), 30_000);
  const older = cache.read();
  await Promise.resolve();
  cache.seed({ version: 4 });
  assert.equal((await cache.read()).version, 4);
  resolve({ version: 1 });
  assert.equal((await older).version, 1);
  assert.equal((await cache.read()).version, 4);
});

test("reset clears stale history and permits a new test fixture", async () => {
  let version = 1;
  const cache = createExpiringFallbackCache(async () => ({ version }), () => ({ version: 0 }), 30_000);
  assert.equal((await cache.read()).version, 1);
  version = 2;
  cache.clear();
  assert.equal((await cache.read()).version, 2);
});

test("clock moving backwards expires cache and refreshes", async () => {
  let now = 500;
  let reads = 0;
  const cache = createExpiringFallbackCache(async () => ++reads, () => 0, 30_000, () => now);
  assert.equal(await cache.read(), 1);
  now = 450;
  assert.equal(await cache.read(), 2);
});
