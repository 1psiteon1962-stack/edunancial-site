import http from "node:http";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import postgres from "postgres";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const PORT=Number(process.env.PORT||8080);
const DATABASE_URL=process.env.DATABASE_URL||"";
const WORKER_SHARED_SECRET=(process.env.WORKER_SHARED_SECRET||"").trim();
const endpoint=process.env.VIDEO_R2_ENDPOINT||"",bucket=process.env.VIDEO_R2_BUCKET||"";
const accessKeyId=process.env.VIDEO_R2_ACCESS_KEY_ID||"",secretAccessKey=process.env.VIDEO_R2_SECRET_ACCESS_KEY||"";
const worker=process.env.RAILWAY_SERVICE_ID||"railway-video-worker";
function verifySignedDispatch(req,path,body){
 const ts=String(req.headers["x-edunancial-timestamp"]||""),requestId=String(req.headers["x-edunancial-request-id"]||""),supplied=String(req.headers["x-edunancial-signature"]||"");
 if(!WORKER_SHARED_SECRET||WORKER_SHARED_SECRET.length<32)return false;
 if(!/^\d{10,}$/u.test(ts)||!requestId||!/^[a-f0-9]{64}$/u.test(supplied))return false;
 const age=Math.abs(Math.floor(Date.now()/1000)-Number(ts));if(!Number.isFinite(age)||age>300)return false;
 const bodyHash=createHash("sha256").update(body).digest("hex"),canonical=[ts,requestId,"POST",path,bodyHash].join("\n");
 const expected=createHmac("sha256",WORKER_SHARED_SECRET).update(canonical).digest("hex");
 const a=Buffer.from(supplied),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b);
}

function config(){if(!DATABASE_URL)throw Error("DATABASE_URL required");if(!endpoint||!bucket||!accessKeyId||!secretAccessKey)throw Error("VIDEO_R2 object storage required");}
const sql=()=>postgres(DATABASE_URL,{max:2,prepare:false});
const s3=()=>new S3Client({region:"auto",endpoint,credentials:{accessKeyId,secretAccessKey}});
function json(res,n,v){const b=JSON.stringify(v);res.writeHead(n,{"content-type":"application/json","content-length":Buffer.byteLength(b)});res.end(b)}
function run(cmd,args){return new Promise((ok,no)=>{const p=spawn(cmd,args,{stdio:["ignore","ignore","pipe"]});let e="";p.stderr.on("data",d=>e=(e+d).slice(-6000));p.on("error",no);p.on("close",c=>c===0?ok():no(Error(cmd+" failed: "+e)))})}
async function bytes(body){const a=[];for await(const c of body)a.push(c);return Buffer.concat(a)}
async function get(key,file){const r=await s3().send(new GetObjectCommand({Bucket:bucket,Key:key}));await writeFile(file,await bytes(r.Body))}
async function execute(jobId){
 config();const db=sql();let claim;
 try{
  [claim]=await db`select * from video_r2_claim_job(${jobId||null}::uuid,${worker})`;
  if(!claim)return {status:"no_claim"};
  const c=claim.composition;if(!c?.scenes?.length)throw Error("Frozen composition has no scenes");
  const dir=await mkdtemp(join(tmpdir(),"video-r2-"));
  try{
   const dims=c.outputProfile==="landscape"?"1920:1080":c.outputProfile==="square"?"1080:1080":"1080:1920";
   const clips=[];
   for(let i=0;i<c.scenes.length;i++){const x=c.scenes[i],src=join(dir,"in"+i),out=join(dir,"s"+i+".mp4");await get(x.storageKey,src);
    const vf=`scale=${dims}:force_original_aspect_ratio=${x.fit==="cover"?"increase":"decrease"},crop=${dims},fps=30,format=yuv420p`;
    await run("ffmpeg",["-y","-loop","1","-t",String(x.durationSeconds),"-i",src,"-vf",vf,"-an","-c:v","libx264","-preset","veryfast","-pix_fmt","yuv420p",out]);clips.push(out)}
   const list=join(dir,"list.txt");await writeFile(list,clips.map(x=>`file '${x}'`).join("\n"));const visual=join(dir,"visual.mp4");
   await run("ffmpeg",["-y","-f","concat","-safe","0","-i",list,"-c","copy",visual]);
   const master=join(dir,"master.mp4"),audio=c.audio||[];
   if(!audio.length)await run("ffmpeg",["-y","-i",visual,"-c","copy","-movflags","+faststart",master]);
   else{const args=["-y","-i",visual],filters=[];for(let i=0;i<audio.length;i++){const a=audio[i],f=join(dir,"a"+i);await get(a.storageKey,f);args.push("-i",f);filters.push(`[${i+1}:a]volume=${Number(a.volume??1)}[a${i}]`)}
    let map="[a0]";if(audio.length>1){filters.push(audio.map((_,i)=>`[a${i}]`).join("")+`amix=inputs=${audio.length}:duration=longest[aout]`);map="[aout]"}
    args.push("-filter_complex",filters.join(";"),"-map","0:v:0","-map",map,"-c:v","copy","-c:a","aac","-shortest","-movflags","+faststart",master);await run("ffmpeg",args)}
   const data=await readFile(master),sha=createHash("sha256").update(data).digest("hex"),info=await stat(master),key=`v1/renders/${claim.id}/${claim.lease_token}/master.mp4`;
   await s3().send(new PutObjectCommand({Bucket:bucket,Key:key,Body:data,ContentType:"video/mp4"}));
   const duration=Math.round(c.scenes.reduce((n,x)=>n+Number(x.durationSeconds||0),0)*1000);
   await db`select video_r2_complete_job(${claim.id},${claim.lease_token},${key},${info.size},${sha},${duration},'video/mp4')`;
   return {status:"succeeded",jobId:claim.id,storageKey:key};
  }finally{await rm(dir,{recursive:true,force:true})}
 }catch(e){if(claim?.id)try{await db`select video_r2_fail_job(${claim.id},${claim.lease_token},'render_failed',${String(e.message||e)},true)`}catch{};throw e}
 finally{await db.end({timeout:2})}
}
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url||"/","http://x");if(req.method==="GET"&&u.pathname==="/health"){config();return json(res,200,{ok:true,service:"edunancial-video-r2-worker",backend:"neon+r2+ffmpeg"})}
 if(req.method==="POST"&&u.pathname==="/internal/jobs/execute"){
  if(WORKER_SHARED_SECRET&&req.headers.authorization!==`Bearer ${WORKER_SHARED_SECRET}`)return json(res,401,{ok:false});
  let body="";for await(const c of req)body+=c;const p=body?JSON.parse(body):{};return json(res,200,{ok:true,...await execute(p.jobId||null)})
 }
 const signedMatch=req.method==="POST"?u.pathname.match(/^\/internal\/jobs\/([0-9a-f-]{36})\/execute$/iu):null;
 if(signedMatch){
  let body="";for await(const c of req)body+=c;
  if(!verifySignedDispatch(req,u.pathname,body))return json(res,401,{ok:false,error:"invalid worker signature"});
  const p=body?JSON.parse(body):{},jobId=String(p.jobId||signedMatch[1]);if(jobId!==signedMatch[1])return json(res,400,{ok:false,error:"job id mismatch"});
  return json(res,200,{ok:true,...await execute(jobId)})
 }
 return json(res,404,{ok:false})}catch(e){console.error(e);return json(res,500,{ok:false,error:String(e.message||e)})}});
server.requestTimeout=15*60*1000;server.listen(PORT,"0.0.0.0",()=>console.log("video-r2 worker listening",PORT));
