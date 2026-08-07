# Deployment

## Deployment target

The repository deploys to the **Edunancial production Netlify project** only.

- Canonical URL: `https://edunancial.com`
- Repository: `1psiteon1962-stack/edunancial-site`
- Deployment method: Netlify GitHub App integration (git-based continuous deployment)

There must be exactly **one** Netlify site linked to this repository at all times.
Pull request Deploy Previews are allowed but must belong to the same production
Netlify project — not to a separate site such as `brilliant-sunflower-*`.

---

## Root cause of multi-site deployments (brilliant-sunflower-*)

Netlify's GitHub App integration allows multiple Netlify sites to be connected to
the same GitHub repository.  When more than one site is linked, every push triggers
a build on **every** connected site.  The `brilliant-sunflower-*` subdomain is the
auto-generated name Netlify assigns to a new site before a custom domain is set.

This root cause is **external to the repository**: there is no site ID in
`netlify.toml`, no `.netlify/state.json` file, and no `NETLIFY_SITE_ID` in any
GitHub Actions workflow.  The fix must be applied in the Netlify dashboard.

---

## Required Netlify dashboard action — eliminating the extra site

1. Log in to <https://app.netlify.com>.
2. Locate the unintended site (name contains `brilliant-sunflower` or any name
   that is not the production Edunancial project).
3. Open **Site configuration → Build & deploy → Continuous deployment**.
4. Click **Unlink repository** (or **Disconnect**) and confirm.
   - This stops that site from receiving any future builds from this repo.
   - It does not delete the site or its prior deployments.
5. If the unintended site is not needed, delete it:
   **Site configuration → General → Danger zone → Delete this site**.
6. Switch to the production Edunancial Netlify site.
7. Confirm **Site configuration → Build & deploy → Continuous deployment** shows:
   - Repository: `1psiteon1962-stack/edunancial-site`
   - Production branch: `main`
   - Deploy Previews: enabled (for PRs)
   - Branch deploys: disabled (or restricted to specific branches only)

After step 4 only the production Edunancial Netlify site will receive deployments.

---

## Verification after the fix

1. Push a trivial commit (e.g. whitespace change) to `main`.
2. Go to `https://app.netlify.com` and confirm:
   - Only the Edunancial production site shows a new deploy in progress.
   - No deploy appears on `brilliant-sunflower-*` or any other site.
3. Confirm the production deploy URL resolves to `https://edunancial.com`.

---

## Source of truth for build configuration
- `netlify.toml` — build command, publish directory, plugin, redirects, headers
- `_redirects`, `public/_redirects` — additional redirect rules
- `_headers` — additional header rules

## Build configuration

`netlify.toml` currently sets:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `22`
- Plugin: `@netlify/plugin-nextjs`

## Required checks before deploy
1. Install dependencies with `npm ci`.
2. Build the production bundle with `npm run build`.
3. Verify environment variables in Netlify (see `docs/ENVIRONMENT-VARIABLES.md`).
4. Validate redirects and headers in Deploy Preview.

## Post-deploy smoke checks
- `GET /api/health` returns `200` and JSON body with `ok: true`.
- Core pages load (`/`, `/about`, `/courses`, `/membership`, `/contact`).
- Admin crawl blocking remains active (`/robots.txt`).
- Checkout endpoint responds (`POST /api/square/checkout`).
