-- Durable, concurrency-safe authoritative curriculum state.
-- Replaces whole-object read/modify/write publication semantics with row-level
-- upserts so independent bulk packages can publish concurrently without lost updates.

create table if not exists public.published_curriculum_lessons (
  lesson_id text primary key,
  track text not null,
  level integer not null check (level > 0),
  lesson_number integer not null check (lesson_number > 0),
  record jsonb not null,
  source_batch_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.published_curriculum_batch_lessons (
  batch_id text not null,
  lesson_id text not null references public.published_curriculum_lessons(lesson_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (batch_id, lesson_id)
);

create index if not exists published_curriculum_track_level_idx
  on public.published_curriculum_lessons (track, level, lesson_number);
create index if not exists published_curriculum_source_batch_idx
  on public.published_curriculum_lessons (source_batch_id);
create index if not exists published_curriculum_batch_idx
  on public.published_curriculum_batch_lessons (batch_id);

alter table public.published_curriculum_lessons enable row level security;
alter table public.published_curriculum_batch_lessons enable row level security;

-- Browser access is intentionally not granted. Runtime writes use service role.

create or replace function public.publish_curriculum_lesson(
  p_batch_id text,
  p_lesson_id text,
  p_track text,
  p_level integer,
  p_lesson_number integer,
  p_record jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_batch_id is null or btrim(p_batch_id) = '' then
    raise exception 'batch id is required';
  end if;
  if p_lesson_id is null or btrim(p_lesson_id) = '' then
    raise exception 'lesson id is required';
  end if;

  -- One lesson has one authoritative current owner. Remove stale batch links
  -- before atomically replacing the lesson record.
  delete from public.published_curriculum_batch_lessons
   where lesson_id = p_lesson_id;

  insert into public.published_curriculum_lessons
    (lesson_id, track, level, lesson_number, record, source_batch_id, updated_at)
  values
    (p_lesson_id, p_track, p_level, p_lesson_number, p_record, p_batch_id, now())
  on conflict (lesson_id) do update set
    track = excluded.track,
    level = excluded.level,
    lesson_number = excluded.lesson_number,
    record = excluded.record,
    source_batch_id = excluded.source_batch_id,
    updated_at = now();

  insert into public.published_curriculum_batch_lessons (batch_id, lesson_id)
  values (p_batch_id, p_lesson_id)
  on conflict (batch_id, lesson_id) do nothing;
end;
$$;

create or replace function public.remove_published_curriculum_batch(p_batch_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed_count integer;
begin
  with owned as (
    select lesson_id
      from public.published_curriculum_batch_lessons
     where batch_id = p_batch_id
  ), deleted as (
    delete from public.published_curriculum_lessons l
     using owned o
     where l.lesson_id = o.lesson_id
       and l.source_batch_id = p_batch_id
    returning l.lesson_id
  )
  select count(*) into removed_count from deleted;

  delete from public.published_curriculum_batch_lessons where batch_id = p_batch_id;
  return removed_count;
end;
$$;

revoke all on function public.publish_curriculum_lesson(text,text,text,integer,integer,jsonb) from public, anon, authenticated;
revoke all on function public.remove_published_curriculum_batch(text) from public, anon, authenticated;
grant execute on function public.publish_curriculum_lesson(text,text,text,integer,integer,jsonb) to service_role;
grant execute on function public.remove_published_curriculum_batch(text) to service_role;
