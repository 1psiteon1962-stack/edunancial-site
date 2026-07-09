# Edunancial Launch Checklist

## Platform hardening
- [x] Security headers aligned in Next.js and Netlify configuration
- [x] Admin routes protected when `ADMIN_METRICS_TOKEN` is configured
- [x] Public API endpoints validate payloads and apply basic rate limiting
- [x] Sensitive routes return `X-Robots-Tag: noindex, nofollow, noarchive`

## Accessibility and UX
- [x] Global skip link added
- [x] Shared navigation labeled for assistive technology
- [x] Root error boundary added for production failures
- [x] Image-heavy shared components migrated to `next/image`

## Environment and deployment
- [x] Netlify Node version aligned to 20
- [x] `.env.example` expanded with current required variables
- [x] Health endpoint added at `/api/health`
- [x] Production guides and runbooks documented in `/docs`

## Validation before launch
- [ ] Run `npm install`
- [ ] Run `npm run lint`
- [ ] Run `npm test`
- [ ] Run `npm run build`
- [ ] Review CodeQL and secret-scan results

## Residual launch items
- [ ] Replace placeholder member authentication/session flows with a production identity provider
- [ ] Add business-level automated integration and end-to-end tests
- [ ] Connect structured logs and alerts to the production observability stack
