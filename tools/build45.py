# build45.py COLOR LEVEL LOCALE -> zip of 50 translated L4/L5 files
import sys,re,glob,zipfile,os
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
C,L,loc=sys.argv[1:4]
ch={}
for b in sorted(glob.glob(f'{S}/work/{C}-{L}-{loc}/*.txt')):
    for chunk in re.split(r'^=====\s*',open(b,encoding='utf-8').read(),flags=re.M)[1:]:
        lid,rest=chunk.split('\n',1); ch[lid.strip()]=rest
fix=(lambda s:s.replace("'","’")) if loc.startswith('fr') else (lambda s:s)
out={};miss=[]
for i in range(1,51):
    lid=f'{C}-{L}-{i:03d}'
    if lid not in ch: miss.append(lid); continue
    rest=ch[lid]
    g=lambda k:fix(re.search(r'^'+k+r':\s*(.+)$',rest,re.M).group(1).strip())
    title,summ,kw=g('TITLE'),g('SUMMARY'),g('KEYWORDS')
    body=fix(rest[re.search(r'^# ',rest,re.M).start():].rstrip()+'\n')
    en=open(f'{R}/{C}/{L}/{lid}.md').read(); fm=en.split('---',2)[1].strip('\n').split('\n')
    slug=re.search(r'^Slug:\s*(.+)$',en,re.M); slug=slug.group(1).strip() if slug else ''
    q=lambda s:'"'+s.replace('\\','\\\\').replace('"','\\"')+'"'
    nf=[]
    for l in fm:
        if l.startswith('title:'): nf.append('title: '+q(title))
        elif l.startswith('summary:'): nf.append('summary: '+q(summ))
        else: nf.append(l)
        if l.startswith('lessonNumber:'): nf.append(f'locale: {loc}')
    hdr=(f'Filename: {lid}.{loc}.md\nFolder: {C}/{L}\nTitle: {title}\nLesson ID: {lid}\nAuthor: Waldemar M. Caban, JD MA\n'
         f'Meta Description: {summ}\nSEO Keywords: {kw}\nSlug: {slug}\n\n')
    out[lid]='---\n'+'\n'.join(nf)+'\n---\n'+hdr+body
print('have',len(out),'missing',len(miss),miss[:5])
if not miss or os.environ.get('PARTIAL'):
    zp=f'{S}/out/{C}-{L}-001-050-{loc}.zip' if not miss else f'{S}/out/partial.zip'
    with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
        for k in sorted(out): z.writestr(f'{k}.{loc}.md',out[k])
    print(zp)
