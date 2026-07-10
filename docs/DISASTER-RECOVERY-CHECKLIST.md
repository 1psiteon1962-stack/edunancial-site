# Disaster Recovery Checklist

## Incident detection
- [ ] Confirm severity and blast radius (web, API, checkout, admin)
- [ ] Identify whether failure is infrastructure, configuration, or application-level
- [ ] Assign incident commander and communication owner

## Immediate mitigation
- [ ] Validate Netlify status and recent deploy history
- [ ] Roll back to the last known good deploy if the current release is implicated
- [ ] Revalidate `_headers` and `_redirects` if routing or security behavior regressed
- [ ] Verify required production environment variables are present and unchanged

## Service restoration validation
- [ ] `/api/health` returns a healthy response
- [ ] Critical pages and API routes are reachable
- [ ] Checkout flow endpoint responds (`/api/square/checkout`)

## Recovery completion
- [ ] Publish customer/internal status update
- [ ] Capture incident timeline and root-cause summary
- [ ] File follow-up implementation tasks for preventive controls
