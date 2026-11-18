import re,sys,glob
sys.path.insert(0,'/home/claude/tools')
src=open('/home/claude/tools/en_gb.py').read()
W=eval(re.search(r'W=(\{.*?\})\n',src,re.S).group(1))
def case(s,d): return d.upper() if s.isupper() else (d[0].upper()+d[1:] if s[0].isupper() else d)
pat=re.compile(r'\b('+'|'.join(sorted(map(re.escape,W),key=len,reverse=True))+r')\b',re.I)
EX={'size','sizes','sized','sizing','prize','prizes','seize','seized','seizes','seizing','capsize','outsized','oversized','downsize','downsized','downsizing','upsize','resize','resized','baize','maize','prized','citizen','citizens','wizard'}
iz=re.compile(r'\b([A-Za-z]+?)iz(e|es|ed|ing|ation|ations|er|ers)\b')
US=re.compile(r'FHA|\bVA\b|IRS|401\(k\)|Fannie|Freddie|U\.S\.|United States|Social Security|Medicare|Roth|IRA\b|W-2|1099|SBA|SEC\b|FDIC')
def conv_line(l):
    l=pat.sub(lambda m: case(m.group(0),W[m.group(0).lower()]),l)
    l=iz.sub(lambda m: m.group(0) if m.group(0).lower() in EX or len(m.group(1))<3 else m.group(1)+'is'+m.group(2),l)
    if not US.search(l):
        l=re.sub(r'\$(\d)',r'£\1',l)
        l=re.sub(r'\bdollars\b','pounds',l); l=re.sub(r'\bdollar\b','pound',l)
    return l
lvl=sys.argv[2]; repo=sys.argv[1]; n=0
for p in sorted(glob.glob(f'{repo}/content/curriculum/*/L{lvl}/*-L{lvl}-0[0-9][0-9].md')):
    t=open(p,encoding='utf8').read()
    m=re.match(r'^---\n(.*?)\n---\n',t,re.S); fm,body=m.group(1),t[m.end():]
    fm=re.sub(r'(?m)^(title|summary):\s*(.+)$',lambda mm: mm.group(1)+': '+conv_line(mm.group(2)),fm)
    fm=re.sub(r'(?m)^(locale|source_locale):.*\n?','',fm).rstrip()+'\nlocale: en-GB\nsource_locale: en-US'
    body='\n'.join(conv_line(l) for l in body.split('\n'))
    open(p[:-3]+'.en-GB.md','w',encoding='utf8').write(f'---\n{fm}\n---\n'+body); n+=1
print('written',n)
