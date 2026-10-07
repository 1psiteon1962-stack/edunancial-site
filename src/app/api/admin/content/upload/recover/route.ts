import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getRecoverableCurriculumPackages } from "@/lib/admin-content/recovery-discovery";
import { recoveryPublicationEnabled } from "@/lib/admin-content/recovery-publication-gate";
import { createRecoveryJob, getRecoveryJob, reapStaleRecoveryJob, updateRecoveryJob } from "@/lib/admin-content/recovery-jobs";
import { recoverStoredCurriculumPackage } from "@/lib/admin-content/recovery-worker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Fail closed. Production restoration requires an explicit deployment-time switch.
// The switch is global across tracks/levels/locales; package identity and the
// shared validator enforce the configured curriculum coordinate.
const RECOVERY_PUBLICATION_ENABLED = recoveryPublicationEnabled();

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;
  try {
    const candidates = await getRecoverableCurriculumPackages();
    const grouped = new Map<string, typeof candidates>();
    for (const candidate of candidates) grouped.set(candidate.batchId, [...(grouped.get(candidate.batchId) ?? []), candidate]);
    return Response.json({
      success: true,
      recoverable: Array.from(grouped, ([batchId, packages]) => ({
        batchId,
        uploads: packages.map(({ upload }) => upload),
        packages: packages.map(({ upload, identity, classificationError, reconciliationKey }) => ({
          uploadId: upload.uploadId,
          originalFilename: upload.originalFilename,
          storagePath: upload.storagePath,
          identity,
          classificationError,
          reconciliationKey,
        })),
      })),
      recoveryAvailable: RECOVERY_PUBLICATION_ENABLED,
      recoveryFrozen: !RECOVERY_PUBLICATION_ENABLED,
      discoverySource: "persistent-storage",
      readOnlyInventory: true,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ success: true, recoverable: [], recoveryAvailable: false, warning: "Interrupted-upload recovery could not inspect persistent upload storage.", error: error instanceof Error ? error.message : String(error) }, { headers: { "Cache-Control": "private, no-store" } });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  if (!RECOVERY_PUBLICATION_ENABLED) return Response.json({ success: false, error: "Interrupted-upload recovery is disabled during curriculum consolidation.", recoveryFrozen: true }, { status: 423 });
  const body = await request.json() as { batchId?: string; uploadId?: string };
  const batchId = String(body.batchId ?? "").trim();
  const uploadId = String(body.uploadId ?? "").trim();
  if (!batchId || !uploadId) return Response.json({ success: false, error: "batchId and uploadId are required." }, { status: 400 });

  const candidates = await getRecoverableCurriculumPackages();
  const candidate = candidates.find((entry) => entry.batchId === batchId && entry.upload.uploadId === uploadId);
  if (!candidate) return Response.json({ success: false, error: "Stored upload is unavailable, already finalized, or already recovered." }, { status: 404 });

  const job = await createRecoveryJob({ batchId, uploadId, actorEmail: auth.session.email });

  // Run recovery in the request that the admin explicitly initiated.
  // The previous implementation self-fetched a Netlify background-function URL.
  // Production proved that dispatch can return accepted while the worker never
  // boots, leaving a durable QUEUED job that is later reaped as FAILED.
  //
  // A single trusted curriculum package is small enough for the existing
  // maxDuration=60 route, and this removes the unreliable second invocation.
  const startedAt = new Date().toISOString();
  await updateRecoveryJob(job.id, {
    state: "RUNNING",
    phase: "STARTED",
    startedAt,
    heartbeatAt: startedAt,
    error: null,
  });

  try {
    const result = await recoverStoredCurriculumPackage({
      batchId: job.batchId,
      uploadId: job.uploadId,
      actor: { email: job.actorEmail },
      onPhase: async (phase) => {
        await updateRecoveryJob(
          job.id,
          { phase, heartbeatAt: new Date().toISOString() },
          (current) => current.state === "RUNNING",
        );
      },
    });
    await updateRecoveryJob(job.id, {
      state: "SUCCEEDED",
      phase: "LEARNER_VERIFIED_PUBLISHED",
      reviewBatchId: result.reviewBatchId,
      error: null,
      finishedAt: new Date().toISOString(),
    });
    return Response.json(
      { success: true, accepted: false, completed: true, jobId: job.id, uploadId, reviewBatchId: result.reviewBatchId },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    await updateRecoveryJob(job.id, {
      state: "FAILED",
      error: detail,
      finishedAt: new Date().toISOString(),
    }).catch(() => null);
    return Response.json(
      { success: false, error: `Recovery failed: ${detail}`, jobId: job.id, uploadId },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;
  const body = await request.json() as { jobId?: string };
  const jobId = String(body.jobId ?? "").trim();
  if (!jobId) return Response.json({ success: false, error: "jobId is required." }, { status: 400 });
  const found = await getRecoveryJob(jobId);
  if (!found) return Response.json({ success: false, error: "Recovery job not found." }, { status: 404 });
  if (found.actorEmail !== auth.session.email && auth.session.role !== "owner") return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
  const job = await reapStaleRecoveryJob(found);
  return Response.json({ success: true, job: { id: job.id, state: job.state, phase: job.phase ?? null, error: job.error, reviewBatchId: job.reviewBatchId, uploadId: job.uploadId, createdAt: job.createdAt, startedAt: job.startedAt ?? null, heartbeatAt: job.heartbeatAt ?? null, finishedAt: job.finishedAt ?? null, updatedAt: job.updatedAt } }, { headers: { "Cache-Control": "private, no-store" } });
}
