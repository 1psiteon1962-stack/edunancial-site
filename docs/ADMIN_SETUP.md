# ADMIN_SETUP.md — Edunancial Administrator Setup

This guide covers administrator provisioning, role assignment, environment setup, and first-admin creation for the Edunancial platform.

---

## Overview

The Edunancial admin portal uses **server-side session authentication** backed by HMAC-signed cookies. There is no database of admin users — credentials are stored entirely in environment variables. This means:

- No admin credentials are stored in the database
- No SQL injection risk for admin authentication
- Credentials are changed by updating environment variables and redeploying

---

## Required Environment Variables

Set these in your deployment environment (Netlify dashboard, `.env.local`, etc.):

| Variable | Required | Description |
|---|---|---|
| `EDUNANCIAL_ADMIN_EMAIL` | ✅ Yes | The administrator's email address |
| `EDUNANCIAL_ADMIN_PASSWORD_HASH` | ✅ Yes | Scrypt-derived password hash (see below) |
| `EDUNANCIAL_ADMIN_SESSION_SECRET` | ✅ Yes | Random secret ≥32 characters for HMAC signing |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Base URL for canonical links and redirects |

### Additional variables (for full platform features):

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | For Supabase features | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | For Supabase features | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | For server-side Supabase | Supabase service role key |
| `GITHUB_TOKEN` | For content export | GitHub PAT for creating PRs from the content portal |

---

## First Administrator Setup

### Step 1: Generate a password hash

Run this command in the project root to generate a hash for your chosen password:

```bash
node -e "
const { scryptSync, randomBytes } = require('node:crypto');
const password = process.argv[1];
const salt = randomBytes(16).toString('hex');
const derived = scryptSync(password, salt, 64).toString('hex');
console.log(salt + ':' + derived);
" 'YourSecurePasswordHere'
```

Or use the built-in hash utility:

```bash
node -e "
const { hashAdminPassword } = require('./src/lib/admin-content/auth.ts');
" 
```

Alternatively, use this one-liner with ts-node:

```bash
npx tsx -e "
import { hashAdminPassword } from './src/lib/admin-content/auth.js';
console.log(hashAdminPassword('YourSecurePasswordHere'));
"
```

### Step 2: Set environment variables

```bash
# .env.local (development)
EDUNANCIAL_ADMIN_EMAIL=admin@yourdomain.com
EDUNANCIAL_ADMIN_PASSWORD_HASH=<output from step 1>
EDUNANCIAL_ADMIN_SESSION_SECRET=<random 32+ character string>
```

Generate a strong session secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

### Step 3: Deploy / restart

After setting environment variables:
- **Netlify**: Update environment variables in Site settings → Environment variables, then trigger a redeploy.
- **Local**: Create/update `.env.local` and restart `npm run dev`.

### Step 4: Log in

Navigate to `/admin/login` and sign in with the configured email and password.

---

## Admin Login URL

```
/admin/login
```

After login you are redirected to `/admin/dashboard`.

---

## Admin Routes

