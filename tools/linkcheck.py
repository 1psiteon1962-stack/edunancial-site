import sys,re,glob,os
tr,loc=sys.argv[1],sys.argv[2]
d=f'work/{tr}-L1L-{loc}'
titles={}
for f in glob.glob(d+'/*.md'):
    m=re.search(r'^title: "(.*)"',open(f).read(),re.M); titles[os.path.basename(f)[:11]]=m.group(1)
bad=0
for f in sorted(glob.glob(d+'/*.md')):
    for i,l in enumerate(open(f),1):
        m=re.match(r'- ('+tr+r'-L1-\d{3}) — (.*)$',l.rstrip())
        if m and m.group(1) in titles and m.group(2)!=titles[m.group(1)]:
            bad+=1; print(os.path.basename(f),i,m.group(1),'|',m.group(2),'≠',titles[m.group(1)])
print(loc,'link mismatches',bad)
