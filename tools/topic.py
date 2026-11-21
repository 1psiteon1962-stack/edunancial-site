import re,os,glob,collections
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
SW={'es':'el la los las que de por para una con es del se como',
'fr':'le la les des que une est pour dans pas qui sur avec du',
'pt':'o a os as que de do da uma para com não é em',
'de':'der die das und ist nicht ein eine mit für auf den zu',
'it':'il la che di un una per non è con del della sono gli',
'nl':'de het een en van is dat niet voor op met te zijn',
'en':'the and of to is that for with you your this are'}
SW={k:set(v.split()) for k,v in SW.items()}
def lang(t):
    w=re.findall(r"[a-zà-ÿ]+",t.lower()); c={k:sum(x in s for x in w) for k,s in SW.items()}
    return max(c,key=c.get)
def h1(t):
    m=re.search(r'^# (.*)$',t.split('\n---\n',1)[-1],re.M); return m.group(1) if m else ''
def body(t): return t.split('\n---\n',1)[-1]
exp={'en-GB':'en','es-419':'es','es-Caribbean':'es','es-ES':'es','fr-CA':'fr','fr-FR':'fr','pt-BR':'pt','pt-PT':'pt','de':'de','it':'it','nl':'nl'}
COL=['RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK']
for c in COL:
  en={}
  for n in range(1,51):
    p=f'{R}/{c}/L1/{c}-L1-{n:03d}.md'; t=open(p,encoding='utf-8').read(); en[n]=(h1(t),len(body(t).split()))
  gb={}
  for n in range(1,51):
    p=f'{R}/{c}/L1/{c}-L1-{n:03d}.en-GB.md'
    if os.path.exists(p): gb[n]=h1(open(p,encoding='utf-8').read())
  oldEN={n for n in gb if re.sub(r'^\d+\.\s*','',gb[n]).strip().lower()!=en[n][0].strip().lower()}
  for loc,lg in exp.items():
    fs=[f'{R}/{c}/L1/{c}-L1-{n:03d}.{loc}.md' for n in range(1,51)]
    if not os.path.exists(fs[0]): continue
    st=collections.Counter()
    for n,f in enumerate(fs,1):
        if not os.path.exists(f): st['missing']+=1; continue
        t=open(f,encoding='utf-8').read(); b=body(t); h=h1(t)
        bad=None
        if lang(b)!=lg: bad='wronglang'
        elif re.match(rf'{c}-L1-\d{{3}}',h) and not re.match(rf'{c}-L1-\d{{3}}',en[n][0]): bad='oldset'
        elif loc!='en-GB' and lang(h)=='en' and len(h.split())>3: bad='title-EN'
        elif len(b.split())<0.6*en[n][1]: bad='thin'
        st[bad or 'ok']+=1
    print(f'{c:6} {loc:12}', dict(st), f'(en-GB titles differing from EN: {len(oldEN)})' if loc=='en-GB' else '')
