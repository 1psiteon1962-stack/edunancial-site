#!/bin/bash
# step2.sh "<nums>" "<nums to print next>" : build drafts for de/it/nl/fr-CA, derive fr-FR, validate, commit, push
cd /home/claude/edunancial-site
for n in $1; do
  for loc in de it nl fr-CA; do f=/home/claude/drafts/RED-L2-$n.$loc.txt; [ -f "$f" ] && python3 /home/claude/tools/mk.py . $loc "$f" >/dev/null; done
done
python3 /home/claude/tools/fr_fr.py . 2 RED >/dev/null
node scripts/curriculum/validate.mjs 2>&1 | tail -1 | grep -q 'passed validation' || { echo VALIDATE FAIL; node scripts/curriculum/validate.mjs 2>&1 | grep -i -E 'error|fail' | head; exit 1; }
git add content/curriculum/RED/L2 && git commit -q -m "RED-L2 $1: de, it, nl, fr-CA, fr-FR

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PTT4B56631sU2Ko5JWA19n" && git push -q -u origin translate/l2-red-de-it-nl-fr 2>&1 | grep -v '^remote:'; echo "SAVED $1"
for n in $2; do sed -n '/^## RED/,$p' content/curriculum/RED/L2/RED-L2-$n.md | sed '1d'; done
