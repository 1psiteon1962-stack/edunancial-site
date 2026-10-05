import { getRecoveryJob, updateRecoveryJob } from "../../src/lib/admin-content/recovery-jobs";
import { recoverStoredCurriculumPackage } from "../../src/lib/admin-content/recovery-worker";

export default async (request: Request) => {
  let jobId = "";
  try {
    const body = await request.json() as { jobId?: string; token?: string };
    jobId = String(body.jobId ?? "");
    const token = String(body.token ?? "");
    const job = await getRecoveryJob(jobId);
    if (!job || !token || token !== job.token) {
      console.error("[curriculum-recovery-background] rejected invalid job token");
      return;
    }
    if (job.state === "SUCCEEDED") return;
    await updateRecoveryJob(job.id, { state: "RUNNING", error: null });
    const result = await recoverStoredCurriculumPackage({
      batchId: job.batchId,
      uploadId: job.uploadId,
      actor: { email: job.actorEmail },
    });
    await updateRecoveryJob(job.id, { state: "SUCCEEDED", reviewBatchId: result.reviewBatchId, error: null });
  } catch (error) {
    console.error("[curriculum-recovery-background] failed", error);
    if (jobId) {
      try { await updateRecoveryJob(jobId, { state: "FAILED", error: error instanceof Error ? error.message : String(error) }); } catch {}
    }
  }
};
