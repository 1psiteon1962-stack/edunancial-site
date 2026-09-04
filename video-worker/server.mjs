import http from "node:http";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const PORT = Number(process.env.PORT || 8080);
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const WORKER_SHARED_SECRET = (process.env.WORKER_SHARED_SECRET || "").trim();
const activeJobs = new Set();

function requireConfig() {
  if (!SUPABASE_URL) throw new Error("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required");
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  if (WORKER_SHARED_SECRET.length < 32) throw new Error("WORKER_SHARED_SECRET must be at least 32 characters");
}
function json(res, status, payload) { const body = JSON.stringify(payload); res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(body) }); res.end(body); }
function collect(req) { return new Promise((resolve, reject) => { const chunks=[]; let size=0; req.on("data", c=>{ size+=c.length; if(size>1024*1024){reject(new Error("Request body too large"));req.destroy();return;} chunks.push(c);}); req.on("end",()=>resolve(Buffer.concat(chunks).toString("utf8"))); req.on("error",reject); }); }
function verifySignature(req,path,body){const timestamp=req.headers["x-edunancial-timestamp"],requestId=req.headers["x-edunancial-request-id"],signature=req.headers["x-edunancial-signature"];if(typeof timestamp!=="string"||typeof requestId!=="string"||typeof signature!=="string")throw new Error("Missing worker authentication headers");const age=Math.abs(Math.floor(Date.now()/1000)-Number(timestamp));if(!Number.isFinite(age)||age>300)throw new Error("Worker request timestamp is stale");const bodyHash=createHash("sha256").update(body).digest("hex"),canonical=[timestamp,requestId,req.method.toUpperCase(),path,bodyHash].join("\n"),expected=createHmac("sha256",WORKER_SHARED_SECRET).update(canonical).digest("hex"),a=Buffer.from(signature),b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))throw new Error("Invalid worker signature");return requestId;}
function diagnosticTail(text){return text.split("\n").filter(l=>l.trim()&&!l.includes("configuration:")).slice(-30).join("\n").slice(-5000);}
function run(cmd,args,label=cmd){return new Promise((resolve,reject)=>{const child=spawn(cmd,args,{stdio:["ignore","ignore","pipe"]});let stderr="";child.stderr.on("data",d=>{stderr=(stderr+d.toString()).slice(-16000);});child.on("error",e=>reject(new Error(`${label} could not start: ${e.message}`)));child.on("close",(code,signal)=>{if(code===0)return resolve();const term=signal?`signal ${signal}`:`exit code ${code}`;reject(new Error(`${label} failed (${term}): ${diagnosticTail(stderr)||"no useful ffmpeg diagnostics"}`));});});}
async function downloadToFile(supabase,bucket,path,filePath){const {data,error}=await supabase.storage.from(bucket).download(path);if(error||!data)throw new Error(error?.message||`Could not download ${bucket}/${path}`);await writeFile(filePath,Buffer.from(await data.arrayBuffer()));}

