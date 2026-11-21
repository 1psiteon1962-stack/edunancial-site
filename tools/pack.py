import sys,re,os,zipfile,glob
# usage: pack.py COLOR LEVEL LOCALE OUTDIR files...
C,L,loc,out=sys.argv[1:5]; files=sys.argv[5:]
got={}
for f in files:
    m=re.search(rf'{C}-{L}-(\d{{3}})',os.path.basename(f))
    if not m: continue
    t=open(f,encoding='utf-8').read()
    if re.search(r'^locale:.*$',t,re.M): t=re.sub(r'^locale:.*$',f'locale: {loc}',t,count=1,flags=re.M)
    else: t=t.replace('\n---',f'\nlocale: {loc}\n---',1)
    got[m.group(1)]=t
assert len(got)==50,(C,L,loc,len(got),sorted(set(f'{i:03d}' for i in range(1,51))-set(got)))
zp=f'{out}/{C}-{L}-001-050-{loc}.zip'
with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
    for n,t in sorted(got.items()): z.writestr(f'{C}-{L}-{n}.{loc}.md',t)
print(zp)
