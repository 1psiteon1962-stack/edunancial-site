import sys,re,glob,os
tr,loc=sys.argv[1],sys.argv[2]
d=f'work/{tr}-L1L-{loc}'
titles={}
for f in glob.glob(d+'/*.md'):
    titles[os.path.basename(f)[:11]]=re.search(r'^title: "(.*)"',open(f).read(),re.M).group(1)
n=0
for f in glob.glob(d+'/*.md'):
    L=open(f).read().split('\n')
    for i,l in enumerate(L):
        m=re.match(r'- ('+tr+r'-L1-\d{3}) — (.*)$',l)
        if m and m.group(1) in titles and m.group(2)!=titles[m.group(1)]:
            L[i]=f'- {m.group(1)} — {titles[m.group(1)]}'; n+=1
    open(f,'w').write('\n'.join(L))
print(loc,'fixed',n)
