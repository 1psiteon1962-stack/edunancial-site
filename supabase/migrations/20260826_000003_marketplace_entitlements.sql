create table if not exists public.marketplace_entitlements (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  product_id text not null references public.marketplace_products(id) on delete restrict,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','REFUNDED','REVOKED')),
  source text not null default 'PURCHASE' check (source in ('PURCHASE','OWNER_GRANT','PROMOTION','BUNDLE')),
  payment_provider text,
  provider_payment_id text,
  order_reference text,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.marketplace_entitlements is
  'Customer ownership/access grants for Marketplace products. Checkout should create ACTIVE entitlements only after confirmed payment; refunds/revocations preserve the audit record.';

create index if not exists marketplace_entitlements_user_idx on public.marketplace_entitlements(user_id, status, granted_at desc);
create index if not exists marketplace_entitlements_product_idx on public.marketplace_entitlements(product_id, status);
create index if not exists marketplace_entitlements_payment_idx on public.marketplace_entitlements(payment_provider, provider_payment_id);
create unique index if not exists marketplace_entitlements_dedup_idx
  on public.marketplace_entitlements(user_id, product_id, source, coalesce(provider_payment_id, ''));

alter table public.marketplace_entitlements enable row level security;

create policy "service_role_all_marketplace_entitlements"
  on public.marketplace_entitlements
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "user_select_own_marketplace_entitlements"
  on public.marketplace_entitlements
  for select
  using (user_id = auth.uid()::text);
