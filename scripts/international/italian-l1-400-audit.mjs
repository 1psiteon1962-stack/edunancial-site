import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd();
const colors=["RED","WHITE","BLUE","GREEN","GOLD","PURPLE","ORANGE","BLACK"];
const walk=(d)=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]):[];
const all=walk(path.join(ROOT,"content"));
const norm=s=>s.replaceAll("\\","/").toLowerCase();
const report={locale:"it",expected:400,tracks:{}};
let complete=0;
for(const color of colors){
  const ids=Array.from({length:50},(_,i)=>`${color}-L1-${String(i+1).padStart(3,"0")}`);
  let ok=0;
  const missing=[];
  for(const id of ids){
    const token=id.toLowerCase();
    const candidates=all.filter(f=>{const n=norm(f);return n.includes(token)&&(/\/it\//.test(n)||/italian/.test(n)||/[._-]it([._-]|\.md$|\.json$)/.test(n));});
    let valid=false;
    for(const f of candidates){
      if(!/\.(md|json)$/i.test(f)) continue;
      const s=fs.readFileSync(f,"utf8");
      if(s.trim().length<120) continue;
      if(/\.md$/i.test(f)){
        const title=/^title:\s*(.+)$/mi.exec(s)?.[1]?.trim()||/^#\s+(.+)$/m.exec(s)?.[1]?.trim();
        const summary=/^summary:\s*(.+)$/mi.exec(s)?.[1]?.trim()||/^description:\s*(.+)$/mi.exec(s)?.[1]?.trim();
        const body=s.replace(/^---[\s\S]*?---/,"").trim();
        if(title&&summary&&body.length>=200) {valid=true;break;}
      } else {
        try {
          const j=JSON.parse(s);
          const blob=JSON.stringify(j);
          if(blob.includes(id)&&blob.length>=200) {valid=true;break;}
        } catch {}
      }
    }
    if(valid){ok++;complete++;} else missing.push(id);
  }
  report.tracks[color]={complete:ok,expected:50,missing};
}
report.complete=complete;
report.missing=400-complete;
fs.writeFileSync("italian-l1-400-audit.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if(complete!==400){console.error(`ITALIAN L1 FAIL: ${complete}/400 complete; ${400-complete} missing/partial`);process.exit(1);}
