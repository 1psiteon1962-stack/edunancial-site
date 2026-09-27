-- Extend the marketing platform set with Facebook.
-- Safe for databases where the foundation migration has already run.
alter table marketing_publications drop constraint if exists marketing_publications_platform_check;
alter table marketing_publications add constraint marketing_publications_platform_check
  check (platform in ('linkedin','facebook','x','instagram','tiktok','youtube'));
