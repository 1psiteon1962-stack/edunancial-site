import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("KPI runtime paths use Neon repository instead of Supabase", () => {
  const writer = read("src/app/api/kpi/track/route.ts");
  const page = read("src/app/admin/kpi/page.tsx");
  const repository = read("src/lib/kpi/repository.ts");

  assert.match(writer, /insertKpiEvent/);
  assert.match(page, /listRecentKpiEvents/);
  assert.match(repository, /getNeonSql/);

  for (const source of [writer, page]) {
    assert.doesNotMatch(source, /supabase|getSupabaseAdminClient|getKpiSupabaseAdmin/iu);
  }
});

test("Neon KPI migration preserves the existing event schema contract", () => {
  const migration = read("db/neon/20261002_kpi_events.sql");
  for (const field of [
    "site_id",
    "site_region",
    "event_name",
    "session_id",
    "ip_hash",
    "utm_source",
    "currency",
    "order_id",
    "metadata jsonb",
  ]) {
    assert.ok(migration.includes(field), `missing KPI field: ${field}`);
  }
});
