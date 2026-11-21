import sys,re,zipfile
C,src,out=sys.argv[1:4]; TN={'RED':'Real Estate','WHITE':'Paper Assets','PURPLE':'Law'}[C]
t=open(src,encoding='utf-8').read()
parts=re.split(rf'^## ({C}-L2-\d{{3}})\s*$',t,flags=re.M)
got={}
for i in range(1,len(parts),2):
    lid=parts[i]; body=parts[i+1]
    body=re.sub(r"\n-{3,}\s*\n\*END OF.*$","",body.rstrip(),flags=re.S); body=re.sub(r"\n-{3,}\s*$","",body.rstrip())          # trailing separator
    body=re.split(r'\n#{1,2} (?!#)',body)[0]             # stop at any batch-level heading
    tm=re.search(r'^### (.+)$',body,re.M); title=tm.group(1).strip()
    n=int(lid[-3:])
    fm=f'---\nid: {lid}\ntrack: {C}\nofficialTrackName: {TN}\nlevel: 2\nlessonNumber: {n}\nlocale: en-US\ntitle: "{title.replace(chr(34),chr(39))}"\nversion: 1.0\nauthor: Waldemar M. Caban, JD MA\ndate: 2026-09-07\n---\n\n'
    got[lid]=fm+f'## {lid}'+body.rstrip()+'\n'
assert len(got)==50,(C,len(got))
with zipfile.ZipFile(f'{out}/{C}-L2-001-050-en-US.zip','w',zipfile.ZIP_DEFLATED) as z:
    for k in sorted(got): z.writestr(f'{k}.md',got[k])
print(C, min(len(v) for v in got.values()), max(len(v) for v in got.values()))
