#!/bin/bash
# check.sh COLOR LEVEL LOCALE
S=/home/claude/l5work
python3 -I $S/tools/build.py $1 $2 $3 || exit 1
Z=$S/out/$1-$2-001-050-$3.zip; [ -f $Z ] || exit 1
D=$(mktemp -d); cd $D; unzip -q $Z
python3 -I $S/tools/qc.py *.md
for f in *.md; do n=$(grep -c '^\*\*[1-7]\. ' $f); [ $n -ne 7 ] && echo "SECTIONS $f=$n"; done
python3 -I - "$3" <<'PY'
import glob,yaml,sys
for f in sorted(glob.glob('*.md')):
    try: d=yaml.safe_load(open(f).read().split('---')[1]); assert d['locale']==sys.argv[1] and d['title'] and d['summary']
    except Exception as e: print('YAML',f,e)
PY
# answer key compare with English source if available
python3 -I - $1 $2 $S <<'PY'
import sys,re,glob,os
C,L,S=sys.argv[1:4]
def key(t):
    m=re.search(r'\*\*5\.[^\n]*\n(.*?)\n\*\*6\.',t,re.S); 
    if not m: return None
    return re.findall(r'\b[a-d]\b|Vrai|Faux|True|False|Verdadero|Falso',m.group(1))
mp={'Vrai':'T','Faux':'F','True':'T','False':'F','Verdadero':'T','Falso':'F'}
bad=0
for f in sorted(glob.glob('*.md')):
    lid=f.split('.')[0]; src=f'{S}/src/{L}/{lid}.md'
    if not os.path.exists(src): continue
    a=[mp.get(x,x) for x in key(open(f).read()) or []]; b=[mp.get(x,x) for x in key(open(src).read()) or []]
    if a!=b: print('KEY MISMATCH',lid,a,b); bad+=1
print('answer keys checked, mismatches:',bad)
PY
rm -rf $D
