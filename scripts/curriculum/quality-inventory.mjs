#!/usr/bin/env node
// Truth inventory from the exact compiled curriculum index consumed by the
// universal reader. One source of truth for learner visibility and reporting.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { isLearnerReadyStatus } from "./lib/quality.mjs";

const ROOT=process.cwd();
const INDEX=join(ROOT,"content","generated","curriculum-index");
const OUT=join(ROOT,"curriculum","quality-inventory.json");
const TRACKS=["RED","WHITE","BLUE","GREEN","GOLD","PURPLE","ORANGE","BLACK"];
const LEVELS=[1,2,3,4,5];
const registry=JSON.parse(readFileSync(join(ROOT,"content","registries","locales.json"),"utf8"));
const LOCALES=[...new Set(["en-US",...registry.locales.filter(x=>x.status==="active").map(x=>x.locale)])];
const STATUSES=["canonical","machine-validated","reviewed","stale","template","placeholder","missing"];

function loadShard(track,level,locale){
  const path=join(INDEX,track,`L${level}`,`${locale}.json`);
  if(!existsSync(path))return [];
  const rows=JSON.parse(readFileSync(path,"utf8"));
  return Array.isArray(rows)?rows:[];
}
function key(track,level,locale){return `${track}|${level}|${locale}`}

if(!existsSync(INDEX))throw new Error("Compiled curriculum index is missing. Run curriculum:compile-index first.");

const cells={},records=[];
let canonicalEnglishLessons=0;
for(const track of TRACKS)for(const level of LEVELS)for(const locale of LOCALES){
  const rows=loadShard(track,level,locale),byId=new Map(rows.map(row=>[String(row.id).toUpperCase(),row]));
  const counts=Object.fromEntries(STATUSES.map(status=>[status,0])),issues=[];
  for(let lesson=1;lesson<=50;lesson++){
    const id=`${track}-L${level}-${String(lesson).padStart(3,"0")}`,row=byId.get(id);
    const status=row?.status&&STATUSES.includes(row.status)?row.status:"missing";
    counts[status]++;
    if(locale==="en-US"&&status==="canonical")canonicalEnglishLessons++;
    if(!isLearnerReadyStatus(status))issues.push({id,status});
    records.push({id,track,level,lesson,locale,status,origin:row?.origin??"",sourceHash:row?.sourceHash??""});
  }
  const ready=counts.canonical+counts.reviewed+counts["machine-validated"];
  cells[key(track,level,locale)]={track,level,locale,ready,total:50,counts,issues};
}
const inventory={
  schemaVersion:"2.0",generatedAt:new Date().toISOString(),
  note:"Generated exclusively from the compiled curriculum index used by the universal reader. Ready excludes template, placeholder, stale, and missing.",
  locales:LOCALES,
  summary:{canonicalEnglishLessons,cells:Object.keys(cells).length,readyCells:Object.values(cells).filter(c=>c.ready===50).length,incompleteCells:Object.values(cells).filter(c=>c.ready!==50).length},
  cells,records,
};
mkdirSync(dirname(OUT),{recursive:true});
writeFileSync(OUT,JSON.stringify(inventory,null,2)+"\n","utf8");
console.log(`[quality-inventory] canonical English: ${canonicalEnglishLessons}`);
console.log(`[quality-inventory] complete learner-ready cells: ${inventory.summary.readyCells}/${inventory.summary.cells}`);
console.log(`[quality-inventory] wrote ${relative(ROOT,OUT)}`);
