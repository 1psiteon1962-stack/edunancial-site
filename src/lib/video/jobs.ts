import { createClient } from "@supabase/supabase-js";

export const RAW_VIDEO_BUCKET = "raw-videos";
export const PROCESSED_VIDEO_BUCKET = "processed-videos";

export type CreateVideoJobInput = {
  rawPath: string;
  trimStartSeconds?: number;
  trimEndSeconds?: number | null;
  musicPath?: string | null;
  musicVolume?: number;
};

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase video runtime is not configured.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export function normalizeVideoPath(value: string) {
  const path = value.trim().replace(/^\/+/, "");
  if (!path || path.includes("..") || path.includes("\\")) throw new Error("Invalid video storage path.");
  return path;
}

export async function createVideoJob(createdBy: string, input: CreateVideoJobInput) {
  const rawPath = normalizeVideoPath(input.rawPath);
  const trimStartSeconds = Number(input.trimStartSeconds ?? 0);
  const trimEndSeconds = input.trimEndSeconds == null ? null : Number(input.trimEndSeconds);
  const musicVolume = Number(input.musicVolume ?? 0.15);
  if (!Number.isFinite(trimStartSeconds) || trimStartSeconds < 0) throw new Error("Invalid trim start.");
  if (trimEndSeconds != null && (!Number.isFinite(trimEndSeconds) || trimEndSeconds <= trimStartSeconds)) throw new Error("Invalid trim end.");
  if (!Number.isFinite(musicVolume) || musicVolume < 0 || musicVolume > 1) throw new Error("Invalid music volume.");

  const supabase = getServerClient();
  const { data, error } = await supabase.from("video_jobs").insert({
    created_by: createdBy,
    raw_bucket: RAW_VIDEO_BUCKET,
    raw_path: rawPath,
    processed_bucket: PROCESSED_VIDEO_BUCKET,
    trim_start_seconds: trimStartSeconds,
    trim_end_seconds: trimEndSeconds,
    music_path: input.musicPath ? normalizeVideoPath(input.musicPath) : null,
    music_volume: musicVolume,
  }).select("*").single();
  if (error) throw new Error(`Could not create video job: ${error.message}`);
  return data;
}

export async function createRawVideoUploadUrl(storagePath: string) {
  const path = normalizeVideoPath(storagePath);
  const supabase = getServerClient();
  const { data, error } = await supabase.storage.from(RAW_VIDEO_BUCKET).createSignedUploadUrl(path, { upsert: false });
  if (error) throw new Error(`Could not create raw video upload URL: ${error.message}`);
  return { path, signedUrl: data.signedUrl };
}
