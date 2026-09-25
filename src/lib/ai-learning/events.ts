import { getNeonSql } from "@/lib/db/neon";

const ALLOWED = new Set(["registration","lesson_start","lesson_complete","free_preview_complete","membership_boundary","inactivity","upgrade","downgrade","cancellation","certificate","ai_interaction"]);

export async function recordLearnerEvent(input: { userId: string | null; eventName: string; lessonId?: string | null; track?: string | null; level?: number | null; locale?: string | null; metadata?: Record<string, unknown> }) {
  if (!ALLOWED.has(input.eventName)) throw new Error("Unsupported learner event.");
  const sql=getNeonSql(); if(!sql) return false;
  await sql`insert into learner_events (user_id,event_name,lesson_id,track,level,locale,metadata)
    values (${input.userId},${input.eventName},${input.lessonId ?? null},${input.track ?? null},${input.level ?? null},${input.locale ?? null},${JSON.stringify(input.metadata ?? {})}::jsonb)`;
  return true;
}
