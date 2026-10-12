-- Blog publishing V2: immutable revisions, exact human approval, audit trail.
create table if not exists blog_article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references blog_articles(id) on delete restrict,
  version integer not null check (version > 0),
  title text not null, summary text not null, body text not null,
  author text not null default 'Edunancial',
  seo_title text, seo_description text,
  sources jsonb not null default '[]'::jsonb,
  provenance jsonb not null default '{}'::jsonb,
  created_by text not null,
  created_at timestamptz not null default now(),
  unique(article_id, version)
);

create table if not exists blog_article_approvals (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references blog_articles(id) on delete restrict,
  revision_id uuid not null references blog_article_revisions(id) on delete restrict,
  approved_by text not null,
  approved_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique(article_id, revision_id)
);

create table if not exists blog_article_audit_log (
  id bigserial primary key,
  article_id uuid not null references blog_articles(id) on delete restrict,
  revision_id uuid references blog_article_revisions(id) on delete restrict,
  action text not null,
  actor_type text not null check (actor_type in ('human','ai','system')),
  actor_id text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table blog_articles
  add column if not exists current_revision_id uuid references blog_article_revisions(id) on delete restrict,
  add column if not exists approved_revision_id uuid references blog_article_revisions(id) on delete restrict,
  add column if not exists published_revision_id uuid references blog_article_revisions(id) on delete restrict,
  add column if not exists version integer not null default 0,
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','failed')),
  add column if not exists verified_at timestamptz,
  add column if not exists target_country text,
  add column if not exists target_region text,
  add column if not exists content_scope text not null default 'global'
    check (content_scope in ('global','regional','country'));

create index if not exists blog_article_revisions_article_idx on blog_article_revisions(article_id, version desc);
create index if not exists blog_article_approvals_active_idx on blog_article_approvals(article_id, revision_id) where revoked_at is null;
create index if not exists blog_article_audit_idx on blog_article_audit_log(article_id, created_at desc);

create or replace function enforce_blog_publication_revision()
returns trigger language plpgsql as $$
begin
  if new.status in ('approved','scheduled','published') then
    if new.current_revision_id is null or new.approved_revision_id is null then
      raise exception 'approved/scheduled/published blog article requires an approved revision';
    end if;
    if new.current_revision_id <> new.approved_revision_id then
      raise exception 'current blog revision is not the approved revision';
    end if;
    if not exists (
      select 1 from blog_article_approvals a
      where a.article_id = new.id
        and a.revision_id = new.approved_revision_id
        and a.revoked_at is null
    ) then
      raise exception 'no active human approval exists for this blog revision';
    end if;
  end if;
  if new.status = 'published' then
    new.published_revision_id := new.approved_revision_id;
  end if;
  return new;
end;
$$;

drop trigger if exists blog_publication_revision_guard on blog_articles;
create trigger blog_publication_revision_guard
before insert or update on blog_articles
for each row execute function enforce_blog_publication_revision();
