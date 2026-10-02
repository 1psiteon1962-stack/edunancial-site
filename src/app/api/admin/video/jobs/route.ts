import { createHash } from "node:crypto";
import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import {
  createVideoR2Job,
  getActiveVideoR2Job,
  getVideoR2FrozenComposition,
  markVideoR2JobDispatchFailed,
} from "@/lib/video/repository";
import { signWorkerRequest } from "@/lib/video-pipeline/hmac";

function getWorkerBaseUrl() {
  const baseUrl = process.env.WORKER_BASE_URL?.trim().replace(/\/+$/u, "");
  if (!baseUrl) throw new Error("WORKER_BASE_URL is not configured.");
  if (!/^https:\/\//iu.test(baseUrl) && process.env.NODE_ENV === "production") throw new Error("WORKER_BASE_URL must use HTTPS in production.");
  return baseUrl;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  let jobId: string | null = null;
  try {
    const body = (await request.json()) as { projectId?: unknown; editRecipe?: unknown };
    const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(projectId)) throw new Error("A valid projectId is required.");

    const frozen = await getVideoR2FrozenComposition(projectId, auth.session.email);
    if (!frozen || !frozen.scenes.length) throw new Error("A saved Video Maker composition is required before rendering.");

    const active = await getActiveVideoR2Job(projectId, auth.session.email, frozen.locale);
    if (active) {
      return Response.json(
        { success: true, projectId, jobId: active.id, status: active.status, alreadyQueued: true },
        { status: 202, headers: { "Cache-Control": "private, no-store" } },
      );
    }

    const composition = {
      outputProfile: frozen.workerProfile,
      scenes: frozen.scenes,
      audio: frozen.audio,
    };
    const serialized = JSON.stringify(composition);
    const compositionHash = createHash("sha256").update(serialized).digest("hex");
    const idempotencyKey = compositionHash;

    const job = await createVideoR2Job({
      projectId,
      ownerEmail: auth.session.email,
      locale: frozen.locale,
      outputProfile: frozen.outputProfile as "vertical_1080x1920" | "landscape_1920x1080" | "square_1080x1080",
      composition,
      compositionHash,
      idempotencyKey,
    });
    if (!job?.id) throw new Error("Could not queue video job.");
    jobId = String(job.id);

    const path = `/internal/jobs/${jobId}/execute`;
    const payload = JSON.stringify({ jobId });
    const signed = signWorkerRequest("POST", path, payload);
    const workerResponse = await fetch(`${getWorkerBaseUrl()}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-edunancial-timestamp": signed.timestamp,
        "x-edunancial-request-id": signed.requestId,
        "x-edunancial-signature": signed.signature,
      },
      body: payload,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!workerResponse.ok) {
      const message = (await workerResponse.text()).slice(0, 500);
      throw new Error(`Worker rejected dispatch (${workerResponse.status}): ${message || "no response body"}`);
    }

    return Response.json(
      { success: true, projectId, jobId, status: "queued" },
      { status: 202, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not trigger video worker.";
    if (jobId) await markVideoR2JobDispatchFailed(jobId, auth.session.email, `Dispatch failed: ${message}`);
    return Response.json({ success: false, error: message }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
}
