-- Agent orchestration foundation (Phase 1, PR 1).
-- Additive only: no curriculum tables or canonical lesson IDs are modified.
-- Every agent action is recorded as a task, checked against the agent's
-- authority level, audited, and routed to the owner when approval is required.

create table if not exists agent_registry (
  id text primary key,
  name text not null,
  max_level text not null check (max_level in ('GREEN','YELLOW','ORANGE')),
  enabled boolean not null default false,
  monthly_cost_cap_usd numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agent_tasks (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null references agent_registry(id),
  action text not null,
  required_level text not null check (required_level in ('GREEN','YELLOW','ORANGE','RED')),
  target_type text not null,
  target_id text not null,
  jurisdiction_code text,
  locale text,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  status text not null default 'queued'
    check (status in ('queued','running','awaiting_approval','completed','failed','refused','cancelled')),
  error text,
  model text,
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric(10,4),
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One open task per agent and target, so two runs cannot change the same lesson at once.
create unique index if not exists agent_tasks_one_open_per_target
  on agent_tasks (agent_id, target_type, target_id)
  where status in ('queued','running','awaiting_approval');

create index if not exists agent_tasks_status_time_idx on agent_tasks (status, created_at desc);

create table if not exists agent_audit_events (
  id bigserial primary key,
  task_id uuid references agent_tasks(id),
  actor text not null,
  action text not null,
  target text not null,
  result text not null check (result in ('success','failure','refused')),
  detail jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists agent_audit_events_task_idx on agent_audit_events (task_id, occurred_at);

-- Audit rows are append-only: reject any UPDATE or DELETE.
create or replace function agent_audit_events_append_only() returns trigger as $$
begin
  raise exception 'agent_audit_events is append-only';
end;
$$ language plpgsql;

drop trigger if exists agent_audit_events_no_change on agent_audit_events;
create trigger agent_audit_events_no_change
  before update or delete on agent_audit_events
  for each row execute function agent_audit_events_append_only();

create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references agent_tasks(id),
  summary text not null,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  decided_by text,
  decision_note text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists approval_requests_status_idx on approval_requests (status, created_at);

-- All agents start disabled. Enabling one is an explicit owner decision.
insert into agent_registry (id, name, max_level) values
  ('market-intel', 'Market Intelligence', 'YELLOW'),
  ('localization', 'Localization', 'ORANGE'),
  ('curriculum-qa', 'Curriculum Integrity', 'YELLOW'),
  ('learner-coach', 'Personalized Learning', 'GREEN'),
  ('marketing', 'International Marketing', 'ORANGE'),
  ('analytics', 'Analytics', 'YELLOW'),
  ('compliance', 'Quality Assurance and Compliance', 'YELLOW'),
  ('security', 'Cybersecurity', 'YELLOW'),
  ('support', 'Customer Support', 'GREEN')
on conflict (id) do nothing;
