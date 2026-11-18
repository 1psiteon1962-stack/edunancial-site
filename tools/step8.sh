#!/bin/bash
# step8.sh TRACK LEVEL "<nums>" "<locale label>" : build drafts, check answer keys vs English, validate, commit, push
T=$1; L=$2; LAB=${4:-"de, it, nl, pt-BR"}; cd /home/claude/edunancial-site
for n in $3; do python3 /home/claude/tools/mk3.py . /home/claude/drafts3/$T-L$L-$n.txt >/dev/null || { echo "MK FAIL $n"; exit 1; }; done
python3 - "$T" "$L" $3 <<'PY' || exit 1
import sys,re,glob
T,L=sys.argv[1],sys.argv[2]; bad=0
def keys(p):
    s=open(p,encoding='utf-8').read()
    sec=re.split(r'(?m)^## ',s)
    for x in sec:
        ls=re.findall(r'(?m)^\s*\*{0,2}[A-Z]{1,2}(\d+)\s*[:.]\*{0,2}\s*\**([A-D])\b',x)
        if len(ls)>=5 and all(len(a)<3 for a,_ in ls): return [b for _,b in ls]
    return None
for n in sys.argv[3:]:
    base=f'content/curriculum/{T}/L{L}/{T}-L{L}-{n}'
    ek=keys(base+'.md')
    for p in glob.glob(base+'.*.md'):
        k=keys(p)
        if k is not None and ek is not None and k!=ek: print('KEY MISMATCH',p,k,ek); bad=1
sys.exit(bad)
PY
node scripts/curriculum/validate.mjs 2>&1 | tail -1 | grep -q 'passed validation' || { echo VALIDATE FAIL; node scripts/curriculum/validate.mjs 2>&1 | grep -i -E 'error|fail' | head; exit 1; }
git checkout -q -- curriculum/reports/ 2>/dev/null
git add content/curriculum/$T/L$L && git commit -q -m "$T-L$L $3: $LAB

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PTT4B56631sU2Ko5JWA19n" && git push -q -u origin HEAD 2>&1 | grep -v '^remote:'; echo "SAVED $3"
