import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd(), colors=["RED","WHITE","BLUE","GREEN","GOLD","PURPLE","ORANGE","BLACK"];
const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]):[];
const files=walk(path.join(ROOT,"content")).filter(f=>/\.(md|json)$/i.test(f));
const norm=s=>s.replaceAll("\\","/").toLowerCase();
const italianFile=n=>/\/it\//.test(n)||/italian/.test(n)||/[._-]it([._-]|\.md$|\.json$)/.test(n);
const fm=(s,k)=>new RegExp("^"+k+":\\s*[\\\"']?(.+?)[\\\"']?\\s*$","mi").exec(s)?.[1]?.trim();
const englishSignals=/\b(the|and|this|that|with|from|your|what|why|how|lesson|learning|objectives|core content|key takeaways|example|quiz|answer|explanation)\b/gi;
const italianSignals=/\b(il|lo|la|gli|le|un|una|che|con|per|della|delle|degli|sono|come|questa|questo|obiettivi|lezione|esempio|risposte|spiegazioni)\b/gi;
const mdQuality=s=>{
 const body=s.replace(/^---[\s\S]*?---/,"").trim(), title=fm(s,"title")||/^#\s+(.+)$/m.exec(body)?.[1], summary=fm(s,"summary")||fm(s,"description");
 const en=(body.match(englishSignals)||[]).length, it=(body.match(italianSignals)||[]).length;
 return Boolean(title&&body.length>=200&&it>=8&&it>=en*1.2);
};
const jsonRecords=new Map();
for(const f of files.filter(f=>italianFile(norm(f))&&/\.json$/i.test(f))){
 try{const x=JSON.parse(fs.readFileSync(f,"utf8")), rs=Array.isArray(x)?x:(Array.isArray(x?.records)?x.records:[x]);
  for(const r of rs){const id=String(r?.id??r?.lesson_id??r?.lessonId??"").toUpperCase(); const t=r?.translations?.it??r?.translations?.["it-IT"]??r?.translations?.["it_it"]; if(id&&t) jsonRecords.set(id,t);}
 }catch{}
}
const report={locale:"it",expected:400,tracks:{}}; let complete=0;
for(const color of colors){let ok=0;const missing=[],partial=[];
 for(let i=1;i<=50;i++){const id=`${color}-L1-${String(i).padStart(3,"0")}`, token=id.toLowerCase();
  const md=files.filter(f=>/\.md$/i.test(f)&&italianFile(norm(f))&&norm(f).includes(token));
  const goodMd=md.some(f=>mdQuality(fs.readFileSync(f,"utf8")));
  const jr=jsonRecords.get(id), goodJson=Boolean(jr?.title&&jr?.summary&&jr?.body&&mdQuality(`# ${jr.title}\n\n${jr.body}`));
  if(goodMd||goodJson){ok++;complete++;} else if(md.length||jr) partial.push(id); else missing.push(id);
 }
 report.tracks[color]={complete:ok,expected:50,partial,missing};
}
report.complete=complete;report.incomplete=400-complete;
fs.writeFileSync("italian-l1-400-audit.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2)); if(complete!==400) process.exitCode=1;
