-- Durable, concurrency-safe authoritative curriculum state.
-- Independent bulk packages publish transactionally without whole-object lost updates.

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

create or replace function public.publish_curriculum_batch(
  p_batch_id text,
  p_lessons jsonb
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  v_id text;
  v_track text;
  v_level integer;
  v_number integer;
  v_count integer := 0;
begin
  if p_batch_id is null or btrim(p_batch_id) = '' then
    raise exception 'batch id is required';
  end if;
  if p_lessons is null or jsonb_typeof(p_lessons) <> 'array' then
    raise exception 'lessons must be a JSON array';
  end if;

  for item in select value from jsonb_array_elements(p_lessons)
  loop
    v_id := upper(btrim(item->>'id'));
    v_track := upper(btrim(item->>'track'));
    v_level := (item->>'level')::integer;
    v_number := (item->>'lessonNumber')::integer;
    if v_id = '' or v_track = '' or v_level < 1 or v_number < 1 then
      raise exception 'invalid curriculum lesson payload';
    end if;

    -- Serialize replacement of the same lesson while allowing unrelated
    -- tracks/levels/packages to publish concurrently.
    perform pg_advisory_xact_lock(hashtextextended(v_id, 0));

    delete from public.published_curriculum_batch_lessons where lesson_id = v_id;
    insert into public.published_curriculum_lessons
      (lesson_id, track, level, lesson_number, record, source_batch_id, updated_at)
    values
      (v_id, v_track, v_level, v_number, item, p_batch_id, now())
    on conflict (lesson_id) do update set
      track = excluded.track,
      level = excluded.level,
      lesson_number = excluded.lesson_number,
      -- Preserve already-published translations when a newer canonical English
      -- package replaces the lesson and does not itself carry translations.
      record = case
        when excluded.record ? 'translations' then excluded.record
        when public.published_curriculum_lessons.record ? 'translations'
          then excluded.record || jsonb_build_object('translations', public.published_curriculum_lessons.record->'translations')
        else excluded.record
      end,
      source_batch_id = excluded.source_batch_id,
      updated_at = now();

    insert into public.published_curriculum_batch_lessons (batch_id, lesson_id)
    values (p_batch_id, v_id)
    on conflict (batch_id, lesson_id) do nothing;
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.publish_curriculum_translation(
  p_lesson_id text,
  p_locale text,
  p_translation jsonb
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text := upper(btrim(p_lesson_id));
  v_locale text := btrim(p_locale);
begin
  if v_id = '' or v_locale = '' or p_translation is null or jsonb_typeof(p_translation) <> 'object' then
    raise exception 'invalid translation payload';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_id, 0));
  update public.published_curriculum_lessons
     set record = jsonb_set(
       record,
       array['translations', v_locale],
       coalesce(record->'translations'->v_locale, '{}'::jsonb) || p_translation,
       true
     ),
     updated_at = now()
   where lesson_id = v_id;
  return found;
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
    select lesson_id from public.published_curriculum_batch_lessons where batch_id = p_batch_id
  ), deleted as (
    delete from public.published_curriculum_lessons l
     using owned o
     where l.lesson_id = o.lesson_id and l.source_batch_id = p_batch_id
    returning l.lesson_id
  )
  select count(*) into removed_count from deleted;
  delete from public.published_curriculum_batch_lessons where batch_id = p_batch_id;
  return removed_count;
end;
$$;

revoke all on function public.publish_curriculum_batch(text,jsonb) from public, anon, authenticated;
revoke all on function public.publish_curriculum_translation(text,text,jsonb) from public, anon, authenticated;
revoke all on function public.remove_published_curriculum_batch(text) from public, anon, authenticated;
grant execute on function public.publish_curriculum_batch(text,jsonb) to service_role;
grant execute on function public.publish_curriculum_translation(text,text,jsonb) to service_role;
grant execute on function public.remove_published_curriculum_batch(text) to service_role;
