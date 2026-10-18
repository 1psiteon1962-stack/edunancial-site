import assert from "node:assert/strict";
import test from "node:test";
import { replayKpiSpool } from "./replay";

function fixture() {
  const blobs = new Map<string, { row: { event_name: string } }>([
    ["pending/a.json", { row: { event_name: "page_view" } }],
    ["pending/b.json", { row: { event_name: "click" } }],
  ]);
  const store = {
    async list() { return { blobs: [...blobs.keys()].map(key => ({ key })) }; },
    async get(key: string) { return blobs.get(key) ?? null; },
    async delete(key: string) { blobs.delete(key); },
  };
  return { blobs, store };
}

test("replay removes an event only after successful durable write", async () => {
  const { blobs, store } = fixture();
  const written: string[] = [];
  const result = await replayKpiSpool(store, async (_row, key) => { written.push(key); });
  assert.equal(result.recovered, 2);
  assert.equal(result.failed, 0);
  assert.equal(blobs.size, 0);
  assert.deepEqual(written, ["pending/a.json", "pending/b.json"]);
});

test("failed database writes retain their spool records", async () => {
  const { blobs, store } = fixture();
  const result = await replayKpiSpool(store, async (_row, key) => {
    if (key === "pending/a.json") throw new Error("database unavailable");
  });
  assert.equal(result.failed, 1);
  assert.equal(result.recovered, 1);
  assert.equal(blobs.has("pending/a.json"), true);
  assert.equal(blobs.has("pending/b.json"), false);
});

test("replay respects its processing limit", async () => {
  const { blobs, store } = fixture();
  const result = await replayKpiSpool(store, async () => {}, { limit: 1 });
  assert.equal(result.attempted, 1);
  assert.equal(blobs.size, 1);
});

test("missing payloads cannot be silently deleted", async () => {
  const { blobs, store } = fixture();
  const broken = { ...store, async get() { return null; } };
  const result = await replayKpiSpool(broken, async () => { throw new Error("unexpected"); });
  assert.equal(result.failed, 2);
  assert.equal(blobs.size, 2);
});
