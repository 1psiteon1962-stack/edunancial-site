import { createHash } from "node:crypto";

import { getNeonSql } from "@/lib/db/neon";
import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";

export function curriculumPayloadHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function sqlOrThrow() {
  const sql=getNeonSql();
  if(!sql) throw new Error("Neon curriculum publication requires DATABASE_URL or NETLIFY_DATABASE_URL.");
  return sql;
}

export async function upsertNeonLessons(uploadId:string, lessons:PublishedLessonRecord[]):Promise<number>{
  const sql=sqlOrThrow();
  for(const lesson of lessons){
    const hash=curriculumPayloadHash({title:lesson.title,summary:lesson.summary,body:lesson.body});
    const level=Number(String(lesson.level).replace(/\D+/gu,""));
    await sql`insert into published_lessons
      (lesson_id,track,track_name,level,lesson_number,title,summary,body,author,lesson_date,version,status,metadata,content_sha256,source_upload_id,updated_at)
      values(${lesson.id.toUpperCase()},${lesson.track},${lesson.trackName},${level},${lesson.lessonNumber},${lesson.title},${lesson.summary??""},${lesson.body??""},${lesson.author??null},${lesson.date??null},${lesson.version??null},${lesson.status??"active"},${JSON.stringify(lesson.metadata??{})}::jsonb,${hash},${uploadId},now())
      on conflict(lesson_id) do update set track=excluded.track,track_name=excluded.track_name,level=excluded.level,lesson_number=excluded.lesson_number,title=excluded.title,summary=excluded.summary,body=excluded.body,author=excluded.author,lesson_date=excluded.lesson_date,version=excluded.version,status=excluded.status,metadata=excluded.metadata,content_sha256=excluded.content_sha256,source_upload_id=excluded.source_upload_id,updated_at=now()`;
    await sql`insert into lesson_versions(lesson_id,locale,content_sha256,payload,source_upload_id)
      values(${lesson.id.toUpperCase()},'en',${hash},${JSON.stringify(lesson)}::jsonb,${uploadId}) on conflict do nothing`;
  }
  return lessons.length;
}

export async function upsertNeonTranslation(uploadId:string,lessonId:string,locale:string,translation:PublishedLessonTranslation):Promise<void>{
  const sql=sqlOrThrow(),hash=curriculumPayloadHash(translation),id=lessonId.toUpperCase();
  await sql`insert into published_translations(lesson_id,locale,title,summary,body,content_sha256,source_upload_id,updated_at)
    values(${id},${locale},${translation.title},${translation.summary??""},${translation.body??""},${hash},${uploadId},now())
    on conflict(lesson_id,locale) do update set title=excluded.title,summary=excluded.summary,body=excluded.body,content_sha256=excluded.content_sha256,source_upload_id=excluded.source_upload_id,updated_at=now()`;
  await sql`insert into lesson_versions(lesson_id,locale,content_sha256,payload,source_upload_id)
    values(${id},${locale},${hash},${JSON.stringify(translation)}::jsonb,${uploadId}) on conflict do nothing`;
}

export async function readNeonLesson(lessonId:string,locale:string):Promise<PublishedLessonRecord|null>{
  const sql=getNeonSql(); if(!sql)return null;
  const rows=await sql`select l.*,t.title as translated_title,t.summary as translated_summary,t.body as translated_body
    from published_lessons l left join published_translations t on t.lesson_id=l.lesson_id and lower(t.locale)=lower(${locale})
    where l.lesson_id=${lessonId.toUpperCase()} and l.status='active' limit 1`;
  const row=rows[0] as Record<string,unknown>|undefined;if(!row)return null;
  return {id:String(row.lesson_id),track:String(row.track),trackName:String(row.track_name),level:Number(row.level),lessonNumber:Number(row.lesson_number),title:String(row.translated_title??row.title),summary:String(row.translated_summary??row.summary??""),body:String(row.translated_body??row.body??""),author:row.author?String(row.author):undefined,date:row.lesson_date?String(row.lesson_date):undefined,version:row.version?String(row.version):undefined,status:"active",metadata:(row.metadata??{}) as Record<string,unknown>,frontMatter:{locale}} as PublishedLessonRecord;
}

export async function queueNeonGitExport(uploadId:string):Promise<void>{
  const sql=sqlOrThrow();
  await sql`insert into curriculum_git_export_queue(upload_id,state,attempts,next_attempt_at,updated_at)
    values(${uploadId},'PENDING',0,now(),now()) on conflict(upload_id) do update set state='PENDING',next_attempt_at=now(),updated_at=now()`;
}
