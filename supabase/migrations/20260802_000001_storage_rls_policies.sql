-- Storage RLS policies for the admin content 'uploads' bucket.
--
-- HOW TO APPLY
-- ────────────
-- Run this file against your production Supabase project using the
-- Supabase SQL editor (Database → SQL Editor → New query) or the CLI:
--
--   supabase db push  (if using the Supabase CLI with local migrations)
--
-- You can verify the policy was applied with:
--
--   select policyname, cmd, roles, qual
--   from pg_policies
--   where schemaname = 'storage' and tablename = 'objects';
--
-- ────────────────────────────────────────────────────────────────────────────
-- BACKGROUND: WHY THE WEBSITE UPLOAD FAILED WITH RLS ERROR
-- ────────────────────────────────────────────────────────────────────────────
-- Supabase Storage uses PostgreSQL Row-Level Security (RLS) on the internal
-- storage.objects table.  When RLS is enabled (the default), all operations are
-- denied unless an explicit policy permits them.
--
-- The admin portal previously had a fallback "directUpload" path that sent the
-- anon key to the browser so the browser could POST file bytes directly to
-- Supabase Storage.  Because the anon key authenticates the request as the
-- `anon` Postgres role, Supabase evaluated the RLS policies for `anon` — and
-- since no INSERT policy existed for that role, every upload was rejected with:
--
--   HTTP 400  new row violates row-level security policy
--
-- The fallback path has been removed from the application code.  The portal now
-- uses one of two authenticated paths instead:
--
--   1. Signed upload URL (preferred, requires SUPABASE_SERVICE_ROLE_KEY):
--      The Next.js API server generates a time-limited signed URL using the
--      service-role key.  The browser PUTs the file directly to the signed URL.
--      Signed-URL uploads carry an embedded token that bypasses RLS entirely —
--      no INSERT policy for anon/authenticated is needed.
--
--   2. Server-proxied upload (fallback, also requires SUPABASE_SERVICE_ROLE_KEY):
--      When a signed URL cannot be generated, the browser sends file bytes to
--      the Next.js API function, which writes them to Supabase Storage using
--      the service-role key.  Service-role operations also bypass RLS.
--
-- In both cases SUPABASE_SERVICE_ROLE_KEY must be set in the Netlify environment.
-- Neither path requires a permissive INSERT policy for the anon role, and none
-- is added here.  Anonymous writes to this bucket are intentionally blocked.
-- ────────────────────────────────────────────────────────────────────────────

-- Allow anyone to read (GET) objects from the uploads bucket.
-- The bucket is configured as public in Supabase, which grants unauthenticated
-- read access.  This policy makes the intent explicit and guards against a
-- future change to the bucket's public flag accidentally locking out readers.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and policyname = 'uploads_public_read'
  ) then
    execute $policy$
      create policy "uploads_public_read"
        on storage.objects
        for select
        using (bucket_id = 'uploads')
    $policy$;
  end if;
end
$$;

-- Explicitly deny anonymous writes.
-- In Supabase, RLS denies all operations that are not covered by a permissive
-- policy, so this is effectively the default behaviour.  Adding an explicit
-- RESTRICTIVE policy makes the intent visible in pg_policies and ensures an
-- accidental future addition of an overly-broad permissive policy cannot
-- override this restriction without first removing this one.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and policyname = 'uploads_deny_anon_write'
  ) then
    execute $policy$
      create policy "uploads_deny_anon_write"
        on storage.objects
        as restrictive
        for insert
        to anon
        with check (false)
    $policy$;
  end if;
end
$$;
