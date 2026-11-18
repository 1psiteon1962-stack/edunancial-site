#!/bin/bash
# step3.sh TRACK "<nums>" "<next nums>" : build de/it/nl/fr-CA/pt-BR drafts, derive fr-FR + pt-PT, validate, commit, push
T=$1; cd /home/claude/edunancial-site
for n in $2; do
  for loc in de it nl fr-CA pt-BR; do f=/home/claude/drafts/$T-L2-$n.$loc.txt; [ -f "$f" ] && python3 /home/claude/tools/mk.py . $loc "$f" >/dev/null; done
  [ -f content/curriculum/$T/L2/$T-L2-$n.pt-BR.md ] && python3 /home/claude/tools/pt_pt.py content/curriculum/$T/L2 "$T-L2-$n" --force >/dev/null
done
python3 /home/claude/tools/fr_fr.py . 2 $T >/dev/null
node scripts/curriculum/validate.mjs 2>&1 | tail -1 | grep -q 'passed validation' || { echo VALIDATE FAIL; node scripts/curriculum/validate.mjs 2>&1 | grep -i -E 'error|fail' | head; exit 1; }
git checkout -q -- curriculum/reports/ 2>/dev/null
git add content/curriculum/$T/L2 && git commit -q -m "$T-L2 $2: de, it, nl, fr-CA, fr-FR, pt-BR, pt-PT

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PTT4B56631sU2Ko5JWA19n" && git push -q -u origin HEAD 2>&1 | grep -v '^remote:'; echo "SAVED $2"
for n in $3; do sed -n "/^## $T/,\$p" content/curriculum/$T/L2/$T-L2-$n.md | sed '1d'; done
