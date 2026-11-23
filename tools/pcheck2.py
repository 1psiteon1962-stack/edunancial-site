# pcheck2.py COLOR LOCALE [LEVEL=2] -> structure check of work/<C>-L<L>-<loc>/*.txt vs site English
import sys,re,glob
C,loc=sys.argv[1:3]; L=sys.argv[3] if len(sys.argv)>3 else '2'
S='/home/claude/l5work'
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
mp={'Vrè':'T','Fo':'F','True':'T','False':'F'}
def key(t):
    m=re.search(r'^\*\*5\.[^\n]*\n(.*?)\n\*\*6\.',t,re.S|re.M) or re.search(r'^## (?:Answer Key|Kle repons yo)\s*\n(.*?)\n## ',t,re.S|re.M)
    if not m: return None
    return [mp.get(x,x) for x in re.findall(r'\b(?:[a-d](?=[\s).,]|$)|True|False|Vrè|Fo)\b',m.group(1))]
def shape(t):
    return dict(h1=len(re.findall(r'^# ',t,re.M)),h2=len(re.findall(r'^## ',t,re.M)),h3=len(re.findall(r'^### ',t,re.M)),
        sec=len(re.findall(r'^\*\*[1-7]\. ',t,re.M)),opt=len(re.findall(r'^\s*[a-d]\) ',t,re.M)),
        bul=len(re.findall(r'^\s*- ',t,re.M)),num=len(re.findall(r'^\s*\d+\. ',t,re.M)),tbl=len(re.findall(r'^\|',t,re.M)))
EW=set('the and of is are you your that this with for what how why it be not can will'.split())
ch={}
for b in sorted(glob.glob(f'{S}/work/{C}-L{L}-{loc}/*.txt')):
    for c in re.split(r'^=====\s*',open(b,encoding='utf-8').read(),flags=re.M)[1:]:
        lid,rest=c.split('\n',1); ch[lid.strip()]=rest
bad=0
for lid in sorted(ch):
    rest=ch[lid]; p=[]
    if not re.search(r'^TITLE: .+',rest,re.M) or not re.search(r'^SUMMARY: .+',rest,re.M): p.append('meta')
    m=re.search(r'^#{1,2} '+re.escape(lid)+r'\b',rest,re.M) or re.search(r'^#{1,3} ',rest,re.M)
    b=rest[m.start():]
    e=open(f'{R}/{C}/L{L}/{lid}.md',encoding='utf-8').read().split('---',2)[2]
    sa,se=shape(b),shape(e)
    for k in sa:
        if sa[k]!=se[k]: p.append(f'{k} {sa[k]}/{se[k]}')
    if key(b)!=key(e): p.append(f'key {key(b)}/{key(e)}')
    w=re.findall(r"[a-z]+",b.lower()); en=sum(1 for x in w if x in EW)/max(1,len(w))
    if en>0.03: p.append(f'en {en:.2f}')
    if len(b)<0.75*len(e): p.append(f'short {len(b)}/{len(e)}')
    if p: print(lid,p); bad+=1
print(f'{C}-L{L} {loc} n={len(ch)} problems={bad}')
