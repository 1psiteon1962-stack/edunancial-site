import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type SceneInput = { assetId?: unknown; durationSeconds?: unknown; overlayText?: unknown; fitMode?: unknown };
type AudioInput = { assetId?: unknown; locale?: unknown; transcript?: unknown; volume?: unknown };

export async function PUT(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { projectId } = await context.params;
    if (!/^[0-9a-f-]{36}$/iu.test(projectId)) throw new Error("Invalid projectId.");
    const body = (await request.json()) as { scenes?: unknown; narration?: unknown };
    if (!Array.isArray(body.scenes) || body.scenes.length < 1 || body.scenes.length > 30) throw new Error("A Short requires between 1 and 30 scenes.");
    const scenes = body.scenes.map((raw, index) => {
      const scene = raw as SceneInput;
      const assetId = typeof scene.assetId === "string" ? scene.assetId : "";
      const durationSeconds = Number(scene.durationSeconds ?? 6);
      const overlayText = typeof scene.overlayText === "string" ? scene.overlayText.trim().slice(0, 500) : null;
      const fitMode = scene.fitMode === "cover" ? "cover" : "contain";
      if (!/^[0-9a-f-]{36}$/iu.test(assetId)) throw new Error(`Scene ${index + 1} has an invalid asset.`);
      if (!Number.isFinite(durationSeconds) || durationSeconds < 1 || durationSeconds > 60) throw new Error(`Scene ${index + 1} duration must be 1-60 seconds.`);
      return { project_id: projectId, asset_id: assetId, scene_order: index, duration_seconds: durationSeconds, overlay_text: overlayText || null, fit_mode: fitMode };
    });

    const narrationRaw = body.narration && typeof body.narration === "object" ? body.narration as AudioInput : null;
    const narration = narrationRaw ? {
      assetId: typeof narrationRaw.assetId === "string" ? narrationRaw.assetId : "",
      locale: typeof narrationRaw.locale === "string" ? narrationRaw.locale.trim().slice(0, 35) : "en-US",
      transcript: typeof narrationRaw.transcript === "string" ? narrationRaw.transcript.trim().slice(0, 20000) : null,
      volume: Math.max(0, Math.min(2, Number(narrationRaw.volume ?? 1))),
    } : null;
    if (narration && !/^[0-9a-f-]{36}$/iu.test(narration.assetId)) throw new Error("Narration has an invalid asset.");

    const supabase = getSupabaseAdminClient();
    const { data: project, error: projectError } = await supabase.from("video_projects").select("id,created_by").eq("id", projectId).single();
    if (projectError || !project || project.created_by !== auth.session.email) throw new Error("Video project not found.");

    await supabase.from("video_scenes").delete().eq("project_id", projectId);
    const { error: sceneError } = await supabase.from("video_scenes").insert(scenes);
    if (sceneError) throw new Error(sceneError.message);

    if (narration) {
      await supabase.from("video_audio_tracks").delete().eq("project_id", projectId).eq("track_type", "ORIGINAL_NARRATION");
      const { error: audioError } = await supabase.from("video_audio_tracks").insert({ project_id: projectId, asset_id: narration.assetId, track_type: "ORIGINAL_NARRATION", locale: narration.locale || "en-US", transcript: narration.transcript || null, volume: narration.volume, muted: false });
      if (audioError) throw new Error(audioError.message);
    }

    return Response.json({ success: true, projectId, sceneCount: scenes.length, hasNarration: Boolean(narration) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Could not save composition." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
}
