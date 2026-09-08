import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { PublishedLessonRecord } from "@/lib/curriculum/types";

let cached: SupabaseClient | null = null;

function adminClient(): SupabaseClient | null {
  if (process.env.NODE_ENV !== "production") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  if (!cached) cached = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } });
  return cached;
}

export async function readAtomicPublishedLessons(): Promise<PublishedLessonRecord[] | null> {
  const client = adminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("published_curriculum_lessons")
    .select("record")
    .order("track")
    .order("level")
    .order("lesson_number");
  if (error) {
    if (/does not exist|schema cache/i.test(error.message)) return null;
    throw new Error(`Atomic curriculum read failed: ${error.message}`);
  }
  return (data ?? []).map((row) => row.record as PublishedLessonRecord);
}

export async function upsertAtomicPublishedLessons(batchId: string, lessons: PublishedLessonRecord[]): Promise<boolean> {
  const client = adminClient();
  if (!client) return false;
  for (const lesson of lessons) {
    const { error } = await client.rpc("publish_curriculum_lesson", {
      p_batch_id: batchId,
      p_lesson_id: lesson.id,
      p_track: lesson.track,
      p_level: lesson.level,
      p_lesson_number: lesson.lessonNumber,
      p_record: lesson,
    });
    if (error) {
      if (/does not exist|schema cache/i.test(error.message)) return false;
      throw new Error(`Atomic curriculum publication failed for ${lesson.id}: ${error.message}`);
    }
  }
  return true;
}

export async function removeAtomicPublishedBatch(batchId: string): Promise<boolean> {
  const client = adminClient();
  if (!client) return false;
  const { error } = await client.rpc("remove_published_curriculum_batch", { p_batch_id: batchId });
  if (error) {
    if (/does not exist|schema cache/i.test(error.message)) return false;
    throw new Error(`Atomic curriculum rollback failed: ${error.message}`);
  }
  return true;
}
