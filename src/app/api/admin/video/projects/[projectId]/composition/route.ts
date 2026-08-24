import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type SceneInput = { assetId?: unknown; durationSeconds?: unknown; overlayText?: unknown; fitMode?: unknown; transitionType?: unknown; transitionSeconds?: unknown };
type AudioInput = { assetId?: unknown; locale?: unknown; transcript?: unknown; volume?: unknown };
const TRANSITIONS = new Set(["cut", "fade", "wipeleft", "wiperight", "slideleft", "slideright"]);

function parseAudio(value: unknown, fallbackLocale: string, fallbackVolume: number) {
  const raw = value && typeof value === "object" ? value as AudioInput : null;
  if (!raw) return null;
  const assetId = typeof raw.assetId === "string" ? raw.assetId : "";
  if (!/^[0-9a-f-]{36}$/iu.test(assetId)) throw new Error("Audio track has an invalid asset.");
  const requestedVolume = Number(raw.volume ?? fallbackVolume);
  return { assetId, locale: typeof raw.locale === "string" ? raw.locale.trim().slice(0, 35) : fallbackLocale, transcript: typeof raw.transcript === "string" ? raw.transcript.trim().slice(0, 20000) : null, volume: Number.isFinite(requestedVolume) ? Math.max(0, Math.min(2, requestedVolume)) : fallbackVolume };
}

export async function PUT(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireAdminApiSession(request, true); if (!auth.ok) return auth.response;
  try {
    const { projectId } = await context.params; if (!/^[0-9a-f-]{36}$/iu.test(projectId)) throw new Error("Invalid projectId.");
    const body = (await request.json()) as { scenes?: unknown; narration?: unknown; backgroundMusic?: unknown };
    if (!Array.isArray(body.scenes) || body.scenes.length < 1 || body.scenes.length > 30) throw new Error("A Short requires between 1 and 30 scenes.");
    const sceneCount = body.scenes.length;
    const scenes = body.scenes.map((raw, index) => {
      const scene = raw as SceneInput, assetId = typeof scene.assetId === "string" ? scene.assetId : "", durationSeconds = Number(scene.durationSeconds ?? 6), overlayText = typeof scene.overlayText === "string" ? scene.overlayText.trim().slice(0, 500) : null, fitMode = scene.fitMode === "cover" ? "cover" : "contain";
      const requestedTransition = typeof scene.transitionType === "string" ? scene.transitionType : "cut", transitionType = TRANSITIONS.has(requestedTransition) ? requestedTransition : "cut", requestedSeconds = Number(scene.transitionSeconds ?? 0.35), transitionSeconds = Number.isFinite(requestedSeconds) ? Math.max(0.1, Math.min(2, requestedSeconds)) : 0.35;
      if (!/^[0-9a-f-]{36}$/iu.test(assetId)) throw new Error(`Scene ${index + 1} has an invalid asset.`); if (!Number.isFinite(durationSeconds) || durationSeconds < 1 || durationSeconds > 60) throw new Error(`Scene ${index + 1} duration must be 1-60 seconds.`); if (index < sceneCount - 1 && transitionType !== "cut" && transitionSeconds >= durationSeconds) throw new Error(`Scene ${index + 1} transition must be shorter than the scene.`);
      return { project_id: projectId, asset_id: assetId, scene_order: index, duration_seconds: durationSeconds, overlay_text: overlayText || null, fit_mode: fitMode, transition_type: index === sceneCount - 1 ? "cut" : transitionType, transition_seconds: transitionSeconds };
    });
    const narration = parseAudio(body.narration, "en-US", 1), backgroundMusic = parseAudio(body.backgroundMusic, "und", 0.18), supabase = getSupabaseAdminClient();
    const { data: project, error: projectError } = await supabase.from("video_projects").select("id,created_by").eq("id", projectId).single(); if (projectError || !project || project.created_by !== auth.session.email) throw new Error("Video project not found.");
    await supabase.from("video_scenes").delete().eq("project_id", projectId); const { error: sceneError } = await supabase.from("video_scenes").insert(scenes); if (sceneError) throw new Error(sceneError.message);
    await supabase.from("video_audio_tracks").delete().eq("project_id", projectId).in("track_type", ["ORIGINAL_NARRATION", "BACKGROUND_MUSIC"]); const audioTracks = [];
    if (narration) audioTracks.push({ project_id: projectId, asset_id: narration.assetId, track_type: "ORIGINAL_NARRATION", locale: narration.locale || "en-US", transcript: narration.transcript || null, volume: narration.volume, muted: false }); if (backgroundMusic) audioTracks.push({ project_id: projectId, asset_id: backgroundMusic.assetId, track_type: "BACKGROUND_MUSIC", locale: backgroundMusic.locale || "und", transcript: null, volume: backgroundMusic.volume, muted: false }); if (audioTracks.length) { const { error: audioError } = await supabase.from("video_audio_tracks").insert(audioTracks); if (audioError) throw new Error(audioError.message); }
    return Response.json({ success: true, projectId, sceneCount: scenes.length, hasNarration: Boolean(narration), hasBackgroundMusic: Boolean(backgroundMusic) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return Response.json({ success: false, error: error instanceof Error ? error.message : "Could not save composition." }, { status: 400, headers: { "Cache-Control": "private, no-store" } }); }
}
