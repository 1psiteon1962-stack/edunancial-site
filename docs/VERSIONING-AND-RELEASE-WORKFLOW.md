# Versioning and Release Workflow

## Versioning model
Use semantic versioning:
- `MAJOR`: breaking changes
- `MINOR`: backward-compatible features
- `PATCH`: backward-compatible fixes

## Branching/release flow
1. Prepare release branch from latest stable `main`.
2. Ensure docs and implementation are aligned.
3. Run release validation (`npm ci`, `npm run build`, smoke checks).
4. Merge to `main` and deploy through Netlify.
5. Tag release (`vX.Y.Z`) and publish release notes using `docs/RELEASE-NOTES-TEMPLATE.md`.

## Minimum release gates
- Build passes.
- Required production env vars are configured.
- Health endpoint and critical API smoke tests pass.
- Rollback plan is confirmed.
