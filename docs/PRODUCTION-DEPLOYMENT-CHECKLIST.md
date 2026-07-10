# Production Deployment Checklist

## Pre-deploy
- [ ] `npm ci` completes successfully
- [ ] `npx tsc --noEmit` passes successfully
- [ ] `npm run build` passes successfully
- [ ] Netlify environment variables are set
- [ ] `_headers` reviewed for security-header correctness
- [ ] `_redirects` and `public/_redirects` reviewed

## Deployment
- [ ] Deploy from the release branch to Netlify production context
- [ ] Confirm build command and plugin execution from deployment logs

## Post-deploy validation
- [ ] `GET /api/health` returns `200`
- [ ] Homepage and core journeys load
- [ ] `robots.txt` and `sitemap.xml` are accessible
- [ ] Payment kickoff endpoint responds as expected
- [ ] KPI endpoints respond without server errors

## Sign-off
- [ ] Engineering sign-off
- [ ] Product/content sign-off
- [ ] Security/privacy sign-off
