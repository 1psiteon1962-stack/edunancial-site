-- Global marketing expansion layer.
-- Platforms become registry data rather than a closed database enum/check list.
create table if not exists marketing_platforms (
  key text primary key,
  display_name text not null,
  enabled boolean not null default true,
  capabilities jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into marketing_platforms(key,display_name) values
 ('linkedin','LinkedIn'),('facebook','Facebook'),('x','X'),('instagram','Instagram'),('tiktok','TikTok'),('youtube','YouTube')
on conflict(key) do update set display_name=excluded.display_name;

alter table marketing_publications drop constraint if exists marketing_publications_platform_check;
alter table marketing_social_accounts drop constraint if exists marketing_social_accounts_platform_check;

-- Locale/market targeting is open-ended. Locale validation is handled through the
-- site's shared international language catalog rather than duplicated SQL checks.
alter table marketing_campaigns add column if not exists target_locales jsonb not null default '["en-US"]'::jsonb;
alter table marketing_campaigns add column if not exists target_markets jsonb not null default '[]'::jsonb;
alter table marketing_content add column if not exists translation_group_id uuid not null default gen_random_uuid();

create index if not exists marketing_content_translation_idx
 on marketing_content(translation_group_id,locale);
