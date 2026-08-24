-- Location-aware checkout tax engine.
-- Customer-asserted home/billing address determines destination jurisdiction subject to taxability/nexus rules.

create table if not exists public.tax_jurisdiction_rules (
  id bigint generated always as identity primary key,
  country_code text not null,
  subdivision_code text,
  locality text,
  postal_pattern text,
  tax_name text not null,
  tax_type text not null default 'SALES_CONSUMPTION',
  product_tax_category text not null,
  taxable boolean not null,
  rate numeric(10,6) not null default 0 check (rate >= 0 and rate <= 1),
  threshold_amount numeric(18,2),
  threshold_currency text,
  threshold_period text,
  registration_required boolean not null default false,
  effective_from date not null,
  effective_to date,
  source_url text,
  authority_name text,
  rule_version text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tax_jurisdiction_rules_lookup_idx on public.tax_jurisdiction_rules(country_code,subdivision_code,locality,product_tax_category,effective_from desc);
alter table public.tax_jurisdiction_rules enable row level security;
revoke all on public.tax_jurisdiction_rules from anon, authenticated;
create policy "service_role_all_tax_jurisdiction_rules" on public.tax_jurisdiction_rules using (auth.role()='service_role') with check (auth.role()='service_role');

create table if not exists public.tax_registration_status (
  id bigint generated always as identity primary key,
  country_code text not null,
  subdivision_code text,
  locality text,
  tax_name text not null,
  status text not null check (status in ('not_required','monitoring','registration_required','registered','suspended','closed')),
  account_reference text,
  threshold_amount numeric(18,2),
  threshold_currency text,
  trailing_sales_amount numeric(18,2),
  trailing_transaction_count bigint,
  threshold_period text,
  registration_effective_date date,
  filing_frequency text,
  next_filing_due_at timestamptz,
  rule_version text,
  updated_at timestamptz not null default now(),
  unique(country_code,coalesce(subdivision_code,''),coalesce(locality,''),tax_name)
);
alter table public.tax_registration_status enable row level security;
revoke all on public.tax_registration_status from anon, authenticated;
create policy "service_role_all_tax_registration_status" on public.tax_registration_status using (auth.role()='service_role') with check (auth.role()='service_role');

create table if not exists public.checkout_tax_determinations (
  id bigint generated always as identity primary key,
  order_id text references public.orders(id) on delete set null,
  customer_email text,
  asserted_address_line1 text,
  asserted_address_line2 text,
  asserted_city text,
  asserted_subdivision text,
  asserted_postal_code text,
  asserted_country_code text not null,
  address_source text not null default 'customer_asserted' check (address_source in ('customer_asserted','payment_provider','verified_override')),
  product_tax_category text not null,
  subtotal_amount numeric(14,2) not null,
  currency text not null,
  taxable boolean not null,
  tax_name text,
  combined_rate numeric(10,6) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) generated always as (subtotal_amount + tax_amount) stored,
  jurisdiction_country_code text not null,
  jurisdiction_subdivision_code text,
  jurisdiction_locality text,
  rule_id bigint references public.tax_jurisdiction_rules(id),
  rule_version text,
  registration_status text,
  determination_reason text,
  source_url text,
  determined_at timestamptz not null default now()
);
create index if not exists checkout_tax_determinations_order_idx on public.checkout_tax_determinations(order_id);
create index if not exists checkout_tax_determinations_jurisdiction_idx on public.checkout_tax_determinations(jurisdiction_country_code,jurisdiction_subdivision_code,jurisdiction_locality,determined_at desc);
alter table public.checkout_tax_determinations enable row level security;
revoke all on public.checkout_tax_determinations from anon, authenticated;
create policy "service_role_all_checkout_tax_determinations" on public.checkout_tax_determinations using (auth.role()='service_role') with check (auth.role()='service_role');

alter table public.orders add column if not exists subtotal_amount numeric(10,2);
alter table public.orders add column if not exists tax_amount numeric(10,2) not null default 0;
alter table public.orders add column if not exists total_with_tax numeric(10,2);
alter table public.orders add column if not exists tax_determination_id bigint references public.checkout_tax_determinations(id);
alter table public.orders add column if not exists billing_country_code text;
alter table public.orders add column if not exists billing_subdivision_code text;
alter table public.orders add column if not exists billing_city text;
alter table public.orders add column if not exists billing_postal_code text;

create or replace view public.sales_tax_due_by_location as
select
  jurisdiction_country_code as country_code,
  jurisdiction_subdivision_code as subdivision_code,
  jurisdiction_locality as locality,
  coalesce(tax_name,'Tax') as tax_name,
  currency,
  count(*)::bigint as taxable_transactions,
  sum(subtotal_amount) as taxable_sales,
  sum(tax_amount) as tax_collected,
  min(determined_at) as first_transaction_at,
  max(determined_at) as last_transaction_at
from public.checkout_tax_determinations
where taxable = true
group by 1,2,3,4,5;

comment on table public.checkout_tax_determinations is 'Immutable checkout evidence: customer-asserted address, applicable taxability rule, rate, tax amount, and jurisdiction used for each order.';
comment on view public.sales_tax_due_by_location is 'Transaction-level sales/consumption tax rollup by country, state/province, locality and currency for filing and remittance support.';
