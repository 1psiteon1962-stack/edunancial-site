import json,re,collections,sys
lv=sys.argv[1]
EN=set('the and of to is a in that for with this you are be or as'.split())
LOC=['en-GB','es-Caribbean','es-ES','fr-CA','fr-FR','pt-BR','pt-PT','de','it','nl']
good={'machine-validated','reviewed','canonical'}; tot=0; res={}
for c in ['RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK']:
  out=[]; res[c]={}
  try: en={r['id']:r for r in json.load(open(f'content/generated/curriculum-index/{c}/L{lv}/en-US.json'))}
  except FileNotFoundError: en={}
  for l in LOC:
    try: rows={r['id']:r for r in json.load(open(f'content/generated/curriculum-index/{c}/L{lv}/{l}.json'))}
    except FileNotFoundError: rows={}
    bad=[]
    for i in range(1,51):
      lid=f'{c}-L{lv}-{i:03d}'; r=rows.get(lid)
      if not r or r['status'] not in good: bad.append(i); continue
      b=r['body']; w=re.findall(r'[a-z]+',b.lower())
      if l!='en-GB' and w and sum(x in EN for x in w)/len(w)>0.12: bad.append(i); continue
      s=[x.strip() for x in re.split(r'(?<=[.!?])\s+',b) if len(x.strip())>40]
      paras=[p.strip() for p in b.split('\n\n') if len(p.strip())>120]
      if (s and 1-len(set(s))/len(s)>0.3) or (paras and collections.Counter(paras).most_common(1)[0][1]>=3): bad.append(i)
    res[c][l]=bad
    if bad: out.append(f'{l}:{len(bad)}'); tot+=len(bad)
  print(f'{c:7} EN:{len(en)}', ' '.join(out) or 'COMPLETE')
print(f'Level {lv} gaps:',tot)
json.dump(res,open(f'/home/claude/tools/gaps_L{lv}.json','w'))
