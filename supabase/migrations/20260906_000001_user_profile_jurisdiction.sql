-- Persist the learner-confirmed jurisdiction separately from transient session geolocation.
-- Existing country remains the primary country for backward compatibility.
alter table public.user_profiles
  add column if not exists subdivision_code text,
  add column if not exists jurisdiction_confirmed_at timestamptz;

comment on column public.user_profiles.subdivision_code is
  'Learner-confirmed state, province, territory, or other first-level subdivision code used for jurisdiction-sensitive education.';
comment on column public.user_profiles.jurisdiction_confirmed_at is
  'Timestamp when the learner explicitly confirmed country/subdivision. Session/IP geolocation must not populate this field.';
