import zipfile,re,os,sys,glob
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
def norm(t):
    t=t.split('\n---\n',1)[-1]; t=re.sub(r'<!--.*?-->','',t,flags=re.S); return re.sub(r'\s+',' ',t).strip()
for z in sorted(glob.glob(sys.argv[1]+'/*.zip')):
    b=os.path.basename(z); m=re.match(r'([A-Z]+)-(L\d)-001-050-(.+)\.zip',b)
    if not m: continue
    c,l,loc=m.groups(); zf=zipfile.ZipFile(z); same=diff=miss=0
    for n in zf.namelist():
        p=f'{R}/{c}/{l}/{n}'
        if not os.path.exists(p): miss+=1; continue
        if norm(zf.read(n).decode())==norm(open(p,encoding='utf-8').read()): same+=1
        else: diff+=1
    print(f'{b:42} onsite_same={same:2} onsite_diff={diff:2} missing={miss:2}')
