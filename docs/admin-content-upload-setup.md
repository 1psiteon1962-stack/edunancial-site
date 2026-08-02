# Admin Content Upload Setup

## 1. Required environment variables
Set the following server-only variables before using the portal in production:
- `EDUNANCIAL_ADMIN_EMAIL`
- `EDUNANCIAL_ADMIN_PASSWORD_HASH`
- `EDUNANCIAL_ADMIN_SESSION_SECRET`
- `EDUNANCIAL_UPLOAD_STORAGE_BUCKET` (preferred) or `EDUNANCIAL_UPLOAD_STORAGE_KEY` (legacy alias)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` **required for production uploads** — the service-role key bypasses
  Supabase RLS so the portal can create the storage bucket and read/write objects freely.  It is
  also required to generate signed upload URLs for direct browser-to-Supabase transfers.  Without
  this key the portal falls back to sending file bytes through the Netlify function (subject to the
  6 MB body limit) and still requires the key on the server for the write operation.  Always set
  `SUPABASE_SERVICE_ROLE_KEY` in the Netlify environment for production.

  The previous anon-key direct-upload path (where the browser uploaded directly to Supabase using
  only `NEXT_PUBLIC_SUPABASE_ANON_KEY`) has been removed because it required permissive Supabase RLS
  INSERT policies for the `anon` role on `storage.objects`.  Without such policies every upload
  failed with `HTTP 400 / new row violates row-level security policy`.  The correct production
  path uses signed URLs (generated server-side with the service-role key) or the server-proxied
  upload, both of which bypass RLS via the service-role key.
- Optional GitHub export variables: `EDUNANCIAL_GITHUB_TOKEN`, `EDUNANCIAL_GITHUB_OWNER`, `EDUNANCIAL_GITHUB_REPO`, `EDUNANCIAL_GITHUB_BASE_BRANCH`

## 2. Generate the password hash
Use the documented one-line Node command in `.env.example` to generate a `scrypt$<salt>$<hash>` string. Store the resulting hash in `EDUNANCIAL_ADMIN_PASSWORD_HASH` and keep the plaintext password out of the repo.

## 3. Create durable storage
Set `EDUNANCIAL_UPLOAD_STORAGE_BUCKET` (or legacy `EDUNANCIAL_UPLOAD_STORAGE_KEY`) to the target bucket name.
If `SUPABASE_SERVICE_ROLE_KEY` is configured, the server will attempt to create the bucket automatically when it
is missing.  If only the anon key is set, bucket creation is skipped and the bucket **must** be pre-created in
the Supabase Dashboard before the first upload — attempting creation with the anon key fails with an RLS
`403 Unauthorized` error.
The portal stores:
- batch JSON metadata
- audit history
- original uploads
- export ZIP files

Development and tests can use the local fallback store automatically, but production must use Supabase-backed storage.

## 4. Apply the storage RLS migration
Run the migration in `supabase/migrations/20260802_000001_storage_rls_policies.sql` against your
Supabase project (Database → SQL Editor → New query, or via `supabase db push`).  The migration:

- Adds an explicit `SELECT` (read) policy so the public bucket allows unauthenticated reads.
- Adds an explicit `RESTRICTIVE` INSERT policy for the `anon` role that blocks anonymous writes,
  documenting that anonymous uploads are intentionally denied.

You can verify the migration was applied with:
```sql
select policyname, cmd, roles, qual
from pg_policies
where schemaname = 'storage' and tablename = 'objects';
```

## 5. Optional GitHub export setup
If you want one-click branch + PR creation:
1. Create a fine-grained GitHub token with repository contents + pull request write permissions.
2. Set `EDUNANCIAL_GITHUB_TOKEN`.
3. Set the repository owner/name and base branch.
4. Confirm the token remains server-only.

## 6. Netlify notes
- `NODE_ENV=production` should be present so secure cookies are enforced.
- The portal lives inside the existing Next.js app; no second application is required.
- Admin pages are tagged `noindex,nofollow` and receive a restrictive CSP through middleware.
