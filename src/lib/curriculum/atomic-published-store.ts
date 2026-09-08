import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";

let cached: SupabaseClient | null = null;

function adminClient(): SupabaseClient | null {
  if (process.env.NODE_ENV !== "production") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  if (!cached) cached = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } });
  return cached;
}

function schemaUnavailable(message: string): boolean {
  return /does not exist|schema cache|could not find the function|could not find the table/i.test(message);
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
    if (schemaUnavailable(error.message)) return null;
    throw new Error(`Atomic curriculum read failed: ${error.message}`);
  }
  return (data ?? []).map((row) => row.record as PublishedLessonRecord);
}

export async function upsertAtomicPublishedLessons(batchId: string, lessons: PublishedLessonRecord[]): Promise<boolean> {
  const client = adminClient();
  if (!client) return false;
  const { error } = await client.rpc("publish_curriculum_batch", {
    p_batch_id: batchId,
    p_lessons: lessons,
  });
  if (error) {
    if (schemaUnavailable(error.message)) return false;
    throw new Error(`Atomic curriculum batch publication failed: ${error.message}`);
  }
  return true;
}

export async function upsertAtomicPublishedTranslation(
  lessonId: string,
  locale: string,
  translation: PublishedLessonTranslation,
): Promise<boolean | null> {
  const client = adminClient();
  if (!client) return null;
  const { data, error } = await client.rpc("publish_curriculum_translation", {
    p_lesson_id: lessonId,
    p_locale: locale,
    p_translation: translation,
  });
  if (error) {
    if (schemaUnavailable(error.message)) return null;
    throw new Error(`Atomic curriculum translation publication failed for ${lessonId}: ${error.message}`);
  }
  return Boolean(data);
}

export async function removeAtomicPublishedBatch(batchId: string): Promise<boolean> {
  const client = adminClient();
  if (!client) return false;
  const { error } = await client.rpc("remove_published_curriculum_batch", { p_batch_id: batchId });
  if (error) {
    if (schemaUnavailable(error.message)) return false;
    throw new Error(`Atomic curriculum rollback failed: ${error.message}`);
  }
  return true;
}
