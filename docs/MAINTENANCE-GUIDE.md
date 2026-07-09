# Maintenance Guide

## Regular maintenance tasks
- Review dependencies and security advisories weekly
- Re-run lint, test, and build validation after dependency updates
- Confirm legal/trust content and contract versions are current
- Audit admin token access when team membership changes

## Content and integration maintenance
- Keep CMS and Hygraph credentials current
- Verify Square configuration after payment-related changes
- Review sitemap entries whenever new public routes are added

## Preventive maintenance focus
- Convert remaining inline-style components to shared Tailwind patterns
- Continue consolidating broad `src/lib` domains into clearer ownership modules
- Expand automated coverage for the highest-risk user and payment flows
