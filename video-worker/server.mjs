import http from "node:http";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const PORT = Number(process.env.PORT || 8080);
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const WORKER_SHARED_SECRET = (process.env.WORKER_SHARED_SECRET || "").trim();

function requireConfig() {
  if (!SUPABASE_URL) throw new Error("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required");
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  if (WORKER_SHARED_SECRET.length < 32) throw new Error("WORKER_SHARED_SECRET must be at least 32 characters");
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(body) });
  res.end(body);
}

function collect(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1024 * 1024) { reject(new Error("Request body too large")); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function verifySignature(req, path, body) {
  const timestamp = req.headers["x-edunancial-timestamp"];
  const requestId = req.headers["x-edunancial-request-id"];
  const signature = req.headers["x-edunancial-signature"];
  if (typeof timestamp !== "string" || typeof requestId !== "string" || typeof signature !== "string") throw new Error("Missing worker authentication headers");
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) throw new Error("Worker request timestamp is stale");
  const bodyHash = createHash("sha256").update(body).digest("hex");
  const canonical = [timestamp, requestId, req.method.toUpperCase(), path, bodyHash].join("\n");
  const expected = createHmac("sha256", WORKER_SHARED_SECRET).update(canonical).digest("hex");
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("Invalid worker signature");
  return requestId;
}

function run(cmd, args, label = cmd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (d) => { stderr = (stderr + d.toString()).slice(-12000); });
    child.on("error", (error) => reject(new Error(`${label} could not start: ${error.message}`)));
    child.on("close", (code, signal) => {
      if (code === 0) return resolve();
      const termination = signal ? `signal ${signal}` : `exit code ${code}`;
      reject(new Error(`${label} failed (${termination}): ${stderr.slice(-6000) || "no ffmpeg diagnostics"}`));
    });
  });
}

async function downloadToFile(supabase, bucket, path, filePath) {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error || !data) throw new Error(error?.message || `Could not download ${bucket}/${path}`);
  await writeFile(filePath, Buffer.from(await data.arrayBuffer()));
}

