# Production Member Authentication — Assessment & Implementation

**Branch:** `feature/production-member-auth`  
**Date:** 2026-07-16  
**Status:** Implemented

---

## 1. Pre-Implementation Findings

### 1.1 Current Architecture (Prototype)

The existing authentication in `src/lib/authContext.tsx` was entirely browser-based:

| Concern | Finding | Risk |
|---------|---------|------|
| User storage | `localStorage` key `edu_users` holds all registered members | **CRITICAL** — data exists only in that browser |
| Session | `localStorage` key `edu_auth` holds current user object | **CRITICAL** — any page injection can forge membership |
| Password hashing | `simpleHash()` — a 31-bit polynomial hash | **CRITICAL** — not cryptographically secure |
| Membership tier | Derived entirely from the stored user object | **HIGH** — client can grant itself any tier |
| Beta access | Stored in `localStorage` key `edunancial:beta-invitations` | **HIGH** — client can forge beta status |
| Assessment completion | Stored in `localStorage` user object | **MEDIUM** — client can mark itself complete |
| Payment status | Not verified server-side in any route | **HIGH** |
| Route protection | Client-side redirect in components only | **HIGH** — API routes were unprotected |
| Admin authorization | `require-admin.ts` was a stub returning `true` | **CRITICAL** — all admin routes were open |

### 1.2 Places Trusting Client-Supplied Data (Before This Change)

- `authContext.tsx` — entire auth flow
- `components/dashboard/DashboardClient.tsx` — reads `user.membershipTier` from localStorage state
- `components/profile/ProfileClient.tsx` — reads `user.bio` from localStorage state
- `lib/beta-access.ts` — `BETA_INVITATIONS_STORAGE_KEY`, `BETA_AUDIT_STORAGE_KEY`
- `app/page.tsx` — called `isLoggedIn()` (stub returning false)
- `lib/international/preferences.ts` — called `currentUser()` (stub returning null)

---

## 2. Implementation Summary

### 2.1 Database

**Provider:** Supabase (PostgreSQL)  
**Rationale:** Already referenced in `.env.example` and `src/lib/kpi/supabaseAdmin.ts`. Managed, serverless-compatible, has Row Level Security.

**Migration file:** `supabase/migrations/001_member_auth.sql`

**Tables created:**

| Table | Purpose |
|-------|---------|
| `members` | Canonical member records with hashed credentials |
| `email_verification_tokens` | Single-use, time-limited email verification |
| `password_reset_tokens` | Single-use, 1-hour expiry password reset |
| `member_sessions` | Optional server-side session revocation log |
| `member_assessments` | Assessment results (server-persisted) |
| `member_access` | Explicit entitlement grants |
| `beta_invitations` | Beta pass records (moved from localStorage) |
| `audit_events` | Immutable audit trail |

All tables have RLS enabled. Server-side access uses `SUPABASE_SERVICE_ROLE_KEY` only.

### 2.2 Authentication

**Password hashing:** `bcryptjs` with cost factor 12  
**Session management:** `iron-session` v8 with encrypted, signed HttpOnly cookies  
**Session lifetime:** 7 days  
**Cookie flags:** `httpOnly: true`, `secure: true` (production), `sameSite: "lax"`

**No secrets in NEXT_PUBLIC variables.**  
**No passwords, hashes, or tokens in localStorage.**

