import sys,re,glob,collections
EN=set("the and of to is are you your that this with for what how why they their it be not can will have from when which would should does do if or on as at by an was more than its these those who".split())
TPL=["Aplicación 1","Application 1","convertir el concepto en una decisión observable","[[","TODO","placeholder","Lorem","coming soon"]
groups=collections.defaultdict(list)
for f in sys.argv[1:]:
  m=re.search(r'([A-Z]+-L\d)-\d{3}',f); groups[m.group(1)].append(f)
for g,fs in sorted(groups.items()):
  en=[];dup=[];sz=[];tpl=0;titles=set()
  for f in fs:
    t=open(f,encoding='utf-8').read()
    tm=re.search(r'^title:\s*(.*)$',t,re.M); titles.add(tm.group(1) if tm else None)
    b=t.split('---',2)[-1]
    w=re.findall(r"[A-Za-z']+",b.lower()); en.append(sum(x in EN for x in w)/max(1,len(w)))
    p=[x.strip() for x in b.split('\n\n') if len(x.strip())>80]; dup.append(1-len(set(p))/max(1,len(p)))
    sz.append(len(b)); tpl+=any(s in b for s in TPL)
  print(f"{g:10} n={len(fs)} en%={100*sum(en)/len(en):4.1f} dup%={100*sum(dup)/len(dup):4.1f} avg={sum(sz)//len(sz)} min={min(sz)} tplhits={tpl} uniqTitles={len(titles)}")
