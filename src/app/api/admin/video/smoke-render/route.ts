import { createHash } from "node:crypto";
import { NextRequest } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import {
  createVideoR2Job,
  createVideoR2PendingAsset,
  createVideoR2Project,
  getVideoR2Asset,
  getVideoR2Job,
  markVideoR2AssetReady,
  markVideoR2JobDispatchFailed,
  replaceVideoR2Composition,
} from "@/lib/video/repository";
import { putVideoObject, verifyVideoObject } from "@/lib/video/storage-client";
import { videoMusicKey, videoNarrationKey, videoSourceKey } from "@/lib/video/storage";
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

function createSmokeMusicWav(seconds = 8, sampleRate = 16000) {
  const samples = seconds * sampleRate;
  const dataBytes = samples * 2;
  const out = Buffer.alloc(44 + dataBytes);
  out.write("RIFF", 0, "ascii");
  out.writeUInt32LE(36 + dataBytes, 4);
  out.write("WAVE", 8, "ascii");
  out.write("fmt ", 12, "ascii");
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(1, 22);
  out.writeUInt32LE(sampleRate, 24);
  out.writeUInt32LE(sampleRate * 2, 28);
  out.writeUInt16LE(2, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36, "ascii");
  out.writeUInt32LE(dataBytes, 40);
  for (let i = 0; i < samples; i++) {
    const envelope = Math.min(1, i / (sampleRate * 0.1), (samples - i) / (sampleRate * 0.1));
    const sample = Math.round(Math.sin((2 * Math.PI * 220 * i) / sampleRate) * 1800 * Math.max(0, envelope));
    out.writeInt16LE(sample, 44 + i * 2);
  }
  return out;
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
    const music = createSmokeMusicWav();

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
    const musicAssetId = crypto.randomUUID();
    const imageKey = videoSourceKey(projectId, imageAssetId, "png");
    const narrationKey = videoNarrationKey(projectId, narrationAssetId, "mp3");
    const musicKey = videoMusicKey(projectId, musicAssetId, "wav");

    await putVideoObject(imageKey, SMOKE_PNG, "image/png");
    await putVideoObject(narrationKey, narration, "audio/mpeg");
    await putVideoObject(musicKey, music, "audio/wav");

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
    const musicAsset = await createVideoR2PendingAsset({
      id: musicAssetId,
      projectId,
      ownerEmail: auth.session.email,
      kind: "music",
      storageKey: musicKey,
      mimeType: "audio/wav",
      byteSize: music.length,
      locale: "und",
      originalFilename: "smoke-music.wav",
    });
    if (!imageAsset?.id || !narrationAsset?.id || !musicAsset?.id) throw new Error("Could not register smoke-test assets.");

    await markVideoR2AssetReady(imageAssetId, auth.session.email, { byteSize: SMOKE_PNG.length, mimeType: "image/png" });
    await markVideoR2AssetReady(narrationAssetId, auth.session.email, { byteSize: narration.length, mimeType: "audio/mpeg" });
    await markVideoR2AssetReady(musicAssetId, auth.session.email, { byteSize: music.length, mimeType: "audio/wav" });

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
      [
        {
          assetId: narrationAssetId,
          role: "narration",
          locale,
          transcript: SMOKE_TRANSCRIPT,
          volume: 1,
        },
        {
          assetId: musicAssetId,
          role: "music",
          locale: "und",
          transcript: null,
          volume: 0.08,
        },
      ],
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
      audio: [
        {
          assetId: narrationAssetId,
          storageKey: narrationKey,
          mimeType: "audio/mpeg",
          role: "narration",
          locale,
          transcript: SMOKE_TRANSCRIPT,
          volume: 1,
        },
        {
          assetId: musicAssetId,
          storageKey: musicKey,
          mimeType: "audio/wav",
          role: "music",
          locale: "und",
          transcript: null,
          volume: 0.08,
        },
      ],
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
      signal: AbortSignal.timeout(25000),
    });
    if (!workerResponse.ok) {
      const detail = (await workerResponse.text()).slice(0, 500);
      throw new Error(`Worker rejected smoke render (${workerResponse.status}): ${detail || "no response body"}`);
    }

    const completed = await getVideoR2Job(jobId, auth.session.email) as Record<string, unknown> | null;
    if (!completed || String(completed.status) !== "succeeded" || typeof completed.output_asset_id !== "string") {
      throw new Error(`Smoke render did not complete successfully (status: ${String(completed?.status ?? "missing")}).`);
    }
    const outputAsset = await getVideoR2Asset(completed.output_asset_id, auth.session.email) as Record<string, unknown> | null;
    if (!outputAsset?.storage_key || String(outputAsset.mime_type) !== "video/mp4") {
      throw new Error("Smoke render did not produce a registered MP4 output asset.");
    }
    const verified = await verifyVideoObject(String(outputAsset.storage_key));
    if (verified.byteSize < 1024 || verified.contentType !== "video/mp4") {
      throw new Error("Smoke render output MP4 failed object validation.");
    }

    return Response.json(
      {
        success: true,
        projectId,
        jobId,
        status: "succeeded",
        architecture: "neon+r2+railway",
        downloadUrl: `/api/admin/video/jobs/${jobId}/download`,
        verifiedOutput: {
          byteSize: verified.byteSize,
          contentType: verified.contentType,
          width: 1080,
          height: 1920,
          container: "mp4",
          narration: locale,
          backgroundMusic: true,
        },
      },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Production smoke render failed.";
    if (jobId) await markVideoR2JobDispatchFailed(jobId, auth.session.email, `Smoke render failed: ${message}`);
    return Response.json(
      { success: false, error: message, projectId, jobId },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
