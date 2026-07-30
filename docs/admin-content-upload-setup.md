# Admin Content Upload Setup

## 1. Required environment variables
Set the following server-only variables before using the portal in production:
- `EDUNANCIAL_ADMIN_EMAIL`
- `EDUNANCIAL_ADMIN_PASSWORD_HASH`
- `EDUNANCIAL_ADMIN_SESSION_SECRET`
- `EDUNANCIAL_UPLOAD_STORAGE_BUCKET` (preferred) or `EDUNANCIAL_UPLOAD_STORAGE_KEY` (legacy alias)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — required for the only supported production upload pipeline. The
  presign route will fail explicitly when this key is missing.
- Optional GitHub export variables: `EDUNANCIAL_GITHUB_TOKEN`, `EDUNANCIAL_GITHUB_OWNER`, `EDUNANCIAL_GITHUB_REPO`, `EDUNANCIAL_GITHUB_BASE_BRANCH`

## 2. Generate the password hash
Use the documented one-line Node command in `.env.example` to generate a `scrypt$<salt>$<hash>` string. Store the resulting hash in `EDUNANCIAL_ADMIN_PASSWORD_HASH` and keep the plaintext password out of the repo.

## 3. Create durable storage
Set `EDUNANCIAL_UPLOAD_STORAGE_BUCKET` (or legacy `EDUNANCIAL_UPLOAD_STORAGE_KEY`) to the target bucket name.
If `SUPABASE_SERVICE_ROLE_KEY` is configured, the server will attempt to create the bucket automatically when it
is missing. The production upload pipeline does not support anon-key upload fallbacks.
The portal stores:
- batch JSON metadata
- audit history
- original uploads
- export ZIP files

Development and tests can still use the local fallback store automatically, but production must use the signed Supabase upload pipeline.

## 4. Optional GitHub export setup
If you want one-click branch + PR creation:
1. Create a fine-grained GitHub token with repository contents + pull request write permissions.
2. Set `EDUNANCIAL_GITHUB_TOKEN`.
3. Set the repository owner/name and base branch.
4. Confirm the token remains server-only.

## 5. Netlify notes
- `NODE_ENV=production` should be present so secure cookies are enforced.
- The portal lives inside the existing Next.js app; no second application is required.
- Admin pages are tagged `noindex,nofollow` and receive a restrictive CSP through middleware.
- Legacy entry points (`/admin/uploads`, `/admin/videos`, `/content-loader`, `/cu`) are retired and redirect to `/admin/content/upload`.
