#!/bin/bash
# step.sh "<nums to build>" "<nums to print next>"
cd /home/claude/edunancial-site
for n in $1; do python3 /home/claude/tools/mk.py . pt-BR /home/claude/drafts/RED-L2-$n.pt-BR.txt >/dev/null; python3 /home/claude/tools/pt_pt.py content/curriculum/RED/L2 "RED-L2-$n" >/dev/null; done
node scripts/curriculum/validate.mjs 2>&1 | tail -1 | grep -q 'passed validation' || { echo VALIDATE FAIL; node scripts/curriculum/validate.mjs 2>&1 | grep -i -E 'error|fail' | head; exit 1; }
git add content/curriculum/RED/L2 && git commit -q -m "RED-L2 $1: pt-BR + pt-PT

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PTT4B56631sU2Ko5JWA19n" && git push -q 2>&1 | grep -v '^remote: *$'; echo "SAVED $1"
for n in $2; do sed -n '/^## RED/,$p' content/curriculum/RED/L2/RED-L2-$n.md | sed '1d'; done
