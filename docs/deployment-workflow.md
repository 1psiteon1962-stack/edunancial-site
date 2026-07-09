# Deployment Workflow

## Environments

| Environment | Branch | Trigger | URL |
|-------------|--------|---------|-----|
| Development | `develop` | Auto on push | `https://dev.edunancial.com` |
| Staging | `main` / `master` | Auto on push | `https://staging.edunancial.com` |
| Production | Any tag `v*.*.*` | Manual dispatch | `https://www.edunancial.com` |

---

## Development Deployment

1. Push code to `develop` branch.
2. `cd-dev.yml` automatically triggers.
3. Runs: lint → type-check → tests → build.
4. Deploys to Netlify development site.
5. Health check runs against deployed URL.
6. Deployment record appended to `deployment-history.jsonl`.

**No approval required.**

---

## Staging Deployment

1. Merge PR to `main` or `master`.
2. `cd-staging.yml` triggers automatically.
3. Full quality gate runs (lint, typecheck, tests, security audit).
4. Build artifact uploaded.
5. Deploy to Netlify staging.
6. Health check runs; automatic rollback initiated on failure.

**No approval required. Automatic rollback on health check failure.**

---

## Production Deployment

Production deployments are **manual only** and require explicit approval.

### Steps

1. **Trigger**: Go to Actions → CD – Production → Run workflow.
2. Enter the version tag (e.g. `v1.4.2`) and type `DEPLOY` to confirm.
3. Full quality gate runs against the tagged commit.
4. Build is created and uploaded as artifact.
5. Workflow **pauses** at the `approval` job (requires reviewer in GitHub Environment settings).
6. Approved reviewer clicks "Approve and deploy".
7. Production deploy to Netlify executes.
8. Post-deploy health check runs.
9. **Automatic rollback** if health check fails.

### Configuring Reviewers

1. Go to **Settings → Environments → production**.
2. Add required reviewers (team members or yourself).
3. Set protection rules as appropriate.

---

## Post-Deploy Verification

`scripts/health-check.sh` retries up to 10 times (60-second window) checking for HTTP 2xx.

`scripts/deploy-verify.sh` additionally checks:
- Root page returns 200
- HTML contains `edunancial`
- `X-Frame-Options` header present
- HTTPS redirect enforced

---

## Rollback

See [Rollback Procedures](./rollback-procedures.md) for details.
