import type { Handler } from "@netlify/functions";
import { getNeonSql } from "../../src/lib/db/neon";

// Preserve the existing recovery semantics. A failed database operation must be
// observable as a service failure, rather than an uncaught function exception.
export const handler: Handler = async () => {
  try {
    const sql = getNeonSql();
    if (!sql) return { statusCode: 503, body: "Neon unavailable" };
    const rows = await sql`update curriculum_uploads set state='RECOVERABLE',updated_at=now(),last_error=coalesce(last_error,'Publication interrupted; queued for automatic recovery.') where state='PUBLISHING' and updated_at<now()-interval '10 minutes' returning upload_id`;
    return { statusCode: 200, body: JSON.stringify({ requeued: rows.length }) };
  } catch (error) {
    console.error("[curriculum-recovery-sweeper] database operation failed", error instanceof Error ? error.name : "UnknownError");
    return { statusCode: 503, body: "Recovery sweep temporarily unavailable" };
  }
};
