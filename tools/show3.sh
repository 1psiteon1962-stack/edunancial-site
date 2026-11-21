#!/bin/bash
# show3.sh COLOR FROM TO -> compact L3 English incl. disclaimer
S=/home/claude/l5work
for i in $(seq $2 $3); do f=$(printf "%s/src/L3/%s-L3-%03d.md" $S $1 $i); echo "@@ $(basename $f .md) | $(grep -m1 '^title:' $f | cut -d' ' -f2-) | SUM: $(grep -m1 '^summary:' $f | cut -d' ' -f2-)"; awk '/^## Learning Objectives/{p=1} p' $f | grep -v '^$'; done
