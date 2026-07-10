# Production Deployment Checklist

## Pre-deploy
- [ ] `npm ci` completes successfully
- [ ] `npm run build` passes successfully
- [ ] Netlify environment variables are set (see `docs/ENVIRONMENT-VARIABLES.md`)
- [ ] `_headers` reviewed for CSP and security header correctness
- [ ] `_redirects` and `public/_redirects` reviewed for canonical redirects

## Deployment
- [ ] Deploy from release branch to Netlify production context
- [ ] Confirm build command and plugin execution from deployment logs

## Post-deploy validation
- [ ] `GET /api/health` returns `200`
- [ ] Homepage and core journeys load on production domain
- [ ] `robots.txt` and `sitemap.xml` are accessible
- [ ] Payment kickoff endpoint (`/api/square/checkout`) responds as expected
- [ ] KPI endpoints (`/api/kpi`, `/api/kpi/track`) respond without server errors

## Sign-off
- [ ] Engineering sign-off
- [ ] Product/content sign-off
- [ ] Security/privacy sign-off
