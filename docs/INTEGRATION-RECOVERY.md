# Integration Recovery

This branch establishes an executable validation path while pull requests #21-#24 are reconciled.

## Required merge sequence

1. Reconcile PR #21 with the current `main` branch.
2. Reconcile PR #22 and preserve release documentation.
3. Reconcile PR #23 and PR #24 together because both replace the homepage/dashboard experience.
4. Run the Integration Readiness workflow after each merge.
5. Do not merge a PR when the workflow is failing.

## Validation gates

- `npm ci`
- `npx tsc --noEmit`
- `npm run build`

## Release rule

A Netlify preview may be reviewed only after all validation gates pass on the exact commit being deployed.
