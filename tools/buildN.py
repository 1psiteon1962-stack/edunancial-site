# build1.py COLOR LOCALE KEEP(e.g. 1-5 or none) -> zip of 50 L1 files
import sys,re,glob,zipfile,os
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
C,loc,keep=sys.argv[1:4]; L=os.environ.get('LV','1')
K=set() if keep=='none' else set(range(int(keep.split('-')[0]),int(keep.split('-')[1])+1))
ch={}
for b in sorted(glob.glob(f'{S}/work/{C}-L{L}-{loc}/*.txt')):
    for chunk in re.split(r'^=====\s*',open(b,encoding='utf-8').read(),flags=re.M)[1:]:
        lid,rest=chunk.split('\n',1); ch[lid.strip()]=rest
out={};miss=[]
fix=(lambda s:s.replace("'","’")) if loc.startswith('fr') else (lambda s:s)
for i in range(1,51):
    lid=f'{C}-L{L}-{i:03d}'
    if lid in ch:
        rest=ch[lid]
        title=fix(re.search(r'^TITLE:\s*(.+)$',rest,re.M).group(1).strip())
        summ=fix(re.search(r'^SUMMARY:\s*(.+)$',rest,re.M).group(1).strip())
        body=fix(rest[re.search(r'^#{1,3} ',rest,re.M).start():].rstrip()+'\n')
        en=open(f'{R}/{C}/L{L}/{lid}.md').read(); fm=en.split('---',2)[1].strip('\n').split('\n')
        q=lambda s:'"'+s.replace('"','\\"')+'"'
        nf=[]
        for l in fm:
            if l.startswith('title:'): nf.append('title: '+q(title))
            elif l.startswith('summary:'): nf.append('summary: '+q(summ))
            else: nf.append(l)
            if l.startswith('lessonNumber:'): nf.append(f'locale: {loc}')
        out[lid]='---\n'+'\n'.join(nf)+'\n---\n\n'+body
    elif i in K:
        out[lid]=open(f'{R}/{C}/L{L}/{lid}.{loc}.md').read()
    else: miss.append(lid)
print('have',len(out),'new',len([k for k in out if k in ch]),'missing',miss[:8])
if not miss:
    zp=f'{S}/out/{C}-L{L}-001-050-{loc}.zip'
    with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
        for k in sorted(out): z.writestr(f'{k}.{loc}.md',out[k])
    print(zp)
