import re,sys,glob
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
C,loc=sys.argv[1],sys.argv[2]; rng=sys.argv[3] if len(sys.argv)>3 else '001-050'
a,b=map(int,rng.split('-'))
TF={'True':'T','False':'F','Verdadero':'T','Falso':'F','Vrai':'T','Faux':'F','Vre':'T','Vrè':'T','Fo':'F','Fòs':'F','Verdadeiro':'T','Wahr':'T','Falsch':'F','Vero':'T','Juist':'T','Onjuist':'F','Waar':'T','Onwaar':'F'}
def keys(t):
    return {m.group(1):TF.get(m.group(2),m.group(2)) for m in re.finditer(r'(?m)^(\d+)\. \*\*[^*:]+:\*\* ([A-D]|[A-Za-zèò]+)[.;,]',t)}
def money(t): return sorted(re.sub(r'[,.]','',x) for x in re.findall(r'\$\s?\d[\d,.]*\d|\$\d',t))
def heads(t): return [len(h) for h in re.findall(r'(?m)^(#+) ',t)]
def labels(t): return len(re.findall(r'\[[A-ZÁÉÍÓÚÑÈÒÀ ,-]+\]',t))
bad=0
for n in range(a,b+1):
    lid=f'{C}-L1-{n:03d}'; e=open(f'{R}/{C}/L1/{lid}.md',encoding='utf-8').read().split('---',2)[2]
    try: t=open(f'{R}/{C}/L1/{lid}.{loc}.md',encoding='utf-8').read().split('---',2)[2]
    except FileNotFoundError: print(lid,'MISSING'); bad+=1; continue
    ek,tk=keys(e),keys(t); probs=[]
    if ek!=tk: probs.append(f'key {ek} vs {tk}')
    if money(e)!=money(t): probs.append(f'money {money(e)} vs {money(t)}')
    if heads(e)!=heads(t): probs.append('headings')
    if labels(e)!=labels(t): probs.append(f'labels {labels(e)} vs {labels(t)}')
    if probs: bad+=1; print(lid,'; '.join(probs))
print(C,loc,rng,'bad',bad)
