import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");

test("Video Maker project contract supports AI marketing context without requiring curriculum", () => {
  const repo = read("src/lib/video/repository.ts");
  for (const field of ["sourceType", "countryCode", "audience", "platform", "marketingObjective", "campaignId", "sourceRef", "aiBrief"]) {
    assert.match(repo, new RegExp(field), field);
  }
  assert.match(repo, /"marketing" \| "lesson"/);
});

test("AI marketing context migration is additive and campaign attributable", () => {
  const migration = read("db/neon/20261013_video_maker_ai_marketing_context.sql");
  assert.match(migration, /ADD COLUMN IF NOT EXISTS source_type/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS campaign_id/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS ai_brief/);
  assert.match(migration, /WHERE purpose = 'marketing'/);
  assert.doesNotMatch(migration, /DROP TABLE|DROP COLUMN|DELETE FROM|TRUNCATE/i);
});

test("agent guardrails keep video rendering isolated from customer-critical systems", () => {
  const agents = read("AGENTS.md");
  assert.match(agents, /AI-native media production/);
  assert.match(agents, /must not interrupt the learner site, checkout, payments, or entitlements/);
});
