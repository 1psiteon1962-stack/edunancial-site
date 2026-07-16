# Repository Governance Policy

Repository: `1psiteon1962-stack/edunancial-site`

> **Note:** The `EXECUTIVE_WORKFLOW_POLICY.md` at the root of this repository is the authoritative executive standard. This document supplements it and remains in force for all matters not addressed there.

This policy applies immediately to the North American site and shall become the standard for every future Edunancial regional repository (Latin America, Caribbean, Europe, Africa, Asia, and all subsequent deployments).

## Task Lifecycle

A task is **not** considered complete until **all** of the following have occurred:

- Development completed
- Local testing completed
- Build successful
- Pull Request created
- Pull Request reviewed
- Pull Request approved
- Pull Request merged into `main`
- Deployment completed successfully
- Production verification completed

Completed code shall **never** remain in Draft status or in an unmerged Pull Request without a documented technical reason.

## Merge Discipline

Upon completion of every assigned task:

1. Synchronize with the latest `main` branch.
2. Resolve all merge conflicts.
3. Open a **Ready for Review** Pull Request immediately.
4. Request review.
5. Upon approval, merge immediately.
6. Delete the feature branch.
7. Confirm deployment completed successfully.
8. Confirm the production website functions correctly.

## Continuous Repository Cleanup

At the beginning and end of every work session, the agent shall:

- Review all open branches.
- Review all Draft Pull Requests.
- Review all open Pull Requests.
- Identify merge conflicts.
- Recommend immediate merges where appropriate.
- Eliminate stale branches.
- Ensure the repository remains in a deployable state.

## No Backlog of Completed Work

Completed work waiting for merge is considered repository debt.

The objective is to keep the repository as close to production-ready as possible at all times.

If an agent discovers completed work awaiting review, the highest priority becomes reviewing, approving, and merging that work before beginning additional feature development whenever practical.

## Global Standard

This workflow is mandatory for every Edunancial repository, every regional deployment, every future language version, and every coding agent working on the platform.
