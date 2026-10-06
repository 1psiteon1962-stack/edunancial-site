-- Complete the durable uploader state machine and cache generation used by transactional Neon publication.
alter table curriculum_uploads drop constraint if exists curriculum_uploads_state_check;
alter table curriculum_uploads add constraint curriculum_uploads_state_check check (state in
 ('RECEIVING','STORED','VALIDATING','READY','PUBLISHING','PUBLISHED','FAILED_VALIDATION','RECOVERABLE','FAILED_PUBLICATION','DUPLICATE','STORED_FOR_REVIEW','FINALIZING','FAILED'));

alter table curriculum_uploads add column if not exists fencing_token bigint;
alter table curriculum_uploads add column if not exists published_generation bigint;
alter table curriculum_uploads add column if not exists validation jsonb not null default '{}'::jsonb;

create unique index if not exists curriculum_uploads_sha_coordinate_uq
 on curriculum_uploads(content_sha256,coordinate)
 where content_sha256 is not null and coordinate is not null and state='PUBLISHED';

create table if not exists curriculum_generation (
 id boolean primary key default true check(id),
 generation bigint not null default 0,
 updated_at timestamptz not null default now()
);
insert into curriculum_generation(id,generation) values(true,0) on conflict(id) do nothing;