### 2.3 API Routes Added

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/session` | GET | Restore UI session from server cookie |
| `/api/auth/register` | POST | Create member, send verification email |
| `/api/auth/login` | POST | Validate credentials, issue session |
| `/api/auth/logout` | POST | Destroy session cookie |
| `/api/auth/verify-email` | POST | Consume email verification token |
| `/api/auth/resend-verification` | POST | Resend verification email |
| `/api/auth/forgot-password` | POST | Request password reset (enumeration-safe) |
| `/api/auth/reset-password` | POST | Consume reset token, set new password |
| `/api/auth/profile` | PATCH | Update member profile (authenticated) |

### 2.4 Client AuthProvider Refactor

`src/lib/authContext.tsx` was rewritten:

**Before:** All auth logic ran in the browser. Users stored in localStorage.  
**After:** The `AuthProvider` is a thin UI-state layer. On mount, it calls `GET /api/auth/session` to restore state from the server cookie. All mutations call the corresponding API routes.

**Preserved:** The `AuthUser` interface shape, `useAuth()` hook, `validatePassword()` export — all existing components continue to work without modification.

### 2.5 Middleware Route Protection

`src/middleware.ts` updated to:
- Read the iron-session cookie (without decrypting the full session in middleware for performance)
- Redirect unauthenticated users to `/login?next=<path>` for protected pages
- Return `401` from protected API routes

**Protected routes:** `/dashboard`, `/profile`, `/my-courses`, `/my-books`, `/my-certificates`, `/assessment/start`, `/settings`, `/account`

### 2.6 Email Service

`src/lib/email/index.ts` — provider-neutral abstraction:

- `console` (default in development) — prints to terminal
- `resend` — set `EMAIL_PROVIDER=resend` and `RESEND_API_KEY`
- `sendgrid` — set `EMAIL_PROVIDER=sendgrid` and `SENDGRID_API_KEY`

### 2.7 Entitlement Service

`src/lib/auth/entitlements.ts` — server-controlled access decisions:

- Membership tier derived from `members.membership_tier` + active beta invitations
- Academy levels derived from tier (never from client)
- Explicit access grants (courses, books, certificates) from `member_access` table
- Payment webhook updates membership via `grantMembershipFromPayment()` (server-only)

### 2.8 Rate Limiting

`src/lib/auth/rateLimiter.ts`:

| Endpoint | Limit |
|----------|-------|
| Login | 10 req / 15 min per IP |
| Register | 5 req / 60 min per IP |
| Forgot Password | 5 req / 60 min per IP |
| Verify Email | 10 req / 60 min per IP |

---

## 3. Files Created

| File | Description |
|------|-------------|
| `supabase/migrations/001_member_auth.sql` | Full database schema |
| `src/lib/db/supabase.ts` | Real Supabase client (replaces mock) |
| `src/lib/auth/session.ts` | iron-session management |
| `src/lib/auth/memberService.ts` | Member CRUD, bcrypt hashing, token management |
| `src/lib/auth/rateLimiter.ts` | In-memory rate limiter |
| `src/lib/auth/entitlements.ts` | Server-side entitlement service |
| `src/lib/email/index.ts` | Provider-neutral email abstraction |
| `src/app/api/auth/session/route.ts` | Session endpoint |
| `src/app/api/auth/register/route.ts` | Registration endpoint |
| `src/app/api/auth/login/route.ts` | Login endpoint |
| `src/app/api/auth/logout/route.ts` | Logout endpoint |
| `src/app/api/auth/verify-email/route.ts` | Email verification |
| `src/app/api/auth/resend-verification/route.ts` | Resend verification |
| `src/app/api/auth/forgot-password/route.ts` | Password reset request |
| `src/app/api/auth/reset-password/route.ts` | Password reset consumption |
| `src/app/api/auth/profile/route.ts` | Profile update |
| `src/app/reset-password/page.tsx` | Reset password page |
| `src/components/auth/ResetPasswordForm.tsx` | Reset password form |
| `src/components/auth/VerifyEmailClient.tsx` | Email verification UI |
| `scripts/auth/tests/auth.test.mjs` | 22 auth tests (all passing) |
| `docs/production-member-auth-assessment.md` | This document |

## 4. Files Modified

| File | Change |
|------|--------|
| `src/lib/authContext.tsx` | Rewritten — server API instead of localStorage |
| `src/lib/authContext.legacy.tsx` | Backup of original for migration reference |
| `src/lib/auth.ts` | Updated — backward-compat stubs, no server imports |
| `src/lib/auth/require-admin.ts` | Updated — reads actual session |
| `src/lib/auth/useSession.ts` | Updated — uses AuthContext |
| `src/middleware.ts` | Updated — session-based route protection |
| `src/app/verify-email/page.tsx` | Updated — token-processing client component |
| `src/components/auth/ForgotPasswordForm.tsx` | Updated — calls server API |
| `src/components/profile/ProfileClient.tsx` | Fixed `bio` → `biography` field name |
| `.env.example` | Added all new auth environment variables |

---

## 5. Environment Variables Required

```
# Session encryption (required — never use NEXT_PUBLIC_*)
AUTH_SESSION_SECRET=<64 hex chars of random data>

