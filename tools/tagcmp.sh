#!/bin/bash
# usage: tagcmp.sh COLOR LEVEL batchfile
C=$1; L=$2; F=$3
for id in $(grep '^===== ' $F | awk '{print $2}'); do
 n=$((10#${id##*-}))
 en=$(tools/show45.sh $C $L $n $n | grep -o 'VERIFIED FACT\|REGION-SPECIFIC RULE\|ESTIMATE\|PRINCIPLE:\|OPINION' | sed 's/VERIFIED FACT/V/;s/REGION-SPECIFIC RULE/R/;s/ESTIMATE/E/;s/PRINCIPLE:/P/;s/OPINION/O/' | sort | tr -d '\n')
 de=$(awk -v id="$id" '/^===== /{p=($2==id)} p' $F | grep -o 'GEPRÜFTE TATSACHE\|LÄNDERSPEZIFISCHE REGEL\|SCHÄTZUNG\|GRUNDSATZ:\|MEINUNG' | sed 's/GEPRÜFTE TATSACHE/V/;s/LÄNDERSPEZIFISCHE REGEL/R/;s/SCHÄTZUNG/E/;s/GRUNDSATZ:/P/;s/MEINUNG/O/' | sort | tr -d '\n')
 ek=$(tools/show45.sh $C $L $n $n | grep -A6 '^## Answer Key' | grep '^Q' | tr -d ' \n')
 dk=$(awk -v id="$id" '/^===== /{p=($2==id)} p' $F | grep -A6 '^## Lösungsschlüssel' | grep '^Q' | tr -d ' \n')
 s=OK; [ "$en" != "$de" ] && s="TAGS en=$en de=$de"; [ "$ek" != "$dk" ] && s="$s KEY en=$ek de=$dk"; echo "$id $s"
done
