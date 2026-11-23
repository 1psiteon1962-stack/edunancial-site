#!/bin/bash
# check3.sh COLOR LOCALE  (Level 3 format)
S=/home/claude/l5work
python3 -I $S/tools/build.py $1 L3 $2 || exit 1
Z=$S/out/$1-L3-001-050-$2.zip; [ -f $Z ] || exit 1
D=$(mktemp -d); cd $D; unzip -q $Z
python3 -I $S/tools/qc.py *.md
python3 -I - "$2" $S <<'PY'
import glob,yaml,sys,re
loc,S=sys.argv[1:3]
def sec(t,h):
    m=re.search(r'^## '+h+r'\s*\n(.*?)(?=^## |\Z)',t,re.S|re.M); return m.group(1) if m else ''
bad=0
for f in sorted(glob.glob('*.md')):
    t=open(f).read(); lid=f.split('.')[0]
    try: d=yaml.safe_load(t.split('---')[1]); assert d['locale']==loc and d['title'] and d['summary']
    except Exception as e: print('YAML',f,e); bad+=1
    h=re.findall(r'^## (.+)$',t,re.M)
    if len(h)!=(7 if loc=='ht' else 8): print('H2',lid,len(h)); bad+=1
    e=open(f'{S}/src/L3/{lid}.md').read()
    HM={'ht':[("Egzamen pratik","Practice Quiz"),("Kle repons yo","Answer Key"),("Repons ak eksplikasyon","Answers and Explanations"),("Objektif aprantisaj","Learning Objectives"),("Pwen kle yo","Key Takeaways")],'de':[("Übungsquiz","Practice Quiz"),("Lösungsschlüssel","Answer Key"),("Antworten und Erklärungen","Answers and Explanations"),("Lernziele","Learning Objectives"),("Das Wichtigste in Kürze","Key Takeaways")]}.get(loc,[("Quiz de pratique","Practice Quiz"),("Corrigé","Answer Key"),("Réponses et explications","Answers and Explanations"),("Objectifs d'apprentissage","Learning Objectives"),("Points clés à retenir","Key Takeaways")])
    for fh,eh in HM:
        a=len(re.findall(r'^(\d+\.|- )',sec(t,fh),re.M)); b=len(re.findall(r'^(\d+\.|- )',sec(e,eh),re.M))
        if a!=b: print('COUNT',lid,fh,a,b); bad+=1
    TT={'[VERIFIED FACT]':'[FÈ VERIFYE]','[ILLUSTRATIVE EXAMPLE]':'[EGZANP ILISTRATIF]','[ASSUMPTION]':'[SIPOZISYON]','[ESTIMATE]':'[ESTIMASYON]'} if loc=='ht' else {}
    for tag in ['[VERIFIED FACT]','[ILLUSTRATIVE EXAMPLE]','[ASSUMPTION]']+(['[ESTIMATE]'] if loc=='ht' else []):
        if e.count(tag)!=t.count(TT.get(tag,tag)): print('TAG',lid,tag,e.count(tag),t.count(TT.get(tag,tag))); bad+=1
    if loc=='ht' and ('Educational Disclaimer' in t or not re.search(r'\n---\n\n\*[^\n]+\*\s*$',t)): print('DISC',lid); bad+=1
print('L3 structure problems:',bad)
PY
rm -rf $D
