import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

process.env.EDUNANCIAL_CONTENT_STORE_ROOT = mkdtempSync(join(tmpdir(), "edunancial-atomic-precedence-"));
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { readAtomicPublishedLessons, upsertAtomicPublishedLessons } from "@/lib/curriculum/atomic-published-store";
import type { PublishedLessonRecord } from "@/lib/curriculum/authoritative-published";
import { getLessonContent, readRegistry } from "@/lib/curriculum/reader";

getAdminContentStorage();
(process.env as Record<string, string>).NODE_ENV = "production";

function firstRepositoryLesson(): PublishedLessonRecord {
  for (const track of Object.values(readRegistry().tracks)) for (const level of Object.values(track.levels)) for (const a of Object.values(level.assets)) {
    if (a.type !== "lesson" || a.status !== "active" || typeof a.lessonNumber !== "number") continue;
    const c = getLessonContent(a.id, "en"); if (!c?.body) continue;
    return { id: a.id, track: a.track, trackName: a.trackName, level: a.level, lessonNumber: a.lessonNumber, title: c.meta.title, summary: c.meta.summary,
      author: c.meta.author, date: c.meta.date, version: c.meta.version, status: "active", importedAt: c.meta.importedAt, metadata: {}, path: a.path, body: c.body, frontMatter: {} };
  }
  throw new Error("No repository canonical lesson available for the regression test.");
}

test("newly published atomic canonical lesson outranks a stale repository row with the same ID", async () => {
  const repo = firstRepositoryLesson();
  const fresh = { ...repo, title: "Freshly Published Title", body: "## Learning Objectives\nFRESHLY PUBLISHED AUTHORITATIVE BODY", frontMatter: { locale: "en" } };
  assert.equal(await upsertAtomicPublishedLessons("batch_recovery_test", [fresh]), true);
  const served = (await readAtomicPublishedLessons())?.find((l) => l.id.toUpperCase() === repo.id.toUpperCase());
  assert.equal(served?.body, fresh.body);
  assert.equal(served?.title, fresh.title);
});

test("registry backfill rows still defer to the repository copy (no change to established rendering)", async () => {
  const repo = firstRepositoryLesson();
  const backfill = { ...repo, body: "BACKFILL SNAPSHOT THAT MUST NOT WIN", frontMatter: { locale: "en" } };
  assert.equal(await upsertAtomicPublishedLessons(`registry:${repo.id}`, [backfill]), true);
  const served = (await readAtomicPublishedLessons())?.find((l) => l.id.toUpperCase() === repo.id.toUpperCase());
  assert.equal(served?.body, repo.body);
});
