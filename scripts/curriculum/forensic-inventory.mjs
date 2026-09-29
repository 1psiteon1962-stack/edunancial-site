#!/usr/bin/env node
// Read-only Phase 1 forensic inventory. It never changes curriculum content.
// Usage: node scripts/curriculum/forensic-inventory.mjs [--json <path>]
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { extractZip } from './lib/zip.mjs';

const TRACKS = new Set(['red','white','blue','green','gold','purple','orange','black']);
const LEVEL = /(?:^|[-_/])(?:l|level[-_]?)([1-5])(?:[-_/]|$)/i;
const LESSON = /(?:^|[-_/])(\d{1,3})(?:\D|$)/;
const LOCALES = ['en-US','en-GB','es-419','es-Caribbean','es-ES','fr-CA','fr-FR','pt-BR','pt-PT','de','it','nl','ht'];
const aliases = new Map(LOCALES.flatMap(x=>[[x.toLowerCase(),x],[x.toLowerCase().replaceAll('-','_'),x]]));
aliases.set('en','en-US'); aliases.set('en_us','en-US'); aliases.set('en-gb','en-GB');

function git(args, encoding='utf8') { return execFileSync('git', args, {encoding, maxBuffer: 1024*1024*512}); }
function sha(data) { return createHash('sha256').update(normalize(data)).digest('hex'); }
function normalize(data) { return Buffer.isBuffer(data) ? data.toString('utf8').replace(/\r\n/g,'\n').trim() : String(data).replace(/\r\n/g,'\n').trim(); }
function identity(path, body='') {
  const low=path.toLowerCase(); const track=[...TRACKS].find(t=>low.includes('/'+t+'/')||low.includes(t+'-l')||low.includes(t+'_l'));
  const lm=low.match(LEVEL); const nm=low.match(/(?:^|[-_/])(?:lesson[-_]?)?(\d{3})(?:\D|$)/) || low.match(LESSON);
  if(!track||!lm||!nm) return null;
  const lesson=String(Number(nm[1])).padStart(3,'0');
  let locale='en-US';
  for(const [a,c] of aliases){ if(low.includes('/'+a+'/')||low.includes('.'+a+'.')||low.includes('-'+a+'.')||low.includes('_'+a+'.')) {locale=c;break;} }
  try { const j=JSON.parse(body); if(j.locale) locale=aliases.get(String(j.locale).toLowerCase().replaceAll('-','_'))||j.locale; } catch {}
  return `${track.toUpperCase()}/L${lm[1]}/${locale}/${lesson}`;
}
const candidates=new Map();
function add(key, rec){ if(!key)return; const a=candidates.get(key)||[]; if(!a.some(x=>x.sha256===rec.sha256&&x.source===rec.source)) a.push(rec); candidates.set(key,a); }

const current=git(['ls-tree','-r','--name-only','main']).split('\n').filter(p=>/^content\/(curriculum|courses)\//.test(p));
for(const path of current){ try { const body=git(['show',`main:${path}`]); add(identity(path,body),{source:'main:'+path,object:'main',sha256:sha(body),complete:normalize(body).length>0}); } catch {} }

// Scan every historical version of curriculum files. This records candidates; it never chooses a winner.
const log=git(['log','--all','--format=%H%x09%cI','--name-only','--','content/curriculum','content/courses']);
let commit=null,date=null;
for(const line of log.split('\n')){
  if(/^[0-9a-f]{40}\t/.test(line)){ [commit,date]=line.split('\t'); continue; }
  const path=line.trim(); if(!commit||!/^content\/(curriculum|courses)\//.test(path)) continue;
  try { const body=git(['show',`${commit}:${path}`]); add(identity(path,body),{source:'git-history:'+path,object:commit,date,sha256:sha(body),complete:normalize(body).length>0}); } catch {}
}

// Stored branch is archive/input only. Inspect ZIP bytes without checkout or extraction to disk.
try {
  const names=git(['ls-tree','-r','--name-only','admin-content-storage']).split('\n').filter(Boolean);
  for(const path of names.filter(p=>p.toLowerCase().endsWith('.zip'))){
    try {
      const buf=git(['show',`admin-content-storage:${path}`],null);
      for(const e of extractZip(buf)){ const body=e.data; add(identity('/'+e.name,body),{source:'stored-zip:'+path+'!'+e.name,object:sha(buf),sha256:sha(body),complete:normalize(body).length>0}); }
    } catch(e){ console.error('ZIP scan warning:',path,e.message); }
  }
  const state='.edunancial-admin-content/published/curriculum-state.json';
  if(names.includes(state)){
    try {
      const raw=git(['show',`admin-content-storage:${state}`]); const j=JSON.parse(raw);
      for(const [id,lesson] of Object.entries(j.lessons||{})){ const key=identity('/'+id+'.json',JSON.stringify(lesson)); add(key,{source:'curriculum-state.json',object:'admin-content-storage',sha256:sha(JSON.stringify(lesson)),complete:true}); }
    } catch(e){ console.error('State scan warning:',e.message); }
  }
} catch(e){ console.error('Storage branch unavailable:',e.message); }

const cells={}; const conflicts=[];
for(const [key,versions] of [...candidates].sort()){
  const [track,level,locale]=key.split('/'); const cell=`${track}/${level}/${locale}`;
  cells[cell] ||= {identities:0,candidateVersions:0,complete50:false};
  cells[cell].identities++; cells[cell].candidateVersions += versions.length;
  if(new Set(versions.map(v=>v.sha256)).size>1) conflicts.push({identity:key,versions});
}
for(const v of Object.values(cells)) v.complete50=v.identities===50;
const report={generatedAt:new Date().toISOString(),mode:'READ_ONLY_FORENSIC',summary:{identities:candidates.size,cells:Object.keys(cells).length,completeCells:Object.values(cells).filter(x=>x.complete50).length,conflicts:conflicts.length},highWaterMatrix:cells,conflicts,candidates:Object.fromEntries([...candidates].sort())};
const arg=process.argv.indexOf('--json');
if(arg>=0&&process.argv[arg+1]) writeFileSync(process.argv[arg+1],JSON.stringify(report,null,2)+'\n');
else process.stdout.write(JSON.stringify(report,null,2)+'\n');
