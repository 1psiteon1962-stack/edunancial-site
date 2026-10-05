import { getNeonSql } from "@/lib/db/neon";
import { ACADEMIES, ACADEMY_MAP } from "@/lib/curriculum/academies";
import { resolveCurriculumLocale } from "@/lib/curriculum/localization";
import type { PublishedLessonRecord, PublishedTrackSummary } from "@/lib/curriculum/authoritative-published";

type Row=Record<string,unknown>;
const cache=new Map<string,{at:number,value:PublishedTrackSummary|null}>();
const TTL=5_000;
function record(r:Row,locale:string):PublishedLessonRecord{
 const translated=Boolean(r.translated_body);
 return {id:String(r.lesson_id),track:String(r.track),trackName:String(r.track_name),level:Number(r.level),lessonNumber:Number(r.lesson_number),title:String(translated?r.translated_title:r.title),summary:String((translated?r.translated_summary:r.summary)??""),body:String((translated?r.translated_body:r.body)??""),author:String(r.author??"Edunancial Faculty"),date:String(r.lesson_date??""),version:String(r.version??"1.0"),status:"active",importedAt:new Date(String(r.updated_at??Date.now())).toISOString(),metadata:(r.metadata??{}) as Record<string,string>,path:`neon://${String(r.lesson_id)}/${locale}`,frontMatter:{locale}};
}
async function rowsFor(track:string,locale:string):Promise<Row[]>{
 const sql=getNeonSql();if(!sql)return[];
 return await sql`select l.*,t.title translated_title,t.summary translated_summary,t.body translated_body
 from published_lessons l left join published_translations t on t.lesson_id=l.lesson_id and lower(t.locale)=lower(${locale})
 where upper(l.track)=upper(${track}) and l.status='active' order by l.level,l.lesson_number` as Row[];
}
export async function getNeonPublishedTrack(track:string,languageOrLocale:string):Promise<PublishedTrackSummary|null>{
 if(process.env.EDUNANCIAL_CURRICULUM_SOURCE!=="neon")return null;
 const locale=resolveCurriculumLocale(languageOrLocale),code=track.toUpperCase(),key=`${code}:${locale}`,hit=cache.get(key);
 if(hit&&Date.now()-hit.at<TTL)return hit.value;
 const rows=await rowsFor(code,locale);if(!rows.length)return null;
 const academy=ACADEMY_MAP.get(code);const lessons=rows.map(r=>record(r,locale));
 const levels=Array.from({length:academy?.levelCount??5},(_,i)=>{const level=i+1,items=lessons.filter(l=>l.level===level);return{level,lessonCount:items.length,lessons:items}});
 const value:PublishedTrackSummary={code,name:academy?.name??code,description:academy?.description??"",levelCount:levels.length,lessonCount:lessons.length,levels};
 cache.set(key,{at:Date.now(),value});return value;
}
export async function getNeonPublishedLesson(lessonId:string,languageOrLocale:string):Promise<PublishedLessonRecord|null>{
 const track=lessonId.split("-")[0]?.toUpperCase();if(!track)return null;
 const summary=await getNeonPublishedTrack(track,languageOrLocale);for(const level of summary?.levels??[]){const found=level.lessons.find(l=>l.id.toUpperCase()===lessonId.toUpperCase());if(found)return found;}return null;
}
export async function getNeonPublishedTracks(languageOrLocale:string):Promise<PublishedTrackSummary[]>{
 const results=await Promise.all(ACADEMIES.map(a=>getNeonPublishedTrack(a.code,languageOrLocale)));return results.filter((x):x is PublishedTrackSummary=>Boolean(x));
}
export function invalidateNeonLearnerCache(){cache.clear();}
