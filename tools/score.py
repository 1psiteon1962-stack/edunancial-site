import sys,re,glob,os,collections
EN=set("the and of to is are you your that this with for what how why they their it be not can will have from when which would should does do if or on as at by an was more than its these those who".split())
root=sys.argv[1]
res=collections.OrderedDict()
for L in ["L1","L2","L3"]:
  for C in "RED WHITE BLUE GREEN GOLD PURPLE ORANGE BLACK".split():
    for loc in ["es-Caribbean","fr-CA"]:
      fs=sorted(glob.glob(f"{root}/{C}/{L}/{C}-{L}-*.{loc}.md"))
      if not fs: res[(C,L,loc)]="MISSING";continue
      en=[];dup=[];sz=[]
      for f in fs:
        t=open(f,encoding='utf-8').read().split('---',2)[-1]
        w=re.findall(r"[A-Za-z']+",t.lower())
        en.append(sum(x in EN for x in w)/max(1,len(w)))
        paras=[p.strip() for p in t.split('\n\n') if len(p.strip())>80]
        dup.append(1-len(set(paras))/max(1,len(paras)))
        sz.append(len(t))
      res[(C,L,loc)]=f"n={len(fs)} en%={100*sum(en)/len(en):4.1f} dup%={100*sum(dup)/len(dup):4.1f} avgchars={sum(sz)//len(sz)}"
for k,v in res.items(): print("-".join(k[:2]),k[2],v)
