import type { PublicationLease } from "@/lib/admin-content/publication-lock";
import type { PublishedLessonRecord } from "@/lib/curriculum/authoritative-published";
import { assertLeaseInsideTransaction, bumpCurriculumGeneration, withNeonTransaction } from "@/lib/db/neon-transaction";
import { curriculumPayloadHash } from "@/lib/curriculum/neon-published-store";

export async function publishNeonLessonsTransaction(input:{uploadId:string;lessons:PublishedLessonRecord[];lease:PublicationLease}){
 const {uploadId,lessons,lease}=input;
 if(lessons.length!==50)throw new Error(`Transactional curriculum publication requires exactly 50 lessons; received ${lessons.length}.`);
 return withNeonTransaction(async client=>{
  await assertLeaseInsideTransaction(client,lease);
  const coordinate=new Set(lessons.map(l=>`${l.track.toLowerCase()}:${Number(String(l.level).replace(/\D+/gu,""))}`));
  if(coordinate.size!==1)throw new Error("Transactional publication refuses a mixed track/level package.");
  for(const lesson of lessons){
   const hash=curriculumPayloadHash({title:lesson.title,summary:lesson.summary,body:lesson.body});
   const level=Number(String(lesson.level).replace(/\D+/gu,""));
   await client.query(`insert into published_lessons
    (lesson_id,track,track_name,level,lesson_number,title,summary,body,author,lesson_date,version,status,metadata,content_sha256,source_upload_id,updated_at)
    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,now())
    on conflict(lesson_id) do update set track=excluded.track,track_name=excluded.track_name,level=excluded.level,lesson_number=excluded.lesson_number,title=excluded.title,summary=excluded.summary,body=excluded.body,author=excluded.author,lesson_date=excluded.lesson_date,version=excluded.version,status=excluded.status,metadata=excluded.metadata,content_sha256=excluded.content_sha256,source_upload_id=excluded.source_upload_id,updated_at=now()`,
    [lesson.id.toUpperCase(),lesson.track,lesson.trackName,level,lesson.lessonNumber,lesson.title,lesson.summary??"",lesson.body??"",lesson.author??null,lesson.date??null,lesson.version??null,lesson.status??"active",JSON.stringify(lesson.metadata??{}),hash,uploadId]);
   await client.query(`insert into lesson_versions(lesson_id,locale,content_sha256,payload,source_upload_id) values($1,'en',$2,$3::jsonb,$4) on conflict do nothing`,
    [lesson.id.toUpperCase(),hash,JSON.stringify(lesson),uploadId]);
  }
  await assertLeaseInsideTransaction(client,lease);
  const ids=lessons.map(l=>l.id.toUpperCase());
  const check=await client.query("select lesson_id,source_upload_id from published_lessons where lesson_id=any($1::text[]) and status='active'",[ids]);
  if(check.rowCount!==50||check.rows.some((r:any)=>r.source_upload_id!==uploadId))throw new Error(`Transactional learner readback found ${check.rowCount} of 50 lessons for this upload.`);
  const generation=await bumpCurriculumGeneration(client);
  await client.query("update curriculum_uploads set state='PUBLISHED',published_generation=$2,updated_at=now() where upload_id=$1",[uploadId,generation]);
  await client.query("insert into curriculum_upload_events(upload_id,event_type,detail) values($1,'PUBLISHED',$2::jsonb)",[uploadId,JSON.stringify({generation,transactional:true})]);
  return{upserted:50,generation};
 });
}
