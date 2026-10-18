-- Q1: replay keys must be durable and unique so a retry after a crash
-- cannot insert the same spooled KPI event twice.
-- Nullable for existing events and live writes that predate replay.
alter table kpi_events add column if not exists replay_key text;
create unique index if not exists uq_kpi_events_replay_key
  on kpi_events (replay_key) where replay_key is not null;
