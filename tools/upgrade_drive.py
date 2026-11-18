import zipfile,re,os,sys,json,collections,glob
repo,zdir,mode=sys.argv[1:4]
LOCS={'en-GB','es-Caribbean','es-ES','fr-CA','fr-FR','pt-BR','pt-PT','de','it','it-IT','nl','ht'}
EN=set('the and of to is a in that for with this you are be or as'.split())
NAMES={'RED':'Real Estate','WHITE':'Paper Assets','BLUE':'Business','GREEN':'Taxes','GOLD':'Investing','PURPLE':'Law','ORANGE':'Sales & Marketing','BLACK':'Leadership'}
def split(t):
    m=re.match(r'^---\n(.*?)\n---\n',t,re.S)
    return (m.group(1),t[m.end():]) if m else (None,t)
def eng(b):
    w=re.findall(r'[a-z]+',b.lower()); return sum(x in EN for x in w)/max(1,len(w))>0.12
def ready(b,eb,loc): 
    return len(b)>=max(1500,0.4*len(eb)) and (loc=='en-GB' or not eng(b))
def q(v): return json.dumps(v,ensure_ascii=False)
stats=collections.defaultdict(collections.Counter)
for zp in sorted(glob.glob(zdir+'/*.zip')):
    z=zipfile.ZipFile(zp)
    for n in z.namelist():
        if n.endswith('/') or '..' in n or n.startswith('/'): continue
        m=(re.search(r'(?:^|/)([A-Z]+)-L([1-5])-(\d{3})\.([A-Za-z-]+)\.md$',n) or None)
        if m: c,l,num,loc=m.groups()
        else:
            m2=re.search(r'(?:^|/)([A-Z]+)/L([1-5])/([A-Za-z-]+)/([A-Z]+)-L([1-5])-(\d{3})\.md$',n)
            m3=re.search(r'(?:^|/)([A-Z]+)-L([1-5])-(\d{3})-([A-Za-z]{2}(?:-[A-Za-z]+)?)\.md$',n)
            if m2 and m2.group(1)==m2.group(4): c,l,loc,num=m2.group(1),m2.group(2),m2.group(3),m2.group(6)
            elif m3: c,l,num,loc=m3.groups()
            else: continue
        if loc not in LOCS: continue
        lid=f'{c}-L{l}-{num}'; key=f'{c}-L{l} {loc}'
        enp=f'{repo}/content/curriculum/{c}/L{l}/{lid}.md'
        if not os.path.exists(enp): stats[key]['no-english']+=1; continue
        _,eb=split(open(enp,encoding='utf8').read())
        new=z.read(n).decode('utf8','replace'); nfm,nb=split(new)
        if nfm:
            idm=re.search(r'(?m)^id:\s*"?([A-Z]+-L\d-\d{3})"?',nfm)
            if not idm or idm.group(1)!=lid: stats[key]['id-mismatch']+=1; continue
        else:
            h=re.search(r'(?m)^#\s*'+re.escape(lid)+r'\s*[:：]\s*(.+)$',nb)
            if not h: stats[key]['no-heading']+=1; continue
        if not ready(nb,eb,loc): stats[key]['new-not-ready']+=1; continue
        paras=[p.strip() for p in nb.split('\n\n') if len(p.strip())>120]
        if paras and collections.Counter(paras).most_common(1)[0][1]>=3: stats[key]['template']+=1; continue
        dest=f'{repo}/content/curriculum/{c}/L{l}/{lid}.{loc}.md'
        old=open(dest,encoding='utf8').read() if os.path.exists(dest) else None
        if old is not None:
            ofm,ob=split(old)
            if ready(ob,eb,loc): stats[key]['kept-existing-good']+=1; continue
        if nfm: out=new
        else:
            title=re.search(r'(?m)^#\s*'+re.escape(lid)+r'\s*[:：]\s*(.+)$',nb).group(1).strip()
            summ=None
            if old is not None and ofm:
                sm=re.search(r'(?m)^summary:\s*(.+)$',ofm); summ=sm.group(1).strip() if sm else None
            if not summ:
                para=next((p for p in nb.split('\n\n') if len(p)>80 and not p.lstrip().startswith(('#','-','1.','*'))),'')
                para=re.sub(r'\*[^*]+\*\s*:?','',para).strip(); s=re.split(r'(?<=[.!?])\s',para)[0][:240]; summ=q(s)
            fm=f"id: {lid}\ntrack: {c}\nofficialTrackName: {q(NAMES[c])}\nlevel: {int(l)}\nlessonNumber: {int(num)}\nlocale: {loc}\nsource_locale: en-US\ntitle: {q(title)}\nsummary: {summ}\nversion: \"1.0\"\nauthor: \"Waldemar M. Caban, JD MA\""
            out=f'---\n{fm}\n---\n\n'+nb.lstrip()
        stats[key]['replaced' if old is not None else 'added']+=1
        if mode=='apply': open(dest,'w',encoding='utf8').write(out if out.endswith('\n') else out+'\n')
for k in sorted(stats): print(f'{k:22}',dict(stats[k]))
