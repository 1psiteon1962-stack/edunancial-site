import os,re,json,collections,sys
repo=sys.argv[1]
COLORS=['RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK']
LOC=['en-GB','es-Caribbean','es-ES','fr-CA','fr-FR','pt-BR','pt-PT','de','it','nl','ht']
def norm(l):
    l=l.replace('_','-').lower()
    m={'en-gb':'en-GB','es-caribbean':'es-Caribbean','es-es':'es-ES','fr-ca':'fr-CA','fr-fr':'fr-FR','pt-br':'pt-BR','pt-pt':'pt-PT','de':'de','de-de':'de','it':'it','it-it':'it','nl':'nl','nl-nl':'nl','ht':'ht','ht-ht':'ht','en-us':'en','en':'en'}
    return m.get(l)
def strip_fm(t): return re.sub(r'^---\n.*?\n---\n','',t,flags=re.S)
eng={}   # id -> len
best=collections.defaultdict(dict) # (id) -> loc -> len
# canonical
pat=re.compile(r'^([A-Z]+)-L(\d)-(\d{3})(?:\.([A-Za-z-]+))?\.md$')
for d,_,fs in os.walk(f'{repo}/content/curriculum'):
    for f in fs:
        m=pat.match(f)
        if not m: continue
        lid=f'{m[1]}-L{m[2]}-{m[3]}'; n=len(strip_fm(open(os.path.join(d,f),encoding='utf8').read()))
        if m[4]:
            l=norm(m[4])
            if l and l!='en': best[lid][l]=max(best[lid].get(l,0),n)
        else: eng[lid]=n
# legacy english masters (combined files) count as english presence
for d,_,fs in os.walk(f'{repo}/content/courses'):
    for f in fs:
        p=os.path.join(d,f)
        if f.endswith('.md') and 'full-50' in f:
            t=open(p,encoding='utf8').read()
            for m in re.finditer(r'(?m)^## ([A-Z]+-L\d-\d{3})\s*$',t):
                eng.setdefault(m[1]+'#legacy',1)
        if not f.endswith('.json'): continue
        try: r=json.load(open(p,encoding='utf8'))
        except: continue
        if not isinstance(r,dict): continue
        lid=str(r.get('id') or r.get('lessonId') or r.get('lesson_id') or '').upper()
        if not re.match(r'^[A-Z]+-L\d-\d{3}$',lid): continue
        if r.get('locale') and r.get('body'):
            l=norm(str(r['locale']))
            if l and l!='en': best[lid][l]=max(best[lid].get(l,0),len(str(r['body'])))
        for k,v in (r.get('translations') or {}).items():
            l=norm(k)
            if l and l!='en' and isinstance(v,dict) and v.get('body'):
                best[lid][l]=max(best[lid].get(l,0),len(str(v['body'])))
out={}
for c in COLORS:
    for lv in range(1,6):
        ids=[f'{c}-L{lv}-{i:03d}' for i in range(1,51)]
        en_can=sum(1 for i in ids if i in eng)
        en_leg=sum(1 for i in ids if i not in eng and i+'#legacy' in eng)
        row={'EN':(en_can,en_leg)}
        for l in LOC:
            full=ph=0
            for i in ids:
                n=best[i].get(l,0)
                if not n: continue
                ref=eng.get(i) or 3000
                if n>=0.4*ref and n>1500: full+=1
                else: ph+=1
            row[l]=(full,ph)
        out[f'{c}-L{lv}']=row
json.dump(out,open('/home/claude/tools/assess.json','w'))
for k,r in out.items():
    print(k,'EN',r['EN'],' '.join(f"{l}:{r[l][0]}/{r[l][1]}" for l in LOC))