async function executeJob(jobId, requestId) {
  requireConfig();
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: replayError } = await supabase.from("video_worker_requests").insert({ request_id: requestId, job_id: jobId });
  if (replayError) throw new Error(`Duplicate or invalid worker request: ${replayError.message}`);
  const { data: job, error: jobError } = await supabase.from("video_jobs").select("id,project_id,status").eq("id", jobId).single();
  if (jobError || !job) throw new Error(jobError?.message || "Video job not found");
  if (job.status === "succeeded") return { status: "succeeded" };
  await supabase.from("video_jobs").update({ status: "processing", started_at: new Date().toISOString(), attempt_count: 1, last_error: null }).eq("id", jobId);
  await supabase.from("video_projects").update({ status: "processing", updated_at: new Date().toISOString() }).eq("id", job.project_id);

  const dir = await mkdtemp(join(tmpdir(), "edunancial-video-"));
  try {
    const { data: scenes, error: scenesError } = await supabase.from("video_scenes").select("scene_order,duration_seconds,overlay_text,fit_mode,transition_type,transition_seconds,video_assets(storage_bucket,storage_path,mime_type)").eq("project_id", job.project_id).order("scene_order");
    if (scenesError || !scenes?.length) throw new Error(scenesError?.message || "No video scenes found");
    const sceneFiles = [];
    for (const [index, scene] of scenes.entries()) {
      const asset = Array.isArray(scene.video_assets) ? scene.video_assets[0] : scene.video_assets;
      if (!asset?.storage_bucket || !asset?.storage_path) throw new Error(`Scene ${index + 1} asset is unavailable`);
      const input = join(dir, `scene-${index}-input`);
      await downloadToFile(supabase, asset.storage_bucket, asset.storage_path, input);
      const output = join(dir, `scene-${index}.mp4`);
      const duration = Math.max(1, Math.min(60, Number(scene.duration_seconds || 6)));
      const isImage = String(asset.mime_type || "").startsWith("image/");
      const inputArgs = isImage ? ["-loop", "1", "-t", String(duration), "-i", input] : ["-i", input, "-t", String(duration)];
      const vf = "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,fps=30,format=yuv420p";
      await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...inputArgs, "-vf", vf, "-an", "-c:v", "libx264", "-preset", "ultrafast", "-threads", "1", "-filter_threads", "1", "-pix_fmt", "yuv420p", "-movflags", "+faststart", output], `scene ${index + 1} render`);
      sceneFiles.push({ output, duration });
    }

    const listFile = join(dir, "concat.txt");
    await writeFile(listFile, sceneFiles.map((s) => `file '${s.output.replace(/'/g, "'\\''")}'`).join("\n"));
    const visual = join(dir, "visual.mp4");
    await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", "-movflags", "+faststart", visual], "scene assembly");

    const { data: audioTracks, error: audioError } = await supabase.from("video_audio_tracks").select("track_type,volume,muted,video_assets(storage_bucket,storage_path,mime_type)").eq("project_id", job.project_id).order("created_at");
    if (audioError) throw new Error(audioError.message);
    const narration = (audioTracks || []).find((t) => !t.muted && ["ORIGINAL_NARRATION", "TRANSLATED_NARRATION"].includes(t.track_type));
    const music = (audioTracks || []).find((t) => !t.muted && t.track_type === "BACKGROUND_MUSIC");
    const output = join(dir, "master.mp4");

    if (!narration && !music) {
      await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", visual, "-c", "copy", "-movflags", "+faststart", output], "final video copy");
    } else {
      const args = ["-hide_banner", "-loglevel", "error", "-y", "-i", visual];
      const filters = [];
      let inputIndex = 1;
      let narrationLabel = null;
      let musicLabel = null;
      for (const track of [narration, music]) {
        if (!track) continue;
        const asset = Array.isArray(track.video_assets) ? track.video_assets[0] : track.video_assets;
        if (!asset?.storage_bucket || !asset?.storage_path) continue;
        const local = join(dir, `audio-${inputIndex}`);
        await downloadToFile(supabase, asset.storage_bucket, asset.storage_path, local);
        args.push("-i", local);
        const label = track.track_type === "BACKGROUND_MUSIC" ? "music" : "narr";
        filters.push(`[${inputIndex}:a]volume=${Number(track.volume ?? 1)}[${label}]`);
        if (label === "music") musicLabel = `[${label}]`; else narrationLabel = `[${label}]`;
        inputIndex += 1;
      }
      let audioMap = narrationLabel || musicLabel;
      if (narrationLabel && musicLabel) { filters.push(`${narrationLabel}${musicLabel}amix=inputs=2:duration=longest:dropout_transition=2[aout]`); audioMap = "[aout]"; }
      if (filters.length) args.push("-filter_complex", filters.join(";"));
      args.push("-map", "0:v:0");
      if (audioMap) args.push("-map", audioMap);
      args.push("-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-threads", "1", "-shortest", "-movflags", "+faststart", output);
      await run("ffmpeg", args, "audio mix/finalization");
    }

    const bytes = await readFile(output);
    if (!bytes.length) throw new Error("Rendered master is empty");
    const storagePath = `projects/${job.project_id}/processed/${job.id}-master.mp4`;
    const { error: uploadError } = await supabase.storage.from("processed-videos").upload(storagePath, bytes, { contentType: "video/mp4", upsert: true });
    if (uploadError) throw new Error(uploadError.message);
    const { data: outputAsset, error: assetError } = await supabase.from("video_assets").insert({ project_id: job.project_id, asset_type: "EDITED_MASTER", storage_bucket: "processed-videos", storage_path: storagePath, original_filename: `${job.id}-master.mp4`, mime_type: "video/mp4", byte_size: bytes.length }).select("id").single();
    if (assetError || !outputAsset) throw new Error(assetError?.message || "Could not register rendered master");
    await supabase.from("video_jobs").update({ status: "succeeded", output_asset_id: outputAsset.id, completed_at: new Date().toISOString(), last_error: null }).eq("id", job.id);
    await supabase.from("video_projects").update({ status: "master_ready", updated_at: new Date().toISOString() }).eq("id", job.project_id);
    return { status: "succeeded", outputAssetId: outputAsset.id, storagePath };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Video render failed";
    await supabase.from("video_jobs").update({ status: "failed", last_error: message.slice(0, 4000), completed_at: new Date().toISOString() }).eq("id", jobId);
    await supabase.from("video_projects").update({ status: "failed", updated_at: new Date().toISOString() }).eq("id", job.project_id);
    throw error;
  } finally { await rm(dir, { recursive: true, force: true }); }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") { requireConfig(); return json(res, 200, { ok: true, service: "edunancial-video-worker" }); }
    const match = req.url?.match(/^\/internal\/jobs\/([0-9a-f-]{36})\/execute$/i);
    if (req.method === "POST" && match) {
      const body = await collect(req);
      const requestId = verifySignature(req, req.url, body);
      const parsed = JSON.parse(body || "{}");
      if (parsed.jobId !== match[1]) return json(res, 400, { ok: false, error: "Job ID mismatch" });
      const result = await executeJob(match[1], requestId);
      return json(res, 202, { ok: true, ...result });
    }
    return json(res, 404, { ok: false, error: "Not found" });
  } catch (error) { return json(res, 500, { ok: false, error: error instanceof Error ? error.message : "Worker failure" }); }
});

server.requestTimeout = 0;
server.headersTimeout = 310000;
server.keepAliveTimeout = 65000;
server.listen(PORT, "0.0.0.0", () => console.log(`edunancial-video-worker listening on ${PORT}`));
