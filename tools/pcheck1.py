# pcheck1.py COLOR LOCALE LEVEL -> structure check of batches in work/ vs English
import sys,re,glob
C,loc,L=sys.argv[1],sys.argv[2],(sys.argv[3] if len(sys.argv)>3 else '1')
S='/home/claude/l5work'; import os; W=os.environ.get('W','')
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
mp={'Vrai':'T','Faux':'F','True':'T','False':'F','Verdadero':'T','Falso':'F','Wahr':'T','Richtig':'T','Juist':'T','Onjuist':'F','Falsch':'F','Vero':'T','Falso':'F','Waar':'T','Onwaar':'F','Vrè':'T','Fo':'F','Verdadeiro':'T'}
ch={}
for b in sorted(glob.glob(f'{S}/work/{W}{C}-L{L}-{loc}/*.txt')):
    for c in re.split(r'^=====\s*',open(b,encoding='utf-8').read(),flags=re.M)[1:]:
        lid,rest=c.split('\n',1); ch[lid.strip()]=rest
def sec(b,i):
    s=re.split(r'^## ',b,flags=re.M); return s[i] if i<len(s) else ''
def keys(x): return [mp.get(k,k) for k in re.findall(r"\b([A-D](?! [a-z])|True|False|Vrai|Faux|Verdadero|Falso|Wahr|Richtig|Juist|Onjuist|Falsch|Vero|Waar|Onwaar|Verdadeiro|Vrè|Fo)\b",x)]
bad=0
for lid in sorted(ch):
    b=ch[lid]; b=b[re.search(r'^#{1,3} ',b,re.M).start():]
    e=open(f'{R}/{C}/L{L}/{lid}.md').read().split('---',2)[2]
    p=[]
    for lv in ('## ','### '):
        a=len(re.findall('^'+lv,b,re.M)); c=len(re.findall('^'+lv,e,re.M))
        if a!=c: p.append(f'{lv.strip()} {a}/{c}')
    if len(re.findall(r'^# ',b,re.M))!=len(re.findall(r'^# ',e,re.M)): p.append('H1')
    qa=len(re.findall(r'^\s*([A-D][.)]) ',sec(b,4),re.M)); qe=len(re.findall(r'^\s*([A-D][.)]) ',sec(e,4),re.M))
    if qa!=qe: p.append(f'opts {qa}/{qe}')
    ke=keys(sec(e,5))
    if (qe>0 or 'T' in ke or 'F' in ke) and keys(sec(b,5))!=ke: p.append(f'key {keys(sec(b,5))}/{keys(sec(e,5))}')
    ta=len(re.findall(r'^- ',sec(b,7),re.M)); te=len(re.findall(r'^- ',sec(e,7),re.M))
    if ta!=te: p.append(f'takeaways {ta}/{te}')
    if not re.search(r'^TITLE:',ch[lid],re.M) or not re.search(r'^SUMMARY:',ch[lid],re.M): p.append('meta')
    if p: print(lid,p); bad+=1
print(f'{C}-L{L} {loc} n={len(ch)} problems={bad}')
