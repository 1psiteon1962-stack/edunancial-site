#!/usr/bin/env bash
# deploy-verify.sh – Run post-deployment verification checks.
# Usage: ./scripts/deploy-verify.sh <url> <environment>
set -euo pipefail

URL="${1:?Usage: deploy-verify.sh <url> <environment>}"
ENVIRONMENT="${2:-unknown}"

echo "🧪 Post-deploy verification for $ENVIRONMENT at $URL"
PASS=0
FAIL=0

check() {
  local name="$1"
  local cmd="$2"
  if eval "$cmd" > /tmp/check-output 2>&1; then
    echo "  ✅ $name"
    PASS=$((PASS+1))
  else
    echo "  ❌ $name"
    cat /tmp/check-output
    FAIL=$((FAIL+1))
  fi
}

# 1. HTTP 200 on root
check "Root page responds 200" \
  "curl -sS -o /dev/null -w '%{http_code}' --max-time 15 '$URL' | grep -q '^2'"

# 2. HTML contains expected marker
check "HTML contains site title" \
  "curl -sS --max-time 15 '$URL' | grep -qi 'edunancial'"

# 3. Security headers present
check "X-Frame-Options header present" \
  "curl -sS -I --max-time 15 '$URL' | grep -qi 'x-frame-options'"

# 4. HTTPS redirect (only for non-localhost)
if [[ "$URL" != http://localhost* ]]; then
  check "HTTPS enforced" \
    "curl -sS -o /dev/null -w '%{http_code}' --max-time 15 '${URL/https/http}' | grep -qE '^3'"
fi

echo ""
echo "Verification complete: $PASS passed, $FAIL failed."

if [[ $FAIL -gt 0 ]]; then
  echo "::error::$FAIL post-deploy verification check(s) failed for $ENVIRONMENT"
  exit 1
fi
