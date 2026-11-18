import zipfile,re,os,sys,json,collections,glob
repo,zdir,mode=sys.argv[1],sys.argv[2],sys.argv[3]  # mode: check|apply
LOCS={'en-GB','es-Caribbean','es-ES','fr-CA','fr-FR','pt-BR','pt-PT','de','it','it-IT','nl','ht'}
EN=set('the and of to is a in that for with this you are be or as'.split())
pat=re.compile(r'(?:^|/)([A-Z]+)-L([1-5])-(\d{3})\.([A-Za-z-]+)\.md$')
def body(t): return re.sub(r'^---\n.*?\n---\n','',t,flags=re.S)
report=collections.defaultdict(lambda: collections.Counter())
reasons=collections.defaultdict(collections.Counter)
written=[]
for zp in sorted(glob.glob(zdir+'/*.zip')):
    z=zipfile.ZipFile(zp)
    for n in z.namelist():
        if n.endswith('/'): continue
        if n.startswith('/') or '..' in n: reasons['?']['unsafe-path']+=1; continue
        m=pat.search(n)
        if m: c,l,num,loc=m.groups()
        else:
            m2=re.search(r'(?:^|/)([A-Z]+)/L([1-5])/([A-Za-z-]+)/([A-Z]+)-L([1-5])-(\d{3})\.md$',n)
            m3=re.search(r'(?:^|/)([A-Z]+)-L([1-5])-(\d{3})-([A-Za-z]{2}(?:-[A-Za-z]+)?)\.md$',n)
            if m2 and m2.group(1)==m2.group(4) and m2.group(2)==m2.group(5):
                c,l,loc,num=m2.group(1),m2.group(2),m2.group(3),m2.group(6)
            elif m3: c,l,num,loc=m3.groups()
            else: continue
        key=f'{c}-L{l} {loc}'
        if loc not in LOCS: reasons[key]['locale']+=1; continue
        lid=f'{c}-L{l}-{num}'
        t=z.read(n).decode('utf8','replace')
        fm=re.search(r'^---\n(.*?)\n---\n',t,re.S)
        idm=re.search(r'(?m)^id:\s*"?([A-Z]+-L\d-\d{3})"?\s*$',fm.group(1)) if fm else None
        if not idm or idm.group(1)!=lid: reasons[key]['id-mismatch']+=1; continue
        enp=f'{repo}/content/curriculum/{c}/L{l}/{lid}.md'
        if not os.path.exists(enp): reasons[key]['no-english']+=1; continue
        b=body(t); eb=body(open(enp,encoding='utf8').read())
        if len(b)<max(1500,0.4*len(eb)): reasons[key]['too-short']+=1; continue
        w=re.findall(r'[a-z]+',b.lower())
        if loc!='en-GB' and sum(x in EN for x in w)/max(1,len(w))>0.12: reasons[key]['mostly-english']+=1; continue
        paras=[p.strip() for p in b.split('\n\n') if len(p.strip())>120]
        if paras and collections.Counter(paras).most_common(1)[0][1]>=3: reasons[key]['template-repeat']+=1; continue
        dest=f'{repo}/content/curriculum/{c}/L{l}/{lid}.{loc}.md'
        if os.path.exists(dest): reasons[key]['exists']+=1; continue
        report[key]['ok']+=1
        if mode=='apply':
            open(dest,'w',encoding='utf8').write(t if t.endswith('\n') else t+'\n'); written.append(dest)
for k in sorted(set(report)|set(reasons)):
    print(f'{k:24} ok={report[k]["ok"]:3} {dict(reasons[k])}')
print('written',len(written))
