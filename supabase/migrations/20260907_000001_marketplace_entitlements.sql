-- Marketplace purchase entitlements: server-authoritative, auditable access grants.
create table if not exists marketplace_entitlements (
  id text primary key default gen_random_uuid()::text,
  product_id uuid not null references marketplace_products(id),
  purchaser_email text not null,
  order_id text references orders(id),
  square_order_id text,
  square_payment_id text,
  status text not null default 'active' check (status in ('active','revoked','refunded')),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, purchaser_email)
);

create index if not exists marketplace_entitlements_email_idx on marketplace_entitlements(lower(purchaser_email));
create index if not exists marketplace_entitlements_product_idx on marketplace_entitlements(product_id);
create index if not exists marketplace_entitlements_square_order_idx on marketplace_entitlements(square_order_id);
create index if not exists marketplace_entitlements_status_idx on marketplace_entitlements(status);

alter table marketplace_entitlements enable row level security;
create policy "service_role_all_marketplace_entitlements" on marketplace_entitlements using (auth.role() = 'service_role');

comment on table marketplace_entitlements is
  'Server-authoritative audit ledger granting Marketplace product access only after verified payment.';

create trigger marketplace_entitlements_updated_at
  before update on marketplace_entitlements
  for each row execute function set_updated_at();
