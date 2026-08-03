-- Square Payment Platform — Production Schema
-- Migration: 20260803_000001_square_payment_tables.sql
--
-- Creates all tables required for the production Square payment pipeline:
--   • payment_catalog_items  — Config-driven product catalog
--   • orders                 — One row per checkout initiation
--   • payment_transactions   — Raw Square payment records
--   • subscriptions          — Recurring membership subscriptions
--   • members                — Provisioned member access records
--   • webhook_events         — Immutable log of all Square webhook events
--   • discount_redemptions   — Audit log for applied discount codes
--
-- All tables use Row Level Security (RLS).
-- Only service-role or admin-scoped JWTs can write to these tables.
-- Members can read their own records via auth.uid() claims.

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Payment Catalog Items
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists payment_catalog_items (
  id                  text        primary key,
  name                text        not null,
  description         text,
  item_type           text        not null,  -- membership_monthly | course | book | event_registration | …
  price               numeric(10, 2) not null check (price >= 0),
  currency            text        not null default 'USD',
  is_recurring        boolean     not null default false,
  recurring_interval  text,                  -- monthly | annual
  membership_plan_id  text,
  content_id          text,
  active              boolean     not null default false,
  metadata            jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table payment_catalog_items is
  'Config-driven catalog of all purchasable items. New product types are added here without changes to payment code.';

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Orders
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                    text        primary key default gen_random_uuid()::text,
  catalog_item_id       text        not null references payment_catalog_items(id),
  customer_email        text,
  status                text        not null default 'pending',
                                    -- pending | completed | failed | refunded | cancelled
  amount_requested      numeric(10, 2) not null,
  amount_charged        numeric(10, 2),
  currency              text        not null default 'USD',
  discount_code         text,
  discount_amount       numeric(10, 2) default 0,
  square_payment_link_id text,
  square_order_id       text,
  square_payment_id     text,
  idempotency_key       text        unique,
  metadata              jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists orders_customer_email_idx on orders(customer_email);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_square_payment_id_idx on orders(square_payment_id);

comment on table orders is
  'One row per checkout initiation. Tracks the full lifecycle from payment link creation through fulfilment.';

-- ────────────────────────────────────────────────────────────────────────────
-- 3. Payment Transactions
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists payment_transactions (
  id                text        primary key default gen_random_uuid()::text,
  order_id          text        references orders(id),
  provider          text        not null default 'square',
  square_payment_id text        unique,
  amount            numeric(10, 2) not null,
  currency          text        not null default 'USD',
  status            text        not null,   -- pending | processing | completed | failed | refunded
  reference_number  text,
  raw_payload       jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists payment_transactions_order_id_idx on payment_transactions(order_id);
create index if not exists payment_transactions_status_idx on payment_transactions(status);

comment on table payment_transactions is
  'Immutable record of every Square payment event received and verified.';

-- ────────────────────────────────────────────────────────────────────────────
-- 4. Subscriptions
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists subscriptions (
  id                          text        primary key default gen_random_uuid()::text,
  member_email                text        not null,
  plan_id                     text        not null,
  status                      text        not null default 'active',
                                          -- active | cancelled | past-due | expired | reactivated
  provider                    text        not null default 'square',
  provider_subscription_id    text,
  provider_customer_id        text,
  provider_payment_id         text,
  current_period_start        timestamptz not null default now(),
  current_period_end          timestamptz,
  cancelled_at                timestamptz,
  metadata                    jsonb,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists subscriptions_member_email_idx on subscriptions(member_email);
create index if not exists subscriptions_status_idx on subscriptions(status);
create index if not exists subscriptions_provider_subscription_id_idx on subscriptions(provider_subscription_id);

comment on table subscriptions is
  'Recurring membership subscription records, updated on each Square lifecycle event.';

-- ────────────────────────────────────────────────────────────────────────────
-- 5. Members (provisioned access)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists members (
  id                  text        primary key default gen_random_uuid()::text,
  email               text        not null unique,
  membership_tier     text        not null default 'free',
  active              boolean     not null default false,
  has_dashboard_access boolean   not null default false,
  next_journey_route  text,
  provisioned_at      timestamptz not null default now(),
  deactivated_at      timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists members_email_idx on members(email);
create index if not exists members_active_idx on members(active);

comment on table members is
  'Server-authoritative member access table. Only set active=true after server-side payment verification.';

-- ────────────────────────────────────────────────────────────────────────────
-- 6. Webhook Events (immutable log)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists webhook_events (
  id              text        primary key default gen_random_uuid()::text,
  event_id        text        not null unique,  -- Square event_id — enforces idempotency
  event_type      text        not null,
  provider        text        not null default 'square',
  processed       boolean     not null default false,
  duplicate       boolean     not null default false,
  raw_payload     jsonb,
  processed_at    timestamptz not null default now()
);

create index if not exists webhook_events_event_type_idx on webhook_events(event_type);
create index if not exists webhook_events_processed_at_idx on webhook_events(processed_at);

comment on table webhook_events is
  'Append-only log of all Square webhook events. The unique constraint on event_id provides DB-level idempotency.';

-- ────────────────────────────────────────────────────────────────────────────
-- 7. Discount Redemptions (audit log)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists discount_redemptions (
  id            text        primary key default gen_random_uuid()::text,
  discount_code text        not null,
  order_id      text        references orders(id),
  customer_email text,
  discount_amount numeric(10, 2) not null,
  redeemed_at   timestamptz not null default now()
);

create index if not exists discount_redemptions_code_idx on discount_redemptions(discount_code);

comment on table discount_redemptions is
  'Audit log of every discount code redemption. Used for usage-limit enforcement and reporting.';

-- ────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────────────────────
alter table payment_catalog_items enable row level security;
alter table orders                enable row level security;
alter table payment_transactions  enable row level security;
alter table subscriptions         enable row level security;
alter table members               enable row level security;
alter table webhook_events        enable row level security;
alter table discount_redemptions  enable row level security;

-- Service-role bypass (server-side only).
create policy "service_role_all_catalog"       on payment_catalog_items using (auth.role() = 'service_role');
create policy "service_role_all_orders"        on orders               using (auth.role() = 'service_role');
create policy "service_role_all_transactions"  on payment_transactions using (auth.role() = 'service_role');
create policy "service_role_all_subscriptions" on subscriptions        using (auth.role() = 'service_role');
create policy "service_role_all_members"       on members              using (auth.role() = 'service_role');
create policy "service_role_all_webhook_events" on webhook_events      using (auth.role() = 'service_role');
create policy "service_role_all_discounts"     on discount_redemptions using (auth.role() = 'service_role');

-- Members can read their own records.
create policy "member_read_own_subscription" on subscriptions
  for select using (member_email = (select email from members where id = auth.uid()::text));

create policy "member_read_own_orders" on orders
  for select using (customer_email = (select email from members where id = auth.uid()::text));

create policy "member_read_own_member" on members
  for select using (id = auth.uid()::text);

-- Public catalog items are readable by anyone.
create policy "public_read_active_catalog" on payment_catalog_items
  for select using (active = true);

-- ────────────────────────────────────────────────────────────────────────────
-- Triggers: keep updated_at current
-- ────────────────────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

create trigger payment_transactions_updated_at
  before update on payment_transactions
  for each row execute function set_updated_at();

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

create trigger members_updated_at
  before update on members
  for each row execute function set_updated_at();

create trigger catalog_items_updated_at
  before update on payment_catalog_items
  for each row execute function set_updated_at();
