import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.raw({ type: "application/json", limit: "1mb" }));

const PORT = Number(process.env.PORT || 8080);
const SHARED_SECRET = process.env.WORKER_SHARED_SECRET || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const OUTPUT_BUCKET = process.env.PROCESSED_VIDEO_BUCKET || "processed-videos";
const MAX_SKEW_SECONDS = 300;

if (SHARED_SECRET.length < 32) throw new Error("WORKER_SHARED_SECRET must be at least 32 characters");
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase worker credentials are required");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function header(req, name) {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value || "";
}

function safeEqualHex(a, b) {
  if (!/^[0-9a-f]{64}$/iu.test(a) || !/^[0-9a-f]{64}$/iu.test(b)) return false;
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function verifySignature(req) {
  const timestamp = header(req, "x-edunancial-timestamp");
  const requestId = header(req, "x-edunancial-request-id");
  const signature = header(req, "x-edunancial-signature");
  if (!timestamp || !requestId || !signature) return { ok: false };

  const numericTimestamp = Number(timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(numericTimestamp) || Math.abs(now - numericTimestamp) > MAX_SKEW_SECONDS) return { ok: false };
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(requestId)) return { ok: false };

  const body = req.body?.length ? req.body.toString("utf8") : "";
  const bodyHash = crypto.createHash("sha256").update(body).digest("hex");
  const canonical = [timestamp, requestId, req.method.toUpperCase(), req.path, bodyHash].join("\n");
  const expected = crypto.createHmac("sha256", SHARED_SECRET).update(canonical).digest("hex");
  return { ok: safeEqualHex(signature, expected), requestId, body };
}

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}: ${stderr.slice(-4000)}`)));
  });
}

async function download(bucket, objectPath, destination) {
  const { data, error } = await supabase.storage.from(bucket).download(objectPath);
  if (error || !data) throw error || new Error(`Unable to download ${objectPath}`);
  await fs.writeFile(destination, Buffer.from(await data.arrayBuffer()));
}

async function updateJob(jobId, values) {
  const { error } = await supabase
    .from("video_jobs")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", jobId);
  if (error) throw error;
}

async function recordRequest(requestId, jobId) {
  const { error } = await supabase.from("video_worker_requests").insert({ request_id: requestId, job_id: jobId });
  if (!error) return true;
  if (String(error.code) === "23505") return false;
  throw error;
}

async function render(jobId) {
  const { data: job, error: jobError } = await supabase
    .from("video_jobs")
    .select("id,project_id,source_asset_id,output_asset_id,status,attempt_count,edit_recipe")
    .eq("id", jobId)
    .single();
  if (jobError || !job) throw jobError || new Error("Video job not found");
  if (job.status === "succeeded" && job.output_asset_id) return;

  const { data: asset, error: assetError } = await supabase
    .from("video_assets")
    .select("id,storage_bucket,storage_path,original_filename,mime_type")
    .eq("id", job.source_asset_id)
    .single();
  if (assetError || !asset) throw assetError || new Error("Source asset not found");

  const attempt = Number(job.attempt_count || 0) + 1;
  await updateJob(jobId, {
    status: "processing",
    attempt_count: attempt,
    started_at: new Date().toISOString(),
    completed_at: null,
    last_error: null,
  });
  await supabase.from("video_projects").update({ status: "processing", updated_at: new Date().toISOString() }).eq("id", job.project_id);

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "edunancial-video-"));
  try {
    const ext = path.extname(asset.original_filename || asset.storage_path || "") || (asset.mime_type?.startsWith("image/") ? ".jpg" : ".mp4");
    const input = path.join(dir, `source${ext}`);
    const output = path.join(dir, "master.mp4");
    await download(asset.storage_bucket, asset.storage_path, input);

    const recipe = job.edit_recipe && typeof job.edit_recipe === "object" ? job.edit_recipe : {};
    const trimStart = Math.max(0, Number(recipe.trimStart || 0));
    const trimEnd = recipe.trimEnd === null || recipe.trimEnd === undefined ? null : Number(recipe.trimEnd);
    const duration = trimEnd !== null && Number.isFinite(trimEnd) && trimEnd > trimStart ? trimEnd - trimStart : null;
    const verticalFilter = "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p";

    if (asset.mime_type?.startsWith("image/")) {
      const stillSeconds = Math.max(1, Math.min(Number(recipe.durationSeconds || 6), 60));
      await run("ffmpeg", [
        "-y", "-loop", "1", "-i", input, "-t", String(stillSeconds),
        "-vf", verticalFilter, "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-movflags", "+faststart", output,
      ]);
    } else {
      const args = ["-y"];
      if (trimStart > 0) args.push("-ss", String(trimStart));
      args.push("-i", input);
      if (duration !== null) args.push("-t", String(duration));
      args.push("-vf", verticalFilter, "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", output);
      await run("ffmpeg", args);
    }

    const outputPath = `projects/${job.project_id}/master/${jobId}/master.mp4`;
    const bytes = await fs.readFile(output);
    const { error: uploadError } = await supabase.storage
      .from(OUTPUT_BUCKET)
      .upload(outputPath, bytes, { contentType: "video/mp4", upsert: true });
    if (uploadError) throw uploadError;

    const { data: outputAsset, error: outputAssetError } = await supabase
      .from("video_assets")
      .insert({
        project_id: job.project_id,
        asset_type: "EDITED_MASTER",
        storage_bucket: OUTPUT_BUCKET,
        storage_path: outputPath,
        original_filename: "master.mp4",
        mime_type: "video/mp4",
        byte_size: bytes.length,
      })
      .select("id")
      .single();
    if (outputAssetError || !outputAsset) throw outputAssetError || new Error("Could not register rendered master");

    await updateJob(jobId, {
      status: "succeeded",
      output_asset_id: outputAsset.id,
      completed_at: new Date().toISOString(),
      last_error: null,
    });
    await supabase.from("video_projects").update({ status: "master_ready", updated_at: new Date().toISOString() }).eq("id", job.project_id);
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 4000) : "Unknown render error";
    await updateJob(jobId, { status: "failed", last_error: message, completed_at: new Date().toISOString() }).catch(() => undefined);
    await supabase.from("video_projects").update({ status: "failed", updated_at: new Date().toISOString() }).eq("id", job.project_id).then(() => undefined);
    throw error;
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

app.get("/health", (_req, res) => res.json({ ok: true, service: "edunancial-video-worker" }));

app.post("/internal/jobs/:jobId/execute", async (req, res) => {
  const verified = verifySignature(req);
  if (!verified.ok) return res.status(401).json({ error: "invalid_signature" });

  let body;
  try { body = JSON.parse(verified.body || "{}"); } catch { return res.status(400).json({ error: "invalid_json" }); }
  const jobId = req.params.jobId;
  if (!/^[0-9a-f-]{36}$/iu.test(jobId) || body?.jobId !== jobId) return res.status(400).json({ error: "invalid_job" });

  try {
    const accepted = await recordRequest(verified.requestId, jobId);
    if (!accepted) return res.status(409).json({ error: "replayed_request" });
  } catch (error) {
    console.error("request replay registration failed", jobId, error);
    return res.status(500).json({ error: "request_registration_failed" });
  }

  res.status(202).json({ accepted: true, jobId });
  render(jobId).catch((error) => console.error("render failed", jobId, error));
});

app.listen(PORT, "0.0.0.0", () => console.log(`video worker listening on ${PORT}`));
