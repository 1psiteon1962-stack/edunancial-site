import assert from "node:assert/strict";
import test from "node:test";

import { createSingleFlightCache } from "./single-flight-cache";

test("concurrent reads of the same package share one underlying fetch", async () => {
  let calls = 0;
  const cache = createSingleFlightCache(async (key: string) => { calls++; return key + "-found"; }, 30_000);
  const [a, b, c] = await Promise.all([cache.read("RED-L1-fr-CA"), cache.read("RED-L1-fr-CA"), cache.read("RED-L1-fr-CA")]);
  assert.equal(a, "RED-L1-fr-CA-found");
  assert.equal(b, a);
  assert.equal(c, a);
  assert.equal(calls, 1);
});

test("expiry and invalidation never preserve obsolete package content", async () => {
  let now = 1_000;
  let version = 0;
  const cache = createSingleFlightCache(async () => ++version, 30, 512, () => now);
  assert.equal(await cache.read("p"), 1);
  assert.equal(await cache.read("p"), 1);
  now += 31;
  assert.equal(await cache.read("p"), 2);
  cache.clear();
  assert.equal(await cache.read("p"), 3);
});

test("failed package reads are evicted so storage can recover", async () => {
  let calls = 0;
  const cache = createSingleFlightCache(async () => {
    if (++calls === 1) throw new Error("blob unavailable");
    return "recovered";
  }, 30_000);
  await assert.rejects(cache.read("p"), /blob unavailable/);
  assert.equal(await cache.read("p"), "recovered");
  assert.equal(calls, 2);
});

test("cache evicts least-recent inserts after bounded capacity", async () => {
  let calls = 0;
  const cache = createSingleFlightCache(async (key: string) => { calls++; return key; }, 30_000, 2);
  await cache.read("a");
  await cache.read("b");
  await cache.read("c");
  await cache.read("a");
  assert.equal(calls, 4);
});
