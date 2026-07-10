# Versioning and Release Workflow

## Versioning model
Use semantic versioning:
- `MAJOR`: breaking changes
- `MINOR`: backward-compatible features
- `PATCH`: backward-compatible fixes

## Branching and release flow
1. Prepare a release branch from the latest stable `main`.
2. Ensure documentation and implementation are aligned.
3. Run release validation (`npm ci`, `npx tsc --noEmit`, `npm run build`, smoke checks).
4. Merge to `main` and deploy through Netlify.
5. Tag the release (`vX.Y.Z`) and publish release notes.

## Minimum release gates
- Build passes.
- Required production environment variables are configured.
- Health endpoint and critical API smoke tests pass.
- Rollback plan is confirmed.
