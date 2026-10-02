-- Provider-neutral Square payment persistence for Neon/PostgreSQL.
-- Idempotent by design so CI and controlled production migration can apply it repeatedly.

create table if not exists payment_catalog_items (
  id text primary key,
  name text not null,
  description text,
  item_type text not null,
  price numeric(10,2) not null check (price >= 0),
  currency text not null default 'USD',
  is_recurring boolean not null default false,
  recurring_interval text,
  membership_plan_id text,
  content_id text,
  active boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key default gen_random_uuid()::text,
  catalog_item_id text not null references payment_catalog_items(id),
  customer_email text,
  status text not null default 'pending',
  amount_requested numeric(10,2) not null,
  amount_charged numeric(10,2),
  currency text not null default 'USD',
  discount_code text,
  discount_amount numeric(10,2) default 0,
  square_payment_link_id text,
  square_order_id text,
  square_payment_id text,
  idempotency_key text unique,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists webhook_events (
  id text primary key default gen_random_uuid()::text,
  event_id text not null unique,
  event_type text not null,
  provider text not null default 'square',
  processed boolean not null default false,
  duplicate boolean not null default false,
  raw_payload jsonb,
  processed_at timestamptz not null default now()
);

create index if not exists orders_customer_email_idx on orders(customer_email);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_square_payment_id_idx on orders(square_payment_id);
create index if not exists webhook_events_event_type_idx on webhook_events(event_type);
create index if not exists webhook_events_processed_at_idx on webhook_events(processed_at);

create or replace function payment_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists payment_orders_updated_at on orders;
create trigger payment_orders_updated_at before update on orders
for each row execute function payment_set_updated_at();

drop trigger if exists payment_catalog_updated_at on payment_catalog_items;
create trigger payment_catalog_updated_at before update on payment_catalog_items
for each row execute function payment_set_updated_at();
