# Branch Strategy

## Branch Model

This project follows a simplified trunk-based development model.

```
main / master  ──●──────────●──────────────●──── (production-ready)
                  \          \              /
develop            ●──────────●────────────   (integration branch)
                    \        / \
feature/*            ●──●──●   ●──●──●──     (short-lived feature branches)
hotfix/*                               ●──   (urgent production fixes)
```

---

## Branch Descriptions

| Branch | Purpose | Deploy Target | Direct Push |
|--------|---------|--------------|-------------|
| `main` / `master` | Production-ready code | Staging (auto) → Production (manual) | Protected — PRs only |
| `develop` | Integration of completed features | Development (auto) | Allowed for maintainers |
| `feature/*` | Individual features or fixes | PR preview (Netlify) | Normal |
| `hotfix/*` | Emergency production fixes | Staging → Production fast-track | Normal |
| `release/*` | Release preparation, final testing | Staging | Normal |

---

## Branch Protection Rules (recommended)

Configure at **Settings → Branches → Add rule** for `main`:

- ✅ Require pull request before merging
- ✅ Require at least 1 approving review
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ Require status checks to pass: `CI Gate`, `PR Checks`
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

---

## Naming Conventions

```
feature/course-catalog-v2
feature/fix-payment-flow
hotfix/checkout-crash-1234
release/v1.5.0
```

---

## Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <subject>

feat(courses): add multi-language course catalog
fix(checkout): resolve cart total rounding error
docs(cicd): update deployment workflow docs
ci(github-actions): add Lighthouse CI step
chore(deps): upgrade next.js to 15.5
```

Types: `feat`, `fix`, `docs`, `ci`, `chore`, `refactor`, `test`, `perf`, `style`, `build`
