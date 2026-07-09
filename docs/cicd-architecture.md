# CI/CD Architecture

## Overview

Edunancial uses a layered, GitHub Actions-based CI/CD platform designed for reliability, speed, and security.

```
┌─────────────────────────────────────────────────────────────┐
│                        Developer Push                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │       CI Pipeline (ci.yml)      │
          │  install → lint → typecheck →  │
          │  test → build → a11y → lhci    │
          └───────────────┬────────────────┘
                          │ passes
          ┌───────────────▼────────────────┐
          │    CD – Development / Staging   │
          │  (cd-dev.yml / cd-staging.yml)  │
          └───────────────┬────────────────┘
                          │ staging passes
          ┌───────────────▼────────────────┐
          │   CD – Production (manual)      │
          │  (cd-production.yml)            │
          │  quality-gate → build →         │
          │  approval → deploy → verify     │
          └─────────────────────────────────┘
```

---

## Workflow Files

| File | Trigger | Purpose |
|------|---------|---------|
| `ci.yml` | push / PR to main, master, develop | Build, lint, type-check, test, accessibility, Lighthouse |
| `pr-validate.yml` | All pull requests | Fast gate before merge |
| `security.yml` | push / PR / weekly schedule | Dependency audit, secret scan, SAST, license check |
| `cd-dev.yml` | push to `develop` | Auto-deploy to development environment |
| `cd-staging.yml` | push to `main`/`master` | Auto-deploy to staging environment |
| `cd-production.yml` | `workflow_dispatch` only | Manual + approval-gated production deploy |
| `release.yml` | tag push `v*.*.*` / manual | Create GitHub release, update CHANGELOG |

---

## CI Job Dependency Graph

```
install
  ├── lint
  ├── typecheck
  └── test (with coverage)
       └── build
             ├── accessibility (informational)
             └── lighthouse (informational)
ci-success (gate: lint + typecheck + test + build must pass)
```

---

## Technology Stack

- **Runtime**: Node.js 20 (LTS)
- **Framework**: Next.js 15 (React 19)
- **Test runner**: Jest 30 + @testing-library/react
- **Linter**: ESLint via `next lint`
- **Type checker**: TypeScript 5 via `tsc --noEmit`
- **Deployment**: Netlify via `nwtgck/actions-netlify`
- **Security**: CodeQL, TruffleHog, npm audit, license-checker, OSSF Scorecard
- **Performance**: Lighthouse CI

---

## Coverage Thresholds

| Metric | Threshold |
|--------|-----------|
| Branches | 50% |
| Functions | 50% |
| Lines | 50% |
| Statements | 50% |

Thresholds are defined in `jest.config.ts`. Raise them as coverage improves.

---

## Secret Requirements

| Secret | Used by |
|--------|---------|
| `NETLIFY_AUTH_TOKEN` | All CD workflows |
| `NETLIFY_SITE_ID_DEV` | cd-dev.yml |
| `NETLIFY_SITE_ID_STAGING` | cd-staging.yml |
| `NETLIFY_SITE_ID_PRODUCTION` | cd-production.yml |
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions |

Configure in **Settings → Secrets and variables → Actions**.