async function executeJob(jobId,requestId){
  requireConfig();
  const supabase=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  const {error:replayError}=await supabase.from("video_worker_requests").insert({request_id:requestId,job_id:jobId});
  if(replayError) throw new Error(`Duplicate or invalid worker request: ${replayError.message}`);
  const {data:job,error:jobError}=await supabase.from("video_jobs").select("id,project_id,status,attempt_count").eq("id",jobId).single();
  if(jobError||!job)throw new Error(jobError?.message||"Video job not found");
  if(job.status==="succeeded")return;
  await supabase.from("video_jobs").update({status:"processing",started_at:new Date().toISOString(),attempt_count:Number(job.attempt_count||0)+1,last_error:null}).eq("id",jobId);
  await supabase.from("video_projects").update({status:"processing",updated_at:new Date().toISOString()}).eq("id",job.project_id);
  const dir=await mkdtemp(join(tmpdir(),"edunancial-video-"));
  try{
    const {data:scenes,error:scenesError}=await supabase.from("video_scenes").select("scene_order,duration_seconds,fit_mode,video_assets(storage_bucket,storage_path,mime_type)").eq("project_id",job.project_id).order("scene_order");
    if(scenesError||!scenes?.length)throw new Error(scenesError?.message||"No video scenes found");
    const sceneFiles=[];
    for(const [index,scene] of scenes.entries()){
      const asset=Array.isArray(scene.video_assets)?scene.video_assets[0]:scene.video_assets;if(!asset?.storage_bucket||!asset?.storage_path)throw new Error(`Scene ${index+1} asset unavailable`);
      const input=join(dir,`input-${index}`),normalized=join(dir,`normalized-${index}.png`),output=join(dir,`scene-${index}.mp4`);await downloadToFile(supabase,asset.storage_bucket,asset.storage_path,input);
      const duration=Math.max(1,Math.min(60,Number(scene.duration_seconds||6))),isImage=String(asset.mime_type||"").startsWith("image/");
      let renderInput=input;
      if(isImage){await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",input,"-vf","scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black","-frames:v","1","-threads","1",normalized],`scene ${index+1} normalize`);await rm(input,{force:true});renderInput=normalized;}
      const inputArgs=isImage?["-loop","1","-t",String(duration),"-i",renderInput]:["-i",renderInput,"-t",String(duration)];
      const vf=isImage?"fps=30,format=yuv420p":"scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,fps=30,format=yuv420p";
      await run("ffmpeg",["-hide_banner","-loglevel","error","-y",...inputArgs,"-vf",vf,"-an","-c:v","libx264","-preset","ultrafast","-threads","1","-filter_threads","1","-pix_fmt","yuv420p","-movflags","+faststart",output],`scene ${index+1} render`);
      await rm(renderInput,{force:true});sceneFiles.push(output);
    }
    const listFile=join(dir,"concat.txt");await writeFile(listFile,sceneFiles.map(s=>`file '${s.replace(/'/g,"'\\''")}'`).join("\n"));const visual=join(dir,"visual.mp4");
    await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",listFile,"-c","copy","-movflags","+faststart",visual],"scene assembly");
    for(const f of sceneFiles)await rm(f,{force:true});await rm(listFile,{force:true});
    const {data:tracks,error:audioError}=await supabase.from("video_audio_tracks").select("track_type,volume,muted,video_assets(storage_bucket,storage_path,mime_type)").eq("project_id",job.project_id).order("created_at");if(audioError)throw new Error(audioError.message);
    const narration=(tracks||[]).find(t=>!t.muted&&["ORIGINAL_NARRATION","TRANSLATED_NARRATION"].includes(t.track_type)),music=(tracks||[]).find(t=>!t.muted&&t.track_type==="BACKGROUND_MUSIC"),master=join(dir,"master.mp4");
    if(!narration&&!music)await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",visual,"-c","copy","-movflags","+faststart",master],"final video copy");else{const args=["-hide_banner","-loglevel","error","-y","-i",visual],filters=[];let idx=1,nLabel=null,mLabel=null;for(const track of[narration,music]){if(!track)continue;const a=Array.isArray(track.video_assets)?track.video_assets[0]:track.video_assets;if(!a?.storage_bucket||!a?.storage_path)continue;const local=join(dir,`audio-${idx}`);await downloadToFile(supabase,a.storage_bucket,a.storage_path,local);args.push("-i",local);const label=track.track_type==="BACKGROUND_MUSIC"?"music":"narr";filters.push(`[${idx}:a]volume=${Number(track.volume??1)}[${label}]`);if(label==="music")mLabel=`[${label}]`;else nLabel=`[${label}]`;idx++;}let map=nLabel||mLabel;if(nLabel&&mLabel){filters.push(`${nLabel}${mLabel}amix=inputs=2:duration=longest:dropout_transition=2[aout]`);map="[aout]";}if(filters.length)args.push("-filter_complex",filters.join(";"));args.push("-map","0:v:0");if(map)args.push("-map",map);args.push("-c:v","copy","-c:a","aac","-b:a","128k","-threads","1","-shortest","-movflags","+faststart",master);await run("ffmpeg",args,"audio mix/finalization");}
    await rm(visual,{force:true});
    await run("ffprobe",["-v","error","-select_streams","v:0","-show_entries","stream=codec_name,width,height","-of","default=noprint_wrappers=1",master],"final output validation");
    const info=await stat(master);if(info.size<=0)throw new Error("Rendered master is empty");const bytes=await readFile(master),storagePath=`projects/${job.project_id}/processed/${job.id}-master.mp4`;
    const {error:uploadError}=await supabase.storage.from("processed-videos").upload(storagePath,bytes,{contentType:"video/mp4",upsert:true});if(uploadError)throw new Error(uploadError.message);
    const {data:out,error:assetError}=await supabase.from("video_assets").insert({project_id:job.project_id,asset_type:"EDITED_MASTER",storage_bucket:"processed-videos",storage_path:storagePath,original_filename:`${job.id}-master.mp4`,mime_type:"video/mp4",byte_size:info.size}).select("id").single();if(assetError||!out)throw new Error(assetError?.message||"Could not register rendered master");
    await supabase.from("video_jobs").update({status:"succeeded",output_asset_id:out.id,completed_at:new Date().toISOString(),last_error:null}).eq("id",job.id);await supabase.from("video_projects").update({status:"master_ready",updated_at:new Date().toISOString()}).eq("id",job.project_id);
  }catch(error){const message=error instanceof Error?error.message:"Video render failed";await supabase.from("video_jobs").update({status:"failed",last_error:message.slice(0,4000),completed_at:new Date().toISOString()}).eq("id",jobId);await supabase.from("video_projects").update({status:"failed",updated_at:new Date().toISOString()}).eq("id",job.project_id);throw error;}finally{await rm(dir,{recursive:true,force:true});}
}
function launch(jobId,requestId){if(activeJobs.has(jobId))return false;activeJobs.add(jobId);setImmediate(()=>{executeJob(jobId,requestId).catch(e=>console.error(`video job ${jobId} failed:`,e.message)).finally(()=>activeJobs.delete(jobId));});return true;}
const server=http.createServer(async(req,res)=>{try{if(req.method==="GET"&&req.url==="/health"){requireConfig();return json(res,200,{ok:true,service:"edunancial-video-worker",activeJobs:activeJobs.size});}const match=req.url?.match(/^\/internal\/jobs\/([0-9a-f-]{36})\/execute$/i);if(req.method==="POST"&&match){const body=await collect(req),requestId=verifySignature(req,req.url,body),parsed=JSON.parse(body||"{}");if(parsed.jobId!==match[1])return json(res,400,{ok:false,error:"Job ID mismatch"});const accepted=launch(match[1],requestId);return json(res,202,{ok:true,status:accepted?"accepted":"already_processing",jobId:match[1]});}return json(res,404,{ok:false,error:"Not found"});}catch(error){return json(res,500,{ok:false,error:error instanceof Error?error.message:"Worker failure"});}});
server.requestTimeout=15000;server.headersTimeout=20000;server.keepAliveTimeout=5000;server.listen(PORT,"0.0.0.0",()=>console.log(`edunancial-video-worker listening on ${PORT}`));