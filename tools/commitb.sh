#!/bin/bash
# commitb.sh COLOR LOC NN  -> check, count, commit, update PROGRESS "C LOC IN PROGRESS (...)"
C=$1; L=$2; B=$3; cd /home/claude/l5work
PARTIAL=1 tools/check45.sh $C L5 $L 2>&1 | tail -1 | tee /tmp/c.txt; python3 tools/cnt.py $C $L $B
grep -q 'problems: 0' /tmp/c.txt || { echo CHECK FAILED; exit 1; }
python3 - "$C" "$L" "$B" <<'P'
import re,sys
C,L,B=sys.argv[1:4]; p='PROGRESS.md'; s=open(p).read()
s=re.sub(re.escape(f'{C} {L} IN PROGRESS (')+r'[^)]*\)',f'{C} {L} IN PROGRESS (b01-b{B} done; next b{int(B)+1:02d})',s,1)
open(p,'w').write(s)
P
git add -A >/dev/null; git commit -qm "L5 WIP: $C $L b$B" && git push -q origin curriculum-l5-wip 2>&1 | grep -v remote:; git log --oneline -1
