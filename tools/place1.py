# place1.py COLOR LOCALE [LEVEL] -> write lessons from work/<C>-L<lv>-<loc>/ batches directly into site repo (only those lesson IDs)
import sys,re,glob,os
S='/home/claude/l5work'; R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
C,loc=sys.argv[1:3]; lv=sys.argv[3] if len(sys.argv)>3 else '1'
fname=loc
ch={}
for b in sorted(glob.glob(f'{S}/work/fix/{C}-L{lv}-{loc}/*.txt')):
    for chunk in re.split(r'^=====\s*',open(b,encoding='utf-8').read(),flags=re.M)[1:]:
        lid,rest=chunk.split('\n',1); ch[lid.strip()]=rest
fix=(lambda s:s.replace("'","’")) if loc.startswith('fr') else (lambda s:s)
q=lambda s:'"'+s.replace('"','\\"')+'"'
n=0
for lid,rest in sorted(ch.items()):
    title=fix(re.search(r'^TITLE:\s*(.+)$',rest,re.M).group(1).strip())
    summ=fix(re.search(r'^SUMMARY:\s*(.+)$',rest,re.M).group(1).strip())
    body=fix(rest[re.search(r'^#{1,3} ',rest,re.M).start():].rstrip()+'\n')
    en=open(f'{R}/{C}/L{lv}/{lid}.md',encoding='utf-8').read(); fm=en.split('---',2)[1].strip('\n').split('\n')
    nf=[]
    for l in fm:
        if l.startswith('title:'): nf.append('title: '+q(title))
        elif l.startswith('summary:'): nf.append('summary: '+q(summ))
        elif l.startswith('locale:'): continue
        else: nf.append(l)
        if l.startswith('lessonNumber:'): nf.append(f'locale: {loc}')
        if l.startswith('title:') and not any(x.startswith('summary:') for x in fm): nf.append('summary: '+q(summ))
    tgt=f'{R}/{C}/L{lv}/{lid}.{fname}.md'
    if loc=='it' and not os.path.exists(tgt) and os.path.exists(f'{R}/{C}/L{lv}/{lid}.it-IT.md'): tgt=f'{R}/{C}/L{lv}/{lid}.it-IT.md'
    open(tgt,'w',encoding='utf-8').write('---\n'+'\n'.join(nf)+'\n---\n\n'+body); n+=1
print('placed',n,'files for',C,loc,'L'+lv)
