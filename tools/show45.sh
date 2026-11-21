#!/bin/bash
# show45.sh COLOR LEVEL FROM TO -> compact English for L4/L5
R=/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum
for i in $(seq $3 $4); do f=$(printf "%s/%s/%s/%s-%s-%03d.md" $R $1 $2 $1 $2 $i); echo "@@ $(basename $f .md) | KW: $(grep -m1 '^SEO Keywords:' $f | cut -d' ' -f3-)"; awk '/^# /{p=1} p' $f | grep -v '^$'; done
