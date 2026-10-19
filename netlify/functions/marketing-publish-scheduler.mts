import { publishDueMarketing } from "../../src/lib/marketing/scheduler";

// Publishes ONLY owner-approved, scheduled items whose time has come. Fail-closed:
// unconnected accounts are marked failed with a reason, never silently skipped.
export default async () => {
  try {
    const results = await publishDueMarketing();
    return new Response(JSON.stringify({ processed: results.length, results }), { headers: { "content-type": "application/json" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Marketing tables not yet migrated in this environment: nothing can be due.
    if (/relation .*marketing_/i.test(message)) {
      return new Response(JSON.stringify({ processed: 0, skipped: "marketing schema not applied" }), { headers: { "content-type": "application/json" } });
    }
    console.error("[marketing-scheduler] failed", message);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "content-type": "application/json" } });
  }
};

export const config = { schedule: "*/15 * * * *" };
