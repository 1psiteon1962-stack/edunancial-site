import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const baseUrl=(process.env.BASE_URL||"https://www.edunancial.com").replace(/\/$/,"");
const root=join(process.cwd(),"content","curriculum");
const retryCount=Number(process.env.RETRY_COUNT||"20");
const retryDelayMs=Number(process.env.RETRY_DELAY_MS||"30000");

function parseLessonMetadata(raw){
  const out={};
  if(raw.startsWith("---")){
    const parts=raw.split("---");
    if(parts.length>=3){
      for(const line of(parts[1]||"").split(/\r?\n/u)){
        const i=line.indexOf(":"); if(i<0)continue;
        const key=line.slice(0,i).trim(); let value=line.slice(i+1).trim();
        if(!key)continue;
        if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))value=value.slice(1,-1);
        out[key]=value.replaceAll('\\\"','"');
      }
    }
  }
  const heading=raw.match(/^#\s+([A-Z]+-L\d+-\d{3})\s*(?::\s*(.+))?$/mu);
  if(!out.id&&heading?.[1])out.id=heading[1].trim();
  if(!out.title&&heading?.[2])out.title=heading[2].trim();
  return out;
}

function normalizeTitle(value){
  let title=String(value??"").trim().replaceAll('\\\"','"');
  while(
    title.length>=2 &&
    ((title.startsWith('"')&&title.endsWith('"'))||(title.startsWith("'")&&title.endsWith("'")))
  ) title=title.slice(1,-1).trim();
  title=title.replace(/^[A-Z]+-L[1-5]-\d{3}\s*:\s*/u,"").trim();
  return title;
}

function loadExpectations(){
  const byLocale=new Map();
  if(!existsSync(root))throw new Error("content/curriculum is missing");
  for(const track of readdirSync(root)){
    const trackDir=join(root,track); if(!statSync(trackDir).isDirectory())continue;
    for(const levelName of readdirSync(trackDir)){
      const m=levelName.match(/^L([1-5])$/u); if(!m)continue;
      const levelDir=join(trackDir,levelName); if(!statSync(levelDir).isDirectory())continue;
      for(const filename of readdirSync(levelDir).filter(name=>name.toLowerCase().endsWith(".md")).sort()){
        const canonicalName=filename.match(/^[A-Z]+-L[1-5]-\d{3}(?:\.([^.]+))?\.md$/iu);
        if(!canonicalName)continue;
        const fm=parseLessonMetadata(readFileSync(join(levelDir,filename),"utf8"));
        if(!fm.id||!fm.title)throw new Error(`Unable to derive lesson id/title from ${track}/${levelName}/${filename}`);
        const locale=fm.locale||canonicalName[1]||"en-US";
        const list=byLocale.get(locale)||[];
        list.push({track:track.toUpperCase(),level:Number(m[1]),locale,id:fm.id.toUpperCase(),title:fm.title,path:`${track}/${levelName}/${filename}`});
        byLocale.set(locale,list);
      }
    }
  }
  return byLocale;
}

const expectations=loadExpectations();
if(!expectations.size)throw new Error("No canonical curriculum expectations found");

async function fetchCatalog(locale){
  const url=`${baseUrl}/api/public/curriculum/catalog?lang=${encodeURIComponent(locale)}`;
  try{
    const response=await fetch(url,{
      redirect:"follow",
      signal:AbortSignal.timeout(45000),
      headers:{"user-agent":"EdunancialLiveCurriculumSmoke/3.0"},
    });
    if(!response.ok)return{ok:false,error:`HTTP ${response.status}`};
    return{ok:true,payload:await response.json()};
  }catch(error){
    return{ok:false,error:error instanceof Error?error.message:String(error)};
  }
}

async function checkLocale(locale,items){
  const result=await fetchCatalog(locale);
  if(!result.ok)return items.map(item=>({ok:false,message:`${item.path}: catalog fetch failed for ${locale}: ${result.error}`}));
  const lessons=result.payload?.lessons||{};
  return items.map(item=>{
    const lesson=lessons[item.id];
    if(!lesson)return{ok:false,message:`${item.path}: ${item.id} missing from live catalog for ${locale}`};
    if(normalizeTitle(lesson.title)!==normalizeTitle(item.title))return{ok:false,message:`${item.path}: expected "${item.title}" but live returned "${lesson.title}"`};
    return{ok:true,message:`PASS ${item.path}: ${item.id}`};
  });
}

let lastFailures=[];
for(let attempt=1;attempt<=retryCount;attempt++){
  const results=(await Promise.all(
    [...expectations].map(([locale,items])=>checkLocale(locale,items)),
  )).flat();
  lastFailures=results.filter(result=>!result.ok);
  const passed=results.length-lastFailures.length;
  console.log(`Attempt ${attempt}/${retryCount}: ${passed}/${results.length} canonical curriculum lessons match live production.`);
  if(!lastFailures.length){
    console.log(`All ${results.length} canonical curriculum lessons across L1-L5 match ${baseUrl}.`);
    process.exit(0);
  }
  for(const failure of lastFailures.slice(0,100))console.error(`- ${failure.message}`);
  if(lastFailures.length>100)console.error(`- ...and ${lastFailures.length-100} more failure(s)`);
  if(attempt<retryCount)await new Promise(resolve=>setTimeout(resolve,retryDelayMs));
}

console.error(`Live curriculum publication failed: ${lastFailures.length} canonical curriculum lesson(s) do not match production.`);
process.exit(1);
