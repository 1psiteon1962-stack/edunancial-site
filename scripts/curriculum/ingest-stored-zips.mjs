#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { validateLesson, parseFrontMatter } from "./lib/validator.mjs";

const STORAGE_REF=process.env.EDUNANCIAL_STORAGE_REF||"admin-content-storage";
const LEDGER=".edunancial-admin-content/ingest-ledger.json";
const REPORT="artifacts/stored-zip-ingest-report.json";
const localeAliases={"en-us":"en_us","en":"en_us","en-gb":"en_gb","fr-ca":"fr_ca","fr-fr":"fr_fr","es-caribbean":"es_caribbean","es-es":"es_es","pt-br":"pt_br","pt-pt":"pt_pt","ht":"ht","it":"it","de":"de","nl":"nl"};
const sha=s=>createHash("sha256").update(s).digest("hex");
const sh=(...a)=>execFileSync(a[0],a.slice(1),{encoding:"utf8",maxBuffer:64*1024*1024});
function inferLocale(name){const n=name.toLowerCase();for(const k of Object.keys(localeAliases).sort((a,b)=>b.length-a.length))if(n.includes("-"+k)||n.includes("_"+k.replaceAll("-","_")))return k;return null}
function normLocale(v){const k=String(v||"").trim().toLowerCase().replaceAll("_","-");return localeAliases[k]||k.replaceAll("-","_")}
function readLedger(){try{return JSON.parse(readFileSync(LEDGER,"utf8"))}catch{return{schemaVersion:1,zips:{}}}}
function zipEntries(path){return sh("unzip","-Z1",path).split(/\r?\n/).filter(x=>x.toLowerCase().endsWith(".md"))}
function zipRead(path,entry){return execFileSync("unzip",["-p",path,entry],{encoding:"utf8",maxBuffer:8*1024*1024})}
const listed=sh("git","ls-tree","-r","--name-only",STORAGE_REF,"--",".edunancial-admin-content/uploads").split(/\r?\n/).filter(x=>x.toLowerCase().endsWith(".zip"));
const ledger=readLedger(), report={storageRef:STORAGE_REF,zipCount:listed.length,groups:[],missingOrInvalid:[]};
mkdirSync(".tmp-ingest",{recursive:true});
const groups=new Map();
for(const storagePath of listed){
 const blob=execFileSync("git",["show",STORAGE_REF+":"+storagePath],{encoding:"buffer",maxBuffer:64*1024*1024});
 const zipHash=sha(blob); const tmp=".tmp-ingest/"+zipHash+".zip"; writeFileSync(tmp,blob);
 const inferred=inferLocale(basename(storagePath)); let accepted=0;
 try{
  for(const entry of zipEntries(tmp)){
   const content=zipRead(tmp,entry); const meta=parseFrontMatter(content); if(!meta?.id)continue;
   const m=String(meta.id).toUpperCase().match(/^([A-Z][A-Z0-9]*)-L([1-9][0-9]*)-(\d{3})$/); if(!m)continue;
   const validation=validateLesson(content,meta.id); if(!validation.valid)throw new Error(entry+": "+validation.errors.join("; "));
   const track=m[1], level=Number(m[2]), num=Number(m[3]);
   const locale=normLocale(meta.locale||meta.language||inferred||"en-us");
   const key=track+"|"+level+"|"+locale; if(!groups.has(key))groups.set(key,new Map());
   const g=groups.get(key); const old=g.get(num); if(old&&sha(old.content)!==sha(content))throw new Error("Conflicting lesson "+key+" #"+num+" from "+storagePath);
   g.set(num,{content,storagePath,zipHash}); accepted++;
  }
  ledger.zips[zipHash]={path:storagePath,status:"stored",lessonsDetected:accepted,updatedAt:new Date().toISOString()};
 }catch(e){report.missingOrInvalid.push({path:storagePath,error:String(e.message||e)});ledger.zips[zipHash]={path:storagePath,status:"invalid",error:String(e.message||e),updatedAt:new Date().toISOString()}}
}
for(const [key,lessons] of [...groups].sort()){
 const [track,levelText,locale]=key.split("|"), level=Number(levelText);
 const nums=[...lessons.keys()].sort((a,b)=>a-b);
 if(nums.length!==50||nums[0]!==1||nums[49]!==50){report.missingOrInvalid.push({group:key,error:"Expected lessons 001-050 exactly; found "+nums.length});continue}
 let written=0, identical=0;
 for(const num of nums){
  const row=lessons.get(num); const dest="content/courses/"+track.toLowerCase()+"/level-"+level+"/"+locale+"/"+track.toLowerCase()+"-level-"+level+"-"+track.toLowerCase()+"-l"+level+"-"+String(num).padStart(3,"0")+".md";
  mkdirSync(dirname(dest),{recursive:true});
  if(existsSync(dest)){const old=readFileSync(dest,"utf8");if(sha(old)===sha(row.content)){identical++;continue}throw new Error("Refusing to overwrite different committed lesson: "+dest)}
  writeFileSync(dest,row.content);written++;
 }
 const zipHashes=[...new Set([...lessons.values()].map(x=>x.zipHash))];
 for(const h of zipHashes)if(ledger.zips[h]?.status!=="invalid")ledger.zips[h]={...ledger.zips[h],status:"ingested",group:key,updatedAt:new Date().toISOString()};
 report.groups.push({track,level,locale,lessons:50,written,identical,zipPaths:[...new Set([...lessons.values()].map(x=>x.storagePath))]});
}
mkdirSync(dirname(LEDGER),{recursive:true});writeFileSync(LEDGER,JSON.stringify(ledger,null,2)+"\n");
mkdirSync(dirname(REPORT),{recursive:true});writeFileSync(REPORT,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if(report.missingOrInvalid.length)console.error("WARNING: "+report.missingOrInvalid.length+" ZIP/group issues require review.");
