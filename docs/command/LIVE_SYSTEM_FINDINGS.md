# COMMAND Phase 0 Live-System Findings

Reviewed against `main` before executable COMMAND schema work.

## Findings that change implementation

### 1. Existing member authentication still depends on Supabase Auth

`src/lib/auth/server.ts` imports Supabase user types and obtains the authenticated user through `createSupabaseServerAuthClient()`.

Therefore "Supabase removal" cannot be treated as a package deletion. COMMAND must initially adapt existing authenticated identities into PRINCIPAL records without making Supabase the COMMAND identity model. A later auth migration can replace the adapter without rewriting COMMAND authorization.

### 2. Neon access already exists

`src/lib/db/neon.ts` reads `DATABASE_URL` or `NETLIFY_DATABASE_URL` and exposes the Neon serverless client.

COMMAND database access should extend this established server-side pattern unless live schema inspection demonstrates a reason to change it.

### 3. Existing role configuration is application-role oriented

`src/config/roles.ts` defines guest/member/staff/geographic/executive/founder roles. These are not sufficient to represent COMMAND principals, AI workers, service identities, functional seats, or three distinct authority dimensions.

Do not overload `UserRole` to solve COMMAND authorization. Build a separate PRINCIPAL + assignment/capability model and bridge human users into it.

### 4. Existing global/regional UI is uneven

`src/app/admin/regional-management/page.tsx` is backed by localization data and can be reused/integrated where truthful.

`src/app/admin/country-dashboard/page.tsx` currently contains placeholder copy: "Country KPIs appear here." COMMAND must not reproduce or depend on placeholder metrics. A future integration should replace placeholder behavior only when backed by real metrics.

### 5. No repository SQL migration path was found by code search

Before applying COMMAND tables to production Neon, establish an explicit, reviewable migration mechanism. Schema changes must not be hidden inside runtime page requests.

## Implementation consequences

1. PRINCIPAL is provider-independent and can reference an external auth identity.
2. Human, AI, and system/service principals use the same core identity model.
3. Existing application roles remain intact until an intentional migration.
4. COMMAND authority is separate from membership/content access.
5. Phase 0 database work is additive and reversible.
6. Existing regional/localization sources are inputs; COMMAND does not create a competing source of truth without an explicit migration.
7. Placeholder country KPI UI is not considered implemented functionality.
8. No production schema mutation occurs until the migration is reviewable and the target Neon project/schema is positively identified.