# Public site URL for email links
NEXT_PUBLIC_SITE_URL=https://www.edunancial.com

# Supabase (already required for KPI — now also for member auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email provider
EMAIL_PROVIDER=console   # or resend, sendgrid
EMAIL_FROM_ADDRESS=noreply@edunancial.com
EMAIL_FROM_NAME=Edunancial
RESEND_API_KEY=re_...    # if EMAIL_PROVIDER=resend
SENDGRID_API_KEY=SG....  # if EMAIL_PROVIDER=sendgrid
```

Generate session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 6. Database Setup (Supabase)

1. Go to your Supabase project → SQL Editor
2. Run `supabase/migrations/001_member_auth.sql`
3. Verify all 8 tables were created
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your Netlify environment variables

---

## 7. Migration Strategy for Prototype Users

**Current situation:** All existing user data exists only in individual browsers' `localStorage`. There is no central user database.

**Safe approach:**
1. Do NOT automatically transmit stored password hashes — they use `simpleHash` which is insecure
2. Do NOT claim those records have been centrally saved
3. All users will need to create a new account at `/register`
4. The new registration flow will send an email verification link
5. Non-sensitive profile data (name, country) can be optionally pre-filled if the user explicitly initiates a migration helper (not yet implemented — see Phase 9 of requirements)

**What to communicate to existing beta testers:**
> "We've upgraded our platform to a secure server-side authentication system. Please create a new account with the same email address you used before. Your beta invitation will be re-associated automatically."

Beta invitations previously stored in `localStorage` will need to be re-seeded into the `beta_invitations` table by an administrator before beta users can log in with their beta status.

---

## 8. Netlify Deployment Steps

1. Add all environment variables listed in Section 5 to Netlify → Site → Environment Variables
2. The `AUTH_SESSION_SECRET` must be at least 32 characters
3. Run the Supabase migration SQL (Section 6)
4. Deploy — the build will succeed without database connectivity
5. Test registration flow at `/register`
6. Test login flow at `/login`
7. Test password reset at `/forgot-password`
8. Verify session is in cookie storage (not localStorage) in browser DevTools

---

## 9. Unresolved Issues / Future Work

| Issue | Priority | Notes |
|-------|----------|-------|
| Beta invitation admin seeding | HIGH | Admin needs a UI or API to add beta invitations to the DB |
| Square webhook → entitlement update | HIGH | `grantMembershipFromPayment()` is implemented but the Square webhook handler needs to call it |
| Assessment server persistence | MEDIUM | Assessment results should be saved to `member_assessments` table |
| Rate limiter persistence | MEDIUM | In-memory rate limiter resets on cold start; use Redis or Supabase for multi-instance |
| CSRF token header | MEDIUM | Consider adding explicit CSRF token for SPA flows |
| Email provider setup | MEDIUM | Configure `EMAIL_PROVIDER=resend` with a verified domain |
| Legacy `isLoggedIn()`/`currentUser()` callers | LOW | `page.tsx` and `preferences.ts` use these stubs — they return `false`/`null` which is safe |
| Session revocation table | LOW | `member_sessions` table exists but session tokens aren't written to it yet |

---

## 10. Test Results

```
Auth tests:          22 pass, 0 fail
Curriculum tests:    42 pass, 0 fail  
International tests:  9 pass, 0 fail
Regionalization tests: 14 pass, 0 fail
TypeScript:          0 errors
Lint:                0 errors (2 pre-existing img warnings)
Build:               ✅ success
```