| Route | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin` | Redirects to `/admin/dashboard` |
| `/admin/dashboard` | Executive dashboard |
| `/admin/courses` | Course list and management |
| `/admin/courses/new` | Create a new course |
| `/admin/courses/[courseId]` | Edit an existing course |
| `/admin/courses/import` | Import a Claude course package |
| `/admin/media` | Media library |
| `/admin/content` | Content upload portal (batch review workflow) |
| `/admin/content/upload` | Upload files |
| `/admin/settings` | Settings and environment info |

---

## Role Assignment

The platform supports these roles for future role-based access control:

| Role | Access Level |
|---|---|
| `admin` | Full access to all admin routes |
| `content_manager` | Create and edit courses, media, content uploads |
| `instructor` | Future: limited course editing (not yet implemented) |
| `student` | Public website only |

Currently, authentication is binary: you either have a valid admin session or you don't. Role differentiation beyond `admin` is planned for a future release using Supabase user profiles.

### Promoting a user to admin

Because credentials are environment-based, "promoting a user to admin" means:
1. Issuing them the `EDUNANCIAL_ADMIN_EMAIL` and `EDUNANCIAL_ADMIN_PASSWORD_HASH` credentials, or
2. Creating a separate admin user account via Supabase with a `role = 'admin'` profile (when Supabase-backed multi-user admin is implemented).

---

## Password Reset

To reset the administrator password:
1. Generate a new hash: `node -e "const {scryptSync,randomBytes}=require('node:crypto');const salt=randomBytes(16).toString('hex');const h=scryptSync('NewPassword',salt,64).toString('hex');console.log(salt+':'+h);" 'NewPassword'`
2. Update `EDUNANCIAL_ADMIN_PASSWORD_HASH` in your deployment environment.
3. Redeploy.

The old session cookie will remain valid until it expires (default: 8 hours). To immediately invalidate all sessions, also rotate `EDUNANCIAL_ADMIN_SESSION_SECRET`.

---

## Session Configuration

Sessions are HMAC-signed using `SHA-256` with the `EDUNANCIAL_ADMIN_SESSION_SECRET`. Session data is stored entirely in an `HttpOnly` cookie.

| Setting | Default | Notes |
|---|---|---|
| Session duration | 8 hours | Configured in `src/lib/admin-content/config.ts` |
| Cookie name | `edunancial_admin_session` | HttpOnly, SameSite=Lax |
| CSRF token | Yes | Stored as a separate non-HttpOnly cookie |
| Rate limiting | 5 attempts / 15 min | Configurable in config.ts |

---

## Security Notes

- **No localStorage auth** — sessions are HttpOnly cookies only
- **CSRF protection** — state-changing API routes require a matching CSRF token header
- **Rate limiting** — login endpoint is rate-limited (5 attempts per 15 minutes per IP)
- **Audit log** — login success/failure events are logged via the audit system
- **Middleware enforcement** — all `/admin/*` routes (except `/admin/login`) require a valid session at the middleware layer
- **Path traversal protection** — file uploads are validated against allowlists in `src/lib/admin-content/security.ts`
- **Admin routes are noindexed** — `X-Robots-Tag: noindex, nofollow` is set by middleware

---

## Content Storage

Admin course data is stored in `.admin-data/` at the project root:

```
.admin-data/
  courses.json    ← Course CMS data (Course/Module/Lesson tree)
  media.json      ← Media library metadata
```

This directory is excluded from Git via `.gitignore`. In production on Netlify, the filesystem is ephemeral — courses will be lost on redeploy. For production persistence, the course storage should be migrated to:
- Supabase PostgreSQL tables, OR
- Netlify Blobs, OR
- A dedicated CMS database

The storage interface is abstracted in `src/lib/admin-content/course-storage.ts` — swapping backends requires only updating that file.

---

## Supported Upload Formats

The content upload portal (`/admin/content/upload`) accepts:

| Format | MIME Type | Use |
|---|---|---|
| `.txt` | text/plain | Raw text content |
| `.md`, `.mdx` | text/markdown | Markdown lessons and docs |
| `.json` | application/json | Structured content packages |
| `.csv` | text/csv | Tabular data |
| `.docx` | application/vnd.openxmlformats... | Word documents |
| `.pdf` | application/pdf | PDF resources and worksheets |
| `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif` | image/* | Images |
| `.svg` | image/svg+xml | Vector graphics |
| `.mp3`, `.wav`, `.m4a` | audio/* | Audio content |
| `.mp4`, `.webm` | video/* | Video content |
| `.zip` | application/zip | ZIP packages (extracted automatically) |

Executable files (`.exe`, `.dll`, `.bat`, `.sh`, `.js`, `.py`, etc.) are blocked.

---

## Netlify Configuration

The admin portal is compatible with Netlify. Key configuration:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"
```

Set environment variables in Netlify's site dashboard under **Site settings → Environment variables**. Never commit `.env.local` to Git.

---

## Troubleshooting

### "Too many login attempts"
Rate limiting has triggered. Wait 15 minutes or restart the development server.

### "EDUNANCIAL_ADMIN_SESSION_SECRET must be set to at least 32 characters"
Your session secret is too short or missing. Set a proper secret.

### "Invalid credentials"
Double-check that:
1. `EDUNANCIAL_ADMIN_EMAIL` exactly matches (case-insensitive)
2. `EDUNANCIAL_ADMIN_PASSWORD_HASH` was generated with the correct password

### Admin session not persisting
Ensure cookies are enabled and `EDUNANCIAL_ADMIN_SESSION_SECRET` is consistent across restarts. Changing the secret invalidates all existing sessions.
