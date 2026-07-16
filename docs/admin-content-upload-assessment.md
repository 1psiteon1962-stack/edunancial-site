# Admin Content Upload Assessment

## Repository inspection summary
- Framework/runtime: Next.js 15 App Router with React 19, TypeScript, Tailwind, and Netlify deployment.
- Public chrome is defined in `/home/runner/work/edunancial-site/edunancial-site/src/app/layout.tsx`; admin isolation required a route-aware chrome wrapper instead of a public-site redesign.
- Existing public authentication lives in `/home/runner/work/edunancial-site/edunancial-site/src/lib/authContext.tsx` and uses `localStorage`; it is prototype-only and unsuitable for owner authorization.
- Existing admin routes under `/home/runner/work/edunancial-site/edunancial-site/src/app/admin/**` were mostly UI scaffolds with no secure server-side auth.
- Existing admin APIs under `/home/runner/work/edunancial-site/edunancial-site/src/app/api/admin/library/**` were placeholder routes with explicit comments that auth was still needed.
- Middleware existed at `/home/runner/work/edunancial-site/edunancial-site/src/middleware.ts` for request tracing; it now also attaches admin `noindex` and CSP headers.
- Environment-variable conventions were documented in `/home/runner/work/edunancial-site/edunancial-site/.env.example` and `/home/runner/work/edunancial-site/edunancial-site/docs/ENVIRONMENT-VARIABLES.md`.
- Durable-storage integrations were minimal; the closest reusable server-side pattern was the safe Supabase admin client configuration. The upload portal therefore uses a storage abstraction that prefers Supabase object storage in production and only falls back to local JSON/binary storage in development/test.
- Curriculum scripts already exist under `/home/runner/work/edunancial-site/edunancial-site/scripts/curriculum/`; the portal reuses ZIP-handling concepts and curriculum validation helpers instead of inventing a second curriculum pipeline.
- Test conventions already use `node:test` plus `tsc -p tsconfig.test.json`; the portal follows that pattern.

## Existing routes and APIs inspected
- App routes: `/home/runner/work/edunancial-site/edunancial-site/src/app/**`
- Admin pages: `/home/runner/work/edunancial-site/edunancial-site/src/app/admin/**`
- API routes: `/home/runner/work/edunancial-site/edunancial-site/src/app/api/**`
- Middleware: `/home/runner/work/edunancial-site/edunancial-site/src/middleware.ts`
- Providers: `/home/runner/work/edunancial-site/edunancial-site/src/components/Providers.tsx`
- Public auth prototype: `/home/runner/work/edunancial-site/edunancial-site/src/lib/authContext.tsx`
- Curriculum scripts/tests: `/home/runner/work/edunancial-site/edunancial-site/scripts/curriculum/**`
- Existing CMS workflow engine: `/home/runner/work/edunancial-site/edunancial-site/src/lib/cms/global-content.js`

## Related branch / PR / workflow findings
- Current working branch: `copilot/edunancial-content-upload-review-portal`
- Open related PR: `#100` (`[WIP] Implement secure content upload and review portal for Edunancial`)
- Related branches discovered during inspection included `copilot/build-integration-admin-portal-cms`, `copilot/build-global-cms`, `copilot/copilot1psiteon1962-stackcurriculum-management`, and the current content-upload branch.
- Latest workflow run inspected: `Integration Readiness` run `29461375194` for PR `#100`. GitHub Actions reported `action_required` with no failed jobs surfaced by the API at inspection time.

## Threat model
### Assets to protect
- Owner credentials and session secret
- Uploaded private content and extracted previews
- Proposed repository destinations and GitHub token
- Audit logs and approval history

### Primary threats
1. Credential theft via client storage or reflected secrets
2. CSRF against approve/reject/export/GitHub actions
3. ZIP bombs, archive traversal, symlink abuse, and duplicate filename collisions
4. Executable upload or disguised binary upload leading to later execution
5. Stored XSS through previews, filenames, descriptions, or SVG content
6. Silent overwrite of existing curriculum or content destinations
7. Direct commit to `main` or unintended auto-publish of uploaded assets
8. Private admin routes being indexed or leaked through public chrome

### Mitigations implemented
- Owner-only server-issued session with HttpOnly cookie, production `Secure`, `SameSite=Lax`, expiration, and HMAC signing
- Constant-time email/password-hash comparison with server-only scrypt hash format
- Separate non-HttpOnly CSRF cookie plus matching header checks on state-changing admin routes
- Login and upload rate limiting
- Admin middleware headers: `X-Robots-Tag: noindex, nofollow` and a restrictive admin CSP
- Filename normalization, path-traversal rejection, ZIP entry validation, duplicate entry detection, password-protected ZIP rejection, compression-ratio limits, extracted-size limits, and executable blocking
- Escaped/plain-text previews only; uploaded HTML/JS remains disallowed and uploaded SVG is treated as text, never inline-rendered
- Explicit approve/reject workflow with audit events; nothing publishes automatically
- GitHub export creates a branch from the configured base branch and opens a PR without merging

