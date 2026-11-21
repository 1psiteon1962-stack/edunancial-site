#!/bin/bash
# finish.sh COLOR LEVEL LOC NOTE -> validate index, log, push backup
S=/home/claude/l5work; C=$1; L=$2; loc=$3; cd $S
tools/check45.sh $C $L $loc 2>&1 | tail -1 | grep -q 'problems: 0' || { echo STRUCTURE FAIL; exit 1; }
D=sitecopy/content/curriculum/$C/$L; rm -f $D/*.$loc.md; unzip -oq out/$C-$L-001-050-$loc.zip -d $D
(cd sitecopy && node scripts/curriculum/compile-index.mjs >/dev/null 2>&1)
python3 -c "import json,sys;d=json.load(open('sitecopy/content/generated/curriculum-index/$C/$L/$loc.json'));L=d['lessons'] if isinstance(d,dict) else d;n=sum((x.get('status') or x.get('validation'))=='machine-validated' for x in L);print('validated',n);sys.exit(0 if n==50 else 1)" || { echo INDEX FAIL; exit 1; }
echo "out/$C-$L-001-050-$loc.zip $(date +%F) $4" >> delivered.txt
echo "- $C-$L $loc DONE $(date +%F)" >> PROGRESS.md
git add -A >/dev/null; git commit -qm "L5 WIP: $C-$L $loc done

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PTT4B7Mw6GyinvSmKXxKZX"; git push -q origin curriculum-l5-wip 2>&1 | grep -v '^remote:' | tail -2; echo PUSHED
