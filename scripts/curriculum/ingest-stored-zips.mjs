#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, posix, relative } from "node:path";
import { tmpdir } from "node:os";

const STORAGE_REF=process.env.EDUNANCIAL_STORAGE_REF||"admin-content-storage";
const LEDGER=".edunancial-admin-content/ingest-ledger.json";
const TRACKS=new Set(["red","white","blue","green","gold","purple","orange","black"]);
const localeMap=new Map([["en-us","en_us"],["en-gb","en_gb"],["es-es","es_es"],["es-caribbean","es_caribbean"],["fr-ca","fr_ca"],["fr-fr","fr_fr"],["pt-br","pt_br"],["pt-pt","pt_pt"],["it","it"],["de","de"],["nl","nl"],["ht","ht"]]);
const sh=(...a)=>execFileSync("git",a,{encoding:"utf8"}).trim();
const hash=b=>createHash("sha256").update(b).digest("hex");
function identity(name){
 const n=name.toLowerCase().replace(/^upload_[0-9a-f-]+-/,"").replace(/\.zip$/,"");
 const tm=n.match(/(red|white|blue|green|gold|purple|orange|black)-l([1-5])/); if(!tm)return null;
 let locale=null; for(const [k,v] of [...localeMap].sort((a,b)=>b[0].length-a[0].length))if(n.endsWith("-"+k)){locale=v;break}
 return {track:tm[1],level:Number(tm[2]),locale,allLocales:n.includes("all-locales")};
}
function parseFM(s){const m=s.match(/^---\r?\n([\s\S]*?)\r?\n---/);if(!m)return null;const o={};for(const l of m[1].split(/\r?\n/)){const i=l.indexOf(":");if(i>0)o[l.slice(0,i).trim()]=l.slice(i+1).trim().replace(/^["']|["']$/g,"")}return o}
function inferLocale(path,fm,fallback){const p=path.toLowerCase();for(const [k,v] of localeMap)if(p.includes("/"+k+"/")||p.includes("-"+k+".")||p.includes("_"+k+"."))return v;const raw=(fm?.locale||fm?.language||"").toLowerCase().replaceAll("_","-");return localeMap.get(raw)||fallback}
let ledger={version:1,packages:{}};if(existsSync(LEDGER))try{ledger=JSON.parse(readFileSync(LEDGER,"utf8"))}catch{}
const paths=sh("ls-tree","-r","--name-only",STORAGE_REF,".edunancial-admin-content/uploads").split("\n").filter(x=>x.endsWith(".zip"));
let wrote=0;
for(const zp of paths){
 const id=identity(basename(zp)); if(!id)continue;
 const bytes=execFileSync("git",["show",STORAGE_REF+":"+zp]); const zh=hash(bytes);
 const old=ledger.packages[zh]; if(old?.status==="ingested"||old?.status==="merged"||old?.status==="live")continue;
 const zfile=join(tmpdir(),"edunancial-"+zh+".zip");writeFileSync(zfile,bytes);
 const list=execFileSync("unzip",["-Z1",zfile],{encoding:"utf8"}).split("\n").filter(x=>x.toLowerCase().endsWith(".md"));
 const lessons=[];
 for(const entry of list){const body=execFileSync("unzip",["-p",zfile,entry],{encoding:"utf8"});const fm=parseFM(body);if(!fm?.id)continue;const m=fm.id.toUpperCase().match(/^([A-Z]+)-L([1-5])-(\d{3})$/);if(!m||!TRACKS.has(m[1].toLowerCase()))continue;const loc=inferLocale(entry,fm,id.locale);if(!loc)continue;lessons.push({entry,body,fm,track:m[1].toLowerCase(),level:Number(m[2]),num:m[3],locale:loc})}
 const groups=new Map();for(const l of lessons){const k=[l.track,l.level,l.locale].join("|");if(!groups.has(k))groups.set(k,[]);groups.get(k).push(l)}
 const accepted=[];
 for(const [k,g] of groups){const nums=new Set(g.map(x=>x.num));if(g.length!==50||nums.size!==50||![...Array(50)].every((_,i)=>nums.has(String(i+1).padStart(3,"0"))))continue;accepted.push([k,g])}
 if(!accepted.length){ledger.packages[zh]={path:zp,status:"invalid",reason:"no complete 50-lesson locale set"};continue}
 const outputs=[];
 for(const [,g] of accepted)for(const l of g){const dir=join("content","courses",l.track,"level-"+l.level,l.locale);mkdirSync(dir,{recursive:true});const target=join(dir,`${l.track}-level-${l.level}-${l.track}-l${l.level}-${l.num}.md`);if(existsSync(target)&&hash(readFileSync(target))===hash(Buffer.from(l.body)))continue;writeFileSync(target,l.body);outputs.push(target);wrote++}
 ledger.packages[zh]={path:zp,status:"ingested",track:id.track,level:id.level,sets:accepted.map(([k,g])=>({key:k,lessons:g.length})),outputs};
}
mkdirSync(dirname(LEDGER),{recursive:true});writeFileSync(LEDGER,JSON.stringify(ledger,null,2)+"\n");
console.log(JSON.stringify({zipCount:paths.length,filesWritten:wrote,ledger:LEDGER},null,2));
