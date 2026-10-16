#!/usr/bin/env node
/** Read-only Git working-tree inventory. No uploads, merges, database or Blob writes.
 * An absent file is "not found in Git", NOT proof it is absent from production.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const TRACKS = ["RED","WHITE","BLUE","GREEN","GOLD","PURPLE","ORANGE","BLACK"];
const ROOTS = ["content/curriculum", "content/courses"];
const files = [];
function walk(dir) {
  if (!existsSync(dir)) return;
  for (const ent of readdirSync(dir,{withFileTypes:true})) {
    const path=join(dir,ent.name);
    if (ent.isDirectory()) walk(path);
    else if (ent.isFile() && /\.(md|json)$/i.test(path)) files.push(path);
  }
}
ROOTS.forEach(walk);
const matrix = new Map();
for (const track of TRACKS) for (let level=1;level<=5;level++)
  matrix.set(`${track}-L${level}`,{track,level,englishIds:new Set(),translations:new Map(),paths:new Map()});
function add(track, level, id, locale, path) {
  const row=matrix.get(`${track}-L${level}`);
  if (!row || !/^([A-Z]+)-L[1-5]-\d{3}$/.test(id)) return;
  if (locale==="en" || locale==="en-US" || locale==="en_us" || !locale) row.englishIds.add(id);
  else {if(!row.translations.has(locale))row.translations.set(locale,new Set());row.translations.get(locale).add(id);}
  row.paths.set(`${id}:${locale}`,path);
}
for(const path of files) {
  const normalized=path.replace(/\\/g,"/");
  const m=normalized.match(/(RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)-L([1-5])-(\d{3})(?:\.([A-Za-z]{2}(?:-[A-Za-z0-9]+)*))?\.md$/);
  if(m){add(m[1],Number(m[2]),`${m[1]}-L${m[2]}-${m[3]}`,m[4]??"en",relative(".",path));continue;}
  if (!path.endsWith(".json")) continue;
  try {
    const obj=JSON.parse(readFileSync(path,"utf8"));
    const id=String(obj.id??obj.lesson_id??obj.lessonId??"").toUpperCase();
    const matched=id.match(/^(RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)-L([1-5])-\d{3}$/);
    if(!matched)continue;
    if (obj.translations && typeof obj.translations==="object")
      for(const [locale,val] of Object.entries(obj.translations))
        if(val&&typeof val==="object"&&String(val.title??"").trim()&&String(val.body??"").trim())
          add(matched[1],Number(matched[2]),id,locale,relative(".",path));
    if(obj.locale && String(obj.title??"").trim()&&String(obj.body??"").trim())
      add(matched[1],Number(matched[2]),id,String(obj.locale),relative(".",path));
  }catch{/* malformed JSON ignored; no writes */}
}
const result=[...matrix.values()].map(row=>{
  const expected=Array.from({length:50},(_,i)=>`${row.track}-L${row.level}-${String(i+1).padStart(3,"0")}`);
  const translations=Object.fromEntries([...row.translations.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([locale,ids])=>[locale,{found:ids.size,missingFromGit:expected.filter(id=>!ids.has(id))}]));
  return {track:row.track,level:row.level,englishFoundInGit:row.englishIds.size,englishMissingFromGit:expected.filter(id=>!row.englishIds.has(id)),translations};
});
const summary={purpose:"Read-only Git filesystem inventory. Missing means NOT FOUND IN GIT; check Netlify Blob and live runtime before declaring missing.",scannedFiles:files.length,rows:result};
console.log(JSON.stringify(summary,null,2));
