# Administrator Guide

## Admin access
- Configure `ADMIN_METRICS_TOKEN` in the deployment environment.
- Access protected admin pages once using the target admin URL with `?access=<token>`.
- Internal automation may send `x-admin-token: <token>` instead.

## Administrative responsibilities
- Review KPI dashboards and content updates
- Maintain payment configuration and legal/trust content
- Coordinate CMS, analytics, and launch communication updates

## Security expectations
- Rotate the admin token when team access changes
- Do not share admin links in public channels
- Keep production environment variables in the hosting provider only

## Incident response
- If admin access fails, confirm the token value in the environment and clear the `edunancial_admin_access` cookie before retrying
- If `/api/health` reports an integration as unconfigured, verify the relevant environment variables
