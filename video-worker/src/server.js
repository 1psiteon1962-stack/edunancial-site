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
const RAW_BUCKET = process.env.RAW_VIDEO_BUCKET || "raw-videos";
const OUTPUT_BUCKET = process.env.PROCESSED_VIDEO_BUCKET || "processed-videos";
const MAX_SKEW_SECONDS = 300;
const replay = new Map();

if (SHARED_SECRET.length < 32) throw new Error("WORKER_SHARED_SECRET must be at least 32 characters");
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase worker credentials are required");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

function header(req, name) {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value || "";
}

function safeEqual(a, b) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function verify(req) {
  const timestamp = header(req, "x-worker-timestamp");
  const requestId = header(req, "x-worker-request-id");
  const signature = header(req, "x-worker-signature");
  if (!timestamp || !requestId || !signature) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > MAX_SKEW_SECONDS) return false;
  for (const [id, expires] of replay) if (expires < now) replay.delete(id);
  if (replay.has(requestId)) return false;
  const body = req.body?.length ? req.body.toString("utf8") : "";
  const bodyHash = crypto.createHash("sha256").update(body).digest("hex");
  const canonical = [timestamp, requestId, req.method.toUpperCase(), req.path, bodyHash].join("\n");
  const expected = crypto.createHmac("sha256", SHARED_SECRET).update(canonical).digest("hex");
  if (!safeEqual(signature, expected)) return false;
  replay.set(requestId, now + MAX_SKEW_SECONDS);
  return true;
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

async function setJob(jobId, values) {
  const { error } = await supabase.from("video_render_jobs").update({ ...values, updated_at: new Date().toISOString() }).eq("id", jobId);
  if (error) throw error;
}

async function render(job) {
  const jobId = job.jobId;
  const { data: existing, error: readError } = await supabase.from("video_render_jobs").select("id,status,output_path").eq("id", jobId).maybeSingle();
  if (readError) throw readError;
  if (existing?.status === "completed" && existing.output_path) return;
  await setJob(jobId, { status: "processing", error_message: null });
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "edunancial-video-"));
  try {
    const assets = Array.isArray(job.assets) ? job.assets : [];
    if (!assets.length) throw new Error("Render job contains no assets");
    const local = [];
    for (let i = 0; i < assets.length; i += 1) {
      const asset = assets[i];
      const ext = path.extname(asset.path || "") || ".jpg";
      const file = path.join(dir, `asset-${String(i).padStart(3, "0")}${ext}`);
      await download(asset.bucket || RAW_BUCKET, asset.path, file);
      local.push({ file, duration: Math.max(1, Math.min(Number(asset.durationSeconds || 4), 30)) });
    }
    const clips = [];
    for (let i = 0; i < local.length; i += 1) {
      const clip = path.join(dir, `clip-${String(i).padStart(3, "0")}.mp4`);
      await run("ffmpeg", ["-y", "-loop", "1", "-i", local[i].file, "-t", String(local[i].duration), "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p", "-r", "30", "-c:v", "libx264", "-preset", "veryfast", clip]);
      clips.push(clip);
    }
    const concat = path.join(dir, "concat.txt");
    await fs.writeFile(concat, clips.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n"));
    const output = path.join(dir, "output.mp4");
    await run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", concat, "-c", "copy", "-movflags", "+faststart", output]);
    const outputPath = `renders/${job.projectId}/${jobId}.mp4`;
    const bytes = await fs.readFile(output);
    const { error: uploadError } = await supabase.storage.from(OUTPUT_BUCKET).upload(outputPath, bytes, { contentType: "video/mp4", upsert: true });
    if (uploadError) throw uploadError;
    await setJob(jobId, { status: "completed", output_path: outputPath, completed_at: new Date().toISOString() });
  } catch (error) {
    await setJob(jobId, { status: "failed", error_message: error instanceof Error ? error.message.slice(0, 4000) : "Unknown render error" });
    throw error;
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

app.get("/health", (_req, res) => res.json({ ok: true, service: "edunancial-video-worker" }));

app.post("/v1/render", async (req, res) => {
  if (!verify(req)) return res.status(401).json({ error: "invalid_signature" });
  let job;
  try { job = JSON.parse(req.body.toString("utf8")); } catch { return res.status(400).json({ error: "invalid_json" }); }
  if (!job?.jobId || !job?.projectId) return res.status(400).json({ error: "invalid_job" });
  res.status(202).json({ accepted: true, jobId: job.jobId });
  render(job).catch((error) => console.error("render failed", job.jobId, error));
});

app.listen(PORT, "0.0.0.0", () => console.log(`video worker listening on ${PORT}`));
