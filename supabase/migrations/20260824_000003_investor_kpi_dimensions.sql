-- Investor-grade KPI dimensions and historical FX normalization.
-- Keeps investor reporting aggregate while preserving auditable source facts.

create table if not exists public.member_analytics_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  country text,
  region text,
  date_of_birth date,
  gender text check (gender is null or gender in ('female','male','nonbinary','self_described','prefer_not_to_say')),
  gender_self_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_analytics_profile_country_idx on public.member_analytics_profile(country);
create index if not exists member_analytics_profile_region_idx on public.member_analytics_profile(region);
create index if not exists member_analytics_profile_gender_idx on public.member_analytics_profile(gender);
create index if not exists member_analytics_profile_dob_idx on public.member_analytics_profile(date_of_birth);

alter table public.member_analytics_profile enable row level security;
revoke all on public.member_analytics_profile from anon, authenticated;
create policy "service_role_all_member_analytics_profile" on public.member_analytics_profile
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create or replace function public.edunancial_region_for_country(country_name text)
returns text language sql immutable as $$
  select case
    when country_name in ('United States','Canada','Mexico') then 'North America'
    when country_name in ('Jamaica','Trinidad and Tobago','Barbados','Puerto Rico','Dominican Republic','Bahamas','Cayman Islands','Turks and Caicos') then 'Caribbean'
    when country_name in ('United Kingdom') then 'Europe'
    when country_name in ('Nigeria','Ghana','Uganda') then 'Africa'
    when country_name in ('Australia') then 'Oceania'
    else 'Other'
  end
$$;

create or replace function public.sync_member_analytics_profile_from_auth()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.member_analytics_profile(user_id,country,region,date_of_birth,gender,gender_self_description,updated_at)
  values(
    new.id,
    nullif(new.raw_user_meta_data->>'country',''),
    public.edunancial_region_for_country(nullif(new.raw_user_meta_data->>'country','')),
    nullif(new.raw_user_meta_data->>'date_of_birth','')::date,
    case when new.raw_user_meta_data->>'gender' in ('female','male','nonbinary','self_described','prefer_not_to_say') then new.raw_user_meta_data->>'gender' else null end,
    nullif(new.raw_user_meta_data->>'gender_self_description',''),
    now()
  )
  on conflict(user_id) do update set
    country=excluded.country,
    region=excluded.region,
    date_of_birth=excluded.date_of_birth,
    gender=excluded.gender,
    gender_self_description=excluded.gender_self_description,
    updated_at=now();
  return new;
end;
$$;

drop trigger if exists edunancial_sync_member_analytics_profile on auth.users;
create trigger edunancial_sync_member_analytics_profile
  after insert or update of raw_user_meta_data on auth.users
  for each row execute function public.sync_member_analytics_profile_from_auth();

insert into public.member_analytics_profile(user_id,country,region,date_of_birth,gender,gender_self_description)
select id,
       nullif(raw_user_meta_data->>'country',''),
       public.edunancial_region_for_country(nullif(raw_user_meta_data->>'country','')),
       case when coalesce(raw_user_meta_data->>'date_of_birth','') ~ '^\d{4}-\d{2}-\d{2}$' then (raw_user_meta_data->>'date_of_birth')::date else null end,
       case when raw_user_meta_data->>'gender' in ('female','male','nonbinary','self_described','prefer_not_to_say') then raw_user_meta_data->>'gender' else null end,
       nullif(raw_user_meta_data->>'gender_self_description','')
from auth.users
on conflict(user_id) do nothing;

create or replace view public.investor_demographic_rollup as
select
  coalesce(country,'Unknown') as country,
  coalesce(region,'Unknown') as region,
  coalesce(gender,'not_reported') as gender,
  case
    when date_of_birth is null then 'Unknown'
    when extract(year from age(current_date,date_of_birth)) < 13 then 'Under 13'
    when extract(year from age(current_date,date_of_birth)) between 13 and 17 then '13-17'
    when extract(year from age(current_date,date_of_birth)) between 18 and 24 then '18-24'
    when extract(year from age(current_date,date_of_birth)) between 25 and 34 then '25-34'
    when extract(year from age(current_date,date_of_birth)) between 35 and 44 then '35-44'
    when extract(year from age(current_date,date_of_birth)) between 45 and 54 then '45-54'
    when extract(year from age(current_date,date_of_birth)) between 55 and 64 then '55-64'
    else '65+'
  end as age_band,
  count(*)::bigint as users
from public.member_analytics_profile
group by 1,2,3,4;

