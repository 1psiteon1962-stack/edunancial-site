# Environment Configuration

## Environments

| Name | Purpose | Branch | URL |
|------|---------|--------|-----|
| `local` | Developer machine | Any | `http://localhost:3000` |
| `development` | Integration testing | `develop` | `https://dev.edunancial.com` |
| `staging` | Pre-production QA | `main` | `https://staging.edunancial.com` |
| `production` | Live users | tagged release | `https://www.edunancial.com` |

---

## Environment Variables

### Local Development

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

`.env.local` is git-ignored and **must never be committed**.

### GitHub Actions Secrets

Configure at **Settings → Secrets and variables → Actions**:

| Secret | Description | Environments |
|--------|-------------|--------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token | all |
| `NETLIFY_SITE_ID_DEV` | Netlify site ID for dev | dev |
| `NETLIFY_SITE_ID_STAGING` | Netlify site ID for staging | staging |
| `NETLIFY_SITE_ID_PRODUCTION` | Netlify site ID for production | production |
| `AIRTABLE_API_KEY` | Airtable API key | staging, production |
| `AIRTABLE_BASE_ID` | Airtable base ID | staging, production |
| `ADMIN_METRICS_TOKEN` | Long random string for admin API | staging, production |

### Next.js Public Variables

Variables prefixed `NEXT_PUBLIC_` are exposed to the browser. Do **not** put secrets in `NEXT_PUBLIC_*` variables.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ENV` | Current environment name (`development`, `staging`, `production`) |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region for content (`us`) |

---

## GitHub Environments

Create three environments in **Settings → Environments**:

### `development`
- No protection rules
- Variables: `NETLIFY_SITE_ID_DEV`

### `staging`
- No protection rules (auto-deploy from `main`)
- Variables: `NETLIFY_SITE_ID_STAGING`

### `production`
- ✅ Required reviewers (add at least one)
- ✅ Deployment branches: protected branches only
- Variables: `NETLIFY_SITE_ID_PRODUCTION`

---

## .env.example Structure

See the root `.env.example` file for all available variables with placeholder values. Add new variables to both `.env.example` (with placeholder) and the appropriate GitHub Environment secrets.

---

## Secret Hygiene Rules

1. **Never commit real secrets** — `.env`, `.env.local`, etc. are git-ignored.
2. **Never echo secrets in logs** — avoid `echo $SECRET`.
3. **Rotate on exposure** — if a secret is accidentally committed, rotate it immediately and audit Git history.
4. **Use GitHub Environments** — scope production secrets to the `production` environment to limit blast radius.
5. **TruffleHog scans every PR** — secret detection is automated.
