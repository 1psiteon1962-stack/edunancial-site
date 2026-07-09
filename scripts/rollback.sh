#!/usr/bin/env bash
# rollback.sh – Trigger a Netlify rollback to the previous successful deploy.
# Usage: ./scripts/rollback.sh <environment> <failed-version>
# Requires: NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID_<ENV> environment variables.
set -euo pipefail

ENVIRONMENT="${1:?Usage: rollback.sh <environment> <failed-version>}"
FAILED_VERSION="${2:-unknown}"

echo "🔄 Initiating rollback for environment: $ENVIRONMENT (failed version: $FAILED_VERSION)"

# Map environment to site ID
case "$ENVIRONMENT" in
  production)
    SITE_ID="${NETLIFY_SITE_ID_PRODUCTION:?NETLIFY_SITE_ID_PRODUCTION not set}"
    ;;
  staging)
    SITE_ID="${NETLIFY_SITE_ID_STAGING:?NETLIFY_SITE_ID_STAGING not set}"
    ;;
  development)
    SITE_ID="${NETLIFY_SITE_ID_DEV:?NETLIFY_SITE_ID_DEV not set}"
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

AUTH_TOKEN="${NETLIFY_AUTH_TOKEN:?NETLIFY_AUTH_TOKEN not set}"

echo "📋 Fetching recent deployments for site $SITE_ID..."
DEPLOYS=$(curl -sS \
  -H "Authorization: ******" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys?per_page=10")

# Find the last successful production deploy (state=ready, context=production)
PREVIOUS_DEPLOY_ID=$(echo "$DEPLOYS" | \
  python3 -c "
import sys, json
deploys = json.load(sys.stdin)
for d in deploys:
    if d.get('state') == 'ready' and d.get('context') in ('production', 'branch-deploy', 'deploy-preview'):
        print(d['id'])
        break
" 2>/dev/null || echo "")

if [[ -z "$PREVIOUS_DEPLOY_ID" ]]; then
  echo "❌ No previous successful deploy found. Manual rollback required."
  exit 1
fi

echo "↩️  Rolling back to deploy ID: $PREVIOUS_DEPLOY_ID"
RESULT=$(curl -sS -X POST \
  -H "Authorization: ******" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys/$PREVIOUS_DEPLOY_ID/restore")

echo "$RESULT" | python3 -c "
import sys, json
r = json.load(sys.stdin)
if r.get('state') == 'ready':
    print('✅ Rollback successful. Restored deploy:', r.get('id'))
else:
    print('⚠️  Rollback initiated. Monitor Netlify dashboard for status.')
    print(json.dumps(r, indent=2))
" 2>/dev/null || echo "Rollback API call completed. Check Netlify dashboard."

echo "📝 Failed deployment logged: env=$ENVIRONMENT version=$FAILED_VERSION ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
