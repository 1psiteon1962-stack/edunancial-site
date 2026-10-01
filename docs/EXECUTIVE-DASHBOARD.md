# EXECUTIVE DASHBOARD

**Repository:** `1psiteon1962-stack/edunancial-site`

**Policy:** [EXECUTIVE_WORKFLOW_POLICY.md](../EXECUTIVE_WORKFLOW_POLICY.md)

**Instructions:** Update this file at the start and end of every work session. Every row must be current. "Unknown" is not acceptable.

---

## Coding Tasks (Active Branches)

| Branch | Owner | Status | PR # | Notes |
|--------|-------|--------|------|-------|
| repair/normalize-localized-frontmatter | ChatGPT | Implementation complete; validation/PR in progress | pending | Normalize quoted localized YAML front-matter values so live learner titles match committed curriculum exactly |
| repair/one-time-package-recovery-runner | ChatGPT | Implementation complete; validation/PR in progress | pending | One-package-at-a-time recovery runner and bounded GitHub Actions loop for stored curriculum packages |

---

## Draft PRs

| PR # | Title | Branch | Reason for Draft | Expected Ready Date |
|------|-------|--------|-----------------|---------------------|
| _(none)_ | — | — | — | — |

---

## Ready for Review

| PR # | Title | Branch | Waiting Since | Reviewer |
|------|-------|--------|--------------|---------|
| _(none)_ | — | — | — | — |

---

## Approved — Waiting Merge

| PR # | Title | Approved By | Approved Date | Merge Blocker (if any) |
|------|-------|------------|--------------|------------------------|
| _(none)_ | — | — | — | — |

---

## Merged Today

| PR # | Title | Merged At | Deployment Triggered | Deployment Result |
|------|-------|-----------|---------------------|------------------|
| _(none today)_ | — | — | — | — |

---

## Netlify Deployments

| Environment | Status | Last Deploy | Commit | URL |
|-------------|--------|-------------|--------|-----|
| Production (`main`) | Ready | 2026-10-01 03:11 UTC | e0a2b4f325dfc97586224319fe5dad7f9b97def6 | https://edunancial.com |
| Deploy Preview | — | — | — | — |

---

## Production Validation — Last Run

**Date:** _(not yet run)_
**Branch/Commit:** —

| # | Item | Result | Notes |
|---|------|--------|-------|
| 1 | Homepage | ☐ | |
| 2 | Desktop navigation | ☐ | |
| 3 | Mobile navigation | ☐ | |
| 4 | Language selector visibility | ☐ | |
| 5 | Language selector usability | ☐ | |
| 6 | Language selector functionality | ☐ | |
| 7 | Full page translation | ☐ | |
| 8 | Registration | ☐ | |
| 9 | Login | ☐ | |
| 10 | Logout | ☐ | |
| 11 | Password reset | ☐ | |
| 12 | Marketplace | ☐ | |
| 13 | Course pages | ☐ | |
| 14 | Video lessons | ☐ | |
| 15 | AI Coach | ☐ | |
| 16 | FAQ | ☐ | |
| 17 | Contact | ☐ | |
| 18 | Pricing | ☐ | |
| 19 | Dashboard | ☐ | |
| 20 | Payment | ☐ | |
| 21 | Mobile responsiveness | ☐ | |
| 22 | Images | ☐ | |
| 23 | Links | ☐ | |
| 24 | No 404 errors | ☐ | |
| 25 | No untranslated strings | ☐ | |
| 26 | No placeholder content | ☐ | |
| 27 | Acceptable performance | ☐ | |

---

## Blocking Issues

| PR # | Branch | Owner | Technical Reason | Business Impact | Required Fix | Next Action | Expected Resolution |
|------|--------|-------|-----------------|----------------|-------------|------------|---------------------|
| pending | repair/normalize-localized-frontmatter | ChatGPT | Live curriculum smoke reports false mismatches caused by quoted localized front matter | Full production verification cannot distinguish formatting noise from genuine curriculum gaps | Normalize parsed title/summary values and re-run smoke | Merge after all checks, then verify live curriculum | This session |

---

## Dashboard Update Log

| Date | Session | Updated By | Summary |
|------|---------|-----------|---------|
| 2026-10-01 | Curriculum verification | ChatGPT | Fixed quoted localized front-matter parsing that caused live smoke false mismatches; validation in progress. |
| 2026-10-01 | Curriculum recovery | ChatGPT | Added bounded, one-package-at-a-time recovery runner; production main remains ready on #1044. |\n| 2026-09-25 | Intelligence Phase 1 | ChatGPT | Started implementation of EDUNANCIAL Intelligence Layer Phase 1. |\n| 2026-07-16 | Initial | Copilot Agent | Dashboard created. No active work items. |
