import { getNeonSql } from "@/lib/db/neon";

export type VideoR2JobStatus = "queued" | "processing" | "succeeded" | "failed" | "cancelled";

export type VideoR2ProjectInput = {
  title: string;
  ownerEmail: string;
  purpose: "marketing" | "lesson";
  track?: string | null;
  level?: number | null;
  lessonNumber?: number | null;
  defaultLocale: string;
  outputProfile: "vertical_1080x1920" | "landscape_1920x1080" | "square_1080x1080";
};

function requireSql() {
  const sql = getNeonSql();
  if (!sql) throw new Error("Video R2 database is not configured.");
  return sql;
}

export async function createVideoR2Project(input: VideoR2ProjectInput) {
  const sql = requireSql();
  const rows = await sql`
    insert into video_r2_projects
      (title, owner_email, purpose, track, level, lesson_number, default_locale, output_profile)
    values
      (${input.title}, ${input.ownerEmail}, ${input.purpose}, ${input.track ?? null},
       ${input.level ?? null}, ${input.lessonNumber ?? null}, ${input.defaultLocale}, ${input.outputProfile})
    returning *
  `;
  return rows[0] ?? null;
}

export async function getVideoR2Project(projectId: string, ownerEmail: string) {
  const sql = requireSql();
  const rows = await sql`
    select * from video_r2_projects
    where id = ${projectId}::uuid and owner_email = ${ownerEmail}
    limit 1
  `;
  return rows[0] ?? null;
}

export async function listVideoR2Projects(ownerEmail: string) {
  const sql = requireSql();
  return sql`
    select * from video_r2_projects
    where owner_email = ${ownerEmail}
    order by updated_at desc, created_at desc
  `;
}

export async function getVideoR2Job(jobId: string, ownerEmail: string) {
  const sql = requireSql();
  const rows = await sql`
    select j.*
    from video_r2_jobs j
    join video_r2_projects p on p.id = j.project_id
    where j.id = ${jobId}::uuid and p.owner_email = ${ownerEmail}
    limit 1
  `;
  return rows[0] ?? null;
}
