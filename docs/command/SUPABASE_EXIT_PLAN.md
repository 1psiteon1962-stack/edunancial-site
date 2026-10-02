# Supabase Exit Plan — Safe Neon Cutover

## Objective

Remove Supabase as a runtime dependency without losing authentication, member profiles, entitlements, progress, payments, beta access, security history, video data, or customer data.

## Verified current state

Repository search found 158 Supabase references and 37 direct `@/lib/supabase` imports under `src`.

Active runtime responsibilities include:
- authentication/session refresh and confirmation;
- member profiles and paid entitlements;
- beta grants;
- course/lesson/track progress;
- applied-learning decisions and competency evidence;
- security settings/events;
- Square catalog/orders/webhook idempotency;
- portions of video/project persistence and storage.

Existing customer-data schemas are defined primarily in `supabase/migrations`; equivalent provider-neutral Neon migrations are not currently present.

## Rule

Do not uninstall Supabase packages, remove credentials, or delete migrations until the runtime dependency count is zero and data parity is verified.

## Migration sequence

### Stage A — Establish provider-neutral persistence

1. Add explicit Neon migration directory and migration ledger.
2. Port PostgreSQL-compatible tables/functions from legacy Supabase migrations.
3. Replace Supabase-specific `auth.users`, `auth.uid()`, `auth.role()`, RLS policies, and service-role assumptions with application-enforced identity/authorization and appropriate database roles.
4. Preserve existing external user IDs during migration so progress and entitlements do not detach from accounts.
5. Add migration verification queries: row counts, key uniqueness, orphan checks, membership distribution, progress totals, webhook uniqueness.

### Stage B — Repository cutover

Move server-side persistence behind provider-neutral repositories in this order:
1. payment webhook idempotency and payment persistence;
2. learner/applied-learning persistence;
3. profiles/security/beta entitlements;
4. video/project persistence and storage abstraction.

Each repository gets contract tests before its caller is switched.

### Stage C — Authentication cutover

Authentication is last because current middleware/session/profile flows depend on Supabase Auth.

Requirements:
- provider-neutral application session interface;
- secure password/reset/email verification flow or selected auth provider;
- preserve user identity mapping;
- dual-read/controlled transition where necessary;
- verified login/logout/reset/confirmation/profile/member-tier/beta flows;
- rollback path until cutover verification passes.

COMMAND PRINCIPAL must reference application identity, not a Supabase-specific type.

### Stage D — Data migration and reconciliation

For every migrated table:
- export source;
- import target transactionally where practical;
- preserve primary/business keys;
- compare counts and checksums/aggregates;
- verify representative customer records;
- freeze or dual-write only for the minimum cutover window;
- record migration audit result.

### Stage E — Decommission

Only after production verification:
- prove zero runtime imports/calls/config reads;
- remove Supabase middleware/helpers;
- remove Supabase packages;
- remove Supabase environment variables/secrets;
- disable obsolete Supabase workflows;
- archive legacy migrations as historical migration evidence rather than silently erasing provenance;
- run full build, auth, payment, progress, curriculum, admin, and launch-readiness suites.

## Neon conversion notes discovered

Most table definitions are ordinary PostgreSQL and reusable.

Supabase-specific pieces that must be redesigned rather than copied:
- foreign keys to `auth.users`;
- `auth.uid()` and `auth.role()`;
- Supabase RLS policies;
- service-role assumptions;
- Supabase Auth admin user lookup;
- Supabase Storage calls.

## Safety gates

No stage advances on a red build.

No destructive source deletion occurs before target reconciliation.

No membership entitlement is inferred from missing data.

No learner progress is reset.

No payment webhook idempotency is weakened.

No curriculum publication path is changed as part of this migration.

No authentication provider migration is combined with unrelated curriculum repair.
