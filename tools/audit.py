import os,re,sys,glob,collections,json
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
COL=['RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK']
LOCS=['en-GB','es-419','es-Caribbean','es-ES','fr-CA','fr-FR','pt-BR','pt-PT','de','it','nl','ht']
BOIL=re.compile(r'Concept 1 —|Concepto 1 —|Concept 1 :|Konzept 1 —|Concetto 1 —|Conceito 1 —|Concept 1 –|Let op: dit|This lesson builds on the foundations established in previous|Esta lección se basa en los fundamentos',re.I)
PH=re.compile(r'^summary: "(Lección|Lesson|Leçon|Lektion|Lezione|Lição|Les) [A-Z]+-L\d-\d{3}',re.M)
def body(t):
    p=t.split('\n---\n',1); b=p[1] if len(p)>1 else t
    return b
def sig(t):
    b=body(t)
    return dict(n2=len(re.findall(r'^## ',b,re.M)),n3=len(re.findall(r'^### ',b,re.M)),chars=len(b.strip()),
        boil=bool(BOIL.search(b)),ph=bool(PH.search(t)),h1=bool(re.search(r'^# ',b,re.M)),
        quiz=len(re.findall(r'^\s*[A-D][\.\)] ',b,re.M)))
EN_WORDS=set('the and of to is that for with you your this are be it as on not or can an by'.split())
def enpct(b):
    w=re.findall(r"[A-Za-z']+",b.lower()); 
    return 100*sum(x in EN_WORDS for x in w)/max(1,len(w))
out={}
for c in COL:
  for L in range(1,6):
    d=f'{R}/{c}/L{L}'
    en={}
    for n in range(1,51):
        f=f'{d}/{c}-L{L}-{n:03d}.md'
        if os.path.exists(f): en[n]=sig(open(f,encoding='utf-8').read())
    cell={'en':dict(n=len(en),boil=sum(v['boil'] for v in en.values()),thin=sum(v['chars']<1200 for v in en.values()),noh1=sum(not v['h1'] for v in en.values()))}
    for loc in LOCS:
        fs=glob.glob(f'{d}/{c}-L{L}-[0-9][0-9][0-9].{loc}.md')
        if not fs: cell[loc]=None; continue
        st=collections.Counter()
        for f in fs:
            n=int(re.search(r'-(\d{3})\.',f).group(1)); t=open(f,encoding='utf-8').read(); s=sig(t)
            e=en.get(n)
            bad=[]
            if s['boil']: bad.append('boil')
            if s['ph']: bad.append('ph')
            if s['chars']<1200: bad.append('thin')
            if e and not e['boil']:
                if abs(s['n2']-e['n2'])>1 or abs(s['n3']-e['n3'])>2 or s['quiz']<e['quiz']-2: bad.append('struct')
                if e['chars'] and s['chars']/e['chars']<0.9: bad.append('short')
            if not loc.startswith('en') and enpct(body(t))>12: bad.append('english')
            for b in bad: st[b]+=1
            if not bad: st['ok']+=1
        st['n']=len(fs); cell[loc]=dict(st)
    out[f'{c}-L{L}']=cell
json.dump(out,open(sys.argv[1],'w'),indent=0)
