# Owner access and beta codes

- Executive (owner) login: `/executive/login` with the email in `EDUNANCIAL_OWNER_EMAIL`
  and the password whose scrypt hash is in `EDUNANCIAL_OWNER_PASSWORD_HASH` (Netlify,
  production, secret). Password rotated 2026-10-21 at the owner's request.
- Admin content login uses `EDUNANCIAL_ADMIN_EMAIL` / `EDUNANCIAL_ADMIN_PASSWORD_HASH`.
- Beta Tester Codes (`/admin/beta-testers`) require the owner login. Codes are stored as
  hashes in Neon `beta_invite_codes`; each grants 30 days from redemption and can be
  extended 1-180 days or replaced by a new code.
- The owner's member accounts (owner and admin emails, confirmed) have permanent full
  access to all tracks, Levels 1-5 and all languages.
- Changing the owner email or password: update the Netlify variables, then redeploy
  (function environment is read at deploy time).
