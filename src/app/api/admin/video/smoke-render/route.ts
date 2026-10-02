import { createHash } from "node:crypto";
import { NextRequest } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import {
  createVideoR2Job,
  createVideoR2PendingAsset,
  createVideoR2Project,
  markVideoR2AssetReady,
  markVideoR2JobDispatchFailed,
  replaceVideoR2Composition,
} from "@/lib/video/repository";
import { putVideoObject } from "@/lib/video/storage-client";
import { videoNarrationKey, videoSourceKey } from "@/lib/video/storage";
import { signWorkerRequest } from "@/lib/video-pipeline/hmac";

export const runtime = "nodejs";
export const maxDuration = 30;

const SMOKE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

const SMOKE_TRANSCRIPT =
  "Edunancial video pipeline production test. Multilingual narration and vertical rendering are operational.";

function workerBaseUrl() {
  const value = process.env.WORKER_BASE_URL?.trim().replace(/\/+$/u, "") ?? "";
  if (!value) throw new Error("WORKER_BASE_URL is not configured.");
  if (process.env.NODE_ENV === "production" && !/^https:\/\//iu.test(value)) {
    throw new Error("WORKER_BASE_URL must use HTTPS in production.");
  }
  return value;
}

async function generateNarration(locale: string) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const model = process.env.EDUNANCIAL_TTS_MODEL?.trim() || "gpt-4o-mini-tts";
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      voice: "coral",
      input: SMOKE_TRANSCRIPT,
      response_format: "mp3",
      instructions: `Speak clearly and naturally in ${locale}. Do not translate the supplied script.`,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`TTS smoke test failed (${response.status}): ${detail.slice(0, 300) || "no response body"}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function POST(request: NextRequest) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;

  const locale = "en-US";
  let projectId: string | null = null;
  let jobId: string | null = null;

  try {
    const narration = await generateNarration(locale);

    const project = await createVideoR2Project({
      title: `Production smoke render ${new Date().toISOString()}`,
      ownerEmail: auth.session.email,
      purpose: "marketing",
      defaultLocale: locale,
      outputProfile: "vertical_1080x1920",
    });
    if (!project?.id) throw new Error("Could not create smoke-test project.");
    projectId = String(project.id);

    const imageAssetId = crypto.randomUUID();
    const narrationAssetId = crypto.randomUUID();
    const imageKey = videoSourceKey(projectId, imageAssetId, "png");
    const narrationKey = videoNarrationKey(projectId, narrationAssetId, "mp3");

    await putVideoObject(imageKey, SMOKE_PNG, "image/png");
    await putVideoObject(narrationKey, narration, "audio/mpeg");

    const imageAsset = await createVideoR2PendingAsset({
      id: imageAssetId,
      projectId,
      ownerEmail: auth.session.email,
      kind: "source_image",
      storageKey: imageKey,
      mimeType: "image/png",
      byteSize: SMOKE_PNG.length,
      originalFilename: "smoke.png",
    });
    const narrationAsset = await createVideoR2PendingAsset({
      id: narrationAssetId,
      projectId,
      ownerEmail: auth.session.email,
      kind: "narration",
      storageKey: narrationKey,
      mimeType: "audio/mpeg",
      byteSize: narration.length,
      locale,
      originalFilename: "smoke-narration.mp3",
    });
    if (!imageAsset?.id || !narrationAsset?.id) throw new Error("Could not register smoke-test assets.");

    await markVideoR2AssetReady(imageAssetId, auth.session.email, { byteSize: SMOKE_PNG.length, mimeType: "image/png" });
    await markVideoR2AssetReady(narrationAssetId, auth.session.email, { byteSize: narration.length, mimeType: "audio/mpeg" });

    await replaceVideoR2Composition(
      projectId,
      auth.session.email,
      [{
        assetId: imageAssetId,
        durationSeconds: 8,
        overlayText: "EDUNANCIAL\nPRODUCTION VIDEO TEST",
        fitMode: "cover",
        transitionType: "cut",
        transitionSeconds: 0.35,
      }],
      [{
        assetId: narrationAssetId,
        role: "narration",
        locale,
        transcript: SMOKE_TRANSCRIPT,
        volume: 1,
      }],
    );

    const composition = {
      outputProfile: "vertical",
      scenes: [{
        assetId: imageAssetId,
        storageKey: imageKey,
        mimeType: "image/png",
        durationSeconds: 8,
        fit: "cover",
        overlayText: { text: "EDUNANCIAL\nPRODUCTION VIDEO TEST" },
        transitionType: "cut",
        transitionSeconds: 0.35,
      }],
      audio: [{
        assetId: narrationAssetId,
        storageKey: narrationKey,
        mimeType: "audio/mpeg",
        role: "narration",
        locale,
        transcript: SMOKE_TRANSCRIPT,
        volume: 1,
      }],
    };
    const serialized = JSON.stringify(composition);
    const compositionHash = createHash("sha256").update(serialized).digest("hex");
    const job = await createVideoR2Job({
      projectId,
      ownerEmail: auth.session.email,
      locale,
      outputProfile: "vertical_1080x1920",
      composition,
      compositionHash,
      idempotencyKey: `smoke-${crypto.randomUUID()}`,
    });
    if (!job?.id) throw new Error("Could not create smoke render job.");
    jobId = String(job.id);

    const path = `/internal/jobs/${jobId}/execute`;
    const payload = JSON.stringify({ jobId });
    const signed = signWorkerRequest("POST", path, payload);
    const workerResponse = await fetch(`${workerBaseUrl()}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-edunancial-timestamp": signed.timestamp,
        "x-edunancial-request-id": signed.requestId,
        "x-edunancial-signature": signed.signature,
      },
      body: payload,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!workerResponse.ok) {
      const detail = (await workerResponse.text()).slice(0, 500);
      throw new Error(`Worker rejected smoke render (${workerResponse.status}): ${detail || "no response body"}`);
    }

    return Response.json(
      {
        success: true,
        projectId,
        jobId,
        status: "queued",
        statusUrl: `/api/admin/video/jobs/${jobId}`,
        architecture: "neon+r2+railway",
        expectedOutput: { width: 1080, height: 1920, container: "mp4", narration: locale },
      },
      { status: 202, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Production smoke render failed.";
    if (jobId) await markVideoR2JobDispatchFailed(jobId, auth.session.email, `Smoke render dispatch failed: ${message}`);
    return Response.json(
      { success: false, error: message, projectId, jobId },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
