# Netlify Integration Cleanup

## Summary

Two stale Netlify integrations are attached to this repository and posting failing
GitHub status checks on every pull request:

| Stale status context | Origin |
|---|---|
| `netlify/edunancial-site/deploy-preview` | Old Netlify site named **edunancial-site** |
| `netlify/brilliant-sunflower-2bd9de/deploy-preview` | Old Netlify site with auto-generated name **brilliant-sunflower-2bd9de** |

The **only valid** Netlify status context is:

```
netlify/edunancial/deploy-preview
```

This corresponds to the production site `edunancial.com`.

## Audit findings

A full audit of the repository was completed on 2026-07-22. No references to
`brilliant-sunflower-2bd9de` or to any stale Netlify site ID were found inside
source files, `netlify.toml`, GitHub Actions workflows, or any configuration
file committed to the repository.

**Conclusion:** The stale status checks originate entirely outside the
repository. They are posted by the **Netlify GitHub App** on behalf of two old
Netlify projects that still have this repository linked as their connected Git
repository. No repository-side code change can remove them.

## Where the stale integrations originate

The Netlify GitHub App (`github.com/apps/netlify`) can be authorized by any
Netlify account. When a Netlify site is connected to a GitHub repository, the
app gains permission to post commit statuses and deploy-preview notifications.
The two stale contexts prove that two old sites were connected to this repository
and were never disconnected after the production site was migrated to
`edunancial.com`.

## Required remediation (external to this repository)

All remediation steps must be performed by a Netlify account owner or team
admin with access to the stale sites.

### Option A — Unlink via the Netlify dashboard (recommended)

1. Sign in to [app.netlify.com](https://app.netlify.com).
2. Locate the **edunancial-site** project in the team's Sites list.
3. Go to **Site configuration → Build & deploy → Continuous deployment**.
4. Click **Unlink repository** (or **Disconnect**).
5. Confirm the disconnection.
6. Repeat steps 2–5 for the **brilliant-sunflower-2bd9de** project.

After unlinking, neither site will post further GitHub status checks to this
repository. Any existing failing checks will remain visible on old pull requests
but will no longer appear on new commits or new pull requests.

### Option B — Delete the stale sites entirely

If the old sites are no longer needed at all:

1. Sign in to [app.netlify.com](https://app.netlify.com).
2. Open **edunancial-site** → **Site configuration → General → Danger zone**.
3. Click **Delete this site** and confirm.
4. Repeat for **brilliant-sunflower-2bd9de**.

Deleting a site also removes its GitHub App connection.

### Option C — Revoke GitHub repository access via GitHub

If access to the Netlify dashboard for the old sites is unavailable:

1. Go to **GitHub → Settings → Integrations → Applications**.
2. Select the **Netlify** GitHub App.
3. Under **Repository access**, remove `1psiteon1962-stack/edunancial-site`
   from any Netlify app installation that does not belong to the active
   `edunancial.com` production account.

**Note:** GitHub only shows which GitHub *account* the app is installed under,
not which Netlify sites are connected. If the old sites belong to the same
Netlify account as the production site, prefer Option A or Option B to avoid
accidentally revoking access for the production site.

## How to verify remediation is complete

After completing the steps above:

1. Open a new pull request (or push a new commit to an existing PR).
2. Check the **Checks** tab on the pull request.
3. Confirm that only `netlify/edunancial/deploy-preview` appears.
4. Confirm that `netlify/edunancial-site/deploy-preview` and
   `netlify/brilliant-sunflower-2bd9de/deploy-preview` no longer appear.

## Repository configuration (no changes required)

`netlify.toml` is correctly scoped to the production build. No site ID,
no stale context names, and no deploy-preview overrides referencing old
sites are present. The file should remain as-is.

The active production deployment context is controlled entirely by the
`edunancial.com` Netlify site settings and does not require repository-side
changes to maintain.
