-- Location-aware checkout tax audit and order evidence.
--
-- IMPORTANT: authoritative taxability/rate/registration/nexus logic already lives in:
--   public.tax_runtime_rules
--   public.tax_registrations
--   public.tax_nexus_snapshots
-- This migration deliberately does NOT create a second rule or registration system.
-- It preserves the transaction-level evidence produced by that existing runtime engine.

create table if not exists public.checkout_tax_determinations (
  id bigint generated always as identity primary key,
  order_id text references public.orders(id) on delete set null,
  customer_email text,

  -- Customer-asserted destination/home/billing address used for tax determination.
  asserted_address_line1 text,
  asserted_address_line2 text,
  asserted_city text,
  asserted_subdivision text,
  asserted_postal_code text,
  asserted_country_code text not null,
  address_source text not null default 'customer_asserted'
    check (address_source in ('customer_asserted','payment_provider','verified_override')),

  -- Product and monetary facts.
  product_tax_category text not null,
  subtotal_amount numeric(14,2) not null,
  currency text not null,
  taxable boolean not null,
  tax_name text,
  combined_rate numeric(10,6) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) generated always as (subtotal_amount + tax_amount) stored,

  -- Jurisdiction actually used by the existing runtime calculator.
  jurisdiction_country_code text not null,
  jurisdiction_subdivision_code text,
  jurisdiction_locality text,

  -- Provenance from public.tax_runtime_rules / public.tax_registrations.
  runtime_rule_id uuid references public.tax_runtime_rules(id) on delete set null,
  rule_version text,
  registration_status text,
  determination_reason text,
  source_authority text,
  source_reference text,
  date_verified date,
  verification_status text,
  determined_at timestamptz not null default now()
);

create index if not exists checkout_tax_determinations_order_idx
  on public.checkout_tax_determinations(order_id);
create index if not exists checkout_tax_determinations_jurisdiction_idx
  on public.checkout_tax_determinations(
    jurisdiction_country_code,
    jurisdiction_subdivision_code,
    jurisdiction_locality,
    determined_at desc
  );
create index if not exists checkout_tax_determinations_rule_idx
  on public.checkout_tax_determinations(runtime_rule_id, rule_version);

alter table public.checkout_tax_determinations enable row level security;
revoke all on public.checkout_tax_determinations from anon, authenticated;
create policy "service_role_all_checkout_tax_determinations"
  on public.checkout_tax_determinations
  using (auth.role()='service_role')
  with check (auth.role()='service_role');

-- Preserve the tax basis and asserted destination used for the order.
alter table public.orders add column if not exists subtotal_amount numeric(10,2);
alter table public.orders add column if not exists tax_amount numeric(10,2) not null default 0;
alter table public.orders add column if not exists total_with_tax numeric(10,2);
alter table public.orders add column if not exists tax_determination_id bigint references public.checkout_tax_determinations(id);
alter table public.orders add column if not exists billing_country_code text;
alter table public.orders add column if not exists billing_subdivision_code text;
alter table public.orders add column if not exists billing_city text;
alter table public.orders add column if not exists billing_postal_code text;

-- Transaction-level rollup for operational reconciliation. The authoritative filing/remittance
-- liability remains public.business_tax_ledger so collected/remitted/due are never conflated.
create or replace view public.sales_tax_collected_by_location as
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

comment on table public.checkout_tax_determinations is
  'Immutable checkout evidence generated from the existing verified tax runtime engine: customer-asserted address, rule provenance, taxability, rate, tax amount and jurisdiction for each order.';
comment on view public.sales_tax_collected_by_location is
  'Transaction-level sales/consumption tax collected by country, state/province and locality. Filing/remittance liabilities remain authoritative in business_tax_ledger.';
