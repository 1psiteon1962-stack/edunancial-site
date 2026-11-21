#!/bin/bash
# show.sh SRCDIR COLOR LEVEL FROM TO
for i in $(seq $4 $5); do f=$(printf "%s/%s-%s-%03d.md" $1 $2 $3 $i); awk 'f>=2;/^---$/{f++}' $f; echo; done
