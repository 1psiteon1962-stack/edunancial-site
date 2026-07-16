# PERMANENT EXECUTIVE WORKFLOW POLICY

**Repository:** `1psiteon1962-stack/edunancial-site`

**Effective:** Immediately

**Applies To:** All GitHub Agents, Copilot Agents, Claude-generated content, future repositories, and all regional Edunancial websites.

**Authority:** This document supersedes `REPOSITORY_WORKFLOW_POLICY.md`, `REPOSITORY_GOVERNANCE_POLICY.md`, and `docs/mandatory-merge-and-deployment-workflow.md` wherever they conflict with these rules. All three remain in force for matters not addressed here.

---

## Primary Objective

No completed work shall remain sitting in an unfinished state.

Every completed task must move continuously from development to production without unnecessary delay.

Development is not considered complete until the feature is successfully running on the live production website.

---

## Mandatory Feature Lifecycle

Every feature shall follow this workflow without exception:

| Step | Stage |
|------|-------|
| 1 | Requirements approved |
| 2 | Coding completed |
| 3 | Automated tests pass |
| 4 | Manual review completed |
| 5 | Pull Request changed from Draft to Ready for Review |
| 6 | Pull Request approved |
| 7 | Pull Request merged into `main` |
| 8 | Netlify production deployment begins |
| 9 | Netlify deployment succeeds |
| 10 | Live production validation completed |
| 11 | Feature marked Complete |
| 12 | Feature branch closed |

A feature may not stop at any intermediate stage unless a documented blocker exists (see Blocker Requirements below).

---

## No Completed Work May Remain Open

The following are **prohibited** unless accompanied by a documented blocker:

- Completed Draft PRs
- Completed Ready-for-Review PRs awaiting merge
- Completed feature branches
- Completed coding awaiting deployment
- Completed deployment awaiting validation

---

## Production Validation Checklist

After every merge into `main`, wait for Netlify deployment, then validate every item:

| # | Item | Status |
|---|------|--------|
| 1 | Homepage | ☐ |
| 2 | Desktop navigation | ☐ |
| 3 | Mobile navigation | ☐ |
| 4 | Language selector visibility | ☐ |
| 5 | Language selector usability | ☐ |
| 6 | Language selector functionality | ☐ |
| 7 | Full page translation | ☐ |
| 8 | Registration | ☐ |
| 9 | Login | ☐ |
| 10 | Logout | ☐ |
| 11 | Password reset | ☐ |
| 12 | Marketplace | ☐ |
| 13 | Course pages | ☐ |
| 14 | Video lessons | ☐ |
| 15 | AI Coach | ☐ |
| 16 | FAQ | ☐ |
| 17 | Contact | ☐ |
| 18 | Pricing | ☐ |
| 19 | Dashboard | ☐ |
| 20 | Payment | ☐ |
| 21 | Mobile responsiveness | ☐ |
| 22 | Images | ☐ |
| 23 | Links | ☐ |
| 24 | No 404 errors | ☐ |
| 25 | No untranslated strings | ☐ |
| 26 | No placeholder content | ☐ |
| 27 | Acceptable performance | ☐ |

If any validation item fails, immediately:

1. Fix
2. Commit
3. Merge
4. Redeploy
5. Validate again

Repeat until all validation passes.

---

## Executive Dashboard

The repository must maintain visibility at all times across these categories. Update `docs/EXECUTIVE-DASHBOARD.md` at the start and end of every work session:

- **Coding Tasks** — active branches and their status
- **Draft PRs** — list with reason for Draft status
- **Ready for Review** — PRs awaiting reviewer action
- **Approved Waiting Merge** — PRs approved but not yet merged
- **Merged Today** — PRs merged in the current session/day
- **Netlify Deployments** — current deployment status
- **Production Validation** — last validation pass/fail per checklist item
- **Blocking Issues** — documented blockers (see format below)

---

## Blocker Requirements

If a feature cannot move forward, every blocker must be recorded with all of the following fields:

| Field | Required |
|-------|----------|
| PR Number | Yes |
| Branch | Yes |
| Owner | Yes |
| Technical reason | Yes |
| Business impact | Yes |
| Required fix | Yes |
| Next action | Yes |
| Expected resolution | Yes |

**"Waiting" is not an acceptable blocker.** A blocker must describe a specific, documentable technical or business condition that genuinely prevents forward progress.

---

## Global Content Standard

The website architecture shall permanently support:

- Claude-generated content
- Direct content pasting
- YouTube video integration
- Educational Marketplace
- Books
- Courses
- Lesson pages
- AI Coach
- Downloadable resources
- Merchandise
- Future product categories

No architectural changes should be required when new educational content is added.

---

## Global Website Standard

Every regional Edunancial website shall inherit this workflow automatically:

| Region |
|--------|
| North America |
| Latin America |
| Caribbean |
| Europe |
| Africa |
| Asia |
| Australia / Oceania |
| Any future regional deployment |

---

## Final Executive Rule

**Agent completion is NOT repository completion.**

Repository completion requires all five of the following:

| Requirement | Must Be True |
|-------------|-------------|
| PR merged into `main` | ✓ |
| Netlify deployment successful | ✓ |
| Live production validation passed | ✓ |
| Executive dashboard updated | ✓ |
| Feature branch closed | ✓ |

Only when all five are satisfied is the work officially complete.

---

## End-of-Task Report

At the completion of every task, the agent shall provide:

1. Summary of work completed
2. Files modified
3. Pull Request information (number, URL, merge status)
4. Deployment status (Netlify URL, success/fail)
5. Production verification (which checklist items were validated)
6. Remaining issues or open blockers
7. Recommended next highest-priority task
