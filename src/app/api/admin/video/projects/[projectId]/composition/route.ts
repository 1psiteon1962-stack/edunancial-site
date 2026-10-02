import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import {
  getVideoR2Asset,
  getVideoR2Project,
  markVideoR2AssetReady,
  replaceVideoR2Composition,
} from "@/lib/video/repository";
import { verifyVideoObject } from "@/lib/video/storage-client";

type SceneInput = { assetId?: unknown; durationSeconds?: unknown; overlayText?: unknown; fitMode?: unknown; transitionType?: unknown; transitionSeconds?: unknown };
type AudioInput = { assetId?: unknown; locale?: unknown; transcript?: unknown; volume?: unknown };
const TRANSITIONS = new Set(["cut", "fade", "wipeleft", "wiperight", "slideleft", "slideright"]);

function parseAudio(value: unknown, fallbackLocale: string, fallbackVolume: number, role: "narration" | "music") {
  const raw = value && typeof value === "object" ? value as AudioInput : null;
  if (!raw) return null;
  const assetId = typeof raw.assetId === "string" ? raw.assetId : "";
  if (!/^[0-9a-f-]{36}$/iu.test(assetId)) throw new Error("Audio track has an invalid asset.");
  const requestedVolume = Number(raw.volume ?? fallbackVolume);
  return {
    assetId,
    role,
    locale: typeof raw.locale === "string" ? raw.locale.trim().slice(0, 35) : fallbackLocale,
    transcript: typeof raw.transcript === "string" ? raw.transcript.trim().slice(0, 20000) : null,
    volume: Number.isFinite(requestedVolume) ? Math.max(0, Math.min(2, requestedVolume)) : fallbackVolume,
  };
}

async function ensureAssetReady(assetId: string, ownerEmail: string) {
  const asset = await getVideoR2Asset(assetId, ownerEmail) as Record<string, unknown> | null;
  if (!asset) throw new Error("Video asset not found.");
  if (String(asset.status) === "ready") return asset;
  const verified = await verifyVideoObject(String(asset.storage_key), Number(asset.byte_size));
  const ready = await markVideoR2AssetReady(assetId, ownerEmail, {
    byteSize: verified.byteSize,
    mimeType: verified.contentType,
    etag: verified.etag,
  });
  if (!ready) throw new Error("Video asset could not be verified.");
  return ready as Record<string, unknown>;
}

export async function PUT(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { projectId } = await context.params;
    if (!/^[0-9a-f-]{36}$/iu.test(projectId)) throw new Error("Invalid projectId.");
    const project = await getVideoR2Project(projectId, auth.session.email);
    if (!project) throw new Error("Video project not found.");

    const body = (await request.json()) as { scenes?: unknown; narration?: unknown; backgroundMusic?: unknown };
    if (!Array.isArray(body.scenes) || body.scenes.length < 1 || body.scenes.length > 30) throw new Error("A Short requires between 1 and 30 scenes.");

    const sceneCount = body.scenes.length;
    const scenes = [];
    for (let index = 0; index < sceneCount; index++) {
      const raw = body.scenes[index] as SceneInput;
      const assetId = typeof raw.assetId === "string" ? raw.assetId : "";
      const durationSeconds = Number(raw.durationSeconds ?? 6);
      const overlayText = typeof raw.overlayText === "string" ? raw.overlayText.trim().slice(0, 500) : null;
      const fitMode = raw.fitMode === "cover" ? "cover" as const : "contain" as const;
      const requestedTransition = typeof raw.transitionType === "string" ? raw.transitionType : "cut";
      const transitionType = TRANSITIONS.has(requestedTransition) ? requestedTransition as "cut" | "fade" | "wipeleft" | "wiperight" | "slideleft" | "slideright" : "cut";
      const requestedSeconds = Number(raw.transitionSeconds ?? 0.35);
      const transitionSeconds = Number.isFinite(requestedSeconds) ? Math.max(0.1, Math.min(2, requestedSeconds)) : 0.35;
      if (!/^[0-9a-f-]{36}$/iu.test(assetId)) throw new Error(`Scene ${index + 1} has an invalid asset.`);
      if (!Number.isFinite(durationSeconds) || durationSeconds < 1 || durationSeconds > 60) throw new Error(`Scene ${index + 1} duration must be 1-60 seconds.`);
      if (index < sceneCount - 1 && transitionType !== "cut" && transitionSeconds >= durationSeconds) throw new Error(`Scene ${index + 1} transition must be shorter than the scene.`);
      await ensureAssetReady(assetId, auth.session.email);
      scenes.push({
        assetId,
        durationSeconds,
        overlayText: overlayText || null,
        fitMode,
        transitionType: index === sceneCount - 1 ? "cut" as const : transitionType,
        transitionSeconds,
      });
    }

    const narration = parseAudio(body.narration, "en-US", 1, "narration");
    const backgroundMusic = parseAudio(body.backgroundMusic, "und", 0.18, "music");
    if (narration) await ensureAssetReady(narration.assetId, auth.session.email);
    if (backgroundMusic) await ensureAssetReady(backgroundMusic.assetId, auth.session.email);

    await replaceVideoR2Composition(
      projectId,
      auth.session.email,
      scenes,
      [narration, backgroundMusic].filter((value): value is NonNullable<typeof value> => Boolean(value)),
    );

    return Response.json(
      {
        success: true,
        projectId,
        sceneCount: scenes.length,
        hasNarration: Boolean(narration),
        hasBackgroundMusic: Boolean(backgroundMusic),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Could not save composition." },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
