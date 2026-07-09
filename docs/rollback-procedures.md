# Rollback Procedures

## Overview

Multiple rollback mechanisms are available depending on severity and environment.

---

## Automatic Rollback (CI/CD)

The staging and production CD workflows automatically trigger a rollback when the post-deploy health check fails.

The rollback script (`scripts/rollback.sh`) calls the Netlify API to restore the previous successful deploy.

**No manual action required** — the workflow handles it automatically.

---

## Manual Rollback via Script

```bash
# Set environment variables
export NETLIFY_AUTH_TOKEN=<your-token>
export NETLIFY_SITE_ID_PRODUCTION=<site-id>

# Rollback production
./scripts/rollback.sh production v1.4.2

# Rollback staging
export NETLIFY_SITE_ID_STAGING=<site-id>
./scripts/rollback.sh staging v1.4.2
```

The script:
1. Fetches the last 10 Netlify deploys for the site.
2. Finds the most recent `ready` (successful) deploy.
3. Calls Netlify's `/restore` API endpoint to make it live.

---

## Manual Rollback via Netlify Dashboard

1. Log in to [Netlify](https://app.netlify.com).
2. Open your site.
3. Go to **Deploys**.
4. Find the last known-good deploy.
5. Click **Publish deploy**.

This is the safest fallback if scripts fail.

---

## Rollback via Git Revert

For code-level rollback (removes a feature entirely):

```bash
git revert <bad-commit-sha>
git push origin main
```

This creates a new commit that undoes the bad change. CI/CD will deploy the reverted code normally.

---

## Emergency Hotfix

If rollback is not possible and a critical bug must be fixed:

1. Create a `hotfix/issue-description` branch from the last good tag.
2. Apply the minimal fix.
3. Push and open a PR — `pr-validate.yml` runs CI.
4. Fast-track merge after review.
5. Manually trigger production deployment with the hotfix tag.

---

## Rollback Decision Matrix

| Severity | Response Time | Action |
|----------|--------------|--------|
| P0 – Site down | < 5 min | Netlify dashboard rollback |
| P1 – Critical bug | < 15 min | Automatic or script rollback |
| P2 – Major regression | < 1 hour | Script rollback or git revert |
| P3 – Minor issue | Next release cycle | Git revert + normal CD |
