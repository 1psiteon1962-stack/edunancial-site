-- Member security hardening follow-up

create or replace function public.handle_new_member_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.user_profiles (
    user_id,
    first_name,
    last_name,
    country
  )
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'firstName', ''), 100),
    left(coalesce(new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'lastName', ''), 100),
    nullif(left(coalesce(new.raw_user_meta_data ->> 'country', ''), 100), '')
  )
  on conflict (user_id) do nothing;

  insert into public.user_security_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_member_profile() from public;

drop trigger if exists on_auth_user_created_member_profile on auth.users;
create trigger on_auth_user_created_member_profile
  after insert on auth.users
  for each row execute function public.handle_new_member_profile();

revoke all on public.user_security_settings from anon;
revoke all on public.user_security_settings from authenticated;
grant select (user_id, pin_failed_attempts, pin_locked_until, pin_changed_at, require_pin_for_sensitive_actions, created_at, updated_at)
  on public.user_security_settings to authenticated;

grant insert (user_id) on public.user_security_settings to authenticated;
revoke select (pin_hash) on public.user_security_settings from authenticated;
revoke update (pin_hash, pin_failed_attempts, pin_locked_until, pin_changed_at, require_pin_for_sensitive_actions)
  on public.user_security_settings from authenticated;

revoke all on public.security_events from anon;
revoke all on public.course_progress from anon;
revoke all on public.user_profiles from anon;

grant select, insert, update on public.user_profiles to authenticated;
grant select, insert, update, delete on public.course_progress to authenticated;
grant select on public.security_events to authenticated;
