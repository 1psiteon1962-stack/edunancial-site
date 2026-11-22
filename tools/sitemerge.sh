#!/bin/bash
# sitemerge.sh PR SHA -> waits for checks, merges squash if none failed
P=$1; S=$2; A=repos/1psiteon1962-stack/edunancial-site
for i in $(seq 1 60); do
  t=$(gh api $A/commits/$S/check-runs --jq '.total_count'); r=$(gh api $A/commits/$S/check-runs --jq '[.check_runs[]|select(.status!="completed")]|length')
  [ "$t" -gt 0 ] && [ "$r" = 0 ] && break; sleep 30; done
bad=$(gh api $A/commits/$S/check-runs --jq '[.check_runs[]|select(.conclusion!="success" and .conclusion!="neutral" and .conclusion!="skipped")]|length')
gh api $A/commits/$S/check-runs --jq '[.check_runs[].conclusion]|group_by(.)|map({(.[0]):length})|add' 
[ "$bad" = 0 ] || { echo "PR $P has failing checks"; exit 1; }
gh api -X PUT $A/pulls/$P/merge -f merge_method=squash -f sha=$S --jq '"merged \(.merged) \(.sha)"'
