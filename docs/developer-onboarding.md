# Developer Onboarding

Welcome to the Edunancial platform development team!

---

## Prerequisites

- [Node.js 20](https://nodejs.org/) (use `.nvmrc`: `nvm use`)
- [npm 10+](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommended)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/1psiteon1962-stack/edunancial-site.git
cd edunancial-site

# 2. Use correct Node version
nvm use   # reads .nvmrc (Node 20)

# 3. Install dependencies
npm install

# 4. Set up local environment
cp .env.example .env.local
# Edit .env.local with your local values

# 5. Start the development server
npm run dev
# Open http://localhost:3000
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (hot-reload) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type check |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ci` | Run tests in CI mode (coverage + passWithNoTests) |

---

## Project Structure

```
src/
├── app/            # Next.js App Router pages
│   ├── admin/      # Admin portal pages
│   └── ...         # Public pages
├── components/     # Reusable UI components
├── __tests__/      # Test files (mirrors src/ structure)
├── lib/            # Shared utilities and data
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
└── utils/          # Helper functions

docs/               # Project documentation
scripts/            # DevOps automation scripts
.github/
├── workflows/      # GitHub Actions CI/CD workflows
├── CODEOWNERS      # Code ownership rules
└── pull_request_template.md
```

---

## Development Workflow

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/my-feature
   ```

2. **Make changes**, run lint and tests locally:
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(courses): add bilingual course catalog"
   ```

4. **Push and open a PR** to `develop`.

5. **PR validation** runs automatically (lint, typecheck, tests, build).

6. Get **code review** from at least one team member.

7. **Merge** — staging auto-deploys from `main`.

---

## CI/CD Overview

See [CI/CD Architecture](./cicd-architecture.md) for full details.

- Every push runs: lint → type-check → tests → build.
- Every PR runs: full validation gate.
- Merging to `main` triggers staging deployment.
- Production deploys require manual trigger + approval.

---

## Admin Dashboard

The admin portal is at `/admin`. Includes:
- Executive Dashboard (`/admin/dashboard`)
- DevOps Dashboard (`/admin/devops`) ← deployment/build status
- Security Center (`/admin/security-dashboard`)
- KPI Center (`/admin/kpi`)

---

## Getting Help

- Check the `docs/` folder for all documentation.
- Review open issues and PRs on GitHub.
- Reach out on the team Slack / Discord.
