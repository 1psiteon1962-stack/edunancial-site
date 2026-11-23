import sys,re,glob
S='/home/claude/l5work'
C,loc=sys.argv[1:3]
HT=["Objektif aprantisaj","Kontni prensipal","Egzanp pratik","Egzamen pratik","Kle repons yo","Repons ak eksplikasyon","Pwen kle yo"]
TT={'[VERIFIED FACT]':'[FÈ VERIFYE]','[ILLUSTRATIVE EXAMPLE]':'[EGZANP ILISTRATIF]','[ASSUMPTION]':'[SIPOZISYON]','[REGION-SPECIFIC RULE]':'[RÈG ESPESIFIK POU REJYON AN]','[ESTIMATE]':'[ESTIMASYON]'} if loc=='ht' else {}
HM={'ht':HT,'de':["Lernziele","Hauptinhalt","Durchgerechnetes Beispiel","Übungsquiz","Lösungsschlüssel","Antworten und Erklärungen","Das Wichtigste in Kürze","Hinweis zum Bildungszweck"]}[loc]
EN=["Learning Objectives","Core Content","Worked Example","Practice Quiz","Answer Key","Answers and Explanations","Key Takeaways","Educational Disclaimer"]
def secs(t):
    p=re.split(r'^## (.+)$',t,flags=re.M); return {p[i].strip():p[i+1] for i in range(1,len(p),2)},[p[i].strip() for i in range(1,len(p),2)]
EW=set('the and of to is are you your that this with for what how why it be not can will'.split())
if loc=='ht': EW-= {'to','a'}  # 'to' (rate) and 'a' (article) are Kreyol words
n=bad=0
for b in sorted(glob.glob(f'{S}/work/{C}-L3-{loc}/*.txt')):
    for ch in re.split(r'^=====\s*',open(b,encoding='utf-8').read(),flags=re.M)[1:]:
        lid,rest=ch.split('\n',1); lid=lid.strip(); n+=1; p=[]
        e=open(f'{S}/src/L3/{lid}.md',encoding='utf-8').read()
        if not re.search(r'^TITLE: .+',rest,re.M) or not re.search(r'^SUMMARY: .+',rest,re.M): p.append('meta')
        if not re.search(rf'^# {lid}: ',rest,re.M): p.append('H1')
        ds,dh=secs(rest); es,eh=secs(e)
        if loc=='ht':
            if 'Educational Disclaimer' in rest or not re.search(r'\n---\n\n\*[^\n]+\*\s*$',rest): p.append('disc')
        if dh!=HM: p.append(f'H2 {dh}')
        else:
            for a,b2 in zip(EN,HM):
                x=len(re.findall(r'^(\d+\.|- )',es.get(a,''),re.M)); y=len(re.findall(r'^(\d+\.|- )',ds[b2],re.M))
                if x!=y: p.append(f'{a} {x}/{y}')
        for tag in ['[VERIFIED FACT]','[ILLUSTRATIVE EXAMPLE]','[ASSUMPTION]','[REGION-SPECIFIC RULE]','[ESTIMATE]']:
            if e.count(tag)!=rest.count(TT.get(tag,tag)) and not (tag=='[REGION-SPECIFIC RULE]' and rest.count(TT.get(tag,tag))>e.count(tag)): p.append(f'{tag} {e.count(tag)}/{rest.count(TT.get(tag,tag))}')
        w=re.findall(r"[a-z']+",re.sub(r'\[[A-Z /-]+\]','',rest).lower()); ep=100*sum(x in EW for x in w)/max(1,len(w))
        if ep>3: p.append(f'en%{ep:.1f}')
        ew=len(e.split()); dw=len(rest.split())
        if dw<0.85*ew: p.append(f'short {dw}/{ew}')
        if p: bad+=1; print(lid,p)
print(f'{C}-L3 {loc} n={n} problems={bad}')
