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


export type VideoR2JobInput = {
  projectId: string;
  ownerEmail: string;
  locale: string;
  outputProfile: "vertical_1080x1920" | "landscape_1920x1080" | "square_1080x1080";
  composition: unknown;
  compositionHash: string;
  idempotencyKey: string;
};

export async function createVideoR2Job(input: VideoR2JobInput) {
  const sql = requireSql();
  const rows = await sql`
    insert into video_r2_jobs
      (project_id, locale, output_profile, composition, composition_hash, idempotency_key, created_by)
    select
      p.id, ${input.locale}, ${input.outputProfile}, ${JSON.stringify(input.composition)}::jsonb,
      ${input.compositionHash}, ${input.idempotencyKey}, ${input.ownerEmail}
    from video_r2_projects p
    where p.id = ${input.projectId}::uuid and p.owner_email = ${input.ownerEmail}
    on conflict (idempotency_key) do nothing
    returning *
  `;
  if (rows[0]) return rows[0];
  const existing = await sql`
    select j.*
    from video_r2_jobs j
    join video_r2_projects p on p.id = j.project_id
    where j.idempotency_key = ${input.idempotencyKey}
      and p.owner_email = ${input.ownerEmail}
    limit 1
  `;
  return existing[0] ?? null;
}

export async function listVideoR2Jobs(projectId: string, ownerEmail: string) {
  const sql = requireSql();
  return sql`
    select j.*
    from video_r2_jobs j
    join video_r2_projects p on p.id = j.project_id
    where j.project_id = ${projectId}::uuid and p.owner_email = ${ownerEmail}
    order by j.created_at desc
  `;
}