create table if not exists public.learning_level_advancements (
  id bigint generated always as identity primary key,
  user_id text not null,
  track_code text not null,
  from_level text,
  to_level text not null,
  advanced_at timestamptz not null default now(),
  source text not null default 'learning_progress',
  unique(user_id,track_code,to_level)
);
create index if not exists learning_level_advancements_track_idx on public.learning_level_advancements(track_code,to_level);
create index if not exists learning_level_advancements_time_idx on public.learning_level_advancements(advanced_at);
alter table public.learning_level_advancements enable row level security;
revoke all on public.learning_level_advancements from anon, authenticated;
create policy "service_role_all_learning_level_advancements" on public.learning_level_advancements using (auth.role()='service_role') with check (auth.role()='service_role');

-- Backfill the first observed entrance into each level from existing lesson progress.
insert into public.learning_level_advancements(user_id,track_code,from_level,to_level,advanced_at)
select user_id, track_code,
       case level_code when 'L2' then 'L1' when 'L3' then 'L2' when 'L4' then 'L3' when 'L5' then 'L4' else null end,
       level_code,
       min(coalesce(first_viewed_at,created_at))
from public.user_lesson_progress
where level_code in ('L2','L3','L4','L5')
group by user_id,track_code,level_code
on conflict(user_id,track_code,to_level) do nothing;

create or replace function public.capture_level_advancement()
returns trigger language plpgsql as $$
begin
  if new.level_code in ('L2','L3','L4','L5') and (new.first_viewed_at is not null or new.status <> 'not_started') then
    insert into public.learning_level_advancements(user_id,track_code,from_level,to_level,advanced_at)
    values(new.user_id,new.track_code,
      case new.level_code when 'L2' then 'L1' when 'L3' then 'L2' when 'L4' then 'L3' when 'L5' then 'L4' end,
      new.level_code,coalesce(new.first_viewed_at,new.created_at,now()))
    on conflict(user_id,track_code,to_level) do nothing;
  end if;
  return new;
end;
$$;
drop trigger if exists capture_level_advancement_on_lesson_progress on public.user_lesson_progress;
create trigger capture_level_advancement_on_lesson_progress after insert or update on public.user_lesson_progress for each row execute function public.capture_level_advancement();

create table if not exists public.fx_rates_to_usd (
  rate_date date not null,
  currency text not null check (char_length(currency)=3),
  usd_per_unit numeric(20,10) not null check (usd_per_unit > 0),
  source text not null,
  captured_at timestamptz not null default now(),
  primary key(rate_date,currency)
);
insert into public.fx_rates_to_usd(rate_date,currency,usd_per_unit,source)
values(current_date,'USD',1,'identity') on conflict do nothing;
alter table public.fx_rates_to_usd enable row level security;
revoke all on public.fx_rates_to_usd from anon, authenticated;
create policy "service_role_all_fx_rates" on public.fx_rates_to_usd using (auth.role()='service_role') with check (auth.role()='service_role');

alter table public.payment_transactions add column if not exists fx_rate_to_usd numeric(20,10);
alter table public.payment_transactions add column if not exists usd_amount numeric(14,2);
alter table public.payment_transactions add column if not exists fx_rate_date date;
alter table public.payment_transactions add column if not exists fx_source text;

create or replace function public.normalize_payment_transaction_usd()
returns trigger language plpgsql as $$
declare r record;
begin
  if upper(new.currency)='USD' then
    new.fx_rate_to_usd:=1; new.usd_amount:=new.amount; new.fx_rate_date:=(new.created_at at time zone 'UTC')::date; new.fx_source:='identity';
  elsif new.usd_amount is null then
    select rate_date,usd_per_unit,source into r from public.fx_rates_to_usd
    where currency=upper(new.currency) and rate_date <= (new.created_at at time zone 'UTC')::date
    order by rate_date desc limit 1;
    if found then new.fx_rate_to_usd:=r.usd_per_unit; new.usd_amount:=round((new.amount*r.usd_per_unit)::numeric,2); new.fx_rate_date:=r.rate_date; new.fx_source:=r.source; end if;
  end if;
  return new;
end;
$$;
drop trigger if exists normalize_payment_transaction_usd on public.payment_transactions;
create trigger normalize_payment_transaction_usd before insert or update of amount,currency,created_at on public.payment_transactions for each row execute function public.normalize_payment_transaction_usd();

update public.payment_transactions set fx_rate_to_usd=1,usd_amount=amount,fx_rate_date=(created_at at time zone 'UTC')::date,fx_source='identity' where upper(currency)='USD' and usd_amount is null;

create or replace view public.investor_revenue_by_currency as
select upper(currency) as currency,
       count(*) filter(where status='completed')::bigint as completed_transactions,
       coalesce(sum(amount) filter(where status='completed'),0) as revenue_original_currency,
       coalesce(sum(usd_amount) filter(where status='completed'),0) as revenue_usd,
       count(*) filter(where status='completed' and usd_amount is null)::bigint as missing_fx_transactions
from public.payment_transactions
group by upper(currency);
