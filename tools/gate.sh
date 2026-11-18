#!/bin/bash
# usage: gate.sh PR  -> waits for checks; prints PASS/FAIL
R=1psiteon1962-stack/edunancial-site; PR=$1
for i in $(seq 1 60); do
  SHA=$(gh api repos/$R/pulls/$PR --jq .head.sha)
  NET=$(gh api repos/$R/commits/$SHA/statuses --jq '[.[]|select(.context=="netlify/edunancial/deploy-preview")][0].state')
  RUNS=$(gh api repos/$R/commits/$SHA/check-runs --jq '.check_runs[]|select(.name|test("edunancial-site")|not)|"\(.status):\(.conclusion)"')
  PEND=$(echo "$RUNS" | grep -c -v '^completed')
  BAD=$(echo "$RUNS" | grep '^completed' | grep -c -v -E ':(success|neutral|skipped)$')
  if [ "$BAD" -gt 0 ] || [ "$NET" = failure ] || [ "$NET" = error ]; then echo "FAIL net=$NET"; gh api repos/$R/commits/$SHA/check-runs --jq '.check_runs[]|"\(.name) \(.conclusion)"'; exit 1; fi
  if [ "$PEND" -eq 0 ] && [ "$NET" = success ]; then echo "PASS $SHA"; exit 0; fi
  sleep 30
done; echo TIMEOUT; exit 2
