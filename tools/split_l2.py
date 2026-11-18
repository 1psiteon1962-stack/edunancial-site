import re,sys,os,json
repo=sys.argv[1]
TR={'RED':'Real Estate','WHITE':'Paper Assets','PURPLE':'Law'}
report={}
for color,name in TR.items():
    src=f"{repo}/content/courses/{color.lower()}/level-2/en_us/full-50-lessons-{color.lower()}-l2-full-50-lessons.md"
    text=open(src,encoding='utf8').read()
    parts=re.split(rf'(?m)^## ({color}-L2-\d{{3}})\s*$',text)
    outdir=f"{repo}/content/curriculum/{color}/L2"; os.makedirs(outdir,exist_ok=True)
    made,skipped=[],[]
    for i in range(1,len(parts),2):
        lid=parts[i]; body=parts[i+1]
        # cut at a following top-level heading that isn't part of the lesson
        body=re.split(r'(?m)^# ',body)[0]
        body=re.sub(r'(\s*\n---\s*)+\s*$','',body.rstrip())+'\n'
        m=re.search(r'(?m)^### (.+)$',body); title=m.group(1).strip()
        cc=re.search(r'\*\*2\. Core Content\*\*\s*\n(.+?)(?:\n\n|\Z)',body,re.S)
        summ=''
        if cc:
            s=re.split(r'(?<=[.!?])\s',cc.group(1).strip())[0]
            summ=s if len(s)<=240 else s[:237].rsplit(' ',1)[0]+'...'
        path=f"{outdir}/{lid}.md"
        if os.path.exists(path): skipped.append(lid); continue
        n=int(lid[-3:])
        q=lambda v: json.dumps(v,ensure_ascii=False)
        fm=f"---\nid: {lid}\ntrack: {color}\nofficialTrackName: {q(name)}\nlevel: 2\nlessonNumber: {n}\ntitle: {q(title)}\nsummary: {q(summ)}\nversion: \"1.0\"\nauthor: \"Waldemar M. Caban, JD MA\"\ndate: \"2026-11-13\"\n---\n\n"
        open(path,'w',encoding='utf8').write(fm+f"## {lid}\n"+body.lstrip('\n'))
        made.append(lid)
    report[color]={'created':len(made),'skipped_existing':skipped}
print(json.dumps(report,indent=1))
