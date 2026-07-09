#!/usr/bin/env bash
# health-check.sh – Verify a deployment URL is healthy.
# Usage: ./scripts/health-check.sh <url> [max_retries] [retry_delay_seconds]
set -euo pipefail

URL="${1:?Usage: health-check.sh <url>}"
MAX_RETRIES="${2:-10}"
DELAY="${3:-6}"

echo "🔍 Health check: $URL"
echo "   Retries: $MAX_RETRIES  |  Delay: ${DELAY}s"

for i in $(seq 1 "$MAX_RETRIES"); do
  HTTP_STATUS=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 15 "$URL" 2>/dev/null || echo "000")

  if [[ "$HTTP_STATUS" =~ ^2[0-9][0-9]$ ]]; then
    echo "✅ Health check passed (HTTP $HTTP_STATUS) on attempt $i"
    exit 0
  else
    echo "⏳ Attempt $i/$MAX_RETRIES – HTTP $HTTP_STATUS. Waiting ${DELAY}s..."
    sleep "$DELAY"
  fi
done

echo "❌ Health check failed after $MAX_RETRIES attempts. Last status: $HTTP_STATUS"
exit 1
