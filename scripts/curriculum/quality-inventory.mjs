#!/usr/bin/env node
// Truthful curriculum inventory: scans authored/recovered curriculum directly.
// It reports existence separately from learner readiness and does not depend on
// registry membership to discover lesson records.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { classifyTranslationQuality, isLearnerReadyStatus } from "./lib/quality.mjs";

const ROOT=process.cwd();
const OUT=join(ROOT,"curriculum","quality-inventory.json");
const TRACKS=["RED","WHITE","BLUE","GREEN","GOLD","PURPLE","ORANGE","BLACK"];
const LEVELS=[1,2,3,4,5];
const localeRegistry=JSON.parse(readFileSync(join(ROOT,"content","registries","locales.json"),"utf8"));
const ACTIVE=localeRegistry.locales.filter(x=>x.status==="active").map(x=>x.locale);
const LOCALES=[...new Set(["en-US",...ACTIVE])];

function walk(dir,out=[]){if(!existsSync(dir))return out;for(const e of readdirSync(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())walk(p,out);else out.push(p)}return out}
function norm(v){const x=String(v??"").replaceAll("_","-").toLowerCase();const a={"en":"en-US","en-us":"en-US","en-gb":"en-GB","es-es":"es-ES","es-caribbean":"es-Caribbean","fr-fr":"fr-FR","fr-ca":"fr-CA","pt-pt":"pt-PT","pt-br":"pt-BR","it-it":"it"};return a[x]??x}
function lessonId(v){return String(v??"").toUpperCase().match(/(?:RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)-L[1-5]-\d{3}/u)?.[0]??null}
function parseBody(raw){if(!raw.startsWith("---"))return raw.trim();const p=raw.split("---");return p.length>=3?p.slice(2).join("---").trim():raw.trim()}
function cellKey(track,level,locale){return track+"|"+level+"|"+locale}

const canonical=new Map();
const variants=new Map();
function addVariant(id,locale,body,path,status=""){
  if(!id||!body)return;
  const key=id+"|"+norm(locale);
  const list=variants.get(key)??[];
  list.push({body:String(body),path:relative(ROOT,path),explicitStatus:status});
  variants.set(key,list);
}

for(const path of walk(join(ROOT,"content"))){
  if(path.endsWith(".md")){
    const raw=readFileSync(path,"utf8"),id=lessonId(path+"\n"+raw); if(!id)continue;
    const localeFile=path.match(/\.([A-Za-z]{2}(?:-[A-Za-z0-9]+)?)\.md$/u)?.[1];
    const segments=relative(ROOT,path).replaceAll("\\","/").split("/");
    const localeDir=segments.find(s=>/^(?:en(?:[_-](?:us|gb))?|es(?:[_-](?:es|caribbean))?|fr(?:[_-](?:fr|ca))?|pt(?:[_-](?:pt|br))?|de|it|nl)$/iu.test(s));
    const locale=norm(localeFile??localeDir??"en-US");
    const body=parseBody(raw);
    if(locale==="en-US"&&!canonical.has(id))canonical.set(id,{body,path:relative(ROOT,path)});
    else addVariant(id,locale,body,path);
  } else if(path.endsWith(".json")){
    let row;try{row=JSON.parse(readFileSync(path,"utf8"))}catch{continue}
    const id=lessonId(row.id??row.lesson_id??row.lessonId??path);if(!id)continue;
    if(row.translations&&typeof row.translations==="object"){
      for(const [locale,value] of Object.entries(row.translations)){
        if(value&&typeof value==="object")addVariant(id,locale,value.body,path,value.status);
      }
    }
    if(row.locale)addVariant(id,row.locale,row.body,path,row.status);
  }
}

const cells={};
const records=[];
for(const track of TRACKS)for(const level of LEVELS)for(const locale of LOCALES){
  const counts={canonical:0,"machine-validated":0,reviewed:0,stale:0,template:0,placeholder:0,missing:0};
  const issues=[];
  for(let n=1;n<=50;n++){
    const id=`${track}-L${level}-${String(n).padStart(3,"0")}`;
    const base=canonical.get(id);
    let status;
    if(locale==="en-US")status=base?"canonical":"missing";
    else {
      const candidates=variants.get(id+"|"+locale)??[];
      const classified=candidates.map(v=>({...v,status:classifyTranslationQuality({body:v.body,canonicalBody:base?.body??"",explicitStatus:v.explicitStatus})}));
      const rank={"reviewed":6,"machine-validated":5,"stale":4,"template":3,"placeholder":2,"missing":1};
      classified.sort((a,b)=>(rank[b.status]??0)-(rank[a.status]??0));
      status=classified[0]?.status??"missing";
    }
    counts[status]++;
    if(!isLearnerReadyStatus(status))issues.push({id,status});
    records.push({id,track,level,lesson:n,locale,status});
  }
  const ready=counts.canonical+counts.reviewed+counts["machine-validated"];
  cells[cellKey(track,level,locale)]={track,level,locale,ready,total:50,counts,issues};
}

const inventory={
  schemaVersion:"1.0",
  generatedAt:new Date().toISOString(),
  note:"Generated from committed curriculum artifacts. 'ready' excludes template, placeholder, stale, and missing records.",
  locales:LOCALES,
  summary:{
    canonicalEnglishLessons:canonical.size,
    cells:Object.keys(cells).length,
    readyCells:Object.values(cells).filter(c=>c.ready===50).length,
    incompleteCells:Object.values(cells).filter(c=>c.ready!==50).length,
  },
  cells,
  records,
};
mkdirSync(dirname(OUT),{recursive:true});
writeFileSync(OUT,JSON.stringify(inventory,null,2)+"\n","utf8");
console.log(`[quality-inventory] canonical English: ${canonical.size}`);
console.log(`[quality-inventory] complete learner-ready cells: ${inventory.summary.readyCells}/${inventory.summary.cells}`);
console.log(`[quality-inventory] wrote ${relative(ROOT,OUT)}`);
