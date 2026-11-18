#!/bin/bash
# step5.sh TRACK LEVEL "<nums>" "<next nums>" : build L3+ drafts (all locales in one file), validate, commit, push, print next English
T=$1; L=$2; cd /home/claude/edunancial-site
for n in $3; do python3 /home/claude/tools/mk3.py . /home/claude/drafts3/$T-L$L-$n.txt >/dev/null || { echo "MK FAIL $n"; exit 1; }; done
node scripts/curriculum/validate.mjs 2>&1 | tail -1 | grep -q 'passed validation' || { echo VALIDATE FAIL; node scripts/curriculum/validate.mjs 2>&1 | grep -i -E 'error|fail' | head; exit 1; }
git checkout -q -- curriculum/reports/ 2>/dev/null
git add content/curriculum/$T/L$L && git commit -q -m "$T-L$L $3: it, nl, pt-BR

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PTT4B56631sU2Ko5JWA19n" && git push -q -u origin HEAD 2>&1 | grep -v '^remote:'; echo "SAVED $3"
for n in $4; do echo "######## $T-L$L-$n"; grep -m2 "^title:\|^summary:" content/curriculum/$T/L$L/$T-L$L-$n.md; sed -n '/^## /,$p' content/curriculum/$T/L$L/$T-L$L-$n.md; done
