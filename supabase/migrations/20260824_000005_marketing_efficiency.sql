-- Global marketing efficiency and capital-allocation facts.

create table if not exists public.marketing_touchpoints (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  anonymous_id text,
  user_id text,
  session_id text,
  event_type text not null check (event_type in ('impression','click','visit','signup','lesson_start','lesson_complete','checkout_start','purchase','renewal','upgrade','downgrade','cancel','referral_share','referral_signup','referral_purchase')),
  country text,
  region text,
  language text,
  device_type text,
  channel text,
  source text,
  medium text,
  campaign text,
  content text,
  term text,
  referrer text,
  landing_path text,
  track_code text,
  membership_tier text,
  transaction_id text,
  original_currency text,
  revenue_original numeric(14,2),
  revenue_usd numeric(14,2),
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists marketing_touchpoints_time_idx on public.marketing_touchpoints(occurred_at desc);
create index if not exists marketing_touchpoints_campaign_idx on public.marketing_touchpoints(channel,source,campaign,occurred_at desc);
create index if not exists marketing_touchpoints_geo_idx on public.marketing_touchpoints(country,region,language,occurred_at desc);
create index if not exists marketing_touchpoints_user_idx on public.marketing_touchpoints(user_id,occurred_at desc);
alter table public.marketing_touchpoints enable row level security;
revoke all on public.marketing_touchpoints from anon, authenticated;
create policy "service_role_all_marketing_touchpoints" on public.marketing_touchpoints using (auth.role()='service_role') with check (auth.role()='service_role');

create table if not exists public.marketing_spend_daily (
  spend_date date not null,
  country text not null default 'Unknown',
  region text not null default 'Unknown',
  language text not null default 'Unknown',
  channel text not null,
  source text not null default 'Unknown',
  campaign text not null default 'Unknown',
  currency text not null,
  spend_original numeric(14,2) not null default 0,
  spend_usd numeric(14,2),
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  source_record_id text,
  imported_at timestamptz not null default now(),
  primary key(spend_date,country,region,language,channel,source,campaign)
);
alter table public.marketing_spend_daily enable row level security;
revoke all on public.marketing_spend_daily from anon, authenticated;
create policy "service_role_all_marketing_spend_daily" on public.marketing_spend_daily using (auth.role()='service_role') with check (auth.role()='service_role');

create table if not exists public.member_acquisition_attribution (
  user_id text primary key,
  first_touch_at timestamptz,
  first_channel text,
  first_source text,
  first_medium text,
  first_campaign text,
  first_country text,
  first_language text,
  last_touch_at timestamptz,
  last_channel text,
  last_source text,
  last_medium text,
  last_campaign text,
  last_country text,
  last_language text,
  referred_by_user_id text,
  referral_code text,
  updated_at timestamptz not null default now()
);
alter table public.member_acquisition_attribution enable row level security;
revoke all on public.member_acquisition_attribution from anon, authenticated;
create policy "service_role_all_member_acquisition_attribution" on public.member_acquisition_attribution using (auth.role()='service_role') with check (auth.role()='service_role');

create table if not exists public.marketing_allocation_recommendations (
  id bigint generated always as identity primary key,
  generated_at timestamptz not null default now(),
  country text,
  region text,
  language text,
  channel text,
  campaign text,
  horizon_days integer not null check (horizon_days in (30,90,180,365)),
  action text not null check (action in ('increase','hold','reduce','test','pause')),
  priority_score numeric not null check (priority_score between 0 and 100),
  confidence numeric not null check (confidence between 0 and 100),
  current_spend_usd numeric,
  suggested_spend_change_percent numeric,
  cac_usd numeric,
  ltv_usd numeric,
  ltv_cac_ratio numeric,
  paid_conversion_rate numeric,
  retention_rate numeric,
  viral_coefficient numeric,
  growth_score numeric,
  rationale jsonb not null default '[]'::jsonb,
  risk_flags jsonb not null default '[]'::jsonb,
  source_refs jsonb not null default '[]'::jsonb,
  model_version text not null
);
create index if not exists marketing_allocation_recommendations_priority_idx on public.marketing_allocation_recommendations(generated_at desc,priority_score desc);
alter table public.marketing_allocation_recommendations enable row level security;
revoke all on public.marketing_allocation_recommendations from anon, authenticated;
create policy "service_role_all_marketing_allocation_recommendations" on public.marketing_allocation_recommendations using (auth.role()='service_role') with check (auth.role()='service_role');

create or replace view public.marketing_funnel_30d as
select
  coalesce(country,'Unknown') country,
  coalesce(region,'Unknown') region,
  coalesce(language,'Unknown') language,
  coalesce(channel,'Unknown') channel,
  coalesce(source,'Unknown') source,
  coalesce(campaign,'Unknown') campaign,
  count(*) filter(where event_type='impression') impressions,
  count(*) filter(where event_type='click') clicks,
  count(*) filter(where event_type='visit') visits,
  count(*) filter(where event_type='signup') signups,
  count(*) filter(where event_type='lesson_start') lesson_starts,
  count(*) filter(where event_type='lesson_complete') lesson_completions,
  count(*) filter(where event_type='checkout_start') checkout_starts,
  count(*) filter(where event_type='purchase') purchases,
  count(*) filter(where event_type='renewal') renewals,
  count(*) filter(where event_type='referral_share') referral_shares,
  count(*) filter(where event_type='referral_signup') referral_signups,
  count(*) filter(where event_type='referral_purchase') referral_purchases,
  coalesce(sum(revenue_usd) filter(where event_type in ('purchase','renewal','upgrade')),0) revenue_usd
from public.marketing_touchpoints
where occurred_at >= now()-interval '30 days'
group by 1,2,3,4,5,6;

comment on table public.marketing_touchpoints is 'Full-funnel event facts for global reach, conversion, retention, upgrades and referrals.';
comment on table public.marketing_allocation_recommendations is 'Explainable recommendations for where incremental marketing capital is most likely to create efficient durable growth.';
