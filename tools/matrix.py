import json
S='/home/claude/l5work'
a=json.load(open(S+'/audit.json'))
pend=set(tuple(l.split()) for l in open(S+'/pending.txt'))
LOCS=['en-GB','es-419','es-Caribbean','es-ES','fr-CA','fr-FR','pt-BR','pt-PT','de','it','nl','ht']
COL=['RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK']
tot={'G':0,'P':0,'F':0,'R':0,'M':0}; rows=[]; need=[]
for L in range(1,6):
  for c in COL:
    k=f'{c}-L{L}'; v=a[k]; e=v['en']
    enp=(c in('RED','WHITE','PURPLE') and L==2)
    row=[]
    for loc in LOCS:
        s=v[loc]; ok=s.get('ok',0) if s else 0
        if (k,loc) in pend: st='P'
        elif s and ok>=50: st='G'
        elif s and ok>=40: st='F'
        elif s: st='R'
        else: st='M'
        tot[st]+=1; row.append(st)
        if st in 'FRM': need.append((L,c,loc,st,ok if s else 0))
    rows.append((k,e,enp,row))
print('KEY G=good on site P=delivered,not uploaded F=fix a few R=redo M=missing')
print(f"{'':10} EN   "+' '.join(f'{l[:5]:>5}' for l in LOCS))
for k,e,enp,row in rows:
    en='pend' if enp else ('tpl%d'%e['boil'] if e['boil'] else ('ok' if e['n']==50 else 'n%d'%e['n']))
    print(f'{k:10} {en:4} '+' '.join(f'{x:>5}' for x in row))
print(tot)
json.dump(need,open(S+'/need.json','w'))
import collections
bylvl=collections.Counter((n[0],n[3]) for n in need)
for L in range(1,6): print('L%d'%L,{s:bylvl[(L,s)] for s in 'FRM'})
