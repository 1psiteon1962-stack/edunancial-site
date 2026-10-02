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
    on conflict (project_id, idempotency_key) where idempotency_key is not null do nothing
    returning *
  `;
  if (rows[0]) return rows[0];
  const existing = await sql`
    select j.*
    from video_r2_jobs j
    join video_r2_projects p on p.id = j.project_id
    where j.project_id = ${input.projectId}::uuid
      and j.idempotency_key = ${input.idempotencyKey}
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


export async function getActiveVideoR2Job(projectId: string, ownerEmail: string, locale: string) {
  const sql = requireSql();
  const rows = await sql`
    select j.*
    from video_r2_jobs j
    join video_r2_projects p on p.id = j.project_id
    where j.project_id = ${projectId}::uuid
      and p.owner_email = ${ownerEmail}
      and j.locale = ${locale}
      and j.status in ('queued','processing')
    order by j.queued_at asc
    limit 1
  `;
  return rows[0] ?? null;
}

export type VideoR2UploadAssetKind = "source_video" | "source_image" | "narration" | "music";

export type VideoR2PendingAssetInput = {
  id: string;
  projectId: string;
  ownerEmail: string;
  kind: VideoR2UploadAssetKind;
  storageKey: string;
  mimeType: string;
  byteSize: number;
  locale?: string | null;
  originalFilename?: string | null;
};

export async function createVideoR2PendingAsset(input: VideoR2PendingAssetInput) {
  const sql = requireSql();
  const rows = await sql`
    insert into video_r2_assets
      (id, project_id, kind, storage_key, status, mime_type, byte_size, locale, original_filename)
    select
      ${input.id}::uuid, p.id, ${input.kind}, ${input.storageKey}, 'pending_upload',
      ${input.mimeType}, ${input.byteSize}, ${input.locale ?? null}, ${input.originalFilename ?? null}
    from video_r2_projects p
    where p.id = ${input.projectId}::uuid and p.owner_email = ${input.ownerEmail}
    returning *
  `;
  return rows[0] ?? null;
}

export async function getVideoR2Asset(assetId: string, ownerEmail: string) {
  const sql = requireSql();
  const rows = await sql`
    select a.*
    from video_r2_assets a
    join video_r2_projects p on p.id = a.project_id
    where a.id = ${assetId}::uuid and p.owner_email = ${ownerEmail}
    limit 1
  `;
  return rows[0] ?? null;
}

export async function markVideoR2AssetReady(
  assetId: string,
  ownerEmail: string,
  verified: { byteSize: number; mimeType?: string; etag?: string },
) {
  const sql = requireSql();
  const rows = await sql`
    update video_r2_assets a
    set status = 'ready',
        byte_size = ${verified.byteSize},
        mime_type = coalesce(${verified.mimeType ?? null}, a.mime_type),
        verified_at = now()
    from video_r2_projects p
    where a.id = ${assetId}::uuid
      and a.project_id = p.id
      and p.owner_email = ${ownerEmail}
      and a.status = 'pending_upload'
    returning a.*
  `;
  return rows[0] ?? null;
}


export type VideoR2SceneInput = {
  assetId: string;
  durationSeconds: number;
  overlayText?: string | null;
  fitMode: "contain" | "cover";
  transitionType: "cut" | "fade" | "wipeleft" | "wiperight" | "slideleft" | "slideright";
  transitionSeconds: number;
};

export type VideoR2AudioInput = {
  assetId: string;
  role: "narration" | "music";
  locale: string;
  transcript?: string | null;
  volume: number;
};

