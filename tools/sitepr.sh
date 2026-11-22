#!/bin/bash
# sitepr.sh COLOR LOC "Language name" -> opens site PR, prints number sha
set -e; C=$1; L=$2; NAME=$3; lc=$(echo $C | tr A-Z a-z); ll=$(echo $L | tr A-Z a-z)
S=/home/claude/1psiteon1962-stack/edunancial-site; cd $S
git checkout -q main; git pull -q; git checkout -q -B curriculum-$lc-l5-$ll
rm -rf /tmp/zz; mkdir /tmp/zz; unzip -q /home/claude/l5work/out/$C-L5-001-050-$L.zip -d /tmp/zz
cp /tmp/zz/*.md content/curriculum/$C/L5/
[ "$(git status --porcelain | grep -v '^??' | wc -l)" = 0 ] || { echo "MODIFIED EXISTING FILES - abort"; exit 1; }
[ "$(git status --porcelain | wc -l)" = 50 ] || { echo "not 50 new files"; exit 1; }
npm run -s curriculum:validate 2>&1 | tail -1; git checkout -- curriculum/reports 2>/dev/null || true
git add content/curriculum/$C/L5/*.$L.md
git commit -qm "Add $C L5 $NAME ($L) lessons 001-050

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PTT4B7Mw6GyinvSmKXxKZX"
git push -q -f origin curriculum-$lc-l5-$ll 2>&1 | grep -v remote: || true
gh api repos/1psiteon1962-stack/edunancial-site/pulls -f title="Add $C L5 $NAME ($L) lessons 001-050" -f head=curriculum-$lc-l5-$ll -f base=main -f body="Adds 50 $C Level 5 lessons in $NAME ($L). New files only; no other locale touched. Validation passed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PTT4B7Mw6GyinvSmKXxKZX" --jq '"\(.number) \(.head.sha)"'
git checkout -q main
