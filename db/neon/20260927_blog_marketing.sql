-- Native blog + marketing bridge
create table if not exists blog_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'en-US',
  translation_group_id uuid not null default gen_random_uuid(),
  track text check (track in ('red','white','blue','green','gold','purple','orange','black')),
  title text not null,
  summary text not null,
  body text not null,
  author text not null default 'Edunancial',
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft','review','approved','scheduled','published','archived')),
  published_at timestamptz,
  scheduled_for timestamptz,
  related_lesson_refs jsonb not null default '[]'::jsonb,
  marketing_campaign_id uuid references marketing_campaigns(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slug, locale)
);
create index if not exists blog_articles_public_idx on blog_articles(status,published_at desc);
create index if not exists blog_articles_translation_idx on blog_articles(translation_group_id,locale);
