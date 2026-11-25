# pcheckL.py C LOC [FROM TO] : check long-format L1 lessons in work/<C>-L1L-<LOC>/ against English source
import sys,re,glob,os
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
C,LOC=sys.argv[1],sys.argv[2]
W=f'/home/claude/l5work/work/{C}-L1L-{LOC}'
TF={'true','false','wahr','falsch','vero','falso','waar','onwaar','juist','onjuist','verdadeiro','verdadero','richtig'}
def fm(t):
    m=re.match(r'^---\n(.*?)\n---\n',t,re.S); return m.group(1) if m else None
def secs(t):
    parts=re.split(r'^## ',t,flags=re.M); return parts
def section_by_code(t,code):
    i=t.find('`'+code+'`')
    if i<0: return ''
    j=t.find('\n## ',i); return t[i:j if j>0 else len(t)]
def items(s):
    return re.findall(r'^(\d+)\. (.*)$',s,re.M)
def opts(line): return re.findall(r'(?:^|\s)([A-D])\) ',line)
def keyval(line):
    m=re.match(r'\*\*[^*]+:\*\*\s*([^.*]+)',line)
    if not m: return None
    v=m.group(1).strip()
    if re.fullmatch(r'[A-D]',v): return v
    w=v.lower()
    if w in TF: return 'T' if w in ('true','wahr','vero','waar','juist','verdadeiro','verdadero','richtig') else 'F'
    return 'TXT'
probs=[];n=0
files=sorted(glob.glob(f'{W}/*.md'))
for f in files:
    lid=os.path.basename(f).split('.')[0]
    en=open(f'{R}/{C}/L1/{lid}.md').read(); tr=open(f).read(); n+=1
    p=[]
    F=fm(tr)
    if not F: p.append('no frontmatter')
    else:
        for k in ['id','track','officialTrackName','level','lessonNumber','locale','title','summary','version','author','date']:
            if not re.search(rf'^{k}:',F,re.M): p.append('fm missing '+k)
        if not re.search(rf'^locale: {re.escape(LOC)}$',F,re.M): p.append('locale wrong')
        if not re.search(rf'^id: {lid}$',F,re.M): p.append('id wrong')
    for pat,name in [(r'^## ','H2'),(r'^### ','H3'),(r'^---$','hr')]:
        a,b=len(re.findall(pat,en,re.M)),len(re.findall(pat,tr,re.M))
        if a!=b: p.append(f'{name} {b}!={a}')
    ce=re.findall(r'`([A-Z]+-L1-\d{3}-[A-Z-]+)`',en); ct=re.findall(r'`([A-Z]+-L1-\d{3}-[A-Z-]+)`',tr)
    if ce!=ct: p.append(f'codes {ct}!={ce}')
    ae=items(section_by_code(en,f'{lid}-ASSESSMENT')); at=items(section_by_code(tr,f'{lid}-ASSESSMENT'))
    if len(ae)!=len(at): p.append(f'assess n {len(at)}!={len(ae)}')
    else:
        for (i,x),(j,y) in zip(ae,at):
            if opts(x)!=opts(y): p.append(f'assess q{i} opts {opts(y)}!={opts(x)}')
    ke=items(section_by_code(en,f'{lid}-ANSWER-KEY')); kt=items(section_by_code(tr,f'{lid}-ANSWER-KEY'))
    if len(ke)!=len(kt): p.append(f'key n {len(kt)}!={len(ke)}')
    else:
        for (i,x),(j,y) in zip(ke,kt):
            a,b=keyval(x),keyval(y)
            if a!=b and not (a=='TXT' and b=='TXT'): p.append(f'key q{i} {b}!={a}')
    soc_e=len(re.findall(r'^\d+\. \*\*',section_by_code(en,f'{lid}-SOCRATIC'),re.M)); soc_t=len(re.findall(r'^\d+\. \*\*',section_by_code(tr,f'{lid}-SOCRATIC'),re.M))
    if soc_e!=soc_t: p.append(f'socratic {soc_t}!={soc_e}')
    be=len(re.findall(r'^- ',en,re.M)); bt=len(re.findall(r'^- ',tr,re.M))
    if be!=bt: p.append(f'bullets {bt}!={be}')
    me=len(re.findall(r'\[[^\]]+\]',en)); mt=len(re.findall(r'\[[^\]]+\]',tr))
    if me!=mt: p.append(f'markers {mt}!={me}')
    if len(tr)<0.8*len(en): p.append(f'short {len(tr)}/{len(en)}')
    if p: probs.append((lid,p))
for lid,p in probs: print(lid,'; '.join(p))
print(f'{C}-L1L {LOC} n={n} problems={len(probs)}')
