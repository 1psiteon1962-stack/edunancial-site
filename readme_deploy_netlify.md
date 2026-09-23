# Netlify deployment (Next.js plugin)

This project is deployed on Netlify using the Next.js runtime plugin.

## Deployment target

This repository must be linked to **exactly one** Netlify project: the production
Edunancial site at `https://edunancial.com`.

If you see deployments appearing on a `brilliant-sunflower-*` Netlify subdomain or
any site other than the production Edunancial project, see the **Root cause and
fix** section below.

## Source of truth
- `netlify.toml`
- `_headers`
- `_redirects`
- `public/_redirects`

## Build settings
Netlify executes:
- `npm run build`

Configured publish directory:
- `.next`

Configured plugin:
- `@netlify/plugin-nextjs`

## Root cause and fix for multi-site deployments

The Netlify GitHub App integration allows more than one Netlify site to be
connected to the same GitHub repository.  When two sites are connected, every push
triggers a build on both.  The `brilliant-sunflower-*` name is the auto-generated
subdomain Netlify uses before a custom domain is assigned to a new site.

**This is a Netlify dashboard configuration issue, not a repository code issue.**

To fix:
1. Go to <https://app.netlify.com>.
2. Open the unintended `brilliant-sunflower-*` (or equivalent) site.
3. **Site configuration → Build & deploy → Continuous deployment → Unlink repository.**
4. Confirm the unlink for `1psiteon1962-stack/edunancial-site`.
5. (Optional) Delete the unintended site if it is no longer needed.
6. Verify the production Edunancial site still shows this repository linked under
   its own **Build & deploy → Continuous deployment** page.

After this change only the production Edunancial Netlify site will receive builds
from this repository.

## Notes
- This repository is not currently configured for `open-next` in scripts.
- Keep this README aligned with `netlify.toml` when deployment settings change.
- `netlify.toml` does not contain a `site_id` field — Netlify's TOML spec does not
  support one.  Site linkage is controlled exclusively through the Netlify dashboard
  and/or the Netlify CLI (`netlify link` → `.netlify/state.json`).
