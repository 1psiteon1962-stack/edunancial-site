# Release Management

## Versioning

This project uses [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

| Component | When to increment |
|-----------|------------------|
| `MAJOR` | Breaking changes |
| `MINOR` | New features, backward-compatible |
| `PATCH` | Bug fixes, performance improvements |

Pre-release suffixes: `-alpha.1`, `-beta.1`, `-rc.1`

---

## Creating a Release

### Automated (recommended)

1. Go to **Actions → Release Management → Run workflow**.
2. Select bump type: `patch`, `minor`, or `major`.
3. Optionally provide a pre-release identifier (e.g. `beta.1`).
4. The workflow:
   - Calculates the next version
   - Creates and pushes a git tag
   - Generates release notes from commit history
   - Updates `CHANGELOG.md`
   - Creates a GitHub Release

### Manual Tag

```bash
git tag -a v1.5.0 -m "Release v1.5.0"
git push origin v1.5.0
```

Pushing the tag triggers `release.yml` to create the GitHub Release automatically.

---

## Changelog Maintenance

`CHANGELOG.md` is updated automatically when a tag is pushed. Format:

```markdown
## [v1.5.0] - 2025-02-01

### ✨ Features
- feat: added course catalog filtering (a3f9d12)

### 🐛 Bug Fixes
- fix: resolved checkout total rounding error (b7c21e4)
```

Conventional commit messages (`feat:`, `fix:`) feed directly into the auto-generated release notes.

---

## Release Approval Workflow

Before creating a production release:

1. All quality gates must pass (CI, security, coverage).
2. Staging deployment verified by QA.
3. Release notes drafted and reviewed.
4. Create GitHub Release (creates tag).
5. Trigger production deployment workflow with the new tag.
6. Await production approval from authorized reviewer.

---

## Deployment History

Every deployment appends a JSON line to `deployment-history.jsonl`:

```json
{"env":"production","version":"v1.4.2","sha":"a3f9d12","url":"https://www.edunancial.com","ts":"2025-01-09T18:00:00Z","actor":"release-bot","status":"success"}
```

This file provides an audit trail. In the future, connect it to the DevOps dashboard for live data.
