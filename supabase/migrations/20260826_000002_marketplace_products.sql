create table if not exists public.marketplace_products (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  title text not null,
  description text not null default '',
  product_type text not null check (product_type in ('EBOOK','AUDIOBOOK','COURSE','TEMPLATE','WORKBOOK','DOWNLOAD','BUSINESS_TOOL','OTHER')),
  status text not null default 'DRAFT' check (status in ('DRAFT','READY','PUBLISHED','ARCHIVED')),
  price_cents integer not null default 0 check (price_cents >= 0),
  currency text not null default 'USD',
  primary_asset_path text,
  cover_asset_path text,
  sample_asset_path text,
  author_name text,
  language_code text not null default 'en-US',
  country_code text,
  category text,
  tags jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

comment on table public.marketplace_products is
  'Owner/admin-created digital products for the Edunancial Marketplace. Files are stored privately and products remain DRAFT/READY until checkout and fulfillment are fully enabled.';

create index if not exists marketplace_products_status_idx on public.marketplace_products(status, updated_at desc);
create index if not exists marketplace_products_type_idx on public.marketplace_products(product_type, status);

alter table public.marketplace_products enable row level security;

create policy "service_role_all_marketplace_products"
  on public.marketplace_products
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create or replace function public.set_marketplace_product_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if new.status = 'PUBLISHED' and old.status is distinct from 'PUBLISHED' then
    new.published_at = coalesce(new.published_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists marketplace_products_set_updated_at on public.marketplace_products;
create trigger marketplace_products_set_updated_at
  before update on public.marketplace_products
  for each row execute function public.set_marketplace_product_updated_at();
