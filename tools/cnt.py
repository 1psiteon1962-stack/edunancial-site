import re,sys
C,L,B=sys.argv[1:4]
T={'pt-BR':('REGRA ESPECÍFICA DA REGIÃO','OPINIÃO','SUPOSIÇÃO/OPINIÃO'),'pt-PT':('REGRA ESPECÍFICA DA REGIÃO','OPINIÃO','SUPOSIÇÃO/OPINIÃO'),'it':('REGOLA SPECIFICA','OPINIONE','IPOTESI/OPINIONE'),'nl':('REGIOSPECIFIEKE REGEL','MENING','AANNAME/MENING'),'de':('LÄNDERSPEZIFISCHE REGEL','MEINUNG','ANNAHME/MEINUNG'),'ht':('RÈG ESPESIFIK POU REJYON AN','OPINYON','SIPOZISYON/OPINYON')}
r,o,s=T[L]; t=open(f'work/{C}-L5-{L}/b{B}.txt').read()
for m in re.finditer(r'===== (\S+)\n(.*?)(?=\n===== |\Z)',t,re.S):
    b=m.group(2); print(m.group(1)[-3:],'R',b.count(r),'O',b.count(o)-b.count(s),end=' | ')
print()
