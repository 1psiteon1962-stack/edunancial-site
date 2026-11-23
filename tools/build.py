# build.py COLOR LEVEL LOCALE  -> assembles work/<C>-<L>-<loc>/*.txt batches into zip
import sys,re,glob,zipfile,os
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C,L,loc=sys.argv[1:4]
TN={'RED':'Real Estate','WHITE':'Paper Assets','BLUE':'Business','GREEN':'Taxes','GOLD':'Investing','PURPLE':'Law','ORANGE':'Sales & Marketing','BLACK':'Leadership'}[C]
out={}
for b in sorted(glob.glob(f'{S}/work/{C}-{L}-{loc}/*.txt')):
    for chunk in re.split(r'^=====\s*',open(b,encoding='utf-8').read(),flags=re.M)[1:]:
        lid,rest=chunk.split('\n',1); lid=lid.strip('= \n')
        title=re.search(r'^TITLE:\s*(.+)$',rest,re.M).group(1).strip()
        summ=re.search(r'^SUMMARY:\s*(.+)$',rest,re.M).group(1).strip()
        mm=re.search(r'^#{1,2} '+re.escape(lid),rest,re.M) or re.search(r'^#{1,3} ',rest,re.M); body=rest[mm.start():].rstrip()+'\n'
        n=int(lid[-3:]); q=lambda s:s.replace('"','\\"')
        fm=(f'---\nid: {lid}\ntrack: {C}\nofficialTrackName: "{TN}"\nlevel: {L[1:]}\nlessonNumber: {n}\n'
            f'title: "{q(title)}"\nsummary: "{q(summ)}"\nversion: "1.0"\nauthor: "Waldemar M. Caban, JD MA"\n'
            f'date: "2026-10-28"\nlocale: "{loc}"\nsource_locale: "en-US"\n---\n')
        out[lid]=fm+body
missing=[f'{C}-{L}-{i:03d}' for i in range(1,51) if f'{C}-{L}-{i:03d}' not in out]
print('have',len(out),'missing',missing[:10],'...' if len(missing)>10 else '')
if not missing:
    zp=f'{S}/out/{C}-{L}-001-050-{loc}.zip'
    with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
        for k in sorted(out): z.writestr(f'{k}.{loc}.md',out[k])
    print(zp)
