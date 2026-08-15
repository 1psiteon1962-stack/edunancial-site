# Member Security Deployment

## External console actions only

### 1. Apply Supabase migrations
- Apply all migrations in `supabase/migrations/`, including:
  - `20260814_000001_member_security_learning.sql`
  - `20260815_000001_member_security_hardening.sql`
- Confirm the new tables, triggers, and RLS policies exist in the target Supabase project.

### 2. Configure Supabase Auth URLs
Set the production site URL and redirect URLs in the Supabase Auth console.
Required redirects:
- `https://www.edunancial.com/auth/confirm`
- `https://www.edunancial.com/verify-email`
- `https://www.edunancial.com/reset-password`
- add matching preview/staging URLs if those environments are used

### 3. Enable email verification and recovery email templates
In Supabase Auth:
- keep email confirmation enabled for production member registration
- enable password recovery emails
- ensure recovery and confirmation emails use the production redirect URLs above

### 4. Set Netlify environment variables
Configure these values in Netlify for every deployed environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `EDUNANCIAL_CURRICULUM_SECRET`
- `EDUNANCIAL_MEMBER_PIN_PEPPER`
- existing Square production secrets already required by checkout/webhook flows

### 5. Generate strong secrets
Generate and store securely:
- `EDUNANCIAL_CURRICULUM_SECRET`: minimum 32 random characters
- `EDUNANCIAL_MEMBER_PIN_PEPPER`: minimum 32 random characters
Do not reuse old development placeholders.

### 6. Membership fulfillment check
Verify the production Square webhook endpoint is active and that verified webhook events are the only path granting paid membership entitlements.
- confirm `payment.completed` events reach `/api/square/webhook`
- confirm the purchaser's matching Supabase member profile receives the expected `membership_tier`
- confirm browser success redirects alone do not change paid entitlement

### 7. Optional MFA/TOTP follow-up
This repository exposes extension points only.
Before enabling member MFA in UI, complete Supabase MFA/TOTP configuration in the Supabase Auth console and validate the end-to-end enrollment and recovery flows.
Passkeys are intentionally not faked and require separate WebAuthn infrastructure planning.

### 8. RLS verification
Run production checks in Supabase SQL editor or with project verification scripts:
- authenticated user can read only own `user_profiles`
- authenticated user can read/write only own `course_progress`
- authenticated user cannot update `membership_tier`
- authenticated user cannot read `pin_hash`
- authenticated user can read only own `security_events`
- anonymous access to member tables is denied

### 9. Backup and restore verification
Before launch:
- confirm current Supabase backups are healthy
- verify restore procedure for `user_profiles`, `course_progress`, `user_security_settings`, and `security_events`
- document the tested restore timestamp and operator
