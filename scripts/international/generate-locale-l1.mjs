import fs from "node:fs";
import path from "node:path";
const requested=process.argv[2]||"all";
const localeRegistry=JSON.parse(fs.readFileSync("content/registries/locales.json","utf8"));
const supported=localeRegistry.locales.filter(entry=>entry.status==="active"&&!["en-US","en-GB"].includes(entry.locale)).map(entry=>entry.locale);
const locales=requested==="all"?supported:[requested];
if(locales.some(locale=>!supported.includes(locale))) throw new Error(`Unsupported locale: ${requested}`);
const apiKey=process.env.OPENAI_API_KEY?.trim();
if(!apiKey) throw new Error("OPENAI_API_KEY is required for curriculum localization generation");
const organization=process.env.OPENAI_ORGANIZATION?.trim();
const model=process.env.EDUNANCIAL_TRANSLATION_MODEL?.trim()||"gpt-4.1-mini";
const root=process.cwd(), registry=JSON.parse(fs.readFileSync("curriculum/registry.json","utf8"));
const lessons=[];
for(const track of Object.values(registry.tracks||{})) {
 const level=track.levels?.["1"]; if(!level) continue;
 for(const a of Object.values(level.assets||{})) if(a.type==="lesson"&&a.status==="active"&&a.lessonNumber>=1&&a.lessonNumber<=50) lessons.push(a);
}
const selected=lessons.sort((a,b)=>a.track.localeCompare(b.track)||a.lessonNumber-b.lessonNumber);
if(selected.length===0) throw new Error("No active Level 1 lessons found in curriculum registry");
const parse=raw=>{const m=/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/u.exec(raw);let fm={},body=raw;if(m){body=m[2];for(const line of m[1].split(/\r?\n/u)){const i=line.indexOf(":");if(i>0)fm[line.slice(0,i).trim()]=line.slice(i+1).trim().replace(/^["']|["']$/g,"");}}return{fm,body:body.trim()}};
const english=/\b(the|and|this|that|with|from|your|lesson|learning|objectives|example|quiz|answer)\b/gi;
const good=(s,locale)=>{
 if(!s||s.length<=200)return false;
 if(locale==="it"){
  const italian=/\b(il|lo|la|gli|le|una|che|con|per|della|sono|come|questa|questo|obiettivi|esempio|risposte)\b/gi;
  const it=(s.match(italian)||[]).length,en=(s.match(english)||[]).length;
  return it>=8&&it>=en*1.2;
 }
 return true;
};
const outPath=(a,locale)=>path.join(root,"content","curriculum",a.track,"L1",`${a.id}.${locale}.md`);
async function translate(a,raw,locale){
 const p=parse(raw), sourceTitle=p.fm.title||a.title||a.id, sourceSummary=p.fm.summary||a.metadata?.summary||"";
 const prompt=`Translate this complete Edunancial financial-education lesson from English to natural professional ${locale}. Preserve ALL Markdown structure, headings, lists, examples, case studies, quiz questions, answer keys, warnings, factual qualifiers, numbers, formulas, URLs, and the author's meaning. Do not summarize, omit, add investment advice, or leave English instructional prose. Return ONLY valid JSON with keys title, summary, body. body must contain the full translated Markdown lesson body. Lesson ID: ${a.id}\nTITLE:\n${sourceTitle}\nSUMMARY:\n${sourceSummary}\nBODY:\n${p.body}`;
 const headers={"Authorization":`Bearer ${apiKey}`,"Content-Type":"application/json"};
 if(organization) headers["OpenAI-Organization"]=organization;
 const res=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers,body:JSON.stringify({model,messages:[{role:"system",content:`You are a precise English-to-${locale} curriculum translator. Output JSON only.`},{role:"user",content:prompt}],temperature:0.1,response_format:{type:"json_object"}})});
 if(!res.ok) throw new Error(`${a.id}: model API ${res.status} ${await res.text()}`);
 const j=await res.json(), text=j.choices?.[0]?.message?.content; if(!text) throw new Error(`${a.id}: empty model response`);
 const t=JSON.parse(text); if(!t.title||!t.body||!good(t.body,locale)) throw new Error(`${a.id}: translation quality gate failed`);
 return `---\nid: "${a.id}"\ntitle: "${String(t.title).replaceAll('"','\\\"')}"\nsummary: "${String(t.summary||"").replaceAll('"','\\\"')}"\nlocale: "${locale}"\n---\n\n${t.body.trim()}\n`;
}
for(const locale of locales){
 let cursor=0;
 const workers=Array.from({length:Math.min(6,selected.length)},async()=>{
  while(true){
   const i=cursor++; if(i>=selected.length)return;
   const a=selected[i], dest=outPath(a,locale);
   if(fs.existsSync(dest)&&good(fs.readFileSync(dest,"utf8"),locale)){console.log(`[${locale} ${i+1}/${selected.length}] keep ${a.id}`);continue;}
   const raw=fs.readFileSync(path.join(root,a.path),"utf8");
   let last;
   for(let attempt=1;attempt<=4;attempt++){try{const txt=await translate(a,raw,locale);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,txt);last=null;break;}catch(e){last=e;console.error(`attempt ${attempt} ${e.message}`);await new Promise(r=>setTimeout(r,attempt*2500));}}
   if(last)throw last;
   console.log(`[${locale} ${i+1}/${selected.length}] translated ${a.id}`);
  }
 });
 await Promise.all(workers);
}
