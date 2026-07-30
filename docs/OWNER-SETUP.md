# Owner Account Setup Guide

This guide describes how to initialize the Owner (Super Administrator) account,
how to sign in, how to promote additional administrators, and how to recover
access if credentials are lost.

---

## Overview

Edunancial uses a **secure, server-side Role-Based Access Control (RBAC)** system
with the following roles:

| Role | Description |
|------|-------------|
| **owner** | Super Administrator. Bypasses all paywalls. Full platform access. |
| **admin** | Administrator. Full access except owner-only operations. |
| **editor** | Can create, edit, publish, unpublish, and archive content. |
| **instructor** | Can create and edit their own courses and lessons (draft only). |
| **member** | Paying member. Access governed by their membership tier. |
| **guest** | Unauthenticated or free-tier user. |

Owner credentials are **never stored in the repository**. They are established
through environment variables during deployment.

---

## 1. Initializing the Owner Account

### Step 1 — Generate a password hash

Use the credential generation script:

```bash
node scripts/generate-owner-credentials.mjs
```

The script will prompt for:
- Account type (owner or admin)
- Email address
- Password (minimum 12 characters)

It will output two values:

```
EDUNANCIAL_OWNER_EMAIL=owner@yourdomain.com
EDUNANCIAL_OWNER_PASSWORD_HASH=scrypt$<salt>$<hash>
```

**Do NOT commit these values to the repository.**

### Step 2 — Generate a session signing secret

```bash
node -e "require('crypto').randomBytes(32).toString('hex')" 
```

This produces a 64-character hex string. Set it as:

```
EDUNANCIAL_ADMIN_SESSION_SECRET=<64-char hex value>
```

### Step 3 — Set environment variables in your deployment

In your deployment platform (Netlify, Vercel, etc.), set:

| Variable | Description |
|----------|-------------|
| `EDUNANCIAL_OWNER_EMAIL` | Owner account email address |
| `EDUNANCIAL_OWNER_PASSWORD_HASH` | scrypt hash from the generator script |
| `EDUNANCIAL_ADMIN_SESSION_SECRET` | 32+ character random secret for session signing |
| `EDUNANCIAL_ADMIN_EMAIL` | (Optional) Separate admin account email |
| `EDUNANCIAL_ADMIN_PASSWORD_HASH` | (Optional) Admin account password hash |

**All of these are server-only variables** — never prefix them with `NEXT_PUBLIC_`.

---

## 2. Signing In

### Owner / Executive sign-in

Navigate to:

```
https://yourdomain.com/executive/login
```

Enter your owner email and password. On success you will be redirected to the
**Executive Dashboard** at `/executive/dashboard`.

### Administrator sign-in

Navigate to:

```
https://yourdomain.com/admin/login
```

Enter your admin email and password. On success you will be redirected to the
**Admin Content Portal** at `/admin/content`.

### Session behavior

- Sessions are valid for **8 hours** by default.
- Sessions are stored in an `httpOnly`, `secure`, `SameSite=Lax` cookie.
- All state-changing API calls require a CSRF token match.
- Sessions are signed with HMAC-SHA256 using `EDUNANCIAL_ADMIN_SESSION_SECRET`.
- Rate limiting: 5 failed login attempts per 15-minute window per IP.

---

## 3. What the Owner Can Do

The Owner role has **unrestricted access** to all platform functions:

- **Bypass all paywalls** — access every lesson regardless of membership tier
- **Lesson/course management** — create, edit, replace, publish, unpublish, archive, delete
- **Course track management** — manage RED, WHITE, BLUE, and all future tracks
- **User & role management** — promote/demote users at `/admin/users`
- **Membership management** — manage membership plans at `/admin/memberships`
- **Analytics** — full access to executive dashboard and all KPI data
- **System access** — all administrative functions

---

## 4. Promoting Additional Administrators

Roles are managed through the **User & Role Management** dashboard:

```
https://yourdomain.com/admin/users
```

**To promote a user to Administrator:**

1. Sign in as the Owner at `/executive/login`
2. Navigate to `/admin/users`
3. Enter the user's email address
4. Select the role (Admin, Editor, Instructor, etc.)
5. Click **Add User**

**Role assignment rules:**
- Only the **Owner** can assign or revoke the `owner` and `admin` roles
- Administrators can assign `editor`, `instructor`, `member`, `guest` roles

---

## 5. Recovering Access

### If you forgot your password

The password hash is stored in your deployment platform's environment variables,
not in the database. To reset:

1. Generate a new password hash:
   ```bash
   node scripts/generate-owner-credentials.mjs
   ```
2. Update `EDUNANCIAL_OWNER_PASSWORD_HASH` in your deployment environment
3. Redeploy the application (or trigger a function reload)

### If environment variables are lost

1. Regenerate all three required variables:
   - `EDUNANCIAL_OWNER_EMAIL`
   - `EDUNANCIAL_OWNER_PASSWORD_HASH`
   - `EDUNANCIAL_ADMIN_SESSION_SECRET`
2. Set them in your deployment platform
3. Redeploy

### If session signing secret changes

Changing `EDUNANCIAL_ADMIN_SESSION_SECRET` **invalidates all existing admin sessions**.
All admin users will need to log in again. This is expected and safe.

---

## 6. Security Notes

- **Never hard-code credentials** in the repository. The codebase reads all
  credential configuration from environment variables only.
- **Rotate credentials** periodically by generating new hashes with the script.
- **Audit logs** for all admin login successes and failures are written to
  `.admin-data/audit-log.json`.
- **Rate limiting** is enforced on login endpoints (5 attempts per 15 minutes).
- **CSRF protection** is enforced on all state-changing admin API calls.
- The admin and executive portals are excluded from search engine indexing via
  `X-Robots-Tag: noindex, nofollow`.

---

## 7. Architecture Reference

| Route | Role Required |
|-------|--------------|
| `/executive/login` | — (public login page) |
| `/executive/dashboard` | owner |
| `/admin/login` | — (public login page) |
| `/admin/content` | admin, owner |
| `/admin/courses` | admin, owner |
| `/admin/users` | admin, owner |
| `/admin/memberships` | admin, owner |
| `/api/admin/users` | admin, owner |
| `/api/admin/users/[id]` | admin (PATCH), owner (DELETE) |
| `/api/executive/auth/login` | — (sets owner session) |
| `/api/admin/auth/login` | — (sets admin session) |
| `/api/admin/auth/admin-status` | — (read-only bypass check) |

---

## 8. Environment Variable Quick Reference

```bash
# Owner account (super administrator)
EDUNANCIAL_OWNER_EMAIL=owner@yourdomain.com
EDUNANCIAL_OWNER_PASSWORD_HASH=scrypt$<salt>$<hash>

# Administrator account
EDUNANCIAL_ADMIN_EMAIL=admin@yourdomain.com
EDUNANCIAL_ADMIN_PASSWORD_HASH=scrypt$<salt>$<hash>

# Session signing (must be 32+ characters, kept server-only)
EDUNANCIAL_ADMIN_SESSION_SECRET=<random 64-char hex string>
```

Generate all three credential values with:

```bash
node scripts/generate-owner-credentials.mjs
node -e "require('crypto').randomBytes(32).toString('hex')"
```