export async function replaceVideoR2Composition(
  projectId: string,
  ownerEmail: string,
  scenes: VideoR2SceneInput[],
  audio: VideoR2AudioInput[],
) {
  const sql = requireSql();
  const project = await getVideoR2Project(projectId, ownerEmail);
  if (!project) throw new Error("Video project not found.");

  await sql`delete from video_r2_scenes where project_id = ${projectId}::uuid`;
  await sql`delete from video_r2_audio_tracks where project_id = ${projectId}::uuid`;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    await sql`
      insert into video_r2_scenes
        (project_id, scene_order, asset_id, duration_seconds, fit_mode, overlay_text, transition_type, transition_seconds)
      select
        p.id, ${i}, a.id, ${scene.durationSeconds}, ${scene.fitMode},
        ${JSON.stringify(scene.overlayText ? { text: scene.overlayText } : {})}::jsonb,
        ${scene.transitionType}, ${scene.transitionSeconds}
      from video_r2_projects p
      join video_r2_assets a on a.project_id = p.id
      where p.id = ${projectId}::uuid
        and p.owner_email = ${ownerEmail}
        and a.id = ${scene.assetId}::uuid
        and a.status = 'ready'
    `;
  }

  for (const track of audio) {
    await sql`
      insert into video_r2_audio_tracks
        (project_id, role, locale, asset_id, transcript, volume)
      select
        p.id, ${track.role}, ${track.locale}, a.id, ${track.transcript ?? null}, ${track.volume}
      from video_r2_projects p
      join video_r2_assets a on a.project_id = p.id
      where p.id = ${projectId}::uuid
        and p.owner_email = ${ownerEmail}
        and a.id = ${track.assetId}::uuid
        and a.status = 'ready'
    `;
  }

  await sql`update video_r2_projects set updated_at = now() where id = ${projectId}::uuid and owner_email = ${ownerEmail}`;

}

export async function getVideoR2FrozenComposition(projectId: string, ownerEmail: string) {
  const sql = requireSql();
  const project = await getVideoR2Project(projectId, ownerEmail) as Record<string, unknown> | null;
  if (!project) return null;

  const scenes = await sql`
    select s.scene_order, s.duration_seconds, s.fit_mode, s.overlay_text, s.transition_type, s.transition_seconds,
           a.id as asset_id, a.storage_key, a.mime_type
    from video_r2_scenes s
    join video_r2_assets a on a.id = s.asset_id
    join video_r2_projects p on p.id = s.project_id
    where s.project_id = ${projectId}::uuid and p.owner_email = ${ownerEmail} and a.status = 'ready'
    order by s.scene_order
  `;
  const audio = await sql`
    select t.role, t.locale, t.transcript, t.volume, a.id as asset_id, a.storage_key, a.mime_type
    from video_r2_audio_tracks t
    join video_r2_assets a on a.id = t.asset_id
    join video_r2_projects p on p.id = t.project_id
    where t.project_id = ${projectId}::uuid and p.owner_email = ${ownerEmail} and a.status = 'ready'
    order by case when t.role = 'narration' then 0 else 1 end, t.locale
  `;

  const profile = String(project.output_profile ?? "vertical_1080x1920");
  return {
    locale: String(project.default_locale ?? "en-US"),
    outputProfile: profile,
    workerProfile: profile.startsWith("landscape") ? "landscape" : profile.startsWith("square") ? "square" : "vertical",
    scenes: scenes.map((row: Record<string, unknown>) => ({
      assetId: row.asset_id,
      storageKey: row.storage_key,
      mimeType: row.mime_type,
      durationSeconds: Number(row.duration_seconds),
      fit: row.fit_mode,
      overlayText: row.overlay_text,
      transitionType: row.transition_type,
      transitionSeconds: Number(row.transition_seconds),
    })),
    audio: audio.map((row: Record<string, unknown>) => ({
      assetId: row.asset_id,
      storageKey: row.storage_key,
      mimeType: row.mime_type,
      role: row.role,
      locale: row.locale,
      transcript: row.transcript,
      volume: Number(row.volume),
    })),
  };
}

export async function markVideoR2JobDispatchFailed(jobId: string, ownerEmail: string, message: string) {
  const sql = requireSql();
  const rows = await sql`
    update video_r2_jobs j
    set status = 'failed', error_code = 'dispatch_failed', last_error = ${message.slice(0, 4000)}, finished_at = now()
    from video_r2_projects p
    where j.id = ${jobId}::uuid and j.project_id = p.id and p.owner_email = ${ownerEmail}
    returning j.*
  `;
  return rows[0] ?? null;
}
