#!/bin/bash
# show2.sh COLOR LEVEL FROM TO -> site English (title, summary, body) for L2/L3/L4
R=/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum
for i in $(seq $3 $4); do f=$(printf "$R/%s/L%s/%s-L%s-%03d.md" $1 $2 $1 $2 $i); echo "@@ $(basename $f .md) | $(grep -m1 '^title:' $f | cut -d' ' -f2-) | SUM: $(grep -m1 '^summary:' $f | cut -d' ' -f2-)"; awk 'f>=2;/^---$/{f++}' $f | grep -v '^$'; done