## Architectural decisions
- Authentication method: server-signed owner session in `/home/runner/work/edunancial-site/edunancial-site/src/lib/admin-content/auth.ts`
- Storage provider: abstraction in `/home/runner/work/edunancial-site/edunancial-site/src/lib/admin-content/storage/**`; Supabase object storage is the production target and local JSON/binary storage is development/test fallback only
- Reviewable-unit model: batches store original uploads separately from extracted/reviewable files
- Classification engine: deterministic filename/content rules under `/home/runner/work/edunancial-site/edunancial-site/src/lib/admin-content/classification/**`
- Curriculum integration: export/GitHub flow reuses existing curriculum validator helpers and destination conventions when a file resolves into `content/curriculum/**`

## Implementation report
### Files created
- `src/lib/admin-content/**`
- `src/components/admin-content/**`
- `src/components/layout/SiteChrome.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/content/page.tsx`
- `src/app/admin/content/upload/page.tsx`
- `src/app/admin/content/batches/[batchId]/page.tsx`
- `src/app/api/admin/auth/**`
- `src/app/api/admin/content/**`
- `docs/admin-content-upload-setup.md`
- `docs/admin-content-upload-user-guide.md`
- `docs/admin-content-upload-security.md`

### Files modified
- `.env.example`
- `docs/ENVIRONMENT-VARIABLES.md`
- `package.json`
- `tsconfig.test.json`
- `src/app/layout.tsx`
- `src/app/admin/page.tsx`
- `src/middleware.ts`

### Routes added
- `/admin/login`
- `/admin/content`
- `/admin/content/upload`
- `/admin/content/batches/[batchId]`
- `/api/admin/auth/login`
- `/api/admin/auth/logout`
- `/api/admin/auth/session`
- `/api/admin/content/upload`
- `/api/admin/content/batches`
- `/api/admin/content/batches/[batchId]`
- `/api/admin/content/batches/[batchId]/files/[fileId]`
- `/api/admin/content/batches/[batchId]/approve`
- `/api/admin/content/batches/[batchId]/reject`
- `/api/admin/content/batches/[batchId]/export`
- `/api/admin/content/batches/[batchId]/exports/[exportId]`
- `/api/admin/content/batches/[batchId]/github`

### Tests added
- `src/lib/admin-content/security.test.ts`
- `src/lib/admin-content/classification/classify.test.ts`
- `src/lib/admin-content/review.test.ts`
- `src/lib/admin-content/auth.test.ts`
- `src/lib/admin-content/service.test.ts`

### Commands run during implementation
- `npm install`
- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run curriculum:test`
- `npm run curriculum:validate`
- `npm run curriculum:audit`

### Command results
- Baseline before changes: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run curriculum:test`, `npm run curriculum:validate`, and `npm run curriculum:audit` passed; `npm test` failed with `TS5110` because `tsconfig.test.json` used `moduleResolution: node16` with `module: commonjs`.
- The admin-content changes update `tsconfig.test.json` to `module: Node16` so `npm test` can validate the new admin-content tests.

### Required environment variables
- `EDUNANCIAL_ADMIN_EMAIL`
- `EDUNANCIAL_ADMIN_PASSWORD_HASH`
- `EDUNANCIAL_ADMIN_SESSION_SECRET`
- `EDUNANCIAL_UPLOAD_STORAGE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- Optional GitHub export vars: `EDUNANCIAL_GITHUB_TOKEN`, `EDUNANCIAL_GITHUB_OWNER`, `EDUNANCIAL_GITHUB_REPO`, `EDUNANCIAL_GITHUB_BASE_BRANCH`

### Unresolved risks / follow-up items
- Supabase bucket provisioning is a manual deployment step.
- GitHub API integration depends on a server-only token with repo write + pull-request scope.
- The production storage implementation assumes a pre-created Supabase bucket and does not yet create it automatically.
- Rate limiting is in-memory best-effort; for horizontally scaled deployments, replace it with a shared store.

### Manual Netlify configuration required
1. Add the admin env vars in Netlify site settings.
2. Create the Supabase storage bucket referenced by `EDUNANCIAL_UPLOAD_STORAGE_KEY`.
3. Ensure Netlify sets `NODE_ENV=production` so `Secure` admin cookies are enforced.

### Portal URL and owner workflow
- Admin upload portal URL: `/admin/content/upload`
- Owner workflow: sign in at `/admin/login`, upload or ZIP files, review extracted items in `/admin/content/batches/[batchId]`, export a ZIP or create a GitHub PR, then verify the Netlify deploy preview before merge.
