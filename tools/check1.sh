#!/bin/bash
# check1.sh COLOR LOCALE KEEP
S=/home/claude/l5work
python3 -I $S/tools/build1.py $1 $2 $3 || exit 1
Z=$S/out/$1-L1-001-050-$2.zip; [ -f $Z ] || exit 1
D=$(mktemp -d); cd $D; unzip -q $Z
python3 -I $S/tools/qc.py *.md
python3 -I - $1 $2 <<'PY'
import glob,re,sys,yaml
C,loc=sys.argv[1:3]; R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
mp={'Vrai':'T','Faux':'F','True':'T','False':'F','Verdadero':'T','Falso':'F','Wahr':'T','Falsch':'F','Vero':'T','Waar':'T','Onwaar':'F','Verdadeiro':'T','Vrè':'T','Fo':'F'}
def parts(t):
    fm,b=t.split('---',2)[1:]
    try: d=yaml.safe_load(fm)
    except Exception: d={k:v.strip().strip('"') for k,v in re.findall(r'^(\w+):\s*(.*)$',fm,re.M)}; d['_bad']=1
    return d,b
def sec(b,i):
    s=re.split(r'^## ',b,flags=re.M); return s[i] if i<len(s) else ''
def keys(x): return [mp.get(k,k) for k in re.findall(r'\b([A-D](?! [a-z])|True|False|Vrai|Faux|Verdadero|Falso|Wahr|Falsch|Vero|Waar|Onwaar|Verdadeiro|Vrè|Fo)\b',x)]
bad=0
for f in sorted(glob.glob('*.md')):
    lid=f.split('.')[0]; d,b=parts(open(f).read()); de,e=parts(open(f'{R}/{C}/L1/{lid}.md').read())
    p=[]
    if d.get('_bad') or d.get('locale')!=loc or not d.get('title') or not d.get('summary'): p.append('yaml')
    for lv in ('## ','### '):
        a=len(re.findall('^'+lv,b,re.M)); c=len(re.findall('^'+lv,e,re.M))
        if a!=c: p.append(f'{lv.strip()} {a}/{c}')
    if len(re.findall(r'^# ',b,re.M))!=len(re.findall(r'^# ',e,re.M)): p.append('H1')
    qa=len(re.findall(r'^\s*([A-D][.)]) ',sec(b,4),re.M)); qe=len(re.findall(r'^\s*([A-D][.)]) ',sec(e,4),re.M))
    if qa!=qe: p.append(f'opts {qa}/{qe}')
    if keys(sec(b,5))!=keys(sec(e,5)): p.append(f'key {keys(sec(b,5))}/{keys(sec(e,5))}')
    ta=len(re.findall(r'^- ',sec(b,7),re.M)); te=len(re.findall(r'^- ',sec(e,7),re.M))
    if ta!=te: p.append(f'takeaways {ta}/{te}')
    if p: print(lid,p); bad+=1
print('L1 structure problems:',bad)
PY
rm -rf $D
